import type React from "react";
import ClientSkeleton from "./ClientSkeleton";

export const AppointmentsSkeleton: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4">
        {[...Array(6)].map((_, index) => (
          <ClientSkeleton key={index} />
        ))}
      </div>
    </div>
  );
};

export default AppointmentsSkeleton;
