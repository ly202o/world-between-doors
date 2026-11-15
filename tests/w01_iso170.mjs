/* v0.17.0 专项：默认视角就是等距
   跑法：bash /d/temp/run_with_edge.sh /d/temp/w01_iso170.mjs
   前置：world01 目录里起 python -m http.server 8779
   重点不是"能不能切到等距"，是"进来那一刻就已经在等距上"——
   不留从自由视角缓动过来的开场旋转（加载后第一秒镜头在慢慢转，看着像卡了一下）。 */
const list = await (await fetch('http://127.0.0.1:9230/json/list')).json();
const page = list.filter(t => t.type === 'page').pop();
const ws = new WebSocket(page.webSocketDebuggerUrl);
let id = 0; const pend = new Map(); const errs = []; const fails = [];
const send = (m, p = {}) => new Promise(r => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method: m, params: p })); });
ws.addEventListener('message', e => { const m = JSON.parse(e.data);
  if (m.method === 'Runtime.exceptionThrown') errs.push((m.params.exceptionDetails.text || '') + ' ' + ((m.params.exceptionDetails.exception?.description || '').split('\n')[0]));
  if (m.id && pend.has(m.id)) { pend.get(m.id)(m); pend.delete(m.id); } });
await new Promise(r => ws.addEventListener('open', r));
const ev = async (x) => { const r = await send('Runtime.evaluate', { expression: x, returnByValue: true, awaitPromise: true });
  if (r.result?.exceptionDetails) return 'ERR:' + r.result.exceptionDetails.exception?.description;
  return r.result?.result?.value; };
const sleep = ms => new Promise(r => setTimeout(r, ms));
let n = 0, pass = 0;
function ok(name, cond, info) {
  n++;
  if (cond) { pass++; console.log('  ✓ ' + name + (info !== undefined ? '  [' + info + ']' : '')); }
  else { fails.push(name + (info !== undefined ? ' [' + info + ']' : '')); console.log('  ✗ ' + name + (info !== undefined ? '  [' + info + ']' : '')); }
}
const near = (a, b, t) => Math.abs(a - b) <= t;
const num = async (x) => { const v = await ev(x); return typeof v === 'number' ? v : NaN; };
const iso = async () => JSON.parse(await ev('JSON.stringify(window.__world.iso)'));
const V = async (k) => { await ev('window.dispatchEvent(new KeyboardEvent("keydown",{key:"' + k + '"}))');
  await ev('window.dispatchEvent(new KeyboardEvent("keyup",{key:"' + k + '"}))'); };
const deg = r => ((r * 180 / Math.PI) % 360 + 360) % 360;

await send('Page.enable'); await send('Runtime.enable');

/* 逐帧采样器：在文档创建前注入，每帧记一次 yaw/pitch/机距。
   只看"某一刻的值"证明不了没有缓动——值可能刚到也可能正走在路上；
   看整段轨迹的最大偏移才能证明"从第一帧起就没动过"。 */
await send('Page.addScriptToEvaluateOnNewDocument', { source: `
window.__samples = [];
(function loop(){
  if (window.__world && window.__world.iso && typeof window.__camYaw === 'number'
      && typeof window.__camPitch === 'number') {
    window.__samples.push([window.__camYaw, window.__camPitch, window.__world.iso.distCur, window.__world.iso.distTarget]);
  }
  requestAnimationFrame(loop);
})();
` });
await send('Page.navigate', { url: 'http://127.0.0.1:8779/world01.html?s=' + Date.now() });

let booted = false;
for (let i = 0; i < 200; i++) {
  if ((await ev('typeof window.__world === "object"')) === true) { booted = true; break; }
  await sleep(50);
}
await sleep(1800);   /* 让采样器收满两秒的帧 */

console.log('\n【1】进场那一刻就在等距上（不是缓动过去的）');
ok('世界已启动', booted === true);
ok('无未捕获异常', errs.length === 0, errs.join(' | ') || 'none');
const s0 = await iso();
ok('默认档 = 3（等距）', (await num('window.__world.viewMode')) === 3, 'viewMode=' + (await num('window.__world.viewMode')));
ok('已用正交相机', s0.isOrtho === true, s0.active);
const tr = JSON.parse(await ev(`(() => {
  const s = window.__samples || [];
  if (!s.length) return JSON.stringify({ n: 0 });
  const d = a => ((a * 180 / Math.PI) % 360 + 360) % 360;
  const ys = s.map(x => d(x[0])), ps = s.map(x => d(x[1]));
  return JSON.stringify({ n: s.length, yMin: Math.min(...ys), yMax: Math.max(...ys),
    pMin: Math.min(...ps), pMax: Math.max(...ps), distMaxDev: Math.max(...s.map(x => Math.abs(x[2] - x[3]))) });
})()`));
ok('采样器收到帧（软件渲染慢，够覆盖进场那半秒就行）', tr.n >= 12, tr.n + ' 帧');
ok('方位全程都在 45°（没有从 0° 转过来）', tr.yMax - tr.yMin < 0.3 && near(tr.yMin, 45, 0.3),
   tr.yMin.toFixed(2) + '° ~ ' + tr.yMax.toFixed(2) + '°');
ok('仰角全程都在 35.264°（没有从 0.30rad 爬上来）', tr.pMax - tr.pMin < 0.3 && near(tr.pMin, deg(s0.pitchTarget), 0.3),
   tr.pMin.toFixed(2) + '° ~ ' + tr.pMax.toFixed(2) + '°');
ok('机距全程贴着目标（没有从别的距离飘过来）', tr.distMaxDev < 0.05, '最大偏差 ' + tr.distMaxDev.toFixed(4) + 'm');

await sleep(3000);
console.log('\n【2】三秒后状态没动（进场不是"先到再跑"）');
const s1 = await iso();
ok('仰角仍 = 目标', near(s1.pitchNow, s1.pitchTarget, 0.001), deg(s1.pitchNow).toFixed(3) + '°');
ok('机距仍 = 目标', near(s1.distCur, s1.distTarget, 0.01), s1.distCur.toFixed(2) + ' vs ' + s1.distTarget.toFixed(2));
ok('方位仍 45°', near(deg(await num('window.__camYaw')), 45, 0.05), deg(await num('window.__camYaw')).toFixed(2) + '°');
ok('视锥半高 = 机距×tan(FOV/2)', near(s1.halfH, s1.expectHalfH, 0.02), s1.halfH.toFixed(3) + ' vs ' + s1.expectHalfH.toFixed(3));
ok('半高 = 取景高度/2', near(s1.halfH, s1.viewH / 2, 0.05), s1.halfH.toFixed(2) + ' / ' + (s1.viewH / 2).toFixed(2));

console.log('\n【3】正交的本质还在：远处不变小');
const proof = await ev(`(() => {
  const cam = window.__world.activeCamObj;
  const s = (x1,y1,z1,x2,y2,z2) => {
    const p = new THREE.Vector3(x1,y1,z1).project(cam);
    const q = new THREE.Vector3(x2,y2,z2).project(cam);
    return Math.hypot((q.x-p.x)*innerWidth/2, (q.y-p.y)*innerHeight/2);
  };
  return JSON.stringify({ near1m: s(0,1,0,0,2,0), far1m: s(0,1,-60,0,2,-60) });
})()`);
const p = JSON.parse(proof);
ok('竖直 1m：身边 = 60m 外', near(p.near1m, p.far1m, 0.6), p.near1m + ' px vs ' + p.far1m + ' px');

console.log('\n【4】界面说的和实际一致');
await ev('window.__forceTouchUI()');
await sleep(200);
ok('视角键显示「等距」', (await ev('document.getElementById("viewBtn").textContent')) === '等距',
   await ev('document.getElementById("viewBtn").textContent'));
ok('45° 锁定键藏起来了（那是自由视角的）', (await ev('document.getElementById("lockBtn").style.display')) === 'none',
   await ev('document.getElementById("lockBtn").style.display'));
const tip = await ev('document.getElementById("tip").textContent');
ok('说明里四种视角都列了', /等距/.test(tip) && /自由/.test(tip), tip.slice(0, 40) + '…');

console.log('\n【5】从这个默认档能正常往下走');
const before = await num('window.__world.viewMode');
await V('v'); await sleep(900);
ok('V 一次 → 第一人称', (await num('window.__world.viewMode')) === 0, before + ' → ' + (await num('window.__world.viewMode')));
ok('投影换回透视', (await iso()).isOrtho === false);
for (let i = 0; i < 3; i++) { await V('v'); await sleep(500); }
ok('再按三次回到等距（四档闭环）', (await num('window.__world.viewMode')) === 3, 'viewMode=' + (await num('window.__world.viewMode')));
await sleep(1400);
ok('回到等距后仰角归位', near((await iso()).pitchNow, (await iso()).pitchTarget, 0.02),
   deg((await iso()).pitchNow).toFixed(2) + '°');

console.log('\n【6】转屏后仍然对齐（isoSnap 只在开局用，转屏靠 resize）');
await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
await sleep(900);
const sp = await iso();
ok('竖屏也是纵向覆盖 28m', near(sp.viewH, 28, 0.01), sp.viewH.toFixed(2) + 'm');
ok('竖屏视锥仍与机位对齐', near(sp.halfH, sp.expectHalfH, 0.02), sp.halfH.toFixed(3) + ' vs ' + sp.expectHalfH.toFixed(3));
ok('竖屏仍是正交', sp.isOrtho === true);
ok('竖屏没有未捕获异常', errs.length === 0, errs.join(' | ') || 'none');
await send('Emulation.clearDeviceMetricsOverride');
await sleep(600);

console.log('\n【7】竖屏冷启动也直接落位');
await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
await send('Page.navigate', { url: 'http://127.0.0.1:8779/world01.html?s=' + Date.now() });
await sleep(4500);
const sp2 = await iso();
ok('竖屏冷启动：默认档 = 等距', (await num('window.__world.viewMode')) === 3);
ok('竖屏冷启动：仰角已到位', near(sp2.pitchNow, sp2.pitchTarget, 0.05), deg(sp2.pitchNow).toFixed(2) + '°');
ok('竖屏冷启动：机距已到位', near(sp2.distCur, sp2.distTarget, 0.02), sp2.distCur.toFixed(2) + ' vs ' + sp2.distTarget.toFixed(2));
ok('竖屏冷启动：方位 = 45°', near(deg(await num('window.__camYaw')), 45, 0.05), deg(await num('window.__camYaw')).toFixed(2) + '°');
ok('竖屏冷启动：无异常', errs.length === 0, errs.join(' | ') || 'none');
await send('Emulation.clearDeviceMetricsOverride');

console.log('\n' + (fails.length ? '✗ 失败 ' + fails.length + ' 项:\n  - ' + fails.join('\n  - ') : '✓ 全部通过') + '\n通过 ' + pass + '/' + n);
ws.close();
