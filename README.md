# 新托福写作 AI 训练 · 投资者静态演示

这是一个可直接发布到 GitHub Pages 的纯静态交互演示。它用于向投资者展示：

- 学生工作台、推荐练习和预置 Mock 报告；
- 零 Token、零费用的运营账本；
- 评分员 A/B 双盲评分；
- 评分分歧后的人工仲裁；
- 静态演示、当前后端能力和未来验证工作的清晰边界。

## 安全边界

- 没有 FastAPI、数据库、Redis、JWT 或 OTP；
- 没有 API Key、系统 Prompt 或真实作文；
- 没有 `fetch`、XHR、WebSocket、外部字体、分析脚本或追踪器；
- 输入内容不会上传或持久保存；
- 交互状态只存放在浏览器 `localStorage`，可随时点击“重置演示”清除；
- Mock 报告不分析输入内容，也不代表官方 TOEFL 成绩或真实模型准确率。

静态网页无法安全保存访问密码，因此本项目不提供虚假的前端密码保护。需要限制访问时，
应使用 GitHub Pages 可见性策略或真正具备服务端鉴权的托管环境。

## 本地检查

```powershell
npm run check
npm run serve
```

访问：

```text
http://127.0.0.1:4173
```

## 发布

仓库包含 `.github/workflows/pages.yml`。在 GitHub 仓库 Settings → Pages 中把
Source 设为 **GitHub Actions**，之后每次推送 `main` 都会先执行零网络能力检查，
通过后再发布 Pages。

建议把本演示放在独立公开仓库中，不要把产品主仓库、后端代码或私有文档一并公开。
