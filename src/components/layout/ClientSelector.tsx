import React, { useState, useRef, useEffect } from "react";
import { useGetClientsQuery } from "@agensy/api";
import { useClientContext, useAuthContext } from "@agensy/context";
import { ICONS, ROUTES, COLORS, ROLE_MAP } from "@agensy/constants";
import type { Client } from "@agensy/types";
import { CommonLoader } from "../common/CommonLoader";
import { useNavigate, useParams } from "react-router-dom";
import { Tooltip } from "antd";

export const ClientSelector: React.FC = () => {
  const { selectedClientId, setSelectedClientId } = useClientContext();
  const { userData } = useAuthContext();
  const params = useParams();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Enable the query and fetch clients
  const { data: clients, isLoading, refetch } = useGetClientsQuery();

  const formatRoleToProperStr = (str: string) => {
    return ROLE_MAP[str] || str;
  };

  const getUserRoleForClient = (client: Client): string => {
    const userRole = client.Users?.find((item) => item.id === userData?.id)
      ?.UserRoles?.role;
    return formatRoleToProperStr(userRole || "System Admin");
  };

  // Fetch clients on mount
  useEffect(() => {
    refetch();
  }, [refetch]);

  // Handle outside clicks to close dropdown
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen]);

  const handleSelectClient = (clientId: string | number | null) => {
    if (clientId === null) {
      setSelectedClientId(null);
      localStorage.removeItem("selectedClientId");
    } else {
      const clientIdStr = String(clientId);
      setSelectedClientId(clientIdStr);
      localStorage.setItem("selectedClientId", clientIdStr);
      if (params.clientId) {
        navigate(`/${ROUTES.clients}/${clientId}/${ROUTES.clientOverview}`);
      }
    }
    setIsOpen(false);
  };

  const selectedClient = clients?.find(
    (client: Client) => String(client.id) === selectedClientId
  );

  const displayText = selectedClient
    ? `${selectedClient.first_name} ${selectedClient.last_name}`
    : "All Care Recipients";

  const selectedClientRole = selectedClient
    ? getUserRoleForClient(selectedClient)
    : null;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* @ts-expect-error/ TODO TS error */}
      <Tooltip
        title={isLoading ? "We are loading the care recipients for you" : ""}
        open={isLoading ? undefined : false}
        color={COLORS.primaryColor}
        key={COLORS.primaryColor}
      >
        <button
          onClick={() => !isLoading && setIsOpen(!isOpen)}
          aria-label="Select care recipient"
          aria-expanded={isOpen}
          disabled={isLoading}
          className={`flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 min-h-[36px] sm:min-h-[40px] bg-white border border-gray-200 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primaryColor/20 text-xs sm:text-sm font-medium text-darkGray max-w-[100px] sm:max-w-[200px] md:max-w-[250px] ${
            isLoading
              ? "opacity-50 cursor-not-allowed"
              : "hover:border-primaryColor"
          }`}
        >
          <ICONS.users
            size={16}
            className="sm:w-[18px] sm:h-[18px] text-primaryColor flex-shrink-0"
          />
          <div className="flex flex-col flex-1 min-w-0 text-left">
            <span className="truncate">{displayText}</span>
            {selectedClientRole && (
              <span className="text-[10px] sm:text-xs text-gray-500 truncate">
                {selectedClientRole}
              </span>
            )}
          </div>
          <ICONS.downArrow
            size={14}
            className={`sm:w-4 sm:h-4 text-gray-400 flex-shrink-0 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>
      </Tooltip>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-44 sm:w-64 bg-white rounded-lg shadow-lg py-1 sm:py-2 z-50 border border-gray-100 max-h-[300px] sm:max-h-[400px] overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <CommonLoader size={32} />
            </div>
          ) : clients && clients.length > 0 ? (
            <div className="py-1">
              {/* All option */}
              <button
                onClick={() => handleSelectClient(null)}
                className={`w-full text-left px-3 sm:px-4 py-2 sm:py-3 min-h-[40px] sm:min-h-[44px] text-xs sm:text-sm transition-colors touch-manipulation focus:outline-none ${
                  selectedClientId === null
                    ? "bg-primaryColor/10 text-primaryColor font-medium"
                    : "text-darkGray hover:bg-lightGray hover:text-primaryColor"
                } active:bg-lightGray/80 focus:bg-lightGray/30`}
                aria-label="Select all care recipients"
              >
                <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                  <ICONS.users
                    size={14}
                    className={`sm:w-4 sm:h-4 flex-shrink-0 ${
                      selectedClientId === null
                        ? "text-primaryColor"
                        : "text-gray-400"
                    }`}
                  />
                  <span className="truncate flex-1">All Care Recipients</span>
                  {selectedClientId === null && (
                    <ICONS.check
                      size={14}
                      className="sm:w-4 sm:h-4 text-primaryColor ml-auto flex-shrink-0"
                    />
                  )}
                </div>
              </button>
              {clients.map((client: Client) => {
                const clientIdStr = String(client.id);
                const isSelected = clientIdStr === selectedClientId;
                const clientName = `${client.first_name} ${client.last_name}`;
                const clientRole = getUserRoleForClient(client);
                return (
                  <button
                    key={clientIdStr}
                    onClick={() => handleSelectClient(client.id as string)}
                    className={`w-full text-left px-3 sm:px-4 py-2 sm:py-3 min-h-[40px] sm:min-h-[44px] text-xs sm:text-sm transition-colors touch-manipulation focus:outline-none ${
                      isSelected
                        ? "bg-primaryColor/10 text-primaryColor font-medium"
                        : "text-darkGray hover:bg-lightGray hover:text-primaryColor"
                    } active:bg-lightGray/80 focus:bg-lightGray/30`}
                    aria-label={`Select ${clientName}`}
                  >
                    <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                      <ICONS.users
                        size={14}
                        className={`sm:w-4 sm:h-4 flex-shrink-0 ${
                          isSelected ? "text-primaryColor" : "text-gray-400"
                        }`}
                      />
                      <div className="flex flex-col flex-1 min-w-0">
                        <span className="truncate" title={clientName}>
                          {clientName}
                        </span>
                        <span className="text-[10px] sm:text-xs text-gray-500 truncate">
                          {clientRole}
                        </span>
                      </div>
                      {isSelected && (
                        <ICONS.check
                          size={14}
                          className="sm:w-4 sm:h-4 text-primaryColor ml-auto flex-shrink-0"
                        />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="px-4 py-8 text-center text-sm text-slateGrey">
              No care recipients found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ClientSelector;
