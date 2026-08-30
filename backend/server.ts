import express from "express";
import cors from "cors";
import { draftRouter } from "./src/routes/draft.js";
import { feedbackRouter } from "./src/routes/feedback.js";
import { archiveRouter } from "./src/routes/archive.js";
import { metricsRouter } from "./src/routes/metrics.js";
import { archiveStore } from "./src/archiveStore.js";
import { strings } from "./src/constants/strings.js";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use("/api", draftRouter);
app.use("/api", feedbackRouter);
app.use("/api", archiveRouter);
app.use("/api", metricsRouter);

app.get("/api/health", (req, res) => {
  res.json({ ok: true, archiveSize: archiveStore.size() });
});
