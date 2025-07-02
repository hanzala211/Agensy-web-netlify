import type {
  AuthContextType,
  Client,
  HealthcareProvider,
  IUser,
} from "@agensy/types";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { AuthService, ClientAccessService } from "@agensy/services";
import { getCurrentUser, signOut } from "aws-amplify/auth";
import { useClientManager } from "@agensy/hooks";
import { useQueryClient } from "@tanstack/react-query";
import { useSocketContext } from "@agensy/context";

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { clients, loadClients } = useClientManager({ initialItemPerPage: 5 });
  const [userData, setUserData] = useState<IUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);
  const [file, setFile] = useState<File | null>(null);
  const [accessUsers, setAccessUsers] = useState<IUser[]>([]);
  const queryClient = useQueryClient();
  const { connectSocket } = useSocketContext();

  useEffect(() => {
    loadAuth();
  }, []);

  useEffect(() => {
    if (userData) {
      loadClients();
      loadAllUsers();
      connectSocket();
    }
  }, [userData]);

  const loadAuth = async () => {
    try {
      const cognitoUser = await getCurrentUser();
      if (cognitoUser) {
        const apiRes = await AuthService.me();
        setUserData({ ...apiRes });
      }
    } catch {
      signOut();
    } finally {
      setIsAuthLoading(false);
    }
  };

  const loadAllUsers = async () => {
    try {
      const response = await ClientAccessService.getAllClientSubUsers();
      setAccessUsers(
        response.filter((user: IUser) => user.id !== userData?.id)
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = () => {
    signOut();
    setUserData(null);
    queryClient.removeQueries();
  };

  const filterHealthCareProvider = (clientId: string, providerId: string) => {
    const client = clients?.find((c: Client) => c.id === clientId);
    if (!client) return null;

    const provider = client.healthcareProviders.find(
      (p: HealthcareProvider) => p.id === providerId
    );
    return provider || null;
  };

  const filterClient = (clientId: string) => {
    return clients?.find((c: Client) => c.id === clientId);
  };

  const updateUserData = (data: IUser) => {
    setUserData(data);
  };

  return (
    <AuthContext.Provider
      value={{
        userData,
        setUserData,
        isAuthLoading,
        setIsAuthLoading,
        handleLogout,
        clients,
        filterHealthCareProvider,
        filterClient,
        updateUserData,
        file,
        setFile,
        loadAuth,
        accessUsers,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
