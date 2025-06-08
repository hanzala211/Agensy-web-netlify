import { useGetSingleClientQuery } from "@agensy/api";
import {
  TabLink,
  ClientProfileSkeleton,
  PageHeader,
  PersonalInfoBar,
} from "@agensy/components";
import { APP_ACTIONS, PERMISSIONS, ROUTES } from "@agensy/constants";
import { useAuthContext, useClientContext } from "@agensy/context";
import React, { useEffect } from "react";
import { useNavigate, Outlet, useParams, useLocation } from "react-router-dom";

export const ClientProfile: React.FC = () => {
  const { userData } = useAuthContext();
  const location = useLocation();
  const params = useParams();
  const { selectedClient, setSelectedClient } = useClientContext();
  const {
    data: client,
    refetch: loadClient,
    isLoading: isClientLoading,
    status: loadClientStatus,
  } = useGetSingleClientQuery(params.clientId as string);
  const navigate = useNavigate();
  const userPermissions =
    PERMISSIONS[userData?.role as keyof typeof PERMISSIONS] || [];

  useEffect(() => {
    loadClient();
  }, []);

  useEffect(() => {
    if (loadClientStatus === "error") {
      navigate(`/${ROUTES.clients}`);
    } else if (loadClientStatus === "success") {
      setSelectedClient(client);
    }
  }, [loadClientStatus, client]);

  if (isClientLoading) return <ClientProfileSkeleton />;

  return (
    <div className="overflow-y-auto h-[100dvh] max-h-[calc(100dvh-50px)] md:max-h-[calc(100dvh)] w-full px-4 py-6">
      <PageHeader
        title={`Client: ${selectedClient?.first_name} ${selectedClient?.last_name}`}
        showButton={false}
        showBackButton={true}
      />

      <PersonalInfoBar
        leftLabel="DOB"
        leftValue={selectedClient?.date_of_birth as string}
        rightLabel="Primary Contact"
        rightValue={
          (selectedClient?.contacts && selectedClient.contacts.length > 0
            ? `${
                selectedClient.contacts.find(
                  (item) => item.contact_type === "primary"
                )?.first_name || ""
              } ${
                selectedClient.contacts.find(
                  (item) => item.contact_type === "primary"
                )?.last_name || ""
              }`
            : "No primary contact") as string
        }
      />
      <div className="border-[1px] border-mediumGray px-2 sm:px-5 rounded-xl mt-4">
        <div className="flex flex-wrap lg:flex-nowrap border-b border-mediumGray w-full">
          <TabLink
            to={`/${ROUTES.clients}/${selectedClient?.id}/${ROUTES.clientOverview}`}
            className="min-w-[100px] sm:min-w-0"
          >
            Overview
          </TabLink>
          <TabLink
            to={`/${ROUTES.clients}/${selectedClient?.id}/${ROUTES.clientMedical}`}
            className="min-w-[100px] sm:min-w-0"
          >
            Medical
          </TabLink>
          <TabLink
            to={`/${ROUTES.clients}/${selectedClient?.id}/${ROUTES.clientDocuments}`}
            className="min-w-[100px] sm:min-w-0"
          >
            Documents
          </TabLink>
          <TabLink
            to={`/${ROUTES.clients}/${selectedClient?.id}/${ROUTES.clientMessages}`}
            className="min-w-[100px] sm:min-w-0"
          >
            Messages
          </TabLink>
          {userPermissions.includes(APP_ACTIONS.AccessControl) && (
            <TabLink
              to={`/${ROUTES.clients}/${selectedClient?.id}/${ROUTES.access}`}
              className="min-w-[100px] sm:min-w-0"
            >
              Access
            </TabLink>
          )}
        </div>
      </div>
      <div
        className={`${
          location.pathname.includes(ROUTES.clientMessages) ? "px-1" : ""
        } mt-4`}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default ClientProfile;
