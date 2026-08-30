import { useEffect, useState } from "react";
import { api } from "../api";
import { strings } from "../constants/strings";
import type { ArchiveTicket, ArchiveViewProps } from "../types/types.js";
import "../styles/archive.css";

export default function ArchiveView({ refreshKey }: ArchiveViewProps) {
  const [tickets, setTickets] = useState<ArchiveTicket[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    api
      .getArchive()
      .then((data) => setTickets(data.tickets))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [refreshKey]);

  const filtered = tickets.filter((t) => {
    const q = query.toLowerCase();
    return (
      !q ||
      t.message.toLowerCase().includes(q) ||
      t.reply.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q)
    );
  });

  return (
    <div className="archive-view">
      <div className="archive-header">
        <input
          type="search"
          placeholder={strings.archive.searchPlaceholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="archive-search"
        />
        <span className="archive-count mono">{filtered.length} / {tickets.length}</span>
      </div>

      {loading && <p className="status-line">{strings.archive.loading}</p>}
      {error && <p className="form-error">{error}</p>}

      <ul className="archive-list">
        {filtered.map((t) => (
          <li key={t.id} className="archive-item">
            <div className="archive-item-meta">
              <span className="archive-category">{t.category}</span>
              <span className="archive-source mono">{t.source === "seed" ? strings.archive.seedData : strings.archive.resolvedLive}</span>
              <time className="archive-date mono">{new Date(t.createdAt).toLocaleDateString()}</time>
            </div>
            <p className="archive-message">"{t.message}"</p>
            <p className="archive-reply">{t.reply}</p>
          </li>
        ))}
      </ul>

      {!loading && filtered.length === 0 && <p className="status-line">{strings.archive.noMatches}</p>}
    </div>
  );
}
