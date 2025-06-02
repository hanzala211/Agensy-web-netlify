import { CommonLoader, PrimaryButton } from "@agensy/components";
import { ICONS } from "@agensy/constants";
import { useLocation, useNavigate } from "react-router-dom";
import {
  useGetSessionDetailsQuery,
  useCreateCheckoutSessionMutation,
} from "@agensy/api";
import { useEffect, useMemo } from "react";

export const PaymentStatus = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    data: sessionDetails,
    isLoading: isSessionDetailsLoading,
    refetch: loadSessionDetails,
    status: sessionDetailsStatus,
  } = useGetSessionDetailsQuery(location.search?.split("=")?.[1]);
  const createSessionMutation = useCreateCheckoutSessionMutation();
  const sessionId = useMemo(() => {
    return location.search?.split("=")?.[1];
  }, [location.search]);

  useEffect(() => {
    if (createSessionMutation.status === "success") {
      window.location.href = createSessionMutation.data.url;
    }
  }, [createSessionMutation.status]);

  useEffect(() => {
    if (sessionId) loadSessionDetails();
  }, [sessionId]);

  const formatAmount = (amount: number) => {
    return `$${(amount / 100).toFixed(2)}`;
  };

  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      {isSessionDetailsLoading ? (
        <div className="w-full h-full flex items-center justify-center">
          <CommonLoader />
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full flex flex-col items-center">
          <div
            className={`w-12 h-12 ${sessionDetailsStatus === "success" ? "bg-green-100" : "bg-red-100"
              } rounded-md flex items-center justify-center mb-6`}
          >
            <div
              className={`border p-1 rounded-xl ${sessionDetailsStatus === "success"
                  ? "border-green-500"
                  : "border-red-500"
                }`}
            >
              {sessionDetailsStatus === "success" &&
                sessionDetails?.payment_status === "paid" ? (
                <ICONS.dollar className={`text-green-500`} size={20} />
              ) : (
                <ICONS.close className={`text-red-500`} size={20} />
              )}
            </div>
          </div>
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">
            {sessionDetailsStatus === "success" &&
              sessionDetails?.payment_status === "paid"
              ? "Payment Successful"
              : "Payment Failed"}
          </h1>

          {sessionDetailsStatus === "success" &&
            sessionDetails?.payment_status === "paid" ? (
            <div className="w-full space-y-4 mb-8">
              <div className="border-b pb-4">
                <h2 className="text-lg font-medium text-gray-700 mb-4">
                  Customer Details
                </h2>
                <div className="space-y-2">
                  <p className="text-gray-600">
                    <span className="font-medium">Name:</span>{" "}
                    {sessionDetails.customer_details.name}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Email:</span>{" "}
                    {sessionDetails.customer_details.email}
                  </p>
                </div>
              </div>

              <div className="border-b pb-4">
                <h2 className="text-lg font-medium text-gray-700 mb-4">
                  Payment Details
                </h2>
                <div className="space-y-2">
                  <p className="text-gray-600">
                    <span className="font-medium">Amount Paid:</span>{" "}
                    {formatAmount(sessionDetails.amount_total)}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Payment Status:</span>{" "}
                    <span className="capitalize text-green-600">
                      {sessionDetails.payment_status}
                    </span>
                  </p>
                </div>
              </div>
              <div>
                <p className="text-gray-600">
                  {/*  todo Add Download invoice button */}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-gray-600 text-center mb-8">
              Your payment has failed. Please try again.
            </p>
          )}

          <div className="flex gap-4 w-full">
            {sessionDetailsStatus === "success" &&
              sessionDetails?.payment_status === "paid" && (
                <PrimaryButton
                  onClick={() => navigate("/")}
                  aria_label="Continue"
                >
                  Continue
                </PrimaryButton>
              )}
            {(sessionDetailsStatus === "error" || !sessionId) && (
              <PrimaryButton
                aria_label="Try Again"
                onClick={() => createSessionMutation.mutate()}
                isLoading={createSessionMutation.isPending}
                disabled={createSessionMutation.isPending}
              >
                Try Again
              </PrimaryButton>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentStatus;
