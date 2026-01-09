// Use dynamic import to avoid ESM bundler re-export collisions
export default async function handler(req: any, res: any) {
  let mod: any;
  try {
    // Prioritize compiled bundle for production reliability and speed
    mod = await import("../dist/server/index.cjs");
  } catch {
    // Fallback to source if dist is missing
    try {
      mod = await import("../server/index");
    } catch (err: any) {
      res.statusCode = 500;
      res.end(`Failed to load server module: ${err?.message || err}`);
      return;
    }
  }
  let appAny: any = mod?.default ?? mod?.app ?? mod;
  if (appAny && typeof appAny === 'object' && 'default' in appAny) {
    // Unwrap nested default if bundler wrapped CJS/Esm interop
    appAny = (appAny as any).default;
  }
  if (typeof appAny !== 'function') {
    res.statusCode = 500;
    res.end('Server app export is not a function');
    return;
  }
  return appAny(req, res);
}
