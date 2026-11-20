import fs from 'node:fs';
const pages=await(await fetch('http://127.0.0.1:9230/json/list')).json();
const ws=new WebSocket(pages.find(p=>p.type==='page').webSocketDebuggerUrl);
await new Promise(r=>ws.onopen=r);let id=0;const pending=new Map(),errors=[],reqs=[];
ws.onmessage=e=>{const m=JSON.parse(e.data);if(m.id){pending.get(m.id)?.(m);pending.delete(m.id);}
 if(m.method==='Runtime.exceptionThrown')errors.push(m.params.exceptionDetails);
 if(m.method==='Network.requestWillBeSent')reqs.push(m.params.request.url);};
const send=(method,params={})=>new Promise(r=>{pending.set(++id,r);ws.send(JSON.stringify({id,method,params}));});
const ev=async expression=>{const r=await send('Runtime.evaluate',{expression,returnByValue:true});if(r.result?.exceptionDetails)throw Error(JSON.stringify(r.result.exceptionDetails));return r.result?.result?.value;};
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
await send('Runtime.enable');await send('Network.enable');
const t0=Date.now();
await send('Page.navigate',{url:'file:///D:/VibeCoding/%E6%B8%B8%E6%88%8F%E5%BC%80%E5%8F%91/world01/.iso/world01.html'});
await sleep(1500);
await ev("try{localStorage.setItem('world01.unlocked.v1','1')}catch(e){}");
await send('Page.navigate',{url:'file:///D:/VibeCoding/%E6%B8%B8%E6%88%8F%E5%BC%80%E5%8F%91/world01/.iso/world01.html'});
for(let i=0;i<80;i++){if(await ev('!!window.__world'))break;await sleep(400);}
console.log('version',await ev('window.__worldVersion'),'| __world 就绪',((Date.now()-t0)/1000).toFixed(1)+'s');
console.log('进度 TOTAL',await ev('typeof TOTAL!=="undefined"?TOTAL:"(闭包内)"'));
await sleep(2500);
const shot=await send('Page.captureScreenshot',{format:'png'});
fs.writeFileSync('.art-check/v0351-iso-dir.png',Buffer.from(shot.result.data,'base64'));
console.log('外部请求',reqs.filter(u=>/^https?:/.test(u)).length);
console.log('errors',errors.length?errors:'无');ws.close();
if(errors.length)process.exitCode=1;
