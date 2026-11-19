const fs=require('fs');fs.copyFileSync('world01/world01.html','world01/.art-check/before-yunagi.html');let s=fs.readFileSync('world01/world01.html','utf8');function replace(a,b){if(!s.includes(a))throw Error('missing '+a.slice(0,80));s=s.replace(a,b);}
replace('function splitWorlds() {',`var yunagiLevel={host:new THREE.Group(),built:false,asset:null};
yunagiLevel.host.name='yunagiWorld';yunagiLevel.host.position.set(60,0,0);yunagiLevel.host.scale.setScalar(1.4);yunagiLevel.host.visible=false;scene.add(yunagiLevel.host);
function ensureYunagi(){
  if(yunagiLevel.built)return;
  var started=performance.now(),asset=YunagiScene.build(THREE,renderer);yunagiLevel.asset=asset;yunagiLevel.host.add(asset.model);yunagiLevel.host.updateMatrixWorld(true);asset.init();
  asset.obstacles.forEach(function(o){var p=yunagiLevel.host.localToWorld(new THREE.Vector3(o.x,o.y,o.z));addCollider({position:p,rotation:{y:0}},o.w*1.4,o.d*1.4,o.h*1.4);var col=colliders[colliders.length-1];col.world='yunagi';col.kind='solid';});
  yunagiLevel.built=true;yunagiLevel.buildMs=performance.now()-started;
}
function makeYunagiDoor(parent,x,z,yaw,name){
  var d=makeKonbiniPortalDoor(parent,x,z,yaw,name);d.previewWhenClosed=false;
  d.group.traverse(function(o){if(!o.isMesh||!o.material)return;if(o===d.leaf){o.material.color.setHex(0xc5b9a2);o.material.opacity=.72;}else if(o.material.metalness!==undefined){o.material.color.setHex(0x66504b);o.material.metalness=.05;o.material.roughness=.85;}});
  var labelCanvas=document.createElement('canvas');labelCanvas.width=256;labelCanvas.height=64;var labelCtx=labelCanvas.getContext('2d');labelCtx.fillStyle='#d8bd94';labelCtx.fillRect(0,0,256,64);labelCtx.strokeStyle='#74534a';labelCtx.lineWidth=5;labelCtx.strokeRect(3,3,250,58);labelCtx.fillStyle='#493a36';labelCtx.textAlign='center';labelCtx.font='bold 40px serif';labelCtx.fillText(name==='returnYunagi'?'原野':'夕凪',128,47);var labelTexture=new THREE.CanvasTexture(labelCanvas);labelTexture.colorSpace=THREE.SRGBColorSpace;var label=new THREE.Mesh(new THREE.PlaneGeometry(.78,.17),new THREE.MeshBasicMaterial({map:labelTexture,side:THREE.DoubleSide}));label.position.set(0,DOOR_H+.12,-.146);label.rotation.y=Math.PI;label.userData.colExempt='门楣标牌';d.group.add(label);
  return d;
}
function splitWorlds() {`);
replace('var keep = [ground, pawn,','var keep = [yunagiLevel.host, ground, pawn,');
replace('function setWorldVisible(w) {',"function setWorldVisible(w) {\n  if(w==='yunagi')ensureYunagi();\n  yunagiLevel.host.visible=(w==='yunagi');");
replace("if (p === spawnRoot) return 'spawn';","if (p === spawnRoot) return 'spawn';\n    if(yunagiLevel && p===yunagiLevel.host)return 'yunagi';");
replace("return w === 'spawn' ? VOID_BG : theme.sky;","return w === 'spawn' ? VOID_BG : w==='yunagi'?0x8993aa:theme.sky;");
replace("  if (w === 'garden') {\n    hemi.intensity", "  if(w==='yunagi'){hemi.intensity=0;sun.intensity=0;sun.castShadow=false;duskLevel.sky.visible=false;scene.fog.color.setHex(0x8993aa);scene.fog.near=140;scene.fog.far=300;return;}\n  if (w === 'garden') {\n    hemi.intensity");
replace('var doorK, doorF, doorRK, doorRF, doorG, doorRG;','var doorK, doorF, doorRK, doorRF, doorG, doorRG, doorY, doorRY;');
replace('  connectGardenArch();',`  doorY=makeYunagiDoor(spawnRoot,1.65,-10.8,DOOR_FACE,'doorYunagi');
  doorRY=makeYunagiDoor(yunagiLevel.host,10.65,3.965,0,'returnYunagi');doorRY.group.position.y=.434;doorRY.group.position.y/=1.4;doorRY.group.scale.divideScalar(1.4);
  doorY.world='spawn';doorY.dest='yunagi';doorY.arrive=doorRY;doorRY.world='yunagi';doorRY.dest='spawn';doorRY.arrive=doorY;
  connectOffsetDoors(doorY,doorRY,-Math.PI/2);connectOffsetDoors(doorRY,doorY,Math.PI/2);
  connectGardenArch();`);
replace('portalDoors = [doorK, doorF, doorRK, doorRF, doorG, doorRG];','portalDoors = [doorK, doorF, doorRK, doorRF, doorG, doorRG, doorY, doorRY];');
replace("  if (world === 'garden') best =", "  if(world==='yunagi'&&yunagiLevel.built){var groundPoint=yunagiLevel.host.worldToLocal(new THREE.Vector3(px,0,pz));best=yunagiLevel.asset.ground(groundPoint.x,groundPoint.z)*1.4;}\n  if (world === 'garden') best =");
replace('  voidClock.value = t * 0.001;',"  if(yunagiLevel.built&&(curWorld==='yunagi'||(curWorld==='spawn'&&doorY.open)))yunagiLevel.asset.update(dt,curWorld==='yunagi'?P.pos:null);\n  voidClock.value = t * 0.001;");
replace("garden: '蝶语花园'","garden: '蝶语花园', yunagi: '夕凪の街角'");
replace('h: DOOR_H * DOOR_SCALE, bottom: 0, top: DOOR_H * DOOR_SCALE,','h: DOOR_H * DOOR_SCALE, bottom: wp.y, top: wp.y + DOOR_H * DOOR_SCALE,');
replace('bottom: 0.02 * DOOR_SCALE, top: (DOOR_H + 0.02) * DOOR_SCALE,','bottom: wp.y + 0.02 * DOOR_SCALE, top: wp.y + (DOOR_H + 0.02) * DOOR_SCALE,');
replace('var musicContext, musicWorld, musicSource, musicGain, musicPanner;',"var sakuraMusicData='',sakuraDecoding=false,sakuraError='';\nwindow.__setSakuraMusic=function(data){sakuraMusicData=data;if(musicWorld==='yunagi')musicWorld=null;};\nvar musicContext, musicWorld, musicSource, musicGain, musicPanner;");
replace("    } else if (curWorld === 'konbini') {", "    } else if(curWorld==='yunagi'){\n      if(musicBuffers.yunagi)playSceneMusic(musicBuffers.yunagi);\n      else if(sakuraMusicData&&!sakuraDecoding){sakuraDecoding=true;var sakuraContext=AC;var raw=atob(sakuraMusicData.split(',')[1]),bytes=new Uint8Array(raw.length);for(var si=0;si<raw.length;si++)bytes[si]=raw.charCodeAt(si);sakuraContext.decodeAudioData(bytes.buffer).then(function(buffer){sakuraDecoding=false;if(AC!==sakuraContext)return;musicBuffers.yunagi=buffer;if(musicWorld==='yunagi'&&!SOUND.muted&&!musicSource)playSceneMusic(buffer);}).catch(function(e){sakuraDecoding=false;sakuraError=String(e);});}\n    } else if (curWorld === 'konbini') {");
replace("  } else if (musicWorld === 'garden') {", "  } else if(musicWorld==='yunagi'){musicPosition.set(P.pos.x,P.pos.y+1.5,P.pos.z);\n  } else if (musicWorld === 'garden') {");
replace("var vol = musicWorld === 'field' ? 0.14", "var vol = musicWorld==='yunagi'?.10:musicWorld === 'field' ? 0.14");
replace('window.__world = { saveSettingsArchive:',"window.__world = { get yunagiMusic(){return {ready:!!musicBuffers.yunagi,duration:musicBuffers.yunagi?musicBuffers.yunagi.duration:0,playing:musicWorld==='yunagi'&&!!musicSource,muted:SOUND.muted,error:sakuraError};}, saveSettingsArchive:");
replace('window.__world = { get yunagiMusic()',"window.__world = { get yunagi(){return {built:yunagiLevel.built,train:yunagiLevel.built?{x:yunagiLevel.asset.train.position.x,visible:yunagiLevel.asset.train.visible,children:yunagiLevel.asset.train.children.length}:null,buildMs:yunagiLevel.buildMs,colliders:yunagiLevel.asset?yunagiLevel.asset.obstacles.length:0};}, get yunagiMusic()");
replace("(curWorld === 'garden' || curWorld === 'konbini' || curWorld === 'field') && P.pos.y < -8","(curWorld === 'garden' || curWorld === 'konbini' || curWorld === 'field' || curWorld === 'yunagi') && P.pos.y < -8");
replace("var entry = curWorld === 'garden' ? GARDEN_ARCH", "var entry = curWorld==='yunagi'?{x:76.11,z:3.5}:curWorld === 'garden' ? GARDEN_ARCH");
replace('P.pos.set(entry.x - 1.2, 0, entry.z);',"P.pos.set(entry.x - 1.2, curWorld==='yunagi'?.476:0, entry.z);");
replace('  var idleNow = !settingsOpen',"  var idleNow = curWorld!=='yunagi' && !(curWorld==='spawn'&&doorY&&doorY.open) && !settingsOpen");
replace('  if (scene.background) scene.background.setHex(worldBackground(w, th));','  if (scene.background&&scene.background.isColor) scene.background.setHex(worldBackground(w, th));');
replace('  scene.background.setHex(worldBackground(curWorld, t));','  if(scene.background&&scene.background.isColor)scene.background.setHex(worldBackground(curWorld, t));');
replace('function applyWorldLighting(w) {',"function applyWorldLighting(w) {\n  if(w==='yunagi'&&yunagiLevel.built)scene.background=yunagiLevel.asset.sky;else if(!scene.background||!scene.background.isColor)scene.background=new THREE.Color();scene.environment=w==='yunagi'&&yunagiLevel.built?yunagiLevel.asset.environment:null;renderer.toneMapping=w==='yunagi'?THREE.ACESFilmicToneMapping:THREE.NoToneMapping;renderer.toneMappingExposure=w==='yunagi'?1.12:1;");
replace("window.__worldVersion = 'v0.32.5'","window.__worldVersion = 'v0.34.0'");
fs.writeFileSync('world01/world01.html',s);



