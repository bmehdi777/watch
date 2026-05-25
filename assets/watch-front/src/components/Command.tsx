import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Newspaper, Rss, Heart, Clock, ScrollText, Settings } from "lucide-react";
import {
  Command as ShadcnCommand,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { useSources } from "@/hooks/sources.hook";
import { useArticleSearch } from "@/hooks/articles.hook";

const PAGES = [
  { label: "Articles",   path: "/articles",   icon: <Newspaper className="size-4" /> },
  { label: "Liked",      path: "/liked",       icon: <Heart className="size-4" /> },
  { label: "Read later", path: "/read-later",  icon: <Clock className="size-4" /> },
  { label: "Sources",    path: "/sources",     icon: <Rss className="size-4" /> },
  { label: "Logs",       path: "/logs",        icon: <ScrollText className="size-4" /> },
  { label: "Settings",   path: "/settings",    icon: <Settings className="size-4" /> },
];

interface CommandProps {
  searchOpen: boolean;
  setSearchOpen: (value: boolean) => void;
}

const Command = ({ searchOpen, setSearchOpen }: CommandProps) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const { data: sources = [] } = useSources();
  const { data: articles = [] } = useArticleSearch(
    query.trim().length >= 2 ? { title: query.trim() } : {}
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        setSearchOpen(!searchOpen);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [searchOpen, setSearchOpen]);

  // Reset query when dialog closes
  useEffect(() => {
    if (!searchOpen) setQuery("");
  }, [searchOpen]);

  const go = (path: string) => {
    navigate(path);
    setSearchOpen(false);
  };

  const filteredPages = query
    ? PAGES.filter((p) => p.label.toLowerCase().includes(query.toLowerCase()))
    : PAGES;

  return (
    <CommandDialog open={searchOpen} onOpenChange={setSearchOpen}>
      <ShadcnCommand shouldFilter={false}>
        <CommandInput
          placeholder="Search pages, sources, articles…"
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>

          {filteredPages.length > 0 && (
            <CommandGroup heading="Pages">
              {filteredPages.map((page) => (
                <CommandItem key={page.path} onSelect={() => go(page.path)}>
                  {page.icon}
                  {page.label}
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {sources.length > 0 && (
            <CommandGroup heading="Sources">
              {sources
                .filter((s) =>
                  !query || s.title.toLowerCase().includes(query.toLowerCase())
                )
                .slice(0, 6)
                .map((source) => (
                  <CommandItem key={source.id} onSelect={() => go("/sources")}>
                    <Rss className="size-4" />
                    {source.title}
                  </CommandItem>
                ))}
            </CommandGroup>
          )}

          {query.trim().length >= 2 && articles.length > 0 && (
            <CommandGroup heading="Articles">
              {articles.slice(0, 8).map((article) => (
                <CommandItem
                  key={article.id}
                  onSelect={() => go(`/articles/${article.id}`)}
                >
                  <Newspaper className="size-4" />
                  {article.title}
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </ShadcnCommand>
    </CommandDialog>
  );
};

export default Command;
