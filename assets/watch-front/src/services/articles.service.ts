const base = () => (window as any).__ENV__?.API_URL ?? "/api/v1";

export type ArticleLight = {
  id: string;
  title: string;
  link: string;
  description: string;
  published_date: string;
  liked: boolean;
  read_later: boolean;
  tldr_generated: boolean;
};

export type Article = ArticleLight & {
  content: string;
  tldr: string;
};

export type ArticleSearchParams = {
  title?: string;
  liked?: boolean;
};

export const fetchArticles = async (): Promise<ArticleLight[]> => {
  const res = await fetch(`${base()}/articles`);
  if (!res.ok) throw new Error("Failed to fetch articles");
  return res.json();
};

export const fetchArticle = async (id: string): Promise<Article> => {
  const res = await fetch(`${base()}/articles/${id}`);
  if (!res.ok) throw new Error("Failed to fetch article");
  return res.json();
};

export const searchArticles = async (params: ArticleSearchParams): Promise<ArticleLight[]> => {
  const res = await fetch(`${base()}/articles/search`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error("Failed to search articles");
  return res.json();
};

export const generateTldr = async (id: string, force = false): Promise<void> => {
  const res = await fetch(`${base()}/articles/${id}/tldr`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ force }),
  });
  if (!res.ok) throw new Error("Failed to generate TLDR");
};

export type ArticlePatch = { liked?: boolean; read_later?: boolean };

export const patchArticle = async (id: string, patch: ArticlePatch): Promise<void> => {
  const res = await fetch(`${base()}/articles/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
  if (!res.ok) throw new Error("Failed to update article");
};
