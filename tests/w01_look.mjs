/* v0.13.4 头部视线跟随（Head Look）实测
   头偏角 = camYaw+π − P.face，clamp ±1.15rad；
   只转 neck_01(45%) + head(55%)，不碰 spine（否则枪会被带偏）。 */
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
const key = async (k, down) => ev(`window.dispatchEvent(new KeyboardEvent('${down ? 'keydown' : 'keyup'}',{key:'${k}'}))`);
const tapV = async () => ev(`window.dispatchEvent(new KeyboardEvent('keydown',{key:'v'}));window.dispatchEvent(new KeyboardEvent('keyup',{key:'v'})); 1`);
/* v0.15.0 起视角是四档循环，测试不该数「按几次」。按到指定档为止，最多绕两圈。 */
const gotoView = async (want) => {
  for (let i = 0; i < 8; i++) {
    if ((await ev('__world.viewMode')) === want) return want;
    await tapV(); await sleep(450);
  }
  return await ev('__world.viewMode');
};
let pass = 0, fail = 0;
const ok = (c, n, x) => { if (c) { pass++; console.log('  ✓', n); } else { fail++; console.log('  ✗', n, x === undefined ? '' : JSON.stringify(x)); } };

await send('Runtime.enable'); await send('Page.enable');
await send('Emulation.setDeviceMetricsOverride', { width: 1000, height: 700, deviceScaleFactor: 1, mobile: false });
await send('Page.navigate', { url: 'http://127.0.0.1:8779/world01.html?s=' + Date.now() });
await sleep(9500);
/* v0.17.0 起默认档是等距：等距里每帧把 yaw 吸回 90° 档，setYaw/小角度拖动全被覆盖。
   本套测的是转头/视线，先回自由视角再测。 */
ok(await gotoView(2) === 2, '前置：已回自由视角（等距不参与转头逻辑）');

/* 头相对脊柱的偏航差：各取骨骼世界矩阵里最水平的一条轴算 yaw，两者相减。
   两根骨局部轴不同，所以有常量偏移——下面用"直走时"做基线扣掉。 */
const probe = `(function(){
  function boneYaw(b){
    var m=b.matrixWorld.elements, best=null, bestY=2;
    for(var i=0;i<3;i++){ var x=m[i*4], y=m[i*4+1], z=m[i*4+2];
      if(Math.abs(y)<bestY){ bestY=Math.abs(y); best=[x,y,z]; } }
    return Math.atan2(best[0], best[2]);
  }
  var d=boneYaw(__world.bones.head)-boneYaw(__world.bones.spine_03);
  while(d>Math.PI) d-=Math.PI*2; while(d<-Math.PI) d+=Math.PI*2;
  return {cur:+__world.look.cur.toFixed(3), rel:+d.toFixed(3), face:+__world.P.face.toFixed(3),
          anim:__world.animName, fp:+__world.fpBlend.toFixed(2)};})()`;

const place = (x, y, z, face) => ev(`(function(){
  __world.P.pos.set(${x},${y},${z}); __world.vel.set(0,0,0); __world.P.vy=0;
  __world.P.face=${face}; __world.P.faceTarget=${face}; __world.setYaw(${face} - Math.PI); return 1;})()`);

console.log('\n[1] 版本与参数');
ok(/^v0\.\d+\.\d+$/.test(await ev('__worldVersion')), '版本格式（不锁死任何小版本）', await ev('__worldVersion'));
const cfg = await ev('({max:__world.look.max,n:__world.look.neck,h:__world.look.head,on:__world.look.on})');
ok(cfg && cfg.on === true && Math.abs(cfg.max - 1.15) < 1e-6, '视线跟随已开启，上限 1.15rad', cfg);
ok(cfg && Math.abs(cfg.n + cfg.h - 1) < 1e-6, '颈 45% + 头 55% = 100%', cfg);

console.log('\n[2] 站定：身体正对视线，头不用补（v0.14.0 拆枪去掉了 0.5rad 侧身站姿）');
await place(0, 0, 0, Math.PI); await sleep(1000);
let r = await ev(probe);
/* 站定时 faceTarget = camYaw+π，身体已经正对视线，头不该再偏 */
ok(Math.abs(r.cur) < 0.06, `站定头偏 ${r.cur}（≈ 0，身体已正对视线）`, r);

console.log('\n[3] 直走（身体朝相机前方）：头不偏，记基线');
await key('w', true); await sleep(1100);
r = await ev(probe);
const baseRel = r.rel;
ok(Math.abs(r.cur) < 0.06, `直走头偏 ${r.cur}`, r);
ok(r.anim === 'walk' || r.anim === 'run', '在走/跑', r.anim);

console.log('\n[4] 斜走（w+a，身体偏 45°）：头往视线转约 45°');
await key('a', true); await sleep(1100);
r = await ev(probe);
ok(Math.abs(Math.abs(r.cur) - 0.785) < 0.22, `斜走头偏 ${r.cur}（期望 ≈±0.79）`, r);
const relDelta = Math.abs((((r.rel - baseRel) % (Math.PI * 2)) + Math.PI * 3) % (Math.PI * 2) - Math.PI);
ok(Math.abs(relDelta - Math.abs(r.cur)) < 0.25, `头相对脊柱真的转了 ${relDelta.toFixed(2)}（头偏 ${Math.abs(r.cur).toFixed(2)}）`, [relDelta, r.cur]);

console.log('\n[5] 纯侧走（a，身体偏 90°）：头偏被 clamp 在 1.15');
await key('w', false); await key('a', false); await sleep(400);
await place(0, 0, 0, Math.PI); await sleep(700);     /* 回空地，免得贴墙滑行干扰转身判定 */
await key('a', true); await sleep(1200);
r = await ev(probe);
ok(Math.abs(Math.abs(r.cur) - 1.15) < 0.03, `侧走头偏 ${r.cur}（clamp 到 1.15）`, r);

console.log('\n[6] 松手站定：等转身演完，头回落（不再被 clamp）');
await key('a', false);
const S = `(function(){var T=__world.turn;
  return {anim:__world.animName, t:+__world.animT.toFixed(2), dur:+__world.animDur.toFixed(2),
   ry:+__world.animRootYaw.toFixed(2), on:T.on, cool:+T.cool.toFixed(2), st:+T.settle.toFixed(2),
   want:+T.want.toFixed(2), face0:+T.face0.toFixed(2), dir:T.dir,
   face:+__world.P.face.toFixed(2), tgt:+__world.P.faceTarget.toFixed(2),
   sp:+Math.sqrt(__world.vel.x*__world.vel.x+__world.vel.z*__world.vel.z).toFixed(2)};})()`;
for (let i = 0; i < 14; i++) { await sleep(250); console.log('   ', JSON.stringify(await ev(S))); }
r = await ev(probe);
ok(r.anim === 'idle', '转身已演完，回到 idle', r.anim);
ok(Math.abs(r.cur) < 0.7, `站定后头偏 ${r.cur}（回落到侧身补偿的 ~0.5）`, r);

console.log('\n[7] 第一人称：不转头');
await place(0, 0, 0, Math.PI); await sleep(600);
const vm = await gotoView(0);
await key('a', true); await sleep(900);
r = await ev(probe);
await key('a', false);
ok(vm === 0, `已切到第一人称 viewMode=${vm}`, vm);
ok(r.fp > 0.5, `fpBlend=${r.fp}`, r.fp);
ok(Math.abs(r.cur) < 0.05, `第一人称头不偏 ${r.cur}`, r);
await gotoView(2);
ok(await ev('__world.viewMode') === 2, '回到自由视角');

console.log('\n[8] 骨骼无 NaN');
await place(0, 0, 0, Math.PI); await sleep(700);
const bad = await ev(`(function(){var bad=0;for(var n in __world.bones){var q=__world.bones[n].quaternion;
  if(!isFinite(q.x+q.y+q.z+q.w)) bad++;} return bad;})()`);
ok(bad === 0, '全部骨骼四元数无 NaN', bad);

console.log(`\n结果 ${pass} 通过 / ${fail} 失败`);
process.exit(fail ? 1 : 0);
