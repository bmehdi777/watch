const base = () => (window as any).__ENV__?.API_URL ?? "/api/v1";

export const triggerCrawl = async (): Promise<void> => {
  const res = await fetch(`${base()}/crawler`, { method: "POST" });
  if (!res.ok) throw new Error("Failed to trigger crawl");
};
