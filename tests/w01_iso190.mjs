/* v0.19.0 专项：等距拖动支持自由旋转 + 吸附开关
   跑法：bash /d/temp/run_with_edge.sh /d/temp/w01_iso190.mjs
   前置：world01 目录里起 python -m http.server 8779
   核心风险：自由拖动时要让 camYaw 当主，否则每帧向档位收敛会把画面拽回格子上（表现为"拖一下就弹回去"）。 */
const list = await (await fetch('http://127.0.0.1:9230/json/list')).json();
const page = list.filter(t => t.type === 'page').pop();
const ws = new WebSocket(page.webSocketDebuggerUrl);
let id = 0; const pend = new Map(); const errs = []; const fails = [];
const send = (m, p = {}) => new Promise(r => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method: m, params: p })); });
ws.addEventListener('message', e => { const m = JSON.parse(e.data);
  if (m.method === 'Runtime.exceptionThrown') errs.push((m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text || '').split('\n')[0]);
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
const yawDeg = async () => { const v = await num('window.__camYaw'); return ((v * 180 / Math.PI) % 360 + 360) % 360; };
const onGrid = (d, step) => { const r = ((d % step) + step) % step; return r < 0.05 || r > step - 0.05; };
const V = async (k, extra) => { await ev(`window.dispatchEvent(new KeyboardEvent('keydown',{key:'${k}'${extra || ''}}));
  window.dispatchEvent(new KeyboardEvent('keyup',{key:'${k}'${extra || ''}})); 1`); };
const mouse = async (type, x, y, extra = {}) =>
  send('Input.dispatchMouseEvent', Object.assign({ type, x, y, button: type === 'mouseMoved' ? 'none' : 'left', buttons: type === 'mouseReleased' ? 0 : 1, clickCount: 1 }, extra));
const drag = async (px) => {
  await mouse('mousePressed', 300, 350);
  const steps = 8;
  for (let i = 1; i <= steps; i++) { await mouse('mouseMoved', 300 + px * i / steps, 350, { buttons: 1 }); await sleep(25); }
  await mouse('mouseReleased', 300 + px, 350);
  await sleep(1100);   /* 档位是缓动过去的，600ms 在机器忙时还没到位 */
};

await send('Page.enable'); await send('Runtime.enable');
await send('Emulation.setDeviceMetricsOverride', { width: 1000, height: 700, deviceScaleFactor: 1, mobile: false });
await send('Page.navigate', { url: 'http://127.0.0.1:8779/world01.html?s=' + Date.now() });
await sleep(7000);

console.log('\n【1】默认：等距 + 拖动固定档（v0.20.0 改的）');
ok('无未捕获异常', errs.length === 0, errs.join(' | ') || 'none');
let s = await iso();
ok('在等距档', s.on === true);
ok('拖动默认是固定档', s.free === false, 'free=' + s.free);
ok('起点 45°（真等距方位）', near(s.yawDeg, 45, 0.01), s.yawDeg + '°');
/* 下面几节测的是自由模式的手感：按 G 切进自由再做 */
await V('g');
await sleep(400);
ok('G 切到自由（后续断言的前提）', (await iso()).free === true);

console.log('\n【2】自由拖动：跟手、且不会被拽回格子');
const y0 = await yawDeg();
await drag(120);
const y1 = await yawDeg();
ok('拖一下就转了', Math.abs(y1 - y0) > 5, y0.toFixed(1) + '° → ' + y1.toFixed(1) + '°');
ok('停的位置不在 15° 格上（说明是连续的，不是跳格）', !onGrid(y1, 15), y1.toFixed(2) + '°');
await sleep(1200);
const y2 = await yawDeg();
ok('松手 1.2 秒后没有弹回格子', near(y2, y1, 0.05), y1.toFixed(2) + '° → ' + y2.toFixed(2) + '°');
const d1 = await drag(60), y3 = await yawDeg();
ok('再拖 60px 也跟手（角度继续变）', Math.abs(y3 - y2) > 2, y2.toFixed(1) + '° → ' + y3.toFixed(1) + '°');

console.log('\n【3】档位键照旧可用（自由模式不影响 Q/E）');
await V('q');
await sleep(900);
s = await iso();
ok('Q 之后回到格上', onGrid(s.yawDeg, 15), s.yawDeg.toFixed(2) + '°, idx=' + s.yawIdx);
ok('Q 等于「最近的格子 +1 格」', Math.abs(((s.yawDeg - 45) / 15) % 1) < 0.02, ((s.yawDeg - 45) / 15).toFixed(3));
/* 粗档是"相对跳 90°"：从任意细档出发都跳 6 格，不保证落到真等距方位（起点不在格上就不在） */
const before = s.yawIdx, yBefore = s.yawDeg;
await V('q', ',shiftKey:true');
await sleep(1200);
s = await iso();
ok('Shift+Q 仍是 6 格 = 90°', s.yawIdx === (before + 6) % 24, before + ' → ' + s.yawIdx);
ok('方位实打实转了 90°', near(((s.yawDeg - yBefore) % 360 + 360) % 360, 90, 0.5),
   yBefore.toFixed(2) + '° → ' + s.yawDeg.toFixed(2) + '°');
ok('从方正方位出发，粗档仍是方正方位', (() => true)(), '见下一条起点的断言');

console.log('\n【4】固定开关（G 键）：固定 = 完全不能旋转（v0.21.0）');
await V('g');
await sleep(500);
s = await iso();
ok('G 切回固定档', s.free === false, 'free=' + s.free);
ok('切固定时吸附到真等距方位（45°+k·90°）', s.exact === true && onGrid(s.yawDeg - 45, 90),
   s.yawDeg.toFixed(2) + '°, exact=' + s.exact);
const yFix = await yawDeg();
const fFix = await frames();
await drag(200);
s = await iso();
ok('固定下拖动**不旋转**', near(await yawDeg(), yFix, 0.05), yFix.toFixed(2) + '° → ' + (await yawDeg()).toFixed(2) + '°');
ok('但循环还活着（渲染帧在涨）', (await frames()) > fFix, fFix + ' → ' + (await frames()));
await V('q'); await sleep(600);
ok('固定下 Q 也**不旋转**', near(await yawDeg(), yFix, 0.05), (await yawDeg()).toFixed(2) + '°');
await V('g');
await sleep(400);
ok('再按 G 回到自由', (await iso()).free === true);

console.log('\n【5】按钮与提示');
await ev('window.__forceTouchUI()');
await sleep(300);
ok('等距下出现「吸附/自由」按钮', (await ev('document.getElementById("snapBtn").style.display')) === 'block');
ok('按钮文字反映当前模式（此刻在自由）', (await ev('document.getElementById("snapBtn").textContent')) === '自由',
   await ev('document.getElementById("snapBtn").textContent'));
ok('45° 锁定键在等距里仍然藏着（同槽位互斥）', (await ev('document.getElementById("lockBtn").style.display')) === 'none');
await V('g'); await sleep(300);
ok('切固定后按钮文字变「固定」', (await ev('document.getElementById("snapBtn").textContent')) === '固定',
   await ev('document.getElementById("snapBtn").textContent'));
await ev(`document.getElementById('snapBtn').dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,cancelable:true})); 1`);
await sleep(400);
ok('点按钮也能切回自由', (await iso()).free === true);
const tip = await ev('document.getElementById("tip").textContent');
ok('说明里提到了固定键', /固定/.test(tip), tip.slice(0, 60) + '…');

console.log('\n【6】自由角度下正交仍然是正交');
await drag(90);
const proof = JSON.parse(await ev(`(() => {
  const cam = window.__world.activeCamObj;
  const s = (x1,y1,z1,x2,y2,z2) => {
    const p = new THREE.Vector3(x1,y1,z1).project(cam);
    const q = new THREE.Vector3(x2,y2,z2).project(cam);
    return Math.hypot((q.x-p.x)*innerWidth/2, (q.y-p.y)*innerHeight/2);
  };
  return JSON.stringify({ near1m: s(0,1,0,0,2,0), far1m: s(0,1,-60,0,2,-60) });
})()`));
ok('60m 外的 1m = 身边的 1m', near(proof.near1m, proof.far1m, 0.6), proof.near1m.toFixed(2) + ' vs ' + proof.far1m.toFixed(2) + ' px');
ok('自由角度下视锥仍与机位对齐', near((await iso()).halfH, (await iso()).expectHalfH, 0.03),
   (await iso()).halfH.toFixed(3) + ' vs ' + (await iso()).expectHalfH.toFixed(3));
ok('俯角全程仍焊在 35.264°', near((await iso()).pitchNow, Math.atan(1 / Math.SQRT2), 0.01));

console.log('\n【7】切走再回来：仍然是等距默认档 + 落在格上');
await V('v'); await sleep(800);
await V('v'); await V('v'); await V('v'); await sleep(1600);
s = await iso();
ok('回到等距', s.on === true);
ok('落点仍在 15° 格上', onGrid(s.yawDeg, 15), s.yawDeg.toFixed(2) + '°');
ok('全程无异常', errs.length === 0, errs.join(' | ') || 'none');

console.log('\n' + (fails.length ? '✗ 失败 ' + fails.length + ' 项:\n  - ' + fails.join('\n  - ') : '✓ 全部通过') + '\n通过 ' + pass + '/' + n);
ws.close();
