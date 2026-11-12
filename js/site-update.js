
/**
 * My Project Hub
 * 網站最後更新日期顯示
 */

// 真正修改網站內容時，更新這個日期
const SITE_LAST_UPDATED = "2026-11-12";

document.addEventListener("DOMContentLoaded", () => {
    const updateElement = document.getElementById("last-updated");

    if (!updateElement) return;

    const date = new Date(`${SITE_LAST_UPDATED}T00:00:00+08:00`);

    if (Number.isNaN(date.getTime())) {
        updateElement.textContent = "日期資料錯誤";
        return;
    }

    updateElement.textContent = new Intl.DateTimeFormat("zh-TW", {
        timeZone: "Asia/Taipei",
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
    }).format(date);
});
