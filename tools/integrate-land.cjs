const fs=require('fs');let land=fs.readFileSync('world01/.art-check/land-valley.html','utf8');const bridge=`<style>
.title,#reportBtn,.bar,.fp-hint{display:none!important}#landTools{position:fixed;right:20px;top:64px;width:240px;padding:18px;border:1px solid #fff3;border-radius:12px;background:#152927e8;color:#eef4e1;z-index:40;font:12px/1.7 system-ui}#landTools[hidden]{display:none}#landTools button{padding:9px 12px;margin:3px;border:1px solid #fff3;border-radius:5px;background:#ffffff10;color:inherit;cursor:pointer}#landToggle{position:fixed;right:20px;top:20px;border:1px solid #fff3;border-radius:50%;width:36px;height:36px;background:#132b2466;color:white;opacity:.5;z-index:41;font-size:22px}#landCredit{position:fixed;left:18px;bottom:12px;font:10px system-ui;color:#fff9;z-index:30}#landCredit a{color:inherit}#landGateTip{position:fixed;left:50%;bottom:50px;transform:translateX(-50%);color:#fff9df;background:#122922b8;padding:10px 16px;border:1px solid #fff4;border-radius:4px;font:13px system-ui;z-index:31}#landGateTip[hidden]{display:none}
</style><button id="landToggle" aria-label="场景功能">⋯</button><section id="landTools" hidden><strong>哈特诺 · 风车山谷</strong><p>WASD 移动 · Shift 冲刺<br>点击画面转视角 · 空格跳跃<br>V 切换步行 / 观景 · Esc 释放鼠标</p><button data-cam="overview">山村全景</button><button data-cam="street">主街</button><button data-cam="windmill">风车</button><button data-cam="valley">溪谷</button><button id="landWalk">进入步行</button><button id="landBack">返回原野</button><p style="opacity:.5;font-size:10px">场景为哈特诺村参考创作，非原版地图。</p></section><div id="landCredit">Built with <a href="https://github.com/ssochi/land" target="_blank" rel="noopener">land</a></div><button id="landGateTip" hidden>E　返回原野</button>
<script>
(function(){
var menu=document.getElementById('landTools');document.getElementById('landToggle').onclick=function(){menu.hidden=!menu.hidden;if(document.pointerLockElement)document.exitPointerLock();};
function back(){if(document.pointerLockElement)document.exitPointerLock();parent.postMessage({type:'land-exit'},'*');}
document.getElementById('landBack').onclick=back;document.getElementById('landGateTip').onclick=back;
document.querySelectorAll('[data-cam]').forEach(function(b){b.onclick=function(){mapEditor.orbit();mapEditor.camera(b.dataset.cam);menu.hidden=true;};});document.getElementById('landWalk').onclick=function(){mapEditor.walk({x:8,z:119,yaw:0});menu.hidden=true;};
window.addEventListener('message',function(e){if(e.source!==parent)return;if(e.data.type==='land-pause'&&window.mapEditor){mapEditor.orbit();mapEditor.camera('arrival');mapEditor.pause(true);}if(e.data.type==='land-resume'&&window.__mapReady){mapEditor.pause(false);mapEditor.walk({x:8,z:119,yaw:0});}});
var ready=false,near=false;setInterval(function(){if(!window.__mapReady)return;if(!ready){ready=true;var T=window.__landThree,gate=new T.Group(),mat=new T.MeshStandardMaterial({color:0x667d7a,roughness:.9}),glow=new T.MeshBasicMaterial({color:0x79f1ec});function box(w,h,d,x,y,z,m){var p=new T.Mesh(new T.BoxGeometry(w,h,d),m);p.position.set(x,y,z);gate.add(p);}box(.45,3.5,.55,-1,1.75,0,mat);box(.45,3.5,.55,1,1.75,0,mat);box(2.6,.5,.65,0,3.65,0,mat);for(var i=0;i<7;i++)for(var sign=-1;sign<=1;sign+=2)box(.07,.15,.06,sign, .4+i*.42,-.3,glow);gate.position.set(8,mapEditor.heightAt(8,125),125);mapEditor.debug.scene.add(gate);mapEditor.camera('arrival');parent.postMessage({type:'land-ready',counts:mapEditor.report().counts},'*');if(parent.__landSceneActive)mapEditor.walk({x:8,z:119,yaw:0});}
var p=mapEditor.player();near=!!(p&&p.mode!=='orbit'&&Math.hypot(p.x-8,p.z-125)<3.5);document.getElementById('landGateTip').hidden=!near;
},250);window.addEventListener('keydown',function(e){if(e.code==='KeyE'&&near){e.preventDefault();back();}if(e.key==='Tab'){e.preventDefault();menu.hidden=!menu.hidden;}},true);
})();
</script>`;
land=land.replace('</body>',bridge+'</body>');fs.writeFileSync('world01/.art-check/land-playable.html',land);
let s=fs.readFileSync('world01/world01.html','utf8');if(s.includes('id="landEnginePayload"'))throw new Error('land already embedded; restore the pre-land snapshot before rebuilding');s=s.replace("window.__worldVersion = 'v0.30.15'","window.__worldVersion = 'v0.31.0'").replace("temple: '时之神殿遗迹'","temple: '哈特诺 · 风车山谷'");
// Replace the crude previous temple with a quiet threshold; the actual world is rendered by land.
let a=s.indexOf('function buildTempleLevel() {'),b=s.indexOf('function makeAncientGate(',a);s=s.slice(0,a)+`function buildTempleLevel() {
var root=new THREE.Group();root.name='landThreshold';scene.add(root);root.position.set(1.65,0,-14);
return {host:root};
}
`+s.slice(b);
s=s.replace('function loop(t) {','function loop(t) {\n  if(window.__landSceneActive){last=t;acc=0;rafId=requestAnimationFrame(loop);return;}');
const host=`
<script id="landEnginePayload" type="application/octet-stream">${Buffer.from(land).toString('base64')}</script>
<script>
(function(){
var frame=null,ready=false,active=false,previewTexture=null,previewScene=null,previewCamera=null,previewImage=new Image(),previewAt=0;
function ensure(){if(frame)return;frame=document.createElement('iframe');frame.id='landWorldFrame';frame.title='哈特诺风车山谷';frame.setAttribute('allow','fullscreen');frame.style.cssText='position:fixed;left:-20000px;top:0;width:1280px;height:720px;border:0;z-index:500;background:#203b34';document.body.appendChild(frame);var bytes=atob(document.getElementById('landEnginePayload').textContent.trim()),arr=new Uint8Array(bytes.length);for(var i=0;i<bytes.length;i++)arr[i]=bytes.charCodeAt(i);frame.srcdoc=new TextDecoder().decode(arr);}
function enter(){ensure();active=true;window.__landSceneActive=true;frame.style.left='0';frame.style.width='100%';frame.style.height='100%';frame.focus();if(ready)frame.contentWindow.postMessage({type:'land-resume'},'*');}
function exit(){if(!active)return;active=false;window.__landSceneActive=false;frame.style.left='-20000px';frame.style.width='1280px';frame.style.height='720px';frame.contentWindow.postMessage({type:'land-pause'},'*');__world.gotoWorld('spawn');__world.P.pos.set(2.9,0,-11.4);document.getElementById('c').focus();window.dispatchEvent(new Event('focus'));}
window.addEventListener('message',function(e){if(!frame||e.source!==frame.contentWindow)return;if(e.data.type==='land-ready'){ready=true;window.__landReady=true;window.__landCounts=e.data.counts;if(active)frame.contentWindow.postMessage({type:'land-resume'},'*');}if(e.data.type==='land-exit')exit();});
window.__enterLand=enter;window.__exitLand=exit;
setInterval(function(){if(!window.__world)return;if(!active&&__world.portals.cur==='temple'){enter();return;}if(!active&&!frame&&__world.portals.cur==='spawn'&&Math.hypot(__world.P.pos.x-1.65,__world.P.pos.z+11.4)<3.2)ensure();},150);
window.__drawLandPreview=function(renderer){if(!ready||active)return false;if(Date.now()-previewAt>900){previewAt=Date.now();previewImage.src=frame.contentWindow.mapEditor.snapshot();}if(!previewImage.complete||!previewImage.naturalWidth)return false;if(!previewTexture){previewTexture=new THREE.Texture(previewImage);previewTexture.colorSpace=THREE.SRGBColorSpace;previewScene=new THREE.Scene();previewCamera=new THREE.OrthographicCamera(-1,1,1,-1,0,2);previewCamera.position.z=1;previewScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2,2),new THREE.MeshBasicMaterial({map:previewTexture,depthTest:false,depthWrite:false,toneMapped:false})));}previewTexture.needsUpdate=true;renderer.render(previewScene,previewCamera);return true;};
})();
</script>
`;
s=s.replace('</body>',host+'</body>');
// Preserve the existing stencil mask; draw the actual land canvas into that mask.
s=s.replace('      stencil.setLocked(true);\n      var castPawnShadow',"      stencil.setLocked(true);\n      if(view.dest==='temple' && window.__drawLandPreview && window.__drawLandPreview(renderer)){stencil.setLocked(false);stencil.setTest(false);view.arrive.group.visible=true;continue;}\n      var castPawnShadow");
fs.writeFileSync('world01/world01.html',s);console.log('embedded land',Buffer.byteLength(s));
