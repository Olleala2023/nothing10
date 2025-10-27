import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateIcons() {
  const iconsDir = path.join(__dirname, '../public/icons');
  
  // Generate 192x192 PNG
  await sharp(path.join(iconsDir, 'icon-192.svg'))
    .png()
    .resize(192, 192)
    .toFile(path.join(iconsDir, 'icon-192.png'));
  
  // Generate 512x512 PNG
  await sharp(path.join(iconsDir, 'icon-512.svg'))
    .png()
    .resize(512, 512)
    .toFile(path.join(iconsDir, 'icon-512.png'));
  
  // Generate 512x512 maskable PNG
  await sharp(path.join(iconsDir, 'icon-512-maskable.svg'))
    .png()
    .resize(512, 512)
    .toFile(path.join(iconsDir, 'icon-512-maskable.png'));
  
  console.log('Icons generated successfully!');
}

generateIcons().catch(console.error);
