#!/usr/bin/env bash
# ============================================================
# WORLD 01 · 发布副本
#
#   用法：bash tools/publish.sh <版本号>
#   例：  bash tools/publish.sh 0.23.1
#
#   把根目录的 world01.html 复制成：
#     release/world01-v<版本>.html   给"外面"的文件名（拷到手机/别的电脑）
#     release/index.html             整个文件夹拖到静态托管时的入口
#     release/README.txt             版本、大小、sha256、打开方式
#
#   只复制，不提交、不打 tag；版本与备份仍由 tools/snapshot.sh 负责。
# ============================================================
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

VER="${1:-}"
if [ -z "$VER" ]; then
  echo "用法: bash tools/publish.sh <版本号>"
  echo "例:   bash tools/publish.sh 0.23.1"
  exit 1
fi

if [ ! -f world01.html ]; then
  echo "!! 找不到 world01.html"
  exit 1
fi

mkdir -p release
NAME="release/world01-v${VER}.html"
cp world01.html "$NAME"
cp world01.html release/index.html

SIZE="$(wc -c < world01.html | tr -d ' ')"
HASH="$(sha256sum world01.html | cut -d' ' -f1)"
DATE="$(date +%Y-%m-%d)"

cat > release/README.txt <<EOF
WORLD 01 发布副本
版本：v${VER}
日期：${DATE}
来源：项目根目录 world01.html（整包单文件，零外部请求）
大小：${SIZE} 字节
sha256：${HASH}

怎么打开
- 电脑：双击 index.html 或 world01-v${VER}.html
- 手机：把 world01-v${VER}.html 发到手机，用浏览器打开（安卓 Chrome/Edge 可直接打开本地文件；
  iPhone 的"文件"预览不执行脚本，建议走下面的"托管"或专门的本地网页打开工具）
- 在外面随时打开：把整个 release 文件夹上传到任意静态托管
  （Netlify Drop / GitHub Pages / 腾讯云 COS 静态网站等），入口就是 index.html

怎么更新
- 开发版是项目根目录的 world01.html，随改随动
- 每次发版后重新跑：bash tools/publish.sh <新版本号>
- 两个文件内容一致，区分只靠位置和文件名；release/ 不入库
EOF

echo "发布副本已生成："
echo "  $NAME"
echo "  release/index.html"
echo "  release/README.txt"
echo "  大小 ${SIZE} 字节，sha256 ${HASH:0:16}…"
