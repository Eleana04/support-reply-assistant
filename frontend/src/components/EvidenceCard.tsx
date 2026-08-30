import type { EvidenceCardProps } from "../types/types.js";

export default function EvidenceCard({ match }: EvidenceCardProps) {
  return (
    <li className="evidence-card">
      <div className="evidence-score mono">{match.score.toFixed(3)}</div>
      <div className="evidence-body">
        <p className="evidence-category">{match.category}</p>
        <p className="evidence-message">"{match.message}"</p>
        <p className="evidence-reply">{match.reply}</p>
      </div>
    </li>
  );
}
