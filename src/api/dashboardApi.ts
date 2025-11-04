import { DashboardService } from "@agensy/services";
import { useQuery } from "@tanstack/react-query";

export const useGetDashboardData = () => {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => await DashboardService.getDashboardData(),
    enabled: true,
  });
};
