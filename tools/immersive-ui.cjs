const fs=require('fs');const p='world01/world01.html';let s=fs.readFileSync(p,'utf8');const css=`
/* v0.30.13 · 沉浸式功能入口，场景交互独立呈现 */
#worldMenuToggle {position:fixed;right:20px;top:20px;width:36px;height:36px;border:1px solid rgba(220,232,227,.14);border-radius:50%;background:rgba(20,28,29,.18);color:#e1e9e4;opacity:.34;z-index:260;cursor:pointer;transition:opacity .2s,background .2s;font:20px Georgia}
#worldMenuToggle:hover,#worldMenuToggle:focus-visible,#worldMenuToggle[aria-expanded="true"]{opacity:1;background:rgba(25,35,35,.88)}
#worldMenu {position:fixed;right:20px;top:66px;width:264px;max-height:calc(100dvh - 90px);overflow:auto;box-sizing:border-box;padding:20px;background:rgba(20,29,29,.94);backdrop-filter:blur(18px);border:1px solid rgba(226,235,221,.16);border-radius:14px;z-index:250;color:#e2e9df;box-shadow:0 16px 60px #0004;font:12px/1.6 system-ui}
#worldMenu[hidden]{display:none!important} #worldMenu h2{font-size:14px;font-weight:500;margin:0 0 16px;letter-spacing:.15em} #worldMenu h3{font-size:10px;font-weight:400;letter-spacing:.15em;color:#95a79f;margin:16px 0 7px}
#worldMenu .menuGrid{display:grid;grid-template-columns:1fr 1fr;gap:6px}
#worldMenu .pill,#worldMenu #snd,#worldMenu #helpBadge{position:static!important;inset:auto!important;transform:none!important;box-sizing:border-box;min-width:0;width:100%;height:36px;margin:0;padding:0 10px;border-radius:6px;border:1px solid #dce9d318;background:#dce9d309;box-shadow:none;color:#dce5dd;text-align:left;font:12px/36px system-ui;cursor:pointer;opacity:1}
#worldMenu .pill:hover,#worldMenu #snd:hover,#worldMenu #helpBadge:hover{background:#dce9d31c} #worldMenu .pill.on{background:#dce9d327}
#worldMenu #snd{font-size:11px;height:auto;line-height:1.6;padding:8px;grid-column:1/-1}
#worldMenu #helpBadge{display:block!important;font-size:12px} #worldMenu #fps{position:static!important;color:#81938c;font:10px/1.6 system-ui;margin:16px 0 0;opacity:.7;display:block!important}
#worldMenu .menuHint{color:#82978e;font-size:10px;margin:14px 0 0}
#portalTip,#doorTip{bottom:64px!important;border-radius:4px!important;border:1px solid #e4eadb28;background:rgba(18,27,28,.8)!important;color:#f0f1e5!important;padding:10px 18px!important;font:13px/1.4 system-ui!important;box-shadow:none!important;letter-spacing:.12em!important}
#portalTip:before,#doorTip:before{content:'E';display:inline-grid;place-items:center;width:24px;height:24px;margin-right:12px;border:1px solid #f0f1e5aa;border-radius:3px;font:14px Georgia;vertical-align:middle}
#portalBtn,#doorBtn{right:24px!important;bottom:100px!important;border-radius:6px!important;border:1px solid #eee8!important;background:#152222c9!important;color:#f1f0de!important;box-shadow:none!important}
#settingsPanel{z-index:270} #tip{max-width:calc(100vw - 40px);box-sizing:border-box}
@media(pointer:coarse){#worldMenuToggle{width:42px;height:42px;right:16px;top:16px;opacity:.5}#worldMenu{right:16px;top:66px}#portalTip:before,#doorTip:before{display:none}}
`;
s=s.replace('</style>',css+'\n</style>');
const js=`
<script>
(function () {
  var toggle=document.createElement('button'); toggle.id='worldMenuToggle';toggle.type='button';toggle.textContent='⋯';toggle.setAttribute('aria-label','展开功能菜单');toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-controls','worldMenu');document.body.appendChild(toggle);
  var menu=document.createElement('section');menu.id='worldMenu';menu.hidden=true;menu.setAttribute('aria-label','功能菜单');menu.innerHTML='<h2>旅途 · 功能</h2>';document.body.appendChild(menu);
  function section(title,ids){var h=document.createElement('h3');h.textContent=title;menu.appendChild(h);var grid=document.createElement('div');grid.className='menuGrid';menu.appendChild(grid);ids.forEach(function(id){var el=document.getElementById(id);if(el)grid.appendChild(el);});}
  section('视角与画面',['viewBtn','snapBtn','lockBtn','mouseBtn','themeBtn']);
  section('移动',['runBtn','slowBtn']);
  section('声音与设置',['snd','settingsBtn','colBtn','helpBadge']);
  var help=document.getElementById('helpBadge');if(help){help.textContent='操作说明 · H';help.setAttribute('role','button');help.tabIndex=0;help.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();help.click();}});}
  var fps=document.getElementById('fps');if(fps)menu.appendChild(fps);
  var hint=document.createElement('p');hint.className='menuHint';hint.textContent='Tab 展开 / 收起 · Esc 返回场景';menu.appendChild(hint);
  function show(on){menu.hidden=!on;toggle.setAttribute('aria-expanded',String(on));toggle.setAttribute('aria-label',on?'收起功能菜单':'展开功能菜单');if(on&&document.pointerLockElement)document.exitPointerLock();}
  toggle.addEventListener('pointerdown',function(e){e.preventDefault();e.stopPropagation();show(menu.hidden);});
  toggle.addEventListener('click',function(e){if(e.detail===0)show(menu.hidden);});
  menu.addEventListener('pointerdown',function(e){e.stopPropagation();});menu.addEventListener('wheel',function(e){e.stopPropagation();});
  document.addEventListener('pointerdown',function(e){if(!menu.hidden&&!menu.contains(e.target)&&e.target!==toggle&&!document.getElementById('settingsPanel').contains(e.target))show(false);},true);
  window.addEventListener('keydown',function(e){if(/INPUT|TEXTAREA|SELECT/.test(e.target.tagName))return;if(e.key==='Tab'&&(menu.hidden||e.target===document.body||e.target===toggle)){e.preventDefault();show(menu.hidden);}else if(e.key==='Escape'&&!menu.hidden){show(false);toggle.focus();}},true);
  /* 将旧提示文本正规化，E 键样式由伪元素统一绘制。 */
  var observed={};function observeTips(){['portalTip','doorTip'].forEach(function(id){var el=document.getElementById(id);if(!el||observed[id])return;observed[id]=true;function clean(){var t=el.textContent.replace(/^按 E /,'');if(t!==el.textContent)el.textContent=t;}new MutationObserver(clean).observe(el,{childList:true,characterData:true,subtree:true});clean();});}
  observeTips();new MutationObserver(observeTips).observe(document.body,{childList:true});
})();
</script>
`;
s=s.replace('</body>',js+'\n</body>');s=s.replace("window.__worldVersion = 'v0.30.12'","window.__worldVersion = 'v0.30.13'");fs.writeFileSync(p,s);console.log('UI written');
