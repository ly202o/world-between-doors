/* v0.13.6 反馈修复实测：
   ① 面板不再拦输入（清单侧栏已在 v0.16.0 整块删掉，这里留拖动 / 走路的回归）
   ② 碎石有碰撞
   ③ 树干圆柱碰撞
   ④ 出生点土坡能站、脚贴坡
   ⑤ 环境音默认关 */
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
await ev(`try{localStorage.removeItem('w01.testlist.v2');localStorage.removeItem('world01.sound.v1');localStorage.removeItem('world01.amb.v1')}catch(e){}`);
await send('Page.navigate', { url: 'http://127.0.0.1:8779/world01.html?s=' + Date.now() });
await sleep(9500);

console.log('\n[1] 版本');
ok(/^v0\.\d+\.\d+$/.test(await ev(`window.__worldVersion`)), '版本格式', await ev(`window.__worldVersion`));
/* v0.16.0：清单整套从游戏里删掉，改到 docs/TESTLIST-*.md 里维护。
   这里断言"真的一个都不剩"，免得留半截 DOM 或诊断口。 */
ok(await ev(`document.getElementById('side') === null && document.getElementById('sideTab') === null`), '清单侧栏与竖标签已移除');
ok(await ev(`document.getElementById('testList') === null`), '清单列表容器已移除');
ok(await ev(`__world.showSide === undefined && __world.testStore === undefined`), '清单诊断口已移除');

console.log('\n[2] 面板不再拦输入（拖动 / 走路回归）');
/* v0.17 起默认档是等距，v0.21 固定档拖动不转 —— 先按 V 退出等距再测自由视角拖动 */
await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'v', code: 'KeyV', windowsVirtualKeyCode: 86, nativeVirtualKeyCode: 86 });
await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'v', code: 'KeyV', windowsVirtualKeyCode: 86, nativeVirtualKeyCode: 86 });
await sleep(300);
const yaw0 = await ev(`(function(){var e=__world.camera; return +(Math.atan2(
  e.position.x - __world.P.pos.x, e.position.z - __world.P.pos.z)).toFixed(4);})()`);
const camBefore = await ev(`+__world.camera.position.x.toFixed(4)`);
/* 在画面左侧按下并拖动 —— 转视角不能被任何东西拦掉 */
await mouse('mousePressed', 260, 350);
for (let i = 1; i <= 6; i++) { await mouse('mouseMoved', 260 + i * 40, 350, { buttons: 1 }); await sleep(30); }
await mouse('mouseReleased', 500, 350);
await sleep(200);
const yaw1 = await ev(`(function(){var e=__world.camera; return +(Math.atan2(
  e.position.x - __world.P.pos.x, e.position.z - __world.P.pos.z)).toFixed(4);})()`);
ok(Math.abs(yaw1 - yaw0) > 0.05, '拖画面能转视角', { yaw0, yaw1 });
/* 走路不能被面板拦掉（设置面板关着的时候） */
const _pA = await ev(`({x:+__world.P.pos.x.toFixed(3), z:+__world.P.pos.z.toFixed(3)})`);
await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'w', code: 'KeyW', windowsVirtualKeyCode: 87, nativeVirtualKeyCode: 87 });
await sleep(900);
await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'w', code: 'KeyW', windowsVirtualKeyCode: 87, nativeVirtualKeyCode: 87 });
await sleep(1500); /* 走路后 ~1s 内 inX/inZ/pivotCool 还有残留，塞树推出会偏大 0.034（0.447），静置 1.5s 归零 */
const _pB = await ev(`({x:+__world.P.pos.x.toFixed(3), z:+__world.P.pos.z.toFixed(3)})`);
ok(Math.hypot(_pB.x - _pA.x, _pB.z - _pA.z) > 0.4, '还能走', { _pA, _pB });

console.log('\n[3] 碎石有碰撞');
const kinds = await ev(`(function(){var c=window.__colliders||[], k={};
  for(var i=0;i<c.length;i++) k[c[i].kind]=(k[c[i].kind]||0)+1; return k;})()`);
ok(kinds.pebble > 50, '碎石碰撞体都在', kinds);
/* 行为验证：站在一块石头上方 → 支撑高度不等于 0 */
const stoneProbe = await ev(`(function(){
  var cs=window.__colliders||[], sb=null;
  for(var i=0;i<cs.length;i++){ var c=cs[i];
    if(c.kind==='pebble' && c.top>0.10 && Math.abs(c.x)<20 && Math.abs(c.z)<20){ sb=c; break; } }
  if(!sb) return null;
  var h=__world.supportAt(sb.x, sb.z, 1.0);
  return {x:+sb.x.toFixed(2), z:+sb.z.toFixed(2), top:+sb.top.toFixed(3), sup:+h.toFixed(3)};})()`);
ok(stoneProbe && stoneProbe.sup > 0.05, '站在碎石上会被撑起来（以前是 0）', stoneProbe);

console.log('\n[4] 树干是圆柱');
/* v0.17.0 起默认档是等距。等距里每帧把 yaw 吸回 90° 档，setYaw 会被覆盖，
   后面靠 setYaw 摆方向的测试（土坡）会全歪；物理步进也受软件渲染帧率影响。
   所以这里先退到第三人称，与旧默认档的行为对齐——本套测的是玩法，不是相机。 */
{ let vm = await ev(`__world.viewMode`);
  for (let i = 0; vm !== 1 && i < 4; i++) {
    await ev(`window.dispatchEvent(new KeyboardEvent('keydown',{key:'v'}))`);
    await ev(`window.dispatchEvent(new KeyboardEvent('keyup',{key:'v'}))`);
    await sleep(500); vm = await ev(`__world.viewMode`);
  }
  ok(vm === 1, '已退到第三人称（等距的 yaw 吸附不影响后续方向类断言）', vm);
}
const post = await ev(`(function(){var c=window.__colliders||[], n=0, r=null;
  for(var i=0;i<c.length;i++) if(c[i].round){ n++; if(!r) r={x:+c[i].x.toFixed(2), z:+c[i].z.toFixed(2), r:+c[i].hw.toFixed(3)}; }
  return {n:n, sample:r};})()`);
ok(post && post.n >= 2, '两棵树都是圆柱碰撞体', post);
ok(post && post.sample && post.sample.r < 0.25, '半径贴合树干（不是 0.2 的方盒半宽之外再外扩）', post && post.sample);
/* 把角色直接塞进树干里，让物理自己推出来：圆会得到"半径+体半径"，各方一致；
   方盒在对角方向会多推出 ~0.06（0.2·√2 − 0.2）。 */
const dists = await ev(`(function(){
  var c=null, cs=window.__colliders||[];
  for(var i=0;i<cs.length;i++) if(cs[i].round){ c=cs[i]; break; }
  if(!c) return null;
  var out=[];
  for(var a=0;a<4;a++){ out.push(0.01 + a * 0.1); }
  return {ok:true, cx:+c.x.toFixed(2), cz:+c.z.toFixed(2), rad:+c.hw.toFixed(3)};})()`);
/* 逐个角度：塞进去 → 等物理推出来 → 量中心距 */
const pushOut = [];
for (const angDeg of [0, 45, 90, 135]) {
  await ev(`(function(){
    var c=null, cs=window.__colliders||[];
    for(var i=0;i<cs.length;i++) if(cs[i].round){ c=cs[i]; break; }
    var a=${angDeg}*Math.PI/180;
    __world.P.pos.set(c.x + Math.cos(a)*0.03, 0, c.z + Math.sin(a)*0.03);
    __world.vel.set(0,0,0); __world.P.vy=0; __world.onGround=true; return 1;})()`);
  /* 等 480ms 再量：推出是渐近收敛的，280ms 在机器忙的时候还没到位，
     测出来是"帧数够不够"而不是"碰撞圆不圆"（曾因并行跑测试误报过一次）。 */
  await sleep(480);
  pushOut.push(await ev(`(function(){
    var c=null, cs=window.__colliders||[];
    for(var i=0;i<cs.length;i++) if(cs[i].round){ c=cs[i]; break; }
    var dx=__world.P.pos.x-c.x, dz=__world.P.pos.z-c.z;
    return +Math.sqrt(dx*dx+dz*dz).toFixed(3);})()`));
}
const mn = Math.min(...pushOut), mx = Math.max(...pushOut);
ok(mx - mn < 0.02, '四个方向被推出的距离一致（方盒对角会多 ~0.06）', pushOut);
ok(mn > 0.35, '确实被推出去了，没有卡在树里', pushOut);

console.log('\n[5] 出生点土坡');
const rampInfo = await ev(`(function(){
  var cs=window.__colliders||[], r=null;
  for(var i=0;i<cs.length;i++){ var c=cs[i];
    if(c.kind==='roof' && c.base===0 && c.rise<1.2){ r={x:c.x,z:c.z,hw:c.hw,rise:c.rise}; break; } }
  if(!r) return null;
  return {x:+r.x.toFixed(2), z:+r.z.toFixed(2), rise:+r.rise.toFixed(2),
          apex:+__world.supportAt(r.x, r.z, 2).toFixed(3),
          side:+__world.supportAt(r.x + r.hw*0.5, r.z, 2).toFixed(3),
          out:+__world.supportAt(r.x + r.hw + 1.0, r.z, 2).toFixed(3)};})()`);
ok(rampInfo && rampInfo.rise > 0.6, '土坡存在且高度合理', rampInfo);
ok(rampInfo && rampInfo.apex > 0.7 && rampInfo.side > 0.2 && rampInfo.side < rampInfo.apex, '坡顶高、半坡低（真的是斜面）', rampInfo);
ok(rampInfo && rampInfo.out === 0, '坡外还是平地', rampInfo && rampInfo.out);

/* 走上去，量两只脚 */
await ev(`(function(){ var r=__world.supportAt ? 1 : 1; return 1;})()`);
/* 走的是"相机相对"方向：w 朝 camYaw+π 走，所以要把相机也摆成朝东 */
await ev(`(function(){ __world.P.pos.set(3.0, 0, 0.4); __world.vel.set(0,0,0); __world.P.vy=0;
  __world.P.face=Math.PI/2; __world.P.faceTarget=Math.PI/2; __world.setYaw(Math.PI/2 - Math.PI); return 1;})()`);
await sleep(700);
await ev(`window.dispatchEvent(new KeyboardEvent('keydown',{key:'w'}))`);
await sleep(800);   /* 只走到半坡，坡顶是平的、量不出倾角 */
await ev(`window.dispatchEvent(new KeyboardEvent('keyup',{key:'w'}))`);
await sleep(900);
const st = await ev(`(function(){
  var v=new THREE.Vector3(), o={};
  ['foot_l','foot_r','ball_l','ball_r'].forEach(function(n){ var b=__world.bones[n]; if(!b) return;
    b.getWorldPosition(v); o[n]=[+v.x.toFixed(2),+v.y.toFixed(3),+v.z.toFixed(2)]; });
  o.pos=[+__world.P.pos.x.toFixed(2), +__world.P.pos.y.toFixed(3), +__world.P.pos.z.toFixed(2)];
  o.onGround=__world.P.onGround;
  o.gapL=+(o.foot_l[1]-__world.supportAt(o.foot_l[0],o.foot_l[2],__world.P.pos.y+0.12)).toFixed(3);
  o.gapR=+(o.foot_r[1]-__world.supportAt(o.foot_r[0],o.foot_r[2],__world.P.pos.y+0.12)).toFixed(3);
  o.ballL=+(o.ball_l[1]-__world.supportAt(o.ball_l[0],o.ball_l[2],__world.P.pos.y+0.12)).toFixed(3);
  o.ballR=+(o.ball_r[1]-__world.supportAt(o.ball_r[0],o.ball_r[2],__world.P.pos.y+0.12)).toFixed(3);
  o.tilt=[+__world.footState.tiltL.toFixed(3), +__world.footState.tiltR.toFixed(3)];
  return o;})()`);
ok(st.onGround, '走上坡后仍然着地', st.pos);
/* 脚踝骨在平地上本来就离地 0.100（骨架高度），所以判据是"离 0.100 不远"，
   不是"离 0 不远" —— 贴在坡上就应该是 0.100 左右。 */
ok(Math.abs(st.gapL - 0.100) < 0.035 && Math.abs(st.gapR - 0.100) < 0.035,
   '两只脚踝都贴着坡面（踝高应≈0.100）', { gapL: st.gapL, gapR: st.gapR });
ok(st.tilt[0] > 0.08 || st.tilt[1] > 0.08, '至少一只脚做了贴坡倾斜', st.tilt);
ok(Math.abs(st.pos[1]) > 0.08, '人确实站在坡上（身体被抬起来了）', st.pos);

console.log('\n[6] 环境音默认关');
ok(await ev(`__world.sound.amb === false`), '环境音默认关闭');
await ev(`__world.setMuted(false); 1`);
await ev(`window.dispatchEvent(new KeyboardEvent('keydown',{key:'x'}))`);  /* 触发一次解锁手势 */
await sleep(1200);
ok(await ev(`__world.acState`) === 'running', '总开关打开后音频上下文起来了', await ev(`__world.acState`));
ok(await ev(`__world.ambOn`) === false, '环境音没自己起（默认关）', await ev(`__world.ambOn`));
await ev(`__world.setAmb(true); 1`);
await sleep(900);
ok(await ev(`__world.ambOn`) === true, '手动开环境音后才起来', await ev(`__world.ambOn`));
await ev(`__world.setAmb(false); 1`);
await sleep(300);
ok(await ev(`__world.ambOn`) === false, '再关掉能停', await ev(`__world.ambOn`));

console.log('\n[7] 无异常');
ok(errs.length === 0, '没有 JS 异常 / console.error', errs.slice(0, 3));
console.log('\n通过 ' + pass + ' / 失败 ' + fail);
ws.close();
process.exit(fail ? 1 : 0);
