import React from "react";

interface DocumentsManagerSkeletonProps {
  itemsCount?: number;
}

export const DocumentsManagerSkeleton: React.FC<
  DocumentsManagerSkeletonProps
> = ({ itemsCount = 4 }) => {
  return (
    <div className="w-full">
      {/* SearchFilterBar skeleton */}
      <div className="rounded-xl mb-6 p-4">
        <div className="flex flex-col xl:flex-row xl:items-end gap-4">
          {/* Search input skeleton */}
          <div className="flex-1 animate-pulse">
            <div className="h-10 w-full bg-gray-200 rounded"></div>
          </div>

          <div className="flex flex-col xl:flex-row gap-4">
            {/* Filter select skeleton */}
            <div className="w-full xl:w-48 animate-pulse">
              <div className="h-5 w-24 bg-gray-200 rounded mb-1"></div>
              <div className="h-10 w-full bg-gray-200 rounded"></div>
            </div>

            {/* Sort select skeleton */}
            <div className="w-full xl:w-48 animate-pulse">
              <div className="h-5 w-24 bg-gray-200 rounded mb-1"></div>
              <div className="h-10 w-full bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Document cards skeleton */}
      <div className="space-y-2">
        {Array.from({ length: itemsCount }).map((_, index) => (
          <div key={index} className="border border-mediumGray p-4 rounded-lg">
            <div className="flex items-start xl:flex-row flex-col justify-between">
              <div className="space-y-3 w-full animate-pulse">
                {/* Document title */}
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 bg-gray-200 rounded"></div>
                  <div className="h-5 w-48 bg-gray-200 rounded"></div>
                </div>
                {/* Category */}
                <div className="flex gap-1">
                  <div className="h-4 w-16 bg-gray-200 rounded"></div>
                  <div className="h-4 w-24 bg-gray-200 rounded"></div>
                </div>
                {/* Upload info */}
                <div className="flex gap-1">
                  <div className="h-4 w-20 bg-gray-200 rounded"></div>
                  <div className="h-4 w-36 bg-gray-200 rounded"></div>
                </div>
                {/* Uploader info */}
                <div className="flex gap-1">
                  <div className="h-4 w-10 bg-gray-200 rounded"></div>
                  <div className="h-4 w-32 bg-gray-200 rounded"></div>
                </div>
              </div>
              <div className="flex gap-3 mt-4 xl:mt-0 animate-pulse">
                <div className="h-6 w-6 bg-gray-200 rounded"></div>
                <div className="h-6 w-6 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DocumentsManagerSkeleton;
