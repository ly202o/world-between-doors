/* v0.20.0 专项：① F2 设置面板真的能看见 ② 拖动默认固定档
   跑法：bash /d/temp/run_with_edge.sh /d/temp/w01_v200.mjs
   前置：world01 目录里起 python -m http.server 8779
   F2 的根因：面板从来没有 CSS，`<section>` 在文档流里被 100% 高的画布顶到视口外——
   hidden 真的切了，但人看不见。所以这里不能只断言 settingsOpen，
   必须断言**面板的屏幕矩形落在视口里且有像样的尺寸**。 */
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
const near = (a, b, t) => Math.abs(a - b) <= t;
const num = async (x) => { const v = await ev(x); return typeof v === 'number' ? v : NaN; };
const iso = async () => JSON.parse(await ev('JSON.stringify(window.__world.iso)'));
const yawDeg = async () => { const v = await num('window.__camYaw'); return ((v * 180 / Math.PI) % 360 + 360) % 360; };
const frames = async () => num('window.__world.frameCount');
const key = async (k, code, vk) => {
  await send('Input.dispatchKeyEvent', { type: 'keyDown', key: k, code: code || k, windowsVirtualKeyCode: vk || 0, nativeVirtualKeyCode: vk || 0 });
  await send('Input.dispatchKeyEvent', { type: 'keyUp', key: k, code: code || k, windowsVirtualKeyCode: vk || 0, nativeVirtualKeyCode: vk || 0 });
};
const mouse = async (type, x, y, extra = {}) =>
  send('Input.dispatchMouseEvent', Object.assign({ type, x, y, button: type === 'mouseMoved' ? 'none' : 'left', buttons: type === 'mouseReleased' ? 0 : 1, clickCount: 1 }, extra));
const panelRect = async () => JSON.parse(await ev(`(() => {
  const e = document.getElementById('settingsPanel'), r = e.getBoundingClientRect();
  return JSON.stringify({ top: Math.round(r.top), left: Math.round(r.left), w: Math.round(r.width), h: Math.round(r.height),
    bottom: Math.round(r.bottom), right: Math.round(r.right),
    display: getComputedStyle(e).display, vis: getComputedStyle(e).visibility,
    z: getComputedStyle(e).zIndex, vw: innerWidth, vh: innerHeight, hidden: e.hidden });
})()`));

await send('Page.enable'); await send('Runtime.enable');
await send('Emulation.setDeviceMetricsOverride', { width: 1000, height: 700, deviceScaleFactor: 1, mobile: false });
await send('Page.navigate', { url: 'http://127.0.0.1:8779/world01.html?s=' + Date.now() });
await sleep(7000);

console.log('\n【1】F2 打开设置面板（桌面）');
ok('无未捕获异常', errs.length === 0, errs.join(' | ') || 'none');
let r = await panelRect();
ok('初始是收起的', r.hidden === true && r.display === 'none', 'hidden=' + r.hidden + ' display=' + r.display);
await key('F2', 'F2', 113);
await sleep(500);
r = await panelRect();
ok('F2 后面板不再 hidden', r.hidden === false);
ok('F2 后 display 不是 none', r.display !== 'none', r.display);
ok('面板宽度像样（>200px）', r.w > 200, r.w + 'px');
ok('面板高度像样（>150px）', r.h > 150, r.h + 'px');
ok('面板完整落在视口内（这才是"看得见"）',
   r.top >= 0 && r.left >= 0 && r.bottom <= r.vh + 1 && r.right <= r.vw + 1,
   `top=${r.top} left=${r.left} bottom=${r.bottom}/${r.vh} right=${r.right}/${r.vw}`);
ok('层级高于画布', (+r.z || 0) >= 300, 'z-index=' + r.z);
ok('设置按钮显示"开启"态', (await ev(`document.getElementById('settingsBtn').classList.contains('on')`)) === true);

console.log('\n【2】面板内容能用');
const sl = await ev(`(() => {
  const s = document.getElementById('timeScale'); const b = s.getBoundingClientRect();
  return JSON.stringify({ w: Math.round(b.width), h: Math.round(b.height), top: Math.round(b.top), left: Math.round(b.left), val: s.value });
})()`);
const s1 = JSON.parse(sl);
ok('滑条有实际尺寸（不是被压成 0）', s1.w > 150 && s1.h >= 10, s1.w + '×' + s1.h);
ok('滑条在视口内', s1.top > 0 && s1.top < 700, 'top=' + s1.top);
await ev(`(() => { const s = document.getElementById('timeScale'); s.value = '1.5'; s.dispatchEvent(new Event('input',{bubbles:true})); return 1; })()`);
await sleep(400);
/* settings 没暴露成诊断口，改从 DOM 回读：output 里的数字由 syncSettings 写，能变就说明 handler 跑了 */
const tsOut = await ev(`document.getElementById('timeScaleValue').textContent`);
ok('改滑条后回显跟着变', String(tsOut).indexOf('1.5') >= 0, tsOut);
ok('改滑条写进了 localStorage 的设置', (await ev(`(localStorage.getItem('world01.settings.v1')||'').indexOf('1.5') >= 0`)) === true);
await ev(`(() => { const s = document.getElementById('timeScale'); s.value = '1'; s.dispatchEvent(new Event('input',{bubbles:true})); return 1; })()`);
const txt = await ev(`document.getElementById('debugInfo').textContent.length`);
ok('调试信息有内容', txt > 20, txt + ' 字');
const btn = await ev(`(() => { const b = document.getElementById('settingsClose').getBoundingClientRect();
  return JSON.stringify({ w: Math.round(b.width), h: Math.round(b.height), inView: b.top > 0 && b.bottom < 700 }); })()`);
const b1 = JSON.parse(btn);
ok('关闭按钮可见可点', b1.w > 40 && b1.h >= 16 && b1.inView, b1.w + '×' + b1.h);

console.log('\n【3】F2 再按 / Esc / 按钮都能关');
await key('F2', 'F2', 113);
await sleep(400);
r = await panelRect();
ok('F2 再按收起', r.hidden === true);
ok('收起后 display 归 none', r.display === 'none');
await key('F2', 'F2', 113);
await sleep(300);
await key('Escape', 'Escape', 27);
await sleep(300);
ok('Esc 关掉面板', (await panelRect()).hidden === true);
/* 手机路径：右上角「设置」按钮走 pointerdown */
await ev('window.__forceTouchUI()');
await sleep(200);
await ev(`document.getElementById('settingsBtn').dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,cancelable:true})); 1`);
await sleep(400);
ok('点「设置」按钮也能开', (await panelRect()).hidden === false);
await ev(`document.getElementById('settingsClose').click()`);
await sleep(300);
ok('点「关闭」能关', (await panelRect()).hidden === true);

console.log('\n【4】矮屏（横屏手机）面板仍然在视口里');
await send('Emulation.setDeviceMetricsOverride', { width: 844, height: 390, deviceScaleFactor: 2, mobile: true });
await sleep(600);
await key('F2', 'F2', 113);
await sleep(500);
r = await panelRect();
ok('横屏：面板在视口内', r.top >= 0 && r.bottom <= r.vh + 1 && r.left >= 0 && r.right <= r.vw + 1,
   `top=${r.top} bottom=${r.bottom}/${r.vh}`);
ok('横屏：仍有可用高度', r.h > 140, r.h + 'px');
await key('F2', 'F2', 113);
await sleep(300);
await send('Emulation.setDeviceMetricsOverride', { width: 1000, height: 700, deviceScaleFactor: 1, mobile: false });
await sleep(600);
await send('Page.navigate', { url: 'http://127.0.0.1:8779/world01.html?s=' + Date.now() });
await sleep(6500);

console.log('\n【5】拖动默认固定档');
let s = await iso();
ok('等距仍是默认档', s.on === true);
ok('拖动默认 = 固定（不吃自由）', s.free === false, 'free=' + s.free);
await ev('window.__forceTouchUI()'); await sleep(200);
ok('按钮文字默认「固定」', (await ev(`document.getElementById('snapBtn').textContent`)) === '固定',
   await ev(`document.getElementById('snapBtn').textContent`));
const y0 = await yawDeg(), f0 = await frames();
await mouse('mousePressed', 300, 350);
for (let i = 1; i <= 10; i++) { await mouse('mouseMoved', 300 + i * 20, 350, { buttons: 1 }); await sleep(25); }
await mouse('mouseReleased', 500, 350);
await sleep(1200);
s = await iso();
ok('固定档下拖动**不旋转**（v0.21.0）', near(await yawDeg(), y0, 0.05), y0.toFixed(2) + '° → ' + (await yawDeg()).toFixed(2) + '°');
ok('但循环还活着（帧数在涨，拖动喂了待机计时器）', (await frames()) > f0, f0 + ' → ' + (await frames()));

console.log('\n【6】切到自由后仍是连续拖动');
await key('g', 'KeyG', 71);
await sleep(400);
ok('G 切到自由', (await iso()).free === true);
ok('按钮文字变「自由」', (await ev(`document.getElementById('snapBtn').textContent`)) === '自由');
const yf0 = await yawDeg();
await mouse('mousePressed', 300, 350);
for (let i = 1; i <= 6; i++) { await mouse('mouseMoved', 300 + i * 15, 350, { buttons: 1 }); await sleep(25); }
await mouse('mouseReleased', 390, 350);
await sleep(900);
const yf1 = await yawDeg();
ok('自由拖动停在非格角度', Math.abs(((yf1 - 45) / 15) % 1) > 0.05, yf1.toFixed(2) + '°');
ok('全程无异常', errs.length === 0, errs.join(' | ') || 'none');

console.log('\n' + (fails.length ? '✗ 失败 ' + fails.length + ' 项:\n  - ' + fails.join('\n  - ') : '✓ 全部通过') + '\n通过 ' + pass + '/' + n);
ws.close();
