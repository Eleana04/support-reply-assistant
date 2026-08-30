import { useState } from "react";
import "./styles/app.css";
import NewTicketView from "./components/NewTicketView";
import ArchiveView from "./components/ArchiveView";
import MetricsView from "./components/MetricsView";
import { strings } from "./constants/strings";

export default function App() {
  const [tab, setTab] = useState("new");
  const [refreshKey, setRefreshKey] = useState(0);

  const onArchiveChanged = () => setRefreshKey((k) => k + 1);

  return (
    <div className="layout">

      <header className="topbar">
        <div className="logo">
          <div className="logo-box"></div>
          <div>
            <h1>{strings.brand.name}</h1>
            <p>Customer Support Dashboard</p>
          </div>
        </div>
      </header>

      <div className="content">

        <aside className="sidebar">
          <button
            className={tab === "new" ? "menu active" : "menu"}
            onClick={() => setTab("new")}
          >
            New Ticket
          </button>

          <button
            className={tab === "archive" ? "menu active" : "menu"}
            onClick={() => setTab("archive")}
          >
            Archive
          </button>

          <button
            className={tab === "metrics" ? "menu active" : "menu"}
            onClick={() => setTab("metrics")}
          >
            Metrics
          </button>
        </aside>

        <section className="main-panel">
          {tab === "new" && (
            <NewTicketView onArchiveChanged={onArchiveChanged} />
          )}

          {tab === "archive" && (
            <ArchiveView refreshKey={refreshKey} />
          )}

          {tab === "metrics" && (
            <MetricsView refreshKey={refreshKey} />
          )}
        </section>

      </div>
    </div>
  );
}