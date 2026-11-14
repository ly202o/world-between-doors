// 烘焙 ALS 动画 -> 真骨架的绝对局部旋转（Three 坐标四元数）
// 用法: node bake_full.cjs
const fs = require('fs'), zlib = require('zlib');
const path = require('path');

const SRC = 'D:/temp/als_anim_out';
const FALLBACK_SRC = 'D:/VibeCoding/游戏开发/world01/refs/anim_fbx';
const OUTJS = 'D:/VibeCoding/游戏开发/world01/tools/anim/_anims.js';

function parseFBX(file) {
  const buf = fs.readFileSync(file);
  function readNode(p) {
    const end = buf.readUInt32LE(p), np = buf.readUInt32LE(p + 4), nl = buf.readUInt8(p + 12);
    if (end === 0) return null;
    const name = buf.toString('ascii', p + 13, p + 13 + nl); let q = p + 13 + nl; const props = [];
    for (let i = 0; i < np; i++) {
      const t = String.fromCharCode(buf.readUInt8(q)); q++;
      if (t === 'Y') { props.push(buf.readInt16LE(q)); q += 2; }
      else if (t === 'C') { props.push(buf.readUInt8(q) !== 0); q += 1; }
      else if (t === 'I') { props.push(buf.readInt32LE(q)); q += 4; }
      else if (t === 'F') { props.push(buf.readFloatLE(q)); q += 4; }
      else if (t === 'D') { props.push(buf.readDoubleLE(q)); q += 8; }
      else if (t === 'L') { props.push(Number(buf.readBigInt64LE(q))); q += 8; }
      else if (t === 'S') { const l = buf.readUInt32LE(q); q += 4; props.push(buf.toString('utf8', q, q + l)); q += l; }
      else if (t === 'R') { const l = buf.readUInt32LE(q); q += 4; props.push(buf.slice(q, q + l)); q += l; }
      else if ('fdlib'.includes(t)) {
        const n = buf.readUInt32LE(q); q += 4; const e = buf.readUInt32LE(q); q += 4; const cl = buf.readUInt32LE(q); q += 4;
        let d = buf.slice(q, q + cl); q += cl; if (e === 1) d = zlib.inflateSync(d); let a;
        if (t === 'd') { a = new Float64Array(n); for (let k = 0; k < n; k++) a[k] = d.readDoubleLE(k * 8); }
        else if (t === 'f') { a = new Float32Array(n); for (let k = 0; k < n; k++) a[k] = d.readFloatLE(k * 4); }
        else if (t === 'i') { a = new Int32Array(n); for (let k = 0; k < n; k++) a[k] = d.readInt32LE(k * 4); }
        else if (t === 'l') { a = new Float64Array(n); for (let k = 0; k < n; k++) a[k] = Number(d.readBigInt64LE(k * 8)); }
        else a = Array.from(d); props.push(a);
      }
    }
    const ch = []; let r = q;
    while (r < end - 12) { const c = readNode(r); if (!c || c.next <= r) break; ch.push(c.node); r = c.next; }
    return { node: { name, props, children: ch }, next: end };
  }
  const tops = []; let tp = 27;
  while (tp < buf.length - 13) { const n = readNode(tp); if (!n || n.next <= tp) break; tops.push(n.node); tp = n.next; }
  return { objects: tops.find(t => t.name === 'Objects'), connections: tops.find(t => t.name === 'Connections') };
}

// ---------- 四元数 ----------
function quatMul(a, b) { const [ax, ay, az, aw] = a, [bx, by, bz, bw] = b; return [aw * bx + ax * bw + ay * bz - az * by, aw * by - ax * bz + ay * bw + az * bx, aw * bz + ax * by - ay * bx + az * bw, aw * bw - ax * bx - ay * by - az * bz]; }
function quatConj(q) { return [-q[0], -q[1], -q[2], q[3]]; }
function quatNorm(q) { const l = Math.hypot(q[0], q[1], q[2], q[3]) || 1; return [q[0] / l, q[1] / l, q[2] / l, q[3] / l]; }
function axisQuat(axis, deg) { const h = deg * Math.PI / 360, s = Math.sin(h), c = Math.cos(h); return axis === 'x' ? [s, 0, 0, c] : axis === 'y' ? [0, s, 0, c] : [0, 0, s, c]; }
// FBX eEulerXYZ = Rz·Ry·Rx（X 先施加）
function eulerXYZquat(dx, dy, dz) { return quatNorm(quatMul(quatMul(axisQuat('z', dz), axisQuat('y', dy)), axisQuat('x', dx))); }
// FBX -> Three：q' = m ⊗ q ⊗ m⁻¹，m = Rx(-90°)
const MQ = [-Math.SQRT1_2, 0, 0, Math.SQRT1_2];
function toThreeQ(q) { return quatNorm(quatMul(quatMul(MQ, q), quatConj(MQ))); }
function toThreeV(v, scale) { return [v[0] * scale, v[2] * scale, -v[1] * scale]; }

const KTIME = 46186158000;
const SCALE = 0.01;

// 绑定姿态（来自 rig 数据），用于判断"这个姿势是否和绑定不同"
const BIND = {};
const RIGBONE = [];
let RIGPAR = {};
{
  const code = fs.readFileSync('D:/VibeCoding/游戏开发/world01/tools/anim/_rig.js', 'utf8');
  const g = { window: {} };
  new Function('window', code)(g.window);
  for (const b of g.window.__RIG.bones) BIND[b.n] = b.q;
  g.window.__RIG.bones.forEach((b, i) => { RIGBONE[i] = b; RIGPAR[b.n] = b.p; });
}
function angDeg(a, b) {
  const dot = Math.abs(a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3]);
  return 2 * Math.acos(Math.min(1, dot)) * 180 / Math.PI;
}

// ---------- FK：算脚骨每帧世界高度，用来取脚步触地时刻 ----------
function quatToMat(q) { // col-major 4x4
  const [x, y, z, w] = q;
  const x2 = x + x, y2 = y + y, z2 = z + z;
  const xx = x * x2, xy = x * y2, xz = x * z2;
  const yy = y * y2, yz = y * z2, zz = z * z2;
  const wx = w * x2, wy = w * y2, wz = w * z2;
  return [1 - (yy + zz), xy + wz, xz - wy, 0,
    xy - wz, 1 - (xx + zz), yz + wx, 0,
    xz + wy, yz - wx, 1 - (xx + yy), 0,
    0, 0, 0, 1];
}
function matMul(a, b) { // a*b, col-major
  const o = new Array(16);
  for (let c = 0; c < 4; c++) for (let r = 0; r < 4; r++) {
    let s = 0; for (let k = 0; k < 4; k++) s += a[k * 4 + r] * b[c * 4 + k];
    o[c * 4 + r] = s;
  }
  return o;
}
function withPos(m, t) {
  const o = m.slice(); o[12] = t[0]; o[13] = t[1]; o[14] = t[2]; return o;
}
function footHeights(poseQuats, nF) {
  const out = { foot_l: [], foot_r: [] };
  const names = RIGBONE.map(b => b.n);
  const world = {};
  for (let f = 0; f < nF; f++) {
    for (let i = 0; i < RIGBONE.length; i++) {
      const b = RIGBONE[i];
      const q = poseQuats[b.n] ? poseQuats[b.n][f] : b.q;
      const local = withPos(quatToMat(q), b.t);
      world[b.n] = b.p >= 0 ? matMul(world[RIGBONE[b.p].n] || [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1], local) : local;
    }
    out.foot_l.push(world.foot_l[13]);
    out.foot_r.push(world.foot_r[13]);
  }
  return out;
}
function findSteps(heightArr, times, dur) {
  const n = heightArr.length;
  const min = Math.min(...heightArr), max = Math.max(...heightArr);
  const thr = min + Math.max(0.010, (max - min) * 0.08);
  const cand = [];
  for (let i = 0; i < n; i++) {
    const a = heightArr[(i - 1 + n) % n], b = heightArr[i], c = heightArr[(i + 1) % n];
    if (b <= thr && b <= a && b <= c) cand.push({ t: times[i], y: b });
  }
  cand.sort((p, q) => p.t - q.t);
  const merged = [];
  for (const c of cand) {
    const last = merged[merged.length - 1];
    if (last && c.t - last.t < 0.16) { if (c.y < last.y) merged[merged.length - 1] = c; }
    else merged.push(c);
  }
  // 首尾跨循环重复：合成一次
  if (merged.length > 1) {
    const gap = (dur - merged[merged.length - 1].t) + merged[0].t;
    if (gap < 0.18) {
      if (merged[0].y <= merged[merged.length - 1].y) merged.pop();
      else merged.shift();
    }
  }
  return merged.map(c => c.t);
}

function modelRest(model) {
  const out = { t: [0, 0, 0], r: [0, 0, 0] };
  const p70 = model.children.find(c => c.name === 'Properties70');
  if (!p70) return out;
  for (const p of p70.children) {
    const nm = String(p.props[0]).replace(/\s+/g, '');
    if (nm !== 'LclTranslation' && nm !== 'LclRotation') continue;
    const nums = p.props.filter(x => typeof x === 'number' && isFinite(x));
    if (nums.length < 3) continue;
    const v = nums.slice(-3);
    if (nm === 'LclTranslation') out.t = v; else out.r = v;
  }
  return out;
}

// ---------- 主提取 ----------
function extractAnim(file, limitF, wantRoot) {
  const { objects, connections } = parseFBX(file);
  const models = objects.children.filter(c => c.name === 'Model');
  const acns = objects.children.filter(c => c.name === 'AnimationCurveNode');
  const curves = objects.children.filter(c => c.name === 'AnimationCurve');
  const byId = {}; for (const o of objects.children) byId[o.props[0]] = o;
  const nameById = {}; for (const m of models) nameById[m.props[0]] = String(m.props[1]).replace(/[^A-Za-z0-9_].*$/, '');

  const nodeOfCurve = {}, chanOfCurve = {};
  for (const c of connections.children) {
    if (c.props[0] === 'OP' && byId[c.props[1]] && byId[c.props[1]].name === 'AnimationCurve') {
      nodeOfCurve[c.props[1]] = c.props[2];
      chanOfCurve[c.props[1]] = String(c.props[3]).slice(-1);
    }
  }
  const targetOfNode = {}, propOfNode = {};
  for (const c of connections.children) {
    if (c.props[0] === 'OP' && byId[c.props[1]] && byId[c.props[1]].name === 'AnimationCurveNode') {
      targetOfNode[c.props[1]] = c.props[2];
      const pn = String(c.props[3]);
      propOfNode[c.props[1]] = pn.indexOf('Translation') >= 0 ? 'T' : pn.indexOf('Rotation') >= 0 ? 'R' : pn.indexOf('Scaling') >= 0 ? 'S' : 'C';
    }
  }
  const curveData = {};
  for (const c of curves) {
    let times = null, vals = null;
    for (const ch of c.children) { if (ch.name === 'KeyTime') times = ch.props[0]; if (ch.name === 'KeyValueFloat') vals = ch.props[0]; }
    if (times && vals) curveData[c.props[0]] = { times: Array.from(times), vals: Array.from(vals) };
  }

  const bones = {};
  for (const n of acns) {
    const nid = n.props[0], target = targetOfNode[nid], prop = propOfNode[nid];
    if (!target || !byId[target] || (prop !== 'T' && prop !== 'R')) continue;
    const boneName = nameById[target];
    if (!bones[boneName]) bones[boneName] = { t: {}, r: {} };
    const chans = { X: null, Y: null, Z: null };
    for (const c of connections.children) {
      if (c.props[0] === 'OP' && c.props[2] === nid && curveData[c.props[1]]) chans[chanOfCurve[c.props[1]]] = curveData[c.props[1]];
    }
    if (prop === 'T') bones[boneName].t = chans;
    if (prop === 'R') bones[boneName].r = chans;
  }

  let refTimes = null;
  for (const b of Object.values(bones)) { for (const ch of Object.values(b.r)) { if (ch) { refTimes = ch.times; break; } } if (refTimes) break; }
  let frames = refTimes ? refTimes.map(t => t / KTIME) : [0];
  if (limitF && frames.length > limitF) frames = frames.slice(0, limitF); // 起跳片段只用前段，后面裁掉省体积
  const nF = frames.length;
  const sample = (ch, i) => ch ? ch.vals[i % ch.vals.length] : 0;

  // 每骨绝对局部旋转（Three 空间）
  const outBones = {};
  for (const [boneName, data] of Object.entries(bones)) {
    if (!data.r.X && !data.r.Y && !data.r.Z) continue; // 无旋转曲线
    if (/thumb|index_|middle_|ring_|pinky_/.test(boneName)) continue; // 手指：这个尺度上看不见，跳过
    const q = new Float32Array(nF * 4);
    let maxDev = 0; // 相对首帧的最大角偏（度）
    for (let i = 0; i < nF; i++) {
      const ex = sample(data.r.X, i), ey = sample(data.r.Y, i), ez = sample(data.r.Z, i);
      const qa = toThreeQ(eulerXYZquat(ex, ey, ez));
      q[i * 4] = +qa[0].toFixed(3); q[i * 4 + 1] = +qa[1].toFixed(3);
      q[i * 4 + 2] = +qa[2].toFixed(3); q[i * 4 + 3] = +qa[3].toFixed(3);
      if (i > 0) maxDev = Math.max(maxDev, angDeg(qa, [q[0], q[1], q[2], q[3]]));
    }
    // 与绑定姿态的差
    const bind = BIND[boneName];
    const bindDiff = bind ? angDeg([q[0], q[1], q[2], q[3]], bind) : 0;
    if (maxDev < 2.0 && bindDiff < 3.0) continue; // 既不动也和绑定姿态一致的骨，不带走
    if (maxDev < 2.0) { outBones[boneName] = [q[0], q[1], q[2], q[3]]; continue; } // 静止姿势：单帧
    outBones[boneName] = Array.from(q);
  }

  // 脚步时刻：先用全部骨骼算出脚骨高度（不参与落地判定的骨也要在里面）
  const poseQuats = {};
  for (const [bn, data] of Object.entries(bones)) {
    if (!data.r.X && !data.r.Y && !data.r.Z) continue;
    const arr = [];
    for (let i = 0; i < nF; i++) arr.push(toThreeQ(eulerXYZquat(sample(data.r.X, i), sample(data.r.Y, i), sample(data.r.Z, i))));
    poseQuats[bn] = arr;
  }
  let steps = [];
  if (nF > 4) {
    const fh = footHeights(poseQuats, nF);
    const sl = findSteps(fh.foot_l, frames, frames[frames.length - 1]).map(t => [+t.toFixed(3), 0]);
    const sr = findSteps(fh.foot_r, frames, frames[frames.length - 1]).map(t => [+t.toFixed(3), 1]);
    steps = sl.concat(sr).sort((a, b) => a[0] - b[0]);
  }

  // pelvis 上下起伏（水平位移丢弃）
  let bob = null;
  const pt = bones['pelvis'] && bones['pelvis'].t;
  if (pt && (pt.X || pt.Y || pt.Z)) {
    const base = toThreeV([sample(pt.X, 0), sample(pt.Y, 0), sample(pt.Z, 0)], SCALE)[1];
    bob = [];
    for (let i = 0; i < nF; i++) {
      const v = toThreeV([sample(pt.X, i), sample(pt.Y, i), sample(pt.Z, i)], SCALE);
      bob.push(+(v[1] - base).toFixed(3));
    }
  }
  /* root motion（v0.12.6）：撑上/翻越这类动作原本带整段位移。之前只留了竖直 bob、
     水平被丢掉，位移由代码插值，腿的节奏和身体速度对不上 → 脚在墙面/地面上拖（滑步）。
     这里把根骨相对首帧的位移烘出来，按 [前, 上, 侧] 三个分量存，位移交给动画驱动。 */
  let root = null, rootBone = null;
  if (wantRoot) {
    for (const bn of ['root', 'pelvis']) {
      const t = bones[bn] && bones[bn].t;
      if (!t || !(t.X || t.Y || t.Z)) continue;
      const p0 = toThreeV([sample(t.X, 0), sample(t.Y, 0), sample(t.Z, 0)], SCALE);
      const p1 = toThreeV([sample(t.X, nF - 1), sample(t.Y, nF - 1), sample(t.Z, nF - 1)], SCALE);
      if (Math.hypot(p1[0] - p0[0], p1[1] - p0[1], p1[2] - p0[2]) < 0.05) continue;  /* 5cm 都没有不算根骨 */
      rootBone = bn;
      root = [];
      for (let i = 0; i < nF; i++) {
        const v = toThreeV([sample(t.X, i), sample(t.Y, i), sample(t.Z, i)], SCALE);
        root.push([+(v[0] - p0[0]).toFixed(3), +(v[1] - p0[1]).toFixed(3), +(v[2] - p0[2]).toFixed(3)]);
      }
      break;
    }
  }
  return { dur: +(frames[frames.length - 1]).toFixed(4), n: nF, bones: outBones, bob, steps, root, rootBone };
}

const ANIMS = {
  idle: 'ALS_N_Pose.fbx',
  walk: 'ALS_N_Walk_F.fbx',
  run: 'ALS_N_Run_F.fbx',
  sprint: 'ALS_N_Sprint_F.fbx',
  jumpWalkL: 'ALS_N_JumpWalk_LF.fbx',
  jumpWalkR: 'ALS_N_JumpWalk_RF.fbx',
  jumpRunL: 'ALS_N_JumpRun_LF.fbx',
  jumpRunR: 'ALS_N_JumpRun_RF.fbx',
  fall: 'ALS_N_FallLoop.fbx',
  fallFast: 'ALS_N_FallLoop_Fast.fbx',
  landLight: 'ALS_N_Land_Light.fbx',
  landHeavy: 'ALS_N_Land_Heavy.fbx',
  /* 攀爬（v0.11.40）：ALS 的撑上 1m 障碍，右手撑版本。
     LH/RH 是按哪只手先撑分的，这里统一用 RH；完整片段比跳跃长，不裁帧。 */
  mantle: 'ALS_N_Mantle_1m_RH.fbx',
  /* 高墙攀爬（v0.12.5）：ALS 的撑上 2m 障碍。按墙高在 1m / 2m 之间选动作，
     不再用 1m 动作硬拉高墙（那会出现"够到了再平移上去"的怪动作）。 */
  mantle2: 'ALS_N_Mantle_2m.fbx'
};

const result = {};
const LIMIT = { jumpWalkL: 22, jumpWalkR: 22, jumpRunL: 22, jumpRunR: 22 }; /* 起跳只用 ~0.7s，其余裁掉 */
const WANT_ROOT = { mantle: 1, mantle2: 1 };  /* 只有攀爬类需要 root motion */
for (const [key, file] of Object.entries(ANIMS)) {
  let p = path.join(SRC, file);
  if (!fs.existsSync(p)) p = path.join(FALLBACK_SRC, file);
  const a = extractAnim(p, LIMIT[key], !!WANT_ROOT[key]);
  result[key] = a;
  console.log(key, 'dur=' + a.dur, 'frames=' + a.n, 'bones=' + Object.keys(a.bones).length, 'steps=' + a.steps.length,
    a.root ? ('root@' + a.rootBone + ' Δ=' + JSON.stringify(a.root[a.root.length - 1])) : 'root=无');
}
fs.writeFileSync(OUTJS, 'window.__ANIMS=' + JSON.stringify(result) + ';');
console.log('written', OUTJS, (fs.statSync(OUTJS).size / 1024).toFixed(0) + 'KB');
