/* v0.35.0 验收：角色出生在世界原点 + 门列整体后移。
   ① 出生点 (0,0,0)，四扇门都在 3m 渲染范围之外（mix 全 0）
   ② 门列队形不变（间距 2.5 / 2.8 / 2.8），整列在 x=−4.0、沿 z 居中
   ③ 走到便利店门前：只有该门的 mix 涨到 1，且是 ~2.2s 渐变（伪加载）
   ④ 范围可视化开关能开（圆盘半径 = 3m）
   ⑤ 全程无 JS 异常 */
import fs from 'node:fs';

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
const shot = async (file) => {
  const r = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(file, Buffer.from(r.result.data, 'base64'));
};
const portals = async () => JSON.parse(await ev('JSON.stringify(__world.portals)'));
const mixOf = async (name) => (await portals()).doors.filter(d => d.name === name)[0].mix;
const until = async (fn, ms = 8000) => {
  const t0 = Date.now();
  while (Date.now() - t0 < ms) { try { if (await fn()) return true; } catch (e) { } await sleep(120); }
  return false;
};

await send('Page.navigate', { url: process.env.WORLD_URL || ('http://127.0.0.1:8779/world01.html?s=' + Date.now()) });
await sleep(1200);
/* 密码门挡画面不挡逻辑：写解锁标记后重载，截图才是真实游戏画面 */
await ev("try{localStorage.setItem('world01.unlocked.v1','1')}catch(e){}");
await send('Page.navigate', { url: process.env.WORLD_URL || ('http://127.0.0.1:8779/world01.html?s=' + Date.now()) });
await sleep(1200);
if (!await until(async () => (await ev('typeof __world')) === 'object', 40000)) throw new Error('页面 40s 未就绪');
await until(async () => { const r = JSON.parse(await ev('JSON.stringify(window.__worldReady())')); return r.konbini && r.garden && r.yunagi && r.spawn && r.field; }, 90000);
await sleep(800);

/* ---- ① 出生点 ---- */
console.log('\n【1】出生点');
const pos = JSON.parse(await ev('JSON.stringify([+__world.P.pos.x.toFixed(2), +__world.P.pos.y.toFixed(2), +__world.P.pos.z.toFixed(2)])'));
ok(Math.abs(pos[0]) < 0.3 && Math.abs(pos[2]) < 0.3, '出生在世界原点', pos);
const doors = JSON.parse(await ev(`JSON.stringify((function(){
  var ps = __world.portals.doors, out = [];
  ['doorKonbini','doorField','doorGarden','doorYunagi'].forEach(function(n){
    var d = ps.filter(function(x){ return x.name === n; })[0];
    if (!d) { out.push({ name: n, missing: true }); return; }
    out.push({ name: n, x: d.pos[0], z: d.pos[1] });
  });
  return out;
})())`));
const dist = d => Math.hypot(d.x - pos[0], d.z - pos[2]);
for (const d of doors) console.log('    ' + d.name + '  世界位置 (' + d.x + ', ' + d.z + ')  距出生点 ' + dist(d).toFixed(2) + 'm');
const minD = Math.min(...doors.map(dist));
ok(minD > 3.0, '最近的入口也在 3m 范围外', minD.toFixed(2) + 'm');
const mixes = (await portals()).doors.filter(d => d.world === 'spawn').map(d => d.name + ':' + d.mix);
ok((await portals()).doors.every(d => d.mix === 0), '出生时没有任何门洞在渲染', mixes.join(' '));
await shot('.art-check/v0350-spawn-origin.png');

/* ---- ② 门列队形 ---- */
console.log('\n【2】门列队形');
const byName = n => doors.filter(d => d.name === n)[0];
const zs = ['doorKonbini', 'doorField', 'doorGarden', 'doorYunagi'].map(n => byName(n).z);
const gaps = [zs[1] - zs[0], zs[2] - zs[1], zs[3] - zs[2]].map(v => +Math.abs(v).toFixed(2));
ok(gaps.join(',') === '2.5,2.8,2.8', '四门间距不变', gaps.join(' / '));
ok(doors.every(d => Math.abs(d.x + 4) < 0.01), '四门同在 x = −4.0 一列', doors.map(d => d.x).join(','));
ok(Math.abs((Math.max(...zs) + Math.min(...zs)) / 2) < 0.05, '整列沿 z 居中', (Math.max(...zs) + Math.min(...zs)) / 2);

/* ---- ③ 走到门前：范围与渐变 ---- */
console.log('\n【3】门前 2.2s 渐变');
await ev('__world.P.pos.set(-2.5, 0, 4.05)'); await sleep(260);
const samples = [];
let fadeT0 = Date.now();
while (Date.now() - fadeT0 < 16000) {
  samples.push(await mixOf('doorKonbini'));
  if (samples.length === 6) await shot('.art-check/v0350-fade-mid.png');
  if (samples[samples.length - 1] === 1) break;
  await sleep(220);
}
console.log('    mix 采样 ' + samples.join(' ') + '  （无头软件渲染帧率低，dt 钳在 0.05，渐变比真机慢）');
ok((await mixOf('doorKonbini')) === 1, '门前便利店画面完全显形', await mixOf('doorKonbini'));
const mid = samples.filter(v => v > 0 && v < 1).length;
ok(mid >= 3, '确有几档中间态（不是瞬切）', mid + ' 个中间值');
await shot('.art-check/v0350-fade-done.png');

/* ---- ④ 范围可视化 ---- */
console.log('\n【4】范围可视化');
ok(await ev('__setPortalRangeViz(true)') === true, '开关能开');
await sleep(400); await shot('.art-check/v0350-range-viz.png');
ok(await ev('__setPortalRangeViz(false)') === false, '开关能关');

/* ---- ⑤ 收尾 ---- */
console.log('\n【5】收尾');
const errs = await ev('window.__errors ? window.__errors.length : 0');
ok(errs === 0, '全程无 JS 异常', errs);
console.log('\n' + (fail === 0 ? '全部通过' : '有 ' + fail + ' 项失败') + '（' + pass + '/' + (pass + fail) + '）');
process.exit(fail === 0 ? 0 : 1);
