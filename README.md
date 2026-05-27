# AI 伴侶 Demo

二次元深色風格的 AI 伴侶 App 前端 Demo（React + Vite + Tailwind）。

## 功能（第一版）

- 首頁：角色主畫面、好感度、今日心情、快捷互動
- 底部導覽：首頁 / 聊天 / 任務 / 設定
- 聊天：`POST /api/chat`（OpenAI，Key 僅在伺服器）
- 其餘為本地 Mock，未連接 Supabase

## 開發

```bash
npm install
cp .env.example .env
# 編輯 .env，填入 OPENAI_API_KEY=
npm run dev
```

`npm run dev` 會同時啟動 Vite（5173）與 API 伺服器（8788）；前端 `/api/chat` 會由 Vite proxy 轉發。

## 建置

```bash
npm run build
```

## Vercel 部署

- Framework Preset: **Vite**
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

專案已包含 `vercel.json` SPA 路由設定。

### Vercel 環境變數

| 變數 | 必填 | 說明 |
|------|------|------|
| `OPENAI_API_KEY` | 是 | OpenAI API Key（僅後端） |
| `OPENAI_MODEL` | 否 | 預設 `gpt-4o-mini` |
