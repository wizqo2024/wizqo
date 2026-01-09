import app from "../server/index";

export default async function handler(req: any, res: any) {
  let appAny: any = app;
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
