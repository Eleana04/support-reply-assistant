import { cosineSimilarity } from "./embeddings.js";
import { archiveStore } from "./archiveStore.js";
import { MatchCandidate } from "./types/common.js";

export const SIMILARITY_THRESHOLD = 0.22;
const TOP_K = 3;

export function retrieveSimilarCases(message: string, k = TOP_K): MatchCandidate[] {
  const queryVector = archiveStore.embedQuery(message);

  const scored = archiveStore.getIndexedTickets().map(({ ticket, vector }) => ({
    ticket,
    score: cosineSimilarity(queryVector ?? new Map(), vector ?? new Map())
  }));

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, k);
}

export function assessConfidence(message: string) {
  const matches = retrieveSimilarCases(message);
  const topScore = matches[0]?.score ?? 0;

  return {
    confident: topScore >= SIMILARITY_THRESHOLD,
    topScore,
    matches
  };
}
