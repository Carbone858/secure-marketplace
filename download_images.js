
const https = require('https');
const fs = require('fs');
const path = require('path');

const images = [
  { name: 'ac-repair.jpg', id: 'kpZiPQqZSpc' },
  { name: 'ac-maint.jpg', id: 'iS5GDeLDk0E' },
  { name: 'central-ac.jpg', id: 'ePghIEczhnI' },
  { name: 'elec-wiring.jpg', id: 'c1L0UMRoXM0' },
  { name: 'elec-repair.jpg', id: 'lPcXuJyoIjU' },
  { name: 'plum-leak.jpg', id: 'e2twQyucgbI' },
  { name: 'plum-pipes.jpg', id: '9Y3YGj7f9e8' },
  { name: 'clean-home.jpg', id: 'M_S93s_iPyE' },
  { name: 'clean-deep.jpg', id: 'G_N5SjshnBM' }
];

const dest = path.join('c:', 'Users', 't3sfo', 'Projects', 'secure-marketplace', 'public', 'images', 'discovery');

function download(url, filePath) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    };
    https.get(url, options, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return download(res.headers.location, filePath).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Status: ${res.statusCode} for ${url}`));
      }
      const file = fs.createWriteStream(filePath);
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`Success: ${path.basename(filePath)} (${fs.statSync(filePath).size} bytes)`);
        resolve();
      });
    }).on('error', reject);
  });
}

async function run() {
  for (const img of images) {
    // Unsplash usually wants 'photo-' prefix for the ACTUAL binary delivery in some paths
    // but the subagent verified short IDs. We'll try the proper hotlinking URL.
    const url = `https://images.unsplash.com/photo-${img.id}?w=800&q=80`;
    try {
      await download(url, filePath = path.join(dest, img.name));
    } catch (e) {
      // Try without photo- prefix
      try {
          await download(`https://images.unsplash.com/${img.id}?w=800&q=80`, path.join(dest, img.name));
      } catch(e2) {
          console.error(`Failed ${img.name}: ${e2.message}`);
      }
    }
  }
}

run();
