// Script to create a proper ICO file from SVG
// This will use sharp to convert SVG to ICO with multiple sizes
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const svgPath = path.join(__dirname, '../client/public/favicon.svg');
const icoPath = path.join(__dirname, '../client/public/favicon.ico');

console.log('Creating favicon.ico from SVG...');

try {
  // Try to use sharp if available
  const sharp = (await import('sharp')).default;
  
  // Read SVG
  const svgBuffer = fs.readFileSync(svgPath);
  
  // Create ICO with multiple sizes (16x16, 32x32, 48x48) for best compatibility
  // ICO format requires multiple sizes embedded
  console.log('Converting SVG to ICO with multiple sizes...');
  
  // Create PNG buffers for each size
  const sizes = [16, 32, 48];
  const pngBuffers = await Promise.all(
    sizes.map(size => 
      sharp(svgBuffer)
        .resize(size, size, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
        .png()
        .toBuffer()
    )
  );
  
  // Use to-ico to combine PNGs into ICO
  const toIco = (await import('to-ico')).default;
  const icoBuffer = await toIco(pngBuffers);
  
  // Write ICO file
  fs.writeFileSync(icoPath, icoBuffer);
  console.log(`✅ Successfully created ${icoPath}`);
  console.log(`   File size: ${icoBuffer.length} bytes`);
  
} catch (error) {
  console.error('Error creating ICO file:', error.message);
  console.log('\n📝 Manual steps to create favicon.ico:');
  console.log('1. Go to https://convertio.co/svg-ico/');
  console.log('2. Upload:', svgPath);
  console.log('3. Download the ICO file');
  console.log('4. Save it as:', icoPath);
  console.log('\nOr use: https://www.icoconverter.com/');
  process.exit(1);
}
