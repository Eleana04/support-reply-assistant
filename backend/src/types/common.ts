export type PublicMatch = {
  id: string;
  category: string;
  message: string;
  reply: string;
  score: number;
};

export type MatchCandidate = {
  ticket: {
    id: string;
    category: string;
    message: string;
    reply: string;
    source: string;
    createdAt: string;
  };
  score: number;
};

export type ArchiveTicket = {
  id: string;
  category: string;
  message: string;
  reply: string;
  source: string;
  createdAt: string;
};

export type Outcome = "accepted" | "edited" | "rejected" | "flagged";

export type ScoreLogEntry = {
  score: number | null;
  outcome: Outcome;
  at: string;
};

export type Metrics = {
  acceptedUnmodified: number;
  edited: number;
  rejected: number;
  flaggedForHuman: number;
  scoreLog: ScoreLogEntry[];
};

export type Match = {
  ticket: { reply: string };
  score: number;
};