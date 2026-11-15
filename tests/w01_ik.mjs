/* v0.13.3 脚部两骨 IK 实测：平地 / 屋顶斜面 / 台阶边缘 / 走跑 / 跳跃 / 反关节检查 */
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

let pass = 0, fail = 0;
const ok = (cond, name, extra) => { if (cond) { pass++; console.log('  ✓', name); } else { fail++; console.log('  ✗', name, extra === undefined ? '' : JSON.stringify(extra)); } };

await send('Runtime.enable'); await send('Page.enable');
await send('Emulation.setDeviceMetricsOverride', { width: 900, height: 640, deviceScaleFactor: 1, mobile: false });
await send('Page.navigate', { url: 'http://127.0.0.1:8779/world01.html?s=' + Date.now() });
await sleep(9500);

const READ = `(function(){
  var v=new THREE.Vector3(), out={};
  ['thigh_l','calf_l','foot_l','thigh_r','calf_r','foot_r'].forEach(function(n){
    var b=__world.bones[n]; if(!b) return; b.getWorldPosition(v);
    out[n]=[+v.x.toFixed(3),+v.y.toFixed(3),+v.z.toFixed(3)];
  });
  var p=__world.P.pos;
  out.bodyY=+p.y.toFixed(3); out.onGround=!!__world.P.onGround;
  out.anim=__world.animName; out.fs=JSON.parse(JSON.stringify(__world.footState));
  if(out.foot_l){ out.supL=+__world.supportAt(out.foot_l[0],out.foot_l[2],p.y+0.12).toFixed(3);
                  out.gapL=+(out.foot_l[1]-out.supL).toFixed(3); }
  if(out.foot_r){ out.supR=+__world.supportAt(out.foot_r[0],out.foot_r[2],p.y+0.12).toFixed(3);
                  out.gapR=+(out.foot_r[1]-out.supR).toFixed(3); }
  /* 鞋底（ball 骨）离地差：这是"看起来有没有穿模"的真正判据 */
  ['ball_l','ball_r'].forEach(function(n){ var b=__world.bones[n]; if(!b) return; b.getWorldPosition(v);
    var k=n==='ball_l'?'ballGapL':'ballGapR';
    out[k]=+(v.y-__world.supportAt(v.x,v.z,p.y+0.12)).toFixed(3); });
  /* 膝盖是否反关节：膝盖相对"髋→踝"连线的横向偏移，应该和脚朝前方向一致（这里只查非 NaN + 膝在髋踝连线上方） */
  function ang(A,B,C){ /* 膝角 ∠ABC */
    var u=[A[0]-B[0],A[1]-B[1],A[2]-B[2]], w=[C[0]-B[0],C[1]-B[1],C[2]-B[2]];
    var dot=u[0]*w[0]+u[1]*w[1]+u[2]*w[2];
    var lu=Math.sqrt(u[0]*u[0]+u[1]*u[1]+u[2]*u[2]), lw=Math.sqrt(w[0]*w[0]+w[1]*w[1]+w[2]*w[2]);
    return +(Math.acos(Math.max(-1,Math.min(1,dot/(lu*lw))))*57.2958).toFixed(1);
  }
  if(out.thigh_l&&out.calf_l&&out.foot_l) out.kneeL=ang(out.thigh_l,out.calf_l,out.foot_l);
  if(out.thigh_r&&out.calf_r&&out.foot_r) out.kneeR=ang(out.thigh_r,out.calf_r,out.foot_r);
  var qs=0, bad=0;
  for(var n in __world.bones){ var q=__world.bones[n].quaternion; qs++;
    if(!isFinite(q.x+q.y+q.z+q.w)) bad++; }
  out.badQ=bad; out.nBones=qs;
  return out;})()`;

const ROOF = `(function(){
  var cs=window.__colliders, roof=null;
  for(var i=0;i<cs.length;i++) if(cs[i].kind==='roof'){ roof=cs[i]; break; }
  window.__roof = roof;
  return {x:roof.x,z:roof.z,hw:roof.hw,base:roof.base,rise:roof.rise,
          slopeDeg:+(Math.atan2(roof.rise,roof.hw)*57.2958).toFixed(1)};
})()`;

const place = (x, y, z, face) => ev(`(function(){
  __world.P.pos.set(${x},${y},${z});
  __world.vel.set(0,0,0); __world.P.vy=0;
  ${face === undefined ? '' : '__world.P.face=' + face + '; __world.P.faceTarget=' + face + ';'}
  return 1;})()`);

console.log('\n[1] 版本与参数');
ok(/^v0\.\d+\.\d+$/.test(await ev('__worldVersion')), '版本格式合法 ' + await ev('__worldVersion'));
const cfg = await ev('({a:__world.ikCfg.ankleH,r:__world.ikCfg.rise,d:__world.ikCfg.drop,t:__world.ikCfg.tiltMax})');
ok(cfg && Math.abs(cfg.a - 0.10) < 0.001, '踝高基准 0.100m', cfg);

console.log('\n[2] 平地：两脚踝都落在支撑面 +0.100');
await place(0, 0, 0, Math.PI); await sleep(700);
let r = await ev(READ);
ok(Math.abs(r.gapL - 0.10) < 0.012, `左脚 gap=${r.gapL}`, r);
ok(Math.abs(r.gapR - 0.10) < 0.012, `右脚 gap=${r.gapR}`, r);
ok(Math.abs(r.fs.tiltL) < 0.03 && Math.abs(r.fs.tiltR) < 0.03, '平地脚掌不倾斜', [r.fs.tiltL, r.fs.tiltR]);
ok(r.kneeL > 150 && r.kneeL < 180 && r.kneeR > 150 && r.kneeR < 180, `平地上膝盖近伸直 ${r.kneeL}/${r.kneeR}`);
ok(r.ballGapL > -0.02 && r.ballGapL < 0.03 && r.ballGapR > -0.02 && r.ballGapR < 0.03, `平地鞋底贴地 ${r.ballGapL}/${r.ballGapR}`);
ok(r.badQ === 0, '骨骼四元数无 NaN', r.badQ);

console.log('\n[3] 屋顶斜面（坡度 ' + JSON.stringify(await ev(ROOF)).replace(/^.*slopeDeg":"?([\d.]+).*$/, '$1') + '°）');
const roof = await ev(ROOF);
await place(roof.x + 0.55, roof.base + roof.rise + 0.35, roof.z, Math.PI); await sleep(1500);
r = await ev(READ);
ok(r.onGround === true, '站在屋顶上', r.onGround);
ok(Math.abs(r.gapL - 0.10) < 0.02, `斜坡左脚贴地 gap=${r.gapL}`, r);
ok(Math.abs(r.gapR - 0.10) < 0.02, `斜坡右脚贴地 gap=${r.gapR}`, r);
ok(Math.abs(r.gapL - r.gapR) < 0.02, `两脚贴地一致 差 ${(r.gapL - r.gapR).toFixed(3)}m`, [r.gapL, r.gapR]);
ok(Math.abs(r.kneeL - r.kneeR) > 1.0, `两膝弯曲不同（一腿在坡上一腿在下） ${r.kneeL}/${r.kneeR}`);
ok(r.fs.tiltL > 0.05 || r.fs.tiltR > 0.05, '至少一只脚贴了坡面', [r.fs.tiltL, r.fs.tiltR]);
ok(r.ballGapL > -0.03 && r.ballGapR > -0.03, `斜坡上鞋底不穿模 ${r.ballGapL}/${r.ballGapR}`);
ok(Math.abs(r.ballGapL - r.ballGapR) < 0.03, `斜坡两脚鞋底同高 ${r.ballGapL}/${r.ballGapR}`);
ok(Math.abs(r.badQ) === 0, '骨骼四元数无 NaN', r.badQ);

console.log('\n[4] 台阶边缘：脚下支撑不同，脚不许穿模');
await place(roof.x + roof.hw * 0.70, roof.base + roof.rise * 0.45 + 0.35, roof.z + 0.3, Math.PI); await sleep(1500);
r = await ev(READ);
ok(r.gapL > 0.06 && r.gapR > 0.06, `坡边两脚都没穿地 ${r.gapL}/${r.gapR}`, r);
ok(Math.abs(r.gapL - 0.10) < 0.03 && Math.abs(r.gapR - 0.10) < 0.03, `坡边两脚仍贴地 ${r.gapL}/${r.gapR}`);

console.log('\n[5] 走 / 跑：脚在摆动中不许被拉回地面');
/* 朝 +z 走（背对房子）：朝 -z 走 2 秒会撞上房子触发自动攀爬，攀爬会每帧改写 P.pos，
   传送都无效，后面的跳跃用例就会读到 mantle。 */
await place(0, 0, 0, 0); await sleep(500);
await key('w', true); await sleep(700);
r = await ev(READ);
const walkAnim = r.anim;
ok(walkAnim === 'walk' || walkAnim === 'run', '进入走/跑循环', walkAnim);
let minGap = 9, maxQ = 0;
for (let i = 0; i < 12; i++) {
  await sleep(70);
  const s = await ev(READ);
  minGap = Math.min(minGap, s.gapL, s.gapR);
  maxQ = Math.max(maxQ, s.badQ);
}
await key('w', false);
ok(minGap > -0.03, `走动中脚最深只到 ${minGap.toFixed(3)}m（不许明显陷地）`);
ok(maxQ === 0, '走动中骨骼无 NaN', maxQ);

console.log('\n[6] 跳跃 / 落地');
await place(0, 0, 0, 0); await sleep(600);
for (let i = 0; i < 10 && await ev('!!__world.climbState'); i++) await sleep(200);
ok(!(await ev('!!__world.climbState')), '不在攀爬状态（否则传送会被攀爬逻辑吃掉）');
await ev('window.dispatchEvent(new KeyboardEvent("keydown",{key:" "}));window.dispatchEvent(new KeyboardEvent("keyup",{key:" "}))');
await sleep(120);
const air = await ev(READ);
ok(air.onGround === false, '起跳离地', air);
ok(air.badQ === 0, '空中无 NaN', air.badQ);
await sleep(1400);
r = await ev(READ);
ok(r.onGround === true, '落地回到地面', r);
ok(Math.abs(r.gapL - 0.10) < 0.02 && Math.abs(r.gapR - 0.10) < 0.02, `落地后两脚贴地 ${r.gapL}/${r.gapR}`, r);

console.log('\n[7] 悬空 / 掉下平台：不许把腿拉成橡皮');
await ev(`__world.P.pos.set(0, 6, 0); __world.vel.set(0,0,0); __world.P.vy=0;`); await sleep(200);
r = await ev(READ);
ok(r.badQ === 0, '空中骨骼无 NaN', r.badQ);
ok(isFinite(r.kneeL) && r.kneeL > 3 && r.kneeL < 180, `空中膝角正常 ${r.kneeL}`);

console.log(`\n结果 ${pass} 通过 / ${fail} 失败`);
process.exit(fail ? 1 : 0);
