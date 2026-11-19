# ALS4 对比研究与 WORLD 01 自有运动系统

日期：2026-11-14
范围：`D:/temp/als_export/Content/AdvancedLocomotionV4` 的本地 UE4.24 资产可读字段、`world01` 当前单文件代码、`refs/anim_fbx` 与 `tools/anim`。本文件只记录本地扫描结果，不把字段名当作已读取的蓝图执行逻辑。

## 1. 扫描证据与边界

扫描到的 ALS4 关键资产包括：

- `Blueprints/CharacterLogic/ALS_Base_CharacterBP.uasset`
- `Blueprints/CharacterLogic/ALS_AnimMan_CharacterBP.uasset`
- `Blueprints/CameraSystem/ALS_PlayerCameraBehavior.uasset`
- `Blueprints/AnimNotifys/Footstep_AnimNotify.uasset`
- `Data/DataTables/MovementModelTable.uasset`
- `Data/Structs/Mantle_Params.uasset`
- `Data/Structs/Mantle_TraceSettings.uasset`
- 动画/蒙太奇资源：`ALS_N_Walk_F`、`ALS_N_Run_F`、`ALS_N_Sprint_F`、`ALS_N_Mantle_1m_Montage_RH`、`ALS_N_Mantle_2m_Montage_Default`、跳跃/下落/落地/转身等。

uasset 的字符串字段明确出现了 `Acceleration`、`AddMovementInput`、`ActualGait`、`AllowedGait`、`MovementState`、`RotationMode`、`ViewMode`、`Mantle_1m`、`Mantle_2m`、`Mantle_Params`、`Mantle_TraceSettings`、`MovementModelTable`、`Footstep_AnimNotify`、`GetAnimCurveValue`、`SpawnSoundAttached` 等。由于这里没有打开 UE 编辑器执行蓝图、没有反序列化节点图和曲线数值，因此以下“ALS 行为”仅按可读字段、已导出动画和项目已有记录区分为“参考思路”，不声称完整复刻。

## 2. ALS4 与当前实现对比

| 领域 | ALS4 资产/思路证据 | WORLD 01 当前实现 | 状态 |
|---|---|---|---|
| 步态 | `MovementModelTable` 含 Normal/Responsive/Sluggish，以及 Walk/Run/SprintSpeed 字段 | `walk / run / sprint` 三段状态，速度由代码参数驱动，动画速率按实际速度/原生步速采样 | 已复刻思路，非完整表格/曲线复刻 |
| 加速度/转向 | `Acceleration`、`AddMovementInput`、MovementModel/Rotation 曲线字段 | 稳定圆柱运动，速度向量按可调加速度逼近目标，局部加速度驱动 Lean | 已复刻核心手感思路，非完整 ALS 曲线 |
| 姿态倾斜 | ALS 常见的局部加速度与 LeanAmount 分层；当前文档也记录了相对加速度归一化 | `P.leanFB/P.leanLR` + `bodyPivot` additive 倾斜 | 已复刻参考思路 |
| 相机 | `ALS_PlayerCameraBehavior`、RotationMode、ViewMode、CameraLerp 字段 | 第一/第三/自由三模式，球面轨道、碰撞收缩、自由遮挡淡出、45°锁定 | 已复刻部分能力；不是 ALS Camera Behavior 蓝图复刻 |
| 脚步 | `Footstep_AnimNotify`、FootstepType、`GetAnimCurveValue`、`SpawnSoundAttached` | 直接读取烘焙动画 `steps` 事件，在动画时间跨越事件帧时播放内嵌 ALS 原版录音 | 已复刻可验证的事件同步链；不是 UE Notify 执行环境 |
| Mantle | `Mantle_TraceSettings` 含 Min/Max Ledge Height、Reach Distance、Forward/Downward Trace Radius；`Mantle_Params` 含 StartingPosition、StartingOffset、PositionCorrectionCurve、PlayRate；存在 1m/2m 资源 | 前方逐步采样、沿高筛选、24 段 bodyClear、撑起→越沿→落稳三段路径；栏栅翻到另一侧、不提供窄顶站立 | 参考思路已落地；1m 动画+代码路径，非完整 Root Motion/IK |
| 2m 高墙 | ALS4 资产明确存在 `ALS_N_Mantle_2m_Montage_Default` 与 `Mantle_2m` 曲线 | 当前仅允许 1m 级别；超过起跳支撑高度限制不自动吸附，需分级平台 | 未复刻，明确限制 |
| 动画混合 | ALS4 资产含 AnimBP、BlendListByBool/Enum 等可读字段 | 单文件骨骼姿态采样、0.18s 混合、落地/攀爬一次性动画 | 已做自有运行时替代，不是完整 AnimBP |
| 角色碰撞 | ALS4 的 CharacterMovement/胶囊体系属于引擎运行时语义；本次扫描没有把骨骼网格当移动阻挡的证据 | 主移动保持稳定圆柱；13 个骨骼近似盒只作诊断，不参与移动/受击/布娃娃 | 设计上拒绝用单骨骼摆动直接推主角 |
| 战斗/武器 | `ALS_AnimMan_CharacterBP` 字段中可见 M9/M4A1/Bow 等资源 | 仅保留现有基础几何手枪兼容回归 | 暂不扩展 |

## 3. 已复刻、未复刻、不可夸大之处

### 已复刻或已形成等价替代

- Walk/Run/Sprint 分层、实际速度驱动动画速率。
- 加速、减速、贴墙切向保留、局部加速度 Lean。
- 第一/第三/自由视角和相机防穿模的可玩替代。
- 以动画真实时间事件触发脚步，而不是用固定渲染帧猜脚步。
- 1m Mantle 的可达性筛选、净空检测、分阶段路径和一次性动画。
- 栏栅作为翻越障碍，结束落在另一侧，不把窄栏顶当最终支撑面。

### 明确未复刻

- UE CharacterMovementComponent、Root Motion、AnimBP 状态机和完整蓝图节点图。
- ALS 的 MovementModelTable 全部速度/旋转曲线及 Responsive/Sluggish 数据驱动切换。
- 完整 2m Mantle 蒙太奇、Mantle 曲线、双手抓沿 IK、手掌/脚掌贴面。
- ALS 的完整 RotationMode、Aiming、Overlay、Stance、Ragdoll 与网络/AI 生态。
- UE AnimNotify 的音频衰减、材质/地面 FootstepType 分类执行链。
- 任意骨骼作为真实移动碰撞体或受击体。

## 4. WORLD 01 自有系统命名建议与实际采用

建议并采用名称：**轨迹相位运动系统（Trajectory-Phase Locomotion，简称 TPL）**。

它不是“ALS4 复刻”，差异在于：

1. **稳定主碰撞**：角色移动由圆柱解决，骨骼细化体只作为调试/接触分类，避免动画摆动导致移动失稳。
2. **轨迹优先**：攀爬使用可验证的撑起、越沿、落稳轨迹；动画负责姿态表现，位置轨迹负责不穿透。
3. **相位脚步**：脚步由当前动画采样时间跨越实际步事件触发，音频相位和动画相位共用同一时钟。
4. **连续台阶支撑**：`stepTarget` 独立于即时碰撞，脚接触/骨盆补偿只修表现，不把骨骼反馈回主物理。
5. **自有速度档**：普通走、跑、快跑、慢走是 TPL 的显式参数，不依赖 ALS 的固定默认速度。
6. **跟随视角**：可选角色跟随相机 yaw；自由视角仍可独立旋转，不强行改变原有三档视角。

因此准确表述是：**TPL 借鉴 ALS4 的步态、Lean、Mantle 检测与动画事件思想，使用项目已有 ALS 动画作为素材，但不声称完整复刻 ALS4。**

## 5. 当前项目工具与动画证据

- `tools/anim/export_anims.py` 导出 Locomotion、InAir、TurnInPlace、BasePoses、Transitions。
- `tools/anim/export_mantle.py` 导出/处理 Mantle。
- `tools/anim/bake_full.cjs` 将骨骼局部旋转烘焙为单文件运行时数据。
- `refs/anim_fbx/` 已有 Walk、Run、Sprint、Jump、Fall、Land、Turn、JumpWalk/Run 资源。
- `world01.html` 已内嵌 `__RIG`、`__ANIMS` 和 ALS 原版脚步 WAV base64；无外部请求。

## 6. 本阶段结论

当前项目可以称为“使用 ALS 动画素材的 TPL 第一版”，不能称为“完整 ALS4 复刻”。模型作为唯一移动碰撞体不适合当前移动阻挡；稳定圆柱 + 调试骨骼盒是更可控的第一版。高墙只有 1m 动画时必须分级或拒绝直接攀爬，不能用普通跳跃加平移伪装成 2m Mantle。
