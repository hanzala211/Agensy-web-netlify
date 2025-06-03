import React, { useEffect, useState } from "react";
import {
  ConfirmationModal,
  PrimaryButton,
  SecondaryButton,
} from "@agensy/components";
import { ICONS } from "@agensy/constants";
import { useCreateCheckoutSessionMutation } from "@agensy/api";

interface SubscriptionCardProps {
  title: string;
  price: number;
  period: string;
  description: string;
  features: string[];
  buttonText: string;
  isFeatured?: boolean;
  onSubscribe?: () => void;
}

export const SubscriptionCard: React.FC<SubscriptionCardProps> = ({
  title,
  price,
  period,
  description,
  features,
  buttonText,
  isFeatured = false,
  onSubscribe,
}) => {
  const createSessionMutation = useCreateCheckoutSessionMutation();
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] =
    useState<boolean>(false);

  useEffect(() => {
    if (createSessionMutation.status === "success") {
      window.location.href = createSessionMutation.data.url;
    }
  }, [createSessionMutation.status]);

  const handleCancelSubscription = () => {
    setIsConfirmationModalOpen(false);
    onSubscribe?.();
  };

  return (
    <div
      className={`shadow-lg rounded-3xl border ${
        isFeatured
          ? "border-blue-200 bg-primaryColor"
          : "border-gray-100/60 bg-basicWhite/90"
      } hover:shadow-xl hover:scale-[1.02] transition-all duration-300 overflow-hidden h-full flex flex-col p-8`}
    >
      <div className="space-y-6">
        <div>
          <h3
            className={`text-2xl font-bold ${
              isFeatured ? "text-basicWhite" : "text-gray-800"
            }`}
          >
            {title}
          </h3>
          <div className="mt-6">
            <div className="flex items-baseline">
              <span
                className={`text-5xl font-extrabold tracking-tight ${
                  isFeatured ? "text-basicWhite" : "text-gray-900"
                }`}
              >
                ${price}
              </span>
              <span
                className={`ml-2 text-lg ${
                  isFeatured ? "text-gray-300" : "text-gray-500"
                }`}
              >
                /{period}
              </span>
            </div>
          </div>
          <p
            className={`mt-6 text-lg ${
              isFeatured ? "text-basicWhite/90" : "text-gray-600"
            }`}
          >
            {description}
          </p>
        </div>

        <div className="flex-1">
          <ul className="space-y-4">
            {features.map((feature, index) => (
              <li
                key={index}
                className={`flex items-center ${
                  isFeatured ? "text-basicWhite" : "text-gray-600"
                }`}
              >
                <span className="flex-shrink-0">
                  <ICONS.check
                    color={isFeatured ? "white" : "#4F46E5"}
                    className="w-5 h-5"
                  />
                </span>
                <span
                  className={`ml-3 text-base ${
                    isFeatured ? "text-basicWhite/90" : "text-gray-600"
                  }`}
                >
                  {feature}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="pt-8">
          {!isFeatured && price !== 0 && (
            <PrimaryButton
              aria_label={buttonText}
              onClick={() => createSessionMutation.mutate()}
              isLoading={createSessionMutation.isPending}
              disabled={createSessionMutation.isPending}
              className="w-full !py-4 !min-h-auto !h-auto justify-center text-lg font-semibold hover:opacity-90 transition-opacity duration-200"
            >
              {buttonText}
            </PrimaryButton>
          )}

          {isFeatured && price !== 0 && (
            <SecondaryButton
              aria_label="Cancel"
              onClick={() => setIsConfirmationModalOpen(true)}
              className="w-full bg-white hover:bg-gray-50 hover:text-primaryColor !py-4 justify-center text-lg font-semibold transition-colors duration-200"
            >
              Cancel
            </SecondaryButton>
          )}
        </div>
        <ConfirmationModal
          title="Cancel Subscription"
          isModalOpen={isConfirmationModalOpen}
          onOk={handleCancelSubscription}
          onCancel={() => setIsConfirmationModalOpen(false)}
        >
          <p>Are you sure you want to cancel your subscription?</p>
        </ConfirmationModal>
      </div>
    </div>
  );
};

export default SubscriptionCard;
