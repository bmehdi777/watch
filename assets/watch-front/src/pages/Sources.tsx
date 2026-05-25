import { useState } from "react";
import type { Source, SourcePayload } from "@/services/sources.service";
import {
  useSources,
  useCreateSource,
  useUpdateSource,
  useDeleteSource,
} from "@/hooks/sources.hook";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, Pencil, Trash2, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const EMPTY_FORM: SourcePayload = {
  title: "",
  blog_url: "",
  rss_url: "",
  enabled: true,
};

type DialogState =
  | { mode: "closed" }
  | { mode: "add" }
  | { mode: "edit"; source: Source };

const SourceFormDialog = ({
  state,
  onSubmit,
  onClose,
}: {
  state: DialogState;
  onSubmit: (form: SourcePayload, id?: string) => void;
  onClose: () => void;
}) => {
  const isEdit = state.mode === "edit";
  const [form, setForm] = useState<SourcePayload>(
    isEdit ? state.source : EMPTY_FORM
  );

  const handleChange = (field: keyof SourcePayload, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{isEdit ? "Edit source" : "Add source"}</DialogTitle>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={form.title}
            onChange={(e) => handleChange("title", e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="blog_url">Blog URL</Label>
          <Input
            id="blog_url"
            value={form.blog_url}
            onChange={(e) => handleChange("blog_url", e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="rss_url">RSS URL</Label>
          <Input
            id="rss_url"
            value={form.rss_url}
            onChange={(e) => handleChange("rss_url", e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            id="enabled"
            type="checkbox"
            checked={form.enabled}
            onChange={(e) => handleChange("enabled", e.target.checked)}
            className="size-4 rounded border-border accent-foreground cursor-pointer"
          />
          <Label htmlFor="enabled" className="cursor-pointer">Enabled</Label>
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button onClick={() => { onSubmit(form, isEdit ? state.source.id : undefined); onClose(); }}>
          {isEdit ? "Save" : "Add"}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

const SourceRow = ({
  source,
  onEdit,
  onDelete,
}: {
  source: Source;
  onEdit: (source: Source) => void;
  onDelete: (id: string) => void;
}) => (
  <div className="group relative flex items-center gap-4 py-3.5 border-b border-border last:border-0 hover:bg-accent/50 -mx-4 px-4 transition-colors duration-100">

    {/* Enabled indicator */}
    <div className="relative z-10 w-9 shrink-0 flex justify-center">
      <span className={cn(
        "size-2 rounded-full mt-0.5",
        source.enabled ? "bg-emerald-500" : "bg-border"
      )} />
    </div>

    <div className="relative z-10 w-px h-7 bg-border shrink-0" />

    {/* Title + blog URL */}
    <div className="relative z-10 flex-1 min-w-0">
      <p className={cn(
        "text-sm font-medium leading-snug line-clamp-1 transition-colors",
        "text-foreground group-hover:text-foreground/75",
      )}>
        {source.title}
      </p>
      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-1 mt-0.5 font-mono">
        {source.blog_url}
      </p>
    </div>

    {/* RSS URL — visible at rest, hidden on hover */}
    <p className="relative z-10 text-xs text-muted-foreground/50 font-mono truncate max-w-52 shrink-0 group-hover:opacity-0 transition-opacity select-none">
      {source.rss_url}
    </p>

    {/* Action buttons — revealed on hover */}
    <div className="relative z-10 flex items-center gap-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
      <Button
        variant="ghost" size="icon-sm"
        onClick={() => onEdit(source)}
        aria-label="Edit"
      >
        <Pencil className="size-3.5" />
      </Button>
      <Button
        variant="ghost" size="icon-sm"
        onClick={() => onDelete(source.id)}
        aria-label="Delete"
        className="text-destructive hover:text-destructive"
      >
        <Trash2 className="size-3.5" />
      </Button>
    </div>

  </div>
);

const Sources = () => {
  const { data: sources = [], isLoading, isError } = useSources();
  const createSource = useCreateSource();
  const updateSource = useUpdateSource();
  const deleteSource = useDeleteSource();

  const [dialog, setDialog] = useState<DialogState>({ mode: "closed" });
  const [search, setSearch] = useState("");

  const filtered = sources.filter((s) =>
    s.title.toLowerCase().includes(search.toLowerCase()) ||
    s.blog_url.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = (form: SourcePayload, id?: string) => {
    if (id) {
      updateSource.mutate({ id, payload: form });
    } else {
      createSource.mutate(form);
    }
  };

  return (
    <div className="space-y-4">

      {/* Toolbar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search sources…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button size="sm" onClick={() => setDialog({ mode: "add" })}>
          <Plus className="size-4" />
          Add source
        </Button>
      </div>

      {/* States */}
      {isLoading && (
        <div className="text-center text-muted-foreground py-16">Loading…</div>
      )}
      {isError && (
        <div className="text-center text-destructive py-16">Failed to load sources.</div>
      )}
      {!isLoading && !isError && filtered.length === 0 && (
        <div className="text-center text-muted-foreground py-16">
          {search ? "No sources match your search." : "No sources yet."}
        </div>
      )}

      {/* List */}
      {!isLoading && !isError && filtered.length > 0 && (
        <div className="relative">
          {filtered.map((source) => (
            <SourceRow
              key={source.id}
              source={source}
              onEdit={(s) => setDialog({ mode: "edit", source: s })}
              onDelete={(id) => deleteSource.mutate(id)}
            />
          ))}
        </div>
      )}

      {/* Footer count */}
      {!isLoading && !isError && sources.length > 0 && (
        <p className="text-xs text-muted-foreground text-right pb-2">
          {filtered.length} of {sources.length} sources
        </p>
      )}

      <Dialog
        open={dialog.mode !== "closed"}
        onOpenChange={(open) => !open && setDialog({ mode: "closed" })}
      >
        {dialog.mode !== "closed" && (
          <SourceFormDialog
            state={dialog}
            onSubmit={handleSubmit}
            onClose={() => setDialog({ mode: "closed" })}
          />
        )}
      </Dialog>

    </div>
  );
};

export default Sources;
