import { Link } from "react-router";
import type { ArticleState } from "@/mocks/articles";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Bookmark, Share2, Astroid } from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";

interface ArticleGridProps {
  articles: ArticleState[];
  onToggle: (id: string, field: "liked" | "saved") => void;
  emptyMessage?: string;
}

const ArticleGrid = ({ articles, onToggle, emptyMessage = "No articles." }: ArticleGridProps) => {
  if (articles.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-16">{emptyMessage}</div>
    );
  }

  return (
    <TooltipProvider>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {articles.map((article) => (
          <Card key={article.id} className="flex flex-col transition-shadow hover:shadow-md hover:ring-2 hover:ring-foreground/10">
            <Link to={`/articles/${article.id}`} className="flex flex-col flex-1 min-h-0">
              <CardHeader>
                <CardTitle className="line-clamp-2">{article.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-sm text-muted-foreground line-clamp-4">
                  {article.content}
                </p>
              </CardContent>
            </Link>
            <CardFooter className="py-2 justify-between">
              <Tooltip>
                <TooltipTrigger render={<Button variant="ghost" size="icon-sm" onClick={() => onToggle(article.id, "liked")} aria-label="Like" />}>
                  <Heart className={article.liked ? "fill-red-500 text-red-500" : ""} />
                </TooltipTrigger>
                <TooltipContent>Like</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger render={<Button variant="ghost" size="icon-sm" onClick={() => onToggle(article.id, "saved")} aria-label="Read later" />}>
                  <Bookmark className={article.saved ? "fill-foreground text-foreground" : ""} />
                </TooltipTrigger>
                <TooltipContent>Read later</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger render={<Button variant="ghost" size="icon-sm" aria-label="Generate TLDR" />}>
                  <Astroid />
                </TooltipTrigger>
                <TooltipContent>Generate TLDR</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger render={<Button variant="ghost" size="icon-sm" aria-label="Share" />}>
                  <Share2 />
                </TooltipTrigger>
                <TooltipContent>Share</TooltipContent>
              </Tooltip>
            </CardFooter>
          </Card>
        ))}
      </div>
    </TooltipProvider>
  );
};

export default ArticleGrid;
