import type {
  ArchiveResponse,
  DraftResponse,
  FeedbackPayload,
  FeedbackResponse,
  MetricsResponse
} from "./types/types.js";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed: ${res.status}`);
  }
  return (await res.json()) as T;
}

export const api = {
  getDraft: (message: string): Promise<DraftResponse> =>
    request<DraftResponse>("/draft", { method: "POST", body: JSON.stringify({ message }) }),

  sendFeedback: (payload: FeedbackPayload): Promise<FeedbackResponse> =>
    request<FeedbackResponse>("/feedback", { method: "POST", body: JSON.stringify(payload) }),

  getArchive: (): Promise<ArchiveResponse> => request<ArchiveResponse>("/archive"),

  getMetrics: (): Promise<MetricsResponse> => request<MetricsResponse>("/metrics")
};
