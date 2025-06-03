import React, { useEffect } from "react";
import {
  BorderedCard,
  Card,
  CardSkeleton,
  EmptyStateCard,
  TertiaryButton,
} from "@agensy/components";
import { ICONS } from "@agensy/constants";
import { DateUtils, toast } from "@agensy/utils";
import {
  useGetBillingHistoryQuery,
  useGetInvoiceLinkMutation,
} from "@agensy/api";
import type { BillingHistory } from "@agensy/types";

export const BillingHistoryCard: React.FC = () => {
  const { data: billingHistory, isLoading: isBillingHistoryLoading } =
    useGetBillingHistoryQuery();
  const getInvoiceLinkMutation = useGetInvoiceLinkMutation();

  const handleStartDownload = () => {
    toast.info("Processing Invoice...");
    const url = getInvoiceLinkMutation.data.download_url;
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "invoice.pdf");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    if (getInvoiceLinkMutation.status === "success") {
      handleStartDownload();
      getInvoiceLinkMutation.reset();
    } else if (getInvoiceLinkMutation.status === "error") {
      toast.error("Failed to Download Invoice");
    }
  }, [getInvoiceLinkMutation.status]);

  const handleDownloadInvoice = (invoiceNumber: string) => {
    getInvoiceLinkMutation.mutate(invoiceNumber);
  };

  if (isBillingHistoryLoading) return <CardSkeleton />;

  return (
    <Card title="Billing History">
      <div className="space-y-4">
        {billingHistory && billingHistory?.length > 0 ? (
          billingHistory.map((invoice: BillingHistory) => (
            <BorderedCard key={invoice.id}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-base text-gray-900 font-extrabold">
                      {invoice.amount}{" "}
                      <span className="text-gray-400 text-sm font-semibold">
                        {invoice?.currency?.toUpperCase()}
                      </span>
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    Card Number:{" "}
                    <span className="font-semibold">
                      **** **** **** **** {invoice?.payment_method.last4}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    Plan Start Time:{" "}
                    <span className="font-semibold">
                      {DateUtils.formatDateToRequiredFormat(
                        invoice.current_period_start
                      )}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    Plan Expiration Time:{" "}
                    <span className="font-semibold">
                      {DateUtils.formatDateToRequiredFormat(
                        invoice.current_period_end
                      )}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <TertiaryButton
                    onClick={() =>
                      handleDownloadInvoice(invoice?.id.toString())
                    }
                    aria_label="Download invoice"
                    className="hover:bg-green-50 hover:text-green-500 hover:border-green-300"
                  >
                    <span className="flex items-center gap-2">
                      <ICONS.download />
                    </span>
                  </TertiaryButton>
                </div>
              </div>
            </BorderedCard>
          ))
        ) : (
          <EmptyStateCard
            ICON={ICONS.subscription}
            label="billing history"
            showText={false}
          />
        )}
      </div>
    </Card>
  );
};

export default BillingHistoryCard;
