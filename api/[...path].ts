// Use dynamic import to avoid ESM bundler re-export collisions
export default async function handler(req: any, res: any) {
  let mod: any;
  try {
    mod = await import("../server/index");
  } catch {
    // Fallback to compiled path if bundled under dist/server
    mod = await import("../dist/server/index.cjs");
  }
  const app = mod?.default || mod?.app || mod;
  return app(req, res);
}
