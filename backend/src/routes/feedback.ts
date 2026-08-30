import { Router, type Request, type Response } from "express";
import { archiveStore } from "../archiveStore.js";
import { metricsStore } from "../metrics.js";
import { strings } from "../constants/strings.js";
import { FEEDBACK_ACTIONS, type FeedbackRequest } from "../types/requests.js";
import type { ApiError, FeedbackResponse } from "../types/responses.js";

export const feedbackRouter = Router();

const VALID_ACTIONS = new Set(Object.values(FEEDBACK_ACTIONS));

feedbackRouter.post("/feedback", (req: Request<{}, FeedbackResponse | ApiError, FeedbackRequest>, res: Response<FeedbackResponse | ApiError>) => {
  const { message, draft, finalReply, action, topScore, category } = req.body;

  if (!VALID_ACTIONS.has(action)) {
    return res.status(400).json({ error: strings.error.action_required([...VALID_ACTIONS].join(", ")) });
  }
  if (typeof message !== "string" || message.trim().length === 0) {
    return res.status(400).json({ error: strings.error.message_required });
  }

  const score = typeof topScore === "number" ? topScore : null;

  if (action === FEEDBACK_ACTIONS.REJECT) {
    metricsStore.recordRejected(score);
    return res.json({ status: strings.status.recorded, savedToArchive: false });
  }

  const replyToSave = action === FEEDBACK_ACTIONS.APPROVE ? draft : finalReply;
  if (typeof replyToSave !== "string" || replyToSave.trim().length === 0) {
    return res.status(400).json({ error: strings.error.reply_required });
  }

  const wasEdited = action === FEEDBACK_ACTIONS.EDIT && replyToSave.trim() !== (draft || "").trim();
  if (action === FEEDBACK_ACTIONS.APPROVE || (action === FEEDBACK_ACTIONS.EDIT && !wasEdited)) {
    metricsStore.recordAccepted(score);
  } else {
    metricsStore.recordEdited(score);
  }

  const savedTicket = archiveStore.addResolvedTicket({
    message,
    reply: replyToSave,
    category: category || "uncategorized",
    source: "resolved"
  });

  return res.json({ status: strings.status.recorded, savedToArchive: true, ticket: savedTicket });
});
