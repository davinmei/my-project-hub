const PROJECT_DATA_URL = 'data/projects.json';
async function loadProjects(){
  // HTTP / GitHub Pages 讀取 JSON；file:// 直接開啟時使用自動產生的備援資料。
  if(location.protocol === 'file:') return window.PROJECTS_FALLBACK || [];
  try {
    const response = await fetch(PROJECT_DATA_URL,{cache:'no-cache'});
    if (!response.ok) throw new Error('HTTP '+response.status);
    const data = await response.json();
    if (!Array.isArray(data)) throw new Error('作品資料格式不正確');
    return data;
  } catch (e) {
    if(Array.isArray(window.PROJECTS_FALLBACK)) return window.PROJECTS_FALLBACK;
    throw e;
  }
}
function createCard(p){
  const article=document.createElement('article');article.className='project-card';
  const link=document.createElement('a');link.href='project.html?id='+encodeURIComponent(p.id);link.setAttribute('aria-label','查看'+p.title+'詳細介紹');
  const img=document.createElement('img');img.src=p.image;img.alt=p.imageAlt||p.title;img.loading='lazy';link.append(img);article.append(link);
  const body=document.createElement('div');body.className='card-body';
  const meta=document.createElement('div');meta.className='card-meta';
  const category=document.createElement('span');category.className='pill';category.textContent=p.category;
  const status=document.createElement('span');status.className='status'+(p.status==='in-progress'?' progress':'');status.textContent=p.status==='completed'?'已完成':'開發中';meta.append(category,status);
  const title=document.createElement('h3');title.textContent=p.title;
  const desc=document.createElement('p');desc.textContent=p.summary;
  const tags=document.createElement('div');tags.className='tags';(p.technologies||[]).slice(0,4).forEach(t=>{const s=document.createElement('span');s.className='tag';s.textContent=t;tags.append(s)});
  const bottom=document.createElement('div');bottom.className='card-bottom';const detail=document.createElement('a');detail.href=link.href;detail.textContent='了解專案 →';const hint=document.createElement('span');hint.className='hint';hint.textContent='專案介紹';bottom.append(hint,detail);
  body.append(meta,title,desc,tags,bottom);article.append(body);return article;
}
function showError(node,msg){node.replaceChildren();const x=document.createElement('div');x.className='empty-state';x.textContent=msg;node.append(x)}

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

async function initList(){
 const target=document.getElementById('all-projects');if(!target)return;
 const search=document.getElementById('project-search'),buttons=document.getElementById('category-filters'),count=document.getElementById('results-count');let all=[],category='全部作品';
 try{all=await loadProjects()}catch(e){showError(target,'無法載入作品資料。請確認 data/projects.json 存在，並透過網站伺服器開啟。');return}
 const categories=['全部作品',...new Set(all.map(p=>p.category))];
 function render(){const q=search.value.trim().toLocaleLowerCase('zh-Hant');const filtered=all.filter(p=>(category==='全部作品'||p.category===category)&&[p.title,p.category,p.summary,...(p.technologies||[])].join(' ').toLocaleLowerCase('zh-Hant').includes(q));count.textContent='共找到 '+filtered.length+' 個作品';if(filtered.length){target.replaceChildren(...filtered.map(createCard));}else{showError(target,'沒有符合條件的作品，試試其他關鍵字或分類。')}}
 categories.forEach(c=>{const b=document.createElement('button');b.type='button';b.className='filter-button'+(c===category?' active':'');b.textContent=c;b.setAttribute('aria-pressed',String(c===category));b.addEventListener('click',()=>{category=c;buttons.querySelectorAll('button').forEach(x=>{const selected=x===b;x.classList.toggle('active',selected);x.setAttribute('aria-pressed',String(selected))});render()});buttons.append(b)});
 search.addEventListener('input',render);render();
}
