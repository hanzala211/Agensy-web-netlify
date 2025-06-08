import { MessagesThreadService } from "@agensy/services";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useCreateThread = () => {
  return useMutation({
    mutationFn: (data: unknown) => MessagesThreadService.createThread(data),
  });
};

export const useGetAllThreadsQuery = () => {
  return useQuery({
    queryKey: ["threads"],
    queryFn: () => MessagesThreadService.getAllThreads(),
    enabled: false,
  });
};

export const useGetSingleThreadQuery = (threadId: string) => {
  return useQuery({
    queryKey: ["thread", threadId],
    queryFn: () => MessagesThreadService.getSingleThread(threadId),
    enabled: false,
  });
};
