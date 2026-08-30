const STOPWORDS = new Set([
  "a", "an", "the", "and", "or", "but", "if", "then", "so", "to", "of", "in",
  "on", "for", "with", "is", "are", "was", "were", "be", "been", "being",
  "it", "its", "this", "that", "these", "those", "i", "you", "he", "she",
  "we", "they", "my", "your", "his", "her", "our", "their", "me", "him",
  "us", "them", "do", "does", "did", "have", "has", "had", "can", "could",
  "will", "would", "should", "just", "not", "no", "as", "at", "by", "from",
  "up", "out", "about", "into", "over", "again", "am", "get", "got", "please"
]);

export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9#\s]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 1 && !STOPWORDS.has(token));
}

export class Embedder {
  vocabulary = new Map<string, number>();
  idf: number[] = [];

  constructor(documents: string[]) {
    this.fit(documents);
  }

  private fit(documents: string[]) {
    const tokenSets = documents.map((doc) => new Set(tokenize(doc)));

    for (const tokens of tokenSets) {
      for (const token of tokens) {
        if (!this.vocabulary.has(token)) {
          this.vocabulary.set(token, this.vocabulary.size);
        }
      }
    }

    const df = new Array(this.vocabulary.size).fill(0);
    for (const tokens of tokenSets) {
      for (const token of tokens) {
        const index = this.vocabulary.get(token);
        if (index !== undefined) df[index] += 1;
      }
    }

    const totalDocs = documents.length;
    this.idf = df.map((count) => Math.log((totalDocs + 1) / (count + 1)) + 1);
  }

  embed(text: string): Map<number, number> {
    const tokens = tokenize(text);
    if (tokens.length === 0) return new Map();

    const termFreq = new Map<number, number>();
    for (const token of tokens) {
      const index = this.vocabulary.get(token);
      if (index === undefined) continue;
      termFreq.set(index, (termFreq.get(index) || 0) + 1);
    }

    const vector = new Map<number, number>();
    for (const [index, count] of termFreq) {
      const tf = count / tokens.length;
      vector.set(index, tf * this.idf[index]);
    }

    return vector;
  }
}

export function cosineSimilarity(a: Map<number, number>, b: Map<number, number>): number {
  if (a.size === 0 || b.size === 0) return 0;

  const [small, large] = a.size <= b.size ? [a, b] : [b, a];
  let dot = 0;

  for (const [index, weight] of small) {
    const otherWeight = large.get(index);
    if (otherWeight !== undefined) dot += weight * otherWeight;
  }

  const normA = Math.sqrt([...a.values()].reduce((sum, weight) => sum + weight * weight, 0));
  const normB = Math.sqrt([...b.values()].reduce((sum, weight) => sum + weight * weight, 0));
  if (normA === 0 || normB === 0) return 0;

  return dot / (normA * normB);
}
