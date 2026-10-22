/**
 * База данных 32 видео-кейсов Сани Солвми
 * Точный формат как на скриншоте:
 * - Номер и заголовок: например "12. Студия радужки глаз «TWOEYE»"
 * - Подзаголовок/тип: "Рекламный Reels", "Экспертный Shorts", "UGC контент"
 * - Категория для фильтра: all | reels | commercial | expert | lifestyle
 * - videoSrc: вертикальное видео для встроенного плеера
 * - poster: обложка кадра
 */
const portfolioItems = [
  {
    id: 1,
    num: 1,
    title: "Кофейня «Specialty Roasters»",
    subtitle: "Рекламный Reels. Атмосфера, эстетика и макро-кадры напитков.",
    category: "commercial",
    views: "1.4M",
    duration: "0:28",
    poster: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=720&h=1280&q=85",
    videoSrc: "https://assets.mixkit.co/videos/preview/mixkit-coffee-maker-making-coffee-41487-large.mp4"
  },
  {
    id: 2,
    num: 2,
    title: "Личный бренд: Экспертный разбор",
    subtitle: "Экспертный Shorts. Динамичный монтаж с хуком в первые 2 секунды.",
    category: "expert",
    views: "890K",
    duration: "0:35",
    poster: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=720&h=1280&q=85",
    videoSrc: "https://assets.mixkit.co/videos/preview/mixkit-girl-looking-at-her-phone-while-walking-down-the-street-41716-large.mp4"
  },
  {
    id: 3,
    num: 3,
    title: "Ночной стрит-влог в мегаполисе",
    subtitle: "Lifestyle & Атмосфера. Съемка в D-Log M на Osmo Pocket 3.",
    category: "lifestyle",
    views: "640K",
    duration: "0:42",
    poster: "https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=720&h=1280&q=85",
    videoSrc: "https://assets.mixkit.co/videos/preview/mixkit-hands-holding-a-smartphone-in-a-neon-room-42861-large.mp4"
  },
  {
    id: 4,
    num: 4,
    title: "Беспроводные наушники «Aura Pro»",
    subtitle: "Рекламный UGC. Распаковка и тест звука без лишней «воды».",
    category: "commercial",
    views: "2.1M",
    duration: "0:30",
    poster: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=720&h=1280&q=85",
    videoSrc: "https://assets.mixkit.co/videos/preview/mixkit-holding-and-showing-a-smartphone-41718-large.mp4"
  },
  {
    id: 5,
    num: 5,
    title: "Fashion-дроп: 3 сезонных образа",
    subtitle: "Трендовый Reels. Бесшовный монтажный переход Match Cut под бит.",
    category: "reels",
    views: "3.5M",
    duration: "0:19",
    poster: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=720&h=1280&q=85",
    videoSrc: "https://assets.mixkit.co/videos/preview/mixkit-fashion-model-showing-her-outfit-41715-large.mp4"
  },
  {
    id: 6,
    num: 6,
    title: "Продакшн «CHECHEVATA Team»",
    subtitle: "Бэкстейдж съемки. Работа света, стедикама и атмосфера процесса.",
    category: "lifestyle",
    views: "420K",
    duration: "0:45",
    poster: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=720&h=1280&q=85",
    videoSrc: "https://assets.mixkit.co/videos/preview/mixkit-cameraman-recording-with-a-camera-at-a-studio-41485-large.mp4"
  },
  {
    id: 7,
    num: 7,
    title: "Стратегия продвижения в Telegram 2026",
    subtitle: "Экспертный контент. Пошаговый разбор посевов и закупки рекламы.",
    category: "expert",
    views: "510K",
    duration: "0:52",
    poster: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=720&h=1280&q=85",
    videoSrc: "https://assets.mixkit.co/videos/preview/mixkit-young-woman-talking-on-a-video-call-42866-large.mp4"
  },
  {
    id: 8,
    num: 8,
    title: "Фитнес-клуб «Iron Peak»",
    subtitle: "Промо-ролик. 120fps Slow-mo, акцент на динамике и мотивации.",
    category: "commercial",
    views: "980K",
    duration: "0:25",
    poster: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=720&h=1280&q=85",
    videoSrc: "https://assets.mixkit.co/videos/preview/mixkit-man-doing-push-ups-in-a-gym-41490-large.mp4"
  },
  {
    id: 9,
    num: 9,
    title: "Упаковка заказов со свечами ручной работы",
    subtitle: "ASMR Reels. Чистый звук шуршания бумаги и зажигания огня на петличку.",
    category: "reels",
    views: "1.8M",
    duration: "0:34",
    poster: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=720&h=1280&q=85",
    videoSrc: "https://assets.mixkit.co/videos/preview/mixkit-hands-wrapping-a-gift-box-41719-large.mp4"
  },
  {
    id: 10,
    num: 10,
    title: "Интервью: основатель IT-стартапа",
    subtitle: "Экспертный Shorts. Смысловой монтаж, титры и цепляющая подача.",
    category: "expert",
    views: "390K",
    duration: "0:48",
    poster: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=720&h=1280&q=85",
    videoSrc: "https://assets.mixkit.co/videos/preview/mixkit-two-people-talking-in-an-office-meeting-41484-large.mp4"
  },
  {
    id: 11,
    num: 11,
    title: "Детейлинг студия: Porsche GT3",
    subtitle: "Рекламный ролик. Зеркальный глянец кузова и пролеты камеры.",
    category: "commercial",
    views: "1.1M",
    duration: "0:32",
    poster: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=720&h=1280&q=85",
    videoSrc: "https://assets.mixkit.co/videos/preview/mixkit-sports-car-driving-on-a-highway-at-sunset-41489-large.mp4"
  },
  {
    id: 12,
    num: 12,
    title: "Студия радужки глаз «TWOEYE»",
    subtitle: "Рекламный Reels.",
    category: "reels",
    views: "820K",
    duration: "0:24",
    poster: "card-sample.jpg",
    videoSrc: "https://assets.mixkit.co/videos/preview/mixkit-holding-and-showing-a-smartphone-41718-large.mp4"
  },
  {
    id: 13,
    num: 13,
    title: "Как снимать видео в Apple Log на iPhone",
    subtitle: "Обучающий экспертный контент. Настройки профиля и цветокоррекция.",
    category: "expert",
    views: "1.6M",
    duration: "0:56",
    poster: "https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?auto=format&fit=crop&w=720&h=1280&q=85",
    videoSrc: "https://assets.mixkit.co/videos/preview/mixkit-cameraman-recording-with-a-camera-at-a-studio-41485-large.mp4"
  },
  {
    id: 14,
    num: 14,
    title: "Кондитерская мастерская «Le Bonbon»",
    subtitle: "Рекламный ролик. Презентация новой коллекции пирожных.",
    category: "commercial",
    views: "830K",
    duration: "0:22",
    poster: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=720&h=1280&q=85",
    videoSrc: "https://assets.mixkit.co/videos/preview/mixkit-coffee-maker-making-coffee-41487-large.mp4"
  },
  {
    id: 15,
    num: 15,
    title: "POV: Закатный Петербург от первого лица",
    subtitle: "Lifestyle видео. Прогулка с нагрудным креплением камеры.",
    category: "lifestyle",
    views: "940K",
    duration: "0:40",
    poster: "https://images.unsplash.com/photo-1477959858617-67f30bc75b82?auto=format&fit=crop&w=720&h=1280&q=85",
    videoSrc: "https://assets.mixkit.co/videos/preview/mixkit-hands-holding-a-smartphone-in-a-neon-room-42861-large.mp4"
  },
  {
    id: 16,
    num: 16,
    title: "Ожидания vs Реальность фриланса",
    subtitle: "Юмористический скетч. Вирусный сценарий и актерская игра.",
    category: "reels",
    views: "2.8M",
    duration: "0:27",
    poster: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=720&h=1280&q=85",
    videoSrc: "https://assets.mixkit.co/videos/preview/mixkit-girl-looking-at-her-phone-while-walking-down-the-street-41716-large.mp4"
  },
  {
    id: 17,
    num: 17,
    title: "Шоурум авторской одежды «Minimalist»",
    subtitle: "Fashion-ролик. Фактура ткани, крой и журнальная типографика.",
    category: "commercial",
    views: "670K",
    duration: "0:29",
    poster: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=720&h=1280&q=85",
    videoSrc: "https://assets.mixkit.co/videos/preview/mixkit-fashion-model-showing-her-outfit-41715-large.mp4"
  },
  {
    id: 18,
    num: 18,
    title: "Разбор алгоритмов рекомендаций в 2026",
    subtitle: "Экспертный контент. 3 фактора удержания внимания зрителя.",
    category: "expert",
    views: "1.2M",
    duration: "0:50",
    poster: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=720&h=1280&q=85",
    videoSrc: "https://assets.mixkit.co/videos/preview/mixkit-young-woman-talking-on-a-video-call-42866-large.mp4"
  },
  {
    id: 19,
    num: 19,
    title: "Уютный вечер: винил, чай и книга",
    subtitle: "Lifestyle ролик. Теплый свет и кинематографичные наплывы.",
    category: "lifestyle",
    views: "480K",
    duration: "0:36",
    poster: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=720&h=1280&q=85",
    videoSrc: "https://assets.mixkit.co/videos/preview/mixkit-hands-wrapping-a-gift-box-41719-large.mp4"
  },
  {
    id: 20,
    num: 20,
    title: "Ювелирный бренд «Silver & Soul»",
    subtitle: "Рекламный ролик. Игра световых бликов на серебре и гранях камня.",
    category: "commercial",
    views: "890K",
    duration: "0:25",
    poster: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=720&h=1280&q=85",
    videoSrc: "https://assets.mixkit.co/videos/preview/mixkit-holding-and-showing-a-smartphone-41718-large.mp4"
  },
  {
    id: 21,
    num: 21,
    title: "Челлендж: 30 рилсов за 30 дней",
    subtitle: "Личный блог. Итоги эксперимента и +24K подписчиков в канал.",
    category: "reels",
    views: "1.7M",
    duration: "0:38",
    poster: "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=720&h=1280&q=85",
    videoSrc: "https://assets.mixkit.co/videos/preview/mixkit-cameraman-recording-with-a-camera-at-a-studio-41485-large.mp4"
  },
  {
    id: 22,
    num: 22,
    title: "Психология цвета: как цвет управляет вниманием",
    subtitle: "Экспертный контент. Примеры контрастов и цветовых схем.",
    category: "expert",
    views: "610K",
    duration: "0:44",
    poster: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=720&h=1280&q=85",
    videoSrc: "https://assets.mixkit.co/videos/preview/mixkit-young-woman-talking-on-a-video-call-42866-large.mp4"
  },
  {
    id: 23,
    num: 23,
    title: "Утренний серфинг на рассвете",
    subtitle: "Lifestyle ролик. Съемка экшн-камерой с поляризационным фильтром.",
    category: "lifestyle",
    views: "1.3M",
    duration: "0:31",
    poster: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=720&h=1280&q=85",
    videoSrc: "https://assets.mixkit.co/videos/preview/mixkit-sports-car-driving-on-a-highway-at-sunset-41489-large.mp4"
  },
  {
    id: 24,
    num: 24,
    title: "Краш-тест противоударного чехла",
    subtitle: "Рекламный UGC. Дроп с 3 метров на бетон в замедленной съемке.",
    category: "commercial",
    views: "3.1M",
    duration: "0:18",
    poster: "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=720&h=1280&q=85",
    videoSrc: "https://assets.mixkit.co/videos/preview/mixkit-holding-and-showing-a-smartphone-41718-large.mp4"
  },
  {
    id: 25,
    num: 25,
    title: "Синхронизация с битом: Showreel моментов",
    subtitle: "Трендовый Reels. Точные монтажные склейки под бас и хай-хеты.",
    category: "reels",
    views: "1.9M",
    duration: "0:21",
    poster: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=720&h=1280&q=85",
    videoSrc: "https://assets.mixkit.co/videos/preview/mixkit-cameraman-recording-with-a-camera-at-a-studio-41485-large.mp4"
  },
  {
    id: 26,
    num: 26,
    title: "Пентхаус на высоте 45 этажа",
    subtitle: "Рекламный обзор интерьера. Панорамные пролеты и закатный свет.",
    category: "commercial",
    views: "760K",
    duration: "0:47",
    poster: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=720&h=1280&q=85",
    videoSrc: "https://assets.mixkit.co/videos/preview/mixkit-two-people-talking-in-an-office-meeting-41484-large.mp4"
  },
  {
    id: 27,
    num: 27,
    title: "3 книги для развития насмотренности видеографа",
    subtitle: "Экспертный Shorts. Разбор композиции, драматургии и света.",
    category: "expert",
    views: "430K",
    duration: "0:51",
    poster: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=720&h=1280&q=85",
    videoSrc: "https://assets.mixkit.co/videos/preview/mixkit-young-woman-talking-on-a-video-call-42866-large.mp4"
  },
  {
    id: 28,
    num: 28,
    title: "Ночь перед дедлайном монтажа",
    subtitle: "Lifestyle & Backstage. Монтажные таймлайны и кофе.",
    category: "lifestyle",
    views: "520K",
    duration: "0:33",
    poster: "https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?auto=format&fit=crop&w=720&h=1280&q=85",
    videoSrc: "https://assets.mixkit.co/videos/preview/mixkit-woman-working-on-her-laptop-in-a-coffee-shop-41717-large.mp4"
  },
  {
    id: 29,
    num: 29,
    title: "Эффект зум-портала в экран телефона",
    subtitle: "Визуальный эффект в CapCut & Premiere. Маскинг и моушн-трекинг.",
    category: "reels",
    views: "2.3M",
    duration: "0:17",
    poster: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=720&h=1280&q=85",
    videoSrc: "https://assets.mixkit.co/videos/preview/mixkit-hands-holding-a-smartphone-in-a-neon-room-42861-large.mp4"
  },
  {
    id: 30,
    num: 30,
    title: "Барбершоп «Old School Cut»",
    subtitle: "Рекламный ролик. Опасное лезвие, пар от полотенца и брутальность.",
    category: "commercial",
    views: "880K",
    duration: "0:30",
    poster: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=720&h=1280&q=85",
    videoSrc: "https://assets.mixkit.co/videos/preview/mixkit-man-doing-push-ups-in-a-gym-41490-large.mp4"
  },
  {
    id: 31,
    num: 31,
    title: "Как держаться уверенно перед камерой",
    subtitle: "Экспертный контент. 2 простых упражнения на дыхание и голос.",
    category: "expert",
    views: "690K",
    duration: "0:43",
    poster: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=720&h=1280&q=85",
    videoSrc: "https://assets.mixkit.co/videos/preview/mixkit-young-woman-talking-on-a-video-call-42866-large.mp4"
  },
  {
    id: 32,
    num: 32,
    title: "Золотой час на крыше: закатные кадры",
    subtitle: "Lifestyle ролик. Съемка в контровом закатном свете.",
    category: "lifestyle",
    views: "1.5M",
    duration: "0:26",
    poster: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=720&h=1280&q=85",
    videoSrc: "https://assets.mixkit.co/videos/preview/mixkit-sports-car-driving-on-a-highway-at-sunset-41489-large.mp4"
  }
];

// Карта категорий
const categoryLabels = {
  all: "Все видео",
  reels: "Reels & Shorts",
  commercial: "Реклама",
  expert: "Экспертный",
  lifestyle: "Lifestyle"
};

/* ==========================================================================
   Инициализация интерфейса
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const videoFeed = document.getElementById("videoFeed");
  const filterPills = document.querySelectorAll(".filter-pill");

  // Рендер карточек в точности как на скриншоте пользователя
  function renderFeed(items) {
    videoFeed.innerHTML = "";

    items.forEach((item) => {
      const card = document.createElement("article");
      card.className = "reel-card";
      card.setAttribute("data-id", item.id);

      card.innerHTML = `
        <header class="reel-card-header">
          <h2 class="reel-card-title">${item.num}. ${item.title}</h2>
          <p class="reel-card-subtitle">${item.subtitle}</p>
        </header>

        <div class="reel-player-box" data-video="${item.videoSrc}">
          <video class="reel-native-video" playsinline preload="metadata" poster="${item.poster}">
            <source src="${item.videoSrc}" type="video/mp4">
          </video>

          <!-- Верхняя панель управления (звук, развернуть, картинка-в-картинке) -->
          <div class="reel-top-bar">
            <button class="player-icon-btn btn-mute" title="Включить/выключить звук" aria-label="Звук">
              <svg class="icon-sound-on" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
              </svg>
              <svg class="icon-sound-off" style="display:none;" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <line x1="23" y1="9" x2="17" y2="15"></line>
                <line x1="17" y1="9" x2="23" y2="15"></line>
              </svg>
            </button>

            <div class="top-bar-right">
              <button class="player-icon-btn btn-fullscreen" title="На весь экран" aria-label="На весь экран">
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"></path>
                </svg>
              </button>
              <button class="player-icon-btn btn-pip" title="Картинка в картинке" aria-label="Картинка в картинке">
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                  <rect x="12" y="10" width="8" height="8" rx="1" fill="currentColor"></rect>
                </svg>
              </button>
            </div>
          </div>

          <!-- Центральные контролы: перемотка назад 10с, Play/Pause, перемотка вперед 10с -->
          <div class="reel-center-controls">
            <button class="center-btn btn-rewind" aria-label="Перемотать на 10 секунд назад" title="-10 сек">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M1 4v6h6"></path>
                <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
              </svg>
              <span class="center-btn-num">10</span>
            </button>

            <button class="center-btn btn-play-pause" aria-label="Воспроизвести / Пауза" title="Play">
              <svg class="icon-play" width="34" height="34" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="6 4 20 12 6 20 6 4"></polygon>
              </svg>
              <svg class="icon-pause" style="display:none;" width="34" height="34" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16" rx="1"></rect>
                <rect x="14" y="4" width="4" height="16" rx="1"></rect>
              </svg>
            </button>

            <button class="center-btn btn-forward" aria-label="Перемотать на 10 секунд вперед" title="+10 сек">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M23 4v6h-6"></path>
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
              </svg>
              <span class="center-btn-num">10</span>
            </button>
          </div>

          <!-- Нижняя строка прогресса и таймер -->
          <div class="reel-bottom-bar">
            <span class="time-current">0:00</span>
            <div class="progress-track">
              <div class="progress-fill"></div>
            </div>
            <span class="time-duration">${item.duration}</span>
          </div>

          <!-- Фирменная круглая кнопка Telegram в правом нижнем углу карточки (как на скрине) -->
          <a href="https://t.me/solwme" target="_blank" rel="noopener" class="reel-tg-btn" title="Обсудить это видео в Telegram" aria-label="Telegram">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.75-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
            </svg>
          </a>
        </div>
      `;

      initPlayerEvents(card);
      videoFeed.appendChild(card);
    });
  }

  // Настройка интерактивного плеера для каждой карточки
  function initPlayerEvents(card) {
    const video = card.querySelector(".reel-native-video");
    const playerBox = card.querySelector(".reel-player-box");
    const playPauseBtn = card.querySelector(".btn-play-pause");
    const iconPlay = card.querySelector(".icon-play");
    const iconPause = card.querySelector(".icon-pause");
    const muteBtn = card.querySelector(".btn-mute");
    const iconSoundOn = card.querySelector(".icon-sound-on");
    const iconSoundOff = card.querySelector(".icon-sound-off");
    const rewindBtn = card.querySelector(".btn-rewind");
    const forwardBtn = card.querySelector(".btn-forward");
    const fullscreenBtn = card.querySelector(".btn-fullscreen");
    const pipBtn = card.querySelector(".btn-pip");
    const progressFill = card.querySelector(".progress-fill");
    const progressTrack = card.querySelector(".progress-track");
    const timeCurrent = card.querySelector(".time-current");
    const timeDuration = card.querySelector(".time-duration");

    function formatTime(seconds) {
      if (isNaN(seconds)) return "0:00";
      const m = Math.floor(seconds / 60);
      const s = Math.floor(seconds % 60);
      return `${m}:${s < 10 ? "0" : ""}${s}`;
    }

    function togglePlay() {
      // Ставим на паузу все другие видео на странице
      document.querySelectorAll(".reel-native-video").forEach((v) => {
        if (v !== video && !v.paused) {
          v.pause();
        }
      });

      if (video.paused) {
        video.play().then(() => {
          iconPlay.style.display = "none";
          iconPause.style.display = "block";
          playerBox.classList.add("is-playing");
        }).catch(() => {});
      } else {
        video.pause();
        iconPlay.style.display = "block";
        iconPause.style.display = "none";
        playerBox.classList.remove("is-playing");
      }
    }

    video.addEventListener("play", () => {
      iconPlay.style.display = "none";
      iconPause.style.display = "block";
      playerBox.classList.add("is-playing");
    });

    video.addEventListener("pause", () => {
      iconPlay.style.display = "block";
      iconPause.style.display = "none";
      playerBox.classList.remove("is-playing");
    });

    playPauseBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      togglePlay();
    });

    // Клик по видео переключает play/pause
    video.addEventListener("click", () => {
      togglePlay();
    });

    // Mute / Unmute
    muteBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      video.muted = !video.muted;
      if (video.muted) {
        iconSoundOn.style.display = "none";
        iconSoundOff.style.display = "block";
      } else {
        iconSoundOn.style.display = "block";
        iconSoundOff.style.display = "none";
      }
    });

    // Rewind / Forward 10s
    rewindBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      video.currentTime = Math.max(0, video.currentTime - 10);
    });

    forwardBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      video.currentTime = Math.min(video.duration || 999, video.currentTime + 10);
    });

    // Fullscreen
    fullscreenBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (!document.fullscreenElement) {
        if (video.requestFullscreen) {
          video.requestFullscreen();
        } else if (video.webkitEnterFullscreen) {
          video.webkitEnterFullscreen();
        }
      } else {
        document.exitFullscreen();
      }
    });

    // Picture-in-Picture
    if ("pictureInPictureEnabled" in document) {
      pipBtn.addEventListener("click", async (e) => {
        e.stopPropagation();
        try {
          if (document.pictureInPictureElement) {
            await document.exitPictureInPicture();
          } else {
            await video.requestPictureInPicture();
          }
        } catch (err) {
          console.error(err);
        }
      });
    } else {
      pipBtn.style.display = "none";
    }

    // Time update & Progress bar
    video.addEventListener("timeupdate", () => {
      timeCurrent.textContent = formatTime(video.currentTime);
      if (video.duration) {
        const percent = (video.currentTime / video.duration) * 100;
        progressFill.style.width = `${percent}%`;
      }
    });

    video.addEventListener("loadedmetadata", () => {
      if (video.duration && !isNaN(video.duration)) {
        timeDuration.textContent = formatTime(video.duration);
      }
    });

    // Клик по прогресс-бару для перемотки
    progressTrack.addEventListener("click", (e) => {
      e.stopPropagation();
      const rect = progressTrack.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      if (video.duration) {
        video.currentTime = pos * video.duration;
      }
    });
  }

  // Первоначальный рендер всех 32 работ
  renderFeed(portfolioItems);

  // Фильтрация
  filterPills.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterPills.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.getAttribute("data-filter");
      if (filter === "all") {
        renderFeed(portfolioItems);
      } else {
        const filtered = portfolioItems.filter((item) => item.category === filter);
        renderFeed(filtered);
      }
    });
  });

  // Автопауза видео при уходе из зоны видимости (IntersectionObserver)
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target;
          if (!entry.isIntersecting && !video.paused) {
            video.pause();
          }
        });
      },
      { threshold: 0.25 }
    );

    document.querySelectorAll(".reel-native-video").forEach((v) => observer.observe(v));
  }
});
