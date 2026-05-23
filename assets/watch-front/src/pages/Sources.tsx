import { useState } from "react";
import {
  useCreateSource,
  useDeleteSource,
  useSources,
  useUpdateSource,
} from "@/hooks/sources.hook";
import type { Source, SourcePayload } from "@/services/sources.service";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  onClose,
}: {
  state: DialogState;
  onClose: () => void;
}) => {
  const isEdit = state.mode === "edit";
  const [form, setForm] = useState<SourcePayload>(
    isEdit ? state.source : EMPTY_FORM
  );

  const createSource = useCreateSource();
  const updateSource = useUpdateSource();

  const handleChange = (field: keyof SourcePayload, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (isEdit) {
      updateSource.mutate(
        { id: (state as { mode: "edit"; source: Source }).source.id, payload: form },
        { onSuccess: onClose }
      );
    } else {
      createSource.mutate(form, { onSuccess: onClose });
    }
  };

  const isPending = createSource.isPending || updateSource.isPending;

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
        <Button onClick={handleSubmit} disabled={isPending}>
          {isEdit ? "Save" : "Add"}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

const Sources = () => {
  const { data: sources = [], isLoading } = useSources();
  const deleteSource = useDeleteSource();
  const [dialog, setDialog] = useState<DialogState>({ mode: "closed" });

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button variant="secondary" onClick={() => setDialog({ mode: "add" })}>Add source</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Blog URL</TableHead>
            <TableHead>RSS URL</TableHead>
            <TableHead>Enabled</TableHead>
            <TableHead className="w-[120px]" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground">
                Loading…
              </TableCell>
            </TableRow>
          ) : sources.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground">
                No sources yet.
              </TableCell>
            </TableRow>
          ) : (
            sources.map((source) => (
              <TableRow key={source.id}>
                <TableCell>{source.title}</TableCell>
                <TableCell>{source.blog_url}</TableCell>
                <TableCell>{source.rss_url}</TableCell>
                <TableCell>{source.enabled ? "Yes" : "No"}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
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
                      disabled={deleteSource.isPending}
                      onClick={() => deleteSource.mutate(source.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <Dialog
        open={dialog.mode !== "closed"}
        onOpenChange={(open) => !open && setDialog({ mode: "closed" })}
      >
        {dialog.mode !== "closed" && (
          <SourceFormDialog
            state={dialog}
            onClose={() => setDialog({ mode: "closed" })}
          />
        )}
      </Dialog>
    </div>
  );
};

export default Sources;
