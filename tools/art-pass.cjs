const fs = require('fs');
let s = fs.readFileSync('world01.html', 'utf8');
const art = String.raw`
/* v0.30.0 四季之间：全部由几何生成，环境植被用实例合批。 */
var artClock = { value: 0 };
function buildStoryWorlds() {
  var seed = 9317;
  function rand() { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; }
  function mat(c) { return new THREE.MeshStandardMaterial({ color: c, roughness: 0.94 }); }
  var stone = mat(0xb6b9a3), pale = mat(0xd8d3b9), moss = mat(0x70875b), wood = mat(0x776b56);
  function mesh(parent, geo, material, x, y, z, sx, sy, sz, decor) {
    var m = new THREE.Mesh(geo, material); m.position.set(x,y,z); m.scale.set(sx || 1,sy || 1,sz || 1);
    m.castShadow = !decor; m.receiveShadow = true;
    if (decor) m.userData.colExempt = '远景或柔软植被';
    parent.add(m); return m;
  }
  var cube = new THREE.BoxGeometry(1,1,1), orb = new THREE.IcosahedronGeometry(1,1);
  function box(g,x,y,z,w,h,d,m) { return mesh(g,cube,m,x,y+h/2,z,w,h,d); }
  function sky(g,top,bottom) {
    var m = new THREE.Mesh(new THREE.SphereGeometry(240,24,12),new THREE.ShaderMaterial({
      side:THREE.BackSide,depthWrite:false,fog:false,
      uniforms:{top:{value:new THREE.Color(top)},bottom:{value:new THREE.Color(bottom)}},
      vertexShader:'varying vec3 v; void main(){v=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);gl_Position.z=gl_Position.w;}',
      fragmentShader:'varying vec3 v; uniform vec3 top,bottom; void main(){float h=normalize(v).y;vec3 c=mix(bottom,top,smoothstep(-0.35,0.65,h));gl_FragColor=vec4(c,1.0); #include <colorspace_fragment> }'.replace(' #include','\n#include').replace('> }','>\n}')
    }));
    m.renderOrder=-100; m.userData.colExempt='天空';g.add(m);
  }
  function flowers(g,count,radius,ox,oz,y) {
    var petal = new THREE.Shape();
    for(var k=0;k<=60;k++){var a=k*Math.PI/30,r=0.072*(0.78+0.22*Math.cos(a*5));if(!k)petal.moveTo(Math.cos(a)*r,Math.sin(a)*r);else petal.lineTo(Math.cos(a)*r,Math.sin(a)*r);}
    var fm = mat(0xffffff); fm.side=THREE.DoubleSide;
    fm.onBeforeCompile=function(sh){sh.uniforms.artTime=artClock;sh.vertexShader='uniform float artTime;\n'+sh.vertexShader;sh.vertexShader=sh.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\n#ifdef USE_INSTANCING\ntransformed.x += sin(artTime*1.15+instanceMatrix[3].x*0.7+instanceMatrix[3].z*0.4)*0.028;\n#endif');};
    var heads=new THREE.InstancedMesh(new THREE.ShapeGeometry(petal),fm,count);
    var stems=new THREE.InstancedMesh(new THREE.CylinderGeometry(0.008,0.012,1,3),mat(0x647f48),count);
    var dummy=new THREE.Object3D(),color=new THREE.Color(),palette=[0xf6edcf,0xf6dd98,0xdea4ae,0xb8c9ef,0xe5c4e0,0xf1f0d9];
    for(var i=0;i<count;i++){
      var x,z;
      do {x=ox+(rand()*2-1)*radius;z=oz+(rand()*2-1)*radius;} while((x-ox)*(x-ox)+(z-oz)*(z-oz)>radius*radius || (g===spawnRoot && ((Math.abs(z+5.2)<4 && Math.abs(x-1.65)<3.5) || (x>-12&&x<-5&&z>-6&&z<2) || Math.abs(z+1.8+Math.sin(x*0.21)*1.6)<0.75)));
      var h=0.18+rand()*0.38,scale=0.65+rand()*0.9;
      dummy.position.set(x,y+h,z);dummy.rotation.set(-Math.PI/2+(rand()-.5)*.8,0,rand()*6.28);dummy.scale.setScalar(scale);dummy.updateMatrix();heads.setMatrixAt(i,dummy.matrix);
      color.setHex(palette[Math.floor((Math.sin(x*.33+z*.21)*.5+.5)*palette.length)%palette.length]);heads.setColorAt(i,color);
      dummy.position.y=y+h*.5;dummy.rotation.set(0,0,0);dummy.scale.set(1,h,1);dummy.updateMatrix();stems.setMatrixAt(i,dummy.matrix);
    }
    heads.userData.colExempt=stems.userData.colExempt='柔软花海';g.add(heads);g.add(stems);
  }
  function clouds(g) {
    var cm=mat(0xfff8e8);
    for(var i=0;i<18;i++){var a=i*2.4;var x=Math.cos(a)*(55+rand()*35),z=Math.sin(a)*(55+rand()*35);for(var j=0;j<4;j++)mesh(g,orb,cm,x+j*3,15+rand()*3,z,5+rand()*3,1.4+rand(),2.5+rand()*2,true);}
  }
  function meadow(g,c) {
    var m=mat(c);
    m.onBeforeCompile=function(sh){sh.vertexShader='varying vec3 artPos;\n'+sh.vertexShader;sh.vertexShader=sh.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nartPos=position;');sh.fragmentShader='varying vec3 artPos;\n'+sh.fragmentShader;sh.fragmentShader=sh.fragmentShader.replace('#include <color_fragment>','#include <color_fragment>\nfloat wash=sin(artPos.x*.17+sin(artPos.y*.11)*2.0)*sin(artPos.y*.23);diffuseColor.rgb*=0.94+0.07*wash;');};
    var floor=mesh(g,new THREE.PlaneGeometry(400,400),m,0,-.015,0,1,1,1,true);floor.rotation.x=-Math.PI/2;
  }
  sky(spawnRoot,0x89bcd1,0xe0e6c8);meadow(spawnRoot,0x91a66c);clouds(spawnRoot);
  flowers(spawnRoot,IS_MOBILE?6500:12500,32,0,-4,0);
  /* 绵延山坡留在可行走区域以外，近景不造隐形地形。 */
  for(var i=0;i<22;i++){var a=i*Math.PI*2/22;mesh(spawnRoot,orb,mat(i%2?0x829b79:0x9cad88),Math.cos(a)*63,-4,Math.sin(a)*63,18+rand()*15,7+rand()*6,18+rand()*12,true);}
  var hut=new THREE.Group();hut.name='meadowStoneCottage';hut.position.set(-9,0,-2);spawnRoot.add(hut);
  box(hut,0,0,-1.65,4.4,2.55,.35,stone);box(hut,-2.05,0,0,.3,2.55,3.4,stone);box(hut,2.05,0,0,.3,2.55,3.4,stone);
  box(hut,-1.45,0,1.65,1.2,2.55,.35,stone);box(hut,1.45,0,1.65,1.2,2.55,.35,stone);box(hut,0,2.05,1.65,1.7,.5,.35,stone);
  box(hut,0,0,1.65,1.45,2.05,.12,wood);
  var roof=mat(0x75827c);
  var left=box(hut,-1.1,2.6,0,2.7,.16,4.1,roof);left.rotation.z=.48;
  var right=box(hut,1.1,2.6,0,2.7,.16,4.1,roof);right.rotation.z=-.48;
  box(hut,1.2,2.7,-.7,.55,1.15,.6,stone);box(hut,1.2,3.84,-.7,.7,.14,.75,pale);
  var glass=mat(0x9dbfbd);box(hut,-2.22,1.05,0,.035,.8,1.0,glass);
  for(var i=0;i<48;i++){var side=i%2?-1:1;var b=box(hut,side*2.22,.12+Math.floor(i/12)*.56,-1.45+(i%12)*.26,.035,.22+rand()*.16,.19+rand()*.1,i%3?stone:pale);b.userData.colExempt='墙面石块纹理';}
  for(var i=0;i<16;i++){var t=i/15;mesh(spawnRoot,orb,pale,-9+t*10,.015,1+Math.sin(t*3)*.9,.35+rand()*.2,.045,.3+rand()*.2,true);}
  /* 初始之地：将旧测试道具收起，碰撞同步撤销，保留门与通行系统。 */
  var old=fieldRoot.children.slice();old.forEach(function(o){fieldRoot.remove(o);});
  for(var i=colliders.length-1;i>=0;i--)if(colliders[i].world==='field')colliders.splice(i,1);
  blockers.length=0;
  sky(fieldRoot,0x9ebbc8,0xe9e8d8);meadow(fieldRoot,0xb2bba0);clouds(fieldRoot);
  var terrace=box(fieldRoot,0,-.22,-4,17,.22,18,pale);terrace.name='quietRuinTerrace';
  for(var i=0;i<8;i++){
    var a=i*Math.PI/4,x=Math.cos(a)*6,z=-5+Math.sin(a)*6,h=i%3===0?2.2:4.2;
    mesh(fieldRoot,new THREE.CylinderGeometry(.32,.43,h,10),stone,x,h/2,z);
    box(fieldRoot,x,0,z,1,.2,1,pale);box(fieldRoot,x,h-.08,z,.9,.18,.9,pale);
    for(var j=0;j<5;j++)mesh(fieldRoot,orb,moss,x+Math.cos(j*2)*.3,.25+j*.18,z+Math.sin(j*2)*.3,.22,.12,.23,true);
  }
  box(fieldRoot,0,4.2,-11,8,.45,.8,stone);
  for(var i=0;i<24;i++){var a=rand()*6.28,r=9+rand()*11;var rock=mesh(fieldRoot,orb,i%2?stone:moss,Math.cos(a)*r,.15,-5+Math.sin(a)*r,.3+rand()*.8,.15+rand()*.5,.4+rand()*.8);rock.rotation.y=rand()*6.28;}
  flowers(fieldRoot,1800,21,0,-5,0);
  /* 树根守护的旧碑，无角色或雕像的直接复制。 */
  mesh(fieldRoot,new THREE.CylinderGeometry(.42,.85,5.5,9),wood,-6,2.75,-9);
  for(var i=0;i<9;i++)mesh(fieldRoot,orb,mat(i%2?0x779879:0x91a982),-6+Math.cos(i*2.4)*1.9,5.1+rand()*1.3,-9+Math.sin(i*2.4)*1.9,2.2,1.3,2.1,true);
  box(fieldRoot,-3,0,-8,1.1,1.9,.45,stone);
  /* 蝶语花园：边缘树冠和苔石，保留中间小径与凉亭。 */
  var gg=sunnyGarden.host,gy=sunnyGarden.groundY;
  for(var i=0;i<9;i++){
    var a=i*Math.PI*2/9,x=Math.cos(a)*12.6,z=Math.sin(a)*12.6;
    mesh(gg,new THREE.CylinderGeometry(.18,.34,3.3,8),wood,x,gy+1.65,z);
    for(var j=0;j<3;j++)mesh(gg,orb,mat(j%2?0x7e9f70:0x97b482),x+Math.cos(j*2)*.7,gy+3.4+j*.25,z+Math.sin(j*2)*.7,1.7,1.1,1.6,true);
    mesh(gg,orb,moss,x-.6,gy+.15,z+.6,.6,.3,.45);
  }
  sunnyGarden.lights.hemi.color.setHex(0xd9e8dd);sunnyGarden.lights.hemi.intensity=.85;
  sunnyGarden.lights.sun.color.setHex(0xffefd0);sunnyGarden.lights.sun.intensity=1.25;
  duskLevel.lights.hemi.color.setHex(0xb6cee0);duskLevel.lights.hemi.groundColor.setHex(0x807b78);
  duskLevel.lights.sun.color.setHex(0xffc99c);duskLevel.lights.fill.color.setHex(0xa2bfd6);
  var u=duskLevel.sky.material.uniforms;u.cTop.value.setHex(0x577f9f);u.cMid.value.setHex(0x9dabbc);u.cHor.value.setHex(0xf3bd92);u.cBot.value.setHex(0x607485);
  scene.updateMatrixWorld(true);
}
`;
s=s.replace('function initPortalWorlds() {',art+'\nfunction initPortalWorlds() {');
s=s.replace('  splitWorlds();\n  buildPortalDoors();','  splitWorlds();\n  buildStoryWorlds();\n  buildPortalDoors();');
s=s.replace("ground.visible = (w !== 'garden' && w !== 'konbini');","ground.visible = false;");
s=s.replace("hemi.intensity = th.hemiI * (w === 'spawn' ? 1.9 : 1.0);","hemi.color.setHex(0xd8e9ee); hemi.groundColor.setHex(0x899b6a); hemi.intensity = 1.25;");
s=s.replace("sun.intensity = th.sunI * (w === 'spawn' ? 1.05 : 1.0); sun.castShadow = true;","sun.color.setHex(0xffefd0); sun.intensity = 1.65; sun.castShadow = true;");
s=s.replace('scene.fog.color.setHex(th.fog); scene.fog.near = 20; scene.fog.far = 145;','scene.fog.color.setHex(0xdce5d2); scene.fog.near = 38; scene.fog.far = 150;');
s=s.replace('  ambientTick();','  artClock.value = t * 0.001;\n  ambientTick();');
s=s.replaceAll("v0.29.14'","v0.30.0'").replaceAll('·　v0.29.14','·　v0.30.0');
fs.writeFileSync('world01.html',s);
console.log('Story world art pass inserted');
