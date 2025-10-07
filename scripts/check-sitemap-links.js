#!/usr/bin/env node
const https=require('https');
const { JSDOM } = require('jsdom');
function fetch(url){return new Promise((res,rej)=>https.get(url,r=>{let d='';r.on('data',c=>d+=c);r.on('end',()=>res({status:r.statusCode,body:d}));}).on('error',rej))}
(async()=>{
  const origin=process.env.SITE_ORIGIN||'https://wizqo.com';
  const sm=`${origin}/sitemap.xml`;
  const r=await fetch(sm);
  if(r.status!==200){console.error('Sitemap fetch failed',r.status);process.exit(1)}
  const urls=[...r.body.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);
  let failures=0;
  for(const u of urls){
    try{const res=await fetch(u); if(res.status>=400){console.error('Bad URL',u,res.status); failures++;}}
    catch(e){console.error('Error URL',u,e.message); failures++;}
  }
  if(failures>0){console.error(`Link check failed: ${failures} bad URLs`); process.exit(1)}
  console.log('All sitemap URLs OK');
})();
