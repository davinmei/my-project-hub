
from pathlib import Path
import re

# 專案根目錄
ROOT = Path(__file__).resolve().parent

HTML_PATH = ROOT / "index.html"
JS_PATH = ROOT / "js" / "projects.js"
CSS_PATH = ROOT / "css" / "style.css"

# 檢查檔案
for path in [HTML_PATH, JS_PATH, CSS_PATH]:
    if not path.exists():
        raise FileNotFoundError(f"找不到檔案：{path}")

# ========================================
# 1. 修改 index.html
# ========================================

html = HTML_PATH.read_text(encoding="utf-8")

# 移除精選專案標題旁邊的舊文字連結
html = re.sub(
    r'<a\b[^>]*class="[^"]*section-link[^"]*"[^>]*>'
    r'\s*查看更多作品\s*(?:→|&rarr;)?\s*</a>',
    '',
    html
)

if 'id="featured-projects"' not in html:
    raise RuntimeError(
        "index.html 找不到 featured-projects 區塊"
    )

HTML_PATH.write_text(html, encoding="utf-8")

# ========================================
# 2. 修改 js/projects.js
# ========================================

js = JS_PATH.read_text(encoding="utf-8")

start = js.find("async function initFeatured(){")
end = js.find("async function initList(){")

if start == -1 or end == -1 or end <= start:
    raise RuntimeError(
        "找不到 initFeatured 或 initList，請確認 JS 版本"
    )

new_featured = """
async function initFeatured() {
    const target = document.getElementById(
        'featured-projects'
    );

    if (!target) return;

    try {
        // 讀取既有專案資料
        const all = await loadProjects();

        // 精選專案只顯示前兩個
        const featured = all
            .filter(project => project.featured)
            .slice(0, 2);

        // 使用既有作品卡片函式
        const cards = featured.map(createCard);

        // 建立第三格：查看更多作品
        const more = document.createElement('a');

        more.className = 'more-projects-tile';
        more.href = 'projects.html';
        more.setAttribute(
            'aria-label',
            '查看更多作品'
        );

        more.innerHTML = `
            <span
                class="more-projects-circle"
                aria-hidden="true"
            >
                <svg
                    viewBox="0 0 96 96"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <circle
                        cx="48"
                        cy="48"
                        r="42"
                        stroke="currentColor"
                        stroke-width="5"
                    />

                    <path
                        d="M36 25 L59 48 L36 71"
                        stroke="currentColor"
                        stroke-width="6"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                </svg>
            </span>

            <span class="more-projects-label">
                查看更多作品
            </span>
        `;

        // 將作品卡片與箭頭一起顯示
        target.replaceChildren(...cards, more);

        // 更新作品總數
        const count = document.getElementById(
            'project-count'
        );

        if (count) {
            count.textContent = String(all.length);
        }

        // 取得所有作品領域
        const categories = [
            ...new Set(
                all.map(project => project.category)
            )
        ];

        // 更新領域數量
        const categoryCount = document.getElementById(
            'category-count'
        );

        if (categoryCount) {
            categoryCount.textContent = String(
                categories.length
            );
        }

        // 顯示領域名稱
        const categoryList = document.getElementById(
            'category-list'
        );

        if (categoryList) {
            categoryList.textContent =
                categories.join(' · ') || '尚無領域';
        }

    } catch (error) {
        console.error(
            '精選專案載入失敗：',
            error
        );

        showError(
            target,
            '作品暫時無法載入，請檢查資料檔案。'
        );
    }
}

"""

js = js[:start] + new_featured + js[end:]

JS_PATH.write_text(js, encoding="utf-8")

# ========================================
# 3. 修改 css/style.css
# ========================================

css = CSS_PATH.read_text(encoding="utf-8")

style_marker = "/* CUSTOM MORE PROJECTS TILE */"

# 避免重複執行時一直追加 CSS
if style_marker in css:
    css = css.split(style_marker)[0].rstrip()

new_css = """
/* CUSTOM MORE PROJECTS TILE */

/* 精選專案第三格 */
.more-projects-tile {
    min-height: 300px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 22px;

    color: #1e5fb7;
    text-decoration: none;

    border-radius: 20px;
    transition:
        background 0.2s ease,
        transform 0.2s ease,
        color 0.2s ease;
}

/* 滑鼠移入效果 */
.more-projects-tile:hover {
    background: #eef5ff;
    color: #16488e;
    transform: translateY(-4px);
}

/* 鍵盤操作焦點 */
.more-projects-tile:focus-visible {
    outline: 3px solid #2f72db;
    outline-offset: 4px;
}

/* 大型圓圈箭頭 */
.more-projects-circle {
    display: block;
    width: 138px;
    height: 138px;
}

.more-projects-circle svg {
    display: block;
    width: 100%;
    height: 100%;
}

/* 箭頭下方文字 */
.more-projects-label {
    font-size: 1.1rem;
    font-weight: 800;
    letter-spacing: 0.02em;
    text-align: center;
}

/* 平板版 */
@media (max-width: 850px) {
    .more-projects-tile {
        min-height: 260px;
    }
}

/* 手機版 */
@media (max-width: 600px) {
    .more-projects-tile {
        min-height: 180px;
        gap: 12px;
    }

    .more-projects-circle {
        width: 92px;
        height: 92px;
    }

    .more-projects-label {
        font-size: 1rem;
    }
}
"""

css = css + "\n\n" + new_css

CSS_PATH.write_text(css, encoding="utf-8")

print("=" * 45)
print("首頁修改完成！")
print("=" * 45)
print("已更新：index.html")
print("已更新：js/projects.js")
print("已更新：css/style.css")
print()
print("請重新開啟 index.html")
print("或在瀏覽器按 Ctrl + F5 重新整理")
