import { useArticleSearch } from "@/hooks/articles.hook";
import ArticleGrid from "@/components/ArticleGrid";

const Liked = () => {
  const { data = [], isLoading, isError } = useArticleSearch({ liked: true });

  if (isLoading) {
    return <div className="text-center text-muted-foreground py-16">Loading…</div>;
  }

  if (isError) {
    return <div className="text-center text-destructive py-16">Failed to load articles.</div>;
  }

  return <ArticleGrid articles={data} emptyMessage="No liked articles yet." />;
};

export default Liked;
