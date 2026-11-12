# My Project Hub｜個人專案作品展示平台

一個以 **HTML、CSS、JavaScript、JSON** 建立、可部署於 GitHub Pages 的個人課程與專案作品集。

## 功能
- 首頁：網站介紹、從 JSON 動態載入精選作品與專案數量
- 作品總覽：作品卡片、即時搜尋、分類篩選
- 作品詳細頁：一份 `project.html?id=<id>` 模板顯示不同作品
- 響應式版型與鍵盤操作支援
- `AGENTS.md`：供 AI 開發助手讀取的維護／新增作品規範

## 目前收錄作品（4 個）
- **AI 面試模擬系統｜林教練**：AI Suite + Groq + Gradio 面試練習
- **毛孩新手村｜AI 貓狗飼養顧問**：EmbeddingGemma 2、FAISS、Groq RAG 問答（RAG01 + RAG02）
- **AI 智慧行程規劃與反思助手**：Planner → Reviewer → Reviser 三階段行程規劃
- **出門準備檢查助手（Ready to Go）**：HTML、CSS、原生 JavaScript、localStorage、Canvas 與 SVG；情境模板、多清單、本機使用者分頁及準備進度（Web App）

作品介紹根據使用者提供的 Notebook、Web App 原始碼與說明整理；**未執行 Notebook 的 API 呼叫，也未確認原展示服務在線**。四個作品均使用使用者提供的實際操作截圖作為封面。尚未填寫展示與原始碼網址，因此相關按鈕暫不顯示。

第四個作品使用 `assets/images/packing-checklist.png`，詳細介紹位於 `project.html?id=packing-checklist`。來源檔案 `incoming-projects/packing-checklist/index.html` 保持原樣；清單資料僅保存於目前瀏覽器，不會同步至其他裝置。出門清單應用本身的完整操作、重新載入保存與手機版面驗收仍待進行，個人開發心得待補。

## 在電腦上預覽

**可以直接雙擊 `index.html` 開啟網站**。`data/projects-data.js` 提供本機預覽所需的備援資料；正式部署時優先讀取 `data/projects.json`。

有 Python 時，在本專案資料夾執行：

```bash
python -m http.server 8000
```

再開啟 `http://localhost:8000/`。若啟動位置是專案的上一層，請開啟 `http://localhost:8000/my-project-hub/`。

## 上傳 GitHub Pages

1. 建立 GitHub repository，例如 `my-project-hub`。
2. 將本資料夾內容放入 repository 根目錄，包含 `.html`、`css/`、`js/`、`data/`、`assets/`、`AGENTS.md`。
3. 到 repository **Settings → Pages**，在 **Build and deployment** 選擇 **Deploy from a branch**，設定 `main` 分支及 `/ (root)`，儲存。
4. 等候部署完成後，在 Pages 設定頁取得網站網址，通常為 `https://<帳號>.github.io/<儲存庫名稱>/`。請以 GitHub 實際顯示的網址為準。
5. 驗證首頁、搜尋、分類與作品詳細頁是否正常。

## 如何透過 AI 新增作品

請 AI 開發工具先閱讀 [AGENTS.md](AGENTS.md)，再提供 `.ipynb`、README、GitHub Repo 或操作截圖。AI 需先分析內容、提供資料草稿與待補欄位，**在使用者確認後**再將符合格式的新物件新增至 `data/projects.json`，並在 `assets/images/` 存放經確認的截圖。最後驗證所有頁面及連結。

### 本週作業的擴充驗證

本次依 `AGENTS.md` 完成第四個作品的原始碼分析、資料草稿及使用者確認後，追加至相同 JSON 陣列，並由 JSON 重新產生本機備援資料。原本三個作品資料、圖片、HTML 版型及共用 CSS 保持不變；本次使用第四個作品驗證資料驅動的擴充流程。

## 安全與限制
- 不放 API 金鑰、憑證或私人資料；不要把含密鑰的原始 Notebook 直接公開。
- 目前網站為**靜態作品展示**，不是已上線的 AI 面試或 RAG 互動服務。
- 四個作品已有實際操作截圖；GitHub 原始碼連結及永久展示網址仍待提供。

## 資料同步注意

`data/projects.json` 是作品資料的**唯一編輯來源**。為支援直接雙擊 HTML 預覽，更新 JSON 後，應同步重新產生 `data/projects-data.js`，格式為 `window.PROJECTS_FALLBACK = <JSON 陣列>;`。請勿在備援檔手動修改內容。

## 網站最後更新

2026-11-12。首頁日期由 `js/site-update.js` 的 `SITE_LAST_UPDATED` 固定設定，僅在實際修改網站內容時更新。
