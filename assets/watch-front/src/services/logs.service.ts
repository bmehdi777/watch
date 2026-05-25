const base = () => (window as any).__ENV__?.API_URL ?? "/api/v1";

export type Log = {
  id: string;
  level: "info" | "warn" | "error";
  message: string;
  created_at: string;
};

export const fetchLogs = async (): Promise<Log[]> => {
  const res = await fetch(`${base()}/logs`);
  if (!res.ok) throw new Error("Failed to fetch logs");
  return res.json();
};
