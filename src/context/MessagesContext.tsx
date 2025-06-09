import type { Message, MessagesContextType, Thread } from "@agensy/types";
import { createContext, useContext, useEffect, useState } from "react";
import { useSocketContext } from "./SocketContext";
import { useLocation } from "react-router-dom";
import { useAuthContext } from "./AuthContext";
import { useGetAllThreadsQuery } from "@agensy/api";
import { toast } from "@agensy/utils";

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
    if (userData) loadThreads();
  }, [userData]);

  useEffect(() => {
    if (threadsData) setThreads(threadsData);
  }, [threadsData]);

  useEffect(() => {
    if (threads) updateThreadsSorting();
  }, [threads]);

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
        setThreads((prev) => {
          return prev.map((thread) => {
            if (thread.id === data?.threadId) {
              return {
                ...thread,
                messages: [...(thread.messages || []), data.message],
                has_unread_messages: true,
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
          return prev.id === data?.threadId
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
        updateThreadsSorting();
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

  const updateThreadAndNavigateToExistingOne = (
    thread: Thread,
    navigate: () => void
  ) => {
    if (threads?.find((t) => t.id === thread.id)) {
      toast.success(
        "You're already part of this thread. Redirected you there!"
      );
      setSelectedThread(thread);
      navigate();
      return;
    }
    console.log("thread")

    toast.success("Thread created successfully");
    setThreads((prev) => [thread, ...(prev || [])]);
    setSelectedThread(thread);
  };

  const updateThreadsSorting = () => {
    setThreads((prev) => {
      return prev.sort((a, b) => {
        if (!a.last_message_time && !b.last_message_time) return 0;
        if (!a.last_message_time) return 1;
        if (!b.last_message_time) return -1;
        return (
          new Date(String(b.last_message_time)).getTime() -
          new Date(String(a.last_message_time)).getTime()
        );
      });
    });
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
        updateThreadAndNavigateToExistingOne,
        updateThreadsSorting,
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
