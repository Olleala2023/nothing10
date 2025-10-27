import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Copy app files to dist
const sourceDir = path.join(__dirname, '../app');
const destDir = path.join(__dirname, '../dist/app');

// Create app directory in dist
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

// Copy files
const files = ['index.html', 'app.js', 'style.css'];

files.forEach(file => {
  const sourceFile = path.join(sourceDir, file);
  const destFile = path.join(destDir, file);
  
  if (fs.existsSync(sourceFile)) {
    fs.copyFileSync(sourceFile, destFile);
    console.log(`Copied ${file} to dist/app/`);
  } else {
    console.log(`Warning: ${file} not found in app/`);
  }
});

console.log('App files copied successfully!');
