import React, { useState } from "react";
import { Card, EmptyStateCard, BorderedCard } from "@agensy/components";
import { ICONS, ROUTES } from "@agensy/constants";
import { useNavigate } from "react-router-dom";
import { ConfirmationModal } from "../common/ConfirmationModal";
import { useClientContext } from "@agensy/context";

interface QuickAccessCareRecipientsCardProps {
  clients?: Array<{
    id: string;
    first_name: string;
    last_name: string;
    date_of_birth: string | null;
  }>;
}

export const QuickAccessCareRecipientsCard: React.FC<
  QuickAccessCareRecipientsCardProps
> = ({ clients = [] }) => {
  const navigate = useNavigate();
  const { selectedClientId, setSelectedClientId } = useClientContext();
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedClientForSwitch, setSelectedClientForSwitch] = useState<
    (typeof clients)[0] | null
  >(null);
  const [pendingNavigation, setPendingNavigation] = useState<{
    type: "overview" | "questionnaire" | "medical";
    clientId: string;
  } | null>(null);

  const getInitials = (firstName: string, lastName: string): string => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getAge = (dateOfBirth: string | null): string | null => {
    if (!dateOfBirth) return null;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return `Age ${age}`;
  };

  const truncateName = (
    name: string | undefined,
    maxLength: number = 15
  ): string => {
    if (!name) return "";
    return name.length > maxLength
      ? name.substring(0, maxLength) + "..."
      : name;
  };

  const handleClientClick = (client: (typeof clients)[0]) => {
    if (selectedClientId === client.id?.toString()) {
      navigate(`/${ROUTES.clients}/${client.id}/${ROUTES.clientOverview}`);
      return;
    }
    setSelectedClientForSwitch(client);
    setPendingNavigation({ type: "overview", clientId: String(client.id) });
    setIsConfirmModalOpen(true);
  };

  const handleConfirmSwitch = () => {
    if (selectedClientForSwitch && pendingNavigation) {
      const clientIdStr = String(selectedClientForSwitch.id);
      setSelectedClientId(clientIdStr);
      localStorage.setItem("selectedClientId", clientIdStr);

      switch (pendingNavigation.type) {
        case "overview":
          navigate(
            `/${ROUTES.clients}/${selectedClientForSwitch.id}/${ROUTES.clientOverview}`
          );
          break;
        case "questionnaire":
          navigate(
            `/${ROUTES.clients}/${selectedClientForSwitch.id}/${ROUTES.agensyFormsFolders}/assessment/care-recipient-questionnaire`
          );
          break;
        case "medical":
          navigate(
            `/${ROUTES.clients}/${selectedClientForSwitch.id}/${ROUTES.clientMedical}`
          );
          break;
      }

      setIsConfirmModalOpen(false);
      setSelectedClientForSwitch(null);
      setPendingNavigation(null);
    }
  };

  const handleCancelSwitch = () => {
    setIsConfirmModalOpen(false);
    setSelectedClientForSwitch(null);
    setPendingNavigation(null);
  };

  const handleQuestionnaireClick = (e: React.MouseEvent, clientId: string) => {
    e.stopPropagation();
    const client = clients.find((c) => c.id === clientId);
    if (!client) return;

    if (selectedClientId === clientId) {
      navigate(
        `/${ROUTES.clients}/${clientId}/${ROUTES.agensyFormsFolders}/assessment/care-recipient-questionnaire`
      );
      return;
    }
    // Show confirmation modal for different client
    setSelectedClientForSwitch(client);
    setPendingNavigation({ type: "questionnaire", clientId });
    setIsConfirmModalOpen(true);
  };

  const handleMedsClick = (e: React.MouseEvent, clientId: string) => {
    e.stopPropagation();
    const client = clients.find((c) => c.id === clientId);
    if (!client) return;

    if (selectedClientId === clientId) {
      navigate(`/${ROUTES.clients}/${clientId}/${ROUTES.clientMedical}`);
      return;
    }
    // Show confirmation modal for different client
    setSelectedClientForSwitch(client);
    setPendingNavigation({ type: "medical", clientId });
    setIsConfirmModalOpen(true);
  };

  return (
    <Card
      title="Quick Access - Care Recipients"
      className="border-gray-300"
      showButton={false}
    >
      {clients.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {clients.map((client) => {
            const initials = getInitials(client.first_name, client.last_name);
            const age = getAge(client.date_of_birth);

            return (
              <BorderedCard key={client.id}>
                <div
                  className="cursor-pointer group"
                  onClick={() => handleClientClick(client)}
                >
                  <div className="flex flex-col items-center text-center p-4 space-y-4 transition-all duration-200 hover:bg-gray-50 rounded-lg">
                    {/* Initials Circle */}
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primaryColor to-basicBlue flex items-center justify-center text-white font-semibold text-lg shadow-md group-hover:shadow-lg transition-shadow">
                      {initials}
                    </div>

                    {/* Name */}
                    <div className="w-full min-w-0">
                      <h3 className="font-semibold text-gray-800 text-base truncate">
                        {truncateName(client.first_name)}{" "}
                        {truncateName(client.last_name)}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {age || "N/A"}
                      </p>
                    </div>

                    {/* Quick Links */}
                    <div className="flex flex-col gap-2.5 w-full pt-2 border-t border-gray-100">
                      <button
                        onClick={(e) => handleQuestionnaireClick(e, client.id)}
                        className="text-sm text-primaryColor hover:text-blue-700 hover:bg-blue-50 transition-all duration-200 text-left py-2 px-3 rounded-md font-medium"
                      >
                        Care Recipient Questionnaire
                      </button>
                      <button
                        onClick={(e) => handleMedsClick(e, client.id)}
                        className="text-sm text-primaryColor hover:text-blue-700 hover:bg-blue-50 transition-all duration-200 text-left flex items-center gap-2 py-2 px-3 rounded-md font-medium"
                      >
                        <ICONS.medicine size={16} />
                        Medical
                      </button>
                    </div>
                  </div>
                </div>
              </BorderedCard>
            );
          })}
        </div>
      ) : (
        <EmptyStateCard
          label="care recipients"
          ICON={ICONS.users}
          onClick={() => navigate(`/${ROUTES.clients}`)}
        />
      )}
      <ConfirmationModal
        title="Switch Care Recipient"
        isModalOpen={isConfirmModalOpen}
        onOk={handleConfirmSwitch}
        onCancel={handleCancelSwitch}
        okText="Yes, Switch"
        cancelText="Cancel"
      >
        <p>
          Do you want to switch to{" "}
          <span className="font-semibold">
            {selectedClientForSwitch
              ? `${selectedClientForSwitch.first_name} ${selectedClientForSwitch.last_name}`
              : ""}
          </span>
          ? This will filter all content to show only this care recipient's
          information.
        </p>
      </ConfirmationModal>
    </Card>
  );
};

export default QuickAccessCareRecipientsCard;
