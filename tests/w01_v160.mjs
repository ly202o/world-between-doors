/* v0.16.0 专项：游戏内「测试清单」整套删除，只在 docs/TESTLIST-*.md 维护
   跑法：bash /d/temp/run_with_edge.sh /d/temp/w01_v160.mjs
   前置：world01 目录里起 python -m http.server 8779 */
const list = await (await fetch('http://127.0.0.1:9230/json/list')).json();
const page = list.filter(t => t.type === 'page').pop();
const ws = new WebSocket(page.webSocketDebuggerUrl);
let id = 0; const pend = new Map(); const errs = []; const fails = []; const reqs = [];
const send = (m, p = {}) => new Promise(r => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method: m, params: p })); });
ws.addEventListener('message', e => { const m = JSON.parse(e.data);
  if (m.method === 'Runtime.exceptionThrown') errs.push(((m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text) || '').split('\n')[0]);
  if (m.method === 'Network.requestWillBeSent') reqs.push(m.params.request.url);
  if (m.id && pend.has(m.id)) { pend.get(m.id)(m); pend.delete(m.id); } });
await new Promise(r => ws.addEventListener('open', r));
const ev = async (x) => { const r = await send('Runtime.evaluate', { expression: x, returnByValue: true, awaitPromise: true });
  if (r.result?.exceptionDetails) return 'ERR:' + r.result.exceptionDetails.exception?.description;
  return r.result?.result?.value; };
const sleep = ms => new Promise(r => setTimeout(r, ms));
let n = 0, pass = 0;
function ok(name, cond, info) {
  n++;
  if (cond) { pass++; console.log('  ✓ ' + name + (info !== undefined ? '  [' + info + ']' : '')); }
  else { fails.push(name + (info !== undefined ? ' [' + info + ']' : '')); console.log('  ✗ ' + name + (info !== undefined ? '  [' + info + ']' : '')); }
}
const num = async (x) => { const v = await ev(x); return typeof v === 'number' ? v : NaN; };
const V = async (k) => { await ev('window.dispatchEvent(new KeyboardEvent("keydown",{key:"' + k + '"}))');
  await ev('window.dispatchEvent(new KeyboardEvent("keyup",{key:"' + k + '"}))'); };
const has = async (sel) => (await ev(`document.querySelector('${sel}') !== null`)) === true;

await send('Page.enable'); await send('Runtime.enable'); await send('Network.enable');
reqs.length = 0;
await send('Page.navigate', { url: 'http://127.0.0.1:8779/world01.html?s=' + Date.now() });
await sleep(6000);

console.log('\n【1】启动');
ok('无未捕获异常', errs.length === 0, errs.join(' | ') || 'none');
ok('版本格式合法', /^v0\.\d+\.\d+$/.test(await ev('window.__worldVersion')), await ev('window.__worldVersion'));
ok('世界跑起来了（骨骼 68 根）', (await num('Object.keys(window.__world.bones).length')) === 68);
const external = reqs.filter(u => !u.startsWith('http://127.0.0.1:8779') && !u.startsWith('data:') && !u.startsWith('blob:'));
ok('没有外部请求', external.length === 0, external.join(' ') || 'none');

console.log('\n【2】清单的东西一个不剩');
for (const sel of ['#side', '#sideTab', '#testList', '#testScroll', '#testProg', '#testCopy', '#testMsg', '#testAll', '#testVer', '#soundBtn', '#testBarOk']) {
  ok('DOM 里没有 ' + sel, !(await has(sel)));
}
ok('一条清单条目都不在', (await num('document.querySelectorAll(".tItem, .tBtn, .tNote").length')) === 0,
   await num('document.querySelectorAll(".tItem, .tBtn, .tNote").length'));
ok('页面上没有任何「清单」二字', (await ev('document.body.innerText.indexOf("清单") < 0')) === true);

console.log('\n【3】后台接口也摘干净了');
for (const k of ['showSide', 'sideOpen', 'testStore', 'testExport', 'testSet']) {
  ok('__world.' + k + ' 已移除', (await ev(`window.__world['${k}'] === undefined`)) === true);
}
ok('__world.setMuted 还在（静音是独立功能）', (await ev('typeof window.__world.setMuted === "function"')) === true);
ok('没往 localStorage 写清单数据', (await ev('localStorage.getItem("w01.testlist.v2") === null')) === true,
   await ev('String(localStorage.getItem("w01.testlist.v2")).slice(0, 30)'));

console.log('\n【4】静音还找得到地方（原来在侧栏顶部）');
const muted0 = await ev('window.__world.sound.muted');
ok('默认仍是静音', muted0 === true);
/* 徽标绑的是手势事件（pointerdown/touchstart/mousedown），不是 click；
   而且内置 500ms 去重（touchstart 和 mousedown 会连着来），所以两次点之间要等够。 */
const tapSnd = async () => {
  await ev(`document.getElementById('snd').dispatchEvent(new MouseEvent('mousedown',{bubbles:true,cancelable:true})); 1`);
  await sleep(700);
};
await tapSnd();
ok('点左下角徽标能开声音', (await ev('window.__world.sound.muted')) === false);
await tapSnd();
ok('再点回静音', (await ev('window.__world.sound.muted')) === true);

console.log('\n【5】剩下的界面都在正确的位置');
ok('设置面板能开', (await ev('window.dispatchEvent(new KeyboardEvent("keydown",{key:"f2"})); 1')) === 1);
await sleep(400);
ok('F2 真的开了设置', (await ev('document.getElementById("settingsPanel").hidden')) === false);
await V('f2');
await sleep(300);
ok('F2 再按关掉', (await ev('document.getElementById("settingsPanel").hidden')) === true);
ok('F3 什么都不发生了', (await V('f3'), 1) === 1 && (await ev('document.getElementById("side") === null')));
const btnTops = await ev(`(function(){
  var ids=['viewBtn','lockBtn','themeBtn','colBtn','settingsBtn','mouseBtn'], out=[];
  for (var i=0;i<ids.length;i++){ var el=document.getElementById(ids[i]);
    if(!el||getComputedStyle(el).display==='none') continue;
    var r=el.getBoundingClientRect(); out.push({id:ids[i], top:Math.round(r.top), right:Math.round(r.right), h:Math.round(r.height), on:el.classList.contains('on')});}
  return out;})()`);
console.log('    右上按钮：', JSON.stringify(btnTops));
const tops = btnTops.map(b => b.top);
ok('右上按钮没有重叠（相邻至少差 24px）', tops.every((t, i) => i === 0 || t - tops[i - 1] >= 24), tops.join(','));
const vw = await num('window.innerWidth');
ok('所有按钮都贴着右缘（离边 < 30px）', btnTops.every(b => vw - b.right < 30), '视口 ' + vw + 'px');

console.log('\n【6】核心玩法没被带坏');
await ev('document.activeElement && document.activeElement.blur && document.activeElement.blur()');
const p0 = await ev(`({x:+__world.P.pos.x.toFixed(2), z:+__world.P.pos.z.toFixed(2)})`);
await ev(`window.dispatchEvent(new KeyboardEvent('keydown',{key:'w'}))`);
await sleep(1100);
await ev(`window.dispatchEvent(new KeyboardEvent('keyup',{key:'w'}))`);
await sleep(300);
const p1 = await ev(`({x:+__world.P.pos.x.toFixed(2), z:+__world.P.pos.z.toFixed(2)})`);
ok('还能走', Math.hypot(p1.x - p0.x, p1.z - p0.z) > 0.8, (Math.hypot(p1.x - p0.x, p1.z - p0.z)).toFixed(2) + 'm');
ok('碰撞体仍是 629 个（按世界核对）', (await num('window.__colliders.length')) === 629);
ok('碰撞自检遗漏 0', (await num('window.__collisionAudit.verify.missing')) === 0);
ok('脚部 IK 参数还在', (await num('window.__world.ikCfg.ankleH')) > 0.05,
   await num('window.__world.ikCfg.ankleH'));

console.log('\n【7】四档视角 + 等距仍成立');
/* v0.17.0 起默认档是等距，起点不写死：四按回原档 → 按到等距为止 */
const vmStart = await num('window.__world.viewMode');
const modes = [];
for (let i = 0; i < 4; i++) { await V('v'); await sleep(500); modes.push(await num('window.__world.viewMode')); }
ok('V 走完四档回到原档', modes[3] === vmStart && new Set(modes).size === 4, vmStart + ' → ' + modes.join(','));
let vm7 = await num('window.__world.viewMode');
for (let i = 0; vm7 !== 3 && i < 4; i++) { await V('v'); await sleep(600); vm7 = await num('window.__world.viewMode'); }
ok('切到等距', vm7 === 3, vm7);
await sleep(1200);
const iso = JSON.parse(await ev('JSON.stringify(window.__world.iso)'));
ok('等距仍是正交投影', iso.active === 'ortho' && iso.isOrtho === true, iso.active);
ok('视锥仍与机位对齐', Math.abs(iso.halfH - iso.expectHalfH) < 0.02, iso.halfH.toFixed(3) + ' vs ' + iso.expectHalfH.toFixed(3));

console.log('\n【8】全程无异常');
ok('无未捕获异常', errs.length === 0, errs.slice(0, 4).join(' | ') || 'none');

console.log('\n=== ' + pass + '/' + n + ' 通过 ===');
if (fails.length) { console.log('失败：'); fails.forEach(f => console.log('  · ' + f)); }
process.exit(fails.length ? 1 : 0);
