# tests/ · 回归测试

**14 套 CDP 无头浏览器测试，跑真实页面、读真实状态。** 没有单元测试框架，每套是一个自包含的 `.mjs`（用原生 `fetch` + `WebSocket` 连 DevTools 协议，无需 npm 装包）。

## 怎么跑

```bash
# 在项目根目录：服务和测试必须放在同一条命令里启动
# （单独起后台 http.server 会被系统回收，表现为 502 / chrome-error）
(python -m http.server 8779 >/dev/null 2>&1 &) ; sleep 1.5 ; \
  bash tests/run_with_edge.sh tests/w01_iso190.mjs
```

全量：

```bash
(python -m http.server 8779 >/dev/null 2>&1 &) ; sleep 1.5 ; \
for t in tests/w01_*.mjs; do echo "=== $t ==="; bash tests/run_with_edge.sh "$t" 2>&1 | tail -3; done
```

## 每套测什么

| 文件 | 项数 | 管什么 | 什么时候一定要跑 |
|---|---|---|---|
| `w01_v220.mjs` | 23 | **设置面板并行侧栏**（画布缩窄/不重叠/按钮左移/resize 按画布算/FOV 不跳/窄屏与矮屏形态）+ **等距缩放跟手**（60ms 内机距到位） | 改面板、改 resize、改缩放 |
| `w01_v200.mjs` | 31 | 设置面板的可见性与交互（矩形在视口内、滑条改值、F2/Esc/按钮三种关闭、横屏贴底）+ 待机检测基础 | 改面板、改待机 |
| `w01_power.mjs` | 22 | 省电：进待机后渲染帧零增长、一碰就回、走路/面板不误入、滚轮点击算输入、待机无漂移 | 改主循环、改待机 |
| `w01_iso190.mjs` | 32 | **等距语义总纲**：默认档、固定=完全不能转、自由=连续拖、Q/E 档位、切固定吸附真等距方位、循环还活着 | 改等距旋转 |
| `w01_iso180.mjs` | 34 | 等距细档（15°）、拖动固定/自由的语义、几何（真等距三轴等长、细档拉长是已知取舍、正交不变形） | 改等距 |
| `w01_iso170.mjs` | 30 | 默认等距 + 开局一次性落位（无开场旋转）+ 四档循环 | 改默认档/进场 |
| `w01_iso150.mjs` | 47 | 等距作为第 4 档的全部边界（切换、界面、主题、自适应、无清单侧栏） | 改视角档位 |
| `w01_v160.mjs` | 42 | 视角四档闭环 + 45° 锁定 + 界面按钮 | 改相机/视角 UI |
| `w01_v140.mjs` | 34 | 武器删除后的残留检查（界面/输入/模型/碰撞豁免表都不许留半截） | 删功能时参照 |
| `w01_v136.mjs` | 26 | 面板不拦输入（拖动/走路）、碎石碰撞、树干圆柱碰撞（塞进树里量四向推出）、土坡站得住、环境音默认关 | 改碰撞/输入 |
| `w01_ik.mjs` | 29 | 角色 IK：双臂/双腿解算、脚贴地、手不穿身 | 改骨骼/姿态 |
| `w01_look.mjs` | 17 | 视线/转头：第一人称与第三人称朝向、甩视角不误触转身 | 改朝向 |
| `w01_turn.mjs` | 13 | 90° 转身：结算到 `P.face`、移动/甩视角打断、打断保留已转角度 | 改转身 |
| `w01_adapt.mjs` | 4 | 自适应分辨率：低帧降采样、到下限停住、不来回抖、canvas 尺寸跟随 | 改渲染分辨率 |

## 已知固有抖动（不是 bug，别去"修"游戏）

| 现象 | 原因 | 测试里怎么处理 |
|---|---|---|
| `v136` 四方向推出距离不一致（第一方向 0.44 vs 其余 0.413） | 走路结束后 ~1s 内 `inX/inZ`/`pivotCool` 还有残留，此时塞树测推出会偏大 0.034；**纯净状态下四向严格一致** | 走路松键后静置 1500ms 再测 |
| `power`「一碰就回」偶发失败 | 无头下待机空转的 rAF 会被限频，单发按键后要等下一帧才恢复，700ms 内可能等不到 | 改成按住 W 850ms（持续输入期间 rAF 全速） |
| `power` FPS 文案还显示「待机」 | 文案半秒刷一次；阈值 1200ms 会二次进待机把文案盖回去 | 断言落在 500~1200ms 窗口内 |
| `v220` 渲染缓冲区宽度小于画布 CSS 宽 | 软件渲染掉帧 → 自适应分辨率降采样，**正常行为** | 断言只要「不是全宽」即可 |

## 断言口径（写新测试必看）

- **禁写死**：版本号用 `/^v0\.\d+\.\d+$/`；条数用 `>= N`；档位起点从运行时读；`gotoView` 按到为止。
- **交互必须发真事件**：按钮监听是 `pointerdown` 不是 `click`/`mousedown`；键盘用 `Input.dispatchKeyEvent`。
- **UI 验收看屏幕矩形**：断言 `getBoundingClientRect()` 落在视口内且尺寸像样，不能只断言 `hidden` 属性。
- **帧数基线要在确认状态之后再取**：验证"渲染停了"必须先在确认 `idle === true` 后取基准。
- 每套末尾都断言 `(window.__errors||[]).length === 0`。

## 诊断口速查（页面里的 `window.__world`）

| 接口 | 说明 |
|---|---|
| `__worldVersion` | 当前版本字符串 |
| `__world.iso` | `{on, yawIdx, yawDeg, stepDeg, coarse, exact, free, viewH, distCur, distTarget, halfH, expectHalfH, active, isOrtho}` |
| `__world.power` | `{idle, hidden, idleMs, sinceInput}`；`setIdleMs(ms)` 供测试缩阈值 |
| `__world.frameCount` | `renderer.info.render.frame`，验证渲染真的在/不在跑 |
| `__world.setIso(idx, viewH)` / `setYaw(rad)` | 测试直接摆机位（注意等距下谁是驱动量） |
| `__world.camera` / `__world.P` / `__world.vel` / `colliders` | 相机、角色状态、速度、碰撞体表 |
| `__world.viewMode` | 0 第一 / 1 第三 / 2 自由 / 3 等距 |
