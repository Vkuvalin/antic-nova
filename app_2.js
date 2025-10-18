//  #############################################################################################
// ############################### Вспомогательные утилиты
//  #############################################################################################
    const $ = (sel, root=document) => root.querySelector(sel);
    const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

    // Плейсхолдер изображений (inline SVG в data URI)
    const ph = (w, h, text) => {
      const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}'>\
        <defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>\
          <stop offset='0%' stop-color='%231e2128'/><stop offset='100%' stop-color='%2314181e'/>\
        </linearGradient></defs>\
        <rect width='100%' height='100%' rx='12' ry='12' fill='url(%23g)'/>\
        <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' \
          fill='%23a7acb7' font-family='system-ui, Inter, Arial' font-size='18'>${text}</text>\
      </svg>`;
      return 'data:image/svg+xml;utf8,' + svg;
    };
    // ####################################


    // Иконки категорий (минимальные inline SVG)
    const icons = {
      all:      () => `<svg class="icat" viewBox="0 0 24 24"><rect x="4" y="4" width="7" height="7"/><rect x="13" y="4" width="7" height="7"/><rect x="4" y="13" width="7" height="7"/><rect x="13" y="13" width="7" height="7"/></svg>`,
      stamps:   () => `<svg class="icat" viewBox="0 0 24 24"><rect x="6" y="6" width="12" height="10"/><circle cx="9" cy="9" r="1"/><circle cx="15" cy="9" r="1"/><line x1="8" y1="14" x2="16" y2="14"/></svg>`,
      ussr_photos: () => `<svg class="icat" viewBox="0 0 24 24"><rect x="5" y="6" width="14" height="12"/><circle cx="12" cy="12" r="2"/><path d="M8 16c1.2-1.6 2.8-2.4 4-2.4s2.8.8 4 2.4"/></svg>`,
      medals: () => `<svg class="icat" viewBox="0 0 24 24"><polyline points="7,4 12,10 17,4"/><circle cx="12" cy="16" r="4"/></svg>`,
      badges: () => `<svg class="icat" viewBox="0 0 24 24"><path d="M12 3l7 3v6c0 4.4-3.6 7.6-7 9-3.4-1.4-7-4.6-7-9V6l7-3z"/></svg>`,
      coins: () => `<svg class="icat" viewBox="0 0 24 24"><circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="3"/></svg>`,
      banknotes:() => `<svg class='icat' viewBox='0 0 24 24'><rect x='3' y='6' width='18' height='12'/><circle cx='12' cy='12' r='3'/></svg>`,
      soviet_watches: () => `<svg class="icat" viewBox="0 0 24 24"><circle cx="12" cy="12" r="7"/><line x1="12" y1="12" x2="12" y2="8"/><line x1="12" y1="12" x2="15" y2="12"/></svg>`,
      fiction_books: () => `<svg class="icat" viewBox="0 0 24 24"><path d="M5 5h8a3 3 0 0 1 3 3v11H8a3 3 0 0 1-3-3V5z"/><line x1="8" y1="8" x2="15" y2="8"/></svg>`,
      history_books_magazines: () => `<svg class="icat" viewBox="0 0 24 24"><rect x="5" y="6" width="9" height="12"/><rect x="10" y="4" width="9" height="12"/><line x1="7" y1="9" x2="12" y2="9"/><line x1="12" y1="7" x2="17" y2="7"/></svg>`,
      oil_painting_modern: () => `<svg class="icat" viewBox="0 0 24 24"><rect x="4" y="5" width="16" height="12"/><circle cx="9" cy="9" r="1.5"/><polyline points="7,15 11,12 15,14 18,12"/></svg>`,
      postcards: () => `<svg class="icat" viewBox="0 0 24 24"><rect x="4" y="7" width="16" height="10"/><rect x="15" y="8.5" width="3.5" height="3"/><line x1="6.5" y1="10" x2="12" y2="10"/><line x1="6.5" y1="12" x2="11" y2="12"/></svg>`,
      religious_icons: () => `<svg class="icat" viewBox="0 0 24 24"><rect x="6" y="5" width="12" height="14" rx="2"/><line x1="12" y1="8" x2="12" y2="14"/><line x1="9" y1="11" x2="15" y2="11"/></svg>`,
      church_castings: () => `<svg class="icat" viewBox="0 0 24 24"><path d="M12 5c2 2 3 3.5 3 5.5a3 3 0 0 1-6 0C9 8.5 10 7 12 5z"/><line x1="9" y1="16" x2="15" y2="16"/><line x1="8" y1="18" x2="16" y2="18"/></svg>`,
      church_books: () => `<svg class="icat" viewBox="0 0 24 24"><rect x="6" y="5" width="12" height="14" rx="2"/><line x1="12" y1="8" x2="12" y2="14"/><line x1="10" y1="11" x2="14" y2="11"/></svg>`,
      gzhel: () => `<svg class="icat" viewBox="0 0 24 24"><path d="M8 5h8c0 2-1 3.5-3 4v2c0 2.5 1.5 4.5 3 6H8c1.5-1.5 3-3.5 3-6V9C9 8.5 8 7 8 5z"/></svg>`,
      other: () => `<svg class="icat" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/><path d="M9.5 10a2.5 2.5 0 1 1 3.2 2.4c-.9.3-1.2.8-1.2 1.6"/><circle cx="12" cy="17" r="0.8"/></svg>`
    };

  const categories = [
  { key: 'all',                      label: 'Все' },

  { key: 'stamps',                   label: 'Марки' },
  { key: 'ussr_photos',              label: 'Фотографии глав СССР' },

  { key: 'medals',                   label: 'Медали' },
  { key: 'badges',                   label: 'Значки' },
  { key: 'coins',                    label: 'Монеты' },
  { key: 'banknotes',                label: 'Банкноты' },
  { key: 'soviet_watches',           label: 'Советские механические часы' },

  { key: 'fiction_books',            label: 'Художественные книги' },
  { key: 'history_books_magazines',  label: 'Исторические книги и журналы' },
  { key: 'oil_painting_modern',      label: 'Современная живопись маслом' },
  { key: 'postcards',                label: 'Открытки' },

  { key: 'religious_icons',          label: 'Иконы' },
  { key: 'church_castings',          label: 'Литые церковные изделия' },
  { key: 'church_books',             label: 'Книги церковные' },

  { key: 'gzhel',                    label: 'Гжель' },
  { key: 'other',                    label: 'Прочее' }
];
    // ####################################

    // ====== Директории и форматы ======
    const CATEGORY_DIRS   = ['assets/categories', 'assets/catigories']; // алиас поддержан
    const IMG_EXTS        = ['webp','avif','png','jpg','jpeg'];
    const MAX_IMAGES_PER_LOT = 3;     // сколько фото берём в карточку
    const MAX_PROBE_IMAGES   = 12;    // до какого номера проверять (1..12)
    const MAX_LOT_SCAN       = 200;   // максимум "статей" на категорию при авто-скане
    const MISS_STREAK_STOP   = 5;     // останов после 5 подряд промахов при скане <cat>_<n>
    // ####################################


    // Конфиг и утилиты
    // ####################################
    const qs  = (s, r=document) => r.querySelector(s);
    const qsa = (s, r=document) => Array.from(r.querySelectorAll(s));

    const joinUrl = (...parts)=>parts.map(p=>String(p).replace(/(^\/|\/$)/g,'')).join('/');

    // HEAD + Image fallback (на статике часто нет листинга, поэтому так проверяем существование)
    async function fileExists(url){
      try { const r = await fetch(url, { method:'HEAD', cache:'no-store' }); if (r.ok) return true; } catch(_){}
      try {
        await new Promise((res,rej)=>{
          const im = new Image();
          im.onload = ()=>res(true);
          im.onerror= ()=>rej(false);
          im.src = url + (url.includes('?')?'&':'?') + 'v=' + Date.now();
        });
        return true;
      } catch(_){}
      return false;
    }
    // ####################################




    // Поиск картинок внутри лота
    // ####################################
    async function pickLotImages(catKey, lotSlug, want = MAX_IMAGES_PER_LOT){
      const out = [];
      for (const base of CATEGORY_DIRS){
        const lotBase = joinUrl(base, encodeURIComponent(catKey), encodeURIComponent(lotSlug));

        // 1..MAX_PROBE_IMAGES — сначала чисто цифры: 1.*, 2.*, ...
        for (let i=1; i<=MAX_PROBE_IMAGES && out.length<want; i++){
          for (const ext of IMG_EXTS){
            const url = joinUrl(lotBase, `${i}.${ext}`);
            if (await fileExists(url)){ out.push(url); break; }
          }
        }

        // миграционный вариант: icon_1.*, icon_2.*, ...
        if (out.length < want){
          for (let i=1; i<=MAX_PROBE_IMAGES && out.length<want; i++){
            for (const ext of IMG_EXTS){
              const url = joinUrl(lotBase, `icon_${i}.${ext}`);
              if (await fileExists(url)){ out.push(url); break; }
            }
          }
        }

        if (out.length) break;
      }
      if (!out.length) out.push(ph(800,600,'Фото'));
      return out.slice(0, want);
    }
    // ####################################



    // Авто-поиск лотов без (паттерн <category>_<n>)
    // ####################################
    async function discoverLotsSequential(catKey){
      const found = [];
      let miss = 0;

      for (let n=1; n<=MAX_LOT_SCAN; n++){
        const slug = `${catKey}_${n}`;
        let exists = false;

        // Пытаемся найти хотя бы первую картинку — 1.* или icon_1.*
        for (const base of CATEGORY_DIRS){
          for (const ext of IMG_EXTS){
            const a = joinUrl(base, encodeURIComponent(catKey), slug, `1.${ext}`);
            const b = joinUrl(base, encodeURIComponent(catKey), slug, `icon_1.${ext}`);
            if (await fileExists(a) || await fileExists(b)){ exists = true; break; }
          }
          if (exists) break;
        }

        if (exists){
          found.push({ slug });
          miss = 0;             // сбрасываем серию промахов, скан продолжаем
        } else {
          miss++;
          if (miss >= MISS_STREAK_STOP) break; // остановка после серии пустых
        }
      }

      return found;
    }
    // ####################################


    // ####################################
    // ####################################


    // ####################################
    // ####################################



    // ####################################
    // Демо-данные (замените на реальные лоты)
    // ####################################
    const lots = Array.from({length: 16}).map((_, i) => ({
      id: i+1,
      title: `Лот #${i+1} — Пример наименование` ,
      category: categories[ (i % (categories.length-1)) + 1 ].key, // распределим по категориям, кроме 'all'
      url: '#',
      images: [
        ph(800, 600, `Фото 1 / ${i+1}`),
        ph(400, 400, `Фото 2 / ${i+1}`),
        ph(400, 400, `Фото 3 / ${i+1}`)
      ]
    }));
    // ####################################


    // ####################################
    // Состояние
    let filtered = [...lots];
    let page = 0;
    let key_name = 0;
    let counterHover = 0;
    const PAGE_SIZE = 12;

    // Глобальный счётчик версий загрузки (для отмены устаревших потоков)
    let loadSeq = 0;
    // ####################################



    // ####################################
    // Рендер категорий в сайдбаре
    function renderCategories(){
      const list = $('#catList');
      list.innerHTML = '';
      categories.forEach((c, idx) =>{
        const li = document.createElement('li');
        li.innerHTML = `
          <button class="catbtn ${c.key==='all' ? 'active':''}" data-cat="${c.key}" aria-pressed="${c.key==='all'}">
            <div class="icobox">${(icons[c.key]||icons.none)()}</div>
            <span class="catlabel">${c.label}</span>
          </button>`;
        list.appendChild(li);
      });

      // Навешиваем клики
      $$('#catList .catbtn').forEach(btn=>{
        btn.addEventListener('click', ()=>{
          $$('#catList .catbtn').forEach(b=>b.classList.remove('active'));
          btn.classList.add('active');
          const key = btn.getAttribute('data-cat');
          applyFilter(key);

          document.querySelector('.sidebar')?.classList.add('no-hover');
          if (window.innerWidth > 768){
            setTimeout(() => document.querySelector('.sidebar')?.classList.remove('no-hover'), 320);
          }else {
            if (counterHover == 0) {
              document.querySelector('.sidebar')?.classList.remove('no-hover');
              counterHover = 1;
            }else{
              document.querySelector('.sidebar')?.classList.add('no-hover');
              counterHover = 0;
            }
          }

          document.querySelector('.sidewrap')?.scrollTo({ top: 0, behavior: 'smooth' });
          window.scrollTo(0, 0);
          document.documentElement.scrollTop = 0;
          document.body.scrollTop = 0;
        });
      });
    }
    // ####################################
    




    // ####################################
    // Сборка карточки и вывод
    async function buildLotFromAssets(catKey, lotEntry){
    const images = await pickLotImages(catKey, lotEntry.slug, MAX_IMAGES_PER_LOT);
    return {
      id: `${catKey}/${lotEntry.slug}`,
      title: lotEntry.title || lotEntry.slug.replace(/[_-]+/g,' ').replace(/\b\w/g,m=>m.toUpperCase()),
      category: catKey,
      url: lotEntry.url || '#',     // позже подставим ссылку на Meshok из meta
      images
    };
  }

  async function applyFilter(key){
    const wrap = qs('#cards');
    const mySeq = ++loadSeq;          // фиксируем версию этой загрузки
    wrap.innerHTML = '';
    qs('#countInfo').textContent = 'Загрузка...';


    // локальный набор уже вставленных id → защита от дублей
    const seen = new Set();
    const safeAppend = (lot) => {
    if (mySeq !== loadSeq) return; // устаревший поток — выходим тихо
      const uid = lot.id || `${lot.category}/${lot.title}`;
    if (seen.has(uid)) return;
      seen.add(uid);
      wrap.appendChild(cardEl(lot));
      qs('#countInfo').textContent = `${wrap.children.length} шт`;
    };



  if (key === 'all'){
    const perCat = 5; // ВРЕМЕННЫЙ ЛИМИТ
    const cats = categories.filter(c => c.key !== 'all');
    for (const c of cats){
      const discovered = await discoverLotsSequential(c.key);
      const slice = discovered.slice(0, perCat);
      for (const e of slice){
        const lot = await buildLotFromAssets(c.key, e);
        safeAppend(lot);
      }
    }
    return;
  }

  // одна категория
  const lotEntries = await discoverLotsSequential(key);
  for (const e of lotEntries){
    const lot = await buildLotFromAssets(key, e);
    safeAppend(lot);
  }
}

function updateCount(){
  if (qs('#countInfo').textContent === 'Загрузка...'){
    qs('#countInfo').textContent = `Что-то не так`;
  }
}
// ####################################








/* ################# Старый applyFilter
    // function applyFilter(key){
    //   filtered = key==='all' ? [...lots] : lots.filter(l => l.category === key);
    //   page = 0;
    //   key_name = key
    //   $('#cards').innerHTML = '';
    //   updateCount();
    //   renderNext();

    //   categories.forEach((c, idx) =>{
    //     if (c.key === key){
          
    //       if (key === 'all'){
    //         $('#nameCat').textContent = `Галерея лотов`;
    //       }else {
    //         $('#nameCat').textContent = `${c.label}`;
    //       }

    //     }
    //   })
    // }

    // ####################################
*/

/* ############# Рендер пачки карточек
    // Рендер пачки карточек
    // function renderNext(){
    //   const from = page * PAGE_SIZE;
    //   const to = Math.min(from + PAGE_SIZE, filtered.length);
    //   const slice = filtered.slice(from, to);
    //   const wrap = $('#cards');

    //   slice.forEach(lot => wrap.appendChild(cardEl(lot)));

    //   page++;
    //   const more = $('#loadMore');
    //   if(page * PAGE_SIZE >= filtered.length){
    //     more.setAttribute('disabled', '');
    //   } else {
    //     more.removeAttribute('disabled');
    //   }
    // }
    // ####################################
*/







  // ####################################
  function cardEl(lot){
    const el = document.createElement('article');
    el.className = 'card';
    el.innerHTML = `
      <div class="photos">
        <div class="mainimg"> <img loading="lazy" decoding="async" alt="${lot.title}" src="${(lot.images[0]||ph(800,600,'Фото'))}"> </div>
        <div class="thumbs">
          <div class="thumb"> <img loading="lazy" decoding="async" alt="${lot.title}" src="${(lot.images[1]||lot.images[0]||ph(400,400,'Фото'))}"> </div>
          <div class="thumb"> <img loading="lazy" decoding="async" alt="${lot.title}" src="${(lot.images[2]||lot.images[0]||ph(400,400,'Фото'))}"> </div>
        </div>
      </div>
      <div class="card-body">
        <h3 class="title">${lot.title}</h3>
        <div class="meta">Категория: <span class="muted">${lot.category}</span></div>
        <a class="more" href="${lot.url}" target="_blank" rel="noopener">
          <span class="span-correct">Подробнее</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
        </a>
      </div>`;
    return el;
  }
  // ####################################








    // Инициализация
    // renderCategories();
    // updateCount();
    // renderNext();
    // qs('#loadMore')?.addEventListener('click', renderNext);

    // Инициализация (только новый поток)
    renderCategories();
    applyFilter('all'); // можно поставить нужную категорию по умолчанию
    setTimeout(() => document.querySelector('.sidebar')?.classList.remove('no-hover'), 10000);
// ##########################################################################
