import * as natural from "natural";

const { TfIdf } = natural;
const MIN_TERM_LENGTH = 2;
const MAX_KEYWORDS = 15;

const STOP_WORDS = new Set(
  "a an the and or but in on at to for of with by from as is was are were been be have has had do does did will would could should may might must can this that these those i you he she it we they".split(
    " "
  )
);

function tokenize(text: string): string[] {
  const tokenizer = new natural.WordTokenizer();
  const tokens = tokenizer.tokenize(text.toLowerCase()) ?? [];
  return tokens.filter(
    (t) =>
      t.length >= MIN_TERM_LENGTH &&
      !STOP_WORDS.has(t) &&
      /^[a-z]+$/.test(t)
  );
}

export function extractKeywords(text: string): string[] {
  const trimmed = text.trim();
  if (trimmed.length === 0) return [];

  const tokens = tokenize(trimmed);
  if (tokens.length === 0) return [];

  const tfidf = new TfIdf();
  tfidf.addDocument(tokens);
  const terms = tfidf.listTerms(0);
  const seen = new Set<string>();
  const keywords: string[] = [];
  for (const { term } of terms) {
    if (keywords.length >= MAX_KEYWORDS) break;
    const lower = term.toLowerCase();
    if (!seen.has(lower)) {
      seen.add(lower);
      keywords.push(term);
    }
  }
  return keywords;
}
