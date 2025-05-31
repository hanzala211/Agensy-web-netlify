import {
  MedicationCard,
  HealthCareProviderCard,
  MedicalHistoryCard,
} from "@agensy/components";
import React from "react";

export const ClientMedical: React.FC = () => {
  return (
    <div className="w-full max-w-7xl flex flex-col gap-5 mx-auto md:p-6">
      <MedicationCard />
      <HealthCareProviderCard />
      <MedicalHistoryCard />
    </div>
  );
};

export default ClientMedical;
