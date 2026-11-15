/* v0.20.0 专项：待机检测（长时间无输入就停渲染）+ 后台暂停仍有效
   跑法：bash /d/temp/run_with_edge.sh /d/temp/w01_power.mjs
   前置：world01 目录里起 python -m http.server 8779
   判据不是"有没有这个变量"，是**渲染帧真的停了**：直接比 renderer.info.render.frame。 */
const list = await (await fetch('http://127.0.0.1:9230/json/list')).json();
const page = list.filter(t => t.type === 'page').pop();
const ws = new WebSocket(page.webSocketDebuggerUrl);
let id = 0; const pend = new Map(); const errs = []; const fails = [];
const send = (m, p = {}) => new Promise(r => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method: m, params: p })); });
ws.addEventListener('message', e => { const m = JSON.parse(e.data);
  if (m.method === 'Runtime.exceptionThrown') errs.push((m.params.exceptionDetails.exception?.description || '').split('\n')[0]);
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
const num = async (x) => { const v = await ev(x); return typeof v === 'number' ? v : NaN; };
const power = async () => JSON.parse(await ev('JSON.stringify(window.__world.power)'));
const frames = async () => await num('window.__world.frameCount');
const key = async (k, code, vk) => {
  await send('Input.dispatchKeyEvent', { type: 'keyDown', key: k, code: code || k, windowsVirtualKeyCode: vk || 0, nativeVirtualKeyCode: vk || 0 });
  await send('Input.dispatchKeyEvent', { type: 'keyUp', key: k, code: code || k, windowsVirtualKeyCode: vk || 0, nativeVirtualKeyCode: vk || 0 });
};

await send('Page.enable'); await send('Runtime.enable');
await send('Emulation.setDeviceMetricsOverride', { width: 1000, height: 700, deviceScaleFactor: 1, mobile: false });
await send('Page.navigate', { url: 'http://127.0.0.1:8779/world01.html?s=' + Date.now() });
await sleep(7000);

console.log('\n【1】默认状态');
ok('无未捕获异常', errs.length === 0, errs.join(' | ') || 'none');
let p = await power();
ok('默认待机阈值 30 秒', p.idleMs === 30000, p.idleMs + 'ms');
ok('刚开局不是待机', p.idle === false);
ok('渲染在跑', (await frames()) > 10, 'frame=' + (await frames()));

console.log('\n【2】把阈值调短，长时间不动应该自动进待机');
await ev('window.__world.setIdleMs(1200)');
await sleep(2600);
p = await power();
ok('进入了待机', p.idle === true, 'sinceInput=' + p.sinceInput + 'ms');
/* 取基准要**在确认待机之后**：阈值内那一秒本来还在渲染，拿进入前的帧数当基准会误判 */
const f1 = await frames();
await sleep(900);
const f2 = await frames();
ok('待机期间**渲染帧不再增长**', f2 === f1, f1 + ' → ' + f2 + '（900ms）');
await sleep(700);
ok('再等一会儿还是不动', (await frames()) === f2, 'frame=' + (await frames()));
ok('屏幕上看得出在待机', (await ev('document.getElementById("fps").textContent')).indexOf('待机') >= 0,
   await ev('document.getElementById("fps").textContent'));

console.log('\n【3】一碰就回来');
/* 无头下待机空转的 rAF 可能被限频，单发按键后要等下一帧才恢复，偶发等不到；
   改成按住 W 走一段：持续输入期间 rAF 全速，也不会二次进待机。 */
const fBefore = await frames();
await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'w', code: 'KeyW', windowsVirtualKeyCode: 87, nativeVirtualKeyCode: 87 });
await sleep(850);
p = await power();
ok('按键后立刻退出待机', p.idle === false);
ok('渲染恢复（帧数继续涨）', (await frames()) > fBefore, fBefore + ' → ' + (await frames()));
/* FPS 文案半秒刷一次，850ms 时已轮询过一轮且是正常文案 */
ok('FPS 文案不再显示待机', (await ev('document.getElementById("fps").textContent')).indexOf('待机') < 0,
   await ev('document.getElementById("fps").textContent'));
await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'w', code: 'KeyW', windowsVirtualKeyCode: 87, nativeVirtualKeyCode: 87 });

console.log('\n【4】在动的时候不该进待机');
await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'w', code: 'KeyW', windowsVirtualKeyCode: 87 });
let idleSeen = false;
for (let i = 0; i < 10; i++) { await sleep(220); if ((await power()).idle) idleSeen = true; }
await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'w', code: 'KeyW', windowsVirtualKeyCode: 87 });
ok('持续走路 2.2s（阈值 1.2s）期间没进待机', idleSeen === false);

console.log('\n【5】设置面板开着不算待机（人在调参数）');
await key('F2', 'F2', 113);
await sleep(2600);
p = await power();
ok('面板开着不进待机', p.idle === false, 'sinceInput=' + p.sinceInput);
await key('F2', 'F2', 113);
await sleep(2600);
ok('关掉面板后照旧会进待机', (await power()).idle === true);

console.log('\n【6】滚轮 / 点击也算"有人在"');
await send('Input.dispatchMouseEvent', { type: 'mouseWheel', x: 500, y: 350, deltaX: 0, deltaY: 10 });
await sleep(400);
ok('滚轮退出待机', (await power()).idle === false);
await sleep(2600);
ok('再等又进待机', (await power()).idle === true);
await send('Input.dispatchMouseEvent', { type: 'mousePressed', x: 500, y: 350, button: 'left', buttons: 1, clickCount: 1 });
await send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: 500, y: 350, button: 'left', buttons: 0, clickCount: 1 });
await sleep(400);
ok('点击退出待机', (await power()).idle === false);

console.log('\n【7】待机不破坏状态：回来还能走、视角没变');
await ev('window.__world.setIdleMs(1200)');
await sleep(2600);
ok('重新进待机', (await power()).idle === true);
const view0 = await num('window.__world.viewMode');
const yaw0 = await num('window.__camYaw');
const pos0 = JSON.parse(await ev('JSON.stringify({x:+__world.P.pos.x.toFixed(2), z:+__world.P.pos.z.toFixed(2)})'));
await sleep(1500);
const pos1 = JSON.parse(await ev('JSON.stringify({x:+__world.P.pos.x.toFixed(2), z:+__world.P.pos.z.toFixed(2)})'));
ok('待机期间人没有漂移', Math.hypot(pos1.x - pos0.x, pos1.z - pos0.z) < 0.001, JSON.stringify(pos1));
ok('待机期间视角没变', (await num('window.__world.viewMode')) === view0 && Math.abs((await num('window.__camYaw')) - yaw0) < 1e-6);
await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'w', code: 'KeyW', windowsVirtualKeyCode: 87 });
await sleep(900);
await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'w', code: 'KeyW', windowsVirtualKeyCode: 87 });
const pos2 = JSON.parse(await ev('JSON.stringify({x:+__world.P.pos.x.toFixed(2), z:+__world.P.pos.z.toFixed(2)})'));
ok('回到前台立刻能走', Math.hypot(pos2.x - pos1.x, pos2.z - pos1.z) > 0.5,
   Math.hypot(pos2.x - pos1.x, pos2.z - pos1.z).toFixed(2) + 'm');
ok('全程无异常', errs.length === 0, errs.join(' | ') || 'none');

console.log('\n' + (fails.length ? '✗ 失败 ' + fails.length + ' 项:\n  - ' + fails.join('\n  - ') : '✓ 全部通过') + '\n通过 ' + pass + '/' + n);
ws.close();
