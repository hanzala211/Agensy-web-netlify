import React from "react";

interface ListSkeletonProps {
  rows?: number;
  columns?: number;
  hasHeader?: boolean;
  className?: string;
}

export const ListSkeleton: React.FC<ListSkeletonProps> = ({
  rows = 5,
  columns = 4,
  hasHeader = true,
  className = "",
}) => {
  return (
    <div
      className={`border border-mediumGray rounded-lg overflow-hidden ${className}`}
    >
      {/* Header */}
      {hasHeader && (
        <div className="border-b border-mediumGray bg-gray-50 p-4">
          <div
            className="grid gap-4 animate-pulse"
            style={{
              gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
            }}
          >
            {Array.from({ length: columns }).map((_, index) => (
              <div key={index} className="h-6 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      )}

      {/* Body */}
      <div className="divide-y divide-mediumGray">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="p-4">
            <div
              className="grid gap-4 animate-pulse"
              style={{
                gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
              }}
            >
              {Array.from({ length: columns }).map((_, colIndex) => (
                <div
                  key={colIndex}
                  className="h-5 bg-gray-200 rounded"
                  style={{ width: `${Math.floor(Math.random() * 40) + 60}%` }}
                ></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
