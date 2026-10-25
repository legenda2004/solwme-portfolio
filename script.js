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
  const ugcShowcaseContainer = document.getElementById("ugcShowcaseContainer");

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

  // Сортировка по явному списку ID (для commercial и ugc)
  function sortByIdOrder(items, orderedIds) {
    const idMap = new Map(items.map(i => [i.id, i]));
    const result = [];
    orderedIds.forEach(id => {
      if (idMap.has(id)) result.push(idMap.get(id));
    });
    // оставшиеся (не вошедшие в список) добавить в конец
    const usedIds = new Set(orderedIds);
    items.forEach(i => { if (!usedIds.has(i.id)) result.push(i); });
    return result;
  }

  // Явный порядок для вкладки «Рекламные»
  const COMMERCIAL_ORDER = [
    '12YkQPfVBACFUk8wAACAojcjKQmJ5_nx2', // IMG_6349
    '1D472WsJcob16YlzshoPZ_no62756cpPI', // IMG_6399
    '1cik5pFMlKM_vBXqGDZM72VdBba8k6NtU', // photo_2026-10-23_15-09-19
    '1TxqMxKNhAwwDRXpy9-VbU6G9yA54Suvu', // photo_2026-10-23_15-09-21
    '11p_aHRoBtlYzQiWIwRhEPgWrleh8gehr', // IMG_8433
    '18rVzjdLchlZ6Ok-TcC6AYRHNkfjHhdot', // photo_2026-10-23_14-59-32
    '1woUqi1tYoNH_LUQ5DMMlSdtgH9munONj', // IMG_0229
    '1bCPd7qCXMsgOPay5BfVf5xgvmbdO47z_', // IMG_0091
    '1Un5VBGXpCZN6t9kPXQK9b8985i-dUIj3', // photo_2026-10-23_14-59-49
    '1qghUU70qgH2vJLjz3RoBsnhkHU2HqvF2', // IMG_1354
    '1Aa1w_hVMq09BbP43rYG2I0QRI4eO3l0g', // photo_2026-10-23_15-00-03
    '1nA4RDzGPmA8D8rbl06HMTbGMTrsGlmlM', // IMG_1365
    '1AD1XV5R1T4S7aHl0EUMIOIm6ZQYUBlv1', // photo_2026-10-23_15-00-10
    '1ru999KhpgUvznIobH4BQmw0cEmSFiyeE', // IMG_1787
    '1G4KEKYaUZuKuHCVkzZ54qDVd73ldndb2', // photo_2026-10-23_15-00-20
    '1k2tbBEFx4EuviOrfC761jDJASKGa9Mc7', // IMG_5441
    '1d-vWGbIpjlcAD6hdllwIPwfDE4X48a-u', // photo_2026-10-23_15-00-27
    '1-j6uHrP0vG_mIN7dV2fhQrZerXKpejBP', // IMG_5714
    '1XEHvFoDcwnJdZ-3-70ZppH_hH-_u29O4', // photo_2026-10-23_15-00-34
    '1YtfhXr0L_kxBvue1Gbu6dtySV-C24H0Q', // IMG_6693
    '1N9MfgMCsNBSKUUAisd5C8EkwgWmGMlcu', // photo_2026-10-23_15-00-38
    '1tqVb7yYVtdIpZtfL4EMSGo0q5WOfcK9i', // IMG_8136
    '1ZLgpLknUJBLUIIWvOlHPCmczlkDCCzuD', // photo_2026-10-23_15-00-48
    '1NsAqv_37sv4NWrUCypDSRuxOwtNZNn5l', // IMG_6206
    '1vEoFw-oJsb2ZnSH9N5uibXPbcG90ZRG4', // photo_2026-10-23_15-00-50
    '1TljZfSyTKEEV0QujP9TJQY0GSUfFInx7', // IMG_6090
    '1iQ7TXU5ZW9LzHnMpstd6-JBEyCIYADJc', // photo_2026-10-23_15-01-04
    '1fb4wH42omfKEAb6l5jBeZ-TK8ObiBBMq', // IMG_8412
    '1ueU-04pnaSktca298H0ukpAa2RGdp0sN', // IMG_5849
  ];

  // Явный порядок для вкладки «UGC»
  const UGC_ORDER = [
    '1ManB4U-OHqUUdgRY2d-svzvsGabY-MRy', // IMG_1441
    '1lcGeJvIo7psKmPeIMuVuGsSPYsT6MECH', // IMG_1442
    '1H2_f63IaWg3011-AzemMmcYgoc8ryPBy', // IMG_1440
    '1KHD_QuXvaIqt0ezs_LEUEeKrjEeoSeoN', // photo_2026-10-24_19-30-21
    '1n2cPKQMNKpDAzndVubXrwOoFJ1pibF6g', // IMG_1227
    '1OhksWojQtd3gDOlBKkZHw6-GHvbb0bNV', // IMG_1228
    '1CoNHFNvuzzKGQxyq_dSODi8Mhlfr_cO1', // IMG_1229
    '1klaizwd2MmsB8gVa4JHApcU4o9GD2v8L', // photo_2026-10-24_19-34-20
    '1OQMtTu3tVJ8un0OaRK0StQoiv5sYzKoy', // IMG_1456
    '1BINcUQGwmbYnY3NkTffZcD0ZpBGWiyI9', // IMG_1457
    '1A_JKt-FFfjkZEAkCg-ovVvpXNjeSb8pE', // photo_2026-10-24_19-36-00
    // IMG_1460, IMG_1459, IMG_1458, photo_2026-10-24_19-37-07 — пока не загружены, встанут в конец
    '14C3yT29nmGxA0UOG6Clu8hKxvIUAzZn7', // IMG_1461
    '17w4SvJPTlnrQmVPV5IqEW_igz1XuGmxy', // IMG_1462
    '1qvAJc1g71HMovPRvL816Zh0E6gxFnHfy', // IMG_1448
    '1Y6rdZf64rRQ_nt9ofwJZb4hwjaGrLjCc', // IMG_1446
    '1v_Ks5i1RfZu8U4s3AC-2biF9q3fHL70I', // photo_2026-10-24_19-38-03
    '1gEU0wAlpAl4_eCQwrUcsu82cAmnyS_8W', // IMG_1465
    '1CIYu0ZToQE-8ZOHgRnH_5154Xbux3zso', // IMG_1466
    '1j2PI2ISWpH5GYDMGJT_yovUg6HYrKLbm', // IMG_1468
    '1XU8HPQKvfeYDWvFAfZsozptmgyM8UTPu', // photo_2026-10-24_19-43-14
    // IMG_1445, IMG_1443 — пока не загружены
    '1rJyVnyFZ4RazlEKaBX0QcxTb_gyiX2G2', // IMG_1444
    // старые UGC видео с прошлой загрузки
    '1k_A8P9KD0xzshMulkPPX30sl1GrcjQxb', // IMG_0272
    '1WiAEPUCPcTFOuitfAqXJsgLjHCCYU0HT', // IMG_9169
    '1Y3KoQ7OzET8Py6-cTkK7qBxowPyvTOYp', // IMG_1431
  ];

  // Явный порядок для вкладки «Рестораны»
  const RESTAURANTS_ORDER = [
    '1rowTRNjuU3u2fT1ImJk_d-DBjoTI-o6I', // B331554E-B4D0-455F-8C36-1BBC205887F0
    '1tY_YLrv0SJC--7tP4kA9853E7nba2-r8', // photo_2026-10-23_14-58-05
    '1ca2enalNbf9EApQ8AkL_kdetjVVUtQ8Y', // IMG_2812
    '1WkA72u_c37uZ64TO5r83OA1cxSFn1R_m', // photo_2026-10-23_14-57-53
    '1I450aFr9pxSuvL_HchQuzNEGPvWT0b9h', // IMG_5852
    '1SPefuDk4vXu5-k5yJrIujemhpTd8puyu', // photo_2026-10-23_14-55-23
    '1auOPdtmIKn5CxS7vsjNU-9K1ON88pzLG', // IMG_4566
    '1-Of7QO7GCNPfdvXCeNEbrc4YsPQZJQJD', // photo_2026-10-23_14-55-43
    '1vtYWHY4k3uENMUGtMVIcmLD9jzGPxjAU', // IMG_8221
    '1yKdmf945gdm66y5sijkdvaG7d5SKhQPH', // photo_2026-10-23_14-55-50
    '1QcBaY8_OIvAtfsZPSY8PPzWPuc9uMRrM', // IMG_6906
    '19FRq281oAKL2d4eR2gUoAPJ0duN3TLaX', // photo_2026-10-23_14-56-26
    '1KQOtmquv46JV28Ee5RCA8Us8q5hRrXij', // IMG_6729
    '1go0IZiNZ5L-TA5IpVzv9Dzrn8djkfaji', // photo_2026-10-24_19-46-17
    '1F_L9EOgh6cnHHzxqKVgTn-S_NSeTxTxE', // photo_2026-10-23_14-57-01
    '1RHdQCZBzeh02jTis5nR8XPg-BUjsh1Cp', // IMG_5681
    '1YMPM5kAzVFDh10FTsEwX4030e64lEfRc', // IMG_7108
    '1Bec348jqdx9GB3RgbqpaMbNRV14uuxmL', // IMG_4501
    '13wWQIKoa1Kz14smC_vlPrX9SXf082hF5', // photo_2026-10-24_19-46-16
    '1i6rYehU6Wrie_dfrGmcMwK1jwm-UvXXM', // photo_2026-10-23_14-57-16
    '1eGi8ubY4uODUCykZdssjubBHvAsUNFbC', // IMG_5657
    '1I5Ivazt-JW_cmytkSCJUDBFCS5rlbdky', // photo_2026-10-23_14-57-28
    '1lI_USmVZWxrDVOzYiVee7rwJHwM99GT_', // IMG_3323
    '1ZAuAdwMn4k98hX5WbUrpj4TxfEPmlgWM', // photo_2026-10-23_14-57-39
    '1d431LNjpEVur5GLmiO1jl__UJ5Ogh_vC', // IMG_1927
    '1q6jHN5H_Kl1i3esdIlxK_DPkLMYSvb3R', // photo_2026-10-23_14-57-44
    '17R-mZj87meJBWmYHw0PhYFaTfSkdBMhD', // IMG_1780
    '1D6zXAErVNZP6h7klY2bDV3HxzJpdj4t0', // photo_2026-10-23_14-57-50
    '1-7gdPsBqvSwAgvJeNe-LafmymLWGHce0', // IMG_5991
    '1QP0mukdvTccnCJ8M-zfy00jFwDgqIex6', // photo_2026-10-23_14-58-11
    '1kBjLvB0LI1S3DITkqvkifkhKKK23T6wI', // IMG_6828
    '1m4zSP6bBeoRXFtO-Rji6chR8ncQsInIs', // photo_2026-10-23_14-58-14
    '1wFBi_2F9dMXfHKtwpfr_BCyjPx4HN0xj', // IMG_6613
    '13XW-azhbKE24lEMMaG5UlHArRCUdlhwc', // photo_2026-10-23_14-58-24
    '1K0y-fHMJ2kDCgQAO0_pmTd2w_0Sg8fmx', // IMG_0183
    '1Jnc0Soa-QsajMfWm18rgvVvmG2fNZCCx', // photo_2026-10-23_14-58-29
  ];

  // 5. Показ структурированного блока для вкладки SMM (точная группировка по запросу)
  function renderSmmShowcase(items) {
    // 1. Исключаем удаленное видео 1BHkmpFGARbGs_CEHDzeMPn9YodEO8bc-
    const filteredSmm = items.filter(i => i.id !== '1BHkmpFGARbGs_CEHDzeMPn9YodEO8bc-');

    // Назначенные ID для Кейса #2 (Мастер-класс / Арт-студия)
    // 1eZlmChr0qemxi-Cx_d3_OJcUORMSzDT5, 1MKsRlBWpBUFSoBAnWZwqBkTF4GZwZMgQ, 1ARNS4PL9JqHACkuY92VFftWmuubaUl6x
    const case2TargetIds = new Set([
      '1CWsKv2zrXWmr9eHThLaB5dCbzC5D42gU',
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
      '15y_POKdscBCzxLjd_uoLQ5s22iF6X_Zh'
    ]);

    // Назначенные ID для Кейса #3 (ЧаоКакао — какаочная)
    const case3TargetIds = new Set([
      '1S1tQ498MkIythtdXXpTkvqh2FLewuW_5', // IMG_1437
      '1N5-mMzLsAjtbKMK2z6e-kaWAHGGlbzSR', // IMG_1436
      '1bu_ydyr7vjUB1KIfBXHuSBD-hivDHYfF', // photo_2026-10-24_19-08-42
      '1zSR8yj5lagulLokn1BSKFXEAb2g2mxnA', // photo_2026-10-24_19-08-39
    ]);

    // Назначенные ID для Кейса #1 (Цветочная студия)
    // включая перенесенные 1t6gM0yJgFf0q0TY7Pu-v4XwSg8aWrF0K и 1TUqrTmWM3G-w7Kk2JCMfSX2SBALno0GI
    const case1Items = filteredSmm.filter(i => !case2TargetIds.has(i.id) && !case3TargetIds.has(i.id));
    const case2Items = filteredSmm.filter(i => case2TargetIds.has(i.id));
    const case3Items = filteredSmm.filter(i => case3TargetIds.has(i.id));

    const flowerImages = case1Items.filter(i => i.type === 'image');
    const flowerVideos = case1Items.filter(i => i.type === 'video');

    const artImages = case2Items.filter(i => i.type === 'image');
    const artVideos = case2Items.filter(i => i.type === 'video');

    const cacaoImages = case3Items.filter(i => i.type === 'image');
    const cacaoVideos = case3Items.filter(i => i.type === 'video');

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

      <!-- Кейс 3: ЧаоКакао — какаочная -->
      <div class="smm-case-block">
        <div class="smm-case-header">
          <div class="smm-case-tag">SMM-кейс #3</div>
          <h3 class="smm-case-title">Контент для какаочной «ЧаоКакао»</h3>
          <p class="smm-case-desc">Атмосферные съёмки, уютный визуал и видео для продвижения уникального заведения.</p>
        </div>

        <div class="smm-split-grid">
          <div class="smm-split-col">
            <h4 class="smm-col-title">Фото и графика</h4>
            <div class="smm-col-items">
              ${cacaoImages.map(img => `
                <div class="reel-card" data-full="${img.thumbnailUrl}">
                  <div class="card-image-box">
                    <img src="${img.thumbnailUrl}" alt="${img.title}" class="card-img-preview" loading="lazy">
                  </div>
                </div>
              `).join("")}
            </div>
          </div>

          <div class="smm-split-col">
            <h4 class="smm-col-title">Видео (Reels)</h4>
            <div class="smm-col-items">
              ${cacaoVideos.map(vid => `
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

  // 5b. Показ структурированного блока для вкладки UGC (группировка по брендам)
  function renderUgcShowcase(items) {
    const idMap = new Map(items.map(i => [i.id, i]));

    const ugcCases = [
      {
        tag: 'UGC #1',
        title: 'Косметика Maskoholik',
        desc: 'Креативные UGC-ролики для косметического бренда Maskoholik.',
        ids: [
          '1ManB4U-OHqUUdgRY2d-svzvsGabY-MRy', // IMG_1441
          '1lcGeJvIo7psKmPeIMuVuGsSPYsT6MECH', // IMG_1442
          '1H2_f63IaWg3011-AzemMmcYgoc8ryPBy', // IMG_1440
          '1KHD_QuXvaIqt0ezs_LEUEeKrjEeoSeoN', // photo_2026-10-24_19-30-21
        ]
      },
      {
        tag: 'UGC #2',
        title: 'Одежда «ТВОЁ»',
        desc: 'Стильные видеообзоры и луки для бренда одежды ТВОЁ.',
        ids: [
          '1CoNHFNvuzzKGQxyq_dSODi8Mhlfr_cO1', // IMG_1229
          '1n2cPKQMNKpDAzndVubXrwOoFJ1pibF6g', // IMG_1227
          '1OhksWojQtd3gDOlBKkZHw6-GHvbb0bNV', // IMG_1228
          '1klaizwd2MmsB8gVa4JHApcU4o9GD2v8L', // photo_2026-10-24_19-34-20
        ]
      },
      {
        tag: 'UGC #3',
        title: 'S-Parfum',
        desc: 'Атмосферный контент для парфюмерного бренда S-Parfum.',
        ids: [
          '1A_JKt-FFfjkZEAkCg-ovVvpXNjeSb8pE', // photo_2026-10-24_19-36-00
          '1BINcUQGwmbYnY3NkTffZcD0ZpBGWiyI9', // IMG_1457
          '1OQMtTu3tVJ8un0OaRK0StQoiv5sYzKoy', // IMG_1456
        ]
      },
      {
        tag: 'UGC #4',
        title: 'Онлайн-школа «Сотка»',
        desc: 'Обзоры и рекламные интеграции для онлайн-школы подготовки к ЕГЭ.',
        ids: [
          '140pcxOI1FQ71gMQ6fHWfMlMvhZW43Yw5', // IMG_1460
          '19oTlS7QHhhevcdpiBY_IWuqu_DN_oru3', // IMG_1459
          '1jCb8Ljf5rt4YNRLXuyVC9QrrLyb08Ble', // IMG_1458
          '1uWpaTSwxYuRtcgzoXr-bYcjPLkI181WA', // photo_2026-10-25_09-50-58
        ]
      },
      {
        tag: 'UGC #5',
        title: 'Косметика Mixit',
        desc: 'Яркие распаковки и обзоры косметики Mixit.',
        ids: [
          '17w4SvJPTlnrQmVPV5IqEW_igz1XuGmxy', // IMG_1462
          '14C3yT29nmGxA0UOG6Clu8hKxvIUAzZn7', // IMG_1461
          '1qvAJc1g71HMovPRvL816Zh0E6gxFnHfy', // IMG_1448
          '1Y6rdZf64rRQ_nt9ofwJZb4hwjaGrLjCc', // IMG_1446
          '1v_Ks5i1RfZu8U4s3AC-2biF9q3fHL70I', // photo_2026-10-24_19-38-03
        ]
      },
      {
        tag: 'UGC #6',
        title: 'Tashe / Limba косметика',
        desc: 'UGC-контент для косметических брендов Tashe и Limba.',
        ids: [
          '1rBBodPFgsdCEfd1mQ7jssUb79PEn9eHi', // IMG_1445
          '1BkJvZprSfiGrzxSy3nHihaaxdIb8fJ6A', // IMG_1443
          '1rJyVnyFZ4RazlEKaBX0QcxTb_gyiX2G2', // IMG_1444
        ]
      },
      {
        tag: 'UGC #7',
        title: 'Косметика 11i professional',
        desc: 'Профессиональный UGC для бренда 11i professional.',
        ids: [
          '1XU8HPQKvfeYDWvFAfZsozptmgyM8UTPu', // photo_2026-10-24_19-43-14
          '1CIYu0ZToQE-8ZOHgRnH_5154Xbux3zso', // IMG_1466
          '1gEU0wAlpAl4_eCQwrUcsu82cAmnyS_8W', // IMG_1465
          '1j2PI2ISWpH5GYDMGJT_yovUg6HYrKLbm', // IMG_1468
        ]
      },
    ];

    ugcShowcaseContainer.style.display = "block";
    ugcShowcaseContainer.innerHTML = ugcCases.map(c => {
      const caseItems = c.ids.map(id => idMap.get(id)).filter(Boolean);
      const imgs = caseItems.filter(i => i.type === 'image');
      const vids = caseItems.filter(i => i.type === 'video');

      return `
      <div class="smm-case-block">
        <div class="smm-case-header">
          <div class="smm-case-tag">${c.tag}</div>
          <h3 class="smm-case-title">${c.title}</h3>
          <p class="smm-case-desc">${c.desc}</p>
        </div>
        <div class="smm-split-grid">
          ${imgs.length ? `<div class="smm-split-col">
            <h4 class="smm-col-title">Фото</h4>
            <div class="smm-col-items">
              ${imgs.map(img => `
                <div class="reel-card" data-full="${img.thumbnailUrl}">
                  <div class="card-image-box">
                    <img src="${img.thumbnailUrl}" alt="${img.title}" class="card-img-preview" loading="lazy">
                  </div>
                </div>
              `).join("")}
            </div>
          </div>` : ""}
          ${vids.length ? `<div class="smm-split-col">
            <h4 class="smm-col-title">Видео</h4>
            <div class="smm-col-items">
              ${vids.map(vid => `
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
          </div>` : ""}
        </div>
      </div>
      `;
    }).join("");

    // Привязываем Lightbox к UGC кейсам
    ugcShowcaseContainer.querySelectorAll(".reel-card[data-full]").forEach(card => {
      card.addEventListener("click", () => {
        openLightbox(`<img src="${card.getAttribute("data-full")}" class="lightbox-img" alt="UGC">`);
      });
    });
    ugcShowcaseContainer.querySelectorAll(".reel-card[data-preview]").forEach(card => {
      card.addEventListener("click", () => {
        openLightbox(`
          <div class="lightbox-video-wrap">
            <iframe class="lightbox-iframe" src="${card.getAttribute("data-preview")}" allow="autoplay; encrypted-media; fullscreen" allowfullscreen></iframe>
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
      ugcShowcaseContainer.style.display = "none";
      videoGrid.style.display = "grid";
    } else if (category === "smm") {
      filtered = allMedia.filter(i => i.category === "smm");
      renderSmmShowcase(filtered);
      videoGrid.style.display = "none";
      loadMoreWrapper.style.display = "none";
      return;
    } else if (category === "restaurants") {
      filtered = sortByIdOrder(allMedia.filter(i => i.category === "restaurants"), RESTAURANTS_ORDER);
      smmShowcaseContainer.style.display = "none";
      ugcShowcaseContainer.style.display = "none";
      videoGrid.style.display = "grid";
    } else if (category === "commercial") {
      filtered = sortByIdOrder(allMedia.filter(i => i.category === "commercial"), COMMERCIAL_ORDER);
      smmShowcaseContainer.style.display = "none";
      ugcShowcaseContainer.style.display = "none";
      videoGrid.style.display = "grid";
    } else if (category === "ugc") {
      const ugcItems = allMedia.filter(i => i.category === "ugc");
      renderUgcShowcase(ugcItems);
      smmShowcaseContainer.style.display = "none";
      videoGrid.style.display = "none";
      loadMoreWrapper.style.display = "none";
      return;
    } else {
      filtered = balanceMedia(allMedia.filter(i => i.category === category));
      smmShowcaseContainer.style.display = "none";
      ugcShowcaseContainer.style.display = "none";
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
