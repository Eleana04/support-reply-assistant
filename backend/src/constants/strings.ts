export const strings = {
  status: {
    flagged_human: "flagged_for_human",
    drafted: "drafted",
    recorded: "recorded",
    template: "template"
  },
  error: {
    message_required: "message is required",
    action_required: (actions: string) => `action must be one of ${actions}`,
    reply_required: "a reply to save is required for approve/edit"
  },
  response: {
    no_similar_case:
      "No sufficiently similar past case was found, so no draft was generated. A human should handle this one."
  },
  draft: {
    greeting: "Hi there,",
    openers: [
      "Thanks for reaching out, and sorry for the trouble.",
      "Sorry about that — thanks for flagging it.",
      "Appreciate you letting us know, and sorry for the hassle."
    ],
    closers: [
      "Let us know if anything's still not right and we'll keep looking into it.",
      "Reply here if you need anything else on this.",
      "Happy to help further if this doesn't fully resolve it."
    ]
  }
} as const;
