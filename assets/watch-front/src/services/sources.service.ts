export type Source = {
  id: string;
  title: string;
  blog_url: string;
  rss_url: string;
  enabled: boolean;
};

export type SourcePayload = Omit<Source, "id">;

const base = () => (window as any).__ENV__?.API_URL ?? "/api/v1";

export const fetchSources = async (): Promise<Source[]> => {
  const res = await fetch(`${base()}/sources`);
  if (!res.ok) throw new Error("Failed to fetch sources");
  return res.json();
};

export const createSource = async (payload: SourcePayload): Promise<void> => {
  const res = await fetch(`${base()}/sources`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to create source");
};

export const updateSource = async (id: string, payload: SourcePayload): Promise<void> => {
  const res = await fetch(`${base()}/sources/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to update source");
};

export const deleteSource = async (id: string): Promise<void> => {
  const res = await fetch(`${base()}/sources/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete source");
};
