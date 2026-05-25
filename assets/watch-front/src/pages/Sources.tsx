import { useState } from "react";
import type { Source, SourcePayload } from "@/services/sources.service";
import {
  useSources,
  useCreateSource,
  useUpdateSource,
  useDeleteSource,
} from "@/hooks/sources.hook";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
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
import { Search } from "lucide-react";

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

  const handleSubmit = () => {
    onSubmit(form, isEdit ? state.source.id : undefined);
    onClose();
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
          />
          <Label htmlFor="enabled">Enabled</Label>
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSubmit}>
          {isEdit ? "Save" : "Add"}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

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

  const handleDelete = (id: string) => {
    deleteSource.mutate(id);
  };

  return (
    <div className="space-y-6">
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
        <Button onClick={() => setDialog({ mode: "add" })}>Add source</Button>
      </div>

      {isLoading && (
        <div className="text-center text-muted-foreground py-12">Loading…</div>
      )}

      {isError && (
        <div className="text-center text-destructive py-12">Failed to load sources.</div>
      )}

      {!isLoading && !isError && filtered.length === 0 && (
        <div className="text-center text-muted-foreground py-12">
          {search ? "No sources match your search." : "No sources yet."}
        </div>
      )}

      {!isLoading && !isError && filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((source) => (
            <Card key={source.id}>
              <CardHeader>
                <CardTitle>{source.title}</CardTitle>
                <CardDescription>
                  {source.enabled ? "Enabled" : "Disabled"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-1">
                <p className="text-xs text-muted-foreground truncate">
                  <span className="font-medium text-foreground">Blog</span>{" "}
                  {source.blog_url}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  <span className="font-medium text-foreground">RSS</span>{" "}
                  {source.rss_url}
                </p>
              </CardContent>
              <CardFooter className="gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDialog({ mode: "edit", source })}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(source.id)}
                >
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
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
