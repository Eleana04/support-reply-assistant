import { existsSync, readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import type { Metrics, Outcome } from "./types/common.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const METRICS_PATH = join(__dirname, "..", "data", "metrics.json");

const DEFAULT_METRICS: Metrics = {
  acceptedUnmodified: 0,
  edited: 0,
  rejected: 0,
  flaggedForHuman: 0,
  scoreLog: []
};

function load(): Metrics {
  if (!existsSync(METRICS_PATH)) return structuredClone(DEFAULT_METRICS);
  return JSON.parse(readFileSync(METRICS_PATH, "utf-8")) as Metrics;
}

function persist(metrics: Metrics) {
  writeFileSync(METRICS_PATH, JSON.stringify(metrics, null, 2));
}

let metrics = load();

function record(outcome: Outcome, score: number | null) {
  const counters: Record<Outcome, keyof Pick<Metrics, "acceptedUnmodified" | "edited" | "rejected" | "flaggedForHuman">> = {
    accepted: "acceptedUnmodified",
    edited: "edited",
    rejected: "rejected",
    flagged: "flaggedForHuman"
  };

  metrics[counters[outcome]] += 1;
  metrics.scoreLog.push({ score, outcome, at: new Date().toISOString() });
  persist(metrics);
}

export const metricsStore = {
  recordFlagged: (score: number | null) => record("flagged", score),
  recordAccepted: (score: number | null) => record("accepted", score),
  recordEdited: (score: number | null) => record("edited", score),
  recordRejected: (score: number | null) => record("rejected", score),

  summary() {
    const { acceptedUnmodified, edited, rejected, flaggedForHuman, scoreLog } = metrics;
    const draftedTotal = acceptedUnmodified + edited + rejected;
    const pct = (count: number, total: number) => (total === 0 ? 0 : Number(((count / total) * 100).toFixed(1)));

    const averageScoreByOutcome = Object.fromEntries(
      (['accepted', 'edited', 'rejected', 'flagged'] as Outcome[]).map((outcome) => {
        const scores = scoreLog
          .filter((entry) => entry.outcome === outcome && entry.score !== null)
          .map((entry) => entry.score as number);

        const average = scores.length
          ? Number((scores.reduce((sum, value) => sum + value, 0) / scores.length).toFixed(3))
          : null;

        return [outcome, average];
      })
    ) as Record<Outcome, number | null>;

    return {
      acceptedUnmodified,
      edited,
      rejected,
      flaggedForHuman,
      draftedTotal,
      acceptedRate: pct(acceptedUnmodified, draftedTotal),
      editedRate: pct(edited, draftedTotal),
      rejectedRate: pct(rejected, draftedTotal),
      averageScoreByOutcome
    };
  }
};
