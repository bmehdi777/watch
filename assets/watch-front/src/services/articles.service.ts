export type ArticleLight = {
  id: string;
  title: string;
  link: string;
  published_date: string;
  liked: boolean;
};

export type Article = ArticleLight & {
  content: string;
};

export type ArticleSearchParams = {
  title?: string;
  liked?: boolean;
};

export const fetchArticles = async (): Promise<ArticleLight[]> => {
  const res = await fetch("/v1/articles");
  if (!res.ok) throw new Error("Failed to fetch articles");
  return res.json();
};

export const fetchArticle = async (id: string): Promise<Article> => {
  const res = await fetch(`/v1/articles/${id}`);
  if (!res.ok) throw new Error("Failed to fetch article");
  return res.json();
};

export const searchArticles = async (params: ArticleSearchParams): Promise<ArticleLight[]> => {
  const res = await fetch("/v1/articles/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error("Failed to search articles");
  return res.json();
};
