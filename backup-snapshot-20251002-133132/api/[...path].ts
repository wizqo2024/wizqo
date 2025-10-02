// Use dynamic import to avoid ESM bundler re-export collisions
export default async function handler(req: any, res: any) {
  let mod: any;
  try {
    mod = await import("../server/index");
  } catch {
    // Fallback to compiled path if bundled under dist/server
    mod = await import("../dist/server/index.cjs");
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
