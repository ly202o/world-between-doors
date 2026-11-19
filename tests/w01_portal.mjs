/* v0.24.0 验收：独立传送门（三个世界、四扇门、门后实时画面）。
   ① 出生在空场世界，两扇门都关着、没有提示
   ② 走到便利店门前：出现提示，E 开门
   ③ 穿过门面：切到便利店世界，落在回程门前
   ④ 便利店侧开门、穿回出生世界
   ⑤ 场地门同理：穿到场地世界再穿回来
   ⑥ 四个世界都有碰撞、全程无 JS 异常
   软件渲染帧率低，状态都用轮询等。 */
const list = await (await fetch('http://127.0.0.1:' + (process.env.CDP_PORT || '9230') + '/json/list')).json();
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

const walkThrough = async (startX, z, k, world, isoIndex = 3) => {
  const code = 'Key' + k.toUpperCase();
  const keyCode = k.toUpperCase().charCodeAt(0);
  const input = { key: k, code, windowsVirtualKeyCode: keyCode, nativeVirtualKeyCode: keyCode };
  /* 这一趟偶尔会走偏（固定等距下 camYaw 由档位反推，setYaw 可能被下一帧盖掉）。
     走不通就重摆一次再走——真坏了两次都过不去，不会把真实回归藏起来。 */
  for (let attempt = 0; attempt < 2; attempt++) {
    await ev(`__world.P.pos.set(${startX}, 0, ${z}); __world.setIso(${isoIndex}); __world.setYaw(Math.PI / 4 + ${isoIndex} * Math.PI / 12)`);
    await sleep(400);
    if ((await portals()).cur === world) return false;
    await send('Input.dispatchKeyEvent', { type: 'keyDown', ...input });
    try {
      const reached = await until(async () => (await portals()).cur === world, 14000);
      if (reached) return true;
      if (attempt === 0) console.log('  · 第一次没走过去，重摆一次：', await ev('__world.P.pos.toArray()'));
    } finally { await send('Input.dispatchKeyEvent', { type: 'keyUp', ...input }); }
    await sleep(500);
  }
  return false;
};

await send('Page.navigate', { url: process.env.WORLD_URL || ('http://127.0.0.1:8779/world01.html?s=' + Date.now()) });
await sleep(1500);
await until(async () => (await ev('typeof __world')) === 'object', 12000);

console.log('\n【1】出生世界');
const p0 = await portals();
ok(p0.cur === 'spawn', '出生在空场世界', p0.cur);
ok(p0.doors.length === 6, '木门、巨石门和花藤拱门各一组', p0.doors.length);
ok(p0.doors.every(d => d.open === d.arch), '木门默认关闭，巨石门和花藤拱门常开');
ok(p0.doors.filter(d => d.world === 'spawn').length === 3, '原野保留三个入口');
const pos0 = JSON.parse(await ev('JSON.stringify([+__world.P.pos.x.toFixed(1), +__world.P.pos.z.toFixed(1)])'));
ok(pos0[0] > 1.65 && pos0[0] < 8 && pos0[1] > -12 && pos0[1] < 0, '出生在门列正面', pos0);

console.log('\n【2】便利店门：提示 + E 开门');
await ev('__world.P.pos.set(3.15, 0, -2.7)'); await sleep(300);
ok(await until(async () => (await portals()).focus === 'doorKonbini'), '走到门前进入交互范围');
ok(await until(async () => (await tipText()) === '开门', 4000), '提示「按 E 开门」', await tipText());
await key('e');
ok(await until(async () => (await state()).doorKonbini.open === true), 'E 开门');
ok(await until(async () => (await tipText()) === '关门', 4000), '提示变「按 E 关门」', await tipText());

console.log('\n【3】穿过门面：进入便利店世界');
ok(await walkThrough(2.45, -2.7, 'w', 'konbini'), '正常走过门面进入便利店世界', (await portals()).cur);
ok(await until(async () => (await state()).returnKonbini.open === true), '对侧门同步保持打开');
ok(await walkThrough(0.6, -2.7, 'w', 'spawn', 15), '原路走回原野', (await portals()).cur);

console.log('\n【5】场地门：穿过去再穿回来');
ok((await state()).doorField.open === true, '巨石门无需开门即可通行');
ok(await walkThrough(2.45, -5.2, 'w', 'field'), '走进旧测试场', (await portals()).cur);
ok(await walkThrough(-0.6, 1.7, 'w', 'spawn', 15), '从场地走回原野', (await portals()).cur);

console.log('\n【6】晴日花园：通过第一座花藤拱门往返');
ok(await walkThrough(2.45, -8, 'w', 'garden'), '走过拱门进入晴日花园', (await portals()).cur);
ok(await walkThrough(0.6, -8, 'w', 'spawn', 15), '从原场景的花藤拱门走回出生区', (await portals()).cur);
const auditDetail = JSON.parse(await ev('JSON.stringify(__world.collisionAudit())'));
console.log('碰撞遗漏', auditDetail.missingNames);
const gardenAudit = auditDetail.missing;
ok(gardenAudit === 0, '分世界碰撞覆盖自检无遗漏', gardenAudit);

console.log('\n【7】收尾');
const n = await ev('window.__colliders.length');
ok(n > 0 && await ev("['spawn','field','garden','konbini'].every(function(w){return __colliders.some(function(c){return c.world===w;});})"), '四个世界都有碰撞登记', n);
const errs = await ev('window.__errors ? window.__errors.length : 0');
ok(errs === 0, '全程无 JS 异常', errs);
console.log('\n' + (fail === 0 ? '全部通过' : '有 ' + fail + ' 项失败') + '（' + pass + '/' + (pass + fail) + '）');
process.exit(fail === 0 ? 0 : 1);

