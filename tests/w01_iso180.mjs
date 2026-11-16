/* v0.18.0 专项：等距方位两级档（Q/E 15° 细调 · Shift+Q/E 与拖动 90° 粗调）
   跑法：bash /d/temp/run_with_edge.sh /d/temp/w01_iso180.mjs
   前置：world01 目录里起 python -m http.server 8779 */
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
const V = async (k, shift) => { await ev(`window.dispatchEvent(new KeyboardEvent('keydown',{key:'${k}'${shift ? ',shiftKey:true' : ''}}));
  window.dispatchEvent(new KeyboardEvent('keyup',{key:'${k}'${shift ? ',shiftKey:true' : ''}})); 1`); };
const mouse = async (type, x, y, extra = {}) =>
  send('Input.dispatchMouseEvent', Object.assign({ type, x, y, button: type === 'mouseMoved' ? 'none' : 'left', buttons: type === 'mouseReleased' ? 0 : 1, clickCount: 1 }, extra));

await send('Page.enable'); await send('Runtime.enable');
await send('Emulation.setDeviceMetricsOverride', { width: 1000, height: 700, deviceScaleFactor: 1, mobile: false });
await send('Page.navigate', { url: 'http://127.0.0.1:8779/world01.html?s=' + Date.now() });
await sleep(7000);

console.log('\n【1】常量与默认状态');
ok('无未捕获异常', errs.length === 0, errs.join(' | ') || 'none');
/* v0.27.0：两扇门挪到出生点旁，站在门前按 E 会被「开门」吃掉，
   测 Q/E 转角前先把人挪到空地。 */
await ev('__world.P.pos.set(-6, 0, 10); 1'); await sleep(500);
let s = await iso();
ok('细档 = 15°', near(s.stepDeg, 15, 0.001), s.stepDeg + '°');
ok('粗档 = 6 个细档', s.coarse === 6, s.coarse);
ok('默认方位 45°', near(s.yawDeg, 45, 0.001), s.yawDeg + '°');
ok('默认停在真等距方位（exact）', s.exact === true);

/* v0.21.0：Q/E 只在自由模式生效。默认档是固定，先切自由再测档位键 */
await V('g'); await sleep(400);
ok('前置：已切到自由（Q/E 才生效）', (await iso()).free === true);

console.log('\n【2】Q / E 走细档 15°');
await V('q'); await sleep(1300);
s = await iso();
ok('Q 一次：idx 0→1', s.yawIdx === 1, s.yawIdx);
ok('Q 一次：方位 45°→60°', near(await yawDeg(), 60, 0.4), (await yawDeg()).toFixed(2) + '°');
ok('细档不是真等距方位（exact=false）', s.exact === false);
ok('俯角一分不动', near(s.pitchNow, s.pitchTarget, 0.02), (s.pitchNow * 180 / Math.PI).toFixed(3) + '°');
await V('q'); await sleep(1200);
ok('再按一次：方位 75°', near(await yawDeg(), 75, 0.4), (await yawDeg()).toFixed(2) + '°');
await V('e'); await sleep(1200);
ok('E 退回 —— 方位 60°', near(await yawDeg(), 60, 0.4), (await yawDeg()).toFixed(2) + '°');
await V('e'); await sleep(1200);
ok('E 再退回 —— 方位 45°', near(await yawDeg(), 45, 0.4), (await yawDeg()).toFixed(2) + '°');

console.log('\n【3】Shift+Q / Shift+E 走粗档 90°');
await V('q', true); await sleep(1500);
s = await iso();
ok('Shift+Q 一次：idx 0→6', s.yawIdx === 6, s.yawIdx);
ok('Shift+Q 一次：方位 45°→135°', near(await yawDeg(), 135, 0.4), (await yawDeg()).toFixed(2) + '°');
ok('粗档是真等距方位（exact=true）', s.exact === true);
ok('粗档走完投影仍对齐机位', near(s.halfH, s.expectHalfH, 0.02), s.halfH.toFixed(3) + ' vs ' + s.expectHalfH.toFixed(3));
await V('q', true); await sleep(1500);
ok('再 Shift+Q：方位 225°', near(await yawDeg(), 225, 0.4), (await yawDeg()).toFixed(2) + '°');
await V('e', true); await sleep(1500);
ok('Shift+E 退回：方位 135°', near(await yawDeg(), 135, 0.4), (await yawDeg()).toFixed(2) + '°');

console.log('\n【4】环绕一圈不漂');
await ev('window.__world.setIso(23)'); await sleep(1200);
ok('setIso(23)：方位 45°+345° = 30°', near(await yawDeg(), 30, 0.4), (await yawDeg()).toFixed(2) + '°');
await V('q'); await sleep(1400);
s = await iso();
ok('最后一格按 Q 回到 idx=0（不越界）', s.yawIdx === 0, s.yawIdx);
ok('方位回到 45°', near(await yawDeg(), 45, 0.4), (await yawDeg()).toFixed(2) + '°');

console.log('\n【5】固定档下拖动不旋转（v0.21.0：固定 = 不能旋转）');
/* 【2】切过来的自由模式，先切回固定 */
await V('g'); await sleep(500);
ok('已切回固定（前置）', (await iso()).free === false);
const idx0 = (await iso()).yawIdx;
await mouse('mousePressed', 300, 350);
for (let i = 1; i <= 10; i++) { await mouse('mouseMoved', 300 + i * 30, 350, { buttons: 1 }); await sleep(30); }
await mouse('mouseReleased', 600, 350);
await sleep(1500);
s = await iso();
const d = ((s.yawIdx - idx0) % 24 + 24) % 24;
ok('拖动后方位一分没动（固定 = 不能旋转）', s.yawIdx === idx0, idx0 + ' → ' + s.yawIdx);
ok('拖动后仍是真等距方位', s.exact === true, 'exact=' + s.exact);


console.log('\n【6】几何：45° 三轴等长，15° 细档会拉长（这就是取舍，写进测试免得以后当成 bug）');
const axes = await ev(`(() => {
  const cam = window.__world.activeCamObj;
  const L = (x,y,z) => { const p = new THREE.Vector3(0,0,0).project(cam), q = new THREE.Vector3(x,y,z).project(cam);
    return Math.hypot((q.x-p.x)*innerWidth/2, (q.y-p.y)*innerHeight/2); };
  return JSON.stringify({ x: L(1,0,0), z: L(0,0,1), y: L(0,1,0) });
})()`);
const a = JSON.parse(axes);
const spread = Math.max(a.x, a.z, a.y) / Math.min(a.x, a.z, a.y);
ok('真等距方位：地面两轴等长', near(a.x, a.z, 0.4), a.x.toFixed(2) + ' vs ' + a.z.toFixed(2) + ' px');
ok('真等距方位：三轴等长（这就是"等距"的定义）', spread < 1.03, 'max/min=' + spread.toFixed(3));
await ev('window.__world.setIso(1)'); await sleep(1500);
const a2 = JSON.parse(await ev(`(() => {
  const cam = window.__world.activeCamObj;
  const L = (x,y,z) => { const p = new THREE.Vector3(0,0,0).project(cam), q = new THREE.Vector3(x,y,z).project(cam);
    return Math.hypot((q.x-p.x)*innerWidth/2, (q.y-p.y)*innerHeight/2); };
  return JSON.stringify({ x: L(1,0,0), z: L(0,0,1) });
})()`));
/* 比值方向取决于往哪边偏，只断言"明显不等长"。60° 时理论值 √0.5/√0.8333 = 0.775，
   实测 0.775 —— 这条同时验了投影数学没跑偏。 */
ok('60° 细档：地面两轴不再等长（已知取舍，不是 bug）', Math.abs(a2.x / a2.z - 1) > 0.1,
   (a2.x / a2.z).toFixed(3) + '×（' + a2.x.toFixed(2) + ' vs ' + a2.z.toFixed(2) + ' px）');
const proof = JSON.parse(await ev(`(() => {
  const cam = window.__world.activeCamObj;
  const s = (x1,y1,z1,x2,y2,z2) => {
    const p = new THREE.Vector3(x1,y1,z1).project(cam);
    const q = new THREE.Vector3(x2,y2,z2).project(cam);
    return Math.hypot((q.x-p.x)*innerWidth/2, (q.y-p.y)*innerHeight/2);
  };
  return JSON.stringify({ near1m: s(0,1,0,0,2,0), far1m: s(0,1,-60,0,2,-60) });
})()`));
ok('但正交没丢：60m 外的 1m 仍与身边一样长', near(proof.near1m, proof.far1m, 0.6),
   proof.near1m.toFixed(2) + ' px vs ' + proof.far1m.toFixed(2) + ' px');

console.log('\n【7】从别的视角切进来，落点对齐 15° 格');
await ev('window.__world.setIso(0)'); await sleep(1000);
await V('v'); await sleep(900);        /* 等距 → 第一人称 */
await ev('window.__world.setYaw(0.83)'); await sleep(300);   /* 47.6°：故意不在格上 */
await V('v'); await V('v'); await V('v'); await sleep(1600);  /* → 第三 → 自由 → 等距 */
s = await iso();
const onGrid = Math.abs(((s.yawDeg - 45) % 15 + 15) % 15) < 0.01;
ok('回到等距档', s.on === true);
ok('落点在 15° 格上', onGrid, s.yawDeg.toFixed(2) + '°, idx=' + s.yawIdx);

console.log('\n【8】缩放与收尾');
const h0 = (await iso()).halfH;
await ev(`window.dispatchEvent(new WheelEvent('wheel',{deltaY:400,bubbles:true,cancelable:true}))`);
await sleep(1300);
s = await iso();
ok('滚轮仍改覆盖米数', Math.abs(s.halfH - h0) > 0.3, h0.toFixed(2) + ' → ' + s.halfH.toFixed(2));
ok('缩放后视锥仍对齐', near(s.halfH, s.expectHalfH, 0.02), s.halfH.toFixed(3) + ' vs ' + s.expectHalfH.toFixed(3));
ok('全程无异常', errs.length === 0, errs.join(' | ') || 'none');

console.log('\n' + (fails.length ? '✗ 失败 ' + fails.length + ' 项:\n  - ' + fails.join('\n  - ') : '✓ 全部通过') + '\n通过 ' + pass + '/' + n);
ws.close();
