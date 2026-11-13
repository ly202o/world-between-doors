#!/usr/bin/env bash
# ============================================================
# WORLD 01 · 版本快照
#
#   用法：bash tools/snapshot.sh <版本号> [<一句话说明>]
#   例：  bash tools/snapshot.sh 0.3.0 "相机支持转视角"
#
#   做三件事：备份 html → 语法校验 → git 提交并打标签
# ============================================================
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

VER="${1:-}"
NOTE="${2:-}"

if [ -z "$VER" ]; then
  echo "用法: bash tools/snapshot.sh <版本号> [<说明>]"
  echo "例:   bash tools/snapshot.sh 0.3.0 \"相机支持转视角\""
  exit 1
fi

STAMP="$(date +%Y%m%d)"
DEST="backups/v${VER}_${STAMP}_index.html"

mkdir -p backups

if [ -e "$DEST" ]; then
  echo "!! 快照已存在，未覆盖: $DEST"
  exit 1
fi

# ---- ⓪ 版本号检查：html 里的版本字符串必须和参数一致 ----
# （吃过亏：v0.11.8/9 发版时忘了改 tip 里的版本号字符串）
if ! grep -q "v${VER}" index.html; then
  echo "!! index.html 里没有找到 \"v${VER}\" —— 先改版本号字符串（#tip + 2 处 tipEl.textContent）再发版"
  exit 1
fi
echo "⓪ 版本号字符串 v${VER} 已确认"

# ---- ① 备份主文件 ----
cp index.html "$DEST"
echo "① 已备份 -> $DEST  ($(wc -c < "$DEST" | tr -d ' ') 字节)"

# ---- ② 语法校验：每个 script 块单独检查 ----
if command -v node >/dev/null 2>&1; then
  node -e '
    const fs = require("fs");
    const s = fs.readFileSync("index.html", "utf8");
    const m = [...s.matchAll(/<script>([\s\S]*?)<\/script>/g)];
    if (!m.length) { console.error("没有找到 script 块"); process.exit(1); }
    m.forEach((x, i) => fs.writeFileSync(".chk_" + i + ".js", x[1]));
    console.log("② 抽出 " + m.length + " 个 script 块");
  '
  for f in .chk_*.js; do
    node --check "$f" || { echo "!! 语法错误: $f"; rm -f .chk_*.js; exit 1; }
  done
  rm -f .chk_*.js
  echo "② 语法校验通过"
else
  echo "② 跳过语法校验（未找到 node）"
fi

# ---- ③ 提交与打标签 ----
if [ -d .git ]; then
  git add -A
  if git diff --cached --quiet; then
    echo "③ 工作区无变更，跳过提交"
  else
    git commit -q -m "release: v${VER}${NOTE:+ — $NOTE}"
    echo "③ 已提交"
  fi

  if git rev-parse -q --verify "refs/tags/v${VER}" >/dev/null 2>&1; then
    echo "④ 标签 v${VER} 已存在，跳过"
  else
    git tag -a "v${VER}" -m "v${VER}${NOTE:+ — $NOTE}"
    echo "④ 已打标签 v${VER}"
  fi
else
  echo "③ 未初始化 git，跳过提交"
fi

echo ""
echo "完成。记得在 docs/CHANGELOG.md 补一条 v${VER}，并跑一次孤立目录截图验证。"
