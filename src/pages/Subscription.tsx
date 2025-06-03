import React from "react";
import { SubscriptionCard } from "@agensy/components";
import { useAuthContext } from "@agensy/context";

export const Subscription: React.FC = () => {
  const { userData } = useAuthContext();
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
          title="Individuals"
          price={0}
          period="month"
          description="Good for solo clients."
          features={[
            "1 user",
            "Unlimited Calendars",
            "Unlimited Appointments",
            "Unlimited Documents",
            "Messages",
            "Unlimited Clients",
          ]}
          buttonText="Choose Plan"
          isFeatured={userData?.subscription_status === "inactive"}
          onSubscribe={() => null}
        />
        <SubscriptionCard
          title="Teams"
          price={9}
          period="month"
          description="Good for solo clients."
          features={[
            "1 user",
            "Unlimited Calendars",
            "Unlimited Appointments",
            "Unlimited Documents",
            "Messages",
            "Unlimited Clients",
          ]}
          buttonText="Choose Plan"
          isFeatured={userData?.subscription_status === "active"}
          onSubscribe={() => null}
        />
      </div>
    </div>
  );
};

export default Subscription;
