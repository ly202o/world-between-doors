import fs from 'fs';
const list = await (await fetch('http://127.0.0.1:9230/json/list')).json();
const page = list.filter(t => t.type === 'page').pop();
const ws = new WebSocket(page.webSocketDebuggerUrl);
let id = 0; const pend = new Map();
const send = (m, p = {}) => new Promise(r => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method: m, params: p })); });
ws.addEventListener('message', e => { const m = JSON.parse(e.data); if (m.id && pend.has(m.id)) { pend.get(m.id)(m); pend.delete(m.id); } });
await new Promise(r => ws.addEventListener('open', r));
const ev = async x => { const r = await send('Runtime.evaluate', { expression: x, returnByValue: true, awaitPromise: true }); if (r.result?.exceptionDetails) return 'ERR:' + (r.result.exceptionDetails.exception?.description || '').split('\n')[0]; return r.result?.result?.value; };
const sleep = ms => new Promise(r => setTimeout(r, ms));
await send('Runtime.enable'); await send('Page.enable');
await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 3, mobile: true });
await send('Page.navigate', { url: 'http://127.0.0.1:8779/world01.html?s=' + Date.now() });
await sleep(9000);

// 软件渲染环境本身就比真机慢，正好当压力源：观察自适应分辨率会不会降、会不会抖
const series = [];
for (let i = 0; i < 20; i++) {
  series.push(JSON.parse(await ev(`JSON.stringify({s:+__world.renderScale.toFixed(2),cw:document.querySelector('#c').width,fps:document.getElementById('fps').textContent.slice(0,12)})`)));
  await sleep(700);
}
console.log('renderScale 序列', series.map(x => x.s).join(' '));
console.log('canvas 宽', series.map(x => x.cw).join(' '));
const changes = series.reduce((n, x, i) => n + (i && x.s !== series[i - 1].s ? 1 : 0), 0);
console.log('变化次数', changes, '终值', series[series.length - 1]);
let pass = 0, fail = 0;
const ck = (n, ok, extra) => { console.log((ok ? 'PASS ' : 'FAIL ') + n + (extra !== undefined ? '  ' + extra : '')); ok ? pass++ : fail++; };
ck('低帧率下会自动降分辨率', series[series.length - 1].s < 1, '终值 ' + series[series.length - 1].s);
ck('降到下限 0.55 就停住', series[series.length - 1].s >= 0.55, series[series.length - 1].s);
ck('没有来回抖动（≤2 次调整）', changes <= 2, changes + ' 次');
ck('canvas 尺寸跟着缩放', series[series.length - 1].cw < 585, series[series.length - 1].cw);
console.log('\n' + pass + ' pass / ' + fail + ' fail');
process.exit(fail ? 1 : 0);
