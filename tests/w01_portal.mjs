/* v0.24.0 验收：独立传送门（三个世界、四扇门、门后实时画面）。
   ① 出生在空场世界，两扇门都关着、没有提示
   ② 走到便利店门前：出现提示，E 开门
   ③ 穿过门面：切到便利店世界，落在回程门前
   ④ 便利店侧开门、穿回出生世界
   ⑤ 场地门同理：穿到场地世界再穿回来
   ⑥ 碰撞体 676、全程无 JS 异常
   软件渲染帧率低，状态都用轮询等。 */
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
const portals = async () => JSON.parse(await ev('JSON.stringify(__world.portals)'));
const state = async () => (await portals()).doors.reduce((m, d) => (m[d.name] = d, m), {});
const until = async (fn, ms = 7000) => {
  const t0 = Date.now();
  while (Date.now() - t0 < ms) { try { if (await fn()) return true; } catch (e) { /* 页面还没就绪 */ } await sleep(160); }
  return false;
};
const tipText = async () => await ev('(function(){var t=document.getElementById("portalTip");return t?t.textContent:null;})()');
const key = async k => {
  await send('Input.dispatchKeyEvent', { type: 'keyDown', key: k, code: 'Key' + k.toUpperCase(), windowsVirtualKeyCode: k.toUpperCase().charCodeAt(0), nativeVirtualKeyCode: k.toUpperCase().charCodeAt(0) });
  await send('Input.dispatchKeyEvent', { type: 'keyUp', key: k, code: 'Key' + k.toUpperCase(), windowsVirtualKeyCode: k.toUpperCase().charCodeAt(0), nativeVirtualKeyCode: k.toUpperCase().charCodeAt(0) });
  await sleep(300);
};

await send('Page.navigate', { url: 'http://127.0.0.1:8779/world01.html?s=' + Date.now() });
await until(async () => (await ev('typeof __world')) === 'object', 12000);

console.log('\n【1】出生世界');
const p0 = await portals();
ok(p0.cur === 'spawn', '出生在空场世界', p0.cur);
ok(p0.doors.length === 4, '四扇门（各世界一进一出，回程门跟着世界隐藏）', p0.doors.length);
ok(p0.doors.every(d => d.open === false), '门一开始都关着');
ok(p0.focus === null, '出生点没有提示');
const pos0 = JSON.parse(await ev('JSON.stringify([+__world.P.pos.x.toFixed(1), +__world.P.pos.z.toFixed(1)])'));
ok(Math.abs(pos0[1] - 200) < 2, '出生在 z≈200 的空场', pos0);

console.log('\n【2】便利店门：提示 + E 开门');
await ev('__world.P.pos.set(-2.6, 0, 198.2)'); await sleep(300);
ok(await until(async () => (await portals()).focus === 'doorKonbini'), '走到门前进入交互范围');
ok(await until(async () => (await tipText()) === '按 E 开门', 4000), '提示「按 E 开门」', await tipText());
await key('e');
ok(await until(async () => (await state()).doorKonbini.open === true), 'E 开门');
ok(await until(async () => (await tipText()) === '按 E 关门', 4000), '提示变「按 E 关门」', await tipText());

console.log('\n【3】穿过门面：进入便利店世界');
await ev('__world.P.pos.set(-2.6, 0.4, 195.6)'); await sleep(300);
ok(await until(async () => (await portals()).cur === 'konbini'), '跨过门面切到便利店世界', (await portals()).cur);
const pos1 = JSON.parse(await ev('JSON.stringify([+__world.P.pos.x.toFixed(1), +__world.P.pos.z.toFixed(1)])'));
ok(Math.abs(pos1[0] + 16.3) < 1.2 && Math.abs(pos1[1] - 24.5) < 1.2, '落在回程门前（-19.8, 25.5）', pos1);
ok(await until(async () => (await portals()).focus === 'returnKonbini'), '回程门进入交互范围');

console.log('\n【4】便利店侧开门：穿回出生世界');
await key('e');
ok(await until(async () => (await state()).returnKonbini.open === true), '回程门打开');
await ev('__world.P.pos.set(-14.0, 0.4, 24.5)'); await sleep(300);
ok(await until(async () => (await portals()).cur === 'spawn'), '穿回空场世界', (await portals()).cur);

console.log('\n【5】场地门：穿过去再穿回来');
await ev('__world.P.pos.set(2.6, 0, 198.2)'); await sleep(300);
ok(await until(async () => (await portals()).focus === 'doorField'), '走到场地门前');
await key('e');
ok(await until(async () => (await state()).doorField.open === true), '打开场地门');
await ev('__world.P.pos.set(2.6, 0.4, 195.6)'); await sleep(300);
ok(await until(async () => (await portals()).cur === 'field'), '跨到场地世界', (await portals()).cur);
ok(await until(async () => (await portals()).focus === 'returnField'), '场地回程门在范围');
await key('e');
await ev('__world.P.pos.set(2, 0.4, -2.6)'); await sleep(300);
ok(await until(async () => (await portals()).cur === 'spawn'), '从场地穿回空场世界', (await portals()).cur);

console.log('\n【6】收尾');
const n = await ev('window.__colliders.length');
ok(n === 676, '碰撞体 676 个', n);
const errs = await ev('window.__errors ? window.__errors.length : 0');
ok(errs === 0, '全程无 JS 异常', errs);
console.log('\n' + (fail === 0 ? '全部通过' : '有 ' + fail + ' 项失败') + '（' + pass + '/' + (pass + fail) + '）');
process.exit(fail === 0 ? 0 : 1);
