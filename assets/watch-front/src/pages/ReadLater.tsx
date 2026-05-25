import { useArticles } from "@/hooks/articles.hook";
import ArticleGrid from "@/components/ArticleGrid";

const ReadLater = () => {
  const { data = [], isLoading, isError } = useArticles();
  const saved = data.filter((a) => a.read_later);

  if (isLoading) {
    return <div className="text-center text-muted-foreground py-16">Loading…</div>;
  }

  if (isError) {
    return <div className="text-center text-destructive py-16">Failed to load articles.</div>;
  }

  return <ArticleGrid articles={saved} emptyMessage="Nothing saved for later yet." />;
};

export default ReadLater;
