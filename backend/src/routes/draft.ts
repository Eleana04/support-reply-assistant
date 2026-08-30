import { Router, type Request, type Response } from "express";
import { assessConfidence } from "../retrieval.js";
import { generateDraft } from "../draftGenerator.js";
import { metricsStore } from "../metrics.js";
import { strings } from "../constants/strings.js";
import type { DraftRequest } from "../types/requests.js";
import type { ApiError, DraftResponse } from "../types/responses.js";
import type { MatchCandidate, PublicMatch } from "../types/common.js";
export const draftRouter = Router();

draftRouter.post("/draft", async (req: Request<{}, DraftResponse | ApiError, DraftRequest>, res: Response<DraftResponse | ApiError>) => {
  const { message } = req.body;
  if (typeof message !== "string" || message.trim().length === 0) {
    return res.status(400).json({
      error: strings.error.message_required,
      status: strings.status.flagged_human,
      topScore: 0,
      matches: []
    });
  }

  const { confident, topScore, matches } = assessConfidence(message);

  if (!confident) {
    metricsStore.recordFlagged(topScore);
    return res.json({
      status: strings.status.flagged_human,
      topScore,
      message: strings.response.no_similar_case,
      matches: matches.map(toPublicMatch)
    });
  }

  const { draft, strategy } = generateDraft(message, matches);

  return res.json({
    status: strings.status.drafted,
    draft,
    strategy,
    topScore,
    matches: matches.map(toPublicMatch)
  });
});

function toPublicMatch({ ticket, score }: MatchCandidate): PublicMatch {
  return {
    id: ticket.id,
    category: ticket.category,
    message: ticket.message,
    reply: ticket.reply,
    score: Math.round(score * 1000) / 1000
  };
}
