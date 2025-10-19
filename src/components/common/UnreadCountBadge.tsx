import React from "react";

interface UnreadCountBadgeProps {
  count: number;
  className?: string;
}

export const UnreadCountBadge: React.FC<UnreadCountBadgeProps> = ({
  count,
  className = "",
}) => {
  if (count <= 0) return null;

  const displayCount = count > 99 ? "99+" : count.toString();

  return (
    <div
      className={`flex items-center justify-center w-fit min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-xs font-semibold rounded-full ${className}`}
    >
      {displayCount}
    </div>
  );
};

export default UnreadCountBadge;
