import { useState } from "react";
import { useArticles } from "@/hooks/articles.hook";
import ArticleRow from "@/components/ArticleRow";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const Articles = () => {
  const { data = [], isLoading, isError } = useArticles();
  const [search, setSearch] = useState("");

  const filtered = data.filter((a) =>
    !search ||
    a.title.toLowerCase().includes(search.toLowerCase()) ||
    a.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder="Search articles…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {isLoading && (
        <div className="text-center text-muted-foreground py-16">Loading…</div>
      )}
      {isError && (
        <div className="text-center text-destructive py-16">Failed to load articles.</div>
      )}
      {!isLoading && !isError && filtered.length === 0 && (
        <div className="text-center text-muted-foreground py-16">
          {search ? "No articles match your search." : "No articles yet."}
        </div>
      )}

      {!isLoading && !isError && filtered.length > 0 && (
        <div className="relative">
          {filtered.map((article) => (
            <ArticleRow key={article.id} article={article} />
          ))}
        </div>
      )}

      {!isLoading && !isError && data.length > 0 && (
        <p className="text-xs text-muted-foreground text-right pb-2">
          {filtered.length} of {data.length} articles
        </p>
      )}

    </div>
  );
};

export default Articles;
