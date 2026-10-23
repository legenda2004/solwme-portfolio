/**
 * Интеграция с Google Диском для сайта Александры (Саня Солвми)
 * Папка: https://drive.google.com/drive/folders/1jPSdn-z-C3uglhDuXSXQu9N7Ah3v98gz
 */

document.addEventListener("DOMContentLoaded", () => {
  const videoGrid = document.getElementById("videoFeed");
  const filterPills = document.querySelectorAll(".filter-pill");
  const creatorAvatar = document.getElementById("creatorAvatar");
  let allMedia = [];

  // Загружаем данные из videos.json
  async function loadData() {
    try {
      const res = await fetch(`videos.json?t=${Date.now()}`);
      if (res.ok) {
        const data = await res.json();
        
        // Если есть отдельная аватарка в корне папки Google Диска
        if (data.avatarUrl && creatorAvatar) {
          creatorAvatar.src = data.avatarUrl;
        }

        allMedia = Array.isArray(data) ? data : (data.items || []);
        renderFeed(allMedia);
      }
    } catch (e) {
      console.warn("videos.json fetch error:", e);
    }
  }

  function renderFeed(items) {
    videoGrid.innerHTML = "";

    // Если папка пока пустая — выводим аккуратный статус
    if (!items || items.length === 0) {
      videoGrid.innerHTML = `
        <div class="empty-feed-placeholder" style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
          <div class="empty-feed-spinner" style="margin: 0 auto 16px auto;"></div>
          <p class="empty-feed-text" style="color: var(--text-muted); font-size: 1rem;">
            Работы синхронизируются с Google Диском... Загрузите видео или фото в соответствующие подпапки на Диске.
          </p>
        </div>
      `;
      return;
    }

    items.forEach((item, index) => {
      const card = document.createElement("article");
      card.className = "reel-card";
      card.setAttribute("data-id", item.id);
      card.setAttribute("data-category", item.category);

      const isImage = item.type === "image";

      card.innerHTML = `
        <header class="reel-card-header">
          <h2 class="reel-card-title">${index + 1}. ${item.title}</h2>
          <p class="reel-card-subtitle">${item.subtitle}</p>
        </header>

        ${isImage ? `
          <!-- Карточка графики / дизайна / фото -->
          <div class="card-image-box">
            <img src="${item.thumbnailUrl || item.streamUrl}" alt="${item.title}" class="card-img-preview" loading="lazy">
            <span class="card-image-badge">Дизайн / Фото</span>
            <a href="https://t.me/solwmees" target="_blank" rel="noopener" class="reel-tg-btn" title="Обсудить в Telegram" aria-label="Telegram">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.75-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
              </svg>
            </a>
          </div>
        ` : `
          <!-- Видеоплеер Google Drive 9:16 -->
          <div class="reel-player-box">
            <iframe 
              class="reel-drive-iframe" 
              src="${item.previewUrl}" 
              allow="autoplay; encrypted-media; fullscreen" 
              allowfullscreen 
              loading="lazy"
              title="${item.title}">
            </iframe>

            <a href="https://t.me/solwmees" target="_blank" rel="noopener" class="reel-tg-btn" title="Обсудить в Telegram" aria-label="Telegram">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.75-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
              </svg>
            </a>
          </div>
        `}
      `;

      videoGrid.appendChild(card);
    });
  }

  // Фильтрация по новым папкам
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

  // Автопроверка обновлений
  setInterval(loadData, 5000);
});
