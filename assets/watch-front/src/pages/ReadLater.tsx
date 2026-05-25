import { useArticles } from "@/hooks/articles.hook";
import ArticleRow from "@/components/ArticleRow";

const ReadLater = () => {
  const { data = [], isLoading, isError } = useArticles();
  const saved = data.filter((a) => a.read_later);

  return (
    <div className="space-y-4">
      {isLoading && (
        <div className="text-center text-muted-foreground py-16">Loading…</div>
      )}
      {isError && (
        <div className="text-center text-destructive py-16">Failed to load articles.</div>
      )}
      {!isLoading && !isError && saved.length === 0 && (
        <div className="text-center text-muted-foreground py-16">Nothing saved for later yet.</div>
      )}
      {!isLoading && !isError && saved.length > 0 && (
        <>
          <div className="relative">
            {saved.map((article) => (
              <ArticleRow key={article.id} article={article} />
            ))}
          </div>
          <p className="text-xs text-muted-foreground text-right pb-2">
            {saved.length} {saved.length === 1 ? "article" : "articles"}
          </p>
        </>
      )}
    </div>
  );
};

export default ReadLater;
