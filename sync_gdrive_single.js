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

function fetchAllDriveFiles(token, folderId) {
  return new Promise((resolve, reject) => {
    let allFiles = [];

    function fetchPage(pageToken) {
      let pathUrl = `/drive/v3/files?q=${encodeURIComponent(`'${folderId}' in parents and trashed = false`)}&fields=${encodeURIComponent('nextPageToken,files(id,name,mimeType,parents,description,createdTime,size)')}&pageSize=100`;
      if (pageToken) {
        pathUrl += `&pageToken=${encodeURIComponent(pageToken)}`;
      }

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
            const data = JSON.parse(body);
            if (data.files) allFiles = allFiles.concat(data.files);
            if (data.nextPageToken) {
              fetchPage(data.nextPageToken);
            } else {
              resolve(allFiles);
            }
          } catch (e) {
            reject(e);
          }
        });
      });
      req.on('error', reject);
      req.end();
    }

    fetchPage(null);
  });
}

async function run() {
  if (!fs.existsSync(CRED_PATH)) return;
  const creds = JSON.parse(fs.readFileSync(CRED_PATH, 'utf8'));
  const token = await getAccessToken(creds);

  // 1. Получаем список подпапок
  const subfolders = await fetchAllDriveFiles(token, PARENT_FOLDER_ID);
  const folderMap = {};
  for (const f of subfolders) {
    if (f.mimeType === 'application/vnd.google-apps.folder') {
      const cat = FOLDER_CATEGORY_MAP[f.name] || 'reels';
      folderMap[f.id] = { name: f.name, category: cat };
    }
  }

  // 2. Получаем файлы из каждой подпапки с пагинацией!
  let allFiles = [];
  const rootFiles = await fetchAllDriveFiles(token, PARENT_FOLDER_ID);
  allFiles = allFiles.concat(rootFiles.filter(f => f.mimeType !== 'application/vnd.google-apps.folder'));

  for (const sfId of Object.keys(folderMap)) {
    const sFiles = await fetchAllDriveFiles(token, sfId);
    allFiles = allFiles.concat(sFiles.filter(f => f.mimeType !== 'application/vnd.google-apps.folder'));
  }

  console.log(`Всего файлов получено с Google Диска: ${allFiles.length}`);

  // Аватарка
  const avatarUrl = 'https://drive.google.com/thumbnail?id=1vq3d-nN7rCsZ-0P87f91VX048iDaYDDd&sz=w1200';

  // Файлы соцсетей
  const socialScreenshots = { tg: [], insta: [], tiktok: [] };
  const mediaItems = [];

  for (const file of allFiles) {
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
      continue;
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

  socialScreenshots.tg.sort((a,b) => a.name.localeCompare(b.name));
  socialScreenshots.insta.sort((a,b) => a.name.localeCompare(b.name));
  socialScreenshots.tiktok.sort((a,b) => a.name.localeCompare(b.name));

  const result = {
    avatarUrl: avatarUrl,
    socialScreenshots: socialScreenshots,
    items: mediaItems
  };

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(result, null, 2), 'utf8');
  console.log(`[Sync] Успешно сохранено: ${mediaItems.length} работ.`);
  const counts = {};
  mediaItems.forEach(i => counts[i.category] = (counts[i.category] || 0) + 1);
  console.log('По категориям:', counts);
}

run().catch(console.error);
