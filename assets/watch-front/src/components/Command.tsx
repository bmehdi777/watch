import { useEffect } from "react";
import { Newspaper, Rss } from "lucide-react";
import {
  Command as ShadcnCommand,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";

const SEARCH_ITEMS = [
  { group: "Pages", label: "Sources", path: "/sources", icon: <Rss /> },
  { group: "Pages", label: "Articles", path: "/articles", icon: <Newspaper /> },
  { group: "Sources", label: "Hacker News", path: "/sources", icon: <Rss /> },
  { group: "Sources", label: "The Verge", path: "/sources", icon: <Rss /> },
  { group: "Sources", label: "CSS-Tricks", path: "/sources", icon: <Rss /> },
  { group: "Sources", label: "Go Blog", path: "/sources", icon: <Rss /> },
];

interface CommandProps {
  searchOpen: boolean;
  setSearchOpen: (value: boolean) => void;
}

const Command = (props: CommandProps) => {
  const { searchOpen, setSearchOpen } = props;

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

  return (
    <>
      <CommandDialog open={searchOpen} onOpenChange={setSearchOpen}>
        <ShadcnCommand>
          <CommandInput placeholder="Search…" />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            {["Pages", "Sources"].map((group) => (
              <CommandGroup key={group} heading={group}>
                {SEARCH_ITEMS.filter((i) => i.group === group).map((item) => (
                  <CommandItem
                    key={item.label}
                    onSelect={() => setSearchOpen(false)}
                  >
                    {item.icon}
                    {item.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </ShadcnCommand>
      </CommandDialog>
    </>
  );
};

export default Command;
