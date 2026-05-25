import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchAIModels,
  updateAIModel,
  type AIUpdatePayload,
} from "@/services/ai.service";

export const useAIModels = () => {
  return useQuery({
    queryKey: ["ai-models"],
    queryFn: fetchAIModels,
  });
};

export const useUpdateAIModel = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: AIUpdatePayload }) =>
      updateAIModel(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["ai-models"] }),
  });
};
