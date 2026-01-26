const fs = require('fs');
const data = JSON.parse(fs.readFileSync('client/public/worksheet-seo-data.json', 'utf8'));
console.log(Object.keys(data));
