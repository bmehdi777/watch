import { useState } from "react";
import { useLogs } from "@/hooks/logs.hook";
import type { Log } from "@/services/logs.service";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search } from "lucide-react";

type Level = "all" | "info" | "warn" | "error";

const LEVEL_CONFIG: Record<string, { label: string; className: string }> = {
  info:  { label: "info",  className: "text-sky-600 dark:text-sky-400" },
  warn:  { label: "warn",  className: "text-amber-600 dark:text-amber-400" },
  error: { label: "error", className: "text-destructive" },
};

const fmt = (iso: string) => {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
};

const LevelBadge = ({ level }: { level: string }) => {
  const cfg = LEVEL_CONFIG[level] ?? LEVEL_CONFIG.info;
  return (
    <span className={`font-mono text-xs font-medium ${cfg.className}`}>
      {cfg.label}
    </span>
  );
};

const FILTERS: { value: Level; label: string }[] = [
  { value: "all",   label: "All"   },
  { value: "info",  label: "Info"  },
  { value: "warn",  label: "Warn"  },
  { value: "error", label: "Error" },
];

const Logs = () => {
  const { data = [], isLoading, isError } = useLogs();
  const [filter, setFilter] = useState<Level>("all");
  const [search, setSearch] = useState("");

  const filtered = data
    .filter((l) => filter === "all" || l.level === filter)
    .filter((l) => !search || l.message.toLowerCase().includes(search.toLowerCase()))
    .slice()
    .reverse();

  const counts = {
    info:  data.filter((l) => l.level === "info").length,
    warn:  data.filter((l) => l.level === "warn").length,
    error: data.filter((l) => l.level === "error").length,
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search logs…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-1.5">
          {FILTERS.map(({ value, label }) => (
            <Button
              key={value}
              variant={filter === value ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setFilter(value)}
            >
              {label}
              {value !== "all" && counts[value] > 0 && (
                <span className="ml-1.5 tabular-nums text-muted-foreground">
                  {counts[value]}
                </span>
              )}
            </Button>
          ))}
        </div>
      </div>

      {/* States */}
      {isLoading && (
        <div className="text-center text-muted-foreground py-12">Loading…</div>
      )}
      {isError && (
        <div className="text-center text-destructive py-12">Failed to load logs.</div>
      )}
      {!isLoading && !isError && filtered.length === 0 && (
        <div className="text-center text-muted-foreground py-12">
          {search ? "No logs match your search." : "No logs yet."}
        </div>
      )}

      {/* Table */}
      {!isLoading && !isError && filtered.length > 0 && (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-44 font-mono">Timestamp</TableHead>
                <TableHead className="w-16">Level</TableHead>
                <TableHead>Message</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((log: Log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-mono text-xs text-muted-foreground tabular-nums whitespace-nowrap">
                    {fmt(log.created_at)}
                  </TableCell>
                  <TableCell>
                    <LevelBadge level={log.level} />
                  </TableCell>
                  <TableCell className="font-mono text-xs break-all">
                    {log.message}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Footer count */}
      {!isLoading && !isError && data.length > 0 && (
        <p className="text-xs text-muted-foreground text-right">
          {filtered.length} of {data.length} entries
        </p>
      )}
    </div>
  );
};

export default Logs;
