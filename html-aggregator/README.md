# HTML Aggregator

一个亮色、shadcn 风格的单页 HTML 聚合目录。把任意 `.html` 文件放进 `public/single-pages/`，首页会自动扫描并展示。

## 本地运行

```bash
npm install
npm run dev
```

打开 `http://localhost:3000`。

## 添加页面

把独立 HTML 文件放入：

```text
public/single-pages/
```

本地开发时刷新首页即可看到新页面。

## 部署到 Vercel

这个项目可以直接部署到 Vercel。Vercel 会扫描部署包中的 `public/single-pages/` 文件；新增 HTML 文件后需要重新部署，但不需要修改任何代码。

## 常用命令

```bash
npm test
npm run build
```
