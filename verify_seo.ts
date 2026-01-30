
import { getWorksheetSEOBySlug, initializeWorksheetSEO } from './shared/worksheetSEO';

console.log('--- START VERIFICATION ---');
try {
    console.log('Initializing SEO...');
    initializeWorksheetSEO();
    console.log('SEO Initialized.');

    const slug = 'counting-numbers-generator';
    console.log(`Fetching SEO for: ${slug}`);
    const data = getWorksheetSEOBySlug(slug);

    if (data) {
        console.log('SUCCESS: Data found!');
        console.log('Title:', data.title);
        console.log('H1:', data.h1);
        console.log('Meta Description:', data.metaDescription);
        console.log('Rich Content Length:', data.richContent?.length);
    } else {
        console.error('ERROR: Data NOT found for slug:', slug);
        console.log('Checking similar keys...');
        // access the map directly if exported? No, it's not exported.
        // But we can check if initializeWorksheetSEO worked.
    }

} catch (error) {
    console.error('CRITICAL ERROR:', error);
}
console.log('--- END VERIFICATION ---');
