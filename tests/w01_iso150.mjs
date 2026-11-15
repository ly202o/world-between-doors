/* v0.15.0 等距视角专项（第 4 档视角）
   跑法：bash /d/temp/run_with_edge.sh /d/temp/w01_iso150.mjs
   前置：world01 目录里起 python -m http.server 8779 */
const list = await (await fetch('http://127.0.0.1:9230/json/list')).json();
const page = list.filter(t => t.type === 'page').pop();
const ws = new WebSocket(page.webSocketDebuggerUrl);
let id = 0; const pend = new Map(); const errs = []; const fails = [];
const send = (m, p = {}) => new Promise(r => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method: m, params: p })); });
ws.addEventListener('message', e => { const m = JSON.parse(e.data);
  if (m.method === 'Runtime.exceptionThrown') errs.push((m.params.exceptionDetails.text||'') + ' ' + ((m.params.exceptionDetails.exception?.description||'').split('\n')[0]));
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
const frames = async () => await num('window.__world.frameCount');
const V = async (k) => { await ev('window.dispatchEvent(new KeyboardEvent("keydown",{key:"' + k + '"}))');
  await ev('window.dispatchEvent(new KeyboardEvent("keyup",{key:"' + k + '"}))'); };
const deg = r => ((r * 180 / Math.PI) % 360 + 360) % 360;

await send('Page.enable'); await send('Runtime.enable');
await send('Page.navigate', { url: 'http://127.0.0.1:8779/world01.html?s=' + Date.now() });
await sleep(6000);

console.log('\n【0】开局就是等距（v0.17.0 起默认档）');
ok('无未捕获异常', errs.length === 0, errs.join(' | ') || 'none');
ok('版本格式合法（不锁死小版本）', /^v0\.\d+\.\d+$/.test(await ev('window.__worldVersion')), await ev('window.__worldVersion'));
ok('默认档 = 3（等距）', (await num('window.__world.viewMode')) === 3);
ok('开局就是正交相机', (await iso()).isOrtho === true);

console.log('\n【1】投影真的换成正交了');
await sleep(400);
let s = await iso();
ok('viewMode = 3（等距）', (await num('window.__world.viewMode')) === 3);
ok('iso.on', s.on === true);
ok('renderer 在用正交相机', s.active === 'ortho' && s.isOrtho === true, s.active);
ok('仰角收敛到 35.264°', near(s.pitchNow, s.pitchTarget, 0.02), deg(s.pitchNow).toFixed(3) + '°');
ok('仰角常量 = atan(1/√2)', near(s.pitchTarget, Math.atan(1 / Math.SQRT2), 1e-9), deg(s.pitchTarget).toFixed(4) + '°');
ok('机距已到达目标', near(s.distCur, s.distTarget, 0.2), s.distCur.toFixed(2) + ' / ' + s.distTarget.toFixed(2));
ok('视锥半高 = 机距×tan(FOV/2)', near(s.halfH, s.expectHalfH, 0.02), s.halfH.toFixed(3) + ' vs ' + s.expectHalfH.toFixed(3));
ok('半高 = 取景高度/2', near(s.halfH, s.viewH / 2, 0.05), s.halfH.toFixed(2) + ' / ' + (s.viewH / 2).toFixed(2));

console.log('\n【2】正交的本质：远处不变小（透视永远做不到这条）');
const proof = await ev(`(() => {
  const cam = window.__world.activeCamObj;
  const s = (x1,y1,z1,x2,y2,z2) => {
    const p = new THREE.Vector3(x1,y1,z1).project(cam);
    const q = new THREE.Vector3(x2,y2,z2).project(cam);
    return Math.hypot((q.x-p.x)*innerWidth/2, (q.y-p.y)*innerHeight/2);
  };
  return JSON.stringify({
    near1m: +s(0,0,0, 0,1,0).toFixed(3),
    far1m:  +s(0,0,-60, 0,1,-60).toFixed(3),
    nearBox: +s(0,0,0, 1,0,0).toFixed(3),
    farBox:  +s(0,0,-60, 1,0,-60).toFixed(3)
  });
})()`);
console.log('    屏幕像素长度：', proof);
let p = JSON.parse(proof);
ok('竖直 1m：近处 = 60m 外', near(p.near1m, p.far1m, 0.6), p.near1m + ' px vs ' + p.far1m + ' px');
ok('水平 1m：近处 = 60m 外', near(p.nearBox, p.farBox, 0.6), p.nearBox + ' px vs ' + p.farBox + ' px');

/* v0.18.0 起方位是两级档：Q/E 走 15° 细档，Shift+Q/E 与拖动走 90° 粗档。
   idx 是**细档**序号（0..23），方位 = 45° + idx×15°；idx 是 6 的倍数时才是真等距方位。 */
/* v0.21.0：Q/E 只在自由模式生效，先切过去 */
await V('g'); await sleep(400);
ok('前置：已切到自由（Q/E 才生效）', (await iso()).free === true);

console.log('\n【3】方位两级档：Q/E 15° 细调，Shift+Q/E 90° 粗调，俯角全程不动');
await ev('window.__world.setIso(12)'); await sleep(1500);
ok('idx=12 → 225°', near(deg(await num('window.__camYaw')), 225, 1.5), deg(await num('window.__camYaw')).toFixed(1) + '°');
await ev('window.__world.setIso(0)'); await sleep(1500);
ok('idx=0 → 45°', near(deg(await num('window.__camYaw')), 45, 1.5), deg(await num('window.__camYaw')).toFixed(1) + '°');
await V('q'); await sleep(1500);
s = await iso();
ok('Q 一按走一格细档（0→1）', s.yawIdx === 1, 'yawIdx=' + s.yawIdx);
ok('细档一按 = 15°（45 → 60）', near(deg(await num('window.__camYaw')), 60, 0.5), deg(await num('window.__camYaw')).toFixed(1) + '°');
ok('俯角没被 Q 带偏', near(s.pitchNow, s.pitchTarget, 0.02), deg(s.pitchNow).toFixed(3) + '°');
ok('细档下标成「非真等距」', s.exact === false, 'exact=' + s.exact);
await V('e'); await sleep(1200);
ok('E 一按退回（1→0）', (await iso()).yawIdx === 0);
/* Shift+Q：一次跨 6 个细档 = 90°。合成事件里显式带 shiftKey。 */
await ev(`window.dispatchEvent(new KeyboardEvent('keydown',{key:'Q',shiftKey:true}));
          window.dispatchEvent(new KeyboardEvent('keyup',{key:'Q',shiftKey:true})); 1`);
await sleep(1500);
s = await iso();
ok('Shift+Q 一按走 90°（0→6）', s.yawIdx === 6, 'yawIdx=' + s.yawIdx);
ok('idx=6 → 135°', near(deg(await num('window.__camYaw')), 135, 0.5), deg(await num('window.__camYaw')).toFixed(1) + '°');
ok('粗档下标成「真等距」', s.exact === true, 'exact=' + s.exact);
await ev('window.__world.setIso(0)'); await sleep(1200);

console.log('\n【4】滚轮改的是取景高度');
const h0 = (await iso()).halfH;
await ev(`window.dispatchEvent(new WheelEvent('wheel',{deltaY:300,bubbles:true,cancelable:true}))`);
await sleep(1500);
s = await iso();
ok('下滚 = 拉远（半高变大）', s.halfH > h0 + 0.3, h0.toFixed(2) + ' → ' + s.halfH.toFixed(2));
ok('拉远后视锥仍与机位对齐', near(s.halfH, s.expectHalfH, 0.02), s.halfH.toFixed(3) + ' vs ' + s.expectHalfH.toFixed(3));
const h1 = s.halfH;
await ev(`window.dispatchEvent(new WheelEvent('wheel',{deltaY:-700,bubbles:true,cancelable:true}))`);
await sleep(1500);
s = await iso();
ok('上滚 = 拉近（半高变小）', s.halfH < h1 - 0.3, h1.toFixed(2) + ' → ' + s.halfH.toFixed(2));
await ev('window.__world.setIso(0, 24)'); await sleep(1200);

console.log('\n【5】等距下世界照样能玩');
await ev('document.activeElement && document.activeElement.blur && document.activeElement.blur()');
const p0 = JSON.parse(await ev('JSON.stringify({x:window.__world.P.pos.x,z:window.__world.P.pos.z})'));
await ev('window.dispatchEvent(new KeyboardEvent("keydown",{key:"w"}))');
await sleep(1300);
await ev('window.dispatchEvent(new KeyboardEvent("keyup",{key:"w"}))');
await sleep(300);
const p1 = JSON.parse(await ev('JSON.stringify({x:window.__world.P.pos.x,z:window.__world.P.pos.z})'));
const moved = Math.hypot(p1.x - p0.x, p1.z - p0.z);
ok('等距里按 W 能走', moved > 1.0, moved.toFixed(2) + 'm');
ok('等距下角色可见（不是空镜）', (await num('window.__world.skinVisible ? 1 : 0')) === 1);
ok('走路期间无异常', errs.length === 0, errs.join(' | ') || 'none');
const off = await num('Math.hypot(window.__world.camera.position.x-window.__world.P.pos.x, window.__world.camera.position.z-window.__world.P.pos.z)');
const expectOff = (await iso()).distCur * Math.cos((await iso()).pitchNow);
ok('相机在水平面上的偏移 = 机距×cos(俯角)', near(off, expectOff, 0.5), off.toFixed(2) + ' vs ' + expectOff.toFixed(2));

console.log('\n【6】四档闭环 + 投影还回去');
await V('v'); await sleep(1200);
s = await iso();
ok('等距 → 第一人称', (await num('window.__world.viewMode')) === 0);
ok('投影换回透视', s.active === 'persp' && s.isOrtho === false, s.active);
ok('iso.on 归零', s.on === false);
ok('第一人称眼高 ≈1.62m', near(await num('window.__world.camera.position.y'),
   await num('window.__world.P.pos.y') + 1.62, 0.08), (await num('window.__world.camera.position.y')).toFixed(2));
await V('v'); await sleep(500);
ok('第一人称 → 第三人称', (await num('window.__world.viewMode')) === 1);
await V('v'); await sleep(500);
ok('第三人称 → 自由', (await num('window.__world.viewMode')) === 2);
await V('v'); await sleep(1000);
ok('自由 → 等距（四档闭环）', (await num('window.__world.viewMode')) === 3);

console.log('\n【7】界面上的第 4 档');
await ev('window.__forceTouchUI()');
await sleep(200);
ok('视角键显示「等距」', (await ev('document.getElementById("viewBtn").textContent')) === '等距',
   await ev('document.getElementById("viewBtn").textContent'));
ok('等距里藏起 45° 锁定键（那是自由视角的东西）',
   (await ev('document.getElementById("lockBtn").style.display')) === 'none',
   await ev('document.getElementById("lockBtn").style.display'));

console.log('\n【8】等距里不出岔子');
/* v0.16.0：清单侧栏整套删掉了，这里改成确认它真的不在了（免得留半截） */
ok('清单侧栏已移除', (await ev('document.getElementById("side") === null && document.getElementById("sideTab") === null')));
ok('F3 不再有任何反应', (await V('f3'), 1) === 1 && (await ev('document.getElementById("side") === null')));
const th0 = await ev('document.documentElement.getAttribute("data-theme")');
await V('t'); await sleep(500);
ok('切主题生效', (await ev('document.documentElement.getAttribute("data-theme")')) !== th0);
ok('切主题后投影还在', (await iso()).active === 'ortho');
await V('t'); await sleep(400);
const rq = await num('window.__world.renderScale');
ok('自适应分辨率没被拖垮（≥0.62）', rq >= 0.62, rq);
ok('全程无异常', errs.length === 0, errs.join(' | ') || 'none');

console.log('\n=== ' + pass + '/' + n + ' 通过 ===');
if (fails.length) { console.log('失败：'); fails.forEach(f => console.log('  · ' + f)); }
process.exit(fails.length ? 1 : 0);
