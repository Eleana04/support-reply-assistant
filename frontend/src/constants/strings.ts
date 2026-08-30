export const strings = {
  brand: {
    name: "Supportive Assistant",
  },
  tabs: {
    ariaLabel: "Views",
    newTicket: "New ticket",
    archive: "Archive",
    metrics: "Metrics"
  },
  ticket: {
    messageLabel: "New customer message",
    messagePlaceholder: "Type a new message",
    findDraft: "Search",
    searching: "Searching the archive for similar resolved cases…",
    flaggedBadge: (score: number) => `Flagged for a human · top match ${score}`,
    flaggedMessage:
      "No past case was similar enough to draft from with confidence. Rather than guess, this one goes straight to a human agent.",
    closestCases: "Closest cases we found anyway (for context only)",
    startAnother: "Start another",
    groundedBadge: (score: number) => `Grounded draft · top match ${score}`,
    approve: "Approve",
    edit: "Edit",
    reject: "Reject",
    saveEditedReply: "Save edited reply",
    cancelEdit: "Cancel edit",
    groundedIn: (count: number) => `Grounded in ${count} past case${count !== 1 ? "s" : ""}`,
    draftAnother: "Draft another reply",
    rejected: "Recorded as rejected. Nothing was saved to the archive.",
    saved: "Saved — this reply is now part of the archive for future matches.",
    recorded: "Recorded."
  },
  archive: {
    searchPlaceholder: "Search past tickets…",
    loading: "Loading archive…",
    seedData: "seed data",
    resolvedLive: "resolved live",
    noMatches: "No tickets match that search."
  },
  metrics: {
    acceptedUnmodified: "Accepted unmodified",
    editedBeforeSaving: "Edited before saving",
    rejected: "Rejected",
    flaggedForHuman: "Flagged for a human",
    scoreAxisLabel: "Average similarity score by outcome, relative to the threshold",
    thresholdLabel: (options: { threshold: number }) => `threshold ${options.threshold}`,
    outcomeLabel: (options: { outcome: string; value: number }) => `${options.outcome} · ${options.value}`,
    caseCount: (count: number) => `${count} case${count === 1 ? "" : "s"}`
  }
};
