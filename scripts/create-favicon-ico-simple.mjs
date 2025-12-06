// Script to create a proper ICO file from SVG with 16x16, 32x32, and 48x48 sizes
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const svgPath = path.join(__dirname, '../client/public/favicon.svg');
const icoPath = path.join(__dirname, '../client/public/favicon.ico');

console.log('Creating favicon.ico from SVG with 16x16, 32x32, and 48x48 sizes...');

try {
  const sharp = (await import('sharp')).default;
  const toIco = (await import('to-ico')).default;
  
  // Read SVG
  const svgBuffer = fs.readFileSync(svgPath);
  
  // Create ICO with multiple sizes (16x16, 32x32, 48x48) for Google Search optimization
  console.log('Converting SVG to ICO with sizes: 16x16, 32x32, 48x48...');
  
  // Create PNG buffers for each size
  const sizes = [16, 32, 48];
  const pngBuffers = await Promise.all(
    sizes.map(async (size) => {
      console.log(`  Creating ${size}x${size} PNG...`);
      return await sharp(svgBuffer)
        .resize(size, size, { 
          fit: 'contain', 
          background: { r: 255, g: 255, b: 255, alpha: 0 } 
        })
        .png()
        .toBuffer();
    })
  );
  
  // Combine PNGs into ICO
  console.log('Combining PNGs into ICO format...');
  const icoBuffer = await toIco(pngBuffers);
  
  // Write ICO file
  fs.writeFileSync(icoPath, icoBuffer);
  console.log(`✅ Successfully created ${icoPath}`);
  console.log(`   File size: ${(icoBuffer.length / 1024).toFixed(2)} KB`);
  console.log(`   Contains: 16x16, 32x32, and 48x48 pixel sizes`);
  console.log(`   ✅ Optimized for Google Search!`);
  
} catch (error) {
  console.error('Error creating ICO file:', error.message);
  console.error(error.stack);
  process.exit(1);
}
