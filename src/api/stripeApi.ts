import { useMutation, useQuery } from "@tanstack/react-query";
import { StripeService } from "@agensy/services";

export const useGetSessionDetailsQuery = (sessionId: string) => {
  return useQuery({
    queryKey: ["stripe-session-details", sessionId],
    queryFn: () => StripeService.getSessionDetails(sessionId),
    enabled: !!sessionId,
    retry: 1,
    retryDelay: 1000,
  });
};

export const useCreateCheckoutSessionMutation = () => {
  return useMutation({
    mutationFn: async () => await StripeService.createCheckoutSession(),
  });
};
