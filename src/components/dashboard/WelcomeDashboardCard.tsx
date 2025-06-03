import React from "react";
import { Card } from "@agensy/components";

export const WelcomeDashboardCard: React.FC = () => {
  return (
    <Card ariaLabel="View all messages" className="border-gray-300">
      <div className="space-y-3">
        <h1 className="text-2xl font-semibold text-gray-800">Welcome Back!</h1>
        <p className="text-gray-600 text-lg">Here's what's happening today</p>
      </div>
    </Card>
  );
};

export default WelcomeDashboardCard;
