import { DashboardService } from "@agensy/services";
import { useQuery } from "@tanstack/react-query";

export const useGetDashboardData = (clientId?: string | null) => {
  return useQuery({
    queryKey: ["dashboard", clientId],
    queryFn: async () =>
      await DashboardService.getDashboardData(clientId || undefined),
    enabled: true,
  });
};
