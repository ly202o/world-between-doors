# AGENTS.md · 协作契约

**进这个项目先读这一页，再动手。**

完整规则在 `docs/RULES.md`。这里是必须记住的硬约束。

---

## 四条铁律

1. **`index.html` 必须是自包含单文件** —— Three.js 已在里面，禁止出现任何 `<script src>` / `<link href>` / 外部图片 / CDN / 网络请求。曾经因为依赖目录没跟到手机上，导致用户打开是一整片白屏。
2. **不用图片素材** —— 一切视觉由几何体与光照生成。
3. **改完必须验证**，验证方式见下。没验证不许说"做好了"。
4. **每次改动都要留痕** —— 备份 + git 提交 + CHANGELOG 条目，三样缺一不可。

---

## 改完之后必须跑的验证

```bash
# 1) 每个 script 块单独语法检查（历史上坏的是库那一块，不是游戏那一块）
node -e 'const fs=require("fs");const s=fs.readFileSync("index.html","utf8");
const m=[...s.matchAll(/<script>([\s\S]*?)<\/script>/g)];
m.forEach((x,i)=>fs.writeFileSync(".chk_"+i+".js",x[1]));console.log(m.length+" blocks");'
for f in .chk_*.js; do node --check "$f"; done && rm -f .chk_*.js

# 2) 孤立目录测试（最重要，能暴露一切依赖缺失）
rm -rf _solo && mkdir _solo && cp index.html _solo/
# 然后用无头浏览器打开 _solo/index.html 并截图，画面必须正常
rm -rf _solo
```

双端都要看：横屏 1280×720、竖屏 390×844。

---

## 收尾清单

- [ ] `docs/CHANGELOG.md` 新增一条（版本号 + 日期 + 新增/修正/未做）
- [ ] 触及相关文档的，同步更新 `docs/DESIGN.md` 或 `docs/GAME.md`
- [ ] `bash tools/snapshot.sh <版本号> "<说明>"`
- [ ] 清理临时文件（`_*.png`、`_*.mjs`、`_solo/`、`.chk_*.js`）

---

## 代码约定

- 纯 ES5：`var` / `function`，不用箭头函数、`let` / `const`、模板字符串。
- 区块顺序固定：自检 → 渲染器 → 光影 → 地面 → 道具 → 角色 → 状态 → 相机 → 输入 → 更新 → 绘制 → 主循环。
- 可调数值集中在文件顶部或紧邻使用处，不散落。

---

## 明确不做

- 不加不必要的新系统（能少一个元素就少一个）。
- 不加加载动画、Logo、音效开关。
- 不拆分多文件、不引入构建工具。
- 没验证不报告完成。

---

_当前版本：v0.4.0_
