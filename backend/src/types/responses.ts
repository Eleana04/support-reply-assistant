import type { ArchiveTicket, PublicMatch } from "./common.js";

export type ApiError = {
  error: string;
};

export type DraftResponse =
  | {
        status: "flagged_for_human";
        topScore: number;
        message: string;
        matches: PublicMatch[];
    }
  | {
        status: "drafted";
        draft: string;
        strategy: "template";
        topScore: number;
        matches: PublicMatch[];
    };

export type ArchiveResponse = {
  tickets: ArchiveTicket[];
  total: number;
};

export type FeedbackResponse = {
  status: "recorded";
  savedToArchive: boolean;
  ticket?: ArchiveTicket;
};

export type MetricsResponse = {
  threshold: number;
  acceptedUnmodified: number;
  edited: number;
  rejected: number;
  flaggedForHuman: number;
  draftedTotal: number;
  acceptedRate: number;
  editedRate: number;
  rejectedRate: number;
  averageScoreByOutcome: Record<string, number | null>;
};
