import React from "react";
import { CardSkeleton } from "@agensy/components";

export const ClientProfileSkeleton: React.FC = () => {
  return (
    <div className="overflow-y-auto h-[100dvh] max-h-[calc(100dvh-50px)] md:max-h-[calc(100dvh)] w-full px-4 py-6">
      {/* PageHeader skeleton */}
      <div className="flex md:justify-between items-center md:flex-row flex-col gap-4">
        <div className="flex items-center gap-2">
          {/* Back button skeleton */}
          <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse"></div>
          {/* Title skeleton */}
          <div className="h-8 w-60 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>

      {/* PersonalInfoBar skeleton */}
      <div className="flex flex-col md:flex-row gap-4 items-center mt-4 w-full justify-between md:justify-start">
        <div className="w-full md:w-fit animate-pulse">
          <div className="h-5 w-20 bg-gray-200 rounded mb-1"></div>
          <div className="h-6 w-40 bg-gray-200 rounded"></div>
        </div>
        <div className="hidden md:block h-10 w-[1px] bg-mediumGray" />
        <div className="w-full md:w-fit animate-pulse">
          <div className="h-5 w-32 bg-gray-200 rounded mb-1"></div>
          <div className="h-6 w-48 bg-gray-200 rounded"></div>
        </div>
      </div>

      {/* Tab navigation skeleton */}
      <div className="border-[1px] border-mediumGray px-2 sm:px-5 rounded-xl mt-4">
        <div className="flex flex-wrap lg:flex-nowrap border-b border-mediumGray w-full">
          {[1, 2, 3, 4, 5].map((item) => (
            <div
              key={item}
              className="min-w-[100px] sm:min-w-0 h-12 flex items-center justify-center px-4 animate-pulse"
            >
              <div className="h-4 w-24 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Content area skeleton */}
      <div className="mt-6">
        <div className="grid grid-rows-[auto,auto,auto] gap-8 max-w-7xl mx-auto md:p-6 bg-gradient-to-br from-gray-50/50 to-basicWhite/80 rounded-2xl">
          {/* First row: Personal info and Contact info */}
          <div className="grid lg:grid-cols-2 grid-cols-1 gap-8">
            <CardSkeleton rows={3} hasHeader={true} className="w-full" />
            <CardSkeleton rows={2} hasHeader={true} className="w-full" />
          </div>
          
          {/* Second row: Medical info and Healthcare */}
          <div className="grid lg:grid-cols-2 grid-cols-1 gap-8">
            <CardSkeleton rows={2} hasHeader={true} className="w-full" />
            <CardSkeleton rows={2} hasHeader={true} className="w-full" />
          </div>
          
          {/* Third row: Client note */}
          <CardSkeleton rows={4} hasHeader={true} hasFooter={true} className="w-full" />
        </div>
      </div>
    </div>
  );
};

export default ClientProfileSkeleton;
