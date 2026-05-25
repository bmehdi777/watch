import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchArticle,
  fetchArticles,
  generateTldr,
  patchArticle,
  searchArticles,
  type ArticlePatch,
  type ArticleSearchParams,
} from "@/services/articles.service";

export const useArticles = () => {
  return useQuery({
    queryKey: ["articles"],
    queryFn: fetchArticles,
  });
};

export const useArticle = (id: string, options: { refetchInterval?: number | false } = {}) => {
  return useQuery({
    queryKey: ["articles", id],
    queryFn: () => fetchArticle(id),
    ...options,
  });
};

export const useArticleSearch = (params: ArticleSearchParams) => {
  return useQuery({
    queryKey: ["articles", "search", params],
    queryFn: () => searchArticles(params),
  });
};

export const useGenerateTldr = () => {
  return useMutation({
    mutationFn: ({ id, force = false }: { id: string; force?: boolean }) =>
      generateTldr(id, force),
  });
};

export const usePatchArticle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: ArticlePatch }) =>
      patchArticle(id, patch),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["articles"] }),
  });
};
