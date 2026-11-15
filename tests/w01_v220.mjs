/* v0.22.0 验收：
   ① 桌面侧边栏与画面并行（画布缩窄、面板占右 300px、互不重叠、右缘按钮不被盖）
   ② 窄屏仍是覆盖式（画布不缩）
   ③ 等距缩放跟手：滚轮/捏合输入后 distCur 立即等于 distTarget（不再有二次缓动）
   ④ 打开/关闭面板不改变横竖屏判定（FOV 不跳） */
import fs from 'fs';
const list = await (await fetch('http://127.0.0.1:9230/json/list')).json();
const page = list.filter(t => t.type === 'page').pop();
const ws = new WebSocket(page.webSocketDebuggerUrl);
let id = 0; const pend = new Map();
let pass = 0, fail = 0;
const send = (m, p = {}) => new Promise(r => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method: m, params: p })); });
ws.addEventListener('message', e => { const m = JSON.parse(e.data); if (m.id && pend.has(m.id)) { pend.get(m.id)(m); pend.delete(m.id); } });
await new Promise(r => ws.addEventListener('open', r));
const ev = async x => {
  const r = await send('Runtime.evaluate', { expression: x, returnByValue: true, awaitPromise: true });
  if (r.result?.exceptionDetails) throw new Error('JS: ' + (r.result.exceptionDetails.exception?.description || '').split('\n')[0]);
  return r.result?.result?.value;
};
const sleep = ms => new Promise(r => setTimeout(r, ms));
const ok = (cond, name, info) => { if (cond) { pass++; console.log('  ✓ ' + name + (info !== undefined ? '  [' + info + ']' : '')); } else { fail++; console.log('  ✗ ' + name + '  ' + JSON.stringify(info)); } };
const near = (a, b, t) => Math.abs(a - b) <= t;
const setWin = async (w, h) => {
  await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile: false });
  await sleep(400);
};
const f2 = async () => { await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'F2', code: 'F2', windowsVirtualKeyCode: 113, nativeVirtualKeyCode: 113 }); await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'F2', code: 'F2', windowsVirtualKeyCode: 113, nativeVirtualKeyCode: 113 }); await sleep(350); };
const rect = (sel) => ev(`(function(){var e=document.querySelector('${sel}'); if(!e) return null; var r=e.getBoundingClientRect();
  return {l:+r.left.toFixed(1), t:+r.top.toFixed(1), r:+r.right.toFixed(1), b:+r.bottom.toFixed(1), w:+r.width.toFixed(1), h:+r.height.toFixed(1)};})()`);

await setWin(1000, 700);
await send('Page.navigate', { url: 'http://127.0.0.1:8779/world01.html?s=' + Date.now() });
await sleep(2600);

console.log('\n【1】桌面：侧边栏与画面并行');
const cwClosed = await rect('#c');
ok(near(cwClosed.w, 1000, 2), '关着时画布占满宽度', cwClosed.w + 'px');
await f2();
const panel = await rect('#settingsPanel');
const cwOpen = await rect('#c');
ok(panel && panel.w >= 290 && panel.w <= 310, '面板是 300px 的侧栏', panel && panel.w);
ok(near(panel.r, 1000, 2) && near(panel.t, 0, 1) && near(panel.h, 700, 2), '面板贴右缘、全高', panel && (panel.t + '→' + panel.b + ' 高' + panel.h));
ok(near(cwOpen.w, 700, 2), '画布让出 300px（与面板并行）', cwClosed.w + ' → ' + cwOpen.w);
ok(near(cwOpen.r, panel.l, 1.5), '画布右边缘正好贴着面板左边缘（不重叠）', cwOpen.r + ' vs ' + panel.l);
/* 桌面只有「设置」「鼠标」两个右缘按钮可见，其余是触屏/特定模式才显示 */
const btn = await rect('#mouseBtn'), sbtn = await rect('#settingsBtn');
ok(btn.w > 20 && btn.r < panel.l - 4, '鼠标键被左移、没被面板盖住', 'w=' + btn.w + ' r=' + btn.r + ' panel.l=' + panel.l);
ok(sbtn.r < panel.l - 4, '设置按钮自身也在画面一侧', 'sbtn.r=' + sbtn.r);
ok(await ev('document.body.classList.contains("sideOpen")'), 'body 挂上了 sideOpen');
/* 渲染分辨率跟着画布走 */
const rw = await ev('__world.renderSize ? __world.renderSize.w : (document.getElementById("c").width)');
/* 自适应分辨率可能降采样（软件渲染掉帧），只要不是全宽 1000 就说明按画布算了 */
ok(rw < 900 && rw >= 350, '渲染缓冲区按画布宽算（允许自适应降采样，但不吃全宽）', rw);
/* 横竖屏判定不能因为画布变窄翻转 */
const fovOpen = await ev('__world.camera.fov');
await f2();
const fovClosed = await ev('__world.camera.fov');
ok(near(fovOpen, fovClosed, 0.01), '开关面板不改 FOV（横竖屏按窗口判）', fovOpen + ' vs ' + fovClosed);
const cwBack = await rect('#c');
ok(near(cwBack.w, 1000, 2), '关掉后画布回到全宽', cwBack.w);

console.log('\n【2】等距缩放跟手（不再有二次缓动）');
const isoZoomProbe = async () => ev(`(function(){var i=__world.iso; return {cur:i.distCur, target:i.distTarget, viewH:i.viewH};})()`);
let z0 = await isoZoomProbe();
await send('Input.dispatchMouseEvent', { type: 'mouseWheel', x: 500, y: 350, deltaX: 0, deltaY: -300 });
await sleep(60);   /* 只等 60ms：以前缓动要 ~100ms 才追上 */
const z1 = await isoZoomProbe();
ok(!near(z1.viewH, z0.viewH, 0.05), '滚轮改了覆盖米数', z0.viewH + ' → ' + z1.viewH);
ok(near(z1.cur, z1.target, 0.02), '60ms 内机距已跟上目标（跟手）', 'cur=' + z1.cur + ' target=' + z1.target);
/* 连续滚 3 次，每次都立即对齐 */
for (let i = 0; i < 3; i++) { await send('Input.dispatchMouseEvent', { type: 'mouseWheel', x: 500, y: 350, deltaX: 0, deltaY: 120 }); await sleep(40); }
const z2 = await isoZoomProbe();
ok(near(z2.cur, z2.target, 0.02), '连滚后仍即时对齐', 'cur=' + z2.cur + ' target=' + z2.target);
ok(await ev('__world.iso.isOrtho === true'), '仍是正交投影', await ev('__world.iso.active'));

console.log('\n【3】窄屏（竖屏手机）：保持覆盖式，不并行');
await setWin(390, 844);
await sleep(500);
const mc = await rect('#c');
ok(near(mc.w, 390, 2), '窄屏画布全宽（没为面板让位）', mc.w);
await f2();
const mp = await rect('#settingsPanel');
const mc2 = await rect('#c');
ok(near(mc2.w, 390, 2), '窄屏开面板后画布仍全宽', mc2.w);
ok(mp.w <= 390 && mp.l >= 0 && mp.r <= 391, '窄屏面板在视口内', mp.w + 'px @' + mp.l);
ok(mp.t > 0, '窄屏是贴底覆盖式（不是全高侧栏）', 'top=' + mp.t);
await f2();

console.log('\n【4】矮屏（横屏手机 844×390）：宽 844 ≥700，也走并行侧栏');
await setWin(844, 390);
await sleep(500);
await f2();
const hp = await rect('#settingsPanel'), hc = await rect('#c');
ok(near(hp.w, 300, 2) && near(hc.w, 544, 2), '矮屏并行：面板 300 全高、画布让出后仍完整', 'panel=' + hp.w + ' canvas=' + hc.w);
ok(near(hc.r, hp.l, 1.5) && hp.h >= 388, '矮屏不重叠、侧栏全高', hc.r + ' vs ' + hp.l + ' h=' + hp.h);
await f2();

console.log('\n【5】无 override 的真实窗口（968×557 视口）：并行不漏判');
const mq = await ev(`(function(){var p=document.getElementById('settingsPanel');
  document.getElementById('settingsBtn').dispatchEvent(new PointerEvent('pointerdown',{bubbles:true}));
  return JSON.stringify({iw:innerWidth, ih:innerHeight, sideOpen:document.body.classList.contains('sideOpen'),
    pw:+p.getBoundingClientRect().width.toFixed(0), cw:document.getElementById('c').getBoundingClientRect().width});})()`);
await sleep(300);
const mq2 = JSON.parse(mq);
ok(mq2.sideOpen && mq2.pw >= 290 && near(mq2.cw, mq2.iw - 300, 3), '968×557 视口也是并行侧栏', mq);
await f2();
await send('Emulation.clearDeviceMetricsOverride');
await sleep(300);
ok(await ev('(window.__errors||[]).length === 0'), '全程无 JS 异常', JSON.stringify(await ev('window.__errors||[]')));

console.log('\n=== ' + pass + ' 通过 / ' + fail + ' 失败 ===');
process.exit(fail ? 1 : 0);
