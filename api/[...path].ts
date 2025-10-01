import express from "express";
import cors from "cors";
import serverApp from "../server/index.js";

// Mount the existing Express app to this function to avoid path resolution issues
const api = express();
api.use(cors());
api.use(express.json({ limit: '2mb' }));
api.use(serverApp);

export default api;
export default app;
