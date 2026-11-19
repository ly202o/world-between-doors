#!/bin/sh
# 一个 shell 里同时起无头浏览器和测试：浏览器进程活在这个 shell 里，
# 不会被"任务结束即杀进程"带掉（单独起后台进程会被回收）。
#
# 用法：bash tests/run_with_edge.sh tests/w01_iso190.mjs
#
# 前置：另开一条命令在项目根目录起静态服务（见 tests/README.md）：
#   (python -m http.server 8779 >/dev/null 2>&1 &) ; sleep 1.5 ; bash tests/run_with_edge.sh tests/w01_iso190.mjs
set -e
EDGE="/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"
if [ ! -f "$EDGE" ]; then
  EDGE="/c/Program Files/Microsoft/Edge/Application/msedge.exe"
fi
PROF="$(mktemp -d)/edge_profile"
"$EDGE" --headless=new --remote-debugging-port=9230 --user-data-dir="$PROF" \
  --no-first-run --no-default-browser-check --disable-gpu-sandbox --no-proxy-server \
  --use-angle=swiftshader --enable-unsafe-swiftshader --window-size=1000,700 \
  --mute-audio \
  about:blank >/dev/null 2>&1 &
EPID=$!
i=0
until curl -s --noproxy '*' -m 1 http://127.0.0.1:9230/json/version >/dev/null 2>&1; do
  i=$((i+1)); [ $i -gt 40 ] && { echo "浏览器没起来"; kill $EPID 2>/dev/null; exit 1; }
  sleep 0.5
done
echo "浏览器就绪 (pid $EPID)"
node "$@"
kill $EPID 2>/dev/null || true
wait $EPID 2>/dev/null || true
rm -rf "$(dirname "$PROF")" 2>/dev/null || true
