# Kaola Yuzu｜I18N Cleanup v1

本版本實際修改內容：

- index.html：補強首頁/SPA 中殘留中文的翻譯處理，並調整 Start Here、Music CTA、發行商入口文案為「引導決策」語氣。
- index.html：新增 staticTextTranslations fallback，補處理少量原本未掛 data-i18n 的文字，避免 EN 狀態混中文。
- blog/ai-music-distributor-comparison.html：修正中文 CTA 與備註語氣。
- en/blog/ai-music-distributor-comparison.html：同步英文 CTA 與備註語氣。
- quiz.html：新增 EN 入口。
- en/quiz.html：新增英文版測驗頁。
- sitemap.xml：新增英文測驗頁。

語氣規則：

- Blog = Creator / Observer：保留作者觀察與人味。
- Comparison / Guide = Decision Guide：提供判斷條件，不替使用者做決定。
- Quiz / Tool = Self-Diagnosis Tool：讓使用者快速釐清自己的情境。

下一階段：Notion CMS 第一版，先從 Blog / Music 資料後台化開始。
