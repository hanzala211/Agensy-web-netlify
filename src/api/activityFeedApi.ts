import { useInfiniteQuery } from "@tanstack/react-query";
import { ActivityFeedService } from "@agensy/services";

interface ActivityFeedResponse {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  activities: Array<{
    id: string;
    user?: {
      first_name?: string;
      last_name?: string;
    };
    client?: {
      first_name?: string;
      last_name?: string;
    };
    category: "medical" | "appointments" | "documents";
    action_type: string;
    description: string;
    createdAt: string;
    updatedAt: string;
  }>;
}

export const useGetActivitiesQuery = (params?: {
  client_id?: string;
  limit?: number;
  category?: "medical" | "messages" | "appointments" | "documents";
  entity_type?: string;
}) => {
  return useInfiniteQuery<ActivityFeedResponse>({
    queryKey: ["activities", params],
    queryFn: async ({ pageParam = 1 }) => {
      return await ActivityFeedService.getActivities({
        ...params,
        page: pageParam as number,
      });
    },
    getNextPageParam: (lastPage) => {
      const pagination = lastPage?.pagination;
      if (pagination && pagination.page < pagination.totalPages) {
        return pagination.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    enabled: false,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    staleTime: 0,
  });
};
