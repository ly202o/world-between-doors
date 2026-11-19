# RUNBOOK.md · 操作手册

## 默认上传与公开发布（2026-11-19 用户明确要求）

用户原话：「每次修改都直接上传git发布公开，默认。除非我说不上传」。

- 每次完成修改并通过相应验证后，自动提交 Git、推送游戏发布仓库，并完成公开发布；不再询问是否上传或发布。用户明确说「不上传」时，本轮不推送、不触发公开发布，仍保留本地改动记录。
- 游戏仓库：https://github.com/ly202o/world-between-doors ，发布分支 main。公开地址：https://ly202o.github.io/world-between-doors/ 。ssochi/land 仅为参考项目，禁止作为本游戏上传目标。
- 当前开发仓库 world01 没有 remote；现有发布检出目录为 world01/.art-check/private-publish（origin 指向上述游戏仓库）。先确认该目录 Git 状态并同步远端，再将本轮交付文件同步过去，检查差异后提交和推送。不得覆盖远端新增功能，不得强推。
- 游戏行为或画面修改：先完成语法、相关功能与离线/横竖屏验证，更新文档并运行 tools/snapshot.sh 保存本地版本；同步 world01.html 和相关文档到发布检出目录。保留已上线功能。
- 只改文档：同步相关文档、使用 docs/chore 提交并推送，不为文档改动增加游戏版本号或创建游戏快照。当前 main 的推送会自动触发 Pages，仍须检查发布结果。
- 推送后检查对应提交的 GitHub Actions 部署结果；成功后请求公开网页，核对实际版本或本轮关键内容。只提交或只推送不能称为「已发布」。
- 网络或部署失败时，检查原因并合理重试；仍失败须明确报告停在哪一步、尚未公开，不得说已上线。完成回复给出公开链接及验证结果。
- 此规则为长期默认，后续接手也须遵守；用户当轮明确的例外优先。


> **照着抄就能跑。** 命令都在项目根目录（`D:/VibeCoding/游戏开发/world01/`）执行，shell 是 Git Bash。
> 环境：Windows + Git Bash · Node 22 · Python 3 · Microsoft Edge（无头）

---

## 0. 目录地图

```
world01/
├── world01.html          ← 全部游戏代码，单文件自包含（316 万字节 / 5 个 script 块）
├── HANDOFF.md            ← 交接入口（先读）
├── AGENTS.md             ← 协作契约
├── README.md             ← 给玩家看的简介
├── docs/
│   ├── STATE.md          ← 活的状态 + 任务看板
│   ├── HISTORY.md        ← 79 版时间线
│   ├── CHANGELOG.md      ← 每版详细改动与教训（2279 行）
│   ├── MEMORY.md         ← 长期记忆：决策、坑、参数速查（653 行）
│   ├── RULES.md          ← 章程
│   ├── DESIGN.md         ← 技术设计
│   ├── GAME.md           ← 玩家视角
│   └── TESTLIST-20261114.md ← 用户验收清单（滚动一份，不按日期新建）
├── tests/                ← 16 套回归测试 + run_with_edge.sh
├── tools/
│   ├── snapshot.sh       ← 发版：备份 → 语法校验 → commit → tag
│   └── backup_index.js   ← 刷新 backups/versions.html
├── backups/              ← 79 个历史版本 + versions.html 索引
├── refs/                 ← 参考素材（ALS 源码摘录等）
├── iso01/iso.html        ← 早期跑偏做的小岛 demo（未使用，留着）
└── compare*.png          ← 早期对比图（历史遗留）
```

---

## 0.1 代码地图（`world01.html` 4060 行，改哪一行）

行号会随版本漂移，**认区块注释和函数名，别认行号**（下面是 v0.22.0 的位置，用 `grep -n` 重新定位）。

| 要改什么 | 位置 | 关键符号 |
|---|---|---|
| 样式 / UI 外观 | 第 20~215 行（`<style>`） | CSS 变量在 `:root` 与深浅主题块；`#settingsPanel` 在 117~200；右缘按钮 `#viewBtn` 等在 100~112 |
| 设置面板行为 | ~2068 | `showSettings(on)`（`body.sideOpen` 在这里切）、`syncSettings()`、`saveSettings()` |
| 启动自检 | ~275 | 白屏/WebGL 检测 |
| 渲染器 / 场景 / 光 | 297 / 340 / 355 | `renderer`、`scene.fog`、三盏灯 |
| 地面 + 网格 | 375 | 无限地面跟随角色 |
| 确定性随机 + 散落积木 | 429 / 435 | `rnd()` 系列，散布物都吃固定种子 |
| 房子 / 门廊 / 车道 / 栅栏 | 796 / 804 / 809 / 839 / 842 | `makeHouse` 等；栅栏柱与横板分开登记碰撞 |
| 碰撞体注册 | ~478 | `addPost(x,y,z,r,h)`（圆柱树干用这个）、`colliders`、`kind` / `top` / `hw` / `round` 字段 |
| 碰撞求解 | ~2856 | `collideXZ(dt, tx, tz)`、`supportAt(px,pz,feet)`（坡面/屋顶支撑同一条路径） |
| 角色网格与骨骼 | 958 | ALS AnimMan 真蒙皮，68 骨；两遍脚部 IK 在 1270 / 1303 |
| 角色状态 | 1837 | `P`（pos/vy/onGround/face/faceTarget/phase/...）、`vel` |
| 相机（三档透视） | 1869 | `camYaw` / `camPitch` / `camDist` / `freePitch` / `freeDist`；遮挡拉近与 `ghostMat` |
| **等距** | 1907~1974 | `ISO_PITCH`(35.264°)、`ISO_YAW_BASE`(45°)、`ISO_YAW_FINE`(15°)、`ISO_YAW_TICKS`(24)、`ISO_YAW_COARSE`(6)；`isoDistTarget()` / `isoZoom()` / `isoSnap()` / `isoYawIdx` / `isoFreeDrag` / `isoViewH` |
| **重叠层/传送门** | `splitWorlds` / `buildPortalDoors` / `enterPortal` / `renderPortals`（约 6146~6470） | `curWorld`、`portalDoors`、`spawnRoot`、`fieldRoot`、`BUILD_WORLD`；跨门只切世界不改坐标 |
| 视角切换 | ~2181 | `toggleView()`（四档循环）、`toggleIsoSnap()`（固定/自由，~2226） |
| 输入：滚轮 / 捏合 / 拖动 | ~2356 / ~2388 | `zoomFree(k)`、`turnBy(dx,dy,sens)`、`pinch` 对象、`ptrs` |
| **键盘分发** | ~2308 | `window.addEventListener('keydown', ...)`：V 切视角、F2 面板、M 鼠标、Q/E 等距档位（`isoMode && isoFreeDrag && (k==='q'\|\|k==='e')`，~2328）、G 固定/自由 |
| 主更新 / 冲刺 / 倾斜 / 动画状态机 | 2849 / 3016 / 3218 / 3232 | `update()`、`ANIM`、`TURN` |
| 摇杆绘制 | 3512 | DOM 层 2D 画布，不走 WebGL |
| 尺寸 | ~3541 | `resize()`（**按 canvas.clientWidth 算**，横竖屏按 window 判） |
| 自适应分辨率 | ~3577 | `adaptResolution(dt)`、`perfStat.scale`（下限 0.62） |
| 待机检测 | ~3789 | `IDLE_MS`(30000)、`markInput()`、`loop()` 顶部 `idleNow` 分支 |
| 主循环 | ~3847 | `loop(t)`：物理固定步进 → 相机 → 动画 → 渲染 |
| 诊断口 | ~3940 | `window.__world = {...}`（`iso` / `power` / `setIso` / `setYaw` / `frameCount`） |
| 版本号（两处） | `#tip` 文案 + `window.__worldVersion` | 历史注释里的旧版本号**不要**改 |

## 0.2 传送门结构（v0.25.0，真门）

| 要改什么 | 位置 / 符号 |
|---|---|
| 三个世界怎么分 | `splitWorlds()`（portal 段）把 `scene` 除地面/角色/灯外的子节点按组挂进 `spawnRoot` / `fieldRoot`；`duskLevel.host` 是便利店世界 |
| 出生世界 | `buildSpawnWorld()`：两扇门在 `(±2.6, 0, -4)`（z=200），石板/石灯（带 `PointLight`）/枯树/立石/苔 |
| 回程门 | `buildPortalDoors()`：便利店世界 `(-15.5, 24.5)` 朝西（街角斑马线旁空地，四周留空）、场地 `(2, -4)` 朝北；`d.group` 的局部 +Z 是门的正面 |
| 门后画面 | 透视正确：`toDest = 目的门矩阵 · 180° · 源门矩阵⁻¹`；`initPortals()` 建半分辨率 RT（画布/2）与 `ShaderMaterial`（屏幕空间采样 `gl_FragCoord/uRes`）；`renderPortals()` 用 `虚拟相机矩阵 = toDest · activeCam.matrixWorld`、投影复用 activeCam，渲染时隐藏目的地回程门组 |
| 传送 | `updatePortals()` 判断跨门面（`prevZ > 0.02 && z <= 0.02`）→ `enterPortal()`：位置/朝向/相机方位按同一个 `toDest` 变换，落点前推 0.8m；`portalCool` 0.25s |
| 视觉/灯光 | `applyWorldLighting(w)`：便利店开自身 4 盏灯 + 橙雾；spawn/field 用主题灯、关卡灯归零 |
| 门的开关/提示 | `togglePortal()` / `#portalTip` / `#portalBtn`；门扇向内开 -1.75 rad；E 在键盘分支里先于便利店门处理 |
| 便利店店内门 | `storeDoor` 系统不变（v0.23.1），`initStoreDoor()` 在 `initPortals()` 之前 |
| 诊断 | `__world.portals`（getter，不是函数）、`__world.gotoWorld('spawn'|'field'|'konbini')` |
| 测试 | `tests/w01_portal.mjs`；碰撞体 677、豁免 27 已写进 `w01_v160` / `w01_v140` |

### 0.2 两关 / 门 / 出生点（v0.23.0）

便利店那关是把 `D:/VibeCoding/dsh/dusk-konbini-corner.html` 的建模段（43~2166 行）ES5 化后搬进来的，不要再去改源文件来同步。

| 要改什么 | 位置 | 关键符号 |
|---|---|---|
| 出生点 | ~604 | `P` 初始化里的 `Vector3(0, 0, 26.5)` |
| 两关区域 | ~626 | `DUSK_YAW`(π/2)、`DUSK_SPOT`(-23,22)、`DUSK_GATE`(-13.5,22)、`FIELD_GATE`(-3,16)、`DUSK_ZONE`(街道矩形)、`PLAZA`、`inPlaza()`、`inDuskZone()` |
| 石板路 / 立石 / 石灯笼 / 枯树 | 常量之后 | `buildPlaza()`、`paving()`、`stoneLantern()`、`bareTree()` |
| 两扇真门 | 同段 | `makeGate(opts)`：门槛、门柱、门楣、坡屋顶、敞开门扇；门扇进 `EXEMPT` |
| 便利店建模 | ~3797~5878 | `makeDuskLevel()` 内部的 `piece()` / `boxAt()` / `cylAt()` / `TEX.*` / `S`（店面尺寸）/ `SCX,SCZ`（店面中心）；整块是 ES5 化的原建模代码 |
| 关卡放置 / 灯 / 天空 | ~5880~6000 | `buildDuskLevel(scene)`：host 放 `DUSK_SPOT`、`rotation.y=DUSK_YAW`、四盏灯挂 host、`duskSun.target` 在关卡中心、`duskSky` 半径 280 BackSide 跟随相机 |
| 天光混合 | ~6000~6120 | `updateDuskWeather(dt)`：`duskBlend`、`duskTarget`、世界 hemi/sun 压 0.06/0.01、关卡 hemi/sun/fill/bounce、雾色、阴影在 blend>0.55 换手 |
| 主循环 | loop 内 | `updateDuskWeather(dt)` 在渲染前调用 |
| 碰撞 | ~6124 | `fillCollisionGaps()` 仍在所有场景建好之后；门扇/地面/骨骼/天穹进 `EXEMPT` |

> 测试里写死的数字：`w01_v160.mjs` 碰撞体 670；`w01_v140.mjs` 豁免 11、碰撞体 670；`w01_iso170.mjs` 采样窗口 4s。动关卡几何/门/碰撞时这些断言要同步改。

---

## 1. 语法校验（每次改完第一件事）

```bash
python -c "
import re, io, subprocess, tempfile, os
s = io.open('world01.html', encoding='utf-8').read()
blocks = re.findall(r'<script>(.*?)</script>', s, re.S)
print('blocks:', len(blocks))
for i, b in enumerate(blocks):
    f = tempfile.NamedTemporaryFile('w', suffix='.js', delete=False, encoding='utf-8')
    f.write(b); f.close()
    r = subprocess.run(['node', '--check', f.name], capture_output=True, text=True)
    print(i, 'OK' if r.returncode == 0 else 'FAIL ' + r.stderr[:300])
    os.unlink(f.name)
"
```

**必须 5 块全 OK 且 blocks: 5。** 历史上坏过的是库那一块（第 0 块），不是游戏那块——所以要逐块查，不能只看第一块。

---

## 2. 跑测试

### 单套

```bash
(python -m http.server 8779 >/dev/null 2>&1 &) ; sleep 1.5 ; \
  bash tests/run_with_edge.sh tests/w01_v220.mjs
```

**服务与测试必须写在同一条命令里。** 单独起的后台 `http.server` 会被系统回收，表现是 `502` 或 `chrome-error://chromewebdata/`。

### 全量（16 套）

```bash
(python -m http.server 8779 >/dev/null 2>&1 &) ; sleep 1.5 ; \
for t in tests/w01_*.mjs; do echo "=== $t ==="; bash tests/run_with_edge.sh "$t" 2>&1 | tail -3; done
```

每套会自己起一个无头 Edge（端口 9230，`--use-angle=swiftshader` 软件渲染）并把页面导航到 `http://127.0.0.1:8779/world01.html?s=<时间戳>`。

每套测什么、已知抖动、断言口径：**`tests/README.md`**。

---

## 3. 孤立目录验证（最容易暴露依赖缺失）

```bash
mkdir -p /d/temp/_isolated && cp world01.html /d/temp/_isolated/ && \
# 空目录里只放这一个文件，用浏览器打开 file:///D:/temp/_isolated/world01.html
# 画面必须正常、控制台零异常、零外部请求
```

自动化版（改路径即可复用）：

```bash
# 用 iso_check 那类脚本：navigate 到 file:///D:/temp/_isolated/world01.html
# 读 window.__errors、__worldVersion、__world.iso，再 captureScreenshot
```

手动检查三件事：**画面不是白屏 / 控制台无异常 / Network 无外部请求**。

---

## 4. 截图（目检用）

无头浏览器截图套路（写进任何 .mjs）：

```js
const r = await send('Page.captureScreenshot', { format: 'png' });
fs.writeFileSync('D:/temp/shot.png', Buffer.from(r.result.data, 'base64'));
```

双击看大图，重点看：画面完整性、UI 是否被裁、遮挡、主题对比。

---

## 5. 发版

```bash
bash tools/snapshot.sh 0.23.0 "一句话说明这次改了什么"
```

**第一个参数不带 `v`**（脚本自己加）：传 `0.23.0`，产出 tag `v0.23.0`、备份 `backups/v0.23.0_YYYYMMDD.html`。

它做四件事：备份 → 刷新 `backups/versions.html` → 抽 5 个 script 块语法校验 → git commit + tag。

发版前必须：
1. `world01.html` 里两处版本号已改：`#tip` 末尾的 `·　vX.Y.Z` 与 `window.__worldVersion = 'vX.Y.Z'`（历史注释里的旧版本号**不要**改）
2. `docs/CHANGELOG.md` 已有对应条目
3. 测试全绿

只改文档不改代码 → 用 `chore` 提交，**不打 tag**。

### 发版后

- 工作区应为干净：`git status` 无改动（`AGENTS.md` 底部版本号要在发版**之前**改好，否则会留下未提交改动）
- 没有远程仓库，**不需要 push**；历史版本靠本地 tag 与 `backups/`
- 偶尔残留的端口进程（8779 / 9230）在会话结束时会随之退出；若端口被占：

```bash
# 查占用并结束（Git Bash）
netstat -ano | grep -E '8779|9230'
# 记下 PID 后
taskkill //PID <pid> //F
```

### 发布副本（`release/`，给"外面"用的文件）

开发版是项目根目录的 `world01.html`，随改随动；发布版是 `release/` 下的冻结副本，名字带版本：

```
release/
├── world01-v0.23.1.html   ← 拷到手机 / 别的电脑 / 发邮件都行
├── index.html             ← 整个文件夹拖到静态托管时的入口
└── README.txt             ← 版本、大小、sha256、打开方式
```

- 两个文件内容**完全一致**（单文件、无构建步骤），区分只靠位置和文件名，避免"外面打开的是半成品"。
- 每次发版后跑一次：

```bash
bash tools/publish.sh 0.23.1
```

- `release/` 已在 `.gitignore` 里，不入库；版本历史仍以 git / `backups/` 为准。
- 手机打开：安卓浏览器可直接开本地文件；iPhone 的"文件"预览不执行脚本，建议走静态托管（把 `release/` 整个传上去，入口 `index.html`）。

---

## 6. 回滚（改坏了怎么退回）

**三个层次，从轻到重：**

```bash
# ① 只撤回未提交的改动（改动还没 commit）
git checkout -- world01.html

# ② 撤回已 commit 但没发版的那次（保留改动为未暂存）
git reset --soft HEAD~1

# ③ 整版回到某个旧版本（关键代码坏了）
git log --oneline -10                     # 找到目标版本
git checkout v0.21.0 -- world01.html      # 只把 html 退回 v0.21.0
#   注意：退回来的文件里两处版本号也是旧的，发版前要改成新版本号
#   （#tip 末尾 与 window.__worldVersion），否则 snapshot.sh 会报版本号不一致
# 然后照常发一个新版本（不要 force push、不要改历史 tag）
bash tools/snapshot.sh 0.22.1 "回退 v0.22.0 的 XX 问题"
```

**给用户看旧版本**：直接打开 `backups/versions.html`，点一行就是那一版（不需要懂 git）。

---

## 7. 手机验收（用户在手机上测的时候）

1. 把 `world01.html` **单个文件**拷到手机（微信文件传输 / 数据线都行），用浏览器打开——**不需要旁边的任何东西**，这正是单文件底线的意义
2. 该看的：进场是否等距全景、拖动是否按固定/自由表现、双指缩放是否跟手、设置面板是否在屏幕内、FPS 是否「待机」能进能出
3. 手机没有 Q/E（键盘专属），15° 细调目前**没有触屏入口**（T3 待办）

---

## 8. 常见错误对照表

| 现象 | 原因 | 解法 |
|---|---|---|
| `502` / `chrome-error://chromewebdata/` | 后台 `http.server` 被回收 | 服务与测试写在**同一条命令**里 |
| `TypeError: Cannot read properties of undefined (reading 'iso')` | 页面没加载成功（服务没起 / 目录不对） | 在**项目根目录**起服务，确认 `curl http://127.0.0.1:8779/world01.html` 返回 200 |
| `SyntaxError: invalid syntax`（python heredoc） | 内层 ASCII 引号与外层定界符打架 | 长补丁写成 `.py` 文件再执行，字符串内用「」 |
| `ReferenceError: frames is not defined` | 测试里用了未定义的助手 | 在各套文件顶部补 `const frames = async () => num('window.__world.frameCount')` |
| 按钮点了没反应（测试里） | 监听是 `pointerdown`，测试发了 `click` / `mousedown` | 发 `PointerEvent('pointerdown', {bubbles:true})` |
| 版本断言挂掉 | 测试写死了版本号 | 用 `/^v0\.\d+\.\d+$/`，条数用 `>= N` |
| 待机帧数断言挂 | 基准取在进入待机之前 | 确认 `idle === true` **之后**再取基准 |
| 测试偶发失败（v136 推出距离 / power 一碰就回） | 见 `tests/README.md` 的「已知固有抖动」 | 按表里的等待方式处理，**不要去改游戏** |

---

## 9. 诊断口（`window.__world`）

```js
__worldVersion                      // 'v0.22.0'
__world.viewMode                    // 0 第一 / 1 第三 / 2 自由 / 3 等距
__world.iso                         // {on, yawIdx, yawDeg, stepDeg, coarse, exact, free, viewH, distCur, distTarget, halfH, expectHalfH, active, isOrtho}
__world.power                       // {idle, hidden, idleMs, sinceInput}
__world.setIdleMs(1200)             // 测试缩待机阈值
__world.frameCount                  // 渲染帧计数（验证"停渲染"）
__world.setIso(idx, viewH)          // 直接摆等距机位
__world.setYaw(rad)                 // 直接摆水平角
__world.camera / __world.P / __world.vel / window.__colliders
__world.renderSize                  // 渲染缓冲尺寸
window.__errors                     // 未捕获异常数组（每套测试末尾都断言为空）
```

---

## 10. 收尾清单（每轮工作结束）

- [ ] 5 个 script 块语法校验通过
- [ ] 相关测试跑过、全量回归绿
- [ ] 孤立目录 `file://` 验证 + 截图目检
- [ ] `docs/CHANGELOG.md` 新增条目（含实测与体积变化）
- [ ] `docs/TESTLIST-20261114.md` 追加条目（做了什么 / 怎么测 / 应该看到什么）
- [ ] **`docs/STATE.md` 更新**（一句话状态、最近版本、任务看板）
- [ ] `docs/HISTORY.md` 加一行
- [ ] 相关文档同步：`DESIGN.md` / `GAME.md` / `MEMORY.md`
- [ ] `AGENTS.md` 底部「当前版本」改掉
- [ ] `bash tools/snapshot.sh <版本> "<说明>"`
- [ ] 清理临时文件（临时截图、`.chk_*.js`；孤立目录用 `/d/temp/_isolated`，用完删掉）

### land 场景重建
源码 vendor/land，运行 npm install 后，在项目根目录执行 node vendor/land/tools/build.mjs --scene scenes/hateno-valley.js --out ../../.art-check/land-valley.html。集成脚本 tools/integrate-land.cjs 从构建文件生成嵌入内容，需先恢复 pre-land 快照再运行，禁止对已嵌入页面重复运行。运行 node tests/land-integration.cjs 检查。第三方 LICENSE 必须保留且游戏场景中显示 land 链接致谢。

v0.31.1 起：已有集成版本重建时，先构建 .art-check/land-valley.html，再运行 node tools/rebuild-land.cjs。桥接源码维护在 vendor/land/game-bridge.html，保留角色和倍速接入；不要再次使用初版 integrate-land.cjs 覆盖现有版本。
