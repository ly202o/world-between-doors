# 游戏的发布与交接

`world01.html` 是唯一游戏源文件，包含程序、模型和音频，双击即可离线运行。不要拆出外部资源，也不要手改网页发布副本。

## 首次发布

在 GitHub 创建本项目专用仓库，配置 Pages 的 Source 为 GitHub Actions。将本目录提交并推送到 `main`。工作流 `.github/workflows/deploy-pages.yml` 会把 `world01.html` 复制为网站入口 `index.html`，然后部署 Pages。实际网址在仓库 Settings → Pages 或 Actions 的部署结果中确认。

发布前确认仓库可见范围。公开 Pages 和公开仓库会让任何人下载完整游戏及其内嵌音频。音频的使用与发布范围应由项目拥有者确认。

## 日常更新

1. 修改 `world01.html`，保留它的单文件离线能力并先备份。
2. 检查五个 script 块的语法，在隔离目录用浏览器打开，并验证修改涉及的功能。
3. 更新项目变更记录和测试清单，检查 `git status` 避免提交临时文件。
4. 提交并推送到 `main`。检查 Actions 中 Deploy game to GitHub Pages 的运行结果，再打开实际 Pages 地址确认新版本。

如果 GitHub CLI 登录失效，使用 `gh auth login` 重新登录项目拥有者的账号。不要把令牌写入文件或日志。部署失败时检查 Actions 日志、Pages Source 和仓库权限，排队中的任务不代表发布成功。

## 音乐

便利店音频以 Ogg Opus 数据内嵌在 HTML 中，播放依赖浏览器的 Web Audio 解码能力。播放器遵守游戏的静音开关，浏览器一般要求用户先有一次交互才允许声音播放。替换音频后检查解码、场景切换和离线播放。备份记录见 `backups/`，该目录不提交到 Git。
