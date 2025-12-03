// Script to create 720x720 logo versions (PNG and ICO) from SVG
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const svgPath = path.join(__dirname, '../client/public/logo-720x720.svg');
const pngPath = path.join(__dirname, '../client/public/logo-720x720.png');
const icoPath = path.join(__dirname, '../client/public/logo-720x720.ico');

console.log('Creating 720×720 logo files for Google Business Profile...');

try {
  const sharp = (await import('sharp')).default;
  const toIco = (await import('to-ico')).default;
  
  // Read SVG
  const svgBuffer = fs.readFileSync(svgPath);
  
  console.log('1. Creating PNG (720×720)...');
  // Create PNG at 720×720
  const pngBuffer = await sharp(svgBuffer)
    .resize(720, 720, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .png()
    .toBuffer();
  
  fs.writeFileSync(pngPath, pngBuffer);
  console.log(`   ✅ Created ${pngPath} (${pngBuffer.length} bytes)`);
  
  console.log('2. Creating ICO (with multiple sizes up to 256×256 - ICO format limit)...');
  // Create ICO with multiple sizes: 16, 32, 48, 64, 128, 256 (ICO format max is 256×256)
  const sizes = [16, 32, 48, 64, 128, 256];
  const pngBuffers = await Promise.all(
    sizes.map(size => 
      sharp(svgBuffer)
        .resize(size, size, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
        .png()
        .toBuffer()
    )
  );
  
  // Create ICO file
  const icoBuffer = await toIco(pngBuffers);
  fs.writeFileSync(icoPath, icoBuffer);
  console.log(`   ✅ Created ${icoPath} (${icoBuffer.length} bytes)`);
  
  console.log('\n✅ All 720×720 logo files created successfully!');
  console.log(`   - SVG: ${svgPath}`);
  console.log(`   - PNG: ${pngPath}`);
  console.log(`   - ICO: ${icoPath}`);
  
} catch (error) {
  console.error('Error creating logo files:', error.message);
  console.log('\n📝 Manual steps:');
  console.log('1. SVG already created: client/public/logo-720x720.svg');
  console.log('2. Convert SVG to PNG at https://convertio.co/svg-png/');
  console.log('3. Convert PNG to ICO at https://convertio.co/png-ico/');
  process.exit(1);
}
