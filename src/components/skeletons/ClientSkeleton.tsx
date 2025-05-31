import React from "react";

export const ClientSkeleton: React.FC = () => {
  return (
    <div className="border border-mediumGray bg-white rounded-xl shadow-sm animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-3 p-5 gap-4 md:gap-2">
        {/* Name and details */}
        <div className="md:col-span-1">
          <div className="h-5 w-48 bg-gray-200 rounded mb-3"></div>
          <div className="mt-1 space-y-2">
            <div className="h-4 w-32 bg-gray-200 rounded"></div>
            <div className="h-4 w-40 bg-gray-200 rounded"></div>
          </div>
        </div>

        {/* Status section */}
        <div className="md:col-span-1 flex flex-col justify-center mt-3 md:mt-0">
          <div className="flex items-center">
            <div className="h-4 w-14 bg-gray-200 rounded mr-2"></div>
            <div className="h-5 w-16 bg-gray-200 rounded-full"></div>
          </div>
          <div className="h-4 w-40 bg-gray-200 rounded mt-2"></div>
        </div>

        {/* Buttons */}
        <div className="md:col-span-1 flex items-center justify-start md:justify-end mt-3 md:mt-0">
          <div className="h-8 w-24 bg-gray-200 rounded-md mr-2"></div>
          <div className="h-8 w-24 bg-gray-200 rounded-md"></div>
        </div>
      </div>
    </div>
  );
};

export default ClientSkeleton;
