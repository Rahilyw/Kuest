const fs = require('fs');
const path = require('path');

// Minimal valid PNG files (solid color: #0F172A - Kuest dark indigo)
// These are base64-encoded 1x1 placeholder PNGs that can be scaled

const iconBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFUlEQVR42mMP0Pj/HwMDAwMD+wMABY4DHhWPsR0AAAAASUVORK5CYII=';
const splashBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFUlEQVR42mMP0Pj/HwMDAwMD+wMABY4DHhWPsR0AAAAASUVORK5CYII=';

const assetsDir = path.join(__dirname, 'assets');
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// Write icon.png
fs.writeFileSync(
  path.join(assetsDir, 'icon.png'),
  Buffer.from(iconBase64, 'base64')
);
console.log('✓ Created assets/icon.png');

// Write splash.png
fs.writeFileSync(
  path.join(assetsDir, 'splash.png'),
  Buffer.from(splashBase64, 'base64')
);
console.log('✓ Created assets/splash.png');
