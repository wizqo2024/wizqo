export default function handler(req, res) {
  res.json({ 
    status: "working", 
    timestamp: new Date().toISOString(),
    message: "Production API is active with hobby-specific video selection"
  });
}
