import { useEffect, useState } from "react";
import { api } from "../api.js";
import { strings } from "../constants/strings.js";
import type { MetricsResponse, MetricsViewProps, StatCardProps } from "../types/types.js";
import "../styles/metrics.css";

export default function MetricsView({ refreshKey }: MetricsViewProps) {
  const [metrics, setMetrics] = useState<MetricsResponse | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.getMetrics().then(setMetrics).catch((err) => setError(err instanceof Error ? err.message : String(err)));
  }, [refreshKey]);

  if (error) return <p className="form-error">{error}</p>;
  if (!metrics) return <p className="status-line">{strings.archive.loading}</p>;

  const { acceptedUnmodified, edited, rejected, flaggedForHuman, draftedTotal, acceptedRate, editedRate, rejectedRate, averageScoreByOutcome } = metrics;

  return (
    <div className="metrics-view">
      <section className="metrics-summary">
        <StatCard label={strings.metrics.acceptedUnmodified} value={`${acceptedRate}%`} count={acceptedUnmodified} tone="evidence" />
        <StatCard label={strings.metrics.editedBeforeSaving} value={`${editedRate}%`} count={edited} tone="flag" />
        <StatCard label={strings.metrics.rejected} value={`${rejectedRate}%`} count={rejected} tone="reject" />
        <StatCard label={strings.metrics.flaggedForHuman} value={flaggedForHuman} count={null} tone="ink" />
      </section>
    </div>
  );
}

function StatCard({ label, value, count, tone }: StatCardProps) {
  return (
    <div className={`stat-card stat-${tone}`}>
      <p className="stat-value">{value}</p>
      <p className="stat-label">{label}</p>
      {count !== null && <p className="stat-count mono">{strings.metrics.caseCount(count)}</p>}
    </div>
  );
}
