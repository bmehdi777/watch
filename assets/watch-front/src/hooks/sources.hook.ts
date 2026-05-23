import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createSource,
  deleteSource,
  fetchSources,
  updateSource,
  type SourcePayload,
} from "@/services/sources.service";

export const useSources = () => {
  return useQuery({
    queryKey: ["sources"],
    queryFn: fetchSources,
  });
};

export const useCreateSource = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: SourcePayload) => createSource(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["sources"] }),
  });
};

export const useUpdateSource = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: SourcePayload }) =>
      updateSource(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["sources"] }),
  });
};

export const useDeleteSource = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteSource(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["sources"] }),
  });
};
