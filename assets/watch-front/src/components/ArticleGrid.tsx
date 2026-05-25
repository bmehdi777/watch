import { Link } from "react-router";
import { toast } from "sonner";
import type { ArticleLight } from "@/services/articles.service";
import { useGenerateTldr, usePatchArticle } from "@/hooks/articles.hook";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Bookmark, Share2, Astroid, Loader2 } from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";

const ArticleCard = ({ article }: { article: ArticleLight }) => {
  const { mutate: patch } = usePatchArticle();
  const { mutate: generateTldr, isPending: isGenerating } = useGenerateTldr();

  const handleShare = () => {
    navigator.clipboard.writeText(article.link);
    toast("Copied!");
  };

  return (
    <Card className="flex flex-col transition-shadow hover:shadow-md hover:ring-2 hover:ring-foreground/10">
      <Link to={`/articles/${article.id}`} className="flex flex-col flex-1 min-h-0">
        <CardHeader>
          <CardTitle className="line-clamp-2">{article.title}</CardTitle>
          <p className="text-xs text-muted-foreground">{article.published_date}</p>
        </CardHeader>
        <CardContent className="flex-1">
          <p className="text-sm text-muted-foreground line-clamp-4">
            {article.description}
          </p>
        </CardContent>
      </Link>
      <CardFooter className="py-2 justify-between">
        <Tooltip>
          <TooltipTrigger render={
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => patch({ id: article.id, patch: { liked: !article.liked } })}
              aria-label="Like"
            />
          }>
            <Heart className={article.liked ? "fill-red-500 text-red-500" : ""} />
          </TooltipTrigger>
          <TooltipContent>Like</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger render={
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => patch({ id: article.id, patch: { read_later: !article.read_later } })}
              aria-label="Read later"
            />
          }>
            <Bookmark className={article.read_later ? "fill-foreground text-foreground" : ""} />
          </TooltipTrigger>
          <TooltipContent>Read later</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger render={
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Generate TLDR"
              disabled={isGenerating}
              onClick={() => !article.tldr_generated && generateTldr({ id: article.id })}
            />
          }>
            {isGenerating
              ? <Loader2 className="animate-spin" />
              : <Astroid className={article.tldr_generated ? "text-foreground" : ""} />
            }
          </TooltipTrigger>
          <TooltipContent>{article.tldr_generated ? "TLDR ready" : "Generate TLDR"}</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger render={
            <Button variant="ghost" size="icon-sm" aria-label="Share" onClick={handleShare} />
          }>
            <Share2 />
          </TooltipTrigger>
          <TooltipContent>Share</TooltipContent>
        </Tooltip>
      </CardFooter>
    </Card>
  );
};

interface ArticleGridProps {
  articles: ArticleLight[];
  emptyMessage?: string;
}

const ArticleGrid = ({ articles, emptyMessage = "No articles." }: ArticleGridProps) => {
  if (articles.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-16">{emptyMessage}</div>
    );
  }

  return (
    <TooltipProvider>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </TooltipProvider>
  );
};

export default ArticleGrid;
