const fs=require('fs');fs.copyFileSync('world01/world01.html','world01/.art-check/before-yunagi.html');let s=fs.readFileSync('world01/world01.html','utf8');function replace(a,b){if(!s.includes(a))throw Error('missing '+a.slice(0,80));s=s.replace(a,b);}
replace('function splitWorlds() {',`var yunagiLevel={host:new THREE.Group(),built:false,asset:null};
yunagiLevel.host.name='yunagiWorld';yunagiLevel.host.position.set(60,0,0);yunagiLevel.host.scale.setScalar(1.4);yunagiLevel.host.visible=false;scene.add(yunagiLevel.host);
function ensureYunagi(){
  if(yunagiLevel.built)return;
  var started=performance.now(),asset=YunagiScene.build(THREE);yunagiLevel.asset=asset;yunagiLevel.host.add(asset.model);
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
replace("  if (w === 'garden') {\n    hemi.intensity", "  if(w==='yunagi'){hemi.intensity=0;sun.intensity=0;sun.castShadow=false;duskLevel.sky.visible=false;scene.fog.color.setHex(0x8993aa);scene.fog.near=42;scene.fog.far=130;return;}\n  if (w === 'garden') {\n    hemi.intensity");
replace('var doorK, doorF, doorRK, doorRF, doorG, doorRG;','var doorK, doorF, doorRK, doorRF, doorG, doorRG, doorY, doorRY;');
replace('  connectGardenArch();',`  doorY=makeYunagiDoor(spawnRoot,1.65,-10.8,DOOR_FACE,'doorYunagi');
  doorRY=makeYunagiDoor(yunagiLevel.host,10.65,3.965,0,'returnYunagi');doorRY.group.position.y=.434;doorRY.group.position.y/=1.4;doorRY.group.scale.divideScalar(1.4);
  doorY.world='spawn';doorY.dest='yunagi';doorY.arrive=doorRY;doorRY.world='yunagi';doorRY.dest='spawn';doorRY.arrive=doorY;
  connectOffsetDoors(doorY,doorRY,-Math.PI/2);connectOffsetDoors(doorRY,doorY,Math.PI/2);
  connectGardenArch();`);
replace('portalDoors = [doorK, doorF, doorRK, doorRF, doorG, doorRG];','portalDoors = [doorK, doorF, doorRK, doorRF, doorG, doorRG, doorY, doorRY];');
replace("  if (world === 'garden') best =", "  if(world==='yunagi'&&yunagiLevel.built){var groundPoint=yunagiLevel.host.worldToLocal(new THREE.Vector3(px,0,pz));best=yunagiLevel.asset.ground(groundPoint.x,groundPoint.z)*1.4;}\n  if (world === 'garden') best =");
replace('  voidClock.value = t * 0.001;',"  if(curWorld==='yunagi'&&yunagiLevel.built)yunagiLevel.asset.update(dt);\n  voidClock.value = t * 0.001;");
replace("garden: '蝶语花园'","garden: '蝶语花园', yunagi: '夕凪の街角'");
replace('h: DOOR_H * DOOR_SCALE, bottom: 0, top: DOOR_H * DOOR_SCALE,','h: DOOR_H * DOOR_SCALE, bottom: wp.y, top: wp.y + DOOR_H * DOOR_SCALE,');
replace('bottom: 0.02 * DOOR_SCALE, top: (DOOR_H + 0.02) * DOOR_SCALE,','bottom: wp.y + 0.02 * DOOR_SCALE, top: wp.y + (DOOR_H + 0.02) * DOOR_SCALE,');
replace('window.__world = { saveSettingsArchive:',"window.__world = { get yunagi(){return {built:yunagiLevel.built,buildMs:yunagiLevel.buildMs,colliders:yunagiLevel.asset?yunagiLevel.asset.obstacles.length:0};}, saveSettingsArchive:");
replace("(curWorld === 'garden' || curWorld === 'konbini' || curWorld === 'field') && P.pos.y < -8","(curWorld === 'garden' || curWorld === 'konbini' || curWorld === 'field' || curWorld === 'yunagi') && P.pos.y < -8");
replace("var entry = curWorld === 'garden' ? GARDEN_ARCH", "var entry = curWorld==='yunagi'?{x:76.11,z:3.5}:curWorld === 'garden' ? GARDEN_ARCH");
replace('P.pos.set(entry.x - 1.2, 0, entry.z);',"P.pos.set(entry.x - 1.2, curWorld==='yunagi'?.476:0, entry.z);");
replace("window.__worldVersion = 'v0.32.5'","window.__worldVersion = 'v0.33.0'");
fs.writeFileSync('world01/world01.html',s);


