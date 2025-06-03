import React from "react";
import { Card, ClientCard } from "@agensy/components";
import { ICONS, ROUTES, DASHBOARD_DUMMY_CLIENTS } from "@agensy/constants";
import { useNavigate } from "react-router-dom";
import type { Client } from "@agensy/types";

export const ClientsDashboardCard: React.FC = () => {
  const navigate = useNavigate();
  const clients = DASHBOARD_DUMMY_CLIENTS;

  return (
    <Card
      title="Clients"
      buttonText={<ICONS.eyeOn />}
      ariaLabel="View all clients"
      onButtonClick={() => navigate(ROUTES.clients)}
      className="border-gray-300"
    >
      <div className="flex flex-col h-full">
        {clients.length > 0 ? (
          <div className="space-y-4">
            {clients.map((client) => (
              <ClientCard
                key={client.id}
                client={client as Client}
                onViewProfile={() => navigate(`${ROUTES.clients}/${client.id}`)}
                loadClients={() => {}}
                showActions={false}
              />
            ))}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500 text-center">No clients found</p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ClientsDashboardCard;
