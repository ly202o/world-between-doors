# 塞尔达制作前与当前版启动对比

基准：manual_before_fourth_gate_20261119.html（v0.30.11）。当前：v0.32.3。

## 确认一致
密码脚本、Three.js 引擎、角色网格/骨骼、动作数据、脚步数据这五段脚本哈希完全一致。
- getAxis: 逐字相同
- collideXZ: 逐字相同
- supportAt: 仅空白差异
- update: 逐字相同
- driveAnim: 逐字相同
- loop: 逐字相同

## 后续差异
主要为弱显示菜单、设置面板与设置存档、资源大小显示、10×上限、相机远裁面/缩放上限/缩放雾适配，以及全屏/更新按钮。无 land 运行资源或第四扇门。

## 测试结果和局限
WebKit 26.6 的 Windows 移动视口下，两份本地页面均能启动，__world 已创建、帧数递增、无脚本异常。该结果不等于 iPhone 实机已修复。线上 WebKit 访问出现过 90 秒 DOMContentLoaded 超时，尚不能据此确定用户设备上的唯一原因。

## 新地址对比
旧备份原样页面：https://ly202o.github.io/world-between-doors/baseline-pre-zelda.html
当前版本新路径：https://ly202o.github.io/world-between-doors/current-check.html

两页使用相同托管环境、不同新路径；用于用户手机对比，并非继续替换主游戏或回退其他功能。
