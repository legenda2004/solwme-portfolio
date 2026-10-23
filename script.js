/**
 * Интеграция с Google Диском для сайта Александры (Саня Солвми)
 * Папка: https://drive.google.com/drive/folders/1jPSdn-z-C3uglhDuXSXQu9N7Ah3v98gz
 */

document.addEventListener("DOMContentLoaded", () => {
  const videoGrid = document.getElementById("videoFeed");
  const filterPills = document.querySelectorAll(".filter-pill");
  const navTabs = document.querySelectorAll(".nav-tab");
  const creatorAvatar = document.getElementById("creatorAvatar");

  // Контейнеры скриншотов соцсетей
  const tgScreensContainer = document.getElementById("tgScreensContainer");
  const instaScreensContainer = document.getElementById("instaScreensContainer");
  const ttScreensContainer = document.getElementById("ttScreensContainer");

  // Модальное окно Lightbox
  const lightboxModal = document.getElementById("lightboxModal");
  const lightboxBody = document.getElementById("lightboxBody");
  const lightboxClose = document.getElementById("lightboxClose");
  const lightboxBackdrop = document.getElementById("lightboxBackdrop");

  let allMedia = [];

  // 1. Плавная анимация навигации в шапке (Обо мне, Работы, Контакты)
  navTabs.forEach((tab) => {
    tab.addEventListener("click", (e) => {
      navTabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
    });
  });

  // Отслеживание скролла для автоматической смены активного таба
  const sections = document.querySelectorAll("section[id]");
  window.addEventListener("scroll", () => {
    let current = "";
    const scrollY = window.pageYOffset;

    sections.forEach((section) => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 120;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute("id");
      }
    });

    navTabs.forEach((tab) => {
      tab.classList.remove("active");
      if (tab.getAttribute("href") === `#${current}`) {
        tab.classList.add("active");
      }
    });
  }, { passive: true });

  // 2. Управление Lightbox
  function openLightbox(htmlContent) {
    lightboxBody.innerHTML = htmlContent;
    lightboxModal.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    lightboxModal.classList.remove("active");
    lightboxBody.innerHTML = "";
    document.body.style.overflow = "";
  }

  if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
  if (lightboxBackdrop) lightboxBackdrop.addEventListener("click", closeLightbox);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightboxModal.classList.contains("active")) {
      closeLightbox();
    }
  });

  // 3. Загрузка данных из videos.json
  async function loadData() {
    try {
      const res = await fetch(`videos.json?t=${Date.now()}`);
      if (res.ok) {
        const data = await res.json();

        // Обновляем аватарку
        if (data.avatarUrl && creatorAvatar) {
          creatorAvatar.src = data.avatarUrl;
        }

        // Рендерим скриншоты соцсетей (tg1/tg2, inst1..4, tiktok1/2)
        if (data.socialScreenshots) {
          renderSocialScreens(data.socialScreenshots);
        }

        allMedia = Array.isArray(data) ? data : (data.items || []);
        renderFeed(allMedia);
      }
    } catch (e) {
      console.warn("videos.json fetch error:", e);
    }
  }

  // Рендер скриншотов в карточках соцсетей
  function renderSocialScreens(screens) {
    if (tgScreensContainer && screens.tg) {
      tgScreensContainer.innerHTML = screens.tg.map((s) => `
        <div class="screen-thumb-box" data-full="${s.url}">
          <img src="${s.url}" alt="Telegram статистика" class="screen-thumb-img" loading="lazy">
        </div>
      `).join("");
    }

    if (instaScreensContainer && screens.insta) {
      instaScreensContainer.innerHTML = screens.insta.map((s) => `
        <div class="screen-thumb-box" data-full="${s.url}">
          <img src="${s.url}" alt="Instagram статистика" class="screen-thumb-img" loading="lazy">
        </div>
      `).join("");
    }

    if (ttScreensContainer && screens.tiktok) {
      ttScreensContainer.innerHTML = screens.tiktok.map((s) => `
        <div class="screen-thumb-box" data-full="${s.url}">
          <img src="${s.url}" alt="TikTok статистика" class="screen-thumb-img" loading="lazy">
        </div>
      `).join("");
    }

    // Клик по любому скриншоту открывает его в полном размере
    document.querySelectorAll(".screen-thumb-box").forEach((box) => {
      box.addEventListener("click", () => {
        const fullUrl = box.getAttribute("data-full");
        openLightbox(`<img src="${fullUrl}" class="lightbox-img" alt="Статистика">`);
      });
    });
  }

  // 4. Рендер основной сетки работ
  function renderFeed(items) {
    videoGrid.innerHTML = "";

    if (!items || items.length === 0) {
      videoGrid.innerHTML = `
        <div class="empty-feed-placeholder" style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
          <div class="empty-feed-spinner" style="margin: 0 auto 16px auto;"></div>
          <p class="empty-feed-text" style="color: var(--text-muted); font-size: 1rem;">
            Работы синхронизируются с Google Диском...
          </p>
        </div>
      `;
      return;
    }

    items.forEach((item) => {
      const card = document.createElement("article");
      card.className = "reel-card";
      card.setAttribute("data-id", item.id);
      card.setAttribute("data-category", item.category);

      const isImage = item.type === "image";

      if (isImage) {
        // Карточка фото / дизайна (без номера, без технического имени файла)
        card.innerHTML = `
          <div class="card-image-box" data-full="${item.thumbnailUrl || item.streamUrl}">
            <img src="${item.thumbnailUrl || item.streamUrl}" alt="Дизайн" class="card-img-preview" loading="lazy">
            <div class="card-img-overlay">
              <span class="view-zoom-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  <line x1="11" y1="8" x2="11" y2="14"></line>
                  <line x1="8" y1="11" x2="14" y2="11"></line>
                </svg>
              </span>
            </div>
          </div>
        `;

        card.querySelector(".card-image-box").addEventListener("click", () => {
          openLightbox(`<img src="${item.thumbnailUrl || item.streamUrl}" class="lightbox-img" alt="Дизайн">`);
        });

      } else {
        // Карточка видео 9:16 со стабильным постером
        card.innerHTML = `
          <div class="reel-player-box" data-preview="${item.previewUrl}">
            <img src="${item.thumbnailUrl}" alt="Видео Reels" class="reel-video-poster" loading="lazy">
            
            <div class="reel-play-overlay">
              <div class="reel-play-btn-circle">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="6 4 20 12 6 20 6 4"></polygon>
                </svg>
              </div>
            </div>
          </div>
        `;

        // Клик по видео открывает полноэкранный чистый просмотр в Lightbox без мерцания и релоадов
        card.querySelector(".reel-player-box").addEventListener("click", () => {
          openLightbox(`
            <div class="lightbox-video-wrap">
              <iframe 
                class="lightbox-iframe" 
                src="${item.previewUrl}" 
                allow="autoplay; encrypted-media; fullscreen" 
                allowfullscreen>
              </iframe>
            </div>
          `);
        });
      }

      videoGrid.appendChild(card);
    });
  }

  // 5. Фильтрация по категориям (Рестораны, Рекламные, SMM, UGC, Дизайн, Атмосфера)
  filterPills.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterPills.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.getAttribute("data-filter");
      if (filter === "all") {
        renderFeed(allMedia);
      } else {
        const filtered = allMedia.filter((item) => item.category === filter);
        renderFeed(filtered);
      }
    });
  });

  loadData();
});
