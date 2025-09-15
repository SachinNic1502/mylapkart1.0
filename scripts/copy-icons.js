const fs = require('fs');
const path = require('path');

// Simple script to copy the existing logo to required PWA icon filenames
// This is a temporary solution until proper sized icons are created

const iconsDir = path.join(__dirname, '..', 'public', 'icons');
const sourceFile = path.join(iconsDir, 'mylapkart1.png');

const iconSizes = [16, 32, 72, 96, 128, 144, 152, 180, 192, 384, 512];

if (!fs.existsSync(sourceFile)) {
  console.error('Source file not found:', sourceFile);
  process.exit(1);
}

console.log('Copying mylapkart1.png to required PWA icon filenames...');

iconSizes.forEach(size => {
  const targetFile = path.join(iconsDir, `icon-${size}x${size}.png`);
  fs.copyFileSync(sourceFile, targetFile);
  console.log(`Created: icon-${size}x${size}.png`);
});

console.log('\nAll PWA icons created!');
console.log('Note: These are copies of the same image.');
console.log('For production, create properly sized icons using:');
console.log('- https://www.pwabuilder.com/imageGenerator');
console.log('- https://realfavicongenerator.net/');
console.log('- Or use image editing software to resize each icon properly');
