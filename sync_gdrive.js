const fs = require('fs');
const crypto = require('crypto');
const https = require('https');
const path = require('path');

const PARENT_FOLDER_ID = '1jPSdn-z-C3uglhDuXSXQu9N7Ah3v98gz';
const CRED_PATH = path.join(__dirname, 'credentials.json');
const OUTPUT_FILE = path.join(__dirname, 'videos.json');

// Соответствие названий подпапок и системных ключей категорий
const FOLDER_CATEGORY_MAP = {
  'SMM': 'smm',
  'UGC контент-завод': 'ugc',
  'Рекламные': 'commercial',
  'Рестораны': 'restaurants',
  'Атмосфера': 'lifestyle',
  'Дизайн': 'design'
};

function getAccessToken(creds) {
  return new Promise((resolve, reject) => {
    const now = Math.floor(Date.now() / 1000);
    const header = { alg: 'RS256', typ: 'JWT' };
    const claimSet = {
      iss: creds.client_email,
      scope: 'https://www.googleapis.com/auth/drive',
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
          if (json.access_token) resolve(json.access_token);
          else reject(new Error(JSON.stringify(json)));
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

function queryFiles(token, query, fields) {
  return new Promise((resolve, reject) => {
    const pathUrl = `/drive/v3/files?q=${encodeURIComponent(query)}&fields=${encodeURIComponent(fields)}&pageSize=100`;
    const req = https.request({
      hostname: 'www.googleapis.com',
      path: pathUrl,
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
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

async function run() {
  if (!fs.existsSync(CRED_PATH)) return;
  const creds = JSON.parse(fs.readFileSync(CRED_PATH, 'utf8'));
  const token = await getAccessToken(creds);

  // 1. Получаем список подпапок внутри главной папки
  const subfoldersRes = await queryFiles(token, `'${PARENT_FOLDER_ID}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false`, 'files(id,name)');
  const subfolders = subfoldersRes.files || [];

  const folderMap = {};
  for (const f of subfolders) {
    const cat = FOLDER_CATEGORY_MAP[f.name] || 'reels';
    folderMap[f.id] = { name: f.name, category: cat };
  }

  // 2. Ищем все медиафайлы (видео и фото) внутри этих подпапок + в корневой папке
  const folderIds = [PARENT_FOLDER_ID, ...subfolders.map(f => f.id)];
  const parentQuery = folderIds.map(id => `'${id}' in parents`).join(' or ');
  const mediaQuery = `(${parentQuery}) and (mimeType contains 'video/' or mimeType contains 'image/') and trashed = false`;
  const fields = 'files(id,name,mimeType,parents,description,createdTime,size)';

  const filesRes = await queryFiles(token, mediaQuery, fields);
  const files = filesRes.files || [];

  // Аватарка из указанной ссылки пользователем (ID: 1vq3d-nN7rCsZ-0P87f91VX048iDaYDDd)
  const avatarUrl = 'https://drive.google.com/thumbnail?id=1vq3d-nN7rCsZ-0P87f91VX048iDaYDDd&sz=w1200';

  // Файлы соцсетей для карточек
  const socialScreenshots = {
    tg: [],
    insta: [],
    tiktok: []
  };

  const mediaItems = [];

  for (const file of files) {
    const cleanTitle = file.name.replace(/\.[a-zA-Z0-9]+$/, '').toLowerCase();

    // Исключаем скриншоты соцсетей и аватарку из общей сетки работ
    if (/^(tg1|tg2)$/.test(cleanTitle)) {
      socialScreenshots.tg.push({
        id: file.id,
        name: cleanTitle,
        url: `https://drive.google.com/thumbnail?id=${file.id}&sz=w1000`
      });
      continue;
    }
    if (/^(inst1|inst2|inst3|inst4)$/.test(cleanTitle)) {
      socialScreenshots.insta.push({
        id: file.id,
        name: cleanTitle,
        url: `https://drive.google.com/thumbnail?id=${file.id}&sz=w1000`
      });
      continue;
    }
    if (/^(tiktok1|tiktok2)$/.test(cleanTitle)) {
      socialScreenshots.tiktok.push({
        id: file.id,
        name: cleanTitle,
        url: `https://drive.google.com/thumbnail?id=${file.id}&sz=w1000`
      });
      continue;
    }
    if (file.id === '1vq3d-nN7rCsZ-0P87f91VX048iDaYDDd' || file.id === '1eGfoZHGgGNPiR51DuTGN5VMeaIb9Z6ag') {
      continue; // аватарку не выводим в общую галерею работ
    }

    const isImage = file.mimeType.startsWith('image/');

    // Определяем категорию по родительской папке
    let category = 'reels';
    let folderName = 'Портфолио';
    if (file.parents && file.parents.length > 0) {
      const pId = file.parents[0];
      if (folderMap[pId]) {
        category = folderMap[pId].category;
        folderName = folderMap[pId].name;
      }
    }

    mediaItems.push({
      id: file.id,
      title: file.name.replace(/\.[a-zA-Z0-9]+$/, ''),
      subtitle: file.description || '',
      category: category,
      type: isImage ? 'image' : 'video',
      previewUrl: `https://drive.google.com/file/d/${file.id}/preview`,
      streamUrl: `https://drive.google.com/uc?export=download&id=${file.id}`,
      thumbnailUrl: `https://drive.google.com/thumbnail?id=${file.id}&sz=w1000`,
      createdTime: file.createdTime
    });
  }

  // Сортируем соц. скриншоты по алфавиту (tg1, tg2...)
  socialScreenshots.tg.sort((a,b) => a.name.localeCompare(b.name));
  socialScreenshots.insta.sort((a,b) => a.name.localeCompare(b.name));
  socialScreenshots.tiktok.sort((a,b) => a.name.localeCompare(b.name));

  const result = {
    avatarUrl: avatarUrl,
    socialScreenshots: socialScreenshots,
    items: mediaItems
  };

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(result, null, 2), 'utf8');
  console.log(`[Sync] Работ в сетке: ${mediaItems.length}. TG скриншотов: ${socialScreenshots.tg.length}. Insta: ${socialScreenshots.insta.length}. TT: ${socialScreenshots.tiktok.length}.`);
}

run().catch(console.error);
