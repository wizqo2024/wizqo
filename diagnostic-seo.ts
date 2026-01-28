
import { WORKSHEET_SEO_MAP, initializeWorksheetSEO, WORKSHEET_MANUAL_CONTENT } from './shared/worksheetSEO.js';

initializeWorksheetSEO();

const docId = 'decimal-to-percent';
const seo = WORKSHEET_SEO_MAP[docId];
const manual = WORKSHEET_MANUAL_CONTENT[docId];

console.log('--- DIAGNOSTIC FOR decimal-to-percent ---');
console.log('Exists in WORKSHEET_SEO_MAP:', !!seo);
if (seo) {
    console.log('SEO Map Title:', seo.title);
    console.log('SEO Map Meta:', seo.metaDescription);
}

console.log('Exists in WORKSHEET_MANUAL_CONTENT:', !!manual);
if (manual) {
    console.log('Manual Title:', manual.title);
    console.log('Manual Meta:', manual.metaDescription);
    console.log('Manual keys:', Object.keys(manual));
}
