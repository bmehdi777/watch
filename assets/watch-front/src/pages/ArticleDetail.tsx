import { useParams, Link } from "react-router";
import { MOCK_ARTICLES } from "@/mocks/articles";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Heart, Bookmark, Share2, Astroid, X } from "lucide-react";
import { useState } from "react";

const ArticleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const found = MOCK_ARTICLES.find((a) => a.id === id);

  const [article, setArticle] = useState(found ?? null);
  const [tldrOpen, setTldrOpen] = useState(false);

  if (!article) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-muted-foreground">
        <p>Article not found.</p>
        <Button variant="outline" render={<Link to="/articles" />}>
          Back to articles
        </Button>
      </div>
    );
  }

  const toggle = (field: "liked" | "saved") => {
    setArticle((prev) => prev && { ...prev, [field]: !prev[field] });
  };

  return (
    <div className="flex justify-center items-start gap-0">
      <div className="w-full max-w-2xl space-y-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon-sm" render={<Link to="/articles" />} aria-label="Back">
            <ArrowLeft />
          </Button>
          <span className="text-xs text-muted-foreground">{article.published_date}</span>
        </div>

        <h1 className="text-2xl font-semibold leading-snug">{article.title}</h1>

        <p className="text-sm text-muted-foreground leading-relaxed">{article.content}</p>

        <div className="flex items-center gap-2 pt-2 border-t">
          <Button variant="ghost" size="icon-sm" onClick={() => toggle("liked")} aria-label="Like">
            <Heart className={article.liked ? "fill-red-500 text-red-500" : ""} />
          </Button>
          <Button variant="ghost" size="icon-sm" onClick={() => toggle("saved")} aria-label="Save">
            <Bookmark className={article.saved ? "fill-foreground text-foreground" : ""} />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Generate TLDR"
            onClick={() => setTldrOpen((o) => !o)}
            className={tldrOpen ? "text-foreground bg-muted" : ""}
          >
            <Astroid />
          </Button>
          <Button variant="ghost" size="icon-sm" aria-label="Share" className="ml-auto">
            <Share2 />
          </Button>
        </div>
      </div>

      {tldrOpen && (
        <>
          <Separator orientation="vertical" className="mx-8" />
          <div className="w-72 shrink-0 space-y-3 animate-in slide-in-from-right-4 fade-in-0 duration-200">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">TLDR</p>
              <Button variant="ghost" size="icon-sm" onClick={() => setTldrOpen(false)} aria-label="Close">
                <X />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{article.tldr}</p>
          </div>
        </>
      )}
    </div>
  );
};

export default ArticleDetail;
