import { useArticleSearch } from "@/hooks/articles.hook";
import ArticleRow from "@/components/ArticleRow";

const Liked = () => {
  const { data = [], isLoading, isError } = useArticleSearch({ liked: true });

  return (
    <div className="space-y-4">
      {isLoading && (
        <div className="text-center text-muted-foreground py-16">Loading…</div>
      )}
      {isError && (
        <div className="text-center text-destructive py-16">Failed to load articles.</div>
      )}
      {!isLoading && !isError && data.length === 0 && (
        <div className="text-center text-muted-foreground py-16">No liked articles yet.</div>
      )}
      {!isLoading && !isError && data.length > 0 && (
        <>
          <div className="relative">
            {data.map((article) => (
              <ArticleRow key={article.id} article={article} />
            ))}
          </div>
          <p className="text-xs text-muted-foreground text-right pb-2">
            {data.length} {data.length === 1 ? "article" : "articles"}
          </p>
        </>
      )}
    </div>
  );
};

export default Liked;
