import { useQuery } from "@tanstack/react-query";
import {
  fetchArticle,
  fetchArticles,
  searchArticles,
  type ArticleSearchParams,
} from "@/services/articles.service";

export const useArticles = () => {
  return useQuery({
    queryKey: ["articles"],
    queryFn: fetchArticles,
  });
};

export const useArticle = (id: string) => {
  return useQuery({
    queryKey: ["articles", id],
    queryFn: () => fetchArticle(id),
  });
};

export const useArticleSearch = (params: ArticleSearchParams) => {
  return useQuery({
    queryKey: ["articles", "search", params],
    queryFn: () => searchArticles(params),
  });
};
