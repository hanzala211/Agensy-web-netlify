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
      {label && <H3 className="mb-2 font-bold text-[17px]">{label}</H3>}
      <BorderedCard>{children}</BorderedCard>
    </div>
  );
};

export default InfoItem;
