import React from "react";
import { Card } from "@agensy/components";

interface DashboardWidgetProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}

export const DashboardWidget: React.FC<DashboardWidgetProps> = ({
  title,
  value,
  icon,
}) => {
  return (
    <Card className="border-gray-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <h3 className="text-xl font-semibold">{value}</h3>
        </div>
        <div className="text-2xl">{icon}</div>
      </div>
    </Card>
  );
};

export default DashboardWidget;
