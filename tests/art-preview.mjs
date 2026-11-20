import fs from 'node:fs';
const pages=await(await fetch('http://127.0.0.1:9237/json/list')).json();
const ws=new WebSocket(pages.find(p=>p.type==='page').webSocketDebuggerUrl);
await new Promise(r=>ws.onopen=r);let id=0;const pending=new Map(),errors=[],requests=[];
ws.onmessage=e=>{const m=JSON.parse(e.data);if(m.id){pending.get(m.id)?.(m);pending.delete(m.id);}if(m.method==='Runtime.exceptionThrown')errors.push(m.params.exceptionDetails);if(m.method==='Log.entryAdded'&&m.params.entry.level==='error')errors.push(m.params.entry.text);if(m.method==='Network.requestWillBeSent')requests.push(m.params.request.url);};
const send=(method,params={})=>new Promise(r=>{pending.set(++id,r);ws.send(JSON.stringify({id,method,params}));});
const ev=async expression=>{const r=await send('Runtime.evaluate',{expression,returnByValue:true});if(r.result?.exceptionDetails)throw Error(JSON.stringify(r.result.exceptionDetails));return r.result?.result?.value;};
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
await send('Runtime.enable');await send('Log.enable');await send('Network.enable');
await send('Emulation.setDeviceMetricsOverride',{width:1280,height:720,deviceScaleFactor:1,mobile:false});
await send('Page.navigate',{url:'file:///D:/VibeCoding/游戏开发/world01/.art-check/world01.html'});
for(let i=0;i<60;i++){if(await ev('!!window.__world'))break;await sleep(500);}
console.log('loaded',await ev('window.__worldVersion'),JSON.stringify(errors));
for(const world of ['spawn','field','garden','konbini']){
 await ev(`__world.gotoWorld('${world}');__world.setIso(0,${world==='spawn'?24:30});__world.P.pos.set(${world==='spawn'?'0,0,0':world==='field'?'0,0,-4':'1.65,0,-8'});`);
 await sleep(1800);
 const shot=await send('Page.captureScreenshot',{format:'png'});fs.writeFileSync('.art-check/'+world+'.png',Buffer.from(shot.result.data,'base64'));
}
await send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});await ev("__world.gotoWorld('spawn');__world.P.pos.set(0,0,0);__world.setIso(0,17)");await sleep(1200);
const shot=await send('Page.captureScreenshot',{format:'png'});fs.writeFileSync('.art-check/mobile.png',Buffer.from(shot.result.data,'base64'));
console.log('audit',await ev('JSON.stringify(__world.collisionAudit())'));console.log('errors',JSON.stringify(errors));console.log('external',requests.filter(x=>/^https?:/.test(x)));console.log('portals',await ev('JSON.stringify(__world.portals)'));ws.close();
if(errors.length)process.exitCode=1;


