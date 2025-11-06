import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Move app/index.html from dist/src/app/ to dist/app/
const sourceFile = path.join(__dirname, '../dist/src/app/index.html');
const destDir = path.join(__dirname, '../dist/app');
const destFile = path.join(destDir, 'index.html');

if (fs.existsSync(sourceFile)) {
  // Create app directory if it doesn't exist
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  
  // Read the file content
  let content = fs.readFileSync(sourceFile, 'utf8');
  
  // Update asset paths: /assets/app/index.html-*.js -> /assets/app/index.html-*.js
  // The paths should already be correct, but we need to make sure
  // Update the script src to point to the correct location
  content = content.replace(
    /src="\/assets\/app\/index\.html-([^"]+)\.js"/g,
    'src="/assets/app/index.html-$1.js"'
  );
  
  // Write to destination
  fs.writeFileSync(destFile, content, 'utf8');
  console.log('✓ Moved app/index.html to dist/app/index.html');
} else {
  console.error('✗ Source file not found:', sourceFile);
  process.exit(1);
}

