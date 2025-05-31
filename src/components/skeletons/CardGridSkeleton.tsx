import React from "react";
import { CardSkeleton } from "./CardSkeleton";

interface CardGridSkeletonProps {
  count?: number;
  columns?: number;
  cardHeight?: string;
  className?: string;
  cardClassName?: string;
  hasHeader?: boolean;
  hasFooter?: boolean;
}

export const CardGridSkeleton: React.FC<CardGridSkeletonProps> = ({
  count = 6,
  columns = 3,
  cardHeight = "220px",
  className = "",
  cardClassName = "",
  hasHeader = true,
  hasFooter = false,
}) => {
  return (
    <div className={`grid gap-4 ${className}`} style={{
      gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`
    }}>
      {Array.from({ length: count }).map((_, index) => (
        <CardSkeleton
          key={index}
          height={cardHeight}
          className={cardClassName}
          hasHeader={hasHeader}
          hasFooter={hasFooter}
          rows={2}
        />
      ))}
    </div>
  );
};
