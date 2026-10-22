const fs = require('fs');
const crypto = require('crypto');
const https = require('https');
const path = require('path');

const FOLDER_ID = '1jPSdn-z-C3uglhDuXSXQu9N7Ah3v98gz';
const CRED_PATH = path.join(__dirname, 'credentials.json');
const OUTPUT_FILE = path.join(__dirname, 'videos.json');

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
  return new Promise((resolve, reject) => {
    const now = Math.floor(Date.now() / 1000);
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
            resolve(json.access_token);
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

async function runSingleSync() {
  if (!fs.existsSync(CRED_PATH)) {
    console.error('credentials.json not found!');
    return;
  }

  const creds = JSON.parse(fs.readFileSync(CRED_PATH, 'utf8'));
  const token = await getAccessToken(creds);
  const driveRes = await fetchDriveFolderFiles(token);

  const files = driveRes.files || [];
  console.log(`Found ${files.length} video files in Google Drive folder.`);

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
  console.log(`Updated ${OUTPUT_FILE} successfully.`);
}

runSingleSync().catch(err => {
  console.error('Sync failed:', err);
  process.exit(1);
});
