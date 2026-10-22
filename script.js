/**
 * База данных 32+ видео-кейсов
 * Каждый элемент имеет:
 * - id: уникальный ID
 * - title: название ролика/кейса
 * - client: для кого снято / ниша
 * - category: reels | commercial | expert | lifestyle
 * - views: метрика охватов
 * - thumb: обложка превью (Unsplash с оптимизированными параметрами под 9:16)
 * - videoSrc: ссылка на MP4 файл или ролик
 * - embedUrl: ссылка на YouTube Shorts / Rutube / VK видео (если нужно встраивание через iframe)
 * - desc: подробное описание задачи, сценария и результатов
 */
const portfolioItems = [
  {
    id: 1,
    title: "Динамичный промо-ролик для кофейни 'Specialty'",
    client: "Локальный бренд кофе",
    category: "commercial",
    views: "1.4M просмотров",
    thumb: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=600&h=1067&q=80",
    videoSrc: "https://assets.mixkit.co/videos/preview/mixkit-coffee-maker-making-coffee-41487-large.mp4",
    desc: "Задача: передать атмосферу утреннего ритуала и текстуру напитка. Съемка на iPhone 16 Pro (4K 60fps) + макро-линза. Ролик набрал 1.4 млн органических просмотров в Reels."
  },
  {
    id: 2,
    title: "Хук и динамика: экспертный рилс о мышлении",
    client: "Бизнес-наставник",
    category: "expert",
    views: "890K просмотров",
    thumb: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&h=1067&q=80",
    videoSrc: "https://assets.mixkit.co/videos/preview/mixkit-girl-looking-at-her-phone-while-walking-down-the-street-41716-large.mp4",
    desc: "Разработка сценария с цепляющим хуком в первые 1.5 секунды, динамичный монтаж в CapCut с трекингом субтитров и звуковыми эффектами (Whoosh, Pop)."
  },
  {
    id: 3,
    title: "Атмосферный ночной стрит-влог в неоновом свете",
    client: "Личный бренд",
    category: "lifestyle",
    views: "640K просмотров",
    thumb: "https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=600&h=1067&q=80",
    videoSrc: "https://assets.mixkit.co/videos/preview/mixkit-hands-holding-a-smartphone-in-a-neon-room-42861-large.mp4",
    desc: "Съемка на DJI Osmo Pocket 3 в режиме D-Log M в условиях сложного ночного освещения. Плавная цветокоррекция с неоновыми сине-фиолетовыми оттенками."
  },
  {
    id: 4,
    title: "UGC-обзор беспроводных наушников премиум-класса",
    client: "Tech бренд",
    category: "commercial",
    views: "2.1M просмотров",
    thumb: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&h=1067&q=80",
    videoSrc: "https://assets.mixkit.co/videos/preview/mixkit-holding-and-showing-a-smartphone-41718-large.mp4",
    desc: "Создание нативного распаковочного UGC-видео для таргета и Shorts. Рост конверсии в переход по ссылке в 2.4 раза по сравнению с графическими креативами."
  },
  {
    id: 5,
    title: "Трендовый переход под звук в TikTok/Reels",
    client: "Fashion блогер",
    category: "reels",
    views: "3.5M просмотров",
    thumb: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&h=1067&q=80",
    videoSrc: "https://assets.mixkit.co/videos/preview/mixkit-fashion-model-showing-her-outfit-41715-large.mp4",
    desc: "Бесшовный монтажный переход (Match Cut) смены трех образов под вирусный трек. Более 45,000 сохранений и репостов."
  },
  {
    id: 6,
    title: "За кулисами съемки: бэкстейдж продакшна CHECHEVATA",
    client: "Production Studio",
    category: "lifestyle",
    views: "420K просмотров",
    thumb: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=600&h=1067&q=80",
    videoSrc: "https://assets.mixkit.co/videos/preview/mixkit-cameraman-recording-with-a-camera-at-a-studio-41485-large.mp4",
    desc: "Динамичный бэкстейдж съемочного процесса с быстрой нарезкой кадров, работой света и эмоциями команды."
  },
  {
    id: 7,
    title: "Разбор ошибок в продвижении через Telegram в 2026",
    client: "Эксперт по трафику",
    category: "expert",
    views: "510K просмотров",
    thumb: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=600&h=1067&q=80",
    videoSrc: "https://assets.mixkit.co/videos/preview/mixkit-young-woman-talking-on-a-video-call-42866-large.mp4",
    desc: "Говорящая голова с всплывающими графическими иллюстрациями, выносками цифр и саунд-эффектами каждого тезиса."
  },
  {
    id: 8,
    title: "Спортивная мотивация: утренняя тренировка в зале",
    client: "Фитнес-клуб",
    category: "commercial",
    views: "980K просмотров",
    thumb: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&h=1067&q=80",
    videoSrc: "https://assets.mixkit.co/videos/preview/mixkit-man-doing-push-ups-in-a-gym-41490-large.mp4",
    desc: "Съемка в 120fps со сверхплавным замедлением (Slow Motion). Акцент на каплях пота, тяжелом дыхании и брутальной атмосфере."
  },
  {
    id: 9,
    title: "Эстетичный ASMR-монтаж: упаковка заказа для бренда",
    client: "Свечной бренд",
    category: "reels",
    views: "1.8M просмотров",
    thumb: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=600&h=1067&q=80",
    videoSrc: "https://assets.mixkit.co/videos/preview/mixkit-hands-wrapping-a-gift-box-41719-large.mp4",
    desc: "Глубокая запись ASMR-звуков через петличку DJI Mic (шуршание бумаги, щелчок спички, пламя). Максимальное залипание зрителей."
  },
  {
    id: 10,
    title: "Интервью с основателем IT-стартапа: короткие хайлайты",
    client: "IT-конференция",
    category: "expert",
    views: "390K просмотров",
    thumb: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&h=1067&q=80",
    videoSrc: "https://assets.mixkit.co/videos/preview/mixkit-two-people-talking-in-an-office-meeting-41484-large.mp4",
    desc: "Нарезка часового интервью на 5 вирусных роликов по 40 секунд. За счет смыслового монтажа переходы в профиль выросли на 320%."
  },
  {
    id: 11,
    title: "Автомобильный ролик: Porsche в закатном свете",
    client: "Автодетейлинг",
    category: "commercial",
    views: "1.1M просмотров",
    thumb: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&h=1067&q=80",
    videoSrc: "https://assets.mixkit.co/videos/preview/mixkit-sports-car-driving-on-a-highway-at-sunset-41489-large.mp4",
    desc: "Динамичные проводки на стедикаме вокруг кузова, отражения заката и сочный рокот выхлопа в саунд-дизайне."
  },
  {
    id: 12,
    title: "Один день из жизни контент-креатора",
    client: "Личный блог",
    category: "lifestyle",
    views: "720K просмотров",
    thumb: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&h=1067&q=80",
    videoSrc: "https://assets.mixkit.co/videos/preview/mixkit-woman-working-on-her-laptop-in-a-coffee-shop-41717-large.mp4",
    desc: "Легкий лайфстайл с эстетичным колоритом, быстрой сменой локаций (кофейня, студия, вечерний город) и вдохновляющим войсовером."
  },
  {
    id: 13,
    title: "Как снимать кино на смартфон: 3 лайфхака с настройками",
    client: "Обучающий канал",
    category: "expert",
    views: "1.6M просмотров",
    thumb: "https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?auto=format&fit=crop&w=600&h=1067&q=80",
    videoSrc: "https://assets.mixkit.co/videos/preview/mixkit-holding-and-showing-a-smartphone-41718-large.mp4",
    desc: "Наглядное сравнение «До / После» включения фиксации экспозиции и использования правильного угла затвора 180°."
  },
  {
    id: 14,
    title: "Презентация нового меню авторских десертов",
    client: "Кондитерская мастерская",
    category: "commercial",
    views: "830K просмотров",
    thumb: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&h=1067&q=80",
    videoSrc: "https://assets.mixkit.co/videos/preview/mixkit-coffee-maker-making-coffee-41487-large.mp4",
    desc: "Фуд-порн кадры с разрезом шоколадного фондана и вытекающим кремом. После публикации ролика десерты были распроданы за 2 дня."
  },
  {
    id: 15,
    title: "POV: Прогулка по историческому центру на закате",
    client: "Туристический проект",
    category: "lifestyle",
    views: "940K просмотров",
    thumb: "https://images.unsplash.com/photo-1477959858617-67f30bc75b82?auto=format&fit=crop&w=600&h=1067&q=80",
    videoSrc: "https://assets.mixkit.co/videos/preview/mixkit-hands-holding-a-smartphone-in-a-neon-room-42861-large.mp4",
    desc: "Эффект погружения от первого лица с использованием нагрудного крепления и стабилизации Osmo Pocket 3."
  },
  {
    id: 16,
    title: "Вирусный скетч: ожидания vs реальность фриланса",
    client: "Юмористический проект",
    category: "reels",
    views: "2.8M просмотров",
    thumb: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=600&h=1067&q=80",
    videoSrc: "https://assets.mixkit.co/videos/preview/mixkit-girl-looking-at-her-phone-while-walking-down-the-street-41716-large.mp4",
    desc: "Актерская подача, быстрая смена планов и жизненная ситуация, вызвавшая волну репостов в личные сообщения."
  },
  {
    id: 17,
    title: "Fashion-лукбук: капсула верхней одежды",
    client: "Шоурум одежды",
    category: "commercial",
    views: "670K просмотров",
    thumb: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&h=1067&q=80",
    videoSrc: "https://assets.mixkit.co/videos/preview/mixkit-fashion-model-showing-her-outfit-41715-large.mp4",
    desc: "Стильные акцентные детали (фурнитура, строчка, ткань в движении) с трендовым журнальным шрифтовым оформлением."
  },
  {
    id: 18,
    title: "Секреты алгоритмов Reels в 2026: как попасть в топ",
    client: "SMM-агентство",
    category: "expert",
    views: "1.2M просмотров",
    thumb: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&h=1067&q=80",
    videoSrc: "https://assets.mixkit.co/videos/preview/mixkit-young-woman-talking-on-a-video-call-42866-large.mp4",
    desc: "Четкая структура: проблема, факт от разработчиков Instagram, инструкция из 3 шагов и призыв подписаться."
  },
  {
    id: 19,
    title: "Уютный вечер у камина с книгой и винилом",
    client: "Интерьерный салон",
    category: "lifestyle",
    views: "480K просмотров",
    thumb: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&h=1067&q=80",
    videoSrc: "https://assets.mixkit.co/videos/preview/mixkit-hands-wrapping-a-gift-box-41719-large.mp4",
    desc: "Теплый кинематографичный свет, треск пластинки и медленные кинематографичные наплывы камеры."
  },
  {
    id: 20,
    title: "Дроп нового ювелирного украшения ручной работы",
    client: "Ювелирный бренд",
    category: "commercial",
    views: "890K просмотров",
    thumb: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=600&h=1067&q=80",
    videoSrc: "https://assets.mixkit.co/videos/preview/mixkit-holding-and-showing-a-smartphone-41718-large.mp4",
    desc: "Игра бликов света на гранях серебра и камней. Высокая детализация кадра благодаря Apple Log и макро-освещению."
  },
  {
    id: 21,
    title: "Челлендж 30 дней съемок: трансформация аккаунта",
    client: "Личный блог",
    category: "reels",
    views: "1.7M просмотров",
    thumb: "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=600&h=1067&q=80",
    videoSrc: "https://assets.mixkit.co/videos/preview/mixkit-cameraman-recording-with-a-camera-at-a-studio-41485-large.mp4",
    desc: "Таймлапс-нарезка процесса съемок на улице и в студии за месяц, приведшая к приросту +24 000 подписчиков."
  },
  {
    id: 22,
    title: "Психология цвета в видео: как вызывать нужные эмоции",
    client: "Образовательная платформа",
    category: "expert",
    views: "610K просмотров",
    thumb: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&h=1067&q=80",
    videoSrc: "https://assets.mixkit.co/videos/preview/mixkit-young-woman-talking-on-a-video-call-42866-large.mp4",
    desc: "Сравнение одного и того же кадра в теплой, холодной и контрастной цветокоррекции с пояснением воздействия на мозг."
  },
  {
    id: 23,
    title: "Утренний серфинг на рассвете: морской бриз",
    client: "Спортивный лагерь",
    category: "lifestyle",
    views: "1.3M просмотров",
    thumb: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=600&h=1067&q=80",
    videoSrc: "https://assets.mixkit.co/videos/preview/mixkit-sports-car-driving-on-a-highway-at-sunset-41489-large.mp4",
    desc: "Кадры брызг волн на рассвете, запечатленные на экшн-оборудование с поляризационным фильтром."
  },
  {
    id: 24,
    title: "Краш-тест противоударного чехла для смартфона",
    client: "Аксессуары для гаджетов",
    category: "commercial",
    views: "3.1M просмотров",
    thumb: "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=600&h=1067&q=80",
    videoSrc: "https://assets.mixkit.co/videos/preview/mixkit-holding-and-showing-a-smartphone-41718-large.mp4",
    desc: "Эмоциональное падение телефона с высоты 3 метров на асфальт в замедленной съемке. Видео мгновенно разлетелось по рекомендациям."
  },
  {
    id: 25,
    title: "Синхронизация бита: ультрадинамичный монтаж портфолио",
    client: "Showreel 2026",
    category: "reels",
    views: "1.9M просмотров",
    thumb: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&h=1067&q=80",
    videoSrc: "https://assets.mixkit.co/videos/preview/mixkit-cameraman-recording-with-a-camera-at-a-studio-41485-large.mp4",
    desc: "Каждая смена плана и вспышка строго попадает в бас и хай-хеты музыкального трека. Шоурил собрал десятки входящих заявок."
  },
  {
    id: 26,
    title: "Недвижимость бизнес-класса: обзор пентхауса с террасой",
    client: "Агентство недвижимости",
    category: "commercial",
    views: "760K просмотров",
    thumb: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&h=1067&q=80",
    videoSrc: "https://assets.mixkit.co/videos/preview/mixkit-two-people-talking-in-an-office-meeting-41484-large.mp4",
    desc: "Широкоугольные пролеты по интерьеру с плавным выходом на закатную террасу с видом на город."
  },
  {
    id: 27,
    title: "3 книги, которые перевернули мое понимание визуала",
    client: "Блог креатора",
    category: "expert",
    views: "430K просмотров",
    thumb: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&h=1067&q=80",
    videoSrc: "https://assets.mixkit.co/videos/preview/mixkit-young-woman-talking-on-a-video-call-42866-large.mp4",
    desc: "Плотный экспертный контент без «воды»: ключевая мысль из каждой книги и как применить ее в видео сегодня."
  },
  {
    id: 28,
    title: "Атмосфера коворкинга: работа над новым продакшном",
    client: "CHECHEVATA",
    category: "lifestyle",
    views: "520K просмотров",
    thumb: "https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?auto=format&fit=crop&w=600&h=1067&q=80",
    videoSrc: "https://assets.mixkit.co/videos/preview/mixkit-woman-working-on-her-laptop-in-a-coffee-shop-41717-large.mp4",
    desc: "Сосредоточенная работа за монтажным монитором, горячий чай и обсуждение раскадровок с коллегами."
  },
  {
    id: 29,
    title: "Трендовый зум-переход: эффект бесконечного портала",
    client: "Визуальные эффекты",
    category: "reels",
    views: "2.3M просмотров",
    thumb: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&h=1067&q=80",
    videoSrc: "https://assets.mixkit.co/videos/preview/mixkit-hands-holding-a-smartphone-in-a-neon-room-42861-large.mp4",
    desc: "Монтажная склейка сквозь экран смартфона в реальную локацию. Сложный маскинг и трекинг движения в Premiere Pro."
  },
  {
    id: 30,
    title: "Презентация барбершопа: стиль, лезвие и рок-н-ролл",
    client: "Барбершоп 'Old School'",
    category: "commercial",
    views: "880K просмотров",
    thumb: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=600&h=1067&q=80",
    videoSrc: "https://assets.mixkit.co/videos/preview/mixkit-man-doing-push-ups-in-a-gym-41490-large.mp4",
    desc: "Опасная бритва крупным планом, пена, пар от горячего полотенца и винтажный гранжевый цветовой профиль."
  },
  {
    id: 31,
    title: "Как бороться со страхом камеры: совет спикерам",
    client: "Школа ораторского искусства",
    category: "expert",
    views: "690K просмотров",
    thumb: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=600&h=1067&q=80",
    videoSrc: "https://assets.mixkit.co/videos/preview/mixkit-young-woman-talking-on-a-video-call-42866-large.mp4",
    desc: "3 психологические практики расслабления речевого аппарата перед съемкой в студии."
  },
  {
    id: 32,
    title: "Закат на крыше небоскреба: финальные кадры проекта",
    client: "Финальный шоурил",
    category: "lifestyle",
    views: "1.5M просмотров",
    thumb: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&h=1067&q=80",
    videoSrc: "https://assets.mixkit.co/videos/preview/mixkit-sports-car-driving-on-a-highway-at-sunset-41489-large.mp4",
    desc: "Эпичный закат над городом, съемка силуэта против солнца в золотой час (Golden Hour). Идеальная точка в портфолио."
  }
];

// Карта названий категорий
const categoryLabels = {
  reels: "Reels & Shorts",
  commercial: "Реклама",
  expert: "Экспертный",
  lifestyle: "Lifestyle"
};

/* ==========================================================================
   Инициализация интерфейса
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const videoGrid = document.getElementById("videoGrid");
  const filterBtns = document.querySelectorAll(".filter-btn");

  // Рендер сетки видео
  function renderVideos(items) {
    videoGrid.innerHTML = "";
    
    items.forEach((item) => {
      const card = document.createElement("article");
      card.className = "video-card";
      card.setAttribute("data-id", item.id);
      card.setAttribute("tabindex", "0");
      card.setAttribute("role", "button");
      card.setAttribute("aria-label", `Смотреть видео: ${item.title}`);

      card.innerHTML = `
        <div class="video-thumb-wrapper">
          <img src="${item.thumb}" alt="${item.title}" class="video-thumb-img" loading="lazy" />
        </div>

        <div class="card-play-center">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z"/>
          </svg>
        </div>

        <div class="video-card-overlay">
          <div class="card-top-row">
            <span class="card-badge">${categoryLabels[item.category] || item.category}</span>
            <span class="card-views">${item.views}</span>
          </div>

          <div class="card-bottom-info">
            <h3 class="card-title">${item.title}</h3>
            <span class="card-client">${item.client}</span>
          </div>
        </div>
      `;

      // Клик открывает модальный плеер
      card.addEventListener("click", () => openModal(item));
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openModal(item);
        }
      });

      videoGrid.appendChild(card);
    });
  }

  // Первоначальный рендер всех 32 работ
  renderVideos(portfolioItems);

  // Фильтрация
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.getAttribute("data-filter");
      if (filter === "all") {
        renderVideos(portfolioItems);
      } else {
        const filtered = portfolioItems.filter((item) => item.category === filter);
        renderVideos(filtered);
      }
    });
  });

  // ==========================================================================
  // Модальный плеер
  // ==========================================================================
  const modal = document.getElementById("videoModal");
  const modalBackdrop = document.getElementById("modalBackdrop");
  const modalCloseBtn = document.getElementById("modalCloseBtn");
  const modalVideo = document.getElementById("modalVideoPlayer");
  const modalIframe = document.getElementById("modalIframePlayer");

  const modalCategory = document.getElementById("modalCategory");
  const modalViews = document.getElementById("modalViews");
  const modalTitle = document.getElementById("modalTitle");
  const modalDesc = document.getElementById("modalDesc");

  function openModal(item) {
    modalCategory.textContent = categoryLabels[item.category] || item.category;
    modalViews.textContent = `🔥 ${item.views}`;
    modalTitle.textContent = item.title;
    modalDesc.textContent = item.desc;

    if (item.embedUrl) {
      // Если видео на YouTube/VK/Rutube
      modalVideo.style.display = "none";
      modalVideo.pause();
      modalVideo.src = "";
      
      modalIframe.style.display = "block";
      modalIframe.src = item.embedUrl + "?autoplay=1";
    } else if (item.videoSrc) {
      // Если прямой видеофайл MP4/WebM
      modalIframe.style.display = "none";
      modalIframe.src = "";

      modalVideo.style.display = "block";
      modalVideo.src = item.videoSrc;
      modalVideo.currentTime = 0;
      modalVideo.play().catch(() => {
        // автовоспроизведение со звуком может быть заблокировано браузером
      });
    }

    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";

    // Останавливаем воспроизведение
    modalVideo.pause();
    modalVideo.src = "";
    modalIframe.src = "";
  }

  modalCloseBtn.addEventListener("click", closeModal);
  modalBackdrop.addEventListener("click", closeModal);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("active")) {
      closeModal();
    }
  });

  // ==========================================================================
  // Мобильное меню
  // ==========================================================================
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const mobileDrawer = document.getElementById("mobileDrawer");
  const drawerLinks = document.querySelectorAll(".drawer-link");

  if (mobileMenuBtn && mobileDrawer) {
    mobileMenuBtn.addEventListener("click", () => {
      mobileDrawer.classList.toggle("open");
    });

    drawerLinks.forEach((link) => {
      link.addEventListener("click", () => {
        mobileDrawer.classList.remove("open");
      });
    });
  }
});
