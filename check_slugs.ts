
import { allDocIds, createSlug } from './shared/worksheetSEO.js';

const slugToDocIds = {};
const collisions = [];

for (const docId of allDocIds) {
    const slug = createSlug(docId);
    if (slugToDocIds[slug]) {
        slugToDocIds[slug].push(docId);
        if (slugToDocIds[slug].length === 2) {
            collisions.push(slug);
        }
    } else {
        slugToDocIds[slug] = [docId];
    }
}

if (collisions.length > 0) {
    console.log('SLUG COLLISIONS DETECTED:');
    for (const slug of collisions) {
        console.log(`  Slug "${slug}" is used by: ${slugToDocIds[slug].join(', ')}`);
    }
} else {
    console.log('No slug collisions detected.');
}

// Special check for sub-2digit-100
console.log(`\nDEBUG sub-2digit-100:`);
console.log(`  DocId: sub-2digit-100`);
console.log(`  Slug: ${createSlug('sub-2digit-100')}`);
console.log(`  In allDocIds: ${allDocIds.includes('sub-2digit-100')}`);

// Special check for addition-subtraction-within-10
console.log(`\nDEBUG addition-subtraction-within-10:`);
console.log(`  DocId: addition-subtraction-0-10`);
console.log(`  Slug: ${createSlug('addition-subtraction-0-10')}`);
console.log(`  In allDocIds: ${allDocIds.includes('addition-subtraction-0-10')}`);
