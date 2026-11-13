// 生成三方对比页：我的模型 + UE4 + UE5
const fs = require('fs'), zlib = require('zlib');

function parseFBX(path) {
  const buf = fs.readFileSync(path);
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
  const gs = [];
  (function w(n) { if (n.name === 'Geometry') { let V = null, I = null; for (const c of n.children) { if (c.name === 'Vertices') V = c.props[0]; if (c.name === 'PolygonVertexIndex') I = c.props[0]; } if (V && I) gs.push({ V, I }); } for (const c of n.children) w(c); })(tops.find(t => t.name === 'Objects'));
  const pos = [], idx = []; let base = 0;
  for (const g of gs) {
    const nv = g.V.length / 3;
    for (let i = 0; i < nv; i++) pos.push(+g.V[i * 3].toFixed(2), +g.V[i * 3 + 2].toFixed(2), +(-g.V[i * 3 + 1]).toFixed(2));
    let poly = [];
    for (let i = 0; i < g.I.length; i++) {
      const v = g.I[i];
      if (v < 0) { poly.push(-v - 1); for (let k = 1; k < poly.length - 1; k++) idx.push(base + poly[0], base + poly[k], base + poly[k + 1]); poly = []; }
      else poly.push(v);
    }
    base += nv;
  }
  return { pos, idx };
}

fs.writeFileSync('_ref1.js', 'window.__REF1=' + JSON.stringify(parseFBX('refs/SK_Mannequin.fbx')) + ';');

// UE5 gltf
const j = JSON.parse(fs.readFileSync('refs/SKM_Manny.gltf', 'utf8'));
const bin = fs.readFileSync('refs/SKM_Manny.bin');
const pos = [], idx = []; let base = 0;
for (const pr of j.meshes[0].primitives) {
  const ap = j.accessors[pr.attributes.POSITION], bvP = j.bufferViews[ap.bufferView];
  const offP = (bvP.byteOffset || 0) + (ap.byteOffset || 0);
  for (let i = 0; i < ap.count; i++) pos.push(+bin.readFloatLE(offP + i * 12).toFixed(4), +bin.readFloatLE(offP + i * 12 + 4).toFixed(4), +bin.readFloatLE(offP + i * 12 + 8).toFixed(4));
  const ai = j.accessors[pr.indices], bvI = j.bufferViews[ai.bufferView];
  const offI = (bvI.byteOffset || 0) + (ai.byteOffset || 0);
  for (let i = 0; i < ai.count; i++) idx.push(base + (ai.componentType === 5123 ? bin.readUInt16LE(offI + i * 2) : bin.readUInt32LE(offI + i * 4)));
  base += ap.count;
}
fs.writeFileSync('_ref2.js', 'window.__REF2=' + JSON.stringify({ pos, idx }) + ';');

// 对比页
let s = fs.readFileSync('index.html', 'utf8');
const anchor = "scene.add(pawn);";
const inject = "scene.add(pawn);" + `

function addRef(d, x, sc) {
  if (!d) return;
  var g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(d.pos, 3));
  g.setIndex(d.idx);
  g.computeVertexNormals();
  var m = new THREE.Mesh(g, MAT);
  m.scale.set(sc, sc, sc);
  m.position.set(x, 0, 0);
  m.castShadow = true; m.receiveShadow = true;
  scene.add(m);
}
addRef(window.__REF1, -1.45, 0.01);
addRef(window.__REF2,  1.45, 1.0);`;
if (s.indexOf(anchor) < 0) throw new Error("anchor missing");
console.log("anchor at", s.indexOf(anchor));
s = s.replace(anchor, inject);
const closeIdx = s.indexOf("</script>");
if (closeIdx < 0) throw new Error("no close script");
s = s.slice(0, closeIdx + 9) + "\n<script src=\"_ref1.js\"></script>\n<script src=\"_ref2.js\"></script>" + s.slice(closeIdx + 9);
fs.writeFileSync('_cmp.html', s);
console.log('built');
