// 把 bake_full.cjs 产出的 _anims.js 注入 world01.html 里那个唯一的 __ANIMS 脚本块。
// 用法: node tools/anim/inject_anims.cjs
const fs = require('fs');
const HTML = 'D:/VibeCoding/游戏开发/world01/world01.html';
const JS = __dirname + '/_anims.js';

const data = fs.readFileSync(JS, 'utf8').trim();
const html = fs.readFileSync(HTML, 'utf8');
const tag = '<script>window.__ANIMS=';
const start = html.indexOf(tag);
if (start < 0) { console.error('找不到 __ANIMS 脚本块'); process.exit(1); }
const end = html.indexOf('</script>', start);
if (end < 0) { console.error('__ANIMS 脚本块未闭合'); process.exit(1); }
const before = html.slice(0, start), after = html.slice(end + 9);
const out = before + '<script>' + data + '</script>' + after;
fs.writeFileSync(HTML, out);
console.log('注入完成：' + (data.length / 1024).toFixed(0) + 'KB，文件大小 ' + (out.length / 1024 / 1024).toFixed(2) + 'MB');
