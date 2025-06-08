import type { Message, MessagesContextType, Thread } from "@agensy/types";
import { createContext, useContext, useEffect, useState } from "react";
import { useSocketContext } from "./SocketContext";
import { useLocation } from "react-router-dom";
import { useAuthContext } from "./AuthContext";
import { useGetAllThreadsQuery } from "@agensy/api";

const MessagesContext = createContext<MessagesContextType | undefined>(
  undefined
);

export const MessagesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { userData } = useAuthContext();
  const location = useLocation();
  const [selectedThread, setSelectedThread] = useState<Thread | null>(null);
  const [showThreadList, setShowThreadList] = useState<boolean>(true);
  const [currentThreadMessages, setCurrentThreadMessages] = useState<Message[]>(
    []
  );
  const [threads, setThreads] = useState<Thread[]>([]);
  const { socket } = useSocketContext();
  const {
    data: threadsData,
    isLoading: isThreadsLoading,
    refetch: loadThreads,
  } = useGetAllThreadsQuery();

  useEffect(() => {
    if (userData) {
      loadThreads();
    }
  }, [userData]);

  useEffect(() => {
    if (threadsData) {
      setThreads(threadsData);
    }
  }, [threadsData]);

  useEffect(() => {
    if (
      (!location.pathname.split("/").includes("messages") &&
        !location.pathname.split("/").includes("message")) ||
      location.pathname.split("/").length === 2
    ) {
      setShowThreadList(true);
    }
  }, [location.pathname]);

  useEffect(() => {
    socket?.on(
      "receiveMessage",
      (data: { threadId: string; message: Message }) => {
        console.log(data);
        setThreads((prev) => {
          return prev.map((thread) => {
            if (thread.id === data?.threadId) {
              const isCurrentUserSender =
                data.message.sender_id === userData?.id;
              return {
                ...thread,
                messages: [...(thread.messages || []), data.message],
                has_unread_messages: !isCurrentUserSender
                  ? true
                  : thread.has_unread_messages,
                last_message: data.message.content,
                last_message_time: data.message.createdAt,
                last_message_sender_id: data.message.sender_id,
              };
            }
            return thread;
          });
        });
        setSelectedThread((prev) => {
          if (!prev) return prev;
          const isCurrentUserSender = data.message.sender_id === userData?.id;
          return prev.id === data?.threadId && !isCurrentUserSender
            ? {
                ...prev,
                messages: [...(prev.messages || []), data.message],
              }
            : prev;
        });
        setCurrentThreadMessages((prev) => {
          if (
            prev &&
            data.message.sender_id !== userData?.id &&
            prev.find((m) => m.thread_id === data.message.thread_id)
          ) {
            return [...(prev || []), data.message];
          }
          return prev;
        });
      }
    );
  }, [socket]);

  const updateThreads = (
    threadId: string,
    lastMessageSender: string,
    message: string
  ) => {
    setThreads((prev) => {
      return prev.map((t) => {
        if (t.id === threadId) {
          return {
            ...t,
            last_message: message.trim(),
            last_message_time: new Date(),
            last_message_sender_id: lastMessageSender,
            messages: [
              ...(t.messages || []),
              {
                content: message.trim(),
                sender_id: lastMessageSender,
                thread_id: threadId as string,
                id: Date.now().toString(),
                createdAt: new Date(),
                updatedAt: new Date(),
              },
            ],
          };
        }
        return t;
      });
    });
  };

  const updateSelectedThread = (
    threadId: string,
    lastMessageSender: string,
    message: string
  ) => {
    setSelectedThread((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        messages: [
          ...(prev.messages || []),
          {
            content: message.trim(),
            sender_id: lastMessageSender,
            thread_id: threadId as string,
            id: Date.now().toString(),
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        last_message: message.trim(),
        last_message_time: new Date(),
        last_message_sender_id: lastMessageSender,
      };
    });
  };

  const updateCurrentThreadMessages = (
    message: string,
    thread: string,
    senderID: string
  ) => {
    setCurrentThreadMessages((prev) => [
      ...(prev || []),
      {
        content: message.trim(),
        sender_id: senderID,
        thread_id: thread,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  };

  return (
    <MessagesContext.Provider
      value={{
        selectedThread,
        setSelectedThread,
        showThreadList,
        setShowThreadList,
        isThreadsLoading,
        currentThreadMessages,
        setCurrentThreadMessages,
        threads,
        setThreads,
        updateThreads,
        updateSelectedThread,
        updateCurrentThreadMessages,
      }}
    >
      {children}
    </MessagesContext.Provider>
  );
};

export const useMessagesContext = (): MessagesContextType => {
  const context = useContext(MessagesContext);
  if (!context) {
    throw new Error("useMessagesContext must be used within MessagesProvider");
  }
  return context;
};
