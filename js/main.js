const toggle=document.querySelector('.menu-toggle');const menu=document.querySelector('.nav-links');
if(toggle&&menu){toggle.addEventListener('click',()=>{const expanded=toggle.getAttribute('aria-expanded')==='true';toggle.setAttribute('aria-expanded',String(!expanded));menu.classList.toggle('open',!expanded)});}
initFeatured();initList();
