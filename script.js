/**
 * Интеграция с Google Диском для сайта solwme.ru
 * Папка: https://drive.google.com/drive/folders/1jPSdn-z-C3uglhDuXSXQu9N7Ah3v98gz
 */

const GDRIVE_FOLDER_ID = "1jPSdn-z-C3uglhDuXSXQu9N7Ah3v98gz";

// Функция автоматического определения категории по названию
function detectCategory(name, desc) {
  const text = `${name || ""} ${desc || ""}`.toLowerCase();

  if (
    text.includes("эксперт") || text.includes("разбор") || text.includes("совет") ||
    text.includes("урок") || text.includes("алгоритм") || text.includes("интервью") ||
    text.includes("обучени") || text.includes("мышлени") || text.includes("стратеги") ||
    text.includes("как ") || text.includes("топ") || text.includes("фишк") ||
    text.includes("книг") || text.includes("ошибк")
  ) {
    return "expert";
  }

  if (
    text.includes("реклам") || text.includes("бренд") || text.includes("ugc") ||
    text.includes("промо") || text.includes("обзор") || text.includes("товар") ||
    text.includes("магазин") || text.includes("кофейн") || text.includes("авто") ||
    text.includes("студи") || text.includes("дроп") || text.includes("распаковк") ||
    text.includes("заказ") || text.includes("twoeye")
  ) {
    return "commercial";
  }

  if (
    text.includes("лайф") || text.includes("life") || text.includes("день") ||
    text.includes("влог") || text.includes("атмосфер") || text.includes("ноч") ||
    text.includes("закат") || text.includes("стрит") || text.includes("прогулк") ||
    text.includes("коворкинг") || text.includes("бэкстейдж") || text.includes("chechevata") ||
    text.includes("эстетик")
  ) {
    return "lifestyle";
  }

  return "reels";
}

document.addEventListener("DOMContentLoaded", () => {
  const videoGrid = document.getElementById("videoFeed");
  const filterPills = document.querySelectorAll(".filter-pill");
  let allVideos = [];

  // Загружаем видео из синхронизированного JSON
  async function loadVideos() {
    try {
      const res = await fetch(`videos.json?t=${Date.now()}`);
      if (res.ok) {
        allVideos = await res.json();
      }
    } catch (e) {
      console.warn("videos.json not loaded yet:", e);
    }

    const newHash = JSON.stringify(allVideos.map(d=>d.id));
      renderFeed(allVideos);
    }

  function renderFeed(items) {
    videoGrid.innerHTML = "";

    // Если папка пока пустая — выводим стильный лаконичный статус
    if (!items || items.length === 0) {
      videoGrid.innerHTML = `
        <div class="empty-feed-placeholder">
          <div class="empty-feed-spinner"></div>
          <p class="empty-feed-text">Видео загружаются и синхронизируются с Google Диском...</p>
        </div>
      `;
      return;
    }

    items.forEach((item, index) => {
      const previewUrl = item.previewUrl || `https://drive.google.com/file/d/${item.id}/preview`;
      const category = item.category || detectCategory(item.title, item.subtitle);

      const card = document.createElement("article");
      card.className = "reel-card";
      card.setAttribute("data-id", item.id);
      card.setAttribute("data-category", category);

      card.innerHTML = `
        <header class="reel-card-header">
          <h2 class="reel-card-title">${index + 1}. ${item.title}</h2>
          <p class="reel-card-subtitle">${item.subtitle || "Вертикальное видео · Reels / Shorts"}</p>
        </header>

        <div class="reel-player-box">
          <iframe 
            class="reel-drive-iframe" 
            src="${previewUrl}" 
            allow="autoplay; encrypted-media; fullscreen" 
            allowfullscreen 
            loading="lazy"
            title="${item.title}">
          </iframe>

          <!-- Кнопка Telegram в углу карточки -->
          <a href="https://t.me/solwme" target="_blank" rel="noopener" class="reel-tg-btn" title="Обсудить это видео в Telegram" aria-label="Telegram">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.75-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
            </svg>
          </a>
        </div>
      `;

      videoGrid.appendChild(card);
    });
  }

  // Фильтрация по категориям (вкладки)
  filterPills.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterPills.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.getAttribute("data-filter");
      if (filter === "all") {
        renderFeed(allVideos);
      } else {
        const filtered = allVideos.filter((item) => {
          const cat = item.category || detectCategory(item.title, item.subtitle);
          return cat === filter;
        });
        renderFeed(filtered);
      }
    });
  });

  loadVideos();
  setInterval(loadVideos, 3000);
});
