// 烘焙 ALS 动画 FBX -> 精简 JSON（局部旋转 delta，Three 空间四元数）
// 用法: node _bake_anim.cjs
const fs = require('fs'), zlib = require('zlib');
const path = require('path');

const SRC = 'D:/temp/als_anim_out';
const OUTJS = 'D:/VibeCoding/游戏开发/world01/tools/anim/_anims.js';

// ---------- FBX 二进制解析 ----------
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

// ---------- 四元数工具 ----------
function quatMul(a, b) { // a*b
  const [ax, ay, az, aw] = a, [bx, by, bz, bw] = b;
  return [
    aw * bx + ax * bw + ay * bz - az * by,
    aw * by - ax * bz + ay * bw + az * bx,
    aw * bz + ax * by - ay * bx + az * bw,
    aw * bw - ax * bx - ay * by - az * bz
  ];
}
function quatConj(q) { return [-q[0], -q[1], -q[2], q[3]]; }
function quatNorm(q) {
  const l = Math.hypot(q[0], q[1], q[2], q[3]) || 1;
  return [q[0] / l, q[1] / l, q[2] / l, q[3] / l];
}
// Euler XYZ（度）-> 四元数：FBX eEulerXYZ = Rz·Ry·Rx（X 先施加）
function axisQuat(axis, deg) {
  const h = deg * Math.PI / 360, s = Math.sin(h), c = Math.cos(h);
  return axis === 'x' ? [s, 0, 0, c] : axis === 'y' ? [0, s, 0, c] : [0, 0, s, c];
}
function eulerXYZquat(dx, dy, dz) {
  return quatNorm(quatMul(quatMul(axisQuat('z', dz), axisQuat('y', dy)), axisQuat('x', dx)));
}
// FBX 空间 -> Three 空间：(x,y,z)->(x,z,-y)，即 M = Rx(-90°)，proper rotation
// 四元数转换：q' = m ⊗ q ⊗ m⁻¹
const MQ = [-Math.SQRT1_2, 0, 0, Math.SQRT1_2];
function toThreeQ(q) { return quatNorm(quatMul(quatMul(MQ, q), quatConj(MQ))); }
function toThreeV(v, scale) {
  return [v[0] * scale, v[2] * scale, -v[1] * scale];
}

// ---------- 提取 ----------
const KTIME = 46186158000; // FBX KTime per second
const SCALE = 0.01;        // cm -> m

function modelRest(model) {
  // Properties70 > P：props = [名字, 类型, 标签, 标志, 值×3]，值取末尾 3 个数值
  const out = { t: [0, 0, 0], r: [0, 0, 0] };
  const p70 = model.children.find(c => c.name === 'Properties70');
  if (!p70) return out;
  for (const p of p70.children) {
    const nm = String(p.props[0]).replace(/\s+/g, ''); // "Lcl Rotation" -> "LclRotation"
    if (nm !== 'LclTranslation' && nm !== 'LclRotation') continue;
    const nums = p.props.filter(x => typeof x === 'number' && isFinite(x));
    if (nums.length < 3) continue;
    const v = nums.slice(-3);
    if (nm === 'LclTranslation') out.t = v; else out.r = v;
  }
  return out;
}

function extractAnim(file) {
  const { objects, connections } = parseFBX(file);
  const models = objects.children.filter(c => c.name === 'Model');
  const acns = objects.children.filter(c => c.name === 'AnimationCurveNode');
  const curves = objects.children.filter(c => c.name === 'AnimationCurve');

  const byId = {}; for (const m of objects.children) byId[m.props[0]] = m;
  const nameById = {}; for (const m of models) nameById[m.props[0]] = String(m.props[1]).replace(/[^A-Za-z0-9_].*$/, '');

  // parent map: OO child->parent among Models
  const parentOf = {};
  for (const c of connections.children) {
    if (c.props[0] === 'OO' && byId[c.props[1]] && byId[c.props[2]]) {
      const child = c.props[1], par = c.props[2];
      if (byId[child].name === 'Model' && byId[par].name === 'Model') parentOf[child] = par;
    }
  }

  // curve -> curveNode -> (model, channel)
  const nodeOfCurve = {};
  const chanOfCurve = {};
  for (const c of connections.children) {
    if (c.props[0] === 'OP' && byId[c.props[1]] && byId[c.props[1]].name === 'AnimationCurve') {
      nodeOfCurve[c.props[1]] = c.props[2];
      chanOfCurve[c.props[1]] = String(c.props[3]).slice(-1); // 'd|X' -> 'X'
    }
  }
  const targetOfNode = {}, propOfNode = {};
  for (const c of connections.children) {
    if (c.props[0] === 'OP' && byId[c.props[1]] && byId[c.props[1]].name === 'AnimationCurveNode') {
      targetOfNode[c.props[1]] = c.props[2];
      const pn = String(c.props[3]);
      propOfNode[c.props[1]] = pn.indexOf('Translation') >= 0 ? 'LclTranslation'
        : pn.indexOf('Rotation') >= 0 ? 'LclRotation'
        : pn.indexOf('Scaling') >= 0 ? 'LclScaling' : pn; // 自定义曲线原名
    }
  }

  // read curves: { id: {times, vals} }
  const curveData = {};
  for (const c of curves) {
    let times = null, vals = null;
    for (const ch of c.children) {
      if (ch.name === 'KeyTime') times = ch.props[0];
      if (ch.name === 'KeyValueFloat') vals = ch.props[0];
    }
    if (times && vals) curveData[c.props[0]] = { times: Array.from(times), vals: Array.from(vals) };
  }

  // gather per-bone local T & R curves
  const bones = {};
  for (const n of acns) {
    const nid = n.props[0];
    const target = targetOfNode[nid], prop = propOfNode[nid];
    if (!target || !byId[target]) continue;
    const boneName = nameById[target];
    if (!bones[boneName]) bones[boneName] = { t: {}, r: {} };
    const chans = { X: null, Y: null, Z: null };
    for (const c of connections.children) {
      if (c.props[0] === 'OP' && c.props[2] === nid && curveData[c.props[1]]) {
        chans[chanOfCurve[c.props[1]]] = curveData[c.props[1]];
      }
    }
    if (prop === 'LclTranslation') bones[boneName].t = chans;
    if (prop === 'LclRotation') bones[boneName].r = chans;
  }

  // 时间轴：取任意曲线的时间（30fps 均匀）
  let refTimes = null;
  for (const b of Object.values(bones)) {
    for (const ch of Object.values(b.r)) { if (ch) { refTimes = ch.times; break; } }
    if (refTimes) break;
  }
  if (!refTimes) {
    // 静态姿势：无曲线，单帧 rest delta = identity
    const out = {};
    for (const [boneName] of Object.entries(bones)) {
      out[boneName] = { q: [0, 0, 0, 1] };
    }
    out.__stride = 0;
    out.__hipsT = [[0, 0, 0]];
    return { frames: [0], out };
  }
  const frames = refTimes.map(t => t / KTIME);
  const nF = frames.length;

  const restCache = {};
  function rest(name) {
    if (!restCache[name]) {
      // rest 一律取模板文件（walk）里的绑定姿态，动画文件自身可能不写
      if (REST_MAP[name]) restCache[name] = REST_MAP[name];
      else {
        const m = models.find(mm => nameById[mm.props[0]] === name);
        restCache[name] = m ? modelRest(m) : { t: [0, 0, 0], r: [0, 0, 0] };
      }
    }
    return restCache[name];
  }

  function sample(ch, i) {
    if (!ch) return 0;
    return ch.vals[i % ch.vals.length];
  }

  // 烘焙每骨旋转四元数 + pelvis 平移
  // 关键：我们的骨架组挂在 "rest 世界朝向" 的组里（组自身无 rest 旋转），
  // 而 FBX 的局部 delta 表达在父骨 rest 坐标系内，必须用父骨 rest 世界旋转共轭：
  //   Q(b) = W_rest(parent) · (R_anim_local · R_rest_local⁻¹) · W_rest(parent)⁻¹
  const idByName = {};
  for (const m of models) idByName[nameById[m.props[0]]] = m.props[0];
  const parentNameOf = {};
  for (const m of models) {
    const nm = nameById[m.props[0]], par = parentOf[m.props[0]];
    parentNameOf[nm] = par ? nameById[par] : null;
  }
  const gRestCache = {};
  function globalRest(name) {
    if (gRestCache[name]) return gRestCache[name];
    const r = rest(name).r;
    const q = eulerXYZquat(r[0], r[1], r[2]);
    const pn = parentNameOf[name];
    gRestCache[name] = pn ? quatMul(globalRest(pn), q) : q;
    return gRestCache[name];
  }

  const out = {};
  for (const [boneName, data] of Object.entries(bones)) {
    if (!KEEP.has(boneName)) continue;
    const restR = rest(boneName).r;
    const qRest = eulerXYZquat(restR[0], restR[1], restR[2]);
    const pn = parentNameOf[boneName];
    const wRestP = pn ? globalRest(pn) : [0, 0, 0, 1];
    const wRestPInv = quatConj(wRestP);
    const qArr = new Float32Array(nF * 4);
    let hasRot = false;
    for (let i = 0; i < nF; i++) {
      const ex = sample(data.r.X, i), ey = sample(data.r.Y, i), ez = sample(data.r.Z, i);
      const qAnim = eulerXYZquat(ex, ey, ez);
      const localDelta = quatMul(qAnim, quatConj(qRest));
      const qWorld = quatNorm(quatMul(quatMul(wRestP, localDelta), wRestPInv));
      const q3 = toThreeQ(qWorld);
      qArr[i * 4] = +q3[0].toFixed(3); qArr[i * 4 + 1] = +q3[1].toFixed(3);
      qArr[i * 4 + 2] = +q3[2].toFixed(3); qArr[i * 4 + 3] = +q3[3].toFixed(3);
      if (ex || ey || ez) hasRot = true;
    }
    if (hasRot || boneName === 'pelvis') out[boneName] = { q: Array.from(qArr) };
  }

  // pelvis 平移：去水平漂移，保留 bob；记录每循环步幅
  const pelvisT = bones['pelvis'] && bones['pelvis'].t;
  const tArr = [];
  let stride = 0;
  if (pelvisT && (pelvisT.X || pelvisT.Y || pelvisT.Z)) {
    let prev = null;
    for (let i = 0; i < nF; i++) {
      const fb = [sample(pelvisT.X, i), sample(pelvisT.Y, i), sample(pelvisT.Z, i)];
      const v = toThreeV(fb, SCALE);
      if (i === 0) { prev = v; stride = 0; }
      tArr.push([0, +(v[1] - toThreeV([sample(pelvisT.X, 0), sample(pelvisT.Y, 0), sample(pelvisT.Z, 0)], SCALE)[1]).toFixed(3), 0]);
      // 累计水平位移（直线距离近似：每帧与上帧的 xz 位移按前进方向累加）
      const dx = v[0] - prev[0], dz = v[2] - prev[2];
      stride += Math.sqrt(dx * dx + dz * dz) * (i === 0 ? 0 : 1);
      prev = v;
    }
    out.__stride = +stride.toFixed(3);
    out.__hipsT = tArr;
  }

  return { frames, out };
}

// ---------- 主流程 ----------
const ANIMS = {
  idle: 'ALS_N_Pose.fbx',
  walk: 'ALS_N_Walk_F.fbx',
  run: 'ALS_N_Run_F.fbx',
  sprint: 'ALS_N_Sprint_F.fbx',
  jump: 'ALS_N_JumpLoop.fbx',
  fall: 'ALS_N_FallLoop.fbx',
  landLight: 'ALS_N_Land_Light.fbx',
  landHeavy: 'ALS_N_Land_Heavy.fbx'
};

// 只保留我们驱动的骨骼（映射到现有 13 关节层级）
const KEEP = new Set([
  'pelvis', 'spine_01', 'spine_02', 'spine_03', 'neck_01', 'head',
  'upperarm_l', 'lowerarm_l', 'hand_l',
  'upperarm_r', 'lowerarm_r', 'hand_r',
  'thigh_l', 'calf_l', 'foot_l',
  'thigh_r', 'calf_r', 'foot_r'
]);

// 全局 rest 表：从 walk 文件读绑定姿态（P 节点里带），供所有动画共用
let REST_MAP = {};
{
  const { objects } = parseFBX(path.join(SRC, 'ALS_N_Walk_F.fbx'));
  for (const m of objects.children.filter(c => c.name === 'Model')) {
    const nm = String(m.props[1]).replace(/[^A-Za-z0-9_].*$/, '');
    REST_MAP[nm] = modelRest(m);
  }
}

const result = {};
for (const [key, file] of Object.entries(ANIMS)) {
  const { frames, out } = extractAnim(path.join(SRC, file));
  result[key] = {
    dur: +(frames[frames.length - 1]).toFixed(4),
    n: frames.length,
    stride: out.__stride || 0,
    hipsT: out.__hipsT || null,
    bones: {}
  };
  for (const [bn, d] of Object.entries(out)) {
    if (bn.startsWith('__')) continue;
    result[key].bones[bn] = d.q;
  }
  console.log(key, 'dur=' + result[key].dur + 's frames=' + result[key].n + ' stride=' + result[key].stride + 'm bones=' + Object.keys(result[key].bones).length);
}

fs.writeFileSync(OUTJS, 'window.__ANIMS=' + JSON.stringify(result) + ';');
console.log('written', OUTJS, (fs.statSync(OUTJS).size / 1024).toFixed(0) + 'KB');
