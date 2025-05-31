import { BorderedCard } from "@agensy/components";
import React from "react";
import type { ReactNode } from "react";

interface HealthcareItemProps {
  icon?: React.ReactNode;
  label: string;
  children: ReactNode;
}

export const HealthcareItem: React.FC<HealthcareItemProps> = ({
  icon,
  label,
  children,
}) => {
  return (
    <BorderedCard>
      <div className="flex items-start gap-4">
        {icon && (
          <div className="text-blue-500 p-2.5 bg-blue-50 rounded-full border border-blue-100/50 shadow-sm">
            {icon}
          </div>
        )}
        <div className="flex-1">
          <div className="text-sm font-medium text-blue-700 mb-2">{label}</div>
          <div className="text-gray-700">{children}</div>
        </div>
      </div>
    </BorderedCard>
  );
};

export default HealthcareItem;
