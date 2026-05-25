import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { toast } from "sonner";
import { useArticle, useGenerateTldr, usePatchArticle } from "@/hooks/articles.hook";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Heart, Bookmark, Share2, Astroid, X, Loader2 } from "lucide-react";

const ArticleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [tldrOpen, setTldrOpen] = useState(false);
  const [generating, setGenerating] = useState(false);

  const { data: article, isLoading, isError, refetch } = useArticle(id!);
  const { mutate: patch } = usePatchArticle();
  const { mutate: generateTldr, isPending: isRequestingTldr } = useGenerateTldr();

  useEffect(() => {
    if (!generating) return;
    if (article?.tldr_generated) {
      setGenerating(false);
      return;
    }
    const timer = setInterval(() => refetch(), 2000);
    return () => clearInterval(timer);
  }, [generating, article?.tldr_generated, refetch]);

  if (isLoading) {
    return <div className="text-center text-muted-foreground py-16">Loading…</div>;
  }

  if (isError || !article) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-muted-foreground">
        <p>Article not found.</p>
        <Button variant="outline" render={<Link to="/articles" />}>
          Back to articles
        </Button>
      </div>
    );
  }

  const handleTldr = () => {
    if (tldrOpen) {
      setTldrOpen(false);
      return;
    }
    setTldrOpen(true);
    if (!article.tldr_generated) {
      generateTldr({ id: article.id }, {
        onSuccess: () => setGenerating(true),
      });
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(article.link);
    toast("Copied!");
  };

  const isBusy = isRequestingTldr || generating;

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

        <div
          className="article-content"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        <div className="flex items-center gap-2 pt-2 border-t">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => patch({ id: article.id, patch: { liked: !article.liked } })}
            aria-label="Like"
          >
            <Heart className={article.liked ? "fill-red-500 text-red-500" : ""} />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => patch({ id: article.id, patch: { read_later: !article.read_later } })}
            aria-label="Save"
          >
            <Bookmark className={article.read_later ? "fill-foreground text-foreground" : ""} />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Generate TLDR"
            onClick={handleTldr}
            className={tldrOpen ? "text-foreground bg-muted" : ""}
          >
            {isBusy ? <Loader2 className="animate-spin" /> : <Astroid />}
          </Button>
          <Button variant="ghost" size="icon-sm" aria-label="Share" className="ml-auto" onClick={handleShare}>
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
            {isBusy ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" />
                <span>Generating…</span>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground leading-relaxed">{article.tldr}</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ArticleDetail;
