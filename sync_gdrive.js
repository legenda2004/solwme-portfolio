const fs = require('fs');
const crypto = require('crypto');
const https = require('https');
const path = require('path');

const FOLDER_ID = '1jPSdn-z-C3uglhDuXSXQu9N7Ah3v98gz';
const CRED_PATH = path.join(__dirname, 'credentials.json');
const OUTPUT_FILE = path.join(__dirname, 'videos.json');

// Интервал проверки в миллисекундах (5 секунд — оптимальный реальный тайминг без блокировок API)
const CHECK_INTERVAL_MS = 5000;

let lastToken = null;
let tokenExpiresAt = 0;
let lastHash = '';

// Умная категоризация
function detectCategory(name, desc) {
  const text = `${name || ''} ${desc || ''}`.toLowerCase();

  if (
    text.includes('эксперт') || text.includes('разбор') || text.includes('совет') ||
    text.includes('урок') || text.includes('алгоритм') || text.includes('интервью') ||
    text.includes('обучени') || text.includes('мышлени') || text.includes('стратеги') ||
    text.includes('как ') || text.includes('топ') || text.includes('фишк') ||
    text.includes('книг') || text.includes('ошибк')
  ) {
    return 'expert';
  }

  if (
    text.includes('реклам') || text.includes('бренд') || text.includes('ugc') ||
    text.includes('промо') || text.includes('обзор') || text.includes('товар') ||
    text.includes('магазин') || text.includes('кофейн') || text.includes('авто') ||
    text.includes('студи') || text.includes('дроп') || text.includes('распаковк') ||
    text.includes('заказ') || text.includes('twoeye')
  ) {
    return 'commercial';
  }

  if (
    text.includes('лайф') || text.includes('life') || text.includes('день') ||
    text.includes('влог') || text.includes('атмосфер') || text.includes('ноч') ||
    text.includes('закат') || text.includes('стрит') || text.includes('прогулк') ||
    text.includes('коворкинг') || text.includes('бэкстейдж') || text.includes('chechevata') ||
    text.includes('эстетик')
  ) {
    return 'lifestyle';
  }

  return 'reels';
}

function getAccessToken(creds) {
  const now = Math.floor(Date.now() / 1000);
  if (lastToken && tokenExpiresAt > now + 60) {
    return Promise.resolve(lastToken);
  }

  return new Promise((resolve, reject) => {
    const header = { alg: 'RS256', typ: 'JWT' };
    const claimSet = {
      iss: creds.client_email,
      scope: 'https://www.googleapis.com/auth/drive.readonly',
      aud: creds.token_uri,
      exp: now + 3600,
      iat: now
    };

    const b64Header = Buffer.from(JSON.stringify(header)).toString('base64url');
    const b64Claim = Buffer.from(JSON.stringify(claimSet)).toString('base64url');
    const signInput = `${b64Header}.${b64Claim}`;

    const signer = crypto.createSign('RSA-SHA256');
    signer.update(signInput);
    const signature = signer.sign(creds.private_key, 'base64url');
    const jwt = `${signInput}.${signature}`;

    const postData = `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${jwt}`;
    const req = https.request(creds.token_uri, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(body);
          if (json.access_token) {
            lastToken = json.access_token;
            tokenExpiresAt = now + 3500;
            resolve(lastToken);
          } else {
            reject(new Error(JSON.stringify(json)));
          }
        } catch (e) {
          reject(e);
        }
      });
    });
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

function fetchDriveFolderFiles(token) {
  return new Promise((resolve, reject) => {
    const query = encodeURIComponent(`'${FOLDER_ID}' in parents and mimeType contains 'video/' and trashed = false`);
    const fields = encodeURIComponent('files(id,name,mimeType,description,createdTime,size)');
    const orderBy = encodeURIComponent('createdTime desc');
    const pathUrl = `/drive/v3/files?q=${query}&fields=${fields}&orderBy=${orderBy}&pageSize=100`;

    const req = https.request({
      hostname: 'www.googleapis.com',
      path: pathUrl,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (e) {
          reject(e);
        }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

async function checkAndSync() {
  if (!fs.existsSync(CRED_PATH)) return;

  try {
    const creds = JSON.parse(fs.readFileSync(CRED_PATH, 'utf8'));
    const token = await getAccessToken(creds);
    const driveRes = await fetchDriveFolderFiles(token);

    const files = driveRes.files || [];
    const currentHash = JSON.stringify(files.map(f => `${f.id}:${f.name}`));

    // Записываем только если состав файлов изменился (добавились или удалились)
    if (currentHash !== lastHash) {
      lastHash = currentHash;
      const formattedVideos = files.map((file, idx) => {
        const cleanTitle = file.name.replace(/\.[a-zA-Z0-9]+$/, '');
        const category = detectCategory(cleanTitle, file.description);

        return {
          id: file.id,
          num: idx + 1,
          title: cleanTitle,
          subtitle: file.description || 'Вертикальное видео · Reels / Shorts',
          category: category,
          previewUrl: `https://drive.google.com/file/d/${file.id}/preview`,
          streamUrl: `https://drive.google.com/uc?export=download&id=${file.id}`,
          thumbnailUrl: `https://drive.google.com/thumbnail?id=${file.id}&sz=w1000`,
          createdTime: file.createdTime
        };
      });

      fs.writeFileSync(OUTPUT_FILE, JSON.stringify(formattedVideos, null, 2), 'utf8');
      const timeStr = new Date().toLocaleTimeString();
      console.log(`[${timeStr}] Синхронизировано: ${formattedVideos.length} видео из Google Диска.`);
    }
  } catch (err) {
    // Тихо продолжаем цикл при мелких сетевых сбоях
  }
}

console.log(`[Google Drive Live Watcher] Запущен мониторинг папки ${FOLDER_ID}`);
console.log(`[Google Drive Live Watcher] Проверка каждые ${CHECK_INTERVAL_MS / 1000} сек. Нажмите Ctrl+C для остановки.`);

// Первичный опрос и запуск цикличного наблюдателя
checkAndSync();
setInterval(checkAndSync, CHECK_INTERVAL_MS);
