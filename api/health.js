
export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.json({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      environment: 'vercel-production',
      server: 'Vercel Serverless'
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
