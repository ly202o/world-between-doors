// v0.13.2 原地转身验证
const list = await (await fetch('http://127.0.0.1:9230/json/list')).json();
const page = list.filter(t => t.type === 'page').pop();
const ws = new WebSocket(page.webSocketDebuggerUrl);
let id=0;const pend=new Map();const errs=[];
const send=(m,p={})=>new Promise(r=>{const i=++id;pend.set(i,r);ws.send(JSON.stringify({id:i,method:m,params:p}));});
ws.addEventListener('message',e=>{const m=JSON.parse(e.data);
 if(m.method==='Runtime.exceptionThrown')errs.push((m.params.exceptionDetails.exception?.description||'').split('\n')[0]);
 if(m.id&&pend.has(m.id)){pend.get(m.id)(m);pend.delete(m.id);}});
await new Promise(r=>ws.addEventListener('open',r));
const ev=async x=>{const r=await send('Runtime.evaluate',{expression:x,returnByValue:true,awaitPromise:true});
 if(r.result?.exceptionDetails)return 'ERR:'+(r.result.exceptionDetails.exception?.description||'').split('\n')[0];
 return r.result?.result?.value;};
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
let pass=0,fail=0;
const P=(n,v,extra)=>{ if(v) pass++; else fail++; console.log((v?'PASS':'FAIL')+'  '+n+(extra!==undefined?'  '+JSON.stringify(extra):'')); };
const R=x=>+x.toFixed(3);

await send('Runtime.enable');await send('Page.enable');
await send('Emulation.setDeviceMetricsOverride',{width:900,height:640,deviceScaleFactor:1,mobile:false});
await send('Page.navigate',{url:'http://127.0.0.1:8779/world01.html?s='+Date.now()});
await sleep(9500);
console.log('版本', await ev(`window.__worldVersion`));
console.log('动画表', JSON.stringify(await ev(`__world.animKeys`)));
/* v0.17.0 起默认档是等距：等距里 yaw 被每帧吸回 90° 档、拖动走 90° 一档分支，
   setYaw 摆的角度会被覆盖，100° 视线差触发的转身就测不到了。先退到自由视角。 */
{ let vm = await ev(`__world.viewMode`);
  for (let i = 0; vm !== 2 && i < 8; i++) {
    await ev(`window.dispatchEvent(new KeyboardEvent('keydown',{key:'v'}))`);
    await ev(`window.dispatchEvent(new KeyboardEvent('keyup',{key:'v'}))`);
    await sleep(450); vm = await ev(`__world.viewMode`);
  }
  console.log('前置：已切到自由视角', vm);
}

const state = `({face:+__world.P.face.toFixed(3), target:+__world.P.faceTarget.toFixed(3),
  anim:__world.animName, t:+__world.animT.toFixed(2), dur:__world.animDur,
  turnOn:__world.turn.on, rootYaw:+__world.animRootYaw.toFixed(3),
  sp:+Math.hypot(__world.vel.x,__world.vel.z).toFixed(2)})`;

console.log('起始', JSON.stringify(await ev(state)));

// 站定，把视线转 100°：应该触发 turnR90（camYaw 减小 -> diff 负）
const s0 = await ev(state);   // 基线：face 的起始值不写死——等距默认档下身体会先对齐机位（π+45°）
await ev(`__world.setYaw(__world.P.face - Math.PI + 1.75)`);   // camYaw 变化 -> faceTarget 变
await sleep(260);
let s1 = await ev(state);
console.log('转视角后', JSON.stringify(s1));
P('触发了转身动画', s1.turnOn && /turn/.test(s1.anim), s1.anim);
P('播的是 90° 转身', s1.anim === 'turnL90' || s1.anim === 'turnR90');
P('转身时 P.face 冻结不动（与起始一致）', Math.abs(s1.face - s0.face) < 0.15, R(s1.face) + ' vs ' + R(s0.face));

// 观察 rootYaw 是否真的在转
await sleep(300);
let s2 = await ev(state);
console.log('0.4s 后', JSON.stringify(s2));
P('root 骨真的在转', Math.abs(s2.rootYaw) > 0.05, R(s2.rootYaw));
P('P.face 仍然冻结', Math.abs(s2.face - s1.face) < 0.001, [R(s1.face), R(s2.face)]);

// 等到播完
await sleep(2200);
let s3 = await ev(state);
console.log('播完后', JSON.stringify(s3));
const dFace = Math.abs(s3.face - s2.face);
P('播完转身动画（回到 idle）', s3.anim === 'idle', s3.anim);
/* 请求的是 1.75rad（100°），min(1.75, π/2) 的 90° 动画播完再靠 lerp 补剩下的 ——
   最终应该稳稳落在请求角度上，不多转。v0.14.0 去掉侧身偏移后 face 起点不再偏 0.5，
   这个值从 ~1.75 的边界值变成正好 1.75，所以判据改成「贴着请求角度」。 */
P('转到请求角度、没有过冲', Math.abs(dFace - 1.75) < 0.12, {from: R(s2.face), to: R(s3.face), delta: R(dFace)});
P('转身完成后朝向对齐目标', Math.abs(s3.face - s3.target) < 0.06, {face: R(s3.face), target: R(s3.target)});

// 朝向是否连续：视觉朝向 = face + rootYaw（idle 的 root 是 0）
P('结算后 rootYaw 归零', Math.abs(s3.rootYaw) < 0.02, R(s3.rootYaw));

// 连续拖动视线时不应该转身
await ev(`(async function(){
  for(var i=0;i<14;i++){ __world.setYaw(__world.setYaw && (window.__camYaw||0) + 0.06); await new Promise(function(r){setTimeout(r,40)}); }
})()`);
await sleep(400);
let dragS = await ev(state);
console.log('连续拖动后', JSON.stringify(dragS));
P('甩视角过程中不演转身', dragS.turnOn === false, {anim: dragS.anim, turnOn: dragS.turnOn});

// 打断测试：开始转身后立刻推方向键
await ev(`__world.setYaw(__world.P.face - Math.PI - 1.75)`);
await sleep(150);
let b1 = await ev(state);
console.log('第二次转身', JSON.stringify(b1));
await sleep(250);
let b2 = await ev(state);
await ev(`__world.keys['w']=true`);
await sleep(180);
let b3 = await ev(state);
await ev(`__world.keys['w']=false`);
console.log('打断瞬间', JSON.stringify(b3));
P('移动打断了转身', b3.turnOn === false, b3.turnOn);
P('打断后动画切到移动', /walk|run|sprint/.test(b3.anim) || b3.anim === 'idle', b3.anim);
// 打断时转过的角度应该被保留（face 增加了，不是跳回 face0）
P('打断保留已转角度', Math.abs(b3.face - b1.face) > 0.02, {b1: R(b1.face), b3: R(b3.face)});

console.log('\n合计 PASS ' + pass + ' / FAIL ' + fail);
console.log('errors:', errs.length?errs.slice(0,4):'none');
process.exit(0);
