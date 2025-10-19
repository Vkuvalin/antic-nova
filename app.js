// ############################### JAVASCRIPT ###############################

  window.addEventListener("load", () => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  });

  
  document.querySelectorAll('.article-collapsible').forEach(h2 => {
    h2.addEventListener('click', () => {
      h2.classList.toggle('active');
      const content = h2.nextElementSibling;
      if (!content) return;
      // плавное раскрытие (если нужно)
      if (content.style.maxHeight) {
        content.style.maxHeight = null;
      } else {
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });

  const buttons = document.querySelectorAll('.instruction');
  buttons.forEach( button => {
    button.addEventListener("click", () => {
      const target = button.getAttribute("data-tab");
      showSection(target);
    });
  });

// ############################################################################################# ТОП БАР



// ############################### Обработчик навигации (tabs)
const tabs = document.querySelectorAll('.tab');                       // 1) Получаем все табы и контент-секции

// 2) Общий обработчик клика
function onTabClick(event) {
  const targetTab = event.currentTarget;
  tabs.forEach(tab => tab.classList.remove('active'));                // 2.1) Деактивируем все табы и контенты
  targetTab.classList.add('active');                                  // 2.2) Активируем кликнутый таб и соответствующий контент
}
tabs.forEach(tab => { tab.addEventListener('click', onTabClick); });  // 3) Навешиваем один раз
// ###############################


// ############################### НАВИГАЦИЯ
  /* ╔══════════  GAMBURGER & MOBILE MENU  ══════════╗ */
  const burger      = document.querySelector('.burger');
  const mobileMenu  = document.getElementById('mobileMenu');

  burger.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
  });

  // Делегируем клики по пунктам
  mobileMenu.addEventListener('click', (e) => {
    const link = e.target.closest('.mobile-link');
    if (!link) return;
    mobileMenu.classList.remove('active');

    const target = link.dataset.tab;
    history.pushState({ tab: target }, '', `#${target}`);
    showSection(target);
  });

  // Закрытие при ресайзе > 768px
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) mobileMenu.classList.remove('active');
  });
// ###############################



// ############################### HISTORY API
// 🔹 Отображение секции
function showSection(id) {
  // 1. Снимаем активность
  document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
  document.querySelectorAll(".section").forEach(s => s.classList.remove("active"));

  // 2. Устанавливаем активный таб и секцию
  const isGPTSection = /^gpt\d+$/.test(id); // ← если это одна из gpt-секций

  // Если это gpt1–gpt10, активируем tab "guide"
  const activeTab = isGPTSection ? "guide" : id;

  document.querySelector(`.tab[data-tab="${activeTab}"]`)?.classList.add("active");
  document.getElementById(id)?.classList.add("active");

  // 3. Обновляем localStorage
  localStorage.setItem("activeTab", id);
}

// 🔹 Поддержка клика по вкладке → история
tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    const target = tab.getAttribute("data-tab");
    history.pushState({ tab: target }, "", `#${target}`);
    showSection(target);
  });
});

// 🔹 Поддержка Back/Forward
window.addEventListener("popstate", (event) => {
  const tab = event.state?.tab || "home";
  showSection(tab);
});

// 🗄️ Восстановление сохранённой вкладки
const savedTab = localStorage.getItem("activeTab");

// 🔹 Начальное состояние (если зашли с #вкладкой или через сохранённую)
const initialTab = window.location.hash?.substring(1) || savedTab || "home";
history.replaceState({ tab: initialTab }, "", `#${initialTab}`);
showSection(initialTab);
// ###############################
// #############################################################################################

	
	
//  ############################################################################################# АНИМАЦИИ
// ############################### Функция создания пульсирующего кружка
function createPulseCircle() {
  const circle = document.createElement("div");
  circle.classList.add("pulse-circle");

  // 🎨 Случайный цвет из переменных
  const colors = [
    "--color-research", "--color-creative",
    "--color-education", "--color-meta",
    "--color-strategy"
  ];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  circle.style.color = getComputedStyle(document.documentElement)
                        .getPropertyValue(randomColor);

  // 📍 Случайная позиция по экрану
  const x = Math.random() * window.innerWidth;
  const y = Math.random() * window.innerHeight;
  circle.style.left = `${x}px`;
  circle.style.top  = `${y}px`;

  // ➕ Добавляем в слой
  document.getElementById("pulse-layer").appendChild(circle);

  // 🧹 Удаляем после завершения анимации
  setTimeout(() => circle.remove(), 3600);
}
// ###############################


// ############################### Функция создания анимированной линии
function createAnimatedLine() {
  const colors = [
    "#00fbfa", "#0023db", "#fc3fe6", "#2ff7bb", "#fcfc32",
    "#2bd0f7", "#4dfc95", "#fc2f3c", "#fb9209", "#7e6dc9"
  ];
  const pulseLayer = document.getElementById("pulse-layer");

  // 1) Параметры линии
  const length   = 20 + Math.random() * 50;
  const distance = 100;
  const angle    = Math.random() * 360;

  // 2) Случайная точка старта
  const x0 = Math.random() * window.innerWidth;
  const y0 = Math.random() * window.innerHeight;

  // 3) Обёртка с поворотом
  const wrapper = document.createElement("div");
  wrapper.className = "pulse-line-wrapper";
  wrapper.style.left      = `${x0}px`;
  wrapper.style.top       = `${y0}px`;
  wrapper.style.transform = `rotate(${angle}deg)`;

  // 4) Собственно линия
  const line = document.createElement("div");
  line.className = "pulse-line";
  line.style.setProperty("--length",   `${length}px`);
  line.style.setProperty("--distance", `${distance}px`);
  line.style.backgroundColor = colors[
    Math.floor(Math.random() * colors.length)
  ];

  // 5) Вставляем и удаляем
  wrapper.appendChild(line);
  pulseLayer.appendChild(wrapper);
  setTimeout(() => pulseLayer.removeChild(wrapper), 2000);
}
//  ###############################


// ############################### Генераторы через requestAnimationFrame
function startCircleGenerator() {
  let lastTs = 0;
  let nextDelay = 300 + Math.random() * 500;

  function loop(timestamp) {
    if (!lastTs) lastTs = timestamp;
    if (timestamp - lastTs >= nextDelay) {
      if (Math.random() < 0.5) {
        createPulseCircle();
      }
      nextDelay = 300 + Math.random() * 500;
      lastTs = timestamp;
    }
    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);
}

function startLineGenerator() {
  let lastTs = 0;
  const interval = 600;

  function loop(timestamp) {
    if (!lastTs) lastTs = timestamp;
    if (timestamp - lastTs >= interval) {
      createAnimatedLine();
      lastTs = timestamp;
    }
    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);
}
// ###############################


// ############################### Подключение анимаций Кружки/Линии в зависимости от интернета

document.addEventListener('DOMContentLoaded', () => {
  // 1. Читаем информацию о соединении
  const conn      = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  const type      = conn?.type;               // 'wifi', 'cellular', ...
  const effective = conn?.effectiveType;      // 'slow-2g', '2g', '3g', '4g'
  const saveData  = conn?.saveData || false;  // true, если включён Data Saver

  // 2. Вычисляем флаг «быстрой» сети
  const isFastNetwork = (type === 'wifi' || (effective === '4g' && !saveData));

  if (isFastNetwork) {
    setTimeout(() => {
      startCircleGenerator();
      startLineGenerator();
    }, 5000);
  } else {
    // Экономный режим. Можно настроить. Пока не актуально.
  }
});

// ###############################
//  #############################################################################################
