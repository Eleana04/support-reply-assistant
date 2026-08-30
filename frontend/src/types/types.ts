export const FEEDBACK_ACTIONS = {
  APPROVE: "approve",
  EDIT: "edit",
  REJECT: "reject"
} as const;

export type FeedbackAction = (typeof FEEDBACK_ACTIONS)[keyof typeof FEEDBACK_ACTIONS];

export type TicketSource = "seed" | "resolved";

export type ArchiveTicket = {
  id: string;
  category: string;
  message: string;
  reply: string;
  source: TicketSource;
  createdAt: string;
};

export type EvidenceMatch = {
  id: string;
  category: string;
  message: string;
  reply: string;
  score: number;
};

export type DraftResponse =
  | {
      status: "drafted";
      draft: string;
      strategy: "template";
      topScore: number;
      matches: EvidenceMatch[];
    }
  | {
      status: "flagged_for_human";
      topScore: number;
      matches: EvidenceMatch[];
    };

export type FeedbackPayload = {
  action: FeedbackAction;
  message: string;
  draft?: string;
  finalReply?: string;
  topScore?: number;
  category?: string;
};

export type FeedbackResponse = {
  status: "recorded";
  savedToArchive: boolean;
  ticket?: ArchiveTicket;
};

export type ArchiveResponse = {
  tickets: ArchiveTicket[];
  total: number;
};

export type AverageScoreByOutcome = Record<
  "accepted" | "edited" | "rejected" | "flagged",
  number | null
>;

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
  averageScoreByOutcome: AverageScoreByOutcome;
};

export type ArchiveViewProps = {
  refreshKey: number;
};

export type NewTicketViewProps = {
  onArchiveChanged: () => void;
};

export type MetricsViewProps = {
  refreshKey: number;
};

export type EvidenceCardProps = {
  match: EvidenceMatch;
};

export type StatCardProps = {
  label: string;
  value: string | number;
  count: number | null;
  tone: string;
};
