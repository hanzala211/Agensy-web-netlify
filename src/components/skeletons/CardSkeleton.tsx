import React from "react";

interface CardSkeletonProps {
  rows?: number;
  height?: string;
  className?: string;
  hasHeader?: boolean;
  hasFooter?: boolean;
}

export const CardSkeleton: React.FC<CardSkeletonProps> = ({
  rows = 3,
  height = "auto",
  className = "",
  hasHeader = true,
  hasFooter = false,
}) => {
  return (
    <div
      className={`bg-white rounded-lg border border-mediumGray shadow-sm overflow-hidden ${className}`}
      style={{ height }}
    >
      {/* Card Header */}
      {hasHeader && (
        <div className="p-4 border-b border-mediumGray">
          <div className="animate-pulse flex justify-between items-center">
            <div className="h-5 w-40 bg-gray-200 rounded"></div>
            <div className="h-8 w-24 bg-gray-200 rounded"></div>
          </div>
        </div>
      )}

      {/* Card Body */}
      <div className="p-4">
        <div className="animate-pulse space-y-4">
          {Array.from({ length: rows }).map((_, index) => (
            <div key={index} className="flex flex-col gap-2">
              <div className="h-4 w-full bg-gray-200 rounded"></div>
              {index !== rows - 1 && <div className="h-4 w-3/4 bg-gray-200 rounded"></div>}
            </div>
          ))}
        </div>
      </div>

      {/* Card Footer */}
      {hasFooter && (
        <div className="p-4 border-t border-mediumGray">
          <div className="animate-pulse flex justify-end">
            <div className="h-8 w-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      )}
    </div>
  );
};
