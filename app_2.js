//  #############################################################################################
// ############################### Вспомогательные утилиты
//  #############################################################################################
    const qs  = (s, r=document) => r.querySelector(s);
    const qsa = (s, r=document) => Array.from(r.querySelectorAll(s));
    const joinUrl = (...parts)=>parts.map(p=>String(p).replace(/(^\/|\/$)/g,'')).join('/');



    // #################################### (Проверка существования файла и выбор расширения)
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


    // выбрать реальное расширение для base/fname (кэшируем)
    async function pickExt(basePath, fileNameNoExt){
      const key = `${basePath}/${fileNameNoExt}`;
      if (imageExtCache.has(key)) return imageExtCache.get(key);
      for (const ext of FALLBACK_EXTS){
        const url = `${basePath}/${fileNameNoExt}.${ext}`;
        if (await fileExists(url)) { imageExtCache.set(key, ext); return ext; }
      }
      imageExtCache.set(key, null);
      return null;
    }
    // ####################################





    // ####################################
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



    // ####################################
    // ===== Параметры пагинации / сети =====
    const PAGE_SIZE_DESKTOP = 8;
    const PAGE_SIZE_MOBILE  = 4;
    const BATCH_K_ALL       = 2; // «Все»: по 2 лота с категории
    // ####################################


    // ####################################
    // ===== Fallback scan (когда нет index.json) =====
    const SCAN_PARALLEL = 4;          // сколько номеров <n> проверяем одновременно
    const SCAN_MAX_NUM  = 1000;       // верхняя «мягкая» граница n (чтобы не уйти в бесконечность)
    const SCAN_MISSES_STOP = 5;       // остановка после 5 подряд промахов
    const FALLBACK_EXTS = ['jpg','jpeg','png']; // ты используешь эти форматы

    // кэш на сессию
    const fallbackIndexCache = new Map();     // cat -> [{slug}]
    const imageExtCache      = new Map();     // "<base>/<fname>" -> 'jpg'|'png'|... (чтобы лишний раз не пробовать все расширения)

    // dev-лог (включить при отладке)
    const DEV_FALLBACK_LOG = false;
    const flog = (...a) => { if (DEV_FALLBACK_LOG) console.log('[fallback]', ...a); };
    // ####################################



    // ####################################
    // ===== Lazy-изображения в карточках =====
    const HIGH_PRIORITY_BUDGET = 6;      // сколько первых превью грузим с fetchpriority="high"
    let highPriorityLeft = HIGH_PRIORITY_BUDGET;

    const thumbObserver = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const img = entry.target;
        const src = img.getAttribute('data-src');
        if (!src) { thumbObserver.unobserve(img); continue; }
        img.src = src;                         // старт фактической загрузки
        img.removeAttribute('data-src');
        img.addEventListener('load', () => img.classList.remove('lazy-img'), { once: true });
        thumbObserver.unobserve(img);
      }
    }, { rootMargin: '200px 0px', threshold: 0.01 });
    // ####################################






//  #################################################################################################################################################################

    // ####################################
    // ===== Lightbox (modal carousel) =====
    const lbState = { images: [], index: 0, title: '' };
    let lb = null;

    function ensureLightbox() {
      if (lb) return lb;
      const root = document.createElement('div');
      root.className = 'lightbox';
      root.setAttribute('role', 'dialog');
      root.setAttribute('aria-modal', 'true');
      root.setAttribute('aria-label', 'Просмотр изображений');
      root.hidden = true;
      root.innerHTML = `
        <div class="lb-backdrop" data-lb="backdrop"></div>
        <div class="lb-dialog">
          <button class="lb-close" data-lb="close" aria-label="Закрыть">✕</button>
          <button class="lb-nav lb-prev" data-lb="prev" aria-label="Назад">⫷</button>
          <figure class="lb-figure">
            <img class="lb-img" data-lb="img" alt="">
            <figcaption class="lb-caption" data-lb="cap"></figcaption>
          </figure>
          <button class="lb-nav lb-next" data-lb="next" aria-label="Вперёд">⫸</button>
        </div>
      `;
      document.body.appendChild(root);

      const img = root.querySelector('[data-lb="img"]');
      const cap = root.querySelector('[data-lb="cap"]');
      const btnClose = root.querySelector('[data-lb="close"]');
      const btnPrev  = root.querySelector('[data-lb="prev"]');
      const btnNext  = root.querySelector('[data-lb="next"]');
      const backdrop = root.querySelector('[data-lb="backdrop"]');


      // клики
      btnClose.addEventListener('click', closeLightbox);
      backdrop.addEventListener('click', closeLightbox);
      btnPrev.addEventListener('click', () => stepLightbox(-1));
      btnNext.addEventListener('click', () => stepLightbox(+1));


      // клавиатура
      root.addEventListener('keydown', (e)=>{
        if (e.key === 'Escape') return closeLightbox();
        if (e.key === 'ArrowLeft') return stepLightbox(-1);
        if (e.key === 'ArrowRight') return stepLightbox(+1);
      });


      // свайпы (очень простая реализация)
      let sx = 0, sy = 0, moved = false;
      root.addEventListener('touchstart', (e)=>{ const t=e.touches[0]; sx=t.clientX; sy=t.clientY; moved=false; }, {passive:true});
      root.addEventListener('touchmove',  (e)=>{ moved=true; }, {passive:true});
      root.addEventListener('touchend',   (e)=>{
        if (!moved) return;
        const t = e.changedTouches[0];
        const dx = t.clientX - sx, dy = t.clientY - sy;
        if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
          stepLightbox(dx > 0 ? -1 : +1);
        }
      }, {passive:true});

      lb = { root, img, cap, btnPrev, btnNext };
      return lb;
    }

    function openLightbox(images, startIndex=0, title='') {
      const box = ensureLightbox();
      lbState.images = images.filter(Boolean);
      lbState.index  = Math.min(Math.max(0, startIndex), lbState.images.length-1);
      lbState.title  = title || '';

      if (!lbState.images.length) return;

      updateLightbox();
      box.root.hidden = false;
      box.root.tabIndex = -1;
      box.root.focus();
      document.documentElement.classList.add('lb-lock'); // запрет прокрутки фона
    }

    function closeLightbox() {
      if (!lb) return;
      lb.root.hidden = true;
      document.documentElement.classList.remove('lb-lock');
    }

    function stepLightbox(d=1) {
      const n = lbState.images.length;
      if (n <= 1) return;
      lbState.index = (lbState.index + d + n) % n; // кольцевая прокрутка
      updateLightbox(true);
    }

    function updateLightbox(preload=true) {
      const { images, index, title } = lbState;
      const url = images[index];
      lb.img.src = url;
      lb.img.alt = `${title ? title + ' — ' : ''}фото ${index+1} из ${images.length}`;
      lb.cap.textContent = `${index+1} / ${images.length}${title ? ' — ' + title : ''}`;


      // предзагрузка соседних, чтобы листалось мгновенно
      if (preload && images.length > 1) {
        const a = new Image(); a.src = images[(index+1) % images.length];
        const b = new Image(); b.src = images[(index-1+images.length) % images.length];
      }
    }
    // ####################################









    // ####################################
    // Есть ли у лота хоть одно фото (быстрая проверка «живой» папки)
    async function lotHasAnyImage(catKey, slug){
      const base = `assets/categories/${encodeURIComponent(catKey)}/${encodeURIComponent(slug)}`;
      const ext1 = await pickExt(base, '1');   // 1.jpg|jpeg|png
      if (ext1) return { base };
      return null;
    }
    // ####################################





    // ####################################
    /* ===== Manifest config (v1) ===== */
    const MANIFEST_TTL_MS = 15 * 60 * 1000;     // 15 минут
    const LS_PREFIX       = 'manifest:';        // ключи в localStorage
    const manifestRAM     = new Map();          // RAM-кэш манифестов

    
    // безопасная работа с LS
    const lsRead = (k) => { try { const raw = localStorage.getItem(k); return raw ? JSON.parse(raw) : null; } catch { return null; } };
    const lsWrite = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };


    // сетевой фетч манифеста
    async function fetchManifest(cat){
      const url = `assets/categories/${encodeURIComponent(cat)}/index.json`;
      const res = await fetch(url, { cache: 'no-cache' }); // на GH Pages позволяем revalidate
      if (!res.ok) throw new Error(`no manifest for ${cat}`);
      const data = await res.json();
      data.version = data.version || '';
      return data;
    }


    // RAM → localStorage (TTL) → сеть
    async function loadManifest(cat){
      if (manifestRAM.has(cat)) return manifestRAM.get(cat);

      const key = `${LS_PREFIX}${cat}`;
      const cached = lsRead(key);
      const now = Date.now();

      if (cached && (now - (cached.ts || 0) < MANIFEST_TTL_MS)) {
        manifestRAM.set(cat, cached.data);
        return cached.data;
      }

      const data = await fetchManifest(cat);
      manifestRAM.set(cat, data);
      lsWrite(key, { ts: now, data });
      return data;
    }


    // нормализация записей из манифеста
    function entriesFromManifest(cat, manifest){
      const lots = Array.isArray(manifest?.lots) ? manifest.lots : [];
      return lots.map(l => ({
        slug:  l.slug,
        files: Array.isArray(l.files) ? l.files.slice(0,3) : [],
        title: l.title,
        url:   l.url
      }));
    }


    // сборка объекта лота (для renderNextBatch)
    function lotFromEntry(cat, entry, version){
      const base  = `assets/categories/${encodeURIComponent(cat)}/${encodeURIComponent(entry.slug)}`;
      const imgs  = (entry.files || []).slice(0,3).map(fn => `${base}/${fn}?v=${encodeURIComponent(version||'')}`);
      return {
        id:       `${cat}/${entry.slug}`,
        title:    entry.title || entry.slug.replace(/[_-]+/g,' ').replace(/\b\w/g,m=>m.toUpperCase()),
        category: cat,
        url:      entry.url || '#',
        images:   imgs.length ? imgs : [ph(800,600,'Фото')]
      };
    }
    // ####################################




    // ####################################
    // Вычисляем тип уст-ва
    function isMobile() { return matchMedia('(max-width: 859px)').matches; }

    function networkLimit() { // Вычисляем параметры сети
      const c = navigator.connection || {};
      if (c.saveData) return 2;
      const t = c.effectiveType || '';
      if (t.includes('2g')) return 2;
      if (t === '3g') return 3;
      return 4;
    }
    // ####################################


    // ####################################
    // Состояние
    let page = 0;
    let key_name = 'all';
    let counterHover = 0;
    const PAGE_SIZE = 12;

    // Глобальный счётчик версий загрузки (для отмены устаревших потоков)
    let loadSeq = 0;
    // ####################################



    // ===== Глобальное состояние текущей выдачи =====
    const galleryState = {
      key: null,            // 'all' или <category>
      mode: 'single',       // 'single' | 'all'
      version: '',          // из манифеста (для ?v=)
      entries: [],          // нормализованные записи (single)
      page: 0,              // номер текущей страницы (single/all)
      pageSize: isMobile() ? PAGE_SIZE_MOBILE : PAGE_SIZE_DESKTOP,
      fallback: false,   // single-режим: данные из сканера?

      // для режима 'all'
      allPacks: null,       // [{cat, version, entries, cursor}]
      allLimit: BATCH_K_ALL // K на категорию в одной порции
    };

    function resetGalleryState() {
      galleryState.page = 0;
      galleryState.entries = [];
      galleryState.version = '';
      galleryState.allPacks = null;
      galleryState.fallback = false;
    }
    // ####################################

//  #################################################################################################################################################################


    // ####################################
    // Вспомогательные сборщики батчей

    // SINGLE: вернуть записи текущей страницы
    function getSingleBatch() {
      const from = galleryState.page * galleryState.pageSize;
      const to   = Math.min(from + galleryState.pageSize, galleryState.entries.length);
      return galleryState.entries.slice(from, to);
    }

    // ALL: собрать по K записей из каждой категории (циклически)
    function getAllBatch() {
      const packs = galleryState.allPacks || [];
      const out = [];
      for (const p of packs) {
        const from = p.cursor;
        const to   = Math.min(from + galleryState.allLimit, p.entries.length);
        const slice = p.entries.slice(from, to);
        // корректный спред + расширение объекта
        out.push(...slice.map(e => ({ ...e, _cat: p.cat, _version: p.version, _fallback: !!p.fallback })));
        p.cursor = to; // сдвигаем курсор
      }
      const hasMore = packs.some(p => p.cursor < p.entries.length);
      return { items: out, hasMore };
    }

    // Быстрое наличие следующей порции
    function hasMoreSingle() {
      const nextFrom = (galleryState.page + 1) * galleryState.pageSize;
      return nextFrom < galleryState.entries.length;
    }
    // ####################################




    // ####################################
    // Очень аккуратный префетч (только первые изображения следующей порции)
    function prefetchImages(urls, limit = networkLimit()) {
      const c = navigator.connection || {};
      if (c.saveData) return;              // экономия данных — не префетчим
      const t = c.effectiveType || '';
      if (t.includes('2g')) return;        // очень медленная сеть — не префетчим

      // ограничим количество одновременно создаваемых <link rel="prefetch">
      const head = document.head || document.documentElement;
      let inFlight = 0;
      for (const u of urls) {
        if (inFlight >= limit) break;
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.as  = 'image';
        link.href = u;
        head.appendChild(link);
        inFlight++;
      }
    }
    // ####################################



    // ####################################
    // Рендер следующего батча (универсально для single/all)
    async function renderNextBatch(mySeq) {
      const wrap = qs('#cards');
      const seen = new Set(Array.from(wrap.children).map(n => n.dataset?.uid));


      // собрать порцию элементов
      let batch = [];
      let hasMore = false;

      if (galleryState.mode === 'single') {
        const entries = getSingleBatch();
        if (!galleryState.fallback) {
          batch = entries.map(e => lotFromEntry(galleryState.key, e, galleryState.version));
        } else {
          batch = await Promise.all(entries.map(e => buildLotFromAssets(galleryState.key, e)));
        }
        hasMore = hasMoreSingle();
      } else {
        const { items, hasMore: hm } = getAllBatch();
        batch = await Promise.all(items.map(e => (
          e._fallback ? buildLotFromAssets(e._cat, e) : lotFromEntry(e._cat, e, e._version)
        )));
        hasMore = hm;
      }

      // вставка карточек
      for (const lot of batch) {
        if (mySeq !== loadSeq) return; // отмена устаревшего потока
        const uid = lot.id || `${lot.category}/${lot.title}`;
        if (seen.has(uid)) continue;
        const el = cardEl(lot);
        el.dataset.uid = uid;
        wrap.appendChild(el);
        qs('#countInfo').textContent = `${wrap.children.length} шт`;
      }

      // состояние «Показать ещё»
      const btn = qs('#loadMore');
      if (hasMore) {
        btn.removeAttribute('disabled');
      } else {
        btn.setAttribute('disabled', '');
      }

      // осторожный префетч первых изображений следующей партии
      if (hasMore && mySeq === loadSeq) {
        let nextUrls = [];
        if (galleryState.mode === 'single') {
          const nextPage = galleryState.page + 1;
          const from = nextPage * galleryState.pageSize;
          const to   = Math.min(from + galleryState.pageSize, galleryState.entries.length);
          const upcoming = galleryState.entries.slice(from, to);
          nextUrls = upcoming.map(e => {
            const base = `assets/categories/${encodeURIComponent(galleryState.key)}/${encodeURIComponent(e.slug)}`;
            const f = (e.files && e.files[0]) ? e.files[0] : '1.jpg';
            return `${base}/${f}?v=${encodeURIComponent(galleryState.version||'')}`;
          });
        } else {
          // all: соберём по одному первому изображению из следующей «микропорции» каждой категории
          const nextList = [];
          for (const p of (galleryState.allPacks || [])) {
            if (p.cursor < p.entries.length) {
              const e = p.entries[p.cursor];
              if (e) nextList.push({ e, cat: p.cat, version: p.version });
            }
          }
          nextUrls = nextList.map(({e, cat, version}) => {
            const base = `assets/categories/${encodeURIComponent(cat)}/${encodeURIComponent(e.slug)}`;
            const f = (e.files && e.files[0]) ? e.files[0] : '1.jpg';
            return `${base}/${f}?v=${encodeURIComponent(version||'')}`;
          });
        }
        prefetchImages(nextUrls);
      }
    }
    // ####################################




    // ####################################
    // Обработчик «Показать ещё» (добавить один раз)
    qs('#loadMore')?.addEventListener('click', () => {
      const mySeq = loadSeq;        // текущий поток
      if (galleryState.mode === 'single') {
        galleryState.page++;
      } else {
        galleryState.page++;        // для all — page влияет только на аналитические метрики; курсоры у пакетов уже сдвинулись
      }
      renderNextBatch(mySeq);
    });
    // ####################################



//  #################################################################################################################################################################



    // ####################################
    // Поиск картинок внутри лота
    async function pickLotImages(catKey, lotSlug, want = MAX_IMAGES_PER_LOT){
      const out = [];
      for (const base of CATEGORY_DIRS){
        const lotBase = joinUrl(base, encodeURIComponent(catKey), encodeURIComponent(lotSlug));
        for (let i=1; i<=MAX_PROBE_IMAGES && out.length<want; i++){
          for (const ext of IMG_EXTS){              // см. пункт 4: сузим IMG_EXTS
            const url = joinUrl(lotBase, `${i}.${ext}`);
            if (await fileExists(url)){ out.push(url); break; }
          }
        }
        if (out.length) break;
      }
      if (!out.length) out.push(ph(800,600,'Фото'));
      return out.slice(0, want);
    }
    // ####################################


    

    // ####################################
    // Авто-поиск лотов без (паттерн <category>_<n>)
    async function discoverLotsSequential(catKey){
      if (fallbackIndexCache.has(catKey)) {
        flog('cache hit', catKey);
        return fallbackIndexCache.get(catKey);
      }

      const found = [];
      let missStreak = 0;
      let n = 1;

      while (n <= SCAN_MAX_NUM && missStreak < SCAN_MISSES_STOP) {
        const batch = Array.from({length: SCAN_PARALLEL}, (_,i)=> n + i);
        const results = await Promise.allSettled(
          batch.map(async num => {
            const slug = `${catKey}_${num}`;
            const ok = await lotHasAnyImage(catKey, slug);
            return ok ? { slug } : null;
          })
        );

        for (const r of results){
          if (r.status === 'fulfilled' && r.value) {
            found.push(r.value);
            missStreak = 0;           // сбрасываем серию промахов
          } else {
            missStreak++;
          }
        }

        if (DEV_FALLBACK_LOG) flog('batch', { from: n, missStreak, found: found.length });
        n += SCAN_PARALLEL;
      }

      fallbackIndexCache.set(catKey, found);
      return found;
    }
    // ####################################



    // ####################################
    // Рендер категорий в сайдбаре
    function renderCategories(){
      const list = qs('#catList');
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
      qsa('#catList .catbtn').forEach(btn=>{
        btn.addEventListener('click', ()=>{
          qsa('#catList .catbtn').forEach(b=>b.classList.remove('active'));
          btn.classList.add('active');
          const key = btn.getAttribute('data-cat');
          if (key === key_name) {

          }else {
            key_name = key
            applyFilter(key);
          }

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
      const slug  = lotEntry.slug;
      const base  = `assets/categories/${encodeURIComponent(catKey)}/${encodeURIComponent(slug)}`;
      const images = [];

      for (let i=1; i<=3; i++){
        const ext = await pickExt(base, String(i));   // ищем 1.*, 2.*, 3.* среди FALLBACK_EXTS
        if (ext) images.push(`${base}/${i}.${ext}`);
      }

      if (!images.length) images.push(ph(800,600,'Фото'));

      return {
        id: `${catKey}/${slug}`,
        title: lotEntry.title || slug.replace(/[_-]+/g,' ').replace(/\b\w/g,m=>m.toUpperCase()),
        category: catKey,
        url: lotEntry.url || '#',
        images
      };
    }
    // ####################################


    // ####################################
    async function applyFilter(key){
      const wrap = qs('#cards');
      const mySeq = ++loadSeq;          // фиксируем версию этой загрузки
      wrap.innerHTML = '';
      qs('#countInfo').textContent = 'Загрузка…';
      resetGalleryState();


      // режим и ключ
      galleryState.key  = key;
      galleryState.mode = (key === 'all') ? 'all' : 'single';

      const btn = qs('#loadMore');
      btn?.setAttribute('disabled','');   // блокируем пока нет данных


      if (galleryState.mode === 'single') {
        // SINGLE: манифест → entries → первая порция
        try {
          const mf = await loadManifest(key);
          galleryState.version = mf.version || '';
          galleryState.entries = entriesFromManifest(key, mf);
        } catch {
          // Fallback-скан (при отсутствии манифеста)
          const disc = await discoverLotsSequential(key);
          galleryState.entries = disc.map(d => ({ slug: d.slug }));  // БЕЗ files
          galleryState.version = '';
          galleryState.fallback = true;
        }
        galleryState.page = 0;
        renderNextBatch(mySeq);
      } else {
        // ALL: грузим манифесты/списки по всем категориям (параллельно)
        const cats = categories.filter(c => c.key !== 'all');
        const packs = await Promise.all(cats.map(async c => {
          try {
            const mf = await loadManifest(c.key);
            return { cat: c.key, version: mf.version || '', entries: entriesFromManifest(c.key, mf), cursor: 0 };
          } catch {
            const disc = await discoverLotsSequential(c.key);
            const entries = disc.map(d => ({ slug: d.slug }));         // БЕЗ files
            return { cat: c.key, version: '', entries, cursor: 0, fallback: true };
          }
        }));
        galleryState.allPacks = packs;
        galleryState.page = 0;
        renderNextBatch(mySeq);
      }
    }
    // ####################################


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


    // ####################################

    function escapeHtml(s=''){ 
      return String(s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
    }

    function cardEl(lot){
      const title = escapeHtml(lot.title || '');
      const url   = lot.url || '#';
      const imgs  = Array.isArray(lot.images) ? lot.images.slice(0,3) : [];
      const cover = imgs[0] || ph(800,600,'Фото');

      const el = document.createElement('article');
      el.className = 'card';

      // fetchpriority только для первых карточек страницы
      const eager = (highPriorityLeft-- > 0);
      const prio  = eager ? ' fetchpriority="high"' : '';
      const loadingAttr = eager ? 'eager' : 'lazy';

      el.innerHTML = `
        <div class="photos">
          <div class="mainimg"> <img class="cover" loading="${loadingAttr}" decoding="async" alt="${lot.title}" src="${(lot.images[0]||ph(800,600,'Фото'))}"> </div>
          <div class="thumbs">
            <div class="thumb"> <img class="lazy-img" loading="${loadingAttr}" decoding="async" alt="${lot.title}" src="${(lot.images[1]||lot.images[0]||ph(400,400,'Фото'))}"> </div>
            <div class="thumb"> <img class="lazy-img" loading="${loadingAttr}" decoding="async" alt="${lot.title}" src="${(lot.images[2]||lot.images[0]||ph(400,400,'Фото'))}"> </div>
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



      // Открытие лайтбокса по клику
      const coverEl = qs('.cover', el);
      coverEl?.addEventListener('click', () => openLightbox(imgs, 0, title));

      const thumbEls = qsa('.thumb', el);
      thumbEls[0]?.addEventListener('click', () => openLightbox(imgs, 1, title));
      thumbEls[1]?.addEventListener('click', () => openLightbox(imgs, 2, title));



      // подписываем ленивые изображения
      qsa('.lazy-img', el).forEach(img => thumbObserver.observe(img));
      return el;
    }
    // ####################################




// ####################################
// Инициализация (только новый поток)
renderCategories();
applyFilter('all');
setTimeout(() => {if(qs('#countInfo').textContent == 'Загрузка…') { qs('#countInfo').textContent = '0 шт' }}, 5000);
// ##########################################################################