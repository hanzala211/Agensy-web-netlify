import { CognitoUtils } from "@agensy/utils";
import { createContext, useContext, useRef, useState } from "react";
import io, { Socket } from "socket.io-client";

interface SocketContextType {
  socket: Socket | null;
  connectSocket: () => void;
}

export const SocketContext = createContext<SocketContextType>({
  socket: null,
  connectSocket: () => {},
});

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [isConnected, setConnected] = useState<boolean>(false);
  const socket = useRef<Socket | null>(null);

  const connectSocket = async () => {
    if (!isConnected) {
      const { accessToken: token } = await CognitoUtils.getJwtToken();

      socket.current = io(import.meta.env.VITE_SOCKET_URL, {
        auth: {
          token: token,
        },
        extraHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });

      socket.current.on("connect", () => {
        console.info(
          `Successfully connected to socket at ${
            import.meta.env.VITE_SOCKET_URL
          }`
        );
        setConnected(true);

        socket.current?.emit("joinThreads");
        console.log("Emitted joinThreads event");
      });

      socket.current.on("joinThreads", (data) => {
        console.log("Received joinThreads event with data:", data);
      });

      socket.current.on("connect_error", (error) => {
        console.error("Connection error:", error);
        if (error.message === "Unauthorized") {
          console.error("Authentication failed. Please check your token.");
        }
      });

      socket.current.on("disconnect", () => {
        console.info("Successfully disconnected");
        setConnected(false);
      });

      socket.current.on("error", (err) => {
        console.error("Socket Error:", err);
      });
    }
  };

  return (
    <SocketContext.Provider value={{ socket: socket.current, connectSocket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocketContext = (): SocketContextType =>
  useContext(SocketContext);
