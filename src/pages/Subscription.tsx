import React, { useEffect } from "react";
import { SubscriptionCard, BillingHistoryCard } from "@agensy/components";
import { useAuthContext } from "@agensy/context";
import { useCancelSubscriptionMutation } from "@agensy/api";
import { toast } from "@agensy/utils";
import { APP_ACTIONS, PERMISSIONS, ROUTES } from "@agensy/constants";
import { Navigate } from "react-router-dom";

export const Subscription: React.FC = () => {
  const { userData, loadAuth } = useAuthContext();
  const cancelSubscription = useCancelSubscriptionMutation();
  const userPermissions =
    PERMISSIONS[userData?.role as keyof typeof PERMISSIONS] || [];

  useEffect(() => {
    if (cancelSubscription.status === "success") {
      loadAuth();
      toast.success("Subscription cancelled successfully");
    } else if (cancelSubscription.status === "error") {
      toast.error("Failed to cancel subscription");
    }
  }, [cancelSubscription.status]);

  const handleCancelSubscription = () => {
    cancelSubscription.mutate();
  };

  if (!userPermissions.includes(APP_ACTIONS.BillingPage))
    return <Navigate to={ROUTES.settings} />;

  return (
    <div className="mx-auto md:px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Choose Your Plan
        </h1>
        <p className="text-lg text-gray-600">
          Select the perfect plan for your needs
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
        <SubscriptionCard
          title="Free Plan"
          price={0}
          period="month"
          description="No features are available on Free."
          features={[
            "Client Management Tools",
            "Document Handling",
            "Communication Features",
            "Care Planning",
            "Appointment Management",
            "User Role Management",
          ]}
          buttonText="Choose Plan"
          isFeatured={userData?.subscription_status === "inactive"}
        />
        <SubscriptionCard
          title="Standard Plan"
          price={9.99}
          period="month"
          description="Subscribers receive access to a broad suite of features, including:"
          features={[
            "Client Management Tools",
            "Document Handling",
            "Communication Features",
            "Care Planning",
            "Appointment Management",
            "User Role Management",
          ]}
          buttonText="Choose Plan"
          isFeatured={userData?.subscription_status === "active"}
          onCancelSubscription={handleCancelSubscription}
          cancelSubscriptionPending={cancelSubscription.isPending}
        />
      </div>

      <div className="mt-12 max-w-5xl mx-auto">
        <BillingHistoryCard />
      </div>
    </div>
  );
};

export default Subscription;
