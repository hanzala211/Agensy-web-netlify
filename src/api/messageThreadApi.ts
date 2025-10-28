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
    staleTime: 0,
    gcTime: 0,
  });
};

export const useGetThreadByParticipantsMutation = () => {
  return useMutation({
    mutationFn: ({
      participants,
      clientId,
      type,
    }: {
      participants: string[];
      clientId?: string;
      type?: string;
    }) =>
      MessagesThreadService.getThreadByParticipants(
        participants,
        clientId,
        type
      ),
  });
};

export const useUploadThreadFileMutation = () => {
  return useMutation({
    mutationFn: (file: File) => MessagesThreadService.uploadThreadFile(file),
  });
};
