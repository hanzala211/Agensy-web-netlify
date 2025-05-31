import React from "react";
import InfoItem from "./InfoItem";
import { Card, EmptyStateCard } from "@agensy/components";
import { useClientContext } from "@agensy/context";
import { ICONS } from "@agensy/constants";
import ItemList from "./ItemList";

export const MedicalInfoCard: React.FC = () => {
  const { selectedClient } = useClientContext();
  return (
    <Card title="Medical Information">
      {selectedClient?.medical ? (
        <div className="flex flex-col gap-6">
          {selectedClient?.medical?.diagnoses && (
            <ItemList
              label="Diagnosis"
              items={selectedClient.medical.diagnoses.split(", ")}
            />
          )}

          {selectedClient?.medical?.allergies && (
            <ItemList
              label="Allergies:"
              items={selectedClient?.medical?.allergies.split(", ")}
            />
          )}
          {selectedClient?.code_status && (
            <InfoItem label="Code Status:">
              {selectedClient?.code_status}
            </InfoItem>
          )}
        </div>
      ) : (
        <EmptyStateCard
          label="Medical Information"
          ICON={ICONS.medicationsBriefcase}
          showText={false}
        />
      )}
    </Card>
  );
};
