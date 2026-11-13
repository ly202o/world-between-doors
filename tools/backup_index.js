#!/usr/bin/env node
/* ============================================================
 * WORLD 01 · 备份索引生成器
 *   读出 backups/ 下所有 v*_YYYYMMDD_index.html，加上 docs/CHANGELOG.md
 *   里的版本说明，生成 backups/index.html（可直接用浏览器打开、点进去看旧版）。
 *
 *   用法：node tools/backup_index.js
 *   快照脚本会自己调它，平时不用手动跑。
 * ============================================================ */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const BK = path.join(ROOT, 'backups');
const CHANGELOG = path.join(ROOT, 'docs', 'CHANGELOG.md');

/* ---- 从 CHANGELOG 里抓版本说明：每个 "## v0.11.29 — 2026-11-13" 后面第一段 ----
   说明只取第一行有效的加粗标题，够用了，索引页不需要全文。 */
const notes = {};
if (fs.existsSync(CHANGELOG)) {
  const txt = fs.readFileSync(CHANGELOG, 'utf8');
  const re = /^##\s+v([\d.]+)\s*[—\-–]\s*(\d{4}-\d{2}-\d{2})\s*$/gm;
  const marks = [];
  let m;
  while ((m = re.exec(txt))) marks.push({ ver: m[1], date: m[2], at: m.index, end: m.index + m[0].length });
  marks.forEach((k, i) => {
    const body = txt.slice(k.end, i + 1 < marks.length ? marks[i + 1].at : txt.length);
    const line = body.split('\n').map(s => s.trim()).filter(s => s && !/^[-|>#`]/.test(s) && !/^---/.test(s))[0] || '';
    let note = line.replace(/\*\*/g, '').replace(/[。.]$/, '');
    if (note.length > 40) {
      const cut = note.indexOf('：');
      note = (cut > 3 && cut < 40) ? note.slice(0, cut) : note.slice(0, 38) + '…';
    }
    notes[k.ver] = { date: k.date, note: note };
  });
}

/* ---- CHANGELOG 没有的老版本，退回 docs/MEMORY.md 的时间线表格 ---- */
const MEMORY = path.join(ROOT, 'docs', 'MEMORY.md');
if (fs.existsSync(MEMORY)) {
  fs.readFileSync(MEMORY, 'utf8').split('\n').forEach(function (line) {
    const m = line.match(/^\|\s*v([\d.]+)\s*\|\s*([^|]+)\|/);
    if (m && !notes[m[1]]) {
      let note = m[2].replace(/\*\*/g, '').trim();
      if (note.length > 38) note = note.slice(0, 36) + '…';
      notes[m[1]] = { date: '', note: note };
    }
  });
}

/* ---- manifest 覆盖 CHANGELOG（刚发版、CHANGELOG 还没补时用得上）---- */
const MF = path.join(BK, 'manifest.tsv');
if (fs.existsSync(MF)) {
  fs.readFileSync(MF, 'utf8').split('\n').forEach(function (row) {
    const c = row.split('\t');
    if (c.length >= 3 && c[0]) {
      notes[c[0]] = { date: c[1], note: c[2] };
    }
  });
}

/* ---- 扫备份文件 ---- */
const files = fs.readdirSync(BK)
  .filter(f => /^v(\d+\.\d+\.\d+)_\d{8}_index\.html$/.test(f))
  .map(f => {
    const m = f.match(/^v(\d+\.\d+\.\d+)_(\d{8})_index\.html$/);
    const ver = m[1], stamp = m[2];
    const st = fs.statSync(path.join(BK, f));
    const info = notes[ver] || {};
    const date = info.date || (stamp.slice(0, 4) + '-' + stamp.slice(4, 6) + '-' + stamp.slice(6, 8));
    return { file: f, ver: ver, date: date, note: info.note || '', size: st.size, mtime: st.mtimeMs };
  })
  .sort((a, b) => {
    const pa = a.ver.split('.').map(Number), pb = b.ver.split('.').map(Number);
    for (let i = 0; i < 3; i++) if (pa[i] !== pb[i]) return pb[i] - pa[i];
    return b.mtime - a.mtime;
  });

const total = files.reduce((s, f) => s + f.size, 0);
const mb = (total / 1048576).toFixed(1);

function kb(n) { return (n / 1024).toFixed(0) + ' KB'; }

const rows = files.map(f => `    <a class="row" href="${encodeURIComponent(f.file)}">
      <span class="ver">v${f.ver}</span>
      <span class="note">${esc(f.note || '（无说明）')}</span>
      <span class="meta">${f.date}<br>${kb(f.size)}</span>
    </a>`).join('\n');

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>WORLD 01 · 备份 ${files.length} 个版本</title>
<style>
  :root { --ink:#1b1d20; --dim:#8c99a8; --line:#e8edf2; }
  * { box-sizing:border-box; }
  body {
    margin:0; background:#fbfcfd; color:var(--ink);
    font:400 15px/1.5 -apple-system,BlinkMacSystemFont,"PingFang SC","Microsoft YaHei",sans-serif;
    -webkit-text-size-adjust:100%;
  }
  header { padding:28px 20px 18px; }
  h1 { margin:0 0 6px; font-size:20px; font-weight:600; letter-spacing:.02em; }
  .sub { color:var(--dim); font-size:13px; }
  .cur {
    display:block; margin:16px 20px 0; padding:14px 16px; border-radius:12px;
    background:#fff; border:1px solid var(--line); text-decoration:none; color:var(--ink);
    font-weight:600;
  }
  .cur span { display:block; font-weight:400; font-size:12px; color:var(--dim); margin-top:3px; }
  .list { margin:18px 12px 40px; }
  .row {
    display:grid; grid-template-columns:76px 1fr 74px; gap:10px; align-items:center;
    padding:13px 10px; text-decoration:none; color:var(--ink);
    border-bottom:1px solid var(--line);
  }
  .row:active { background:#f0f4f8; }
  .ver { font-weight:600; font-variant-numeric:tabular-nums; }
  .note { font-size:13px; color:#4a4f57; overflow:hidden; text-overflow:ellipsis; }
  .meta { font-size:11px; color:var(--dim); text-align:right; font-variant-numeric:tabular-nums; }
  footer { padding:0 20px 40px; color:var(--dim); font-size:12px; }
</style>
</head>
<body>
<header>
  <h1>WORLD 01 · 版本备份</h1>
  <div class="sub">共 ${files.length} 个版本 · 占用 ${mb} MB · 点任意一行直接打开那一版</div>
</header>

<a class="cur" href="../index.html">打开当前版本（index.html）<span>最新代码，不在备份列表里</span></a>

<div class="list">
${rows}
</div>

<footer>由 tools/backup_index.js 生成 · 每次跑 tools/snapshot.sh 会自动刷新</footer>
</body>
</html>
`;

fs.writeFileSync(path.join(BK, 'index.html'), html);
console.log('索引已刷新: backups/index.html（' + files.length + ' 个版本）');
