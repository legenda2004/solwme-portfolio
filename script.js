/**
 * Интеграция с Google Drive для портфолио видео solwme.ru
 * 
 * Папка пользователя:
 * https://drive.google.com/drive/folders/1jPSdn-z-C3uglhDuXSXQu9N7Ah3v98gz?usp=sharing
 * 
 * ВАРИАНТЫ РАБОТЫ:
 * 1. API-режим (Google Drive API v3):
 *    Если указан GOOGLE_API_KEY, сайт автоматически загружает все видео прямо из вашей папки!
 * 
 * 2. Список файлов по ID Google Drive (без ключа API):
 *    Достаточно указать ID файлов из Google Drive (или прямые ссылки 'https://drive.google.com/file/d/ID/view'),
 *    и сайт автоматически сформирует плеер и превью.
 */

const GDRIVE_CONFIG = {
  folderId: "1jPSdn-z-C3uglhDuXSXQu9N7Ah3v98gz",
  // Если у вас есть бесплатный API Key от Google Cloud, вставьте его сюда:
  apiKey: "", 
};

/**
 * Список видео с вашего Google Диска.
 * Чтобы добавить новое видео, просто вставьте его ID из ссылки Google Диска:
 * Пример ссылки: https://drive.google.com/file/d/1A2B3C4D5E6F/view -> ID: "1A2B3C4D5E6F"
 */
let driveVideos = [
  /*
  Пример добавления ваших файлов из папки:
  {
    id: "ID_ФАЙЛА_ИЗ_ГУГЛ_ДИСКА",
    num: 1,
    title: "Название кейса",
    subtitle: "Рекламный Reels / UGC",
    category: "commercial" // reels | commercial | expert | lifestyle
  }
  */
];

// Утилита для получения прямой ссылки на видео и превью из Google Drive
function getGDriveVideoUrls(fileId) {
  return {
    // Встроенный плеер Google Drive Preview
    previewUrl: `https://drive.google.com/file/d/${fileId}/preview`,
    // Прямой поток для тега <video>
    streamUrl: `https://drive.google.com/uc?export=download&id=${fileId}`,
    // Превью-обложка высокого разрешения из Google Drive
    thumbnailUrl: `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`
  };
}

const categoryLabels = {
  all: "Все работы",
  reels: "Reels & Shorts",
  commercial: "Реклама",
  expert: "Экспертный",
  lifestyle: "Lifestyle"
};

document.addEventListener("DOMContentLoaded", () => {
  const videoGrid = document.getElementById("videoFeed");
  const filterPills = document.querySelectorAll(".filter-pill");
  const countBadge = document.getElementById("videoCountBadge");

  // Загрузка через Google Drive API (если указан API-ключ)
  async function fetchFromGoogleDriveAPI() {
    if (!GDRIVE_CONFIG.apiKey) return null;

    const query = encodeURIComponent(`'${GDRIVE_CONFIG.folderId}' in parents and mimeType contains 'video/' and trashed = false`);
    const endpoint = `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name,mimeType,thumbnailLink,description,createdTime)&key=${GDRIVE_CONFIG.apiKey}&pageSize=50`;

    try {
      const response = await fetch(endpoint);
      const data = await response.json();
      if (data.files && data.files.length > 0) {
        return data.files.map((file, index) => {
          const cleanName = file.name.replace(/\.[^/.]+$/, ""); // убираем .mp4 / .mov
          return {
            id: file.id,
            num: index + 1,
            title: cleanName,
            subtitle: file.description || "Вертикальное видео · Reels / Shorts",
            category: "reels",
            views: "Google Drive",
            fileId: file.id
          };
        });
      }
    } catch (err) {
      console.warn("Google Drive API fetch error:", err);
    }
    return null;
  }

  // Рендер карточек
  function renderFeed(items) {
    videoGrid.innerHTML = "";

    if (!items || items.length === 0) {
      videoGrid.innerHTML = `
        <div class="gdrive-empty-state">
          <div class="empty-icon-wrap">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
              <line x1="12" y1="11" x2="12" y2="17"></line>
              <line x1="9" y1="14" x2="15" y2="14"></line>
            </svg>
          </div>
          <h3 class="empty-title">Папка Google Диска подключена</h3>
          <p class="empty-desc">
            ID папки: <code>${GDRIVE_CONFIG.folderId}</code><br>
            Моковые демо-видео удалены. Чтобы ваши видео с Диска отобразились на сайте, выберите удобный способ ниже:
          </p>
          <div class="empty-guide">
            <div class="guide-step">
              <strong>Способ 1 (Рекомендуемый, 1 минута):</strong><br>
              Скопируйте ссылки на видео из папки Google Диска и добавьте их ID в массив <code>driveVideos</code> в файле <code>script.js</code>.
            </div>
            <div class="guide-step">
              <strong>Способ 2 (Автоматический через API):</strong><br>
              Укажите бесплатный Google Drive API ключ в переменной <code>GDRIVE_CONFIG.apiKey</code>, и сайт сам подтянет все видео из папки на лету!
            </div>
          </div>
          <a href="https://drive.google.com/drive/folders/${GDRIVE_CONFIG.folderId}?usp=sharing" target="_blank" rel="noopener" class="btn-action-primary empty-btn">
            Открыть папку на Google Диске ↗
          </a>
        </div>
      `;
      if (countBadge) countBadge.textContent = "0";
      return;
    }

    if (countBadge) countBadge.textContent = items.length;

    items.forEach((item) => {
      const urls = getGDriveVideoUrls(item.fileId || item.id);
      const card = document.createElement("article");
      card.className = "reel-card";
      card.setAttribute("data-id", item.id);

      card.innerHTML = `
        <header class="reel-card-header">
          <h2 class="reel-card-title">${item.num}. ${item.title}</h2>
          <p class="reel-card-subtitle">${item.subtitle}</p>
        </header>

        <div class="reel-player-box" data-fileid="${item.fileId || item.id}">
          <!-- Встроенный адаптивный плеер Google Drive (iframe с защитой от блокировки автоплея) -->
          <iframe 
            class="reel-drive-iframe" 
            src="${urls.previewUrl}" 
            allow="autoplay; encrypted-media; fullscreen" 
            allowfullscreen 
            loading="lazy"
            title="${item.title}">
          </iframe>

          <!-- Фирменная круглая кнопка Telegram в углу карточки -->
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

  // Запуск
  async function init() {
    // 1. Проверяем API
    const apiVideos = await fetchFromGoogleDriveAPI();
    if (apiVideos && apiVideos.length > 0) {
      driveVideos = apiVideos;
    }

    // 2. Рендерим текущие видео
    renderFeed(driveVideos);

    // 3. Фильтрация
    filterPills.forEach((btn) => {
      btn.addEventListener("click", () => {
        filterPills.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        const filter = btn.getAttribute("data-filter");
        if (filter === "all") {
          renderFeed(driveVideos);
        } else {
          const filtered = driveVideos.filter((item) => item.category === filter);
          renderFeed(filtered);
        }
      });
    });
  }

  init();
});
