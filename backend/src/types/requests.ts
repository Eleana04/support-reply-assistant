export const FEEDBACK_ACTIONS = {
  APPROVE: "approve",
  EDIT: "edit",
  REJECT: "reject"
} as const;

export type FeedbackAction = (typeof FEEDBACK_ACTIONS)[keyof typeof FEEDBACK_ACTIONS];

export type DraftRequest = {
  message: string;
};

export type FeedbackRequest = {
  message: string;
  draft?: string;
  finalReply?: string;
  action: FeedbackAction;
  topScore?: number;
  category?: string;
};
