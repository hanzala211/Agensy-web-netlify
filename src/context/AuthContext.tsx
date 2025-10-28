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
import { PERMISSIONS, ROLES, SUBSCRIPTION_STATUSES } from "@agensy/constants";

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
  const { connectSocket, socket } = useSocketContext();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const updateUserOnlineStatus = (userId: string, isOnline: boolean) => {
    setAccessUsers((prev) =>
      prev.map((user) =>
        user.id === userId ? { ...user, is_online: isOnline } : user
      )
    );
  };

  useEffect(() => {
    loadAuth();
  }, [clients, isLoggingOut]);

  useEffect(() => {
    if (userData) {
      loadClients();
      loadAllUsers();
      connectSocket();
      setIsLoggingOut(false);
    }
  }, [userData]);

  useEffect(() => {
    if (socket) {
      socket.on("userOnline", (data: { userId: string }) => {
        console.log("🟢 [SOCKET] User came online:", data.userId);
        updateUserOnlineStatus(data.userId, true);
      });

      socket.on("userOffline", (data: { userId: string }) => {
        console.log("🔴 [SOCKET] User went offline:", data.userId);
        updateUserOnlineStatus(data.userId, false);
      });

      return () => {
        socket.off("userOnline");
        socket.off("userOffline");
      };
    }
  }, [socket, updateUserOnlineStatus]);

  const loadAuth = async () => {
    if (isLoggingOut) {
      setIsAuthLoading(false);
      return;
    }

    try {
      const cognitoUser = await getCurrentUser();
      if (cognitoUser && !isLoggingOut) {
        const apiRes = await AuthService.me();
        if (!isLoggingOut) {
          setUserData({ ...apiRes });
        }
      }
    } catch {
      if (!isLoggingOut) {
        signOut();
      }
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

  const handleLogout = async () => {
    if (isLoggingOut) {
      return;
    }
    setIsLoggingOut(true);

    await signOut();
    setUserData(null);
    queryClient.removeQueries();
    setIsLoggingOut(false);
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

  const filterClientRole = (clientId: string) => {
    return userData?.Roles?.find((r) => r.client_id === clientId)?.role || "";
  };

  const handleFilterPermission = (clientId: string, appAction: string) => {
    const userPermissions =
      PERMISSIONS[filterClientRole(clientId) as keyof typeof PERMISSIONS] || [];
    return userPermissions.includes(appAction);
  };

  const isPrimaryUserSubscriptionActive = (clientId: string) => {
    return (
      userData?.Roles?.find((r) => r.client_id === clientId)?.primary_user
        ?.subscription_status === SUBSCRIPTION_STATUSES.ACTIVE ||
      userData?.role === ROLES.ADMIN
    );
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
        filterClientRole,
        handleFilterPermission,
        isPrimaryUserSubscriptionActive,
        isLoggingOut,
        loadAllUsers,
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
