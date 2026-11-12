function themeIcon(){const shape=document.documentElement.dataset.theme==='dark'?'<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/>':'<path d="M20.5 13.2A8.5 8.5 0 0 1 10.8 3.5a8.5 8.5 0 1 0 9.7 9.7Z"/>';return '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false" style="display:block;margin:auto">'+shape+'</svg>'}
// Refresh shared project styling when this renderer version is loaded.
document.querySelector('link[rel=stylesheet]').href='../../style.css?v=gagabang-20261112-21';
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];let lang=document.documentElement.lang==='zh'?'zh':'en',project=null;const copy={en:{about:'About',education:'Education',projects:'Projects',experience:'Experience',back:'Back to projects',pending:'Project details will be added here.',product:'Cultural Research & Strategy',marketing:'Marketing',photo:'Photography',uiux:'UI/UX',documentary:'Documentary',theatre:'Theatre',video:'Project video',materials:'Selected project materials',note:'Original project materials are shown in their original language.',close:'Close image',light:'Switch to day theme',dark:'Switch to night theme',menu:'Menu',error:'This project could not be loaded. Please return to the project list.'},zh:{about:'关于我',education:'教育背景',projects:'项目',experience:'经历',back:'返回项目列表',pending:'项目详情将在这里补充。',product:'文化研究与策划',marketing:'营销策划',photo:'摄影',uiux:'UI/UX',documentary:'纪录片',theatre:'戏剧',video:'项目宣传视频',materials:'项目材料选页',note:'以下展示项目原始材料。',close:'关闭图片',light:'切换白天主题',dark:'切换夜间主题',menu:'菜单',error:'项目暂时无法加载，请返回项目列表。'}};function save(k,v){try{localStorage.setItem(k,v)}catch(e){}}function themeLabel(){$('#theme').innerHTML=themeIcon();$('#theme').setAttribute('aria-label',copy[lang][document.documentElement.dataset.theme==='dark'?'light':'dark'])}
function render(){
 document.documentElement.lang=lang;
 $$('[data-detail-i]').forEach(el=>el.textContent=copy[lang][el.dataset.detailI]);
 $('#language').textContent=lang==='en'?'中':'EN';$('#language').setAttribute('aria-pressed',String(lang==='zh'));$('#language').title=lang==='en'?'Switch to Chinese':'切换到英文';$('#language').setAttribute('aria-label',$('#language').title);
 $('#menu').setAttribute('aria-label',copy[lang].menu);$('#close').setAttribute('aria-label',copy[lang].close);themeLabel();
 if(!project)return;
 document.body.classList.add('project-case-study','article-project');
 document.title=project.title[lang]+' — Sadie Huang';$('meta[name=description]').content=project.content?.[lang]||project.title[lang];$('#project-title').textContent=project.title[lang];$('#project-category').hidden=true;
 const content=$('#project-content');content.replaceChildren();$('#project-media').replaceChildren();
 if(project.content?.[lang]){const lead=document.createElement('p');lead.className='project-lead';const text=project.content[lang],phrases=project.contentHighlights?.[lang]||[];let offset=0;phrases.forEach(phrase=>{const index=text.indexOf(phrase,offset);if(index<0)return;lead.append(document.createTextNode(text.slice(offset,index)));const strong=document.createElement('strong');strong.textContent=phrase;lead.append(strong);offset=index+phrase.length});lead.append(document.createTextNode(text.slice(offset)));if(project.introductionLink){const link=document.createElement('a');link.className='intro-reference';link.href=project.introductionLink.url;link.target='_blank';link.rel='noopener noreferrer';link.textContent=project.introductionLink.label[lang];lead.append(document.createTextNode(' '),link)}content.append(lead)}
 const article=document.createElement('article');article.className='project-article';
 const blocks=project.article||project.sections?.flatMap(section=>[{heading:section.title,level:2},{text:section.text}])||[];
 blocks.forEach(block=>{
  if(block.caseStudy){article.append(makeCaseStudy(block.caseStudy,lang))}
  else if(block.heading){const h=document.createElement('h2');h.textContent=block.heading[lang];article.append(h)}
  else if(block.text){const p=document.createElement('p');if(block.leadIn){const strong=document.createElement('strong');strong.textContent=block.leadIn[lang]+(lang==='zh'?'：':': ');p.append(strong,document.createTextNode(block.text[lang]))}else p.textContent=block.text[lang];if(block.kind==='contribution')p.className='contribution-note';article.append(p)}
  else if(block.link){const a=document.createElement('a');a.className='project-reference';a.href=block.link.url;a.target='_blank';a.rel='noopener noreferrer';a.textContent=block.link.label[lang];article.append(a)}
  else if(block.figures){const group=document.createElement('div');group.className='article-figures'+(block.figures.length>1?' article-figure-pair':'');block.figures.forEach(id=>{const item=project.images.find(i=>i.id===id);if(item)group.append(makeArticleFigure(item,lang))});article.append(group)}
  else if(block.episodes){renderEpisodes(article,project.videos,lang)}
  else if(block.video){const item=project.videos.find(v=>v.id===block.video);if(item)article.append(makeProjectVideo(item,lang))}
  else if(block.image){const item=project.images.find(i=>i.src===block.image);if(item)article.append(makeProjectImage(item,lang))}
 });
 if(project.galleryIntro?.[lang]){const p=document.createElement('p');p.textContent=project.galleryIntro[lang];article.append(p)}
 if(project.referenceUrl){const link=document.createElement('a');link.className='project-reference';link.href=project.referenceUrl;link.target='_blank';link.rel='noopener noreferrer';link.textContent=lang==='zh'?'访问品牌官网':'Visit brand website';article.append(link)}
 if(project.videoCards)renderVideoCards(article,project.videos,lang);
 else if(project.galleries)renderProjectGalleries(article,project.galleries,lang);
 else if(!project.article){if(project.video)article.append(makeProjectVideo({src:project.video,poster:project.cover,caption:{en:copy.en.video,zh:copy.zh.video}},lang));(project.images||[]).forEach(item=>article.append(makeProjectImage(item,lang)))}
 content.append(article);
}
function makeProjectImage(item,language){const figure=document.createElement('figure'),button=document.createElement('button'),img=document.createElement('img');img.src=item.src.startsWith('data:')?item.src:'../../'+item.src;img.alt=item.caption?.[language]||'';img.loading='lazy';if(item.width)img.width=item.width;if(item.height)img.height=item.height;button.setAttribute('aria-label',img.alt||copy[language].materials);button.append(img);button.onclick=()=>{const dialog=$('#lightbox');dialog.querySelector('.gallery-enlargement')?.remove();$('#full-image').hidden=false;$('#full-image').src=img.src;$('#full-image').alt=img.alt;$('#image-caption').textContent=img.alt;dialog.showModal()};figure.append(button);return figure}
function makeProjectVideo(item,language){const figure=document.createElement('figure'),video=document.createElement('video');figure.className='video-figure'+(item.portrait?' portrait-video':'');video.controls=true;video.preload='none';video.playsInline=true;video.src='../../'+item.src;if(item.poster)video.poster='../../'+item.poster;video.setAttribute('aria-label',item.caption?.[language]||copy[language].video);video.addEventListener('play',()=>$$('video').forEach(other=>{if(other!==video)other.pause()}));figure.append(video);return figure}
$('#language').onclick=()=>{$$('video').forEach(video=>video.pause());lang=lang==='en'?'zh':'en';save('sadie-language',lang);render()};$('#theme').onclick=()=>{const theme=document.documentElement.dataset.theme==='dark'?'light':'dark';document.documentElement.dataset.theme=theme;save('sadie-theme',theme);themeLabel()};matchMedia('(prefers-color-scheme: dark)').addEventListener('change',e=>{let override;try{override=localStorage.getItem('sadie-theme')}catch(e){}if(!override){document.documentElement.dataset.theme=e.matches?'dark':'light';themeLabel()}});$('#menu').onclick=()=>$('#menu').setAttribute('aria-expanded',String($('#nav').classList.toggle('open')));$('#close').onclick=()=>$('#lightbox').close();document.addEventListener('keydown',e=>{if(e.key==='Escape'){$('#nav').classList.remove('open');$('#menu').setAttribute('aria-expanded','false')}});$('#lightbox').onclick=e=>{if(e.target===$('#lightbox')){const r=e.target.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)e.target.close()}};$('#year').textContent=new Date().getFullYear();render();fetch('../../projects.json?v=gagabang-20261112-21',{cache:'no-cache'}).then(r=>{if(!r.ok)throw Error();return r.json()}).then(data=>{project=data.find(p=>p.id===document.body.dataset.project);if(!project)throw Error();prepareProject(project);render()}).catch(()=>{$('#project-content').textContent=copy[lang].error});

function renderProjectGalleries(parent,galleries,language){
 const labels=language==='zh'?{previous:'上一张',next:'下一张',open:'放大查看',gallery:'作品画廊',prevShort:'前',nextShort:'后'}:{previous:'Previous',next:'Next',open:'View larger',gallery:'Photo gallery',prevShort:'Prev',nextShort:'Next'};
 function makeImageWindow(item){const window=document.createElement('div');window.className='media-image-window';window.style.setProperty('--ratio',item.width/item.height);window.style.setProperty('--offset',-(item.crop?.[0]||0)/(item.crop?.[1]||1)*100+'%');const image=document.createElement('img');image.src='../../'+item.src;image.alt=item.caption?.[language]||'';image.loading='lazy';window.append(image);return window}
 const openImage=item=>{const dialog=$('#lightbox');dialog.querySelector('.gallery-enlargement')?.remove();$('#full-image').hidden=true;const window=makeImageWindow(item);window.classList.add('gallery-enlargement');dialog.insertBefore(window,$('#image-caption'));$('#image-caption').textContent=item.caption?.[language]||'';dialog.showModal()};
 galleries.forEach(group=>{
  const section=document.createElement('section');section.className='work-gallery';section.setAttribute('aria-label',group.title[language]);const header=document.createElement('div');header.className='gallery-header';const title=document.createElement('h2');title.textContent=group.title[language];const counter=document.createElement('span');counter.className='gallery-counter';counter.setAttribute('aria-live','polite');header.append(title,counter);section.append(header);
  if(group.description?.[language]){const text=document.createElement('p');text.className='gallery-description';text.textContent=group.description[language];section.append(text)}
  const stage=document.createElement('div');stage.className='gallery-stage';const previous=document.createElement('button'),next=document.createElement('button');previous.className='gallery-side previous';next.className='gallery-side next';previous.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m14 6-6 6 6 6"/></svg>';next.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m10 6 6 6-6 6"/></svg>';previous.setAttribute('aria-label',group.title[language]+' · '+labels.previous);next.setAttribute('aria-label',group.title[language]+' · '+labels.next);const rail=document.createElement('div');rail.className='media-rail';rail.tabIndex=0;rail.setAttribute('aria-label',group.title[language]+' · '+labels.gallery);
  group.items.forEach(item=>{const figure=document.createElement('figure');figure.className='media-slide';figure.style.setProperty('--ratio',item.type==='video'?(item.width&&item.height?item.width/item.height:16/9):item.width/item.height);if(item.type==='video'){const video=document.createElement('video');video.src='../../'+item.src;video.poster='../../'+item.poster;video.controls=true;video.playsInline=true;video.preload='none';video.setAttribute('aria-label',item.caption[language]);video.addEventListener('play',()=>$$('video').forEach(other=>{if(other!==video)other.pause()}));figure.append(video);const caption=document.createElement('figcaption');caption.textContent=item.caption[language];figure.append(caption)}else{const button=document.createElement('button');button.className='media-image-button';button.setAttribute('aria-label',labels.open+' · '+item.caption[language]);button.append(makeImageWindow(item));button.onclick=()=>openImage(item);figure.append(button)}rail.append(figure)});
  let active=0;const slides=[...rail.children];const position=index=>slides[index].offsetLeft-slides[0].offsetLeft;const sync=()=>{let distance=Infinity;slides.forEach((figure,index)=>{const d=Math.abs(position(index)-rail.scrollLeft);if(d<distance){distance=d;active=index}});stage.style.setProperty('--active-height',(slides[active].querySelector('.media-image-button,video')?.getBoundingClientRect().height||0)+'px');counter.textContent=(active+1)+' / '+group.items.length;previous.disabled=active===0;next.disabled=active===group.items.length-1;slides.forEach((figure,index)=>{if(index!==active)figure.querySelector('video')?.pause()})};const go=delta=>{const index=Math.max(0,Math.min(group.items.length-1,active+delta));rail.scrollTo({left:position(index),behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'})};previous.onclick=()=>go(-1);next.onclick=()=>go(1);rail.addEventListener('scroll',sync,{passive:true});rail.addEventListener('keydown',event=>{if(event.target!==rail)return;if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();go(event.key==='ArrowRight'?1:-1)}});
  stage.append(previous,rail,next);section.append(stage);parent.append(section);new ResizeObserver(()=>{rail.style.setProperty('--rail-width',rail.clientWidth+'px');rail.style.setProperty('--last-width',slides.at(-1).getBoundingClientRect().width+'px');rail.scrollTo({left:position(active),behavior:'auto'});sync()}).observe(rail);sync();
 })
}
function renderEpisodes(parent,items,language){
 const section=document.createElement('section');section.className='episode-player';const controls=document.createElement('div');controls.className='episode-tabs';controls.setAttribute('aria-label',language==='zh'?'纪录片集数':'Documentary episodes');const video=document.createElement('video');video.controls=true;video.playsInline=true;video.preload='none';const caption=document.createElement('p');caption.className='episode-caption';
 const select=index=>{video.pause();video.src='../../'+items[index].src;video.poster=items[index].poster.startsWith('data:')?items[index].poster:'../../'+items[index].poster;video.setAttribute('aria-label',items[index].caption[language]);caption.textContent=items[index].caption[language];[...controls.children].forEach((button,n)=>button.setAttribute('aria-pressed',String(n===index)));video.load()};items.forEach((item,index)=>{const button=document.createElement('button');button.textContent=item.caption[language];button.onclick=()=>select(index);controls.append(button)});section.append(controls,video,caption);parent.append(section);select(0)
}

// Match project navigation to the homepage section order.
{const nav=document.querySelector('#nav'),work=nav?.querySelector('a[href$="#work"]'),education=nav?.querySelector('a[href$="#education"]');if(work&&education)nav.insertBefore(work,education)}

// Cropped catalogue panels retain the original artwork and open at a readable size.
function makeArticleFigure(item,language){
 const figure=document.createElement('figure'),button=document.createElement('button'),caption=document.createElement('figcaption');
 const panel=()=>{const frame=document.createElement('div'),img=document.createElement('img');frame.className='article-image-panel';const c=item.crop||[0,0,1,1];const ratio=(item.width*c[2])/(item.height*c[3]);frame.style.aspectRatio=ratio;frame.style.setProperty('--panel-ratio',ratio);if(ratio<1)figure.classList.add('portrait-board');img.src=item.src.startsWith('data:')?item.src:'../../'+item.src;img.alt=item.caption[language];img.loading='lazy';img.width=item.width;img.height=item.height;img.style.width=(100/c[2])+'%';img.style.maxWidth='none';img.style.left=(-100*c[0]/c[2])+'%';img.style.top=(-100*c[1]/c[3])+'%';frame.append(img);return frame};
 button.setAttribute('aria-label',item.caption[language]);button.append(panel());caption.textContent=item.caption[language];button.onclick=()=>{const dialog=$('#lightbox');dialog.querySelector('.gallery-enlargement')?.remove();$('#full-image').hidden=true;const frame=panel();frame.classList.add('gallery-enlargement');dialog.insertBefore(frame,$('#image-caption'));$('#image-caption').textContent=item.caption[language];dialog.showModal()};figure.append(button,caption);return figure;
}

// Square stills open the original films without changing their aspect ratio.
function renderVideoCards(parent,items,language){
 const grid=document.createElement('div');grid.className='film-grid';
 items.forEach(item=>{
  const card=document.createElement('figure');card.className='film-card';
  const button=document.createElement('button');button.className='film-cover';button.setAttribute('aria-label',(language==='zh'?'播放视频：':'Play film: ')+item.caption[language]);
  const img=document.createElement('img');img.src=item.cardCover||'../../'+item.poster;img.alt=item.caption[language];img.width=600;img.height=600;img.loading='lazy';
  const icon=document.createElement('span');icon.className='film-play';icon.setAttribute('aria-hidden','true');icon.innerHTML='<svg viewBox="0 0 24 24"><path d="m9 5 11 7-11 7Z"/></svg>';
  button.append(img,icon);button.onclick=()=>openProjectFilm(item,language);card.append(button);
  const caption=document.createElement('figcaption');caption.textContent=item.cardText?.[language]||item.caption[language];card.append(caption);grid.append(card);
 });parent.append(grid);
}
function openProjectFilm(item,language){
 let dialog=document.getElementById('project-film-dialog');
 if(!dialog){dialog=document.createElement('dialog');dialog.id='project-film-dialog';dialog.className='film-dialog';document.body.append(dialog);dialog.addEventListener('close',()=>{dialog.querySelector('video')?.pause();dialog.replaceChildren()});dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close()}})}
 $$('video').forEach(video=>video.pause());dialog.replaceChildren();dialog.setAttribute('aria-label',item.caption[language]);
 const close=document.createElement('button');close.className='film-close';close.setAttribute('aria-label',language==='zh'?'关闭视频':'Close video');close.textContent='×';close.onclick=()=>dialog.close();
 const video=document.createElement('video');video.controls=true;video.playsInline=true;video.preload='metadata';video.src='../../'+item.src;video.poster='../../'+item.poster;video.setAttribute('aria-label',item.caption[language]);
 dialog.append(close,video);dialog.showModal();close.focus();video.play().catch(()=>{});
}

// Compact case studies pair the narrative with its supporting post and results.
function makeCaseStudy(item,language){
 const section=document.createElement('section');section.className='compact-case';
 const heading=document.createElement('h2');heading.textContent=item.heading[language];
 const grid=document.createElement('div');grid.className='case-layout';
 const text=document.createElement('div');text.className='case-narrative';
 item.paragraphs.forEach(value=>{const p=document.createElement('p');p.textContent=value[language];text.append(p)});
 const media=document.createElement('aside');media.className='case-evidence';
 const image=project.images.find(image=>image.id===item.figure);if(image)media.append(makeArticleFigure(image,language));
 const stats=document.createElement('p');stats.className='case-results';stats.textContent=item.metrics[language];
 grid.append(media,text);section.append(heading,stats,grid);return section;
}

function prepareProject(item){
 if(item.id==='wuerli')item.videos=item.videos.filter(video=>video.id!=='rain');
 if(item.id!=='gagabang')return;
 item.images.forEach(image=>{if(image.id==='guide')image.crop=[.022,.008,.955,.765];if(image.id==='mbti')image.crop=[.025,.01,.943,.70]});
 const source=item.article,blocks=[];
 for(let i=0;i<source.length;i++){
  const heading=source[i],stats=source[i+1],figures=source[i+2];
  if(heading.heading&&stats?.kind==='contribution'&&figures?.figures){
   const detail={heading:heading.heading,figure:figures.figures[0],summary:{},metrics:{},paragraphs:[]};
   for(const language of ['en','zh']){const parts=stats.text[language].split(language==='zh'?'｜':' | ');detail.metrics[language]=parts[0];detail.summary[language]=parts[1]||''}
   i+=2;while(source[i+1]?.text){detail.paragraphs.push(source[++i].text)}blocks.push({caseStudy:detail});
  }else blocks.push(heading);
 }
 item.article=blocks;
}
