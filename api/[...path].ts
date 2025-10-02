// Use dynamic import to avoid ESM bundler re-export collisions
export default async function handler(req: any, res: any) {
  const mod: any = await import("../server/index");
  const app = mod?.default || mod?.app || mod;
  return app(req, res);
}
export default app;
