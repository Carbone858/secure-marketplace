
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const directoryPath = path.join(__dirname, 'public', 'images', 'discovery');

async function processImages() {
  const files = fs.readdirSync(directoryPath);

  for (const file of files) {
    const filePath = path.join(directoryPath, file);
    const ext = path.extname(file).toLowerCase();
    
    // Only process images
    if (!['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) continue;

    const baseName = path.basename(file, ext);
    // Sanitize the file name: lowercase, replace spaces with hyphens, remove extra hyphens
    const sanitizedName = baseName.trim().toLowerCase().replace(/[\s&]+/g, '-').replace(/-+/g, '-').replace(/-$/, '');
    
    const newFileName = `${sanitizedName}.webp`;
    const newFilePath = path.join(directoryPath, newFileName);

    try {
      if (file !== newFileName) {
        // Convert and optimize to webp
        await sharp(filePath)
          .webp({ quality: 80 })
          .toFile(newFilePath);
        
        console.log(`Converted: ${file} -> ${newFileName}`);
        
        // Delete original file
        fs.unlinkSync(filePath);
      } else if (ext === '.webp') {
         // It's already webp, just ensure it's optimized and renamed if needed
         const tempPath = path.join(directoryPath, `temp_${newFileName}`);
         await sharp(filePath)
          .webp({ quality: 80 })
          .toFile(tempPath);
         
         fs.unlinkSync(filePath);
         fs.renameSync(tempPath, newFilePath);
         console.log(`Optimized: ${file}`);
      }
    } catch (err) {
      console.error(`Error processing ${file}:`, err);
    }
  }
}

processImages().then(() => console.log('Done processing images.'));
