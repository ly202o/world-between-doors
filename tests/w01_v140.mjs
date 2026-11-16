/* v0.14.0 实测：武器系统整块拆掉之后，世界还在、还能玩、且什么都没残着
   ① 枪 / 准星 / 射击键 / 换弹键 / 弹 HUD / 枪声 全部不存在
   ② 后台对象也没有（__world 上不留半截接口）
   ③ 右臂回到自然摆臂（不再端着一把看不见的枪）
   ④ 原来吃武器的东西没有连带坏掉：移动 / 跳 / 攀 / 视角 / 脚 IK / 碰撞自检 / 音效 / 侧栏
   ⑤ 靶板当场景物件留着，仍有碰撞 */
const list = await (await fetch('http://127.0.0.1:9230/json/list')).json();
const page = list.filter(t => t.type === 'page').pop();
const ws = new WebSocket(page.webSocketDebuggerUrl);
let id = 0; const pend = new Map();
const send = (m, p = {}) => new Promise(r => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method: m, params: p })); });
ws.addEventListener('message', e => { const m = JSON.parse(e.data); if (m.id && pend.has(m.id)) { pend.get(m.id)(m); pend.delete(m.id); } });
await new Promise(r => ws.addEventListener('open', r));
const ev = async x => {
  const r = await send('Runtime.evaluate', { expression: x, returnByValue: true, awaitPromise: true });
  if (r.result?.exceptionDetails) throw new Error('JS: ' + (r.result.exceptionDetails.exception?.description || '').split('\n')[0]);
  return r.result?.result?.value;
};
const sleep = ms => new Promise(r => setTimeout(r, ms));
let pass = 0, fail = 0;
const ok = (c, n, x) => { if (c) { pass++; console.log('  ✓', n); } else { fail++; console.log('  ✗', n, x === undefined ? '' : JSON.stringify(x)); } };
const key = async (k, code, vk) => {
  await send('Input.dispatchKeyEvent', { type: 'keyDown', key: k, code, windowsVirtualKeyCode: vk, nativeVirtualKeyCode: vk });
  await send('Input.dispatchKeyEvent', { type: 'keyUp', key: k, code, windowsVirtualKeyCode: vk, nativeVirtualKeyCode: vk });
};
const mouse = async (type, x, y, extra = {}) =>
  send('Input.dispatchMouseEvent', Object.assign({ type, x, y, button: type === 'mouseMoved' ? 'none' : 'left', buttons: type === 'mouseReleased' ? 0 : 1, clickCount: 1 }, extra));

await send('Runtime.enable'); await send('Page.enable');
const errs = [];
ws.addEventListener('message', e => {
  const m = JSON.parse(e.data);
  if (m.method === 'Runtime.exceptionThrown') errs.push(m.params.exceptionDetails.exception?.description || 'err');
  if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error') errs.push(JSON.stringify(m.params.args?.[0]?.value || ''));
});
await send('Emulation.setDeviceMetricsOverride', { width: 1000, height: 700, deviceScaleFactor: 1, mobile: false });
await ev(`try{localStorage.clear()}catch(e){}`);
await send('Page.navigate', { url: 'http://127.0.0.1:8779/world01.html?s=' + Date.now() });
await sleep(9500);

console.log('\n[1] 版本');
ok(/^v0\.\d+\.\d+$/.test(await ev(`window.__worldVersion`)), '版本格式合法（不锁死小版本）', await ev(`window.__worldVersion`));

console.log('\n[2] 界面上有关枪的东西一个不剩');
for (const sel of ['#fireBtn', '#reloadBtn', '#weaponHud', '#aim']) {
  ok(await ev(`document.querySelector('${sel}') === null`), `没有 ${sel}`);
}
ok(await ev(`/射击|换弹/.test(document.getElementById('tip').textContent) === false`), '操作提示里没有「射击 / 换弹」',
   await ev(`document.getElementById('tip').textContent.slice(0,60)`));
ok(await ev(`/v0\\.\\d+\\.\\d+/.test(document.getElementById('tip').textContent)`), '操作提示带版本号',
   await ev(`document.getElementById('tip').textContent.slice(-12)`));

console.log('\n[3] 后台对象也清干净了（不留半截接口）');
for (const k of ['weapon', 'fire', 'reload', 'heldPistol', 'shotCollider', 'shotOrigin', 'shotDir', 'fx', 'hold', 'applyHold']) {
  ok(await ev(`__world.${k} === undefined`), `__world.${k} 已移除`, await ev(`typeof __world.${k}`));
}
ok(await ev(`Array.isArray(__world.targets) && __world.targets.length === 3`), '靶板仍在（当场景物件）', await ev(`__world.targets && __world.targets.length`));

console.log('\n[4] 右臂回到自然摆臂');
await sleep(300);
/* 骨盆空间里量右手位置。持枪姿态的目标点是 (-0.20, +0.34, +0.30)（后者=前方）。
   自然站立手臂下垂，右手应该明显低于这个高度。 */
function handRel() {
  return ev(`(function(){
    var b=__world.bones, h=b.hand_r, p=b.pelvis;
    if(!h||!p) return null;
    h.updateWorldMatrix(true,false); p.updateWorldMatrix(true,false);
    var a=new THREE.Vector3().setFromMatrixPosition(h.matrixWorld);
    var c=new THREE.Vector3().setFromMatrixPosition(p.matrixWorld);
    var rel=a.clone().sub(c);
    /* 转到角色本地：角色前方是 (sin(face),0,cos(face)) */
    var yaw=__world.P.face;
    var fwd=new THREE.Vector3(Math.sin(yaw),0,Math.cos(yaw));
    var right=new THREE.Vector3(Math.cos(yaw),0,-Math.sin(yaw));
    return { up:+rel.y.toFixed(3), fwd:+rel.dot(fwd).toFixed(3), right:+rel.dot(right).toFixed(3) };
  })()`);
}
const h0 = await handRel();
ok(h0 && h0.up < 0.18, '右手不再抬在胸前（骨盆以上 < 0.18m）', h0);
ok(h0 && Math.abs(h0.fwd) < 0.22, '右手不在身体前方端着（前后 < 0.22m）', h0);

console.log('\n[5] 原来点左键开枪、按 R 换弹 —— 现在都不该有反应，也不该报错');
const errsBefore = errs.length;
await mouse('mousePressed', 600, 350); await sleep(60); await mouse('mouseReleased', 600, 350);
await key('r', 'KeyR', 82); await sleep(120);
await key(' ', 'Space', 32); await sleep(700);
ok(errs.length === errsBefore, '点左键 / 按 R / 按空格 全程无异常', errs.slice(errsBefore));
ok(await ev(`!__world.P.onGround || __world.P.pos.y < 1`), '空格还在跳（没被拆坏）');
await sleep(900);

console.log('\n[6] 移动 / 视角 / 攀爬链路没被连带弄坏');
const p0 = await ev(`({x:+__world.P.pos.x.toFixed(3), z:+__world.P.pos.z.toFixed(3)})`);
await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'w', code: 'KeyW', windowsVirtualKeyCode: 87, nativeVirtualKeyCode: 87 });
await ev(`__world.setYaw(0)`); await sleep(1200);
await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'w', code: 'KeyW', windowsVirtualKeyCode: 87, nativeVirtualKeyCode: 87 });
const p1 = await ev(`({x:+__world.P.pos.x.toFixed(3), z:+__world.P.pos.z.toFixed(3)})`);
ok(Math.hypot(p1.x - p0.x, p1.z - p0.z) > 0.5, '还能走', { p0, p1 });
/* 默认 viewMode = 2（自由视角）。v0.15.0 起是四档循环 2 → 3（等距）→ 0（第一）→ 1（第三）→ 2。
   这里只验"V 还能切、而且真的按顺序走"，档数不写死。 */
const vm0 = await ev(`__world.viewMode`);
await key('v', 'KeyV', 86); await sleep(400);
const vm1 = await ev(`__world.viewMode`);
ok(vm1 === (vm0 + 1) % 4, `V 还能切视角（${vm0} → ${vm1}）`, vm1);
await key('v', 'KeyV', 86); await sleep(400);
await key('v', 'KeyV', 86); await sleep(400);
await key('v', 'KeyV', 86); await sleep(400);
ok(await ev(`__world.viewMode`) === vm0, '四档转一圈回到原档', vm0);

console.log('\n[7] 脚 IK / 碰撞自检 / 音效 / 侧栏 都还在');
await ev('__world.P.pos.set(25, 0, 25)');
await sleep(650);
/* 踝高要减去脚下支撑面高度：刚才可能已经走到土坡上，绝对高度会整体抬高 */
const ikGap = await ev(`(function(){
  var b=__world.bones, o={sup:+__world.supportAt(__world.P.pos.x,__world.P.pos.z).toFixed(3)};
  ['foot_l','foot_r'].forEach(function(n){
    var f=b[n]; if(!f) return;
    f.updateWorldMatrix(true,false);
    var y=new THREE.Vector3().setFromMatrixPosition(f.matrixWorld).y;
    o[n]=+(y-o.sup).toFixed(3);
  }); return o; })()`);
ok(Math.abs(ikGap.foot_l - 0.100) < 0.05, '左脚踝离地还是 0.100 附近（脚 IK 没坏）', ikGap);
ok(Math.abs(ikGap.foot_r - 0.100) < 0.05, '右脚踝离地还是 0.100 附近', ikGap);

const audit = await ev(`__collisionAudit && ({missing:__collisionAudit.verify.missing, exempt:__collisionAudit.verify.exempt})`);
ok(audit && audit.missing === 0, '碰撞自检遗漏 0', audit);
/* 豁免从 30 掉到 2：少掉的 28 条正是挂在 hand_r 上的枪零件 —— 反过来证明枪真的从场景图里摘掉了 */
ok(audit && audit.exempt === 288, '记录装饰、木门模型和场景表面豁免', audit);
const prof = await ev(`(function(){var by={};for(var i=0;i<__colliders.length;i++){var k=__colliders[i].kind;by[k]=(by[k]||0)+1;}return {n:__colliders.length,by:by};})()`);
ok(prof.n === 820, '碰撞体 820 个（按世界核对）', prof.n);
ok(prof.by.target === 3 && prof.by.stand === 3, '靶板 3 块 + 支架 3 根都还在', prof.by);

ok(await ev(`__world.sound.muted === true`), '仍然默认静音');
/* v0.16.0：清单整套从游戏里删掉，改在 docs/TESTLIST-*.md 维护 */
ok(await ev(`document.getElementById('side') === null && document.getElementById('testList') === null`), '清单侧栏已移除');

console.log('\n[8] 全程无 JS 异常');
ok(errs.length === 0, '无未捕获异常 / console.error', errs.slice(0, 4));

console.log(`\n结果：${pass} 通过 / ${fail} 不通过`);
ws.close();
process.exit(fail ? 1 : 0);
