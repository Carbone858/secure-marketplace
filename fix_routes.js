const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (item === 'route.ts' || item === 'route.js') {
      const content = fs.readFileSync(fullPath, 'utf8');
      if (!content.includes('export const dynamic')) {
        fs.writeFileSync(fullPath, "export const dynamic = 'force-dynamic';\n" + content);
      }
    }
  }
}

try {
  processDir(path.join(process.cwd(), 'src', 'app', 'api'));
  console.log('Successfully prepended force-dynamic to all route.ts files');
} catch (error) {
  console.error(error);
}
