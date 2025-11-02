// #############################################################################################
// ВСПОМОГАТЕЛЬНЫЕ УТИЛИТЫ
// #############################################################################################
const qs  = (s, r=document) => r.querySelector(s);
const qsa = (s, r=document) => Array.from(r.querySelectorAll(s));
const joinUrl = (...parts)=>parts.map(p=>String(p).replace(/(^\/|\/$)/g,'')).join('/');


// Глобальное состояние загрузки категории
let currentController = null;   // для отмены предыдущего запроса
let lastReqId = 0;              // чтобы игнорировать «устаревшие» ответы

const setCountLoading = () => { qs('#countInfo').textContent = 'Загрузка…'; };
const setCount = (n) => { qs('#countInfo').textContent = `${n} шт`; };



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

// Иконки категорий
const icons = {
  all: () => `<svg class="icat" viewBox="0 0 24 24"><rect x="4" y="4" width="7" height="7"/><rect x="13" y="4" width="7" height="7"/><rect x="4" y="13" width="7" height="7"/><rect x="13" y="13" width="7" height="7"/></svg>`,
  stamps: () => `<svg class="icat" viewBox="0 0 24 24"><rect x="6" y="6" width="12" height="10"/><circle cx="9" cy="9" r="1"/><circle cx="15" cy="9" r="1"/><line x1="8" y1="14" x2="16" y2="14"/></svg>`,
  ussr_photos: () => `<svg class="icat" viewBox="0 0 24 24"><rect x="5" y="6" width="14" height="12"/><circle cx="12" cy="12" r="2"/><path d="M8 16c1.2-1.6 2.8-2.4 4-2.4s2.8.8 4 2.4"/></svg>`,
  medals: () => `<svg class="icat" viewBox="0 0 24 24"><polyline points="7,4 12,10 17,4"/><circle cx="12" cy="16" r="4"/></svg>`,
  badges: () => `<svg class="icat" viewBox="0 0 24 24"><path d="M12 3l7 3v6c0 4.4-3.6 7.6-7 9-3.4-1.4-7-4.6-7-9V6l7-3z"/></svg>`,
  coins: () => `<svg class="icat" viewBox="0 0 24 24"><circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="3"/></svg>`,
  banknotes: () => `<svg class='icat' viewBox='0 0 24 24'><rect x='3' y='6' width='18' height='12'/><circle cx='12' cy='12' r='3'/></svg>`,
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

// ===== Параметры пагинации / сети =====
const PAGE_SIZE_DESKTOP = 8;
const PAGE_SIZE_MOBILE  = 4;
const BATCH_K_ALL       = 2; // «Все»: по 2 лота с категории

// ===== Lazy-изображения в карточках =====
const HIGH_PRIORITY_BUDGET = 6;
let highPriorityLeft = HIGH_PRIORITY_BUDGET;

const thumbObserver = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (!entry.isIntersecting) continue;
    const img = entry.target;
    const src = img.getAttribute('data-src');
    if (!src) { thumbObserver.unobserve(img); continue; }
    img.src = src;
    img.removeAttribute('data-src');
    img.addEventListener('load', () => img.classList.remove('lazy-img'), { once: true });
    thumbObserver.unobserve(img);
  }
}, { rootMargin: '200px 0px', threshold: 0.01 });

// #############################################################################################
// LIGHTBOX
// #############################################################################################
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

  btnClose.addEventListener('click', closeLightbox);
  backdrop.addEventListener('click', closeLightbox);
  btnPrev.addEventListener('click', () => stepLightbox(-1));
  btnNext.addEventListener('click', () => stepLightbox(+1));

  root.addEventListener('keydown', (e)=>{
    if (e.key === 'Escape') return closeLightbox();
    if (e.key === 'ArrowLeft') return stepLightbox(-1);
    if (e.key === 'ArrowRight') return stepLightbox(+1);
  });

  let sx = 0, sy = 0, moved = false;
  root.addEventListener('touchstart', (e)=>{ const t=e.touches[0]; sx=t.clientX; sy=t.clientY; moved=false; }, {passive:true});
  root.addEventListener('touchmove',  ()=>{ moved=true; }, {passive:true});
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
  document.documentElement.classList.add('lb-lock');
}
function closeLightbox() { if (!lb) return; lb.root.hidden = true; document.documentElement.classList.remove('lb-lock'); }
function stepLightbox(d=1) { const n = lbState.images.length; if (n <= 1) return; lbState.index = (lbState.index + d + n) % n; updateLightbox(true); }
function updateLightbox(preload=true) {
  const { images, index, title } = lbState;
  const url = images[index];
  lb.img.src = url;
  lb.img.alt = `${title ? title + ' — ' : ''}фото ${index+1} из ${images.length}`;
  lb.cap.textContent = `${index+1} / ${images.length}${title ? ' — ' + title : ''}`;
  if (preload && images.length > 1) {
    const a = new Image(); a.src = images[(index+1) % images.length];
    const b = new Image(); b.src = images[(index-1+images.length) % images.length];
  }
}

// #############################################################################################
// MANIFEST (index.json)
// #############################################################################################
const MANIFEST_TTL_MS = 15 * 60 * 1000;
const LS_PREFIX       = 'manifest:';
const manifestRAM     = new Map();

const lsRead  = (k) => { try { const raw = localStorage.getItem(k); return raw ? JSON.parse(raw) : null; } catch { return null; } };
const lsWrite = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };

async function fetchManifest(cat){
  const url = `assets/categories/${encodeURIComponent(cat)}/index.json`;
  const res = await fetch(url, { cache: 'no-cache' });
  if (!res.ok) throw new Error(`no manifest for ${cat}`);
  const data = await res.json();
  data.version = data.version || '';
  return data;
}

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

function entriesFromManifest(cat, manifest){
  const lots = Array.isArray(manifest?.lots) ? manifest.lots : [];
  return lots.map(l => ({
    slug:  l.slug,
    files: Array.isArray(l.files) ? l.files.slice(0,3) : [],
    title: l.title,
    url:   l.url
  }));
}

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

// #############################################################################################
// СЕТЬ/УСТРОЙСТВО
// #############################################################################################
function isMobile() { return matchMedia('(max-width: 859px)').matches; }
function networkLimit() {
  const c = navigator.connection || {};
  if (c.saveData) return 2;
  const t = c.effectiveType || '';
  if (t.includes('2g')) return 2;
  if (t === '3g') return 3;
  return 4;
}

// #############################################################################################
// СОСТОЯНИЕ
// #############################################################################################
let loadSeq = 0;

// помним последнюю выбранную категорию
let key_name = 'all';

const galleryState = {
  key: null,            // 'all' или <category>
  mode: 'single',       // 'single' | 'all'
  version: '',          // из манифеста (для ?v=)
  entries: [],          // записи (для single)
  page: 0,
  pageSize: isMobile() ? PAGE_SIZE_MOBILE : PAGE_SIZE_DESKTOP,
  allPacks: null,       // [{cat, version, entries, cursor}]
  allLimit: BATCH_K_ALL
};

function resetGalleryState() {
  galleryState.page = 0;
  galleryState.entries = [];
  galleryState.version = '';
  galleryState.allPacks = null;
}

// #############################################################################################
// СБОРЩИКИ ПАРТИЙ
// #############################################################################################
function getSingleBatch() {
  const from = galleryState.page * galleryState.pageSize;
  const to   = Math.min(from + galleryState.pageSize, galleryState.entries.length);
  return galleryState.entries.slice(from, to);
}

function getAllBatch() {
  const packs = galleryState.allPacks || [];
  const out = [];
  for (const p of packs) {
    const from = p.cursor;
    const to   = Math.min(from + galleryState.allLimit, p.entries.length);
    const slice = p.entries.slice(from, to);
    out.push(...slice.map(e => ({ ...e, _cat: p.cat, _version: p.version })));
    p.cursor = to;
  }
  const hasMore = packs.some(p => p.cursor < p.entries.length);
  return { items: out, hasMore };
}

function hasMoreSingle() {
  const nextFrom = (galleryState.page + 1) * galleryState.pageSize;
  return nextFrom < galleryState.entries.length;
}

// #############################################################################################
// ПРЕФЕТЧ
// #############################################################################################
function prefetchImages(urls, limit = networkLimit()) {
  const c = navigator.connection || {};
  if (c.saveData) return;
  const t = c.effectiveType || '';
  if (t.includes('2g')) return;

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

// #############################################################################################
// РЕНДЕР ПАРТИИ (без fallback-веток)
// #############################################################################################
async function renderNextBatch(mySeq) {
  const wrap = qs('#cards');
  const seen = new Set(Array.from(wrap.children).map(n => n.dataset?.uid));

  let batch = [];
  let hasMore = false;

  if (galleryState.mode === 'single') {
    const entries = getSingleBatch();
    batch = entries.map(e => lotFromEntry(galleryState.key, e, galleryState.version));
    hasMore = hasMoreSingle();
  } else {
    const { items, hasMore: hm } = getAllBatch();
    batch = items.map(e => lotFromEntry(e._cat, e, e._version));
    hasMore = hm;
  }

  for (const lot of batch) {
    if (mySeq !== loadSeq) return;
    const uid = lot.id || `${lot.category}/${lot.title}`;
    if (seen.has(uid)) continue;
    const el = cardEl(lot);
    el.dataset.uid = uid;
    wrap.appendChild(el);
    qs('#countInfo').textContent = `${wrap.children.length} шт`;
  }

  if (mySeq === loadSeq) {
    qs('#countInfo').textContent = `${wrap.children.length} шт`;
  }

  const btn = qs('#loadMore');
  if (hasMore) btn.removeAttribute('disabled'); else btn.setAttribute('disabled', '');

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

// Кнопка «Показать ещё»
qs('#loadMore')?.addEventListener('click', () => {
  const mySeq = loadSeq;
  galleryState.page++;
  renderNextBatch(mySeq);
});

// #############################################################################################
// САЙДБАР КАТЕГОРИЙ (без изменений)
// #############################################################################################
function renderCategories(){
  const list = qs('#catList');
  list.innerHTML = '';
  categories.forEach((c) =>{
    const li = document.createElement('li');
    li.innerHTML = `
      <button class="catbtn ${c.key==='all' ? 'active':''}" data-cat="${c.key}" aria-pressed="${c.key==='all'}">
        <div class="icobox">${(icons[c.key]||icons.none)()}</div>
        <span class="catlabel">${c.label}</span>
      </button>`;
    list.appendChild(li);
  });

  qsa('#catList .catbtn').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      // переключаем активную кнопку
      qsa('#catList .catbtn').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');

      // грузим только если категория реально поменялась
      const key = btn.getAttribute('data-cat');
      if (key !== key_name) {
        key_name = key;
        applyFilter(key);
      }

      // СКРЫТИЕ САЙДБАРА НА МОБИЛЕ (и анти-залипание hover на десктопе)
      const sb = document.querySelector('.sidebar');
      if (sb) {
        // всегда ставим no-hover сразу после клика
        sb.classList.add('no-hover');

        // на десктопе быстро снимаем, чтобы hover снова работал
        if (!isMobile()) {
          setTimeout(() => sb.classList.remove('no-hover'), 320);
        }
        // на мобиле оставляем no-hover — панель «схлопывается» после выбора
        // (если захочешь — можно добавить свою кнопку, которая снимает класс)
      }

      // скроллим наверх
      document.querySelector('.sidewrap')?.scrollTo({ top: 0, behavior: 'smooth' });
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    });
  });
}

// #############################################################################################
// СБОРКА КАРТОЧКИ
// #############################################################################################
function escapeHtml(s=''){ 
  return String(s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}

function cardEl(lot){
  const title = escapeHtml(lot.title || '');
  const imgs  = Array.isArray(lot.images) ? lot.images.slice(0,3) : [];
  const el = document.createElement('article');
  el.className = 'card';

  const eager = (highPriorityLeft-- > 0);
  const loadingAttr = eager ? 'eager' : 'lazy';

  el.innerHTML = `
    <div class="photos">
      <div class="mainimg"><img class="cover" loading="${loadingAttr}" decoding="async" alt="${title}" src="${(imgs[0]||ph(800,600,'Фото'))}"></div>
      <div class="thumbs">
        <div class="thumb"><img class="lazy-img" loading="${loadingAttr}" decoding="async" alt="${title}" src="${(imgs[1]||imgs[0]||ph(400,400,'Фото'))}"></div>
        <div class="thumb"><img class="lazy-img" loading="${loadingAttr}" decoding="async" alt="${title}" src="${(imgs[2]||imgs[0]||ph(400,400,'Фото'))}"></div>
      </div>
    </div>
    <div class="card-body">
      <h3 class="title">${title}</h3>
      <div class="meta">Категория: <span class="muted">${lot.category}</span></div>
      <a class="more" href="${lot.url || '#'}" target="_blank" rel="noopener">
        <span class="span-correct">Подробнее</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
      </a>
    </div>`;

  const coverEl = qs('.cover', el);
  coverEl?.addEventListener('click', () => openLightbox(imgs, 0, title));
  const thumbEls = qsa('.thumb', el);
  thumbEls[0]?.addEventListener('click', () => openLightbox(imgs, 1, title));
  thumbEls[1]?.addEventListener('click', () => openLightbox(imgs, 2, title));

  qsa('.lazy-img', el).forEach(img => thumbObserver.observe(img));
  return el;
}

// #############################################################################################
// ПРИМЕНЕНИЕ ФИЛЬТРА (Только manifest; без fallback сканера)
// #############################################################################################
async function applyFilter(key){
  const wrap = qs('#cards');
  const mySeq = ++loadSeq;
  wrap.innerHTML = '';
  qs('#countInfo').textContent = 'Загрузка…';
  resetGalleryState();

  galleryState.key  = key;
  galleryState.mode = (key === 'all') ? 'all' : 'single';
  const btn = qs('#loadMore');
  btn?.setAttribute('disabled','');

  if (galleryState.mode === 'single') {
    try {
      const mf = await loadManifest(key);
      galleryState.version = mf.version || '';
      galleryState.entries = entriesFromManifest(key, mf);
    } catch {
      // Нет манифеста — считаем категорию пустой
      galleryState.version = '';
      galleryState.entries = [];
      qs('#countInfo').textContent = '0 шт'; // можно добавить эту строку
    }
    galleryState.page = 0;
    renderNextBatch(mySeq);
  } else {
    const cats = categories.filter(c => c.key !== 'all');
    const packs = await Promise.all(cats.map(async c => {
      try {
        const mf = await loadManifest(c.key);
        return { cat: c.key, version: mf.version || '', entries: entriesFromManifest(c.key, mf), cursor: 0 };
      } catch {
        return { cat: c.key, version: '', entries: [], cursor: 0 };
      }
    }));
    galleryState.allPacks = packs;
    galleryState.page = 0;
    renderNextBatch(mySeq);
  }
}

// #############################################################################################
// ИНИЦИАЛИЗАЦИЯ
// #############################################################################################
renderCategories();
applyFilter('all');
// setTimeout(() => { if(qs('#countInfo').textContent === 'Загрузка…') { qs('#countInfo').textContent = '0 шт'; } }, 5000);