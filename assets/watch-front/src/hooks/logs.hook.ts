import { useQuery } from "@tanstack/react-query";
import { fetchLogs } from "@/services/logs.service";

export const useLogs = () => {
  return useQuery({
    queryKey: ["logs"],
    queryFn: fetchLogs,
    refetchInterval: 10_000,
  });
};
