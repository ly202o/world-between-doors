// 从 AnimMan.fbx 提取完整蒙皮数据：几何 + 权重 + 骨骼绑定姿态
// 输出 window.__RIG（Three 坐标，米）
const fs = require('fs'), zlib = require('zlib');
const SRC = 'D:/VibeCoding/游戏开发/world01/refs/AnimMan.fbx';
const OUT = 'D:/VibeCoding/游戏开发/world01/tools/anim/_rig.js';

const buf = fs.readFileSync(SRC);
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
const obj = tops.find(t => t.name === 'Objects');
const conn = tops.find(t => t.name === 'Connections');
const byId = {}; for (const o of obj.children) byId[o.props[0]] = o;
const clean = s => String(s).replace(/[^A-Za-z0-9_].*$/, '');

// ---------- 几何 ----------
const geo = obj.children.find(c => c.name === 'Geometry');
const rawV = geo.children.find(c => c.name === 'Vertices').props[0];
const rawI = geo.children.find(c => c.name === 'PolygonVertexIndex').props[0];

const nV = rawV.length / 3;
const pos = new Float32Array(nV * 3);
for (let i = 0; i < nV; i++) {
  pos[i * 3] = rawV[i * 3] * 0.01;
  pos[i * 3 + 1] = rawV[i * 3 + 2] * 0.01;
  pos[i * 3 + 2] = -rawV[i * 3 + 1] * 0.01;
}
const idx = [];
let poly = [];
for (let i = 0; i < rawI.length; i++) {
  const v = rawI[i];
  if (v < 0) {
    poly.push(-v - 1);
    for (let k = 1; k < poly.length - 1; k++) idx.push(poly[0], poly[k], poly[k + 1]);
    poly = [];
  } else poly.push(v);
}
console.log('verts', nV, 'tris', idx.length / 3);

// ---------- 骨骼 ----------
const models = obj.children.filter(c => c.name === 'Model');
const boneModels = models.filter(m => String(m.props[2]) !== 'Mesh' && String(m.props[2]) !== 'Null');
const nameById = {}; for (const m of boneModels) nameById[m.props[0]] = clean(m.props[1]);
const parentIdOf = {};
for (const c of conn.children) {
  if (c.props[0] === 'OO' && byId[c.props[1]] && byId[c.props[2]]) {
    if (byId[c.props[1]].name === 'Model' && byId[c.props[2]].name === 'Model') parentIdOf[c.props[1]] = c.props[2];
  }
}

// TransformLink = 骨骼绑定时的世界矩阵（列主序，单位 cm）
function matOf(cluster) {
  const tl = cluster.children.find(x => x.name === 'TransformLink');
  const m = String(tl.props[0]).split(',').map(Number);
  return m;
}
const clusters = obj.children.filter(c => c.name === 'Deformer' && String(c.props[2]) === 'Cluster');
const clusterOfBone = {}; // boneId -> cluster
for (const cl of clusters) {
  const kid = conn.children.filter(x => x.props[0] === 'OO' && x.props[2] === cl.props[0]).map(x => x.props[1]).filter(x => nameById[x])[0];
  if (kid) clusterOfBone[kid] = cl;
}

// 骨骼顺序：父在前（按深度排序）
const boneIds = boneModels.map(m => m.props[0]);
function depth(id) { let d = 0, p = parentIdOf[id]; while (p && nameById[p]) { d++; p = parentIdOf[p]; } return d; }
boneIds.sort((a, b) => depth(a) - depth(b));
const boneIndex = {}; boneIds.forEach((id, i) => boneIndex[id] = i);

// ---------- 矩阵工具 ----------
function mat4mul(a, b) { // 列主序 a*b
  const o = new Array(16);
  for (let c = 0; c < 4; c++) for (let r = 0; r < 4; r++) {
    let s = 0; for (let k = 0; k < 4; k++) s += a[k * 4 + r] * b[c * 4 + k];
    o[c * 4 + r] = s;
  }
  return o;
}
function mat4inv(m) { // 列主序，假定仿射
  const inv = new Array(16).fill(0);
  // 旋转转置 + 平移
  inv[0] = m[0]; inv[1] = m[4]; inv[2] = m[8];
  inv[4] = m[1]; inv[5] = m[5]; inv[6] = m[9];
  inv[8] = m[2]; inv[9] = m[6]; inv[10] = m[10];
  const tx = m[12], ty = m[13], tz = m[14];
  inv[12] = -(inv[0] * tx + inv[4] * ty + inv[8] * tz);
  inv[13] = -(inv[1] * tx + inv[5] * ty + inv[9] * tz);
  inv[14] = -(inv[2] * tx + inv[6] * ty + inv[10] * tz);
  inv[15] = 1;
  return inv;
}
function quatFromMat(m) { // 列主序 3x3 部分
  const m00 = m[0], m01 = m[4], m02 = m[8];
  const m10 = m[1], m11 = m[5], m12 = m[9];
  const m20 = m[2], m21 = m[6], m22 = m[10];
  const tr = m00 + m11 + m22;
  let x, y, z, w;
  if (tr > 0) { const s = Math.sqrt(tr + 1) * 2; w = s / 4; x = (m21 - m12) / s; y = (m02 - m20) / s; z = (m10 - m01) / s; }
  else if (m00 > m11 && m00 > m22) { const s = Math.sqrt(1 + m00 - m11 - m22) * 2; w = (m21 - m12) / s; x = s / 4; y = (m01 + m10) / s; z = (m02 + m20) / s; }
  else if (m11 > m22) { const s = Math.sqrt(1 + m11 - m00 - m22) * 2; w = (m02 - m20) / s; x = (m01 + m10) / s; y = s / 4; z = (m12 + m21) / s; }
  else { const s = Math.sqrt(1 + m22 - m00 - m11) * 2; w = (m10 - m01) / s; x = (m02 + m20) / s; y = (m12 + m21) / s; z = s / 4; }
  const l = Math.hypot(x, y, z, w) || 1;
  return [x / l, y / l, z / l, w / l];
}
// FBX -> Three：M = Rx(-90°)，q' = m q m⁻¹
const S = Math.SQRT1_2;
function qMul(a, b) { const [ax, ay, az, aw] = a, [bx, by, bz, bw] = b; return [aw * bx + ax * bw + ay * bz - az * by, aw * by - ax * bz + ay * bw + az * bx, aw * bz + ax * by - ay * bx + az * bw, aw * bw - ax * bx - ay * by - az * bz]; }
function convQ(q) { const mq = [-S, 0, 0, S], mqi = [S, 0, 0, S]; return qMul(qMul(mq, q), mqi); }

// ---------- 每骨局部变换（FBX 空间先算，再整体转换） ----------
const world = {};
for (const id of boneIds) {
  const cl = clusterOfBone[id];
  world[id] = cl ? matOf(cl) : null;
}
const bones = boneIds.map((id) => {
  const p = parentIdOf[id];
  const hasPar = p && nameById[p] && world[p];
  const W = world[id] || [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
  const L = hasPar ? mat4mul(mat4inv(world[p]), W) : W;
  const q = convQ(quatFromMat(L));
  const t = [L[12] * 0.01, L[14] * 0.01, -L[13] * 0.01];
  return { n: nameById[id], p: hasPar ? boneIndex[p] : -1, t: [+t[0].toFixed(4), +t[1].toFixed(4), +t[2].toFixed(4)], q: q.map(x => +x.toFixed(4)) };
});
console.log('bones', bones.length, 'root:', bones[0].n, bones[0].t);

// ---------- 蒙皮权重 ----------
const perVert = Array.from({ length: nV }, () => []);
for (const cl of clusters) {
  const childBoneId = conn.children.filter(x => x.props[0] === 'OO' && x.props[2] === cl.props[0]).map(x => x.props[1]).filter(x => boneIndex[x] !== undefined)[0];
  if (!childBoneId) continue;
  const bi = boneIndex[childBoneId];
  const cIdx = cl.children.find(x => x.name === 'Indexes');
  const cW = cl.children.find(x => x.name === 'Weights');
  if (!cIdx || !cW) continue;
  for (let k = 0; k < cIdx.props[0].length; k++) {
    const vi = cIdx.props[0][k], w = cW.props[0][k];
    if (w > 0.001 && vi < nV) perVert[vi].push([bi, w]);
  }
}
const si = new Uint8Array(nV * 4), sw = new Float32Array(nV * 4);
let unassigned = 0;
for (let v = 0; v < nV; v++) {
  let list = perVert[v];
  if (!list.length) { unassigned++; list = [[0, 1]]; }
  list.sort((a, b) => b[1] - a[1]);
  if (list.length > 4) list = list.slice(0, 4);
  let sum = 0; for (const [, w] of list) sum += w;
  for (let k = 0; k < 4; k++) {
    if (k < list.length) { si[v * 4 + k] = list[k][0]; sw[v * 4 + k] = +(list[k][1] / sum).toFixed(3); }
    else { si[v * 4 + k] = 0; sw[v * 4 + k] = 0; }
  }
}
console.log('unassigned verts:', unassigned, 'max influences check ok');

const rig = {
  pos: Array.from(pos, x => +x.toFixed(4)),
  idx,
  si: Array.from(si),
  sw: Array.from(sw),
  bones
};
fs.writeFileSync(OUT, 'window.__RIG=' + JSON.stringify(rig) + ';');
console.log('written', OUT, (fs.statSync(OUT).size / 1024).toFixed(0) + 'KB');
