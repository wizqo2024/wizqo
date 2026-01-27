
import { WORKSHEET_MANUAL_CONTENT, initializeWorksheetSEO, WORKSHEET_SEO_MAP } from './shared/worksheetSEO';

console.log("--- DEBUG START ---");
const key = 'sub-2digit-100';
console.log(`Checking key: ${key}`);

const manualEntry = WORKSHEET_MANUAL_CONTENT[key];
console.log("Manual Entry Exists:", !!manualEntry);
if (manualEntry) {
    console.log("Manual Entry Title:", manualEntry.title);
    console.log("Manual Entry RichContent Length:", manualEntry.richContent?.length || 0);
}

console.log("Running initializeWorksheetSEO()...");
try {
    initializeWorksheetSEO();
} catch (e) {
    console.error("Initialization prevented error:", e.message);
}

const mapEntry = WORKSHEET_SEO_MAP[key];
console.log("Map Entry Exists:", !!mapEntry);
if (mapEntry) {
    console.log("Map Entry Title:", mapEntry.title);
    console.log("Map Entry RichContent Length:", mapEntry.richContent?.length || 0);
}
console.log("--- DEBUG END ---");
