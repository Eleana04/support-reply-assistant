import { Router, type Response } from "express";
import { archiveStore } from "../archiveStore.js";
import type { ArchiveResponse } from "../types/responses.js";

export const archiveRouter = Router();

archiveRouter.get("/archive", (_req: unknown, res: Response<ArchiveResponse>) => {
  res.json({ tickets: archiveStore.getAll(), total: archiveStore.size() });
});
