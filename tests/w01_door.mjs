/* v0.23.1 验收：便利店的门能开、能走进去、有弱提示、手机有按钮。
   软件渲染帧率低，所有状态都用轮询等（最多 6s），不靠固定 sleep。
   ① 出生点没有提示；门口出现「按 E 开门」
   ② E 开门（提示变「按 E 关门」）
   ③ 门内判定为店内：屋顶、顶棚收起
   ④ 回到门口按 E 关门，屋顶恢复
   ⑤ 手机按钮（#doorBtn）能开关门
   ⑥ 全程无 JS 异常 */
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
const door = async () => JSON.parse(await ev('JSON.stringify(__world.storeDoor)'));
const tip = async () => JSON.parse(await ev(`(function(){var t=document.getElementById('doorTip'),b=document.getElementById('doorBtn');
  return JSON.stringify({tip: t ? t.textContent : null, op: t ? getComputedStyle(t).opacity : null,
    btn: b ? b.textContent : null, btnShow: b ? getComputedStyle(b).display : null});})()`));
const until = async (fn, ms = 6000) => {
  const t0 = Date.now();
  while (Date.now() - t0 < ms) { try { if (await fn()) return true; } catch (e) { /* 页面还没就绪 */ } await sleep(160); }
  return false;
};
const waitDoor = (k, v, ms = 6000) => until(async () => (await door())[k] === v, ms);
const tp = async (x, y, z) => { await ev(`__world.P.pos.set(${x}, ${y}, ${z}); 'tp'`); await sleep(300); };
const key = async k => {
  await send('Input.dispatchKeyEvent', { type: 'keyDown', key: k, code: 'Key' + k.toUpperCase(), windowsVirtualKeyCode: k.toUpperCase().charCodeAt(0), nativeVirtualKeyCode: k.toUpperCase().charCodeAt(0) });
  await send('Input.dispatchKeyEvent', { type: 'keyUp', key: k, code: 'Key' + k.toUpperCase(), windowsVirtualKeyCode: k.toUpperCase().charCodeAt(0), nativeVirtualKeyCode: k.toUpperCase().charCodeAt(0) });
  await sleep(300);
};

await send('Page.navigate', { url: 'http://127.0.0.1:8779/world01.html?s=' + Date.now() });
await until(async () => (await ev('typeof __world')) === 'object', 12000);
/* v0.24.0：便利店在独立的世界里，测试前先切过去（门店门系统本身与所在世界无关） */
await ev('__world.gotoWorld("konbini")'); await sleep(300);

console.log('\n【1】出生点：没有提示，门关着');
const d0 = await door(), t0 = await tip();
ok(d0 && d0.open === false, '门初始是关的', d0 && d0.open);
ok(d0 && d0.focus === false, '出生点不在门的交互范围', d0 && d0.focus);
ok(t0.op === '0' || t0.op === '', '提示不可见', t0.op);

console.log('\n【2】门口：出现「按 E 开门」，E 能开门');
await tp(-5.3, 0.22, -4.45);
ok(await waitDoor('focus', true), '走到门口进入交互范围（轮询）');
await until(async () => (await tip()).op === '1', 4000);
const t1 = await tip();
ok(t1.tip === '按 E 开门' && t1.op === '1', '提示显示「按 E 开门」', t1.tip + ' / op=' + t1.op);
await key('e');
ok(await waitDoor('open', true), '按 E 后门开了');
const t2 = await tip();
ok(t2.tip === '按 E 关门', '提示变成「按 E 关门」', t2.tip);
ok(await until(async () => (await door()).angle > 1.5, 4000), '门扇转到位（>1.5rad）');

console.log('\n【3】走进去：屋顶/顶棚收起');
await tp(-8.6, 0.4, -4.5);
ok(await waitDoor('inside', true), '门内判定为店内（轮询）');
ok(await waitDoor('roof', false), '屋顶已收起');
ok(await waitDoor('ceil', false), '顶棚已收起');
const d3 = await door();
ok(d3.lamps === 18, '吊灯仍在场景里（只是隐藏）', d3.lamps);
const ti3 = await tip();
ok((d3.focus === false && ti3.op === '0') || (d3.focus === true && ti3.tip === '按 E 关门'),
  '店内提示：深处隐藏 / 门边显示「按 E 关门」', (ti3.tip || '') + ' / op=' + ti3.op);

console.log('\n【4】回到门口：E 关门，屋顶恢复');
await tp(-5.6, 0.22, -4.45);
ok(await waitDoor('focus', true), '回到门口（轮询）');
await key('e');
ok(await waitDoor('open', false), '再按 E 关门');
ok(await waitDoor('roof', true), '门口（门外）屋顶恢复到可见');
ok(await waitDoor('ceil', true), '门口（门外）顶棚恢复到可见');

console.log('\n【5】手机按钮能开关门');
await tp(-5.3, 0.22, -4.45);
await waitDoor('focus', true);
const bp = await ev(`(function(){var b=document.getElementById('doorBtn');
  if(!b) return 'no-btn'; b.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true})); return 'ok';})()`);
ok(bp === 'ok' && await waitDoor('open', true), '按钮 pointerdown 打开门', bp);
await ev(`document.getElementById('doorBtn').dispatchEvent(new PointerEvent('pointerdown',{bubbles:true}))`);
ok(await waitDoor('open', false), '再点按钮关门');

console.log('\n【6】无 JS 异常');
const errs = await ev('(window.__errors || []).slice(0, 4)');
ok(Array.isArray(errs) && errs.length === 0, '全程无 JS 异常', JSON.stringify(errs));

console.log('\n=== ' + pass + ' 通过 / ' + fail + ' 失败 ===');
process.exit(fail ? 1 : 0);
