const fs=require('fs');let s=fs.readFileSync('world01/world01.html','utf8');function change(a,b){if(!s.includes(a))throw Error('Missing '+a.slice(0,80));s=s.replace(a,b);}
change("window.__worldVersion = 'v0.30.11'","window.__worldVersion = 'v0.32.5'");change('background: radial-gradient(ellipse, #171a228c, transparent 72%);','background: none;');s=s.replace('max="2" step="0.05"></label>','max="10" step="0.05"></label>'); // Only timeScale restored below; sensitivity keeps its own max.
s=s.replace('id="mouseSensitivity" type="range" min="0.1" max="10"','id="mouseSensitivity" type="range" min="0.1" max="2"');s=s.replace('id="touchSensitivity" type="range" min="0.2" max="10"','id="touchSensitivity" type="range" min="0.2" max="2"');
s=s.replace(/Math\.min\(2, savedSettings\.timeScale\)/g,'Math.min(10, savedSettings.timeScale)').replace(/Math\.min\(2, \+this\.value\)/g,'Math.min(10, +this.value)');
change('FREE_DIST_MAX = 60','FREE_DIST_MAX = 400');change('ISO_VIEW_H_MAX = 90','ISO_VIEW_H_MAX = 400');change('new THREE.PerspectiveCamera(48, 1, 0.1, 400)','new THREE.PerspectiveCamera(48, 1, 0.1, 2400)');change('new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 400)','new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 2400)');
change("var savedSettings = JSON.parse(localStorage.getItem('world01.settings.v1') || 'null');","var uiSavedArchive=JSON.parse(localStorage.getItem('world01.settings.archive.v1')||'null');\n  var savedSettings = uiSavedArchive && uiSavedArchive.settings || JSON.parse(localStorage.getItem('world01.settings.v1') || 'null');");
const a=s.indexOf('function saveSettings() {'),b=s.indexOf('function syncSettings()',a);if(a<0||b<0)throw Error('settings markers');s=s.slice(0,a)+`/* UI settings transactions: no automatic writes, no startup timers. */
var uiDraft=null;
function uiMessage(text){var el=document.getElementById('settingsArchiveStatus');if(el)el.textContent=text;}
function uiSnapshot(){return {settings:JSON.parse(JSON.stringify(settings)),flags:{ambient:!!SOUND.amb,collisions:!!colVizOn},savedAt:new Date().toISOString()};}
function uiRestore(data){
  if(!data||!data.settings)throw new Error('设置档无效');
  var v=data.settings,limits={mouse:[.1,2],touch:[.2,2],timeScale:[.25,10],walkSpeed:[.5,3.5],runSpeed:[2,6],sprintSpeed:[4,9],walkAccel:[2,30],sprintAccel:[2,40],slowWalk:[.2,.8]};
  Object.keys(limits).forEach(function(k){if(typeof v[k]==='number'&&isFinite(v[k]))settings[k]=Math.max(limits[k][0],Math.min(limits[k][1],v[k]));});
  settings.followView=!!v.followView;applyTheme(v.theme==='light'?'light':'dark');
  if(data.flags&&typeof data.flags.ambient==='boolean')setAmb(data.flags.ambient);
  if(data.flags&&typeof data.flags.collisions==='boolean')setColViz(data.flags.collisions);
  syncSettings();if(window.__refreshGameUI)window.__refreshGameUI();
}
function saveSettings(){if(settingsOpen)uiMessage('正在预览 · 保存后保留');}
function uiSave(){try{var data=uiSnapshot();delete data.flags.collisions;localStorage.setItem('world01.settings.archive.v1',JSON.stringify(data));uiDraft=uiSnapshot();uiMessage('设置存档已保存');return true;}catch(e){uiMessage('保存失败，原存档保留');return false;}}
function uiLoad(){try{var raw=localStorage.getItem('world01.settings.archive.v1');if(!raw){uiMessage('还没有存档，请先保存');return false;}uiRestore(JSON.parse(raw));uiDraft=uiSnapshot();uiMessage('已读取设置存档');return true;}catch(e){uiMessage('读取失败，请检查设置档');return false;}}
`+s.slice(b);
change('function showSettings(on) {',`function showSettings(on) {
  if(on&&!settingsOpen){uiDraft=uiSnapshot();uiMessage('调整可预览 · 关闭撤销未保存修改');}
  if(!on&&settingsOpen&&uiDraft){uiRestore(uiDraft);uiDraft=null;}`);
change('  settingsPanel.hidden = !settingsOpen;','  settingsPanel.hidden = !settingsOpen;\n  if(window.__refreshGameUI)window.__refreshGameUI();');
change("localStorage.setItem('world01.amb.v1', SOUND.amb ? 'on' : 'off');","if(!settingsOpen)localStorage.setItem('world01.amb.v1', SOUND.amb ? 'on' : 'off');");
change('window.__world = { P:',"if(uiSavedArchive&&uiSavedArchive.flags&&typeof uiSavedArchive.flags.ambient==='boolean')setAmb(uiSavedArchive.flags.ambient);\nwindow.__world = { saveSettingsArchive:uiSave,loadSettingsArchive:uiLoad, P:");
// Restore zoom visibility without touching the movement or render loops.
change('/* ---------------- 一扇独立的旧木门',`var uiBaseLighting=applyWorldLighting;
applyWorldLighting=function(w){uiBaseLighting(w);if(scene.fog&&P){var shift=Math.max(0,(isoMode?orthoCam:camera).position.distanceTo(P.pos)-40);scene.fog.near+=shift;scene.fog.far+=shift;}};
/* ---------------- 一扇独立的旧木门`);
// Seal the header in depth as well as height. Helpers take bottom Y, not centre Y.
change('boxAt(storeFront, 1.9, 0.09, 0.18, frameMat_1, dx, S.glassTop - 0.09, fz_1);',"boxAt(storeFront, 1.9, 0.14, 0.38, frameMat_1, dx, S.glassTop - 0.12, fz_1).name = 'storeDoorHeader';");
change('boxAt(leaf, 0.86, 0.05, 0.09, frameMat_1, lx, S.glassTop - 0.5, 0);',"boxAt(leaf, 0.86, 0.06, 0.09, frameMat_1, lx, S.glassTop - 0.14, 0).name = 'storeDoorTopRail';");
change('bx(DOOR_W + 0.36, 0.15, 0.20, dark, 0, DOOR_H + 0.16, 0);',"bx(DOOR_W + 0.36, 0.23, 0.28, dark, 0, DOOR_H + 0.12, 0).name = 'portalGlassHeader';");
change('leaf.position.set(-DOOR_W / 2, DOOR_H / 2 + 0.02, 0);',"leaf.name = 'portalGlassLeaf';\n  leaf.position.set(-DOOR_W / 2, DOOR_H / 2 + 0.02, 0);");
fs.writeFileSync('world01/world01.html',s);
