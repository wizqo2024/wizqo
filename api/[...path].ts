export default async function handler(req: any, res: any) {
  let mod: any;
  try {
    // IMPORT FROM DIST: This is required because Vercel only includes dist/server via vercel.json
    mod = await import("../dist/server/index.cjs");
  } catch (err: any) {
    // Fallback/Diagnostic if bundle is missing or fails
    try {
      mod = await import("../server/index");
    } catch (fallbackErr: any) {
      res.statusCode = 500;
      res.end(`Server Load Error: ${err?.message || err}. Fallback: ${fallbackErr?.message || fallbackErr}`);
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
