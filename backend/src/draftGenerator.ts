import { strings } from "./constants/strings.js";
import type { Match } from "./types/common.js";

function pick(list: readonly string[], seedText: string): string {
  let hash = 0;
  for (let i = 0; i < seedText.length; i++) {
    hash = (hash * 31 + seedText.charCodeAt(i)) >>> 0;
  }
  return list[hash % list.length];
}

function templateDraft(message: string, matches: Match[]): string {
  const best = matches[0]?.ticket;
  if (!best) return strings.draft.greeting;

  const sentences = best.reply.split(/(?<=[.!?])\s+/);
  const resolution = sentences.length > 1 ? sentences.slice(1).join(" ") : best.reply;

  return [
    strings.draft.greeting,
    "",
    pick(strings.draft.openers, message),
    resolution,
    "",
    pick(strings.draft.closers, best.reply)
  ].join("\n");
}

export function generateDraft(message: string, matches: Match[]): { draft: string; strategy: "template" } {
  return {
    draft: templateDraft(message, matches),
    strategy: strings.status.template
  };
}
