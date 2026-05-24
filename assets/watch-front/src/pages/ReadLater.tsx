import { useState } from "react";
import { MOCK_ARTICLES, type ArticleState } from "@/mocks/articles";
import ArticleGrid from "@/components/ArticleGrid";

const ReadLater = () => {
  const [articles, setArticles] = useState<ArticleState[]>(
    MOCK_ARTICLES.filter((a) => a.saved)
  );

  const toggle = (id: string, field: "liked" | "saved") => {
    setArticles((prev) =>
      prev.map((a) => (a.id === id ? { ...a, [field]: !a[field] } : a))
    );
  };

  return (
    <ArticleGrid
      articles={articles}
      onToggle={toggle}
      emptyMessage="Nothing saved for later yet."
    />
  );
};

export default ReadLater;
