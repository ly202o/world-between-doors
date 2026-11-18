# 游戏部署与交接

唯一游戏文件是 world01.html，包含程序和音频，可以离线直接打开。GitHub 仓库为 ly202o/world-between-doors，main 分支推送后由 .github/workflows/deploy.yml 复制为 index.html 并部署 GitHub Pages。

用户选择公开仓库及游戏文件。界面密码仅是前端提示，密码和音频都能从公开文件获得，同一浏览器的 localStorage 会记住解锁状态。

修改游戏前先备份。检查所有脚本语法、隔离目录离线启动和改动功能。提交 world01.html 并推送 main，查看 GitHub Actions 的 Deploy game 结果，再从 Pages 地址确认实际效果。若 CLI 登录失效，执行 gh auth login，切勿记录令牌。
