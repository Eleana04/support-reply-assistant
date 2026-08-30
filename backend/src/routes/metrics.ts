import { Router, type Response } from "express";
import { metricsStore } from "../metrics.js";
import { SIMILARITY_THRESHOLD } from "../retrieval.js";
import type { MetricsResponse } from "../types/responses.js";

export const metricsRouter = Router();

metricsRouter.get("/metrics", (_req: unknown, res: Response<MetricsResponse>) => {
  res.json({ threshold: SIMILARITY_THRESHOLD, ...metricsStore.summary() });
});
