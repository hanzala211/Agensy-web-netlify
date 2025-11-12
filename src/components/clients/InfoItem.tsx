import React from "react";
import { BorderedCard, H3 } from "@agensy/components";

interface InfoItemProps {
  label?: string;
  children: React.ReactNode;
  className?: string;
}

export const InfoItem: React.FC<InfoItemProps> = ({
  label,
  children,
  className = "",
}) => {
  return (
    <div className={`group flex flex-col ${className}`}>
      {label && <H3 className="mb-1 font-bold text-sm">{label}</H3>}
      <BorderedCard className="!p-2.5">{children}</BorderedCard>
    </div>
  );
};

export default InfoItem;
