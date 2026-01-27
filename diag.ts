import { WORKSHEET_SEO_MAP, initializeWorksheetSEO } from './shared/worksheetSEO.js';
// Explicitly initialize just in case
initializeWorksheetSEO();
console.log(JSON.stringify(WORKSHEET_SEO_MAP['sub-2digit-100'], null, 2));
