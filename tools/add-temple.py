from pathlib import Path
p=Path('world01/world01.html'); s=p.read_text(encoding='utf-8')
code='''
/* 参数场景：初始台地 · 时之神殿。固定种子、规则散布，纯几何。 */
var templeLevel;
function buildTempleLevel() {
  var root = new THREE.Group(); root.name = 'templePlateau'; scene.add(root);
  var seed = 1947, grass;
  function random() { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; }
  var pal = { stone: 0xb6b49b, edge: 0xd2cdb6, dark: 0x737e70, grass: 0x83a74e, blue: 0x54d9dd };
  function material(c) { return new THREE.MeshToonMaterial({color:c,flatShading:true}); }
  var stone=material(pal.stone), edge=material(pal.edge), dark=material(pal.dark);
  function mesh(geo,mat,x,y,z,decor) {
    var m=new THREE.Mesh(geo,mat); m.position.set(x,y,z); m.castShadow=true; m.receiveShadow=true;
    if(decor) m.userData.colExempt='台地环境：植被、远景与地面'; root.add(m); return m;
  }
  function box(w,h,d,x,y,z,mat,decor) { return mesh(new THREE.BoxGeometry(w,h,d),mat||stone,x,y,z,decor); }
  box(90,0.1,90,0,-0.05,-12,material(pal.grass),true);
  /* 道路以分段石板引向神殿，入口区域保持平整。 */
  for(var i=0;i<19;i++) for(var j=-1;j<=1;j++) box(0.85,0.025,0.85,j*0.93,0.013,5-i*0.92,random()>.4?edge:dark,true);
  function arch(cx,z,width,height) {
    var half=width/2, spring=height-half;
    box(.46,spring,.65,cx-half-.23,spring/2,z,edge);
    box(.46,spring,.65,cx+half+.23,spring/2,z,edge);
    for(var a=0;a<11;a++) {
      var angle=(a+.5)*Math.PI/11;
      var b=box(.46,.55,.65,cx+Math.cos(angle)*(half+.22),spring+Math.sin(angle)*(half+.22),z,edge);
      b.rotation.z=angle-Math.PI/2;
    }
  }
  /* 三段立面、开放中殿、断墙与钟楼，门窗均为真实几何空洞。 */
  arch(0,-12,3.2,5.6);
  for(var side=-1;side<=1;side+=2) {
    box(2.5,4.2,.8,side*3.3,2.1,-12);
    box(1,7.4,1.3,side*4.6,3.7,-12,edge);
    mesh(new THREE.ConeGeometry(.8,2.3,4),dark,side*4.6,8.5,-12);
    for(var k=0;k<4;k++) {
      var z=-14-k*2.7; arch(side*4.5,z,1.1,4.5);
      box(.65,1.1,2.65,side*4.5,.55,z-1.3,dark);
      box(.95,5.2,.8,side*4.5,2.6,z-1.2,stone);
    }
    box(3.2,.35,8,side*3.2,5.7,-16, dark);
    for(var k=0;k<6;k++) box(.7,.8,.8,side*(5.4+random()*2),.4,-12-random()*12,dark);
  }
  box(3.4,.5,1,0,5.95,-12,edge);
  arch(0,-12,1.25,2.4);
  /* 上层钟楼位于正门之上，内留空。 */
  for(var side=-1;side<=1;side+=2) box(.6,3.3,1.8,side*1.4,7.8,-12,edge);
  box(3.5,.45,2.4,0,9.65,-12,edge);
  mesh(new THREE.ConeGeometry(2.1,3,4),dark,0,11.3,-12).rotation.y=Math.PI/4;
  box(8.7,2,.7,0,1,-24,dark);
  /* 女神像：石翼、披袍与低头轮廓。 */
  mesh(new THREE.CylinderGeometry(.8,1,.35,10),edge,0,.175,-22);
  mesh(new THREE.ConeGeometry(.65,1.8,9),stone,0,1.2,-22);
  mesh(new THREE.SphereGeometry(.32,10,7),edge,0,2.25,-22);
  for(var side=-1;side<=1;side+=2) {
    var wing=mesh(new THREE.SphereGeometry(.7,8,5),edge,side*.65,1.7,-22.15); wing.scale.set(1,.4,.2); wing.rotation.z=side*.65;
  }
  /* 多批实例草，避开道路与中殿；顶点着色分出亮尖和暗根。 */
  var geo=new THREE.BufferGeometry(), pos=[], colors=[];
  for(var i=0;i<6500;i++) {
    var x=(random()-.5)*65,z=random()*65-43;
    if((Math.abs(x)<1.7&&z<7&&z>-13)||(Math.abs(x)<5.2&&z<-11&&z>-25)) continue;
    var h=.18+random()*.42,w=.045+random()*.06;
    pos.push(x-w,0,z,x+w,0,z,x+.08,h,z);
    colors.push(.22,.36,.12,.3,.43,.15,.65,.76,.32);
  }
  geo.setAttribute('position',new THREE.Float32BufferAttribute(pos,3)); geo.setAttribute('color',new THREE.Float32BufferAttribute(colors,3)); geo.computeVertexNormals();
  grass=mesh(geo,new THREE.MeshToonMaterial({vertexColors:true,side:THREE.DoubleSide}),0,.015,0,true);
  for(var i=0;i<30;i++) {
    var a=random()*6.28,r=17+random()*18,x=Math.cos(a)*r,z=-14+Math.sin(a)*r;
    if(Math.abs(x)<6) continue;
    var trunk=mesh(new THREE.CylinderGeometry(.16,.3,3,7),dark,x,1.5,z);
    for(var k=0;k<3;k++) mesh(new THREE.ConeGeometry(1.7-k*.3,3,7),material(k%2?0x496b45:0x587a48),x,3+k*.85,z,true);
  }
  for(var i=0;i<26;i++) {
    var a=i/26*6.28, r=65+random()*20;
    var mountain=mesh(new THREE.ConeGeometry(11+random()*12,15+random()*24,5),material(i%2?0x8daeb0:0x789d9c),Math.cos(a)*r,4,-15+Math.sin(a)*r,true);
  }
  root.position.set(1.65,0,-14);
  return {host:root,grass:grass};
}
function makeAncientGate(parent,x,z,yaw,name,world,dest) {
  var d=makeStonePortal(parent,x,z,yaw,name,world,dest);
  var glow=new THREE.MeshBasicMaterial({color:0x6be4e6});
  for(var side=-1;side<=1;side+=2) for(var i=0;i<7;i++) {
    var rune=new THREE.Mesh(new THREE.BoxGeometry(.045,.15,.025),glow);
    rune.position.set(side*.85,.35+i*.31,.34); rune.rotation.z=(i%2?1:-1)*.45; rune.userData.colExempt='古代门光纹'; d.group.add(rune);
  }
  var crest=new THREE.Mesh(new THREE.TorusGeometry(.24,.035,5,24),glow);
  crest.position.set(0,3,.34); crest.userData.colExempt='古代门徽'; d.group.add(crest);
  return d;
}
'''
s=s.replace('function initPortalWorlds() {',code+'\nfunction initPortalWorlds() {')
s=s.replace('  tuneKonbiniArt();','  tuneKonbiniArt();\n  templeLevel = buildTempleLevel();')
s=s.replace("if (p === spawnRoot) return 'spawn';","if (templeLevel && p === templeLevel.host) return 'temple';\n    if (p === spawnRoot) return 'spawn';")
s=s.replace("  spawnRoot.visible = (w === 'spawn');","  if (templeLevel) templeLevel.host.visible = (w === 'temple');\n  spawnRoot.visible = (w === 'spawn');")
s=s.replace("return w === 'spawn' ? VOID_BG : theme.sky;","return w === 'spawn' ? VOID_BG : w === 'temple' ? 0xb8dae2 : theme.sky;")
s=s.replace("  if (w === 'garden') {\n    hemi.intensity", "  if (w === 'temple') {\n    hemi.intensity=1.65; sun.intensity=2.1; sun.castShadow=true;\n    hemi.color.setHex(0xd7ecf3); sun.color.setHex(0xffedc2);\n    duskLevel.sky.visible=false; scene.fog.color.setHex(0xb8dae2); scene.fog.near=30; scene.fog.far=115; return;\n  }\n  hemi.color.setHex(th.hemiSky || 0xffffff); sun.color.setHex(th.sun || 0xffffff);\n  if (w === 'garden') {\n    hemi.intensity")
s=s.replace('var doorK, doorF, doorRK, doorRF, doorG, doorRG;','var doorK, doorF, doorRK, doorRF, doorG, doorRG, doorT, doorRT;')
s=s.replace('  portalDoors = [doorK, doorF, doorRK, doorRF, doorG, doorRG];',"  doorT=makeAncientGate(spawnRoot,1.65,-11.4,DOOR_FACE,'doorTemple','spawn','temple');\n  doorRT=makeAncientGate(templeLevel.host,0,8,0,'returnTemple','temple','spawn');\n  doorT.arrive=doorRT; doorRT.arrive=doorT;\n  portalDoors = [doorK, doorF, doorRK, doorRF, doorG, doorRG, doorT, doorRT];\n  connectOffsetDoors(doorT,doorRT,-DOOR_FACE+Math.PI);\n  connectOffsetDoors(doorRT,doorT,DOOR_FACE-Math.PI);")
s=s.replace('window.__worldVersion = \'v0.30.11\'', 'window.__worldVersion = \'v0.30.12\'')
p.write_text(s,encoding='utf-8')
