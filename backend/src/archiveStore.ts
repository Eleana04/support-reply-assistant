import { existsSync, readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { Embedder } from "./embeddings.js";
import { ArchiveTicket } from "./types/common.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ARCHIVE_PATH = join(__dirname, "..", "data", "archive.json");

class ArchiveStore {
  tickets: ArchiveTicket[];
  embedder: Embedder | null;
  vectors: Array<Map<number, number> | undefined>;

  constructor() {
    this.tickets = this.load();
    this.embedder = null;
    this.vectors = [];
    this.reindex();
  }

  private load(): ArchiveTicket[] {
    if (!existsSync(ARCHIVE_PATH)) return [];
    return JSON.parse(readFileSync(ARCHIVE_PATH, "utf-8")) as ArchiveTicket[];
  }

  private persist(): void {
    writeFileSync(ARCHIVE_PATH, JSON.stringify(this.tickets, null, 2));
  }

  private reindex(): void {
    const corpus = this.tickets.map(({ message, reply }) => `${message} ${reply}`);
    this.embedder = new Embedder(corpus);
    this.vectors = this.tickets.map(({ message }) => this.embedder?.embed(message));
  }

  getAll(): ArchiveTicket[] {
    return [...this.tickets].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  embedQuery(text: string): Map<number, number> | undefined {
    return this.embedder?.embed(text);
  }

  getIndexedTickets() {
    return this.tickets.map((ticket, i) => ({ ticket, vector: this.vectors[i] }));
  }

  addResolvedTicket({
    message,
    reply,
    category = "uncategorized",
    source = "resolved"
  }: {
    message: string;
    reply: string;
    category?: string;
    source?: string;
  }): ArchiveTicket {
    const ticket: ArchiveTicket = {
      id: `t-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      category,
      message,
      reply,
      source,
      createdAt: new Date().toISOString()
    };

    this.tickets.push(ticket);
    this.persist();
    this.reindex();
    return ticket;
  }

  size(): number {
    return this.tickets.length;
  }
}

export const archiveStore = new ArchiveStore();