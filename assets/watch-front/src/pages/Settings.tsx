import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAIModels, useUpdateAIModel } from "@/hooks/ai.hook";
import type { AIModel } from "@/services/ai.service";
import { triggerCrawl } from "@/services/crawler.service";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SettingRow = ({
  label,
  description,
  children,
}: {
  label: string;
  description?: string;
  children: React.ReactNode;
}) => (
  <div className="flex flex-col sm:flex-row sm:items-start gap-3 py-5 border-b border-border last:border-0">
    <div className="sm:w-56 shrink-0">
      <p className="text-sm font-medium text-foreground">{label}</p>
      {description && (
        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{description}</p>
      )}
    </div>
    <div className="flex-1 min-w-0">{children}</div>
  </div>
);

const TldrSection = ({ models }: { models: AIModel[] }) => {
  const { mutate: update, isPending } = useUpdateAIModel();

  const activeModel = models.find((m) => m.enabled) ?? models[0];
  const [selectedName, setSelectedName] = useState(activeModel?.name ?? "");
  const [prefixRequest, setPrefixRequest] = useState(activeModel?.prefix_request ?? "");

  const selected = models.find((m) => m.name === selectedName);

  useEffect(() => {
    if (selected) setPrefixRequest(selected.prefix_request);
  }, [selectedName]);

  const handleSave = () => {
    if (!selected) return;

    const prevEnabled = models.find((m) => m.enabled && m.id !== selected.id);
    if (prevEnabled) {
      update({ id: prevEnabled.id, payload: { ...prevEnabled, enabled: false } });
    }

    update(
      { id: selected.id, payload: { ...selected, prefix_request: prefixRequest, enabled: true } },
      { onSuccess: () => toast("Settings saved.") },
    );
  };

  const isDirty =
    selected?.id !== activeModel?.id ||
    prefixRequest !== (selected?.prefix_request ?? "");

  return (
    <section>
      {/* Section header */}
      <div className="pb-4 border-b border-border">
        <h2 className="text-sm font-semibold text-foreground">TLDR</h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          AI model used to summarise articles on demand.
        </p>
      </div>

      {/* Rows */}
      <SettingRow
        label="Model"
        description="The model that generates article summaries."
      >
        <Select value={selectedName} onValueChange={setSelectedName}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a model…" />
          </SelectTrigger>
          <SelectContent>
            {models.map((m) => (
              <SelectItem key={m.id} value={m.name}>
                <span>{m.display_name || m.name}</span>
                {m.enabled && (
                  <span className="ml-2 font-mono text-[10px] text-muted-foreground">
                    active
                  </span>
                )}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {selected?.display_name && (
          <p className="font-mono text-[11px] text-muted-foreground mt-1.5">
            {selected.name}
          </p>
        )}
      </SettingRow>

      <SettingRow
        label="Prefix request"
        description="Prepended to the article content before sending to the model."
      >
        <Textarea
          rows={3}
          value={prefixRequest}
          onChange={(e) => setPrefixRequest(e.target.value)}
          placeholder="Summarise the following article:"
          className="font-mono text-sm resize-none"
        />
      </SettingRow>

      {/* Save */}
      <div className="flex justify-end pt-4">
        <Button
          size="sm"
          onClick={handleSave}
          disabled={isPending || !isDirty}
        >
          {isPending ? "Saving…" : "Save changes"}
        </Button>
      </div>
    </section>
  );
};

const CrawlerSection = () => {
  const { mutate: crawl, isPending } = useMutation({
    mutationFn: triggerCrawl,
    onSuccess: () => toast("Crawl started."),
    onError: () => toast("Failed to start crawl."),
  });

  return (
    <section>
      <div className="pb-4 border-b border-border">
        <h2 className="text-sm font-semibold text-foreground">Crawler</h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Manually trigger a crawl of all enabled sources.
        </p>
      </div>
      <SettingRow
        label="Force crawl"
        description="Fetch new articles from all enabled RSS sources immediately."
      >
        <Button size="sm" variant="outline" onClick={() => crawl()} disabled={isPending}>
          {isPending ? "Starting…" : "Run now"}
        </Button>
      </SettingRow>
    </section>
  );
};

const Settings = () => {
  const { data: models = [], isLoading, isError } = useAIModels();

  return (
    <div className="max-w-2xl mx-auto space-y-10">
      {isLoading && (
        <div className="text-center text-muted-foreground py-16">Loading…</div>
      )}
      {isError && (
        <div className="text-center text-destructive py-16">Failed to load settings.</div>
      )}
      {!isLoading && !isError && <TldrSection models={models} />}
      <CrawlerSection />
    </div>
  );
};

export default Settings;
