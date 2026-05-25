import { Link } from "react-router";
import { toast } from "sonner";
import { useGenerateTldr, usePatchArticle } from "@/hooks/articles.hook";
import type { ArticleLight } from "@/services/articles.service";
import { Button } from "@/components/ui/button";
import { Heart, Bookmark, Share2, Astroid, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export const fmtDate = (dateStr: string) => {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return { day: "—", mon: "—" };
  return {
    day: String(d.getDate()).padStart(2, "0"),
    mon: d.toLocaleString("en-US", { month: "short" }).toUpperCase(),
  };
};

const ArticleRow = ({ article }: { article: ArticleLight }) => {
  const { mutate: patch } = usePatchArticle();
  const { mutate: generateTldr, isPending: isGenerating } = useGenerateTldr();
  const { day, mon } = fmtDate(article.published_date);

  const handleShare = () => {
    navigator.clipboard.writeText(article.link);
    toast("Copied!");
  };

  return (
    <div className="group relative flex items-center gap-4 py-3.5 border-b border-border last:border-0 hover:bg-accent/50 -mx-4 px-4 transition-colors duration-100">

      {/* Full-row click target */}
      <Link to={`/articles/${article.id}`} className="absolute inset-0" aria-label={article.title} />

      {/* Date stamp */}
      <div className="pointer-events-none w-9 shrink-0 text-center select-none">
        <div className="font-mono text-sm font-semibold tabular-nums leading-none text-foreground">
          {day}
        </div>
        <div className="font-mono text-[9px] tracking-widest text-muted-foreground mt-0.5">
          {mon}
        </div>
      </div>

      <div className="pointer-events-none w-px h-7 bg-border shrink-0" />

      {/* Title + description */}
      <div className="pointer-events-none flex-1 min-w-0">
        <p className={cn(
          "text-sm font-medium leading-snug line-clamp-1 transition-colors",
          "text-foreground group-hover:text-foreground/75",
        )}>
          {article.title}
        </p>
        {article.description && (
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-1 mt-0.5">
            {article.description}
          </p>
        )}
      </div>

      {/* Persistent status indicators */}
      <div className="pointer-events-none flex items-center gap-1.5 shrink-0 group-hover:opacity-0 transition-opacity">
        {article.liked && (
          <Heart className="size-3 fill-red-500 text-red-500" />
        )}
        {article.read_later && (
          <Bookmark className="size-3 fill-foreground text-foreground" />
        )}
        {article.tldr_generated && !article.liked && !article.read_later && (
          <Astroid className="size-3 text-muted-foreground/50" />
        )}
      </div>

      {/* Action buttons — revealed on hover */}
      <div className="relative z-10 flex items-center gap-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost" size="icon-sm"
          onClick={() => patch({ id: article.id, patch: { liked: !article.liked } })}
          aria-label="Like"
        >
          <Heart className={cn("size-3.5", article.liked && "fill-red-500 text-red-500")} />
        </Button>
        <Button
          variant="ghost" size="icon-sm"
          onClick={() => patch({ id: article.id, patch: { read_later: !article.read_later } })}
          aria-label="Read later"
        >
          <Bookmark className={cn("size-3.5", article.read_later && "fill-foreground text-foreground")} />
        </Button>
        <Button
          variant="ghost" size="icon-sm"
          disabled={isGenerating}
          onClick={() => !article.tldr_generated && generateTldr({ id: article.id })}
          aria-label="TLDR"
        >
          {isGenerating
            ? <Loader2 className="size-3.5 animate-spin" />
            : <Astroid className={cn("size-3.5", article.tldr_generated && "text-foreground")} />
          }
        </Button>
        <Button variant="ghost" size="icon-sm" aria-label="Share" onClick={handleShare}>
          <Share2 className="size-3.5" />
        </Button>
      </div>

    </div>
  );
};

export default ArticleRow;
