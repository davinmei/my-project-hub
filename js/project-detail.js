const root=document.querySelector('#project-detail');
function el(tag,cls,txt){const n=document.createElement(tag);if(cls)n.className=cls;if(txt!==undefined)n.textContent=txt;return n}
function section(parent,title,content,asList=false){const node=el('section','detail-section');node.append(el('h2','',title));if(asList){const ul=el('ul','feature-list');content.forEach(item=>ul.append(el('li','',item)));node.append(ul)}else node.append(el('p','',content||'待補充'));parent.append(node)}
function action(label,url,type){if(!/^https:\/\//i.test(url))return null;const a=el('a','btn '+type,label);a.href=url;a.target='_blank';a.rel='noopener noreferrer';return a}
async function init(){const id=new URLSearchParams(location.search).get('id');if(!id){root.replaceChildren(el('div','empty-state','未指定作品。請從作品列表選擇作品。'));return}try{const data=await loadProjects();const p=data.find(x=>x.id===id);if(!p){root.replaceChildren(el('div','empty-state','找不到這個作品，可能是連結錯誤或作品已移動。'));return}
 document.title=p.title+' | My Project Hub';root.replaceChildren();
 const head=el('div','detail-head');const crumbs=el('div','breadcrumb');const back=el('a','','← 返回作品總覽');back.href='projects.html';crumbs.append(back);head.append(crumbs,el('span','pill',p.category),el('h1','',p.title),el('p','',p.summary));root.append(head);
 const cover=el('div','detail-cover');const img=el('img');img.src=p.image;img.alt=p.imageAlt||p.title;cover.append(img);if(p.imageType!=='screenshot')cover.append(el('div','image-notice','展示封面為佔位圖，非程式實際執行截圖；待取得截圖後可替換。'));root.append(cover);
 const columns=el('div','detail-columns');const main=el('main');section(main,'專案介紹',p.description);section(main,'開發動機',p.motivation);section(main,'主要功能',p.features,true);section(main,'開發成果',p.results);section(main,'心得與反思',p.lessonsLearned);columns.append(main);
 const aside=el('aside','detail-aside');const label=el('div','aside-label','專案資訊');aside.append(label);const sb=el('div','aside-block');sb.append(el('strong','',p.status==='completed'?'已完成':'開發中'));aside.append(sb);const tech=el('div','aside-block');tech.append(el('strong','','使用技術'));const tags=el('div','tags');p.technologies.forEach(x=>tags.append(el('span','tag',x)));tech.append(tags);aside.append(tech);
 const acts=el('div','aside-actions');const demo=action('↗ 開啟互動展示',p.demoUrl,'btn-primary');const github=action('↗ 查看 GitHub 原始碼',p.githubUrl,'btn-secondary');if(demo)acts.append(demo);if(github)acts.append(github);
if (!demo && !github) {
    const info = el('div', 'project-availability');

    info.append(
        el('strong', '', '目前提供作品介紹與操作截圖')
    );

    info.append(
        el(
            'p',
            '',
            p.status === 'completed'
                ? '本專案已完成課程實作，目前尚未公開互動展示。可透過本頁了解功能、技術及開發成果。'
                : '本專案仍在開發中，目前提供進度介紹與相關畫面，尚未公開互動展示。'
        )
    );

    acts.append(info);
}
aside.append(acts);columns.append(aside);root.append(columns);
 }catch(e){root.replaceChildren(el('div','empty-state','資料載入失敗。請透過本機伺服器或 GitHub Pages 開啟網站。'))}}
if(root)init();
