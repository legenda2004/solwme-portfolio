/**
 * Интеграция с Google Диском для сайта Александры (Саня Солвми)
 * Поддержка пагинации (по 8 карточек + кнопка "Показать ещё"),
 * точного распределения SMM-кейсов (Цветочная студия, Арт-студия)
 * и чередования скринов и видео.
 */

document.addEventListener("DOMContentLoaded", () => {
  const videoGrid = document.getElementById("videoFeed");
  const filterPills = document.querySelectorAll(".filter-pill");
  const navTabs = document.querySelectorAll(".nav-tab");
  const creatorAvatar = document.getElementById("creatorAvatar");
  const loadMoreWrapper = document.getElementById("loadMoreWrapper");
  const loadMoreBtn = document.getElementById("loadMoreBtn");
  const smmShowcaseContainer = document.getElementById("smmShowcaseContainer");

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
  let currentFilteredList = [];
  let displayedCount = 8;
  const STEP_SIZE = 8;
  let currentCategory = "all";

  // 1. Плавная навигация в шапке (Обо мне, Работы, Контакты)
  navTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      navTabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
    });
  });

  // Отслеживание скролла (ScrollSpy)
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

  // 2. Lightbox
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

        // Рендерим скриншоты соцсетей
        if (data.socialScreenshots) {
          renderSocialScreens(data.socialScreenshots);
        }

        allMedia = Array.isArray(data) ? data : (data.items || []);
        applyFilter(currentCategory);
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

    document.querySelectorAll(".screen-thumb-box").forEach((box) => {
      box.addEventListener("click", () => {
        const fullUrl = box.getAttribute("data-full");
        openLightbox(`<img src="${fullUrl}" class="lightbox-img" alt="Статистика">`);
      });
    });
  }

  // 4. Умное чередование: видео и скриншоты в гармоничном порядке
  function balanceMedia(items) {
    const videos = items.filter(i => i.type === "video");
    const images = items.filter(i => i.type === "image");
    
    if (videos.length > 0 && images.length > 0) {
      const balanced = [];
      let vIdx = 0, iIdx = 0;
      while (vIdx < videos.length || iIdx < images.length) {
        if (vIdx < videos.length) balanced.push(videos[vIdx++]);
        if (iIdx < images.length) balanced.push(images[iIdx++]);
      }
      return balanced;
    }
    return items;
  }

  // 5. Показ структурированного блока для вкладки SMM (точная группировка по запросу)
  function renderSmmShowcase(items) {
    // 1. Исключаем удаленное видео 1BHkmpFGARbGs_CEHDzeMPn9YodEO8bc-
    const filteredSmm = items.filter(i => i.id !== '1BHkmpFGARbGs_CEHDzeMPn9YodEO8bc-');

    // Назначенные ID для Кейса #2 (Мастер-класс / Арт-студия)
    // 1eZlmChr0qemxi-Cx_d3_OJcUORMSzDT5, 1MKsRlBWpBUFSoBAnWZwqBkTF4GZwZMgQ, 1ARNS4PL9JqHACkuY92VFftWmuubaUl6x
    const case2TargetIds = new Set([
      '1eZlmChr0qemxi-Cx_d3_OJcUORMSzDT5',
      '1MKsRlBWpBUFSoBAnWZwqBkTF4GZwZMgQ',
      '1ARNS4PL9JqHACkuY92VFftWmuubaUl6x',
      // также родные видео и фото арт-вечеринок
      '1QJYGhp9VjrAXKXFVyOsDgOXtptViTW0-',
      '1nrwnz70BgnVpIYg7zMoHQB-grm2CgXEs',
      '1GbYf9gMX-A6Nmgw-7nC942soWB3-X5V2',
      '1Bfr160SHRwaC0J_9BmmPD2dIRqzEP3NC',
      '1xgOchHLc0n0m0ouB-aQ35gCeZu9THYUi',
      '1Ph6DxEGsxhvFRTrxGJ2VFpJVtjgyLteu',
      '1EGIyH1B3ECr-oPueGHTyVc9e5WztcJ8P',
      '148wCuzCt8JoqHADD4GOUBHT4Q4nqysF0',
      '15y_POKdscBCzxLjd_uoLQ5s22iF6X_Zh'
    ]);

    // Назначенные ID для Кейса #1 (Цветочная студия)
    // включая перенесенные 1t6gM0yJgFf0q0TY7Pu-v4XwSg8aWrF0K и 1TUqrTmWM3G-w7Kk2JCMfSX2SBALno0GI
    const case1Items = filteredSmm.filter(i => !case2TargetIds.has(i.id));
    const case2Items = filteredSmm.filter(i => case2TargetIds.has(i.id));

    const flowerImages = case1Items.filter(i => i.type === 'image');
    const flowerVideos = case1Items.filter(i => i.type === 'video');

    const artImages = case2Items.filter(i => i.type === 'image');
    const artVideos = case2Items.filter(i => i.type === 'video');

    smmShowcaseContainer.style.display = "block";
    smmShowcaseContainer.innerHTML = `
      <!-- Кейс 1: Цветочная студия -->
      <div class="smm-case-block">
        <div class="smm-case-header">
          <div class="smm-case-tag">SMM-кейс #1</div>
          <h3 class="smm-case-title">Комплексное ведение цветочной студии</h3>
          <p class="smm-case-desc">Упаковка профиля, разработка визуальной концепции «до / после», дизайн рекламных буклетов и серия атмосферных Reels.</p>
        </div>

        <div class="smm-split-grid">
          <div class="smm-split-col">
            <h4 class="smm-col-title">Дизайн, оформление и сторис</h4>
            <div class="smm-col-items">
              ${flowerImages.map(img => `
                <div class="reel-card" data-full="${img.thumbnailUrl}">
                  <div class="card-image-box">
                    <img src="${img.thumbnailUrl}" alt="${img.title}" class="card-img-preview" loading="lazy">
                  </div>
                </div>
              `).join("")}
            </div>
          </div>

          <div class="smm-split-col">
            <h4 class="smm-col-title">Вертикальные видео (Reels)</h4>
            <div class="smm-col-items">
              ${flowerVideos.map(vid => `
                <div class="reel-card" data-preview="${vid.previewUrl}">
                  <div class="reel-player-box">
                    <img src="${vid.thumbnailUrl}" alt="Видео" class="reel-video-poster" loading="lazy">
                    <div class="reel-play-overlay">
                      <div class="reel-play-btn-circle">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                          <polygon points="6 4 20 12 6 20 6 4"></polygon>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              `).join("")}
            </div>
          </div>
        </div>
      </div>

      <!-- Кейс 2: Арт-студия, мастер-классы и арт-вечеринки -->
      <div class="smm-case-block">
        <div class="smm-case-header">
          <div class="smm-case-tag">SMM-кейс #2</div>
          <h3 class="smm-case-title">Продвижение арт-студии и мастер-классов</h3>
          <p class="smm-case-desc">Создание ярких афиш мероприятий, анонсы мастер-классов в сторис и динамичные ролики процесса творчества.</p>
        </div>

        <div class="smm-split-grid">
          <div class="smm-split-col">
            <h4 class="smm-col-title">Афиши и графика</h4>
            <div class="smm-col-items">
              ${artImages.map(img => `
                <div class="reel-card" data-full="${img.thumbnailUrl}">
                  <div class="card-image-box">
                    <img src="${img.thumbnailUrl}" alt="${img.title}" class="card-img-preview" loading="lazy">
                  </div>
                </div>
              `).join("")}
            </div>
          </div>

          <div class="smm-split-col">
            <h4 class="smm-col-title">Reels с мастер-классов</h4>
            <div class="smm-col-items">
              ${artVideos.map(vid => `
                <div class="reel-card" data-preview="${vid.previewUrl}">
                  <div class="reel-player-box">
                    <img src="${vid.thumbnailUrl}" alt="Видео" class="reel-video-poster" loading="lazy">
                    <div class="reel-play-overlay">
                      <div class="reel-play-btn-circle">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                          <polygon points="6 4 20 12 6 20 6 4"></polygon>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              `).join("")}
            </div>
          </div>
        </div>
      </div>
    `;

    // Привязываем Lightbox к элементам SMM кейсов
    smmShowcaseContainer.querySelectorAll(".reel-card[data-full]").forEach(card => {
      card.addEventListener("click", () => {
        const fullUrl = card.getAttribute("data-full");
        openLightbox(`<img src="${fullUrl}" class="lightbox-img" alt="Кейс">`);
      });
    });

    smmShowcaseContainer.querySelectorAll(".reel-card[data-preview]").forEach(card => {
      card.addEventListener("click", () => {
        const previewUrl = card.getAttribute("data-preview");
        openLightbox(`
          <div class="lightbox-video-wrap">
            <iframe class="lightbox-iframe" src="${previewUrl}" allow="autoplay; encrypted-media; fullscreen" allowfullscreen></iframe>
          </div>
        `);
      });
    });
  }

  // 6. Рендер основной сетки работ (по 8 карточек за раз)
  function renderFeed(items, append = false) {
    if (!append) {
      videoGrid.innerHTML = "";
    }

    if (!items || items.length === 0) {
      videoGrid.innerHTML = `
        <div class="empty-feed-placeholder" style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
          <div class="empty-feed-spinner" style="margin: 0 auto 16px auto;"></div>
          <p class="empty-feed-text" style="color: var(--text-muted); font-size: 1rem;">
            В этой категории пока нет загруженных работ.
          </p>
        </div>
      `;
      loadMoreWrapper.style.display = "none";
      return;
    }

    const toRender = items.slice(append ? displayedCount - STEP_SIZE : 0, displayedCount);

    toRender.forEach((item) => {
      const card = document.createElement("article");
      card.className = "reel-card";
      card.setAttribute("data-id", item.id);
      card.setAttribute("data-category", item.category);

      const isImage = item.type === "image";

      if (isImage) {
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

    // Управление кнопкой "Показать ещё"
    if (displayedCount < items.length) {
      loadMoreWrapper.style.display = "flex";
      loadMoreBtn.querySelector("span").textContent = `Показать ещё (${items.length - displayedCount} ост.)`;
    } else {
      loadMoreWrapper.style.display = "none";
    }
  }

  // Обработчик кнопки "Показать ещё"
  loadMoreBtn.addEventListener("click", () => {
    displayedCount += STEP_SIZE;
    renderFeed(currentFilteredList, true);
  });

  // 7. Фильтрация
  function applyFilter(category) {
    currentCategory = category;
    displayedCount = 8;

    let filtered = [];
    if (category === "all") {
      filtered = balanceMedia(allMedia);
      smmShowcaseContainer.style.display = "none";
      videoGrid.style.display = "grid";
    } else if (category === "smm") {
      filtered = allMedia.filter(i => i.category === "smm");
      renderSmmShowcase(filtered);
      videoGrid.style.display = "none";
      loadMoreWrapper.style.display = "none";
      return;
    } else {
      filtered = balanceMedia(allMedia.filter(i => i.category === category));
      smmShowcaseContainer.style.display = "none";
      videoGrid.style.display = "grid";
    }

    currentFilteredList = filtered;
    renderFeed(currentFilteredList, false);
  }

  filterPills.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterPills.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.getAttribute("data-filter");
      applyFilter(filter);
    });
  });

  loadData();
});
