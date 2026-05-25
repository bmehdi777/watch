const base = () => (window as any).__ENV__?.API_URL ?? "/api/v1";

export type AIModel = {
  id: string;
  name: string;
  display_name: string;
  prefix_request: string;
  enabled: boolean;
};

export type AIUpdatePayload = {
  name: string;
  display_name: string;
  prefix_request: string;
  enabled?: boolean;
};

export const fetchAIModels = async (): Promise<AIModel[]> => {
  const res = await fetch(`${base()}/models`);
  if (!res.ok) throw new Error("Failed to fetch AI models");
  return res.json();
};

export const updateAIModel = async (id: string, payload: AIUpdatePayload): Promise<void> => {
  const res = await fetch(`${base()}/models/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to update AI model");
};
