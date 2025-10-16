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


    // ####################################    

    // <link rel="icon" href="assets/icon_site_3.png" type="image/png"> + текстовое название в .txt
    // Демо-данные (замените на реальные лоты)
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
    const PAGE_SIZE = 12;
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
        });
      });
    }

    function applyFilter(key){
      filtered = key==='all' ? [...lots] : lots.filter(l => l.category === key);
      page = 0;
      key_name = key
      $('#cards').innerHTML = '';
      updateCount();
      renderNext();

      categories.forEach((c, idx) =>{
        if (c.key === key){
          $('#nameCat').textContent = `${c.label}`;
        }
      })
    }

    function updateCount(){
      $('#countInfo').textContent = `${filtered.length} лотов`;
    }
    // ####################################

    
    // ####################################
    // Рендер пачки карточек
    function renderNext(){
      const from = page * PAGE_SIZE;
      const to = Math.min(from + PAGE_SIZE, filtered.length);
      const slice = filtered.slice(from, to);
      const wrap = $('#cards');

      slice.forEach(lot => wrap.appendChild(cardEl(lot)));

      page++;
      const more = $('#loadMore');
      if(page * PAGE_SIZE >= filtered.length){
        more.setAttribute('disabled', '');
      } else {
        more.removeAttribute('disabled');
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


    // Инициализация
    renderCategories();
    updateCount();
    renderNext();
    $('#loadMore').addEventListener('click', renderNext);
// ##########################################################################
