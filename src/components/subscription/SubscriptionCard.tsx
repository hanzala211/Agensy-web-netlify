import React, { useEffect, useState } from "react";
import { ConfirmationModal, PrimaryButton } from "@agensy/components";
import { COLORS, ICONS } from "@agensy/constants";
import { useCreateCheckoutSessionMutation } from "@agensy/api";
import { Badge } from "antd";

interface SubscriptionCardProps {
  title: string;
  price: number;
  period: string;
  description: string;
  features: string[];
  buttonText: string;
  isFeatured?: boolean;
  onCancelSubscription?: () => void;
  cancelSubscriptionPending?: boolean;
}

export const SubscriptionCard: React.FC<SubscriptionCardProps> = ({
  title,
  price,
  period,
  description,
  features,
  buttonText,
  isFeatured = false,
  onCancelSubscription,
  cancelSubscriptionPending = false,
}) => {
  const createSessionMutation = useCreateCheckoutSessionMutation();
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] =
    useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  useEffect(() => {
    if (createSessionMutation.status === "success") {
      window.location.href = createSessionMutation.data.url;
    }
  }, [createSessionMutation.status]);

  const handleCancelSubscription = () => {
    setIsConfirmationModalOpen(false);
    onCancelSubscription?.();
  };

  return (
    // @ts-expect-error // Antd Badge.Ribbon is not typed
    <Badge.Ribbon
      text="Active"
      color="green"
      style={{
        display: isFeatured ? "block" : "none",
        scale: isHovered ? 1.25 : 1.05,
        transition: "all 0.2s linear",
        transform: isHovered ? "translateY(-5px)" : "translateY(0)",
      }}
    >
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`shadow-lg border-gray-100/60  bg-basicWhite/90 rounded-3xl borderhover:shadow-xl hover:scale-[1.02] transition-all duration-300 overflow-hidden h-full p-8`}
      >
        <div className="space-y-6">
          <div>
            <h3 className={`text-2xl font-bold text-gray-800`}>{title}</h3>
            <div className="mt-6">
              <div className="flex items-baseline">
                <span
                  className={`text-5xl font-extrabold tracking-tight text-gray-900`}
                >
                  ${price}
                </span>
                <span className={`ml-2 text-lg text-gray-500`}>/{period}</span>
              </div>
            </div>
            <p className={`mt-6 text-lg text-gray-600`}>{description}</p>
          </div>

          <div className="flex-1">
            <ul className="space-y-4">
              {features.map((feature, index) => (
                <li key={index} className={`flex items-center text-gray-600`}>
                  <span className="flex-shrink-0">
                    {price !== 0 ? (
                      <ICONS.check className="w-5 h-5 text-primaryColor" />
                    ) : (
                      <ICONS.close className="w-5 h-5 text-red-500" />
                    )}
                  </span>
                  <span className={`ml-3 text-base text-gray-600`}>
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
              <PrimaryButton
                aria_label="Cancel"
                onClick={() => {
                  setIsHovered(false);
                  setIsConfirmationModalOpen(true);
                }}
                isLoading={cancelSubscriptionPending}
                disabled={cancelSubscriptionPending}
                loaderColor={COLORS.primaryColor}
                className="w-full bg-white hover:bg-gray-50 !text-primaryColor !border-primaryColor hover:!text-gray-800 hover:!border-gray-800 !py-4 justify-center text-lg font-semibold transition-colors duration-200"
              >
                Cancel Plan
              </PrimaryButton>
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
      {/* @ts-expect-error // Antd Badge.Ribbon is not typed */}
    </Badge.Ribbon>
  );
};

export default SubscriptionCard;
