import app from "../server/index";

// Export a handler function to avoid duplicate default export issues in ESM bundling
export default function handler(req: any, res: any) {
  return (app as any)(req, res);
}
export default app;
