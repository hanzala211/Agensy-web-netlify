import React from "react";
import { Modal } from "@agensy/components";
import { ICONS } from "@agensy/constants";
import type { HealthcareProvider, Client } from "@agensy/types";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

interface HealthcareProviderSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProvider: (provider: HealthcareProvider) => void;
  title?: string;
}

export const HealthcareProviderSelectionModal: React.FC<
  HealthcareProviderSelectionModalProps
> = ({
  isOpen,
  onClose,
  onSelectProvider,
  title = "Select Healthcare Provider",
}) => {
  const queryClient = useQueryClient();
  const { clientId } = useParams();

  const client = queryClient.getQueryData(["client", clientId]) as
    | Client
    | undefined;
  const healthcareProviders = client?.healthcareProviders || [];

  const handleProviderSelect = (provider: HealthcareProvider) => {
    onSelectProvider(provider);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      maxWidth="max-w-2xl"
      height="h-[80vh]"
    >
      <div className="space-y-4">
        <div className="max-h-full overflow-y-auto space-y-3">
          {healthcareProviders.length > 0 ? (
            healthcareProviders.map((provider: HealthcareProvider) => (
              <div
                key={provider.id}
                className="cursor-pointer hover:bg-gray-50 transition-colors duration-200 p-4 bg-white border border-gray-200 rounded-lg"
                onClick={() => handleProviderSelect(provider)}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-gray-900">
                      {provider.provider_name || "Unnamed Provider"}
                    </h4>
                    <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {provider.provider_type || "Unknown Type"}
                    </span>
                  </div>

                  {provider.specialty && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Specialty:</span>{" "}
                      {provider.specialty}
                    </p>
                  )}

                  {provider.address && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Address:</span>{" "}
                      {provider.address}
                    </p>
                  )}

                  {provider.phone && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Phone:</span>{" "}
                      {provider.phone}
                    </p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <div>
                <ICONS.user size={24} className="mx-auto mb-2 text-gray-400" />
                <p>No healthcare providers available</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
