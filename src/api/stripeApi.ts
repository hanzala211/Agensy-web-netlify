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

export const useCancelSubscriptionMutation = () => {
  return useMutation({
    mutationFn: async () => await StripeService.cancelSubscription(),
  });
};

export const useGetBillingHistoryQuery = () => {
  return useQuery({
    queryKey: ["stripe-billing-history"],
    queryFn: async () => await StripeService.getBillingHistory(),
  });
};

export const useGetInvoiceLinkMutation = () => {
  return useMutation({
    mutationFn: async (invoiceId: string) =>
      await StripeService.getInvoiceLink(invoiceId),
  });
};
