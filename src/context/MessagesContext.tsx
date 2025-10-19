import type {
  Message,
  MessagesContextType,
  PendingThreadData,
  Thread,
  TypingUsers,
} from "@agensy/types";
import { createContext, useContext, useEffect, useState, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSocketContext } from "./SocketContext";
import { useLocation } from "react-router-dom";
import { useAuthContext } from "./AuthContext";
import { useGetAllThreadsQuery } from "@agensy/api";
import { toast } from "@agensy/utils";
import { ROUTES } from "@agensy/constants";

const MessagesContext = createContext<MessagesContextType | undefined>(
  undefined
);

export const MessagesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { userData } = useAuthContext();
  const location = useLocation();
  const queryClient = useQueryClient();
  const [selectedThread, setSelectedThread] = useState<Thread | null>(null);
  const [showThreadList, setShowThreadList] = useState<boolean>(true);
  const [currentThreadMessages, setCurrentThreadMessages] = useState<Message[]>(
    []
  );
  const [threads, setThreads] = useState<Thread[]>([]);
  const [pendingThreadData, setPendingThreadData] =
    useState<PendingThreadData | null>(null);
  const [existingThreadData, setExistingThreadData] = useState<{
    threadId: string;
    clientId?: string;
  } | null>(null);
  const [typingUsers, setTypingUsers] = useState<TypingUsers>({});
  const selectedThreadRef = useRef<Thread | null>(null);
  const threadsRef = useRef<Thread[]>([]);
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
    if (threadsData) {
      const sortedThreads = updateParamThreads([...threadsData]);
      setThreads(sortedThreads);
    }
  }, [threadsData]);

  // Keep ref in sync with selectedThread state
  useEffect(() => {
    selectedThreadRef.current = selectedThread;
  }, [selectedThread]);

  // Keep ref in sync with threads state
  useEffect(() => {
    threadsRef.current = threads;
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
        console.log(data);
        setThreads((prev) => {
          const existingThread = prev.find((t) => t.id === data.threadId);

          if (existingThread) {
            return prev.map((thread) => {
              if (thread.id === data.threadId) {
                return {
                  ...thread,
                  messages: [...(thread.messages || []), data.message],
                  has_unread_messages: true,
                  last_message: data.message.message,
                  last_message_time: data.message.createdAt,
                  last_message_sender_id: data.message.sender_id,
                };
              }
              return thread;
            });
          }

          const newThread: Thread = {
            id: data.threadId,
            user_id: data.message.sender_id,
            started_at: new Date(),
            type: data.message.thread?.type || "general", // Default type
            subType: "one-to-one", // Default subType
            created_by: data.message.sender_id,
            messages: [data.message],
            has_unread_messages: true,
            last_message: data.message.message,
            last_message_time: data.message.createdAt,
            last_message_sender_id: data.message.sender_id,
            Participants_ids: [data.message.sender_id, userData?.id as string],
            client: null,
          };
          return [...prev, newThread];
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

        const currentThreadId = selectedThreadRef.current?.id;

        if (
          currentThreadId === data.threadId &&
          data.message.sender_id !== userData?.id &&
          data.message.message_id &&
          (data.message.message_id as string).length > 10 &&
          !(data.message.message_id as string).match(/^\d+$/) &&
          data.message.message_id !== "null" &&
          data.message.message_id !== "undefined"
        ) {
          setTimeout(() => {
            markMessageAsRead(data.message.message_id as string, data.threadId);
          }, 300);
        }

        updateThreadsSorting();

        // Update query cache with the updated thread data
        queryClient.setQueryData(
          ["threads"],
          (oldData: Thread[] | undefined) => {
            if (!oldData) return oldData;

            const currentThread = threadsRef.current.find(
              (t) => t.id === data.threadId
            );
            if (currentThread) {
              const updatedThread = {
                ...currentThread,
                messages: [...(currentThread.messages || []), data.message],
                has_unread_messages: true,
                last_message: data.message.message,
                last_message_time: data.message.createdAt,
                last_message_sender_id: data.message.sender_id,
              };
              const otherThreads = oldData.filter(
                (t) => t.id !== data.threadId
              );
              return [updatedThread, ...otherThreads];
            }
            const newThread: Thread = {
              id: data.threadId,
              user_id: data.message.sender_id,
              started_at: new Date(),
              type: data.message.thread?.type || "general",
              subType: "one-to-one",
              created_by: data.message.sender_id,
              messages: [data.message],
              has_unread_messages: true,
              last_message: data.message.message,
              last_message_time: data.message.createdAt,
              last_message_sender_id: data.message.sender_id,
              Participants_ids: [
                data.message.sender_id,
                userData?.id as string,
              ],
              client: null,
            };
            return [newThread, ...oldData];
          }
        );

        queryClient.setQueryData(
          ["thread", data.threadId],
          (oldData: Thread | undefined) => {
            if (!oldData) return oldData;
            const currentThread = threadsRef.current.find(
              (t) => t.id === data.threadId
            );
            if (currentThread) {
              return {
                ...currentThread,
                messages: [...(currentThread.messages || []), data.message],
                has_unread_messages: true,
                last_message: data.message.message,
                last_message_time: data.message.createdAt,
                last_message_sender_id: data.message.sender_id,
              };
            }
            return {
              ...oldData,
              messages: [...(oldData.messages || []), data.message],
              has_unread_messages: true,
              last_message: data.message.message,
              last_message_time: data.message.createdAt,
              last_message_sender_id: data.message.sender_id,
            };
          }
        );
      }
    );

    // Handle existing thread notification
    socket?.on(
      "messageSentToExistingThread",
      (data: {
        threadId: string;
        message: Message;
        isExistingThread: boolean;
        originalThreadId: string;
      }) => {
        setThreads((prev) => {
          const existingThread = prev.find((t) => t.id === data.threadId);

          if (existingThread) {
            return prev.map((thread) => {
              if (thread.id === data.threadId) {
                return {
                  ...thread,
                  messages: [...(thread.messages || []), data.message],
                  has_unread_messages: true,
                  last_message: data.message.message,
                  last_message_time: data.message.createdAt,
                  last_message_sender_id: data.message.sender_id,
                };
              }
              return thread;
            });
          } else {
            const newThread: Thread = {
              id: data.threadId,
              user_id: data.message.sender_id,
              started_at: new Date(),
              type: data.message.thread?.type || "general",
              subType: "one-to-one",
              created_by: data.message.sender_id,
              messages: [data.message],
              has_unread_messages: true,
              last_message: data.message.message,
              last_message_time: data.message.createdAt,
              last_message_sender_id: data.message.sender_id,
              Participants_ids: [
                data.message.sender_id,
                userData?.id as string,
              ],
              client: null,
            };
            return [newThread, ...prev];
          }
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

        const currentThreadId = selectedThreadRef.current?.id;
        if (
          currentThreadId === data.threadId &&
          data.message.sender_id !== userData?.id &&
          data.message.message_id &&
          (data.message.message_id as string).length > 10 &&
          !(data.message.message_id as string).match(/^\d+$/) &&
          data.message.message_id !== "null" &&
          data.message.message_id !== "undefined"
        ) {
          // Add a small delay to ensure the message is processed
          setTimeout(() => {
            markMessageAsRead(data.message.message_id as string, data.threadId);
          }, 300);
        }

        setPendingThreadData(null);

        setExistingThreadData({
          threadId: data.threadId,
          clientId: data.message.thread?.client_id,
        });

        updateThreadsSorting();

        // Update query cache with the updated thread data
        queryClient.setQueryData(
          ["threads"],
          (oldData: Thread[] | undefined) => {
            if (!oldData) return oldData;
            const currentThread = threadsRef.current.find(
              (t) => t.id === data.threadId
            );
            if (currentThread) {
              const updatedThread = {
                ...currentThread,
                messages: [...(currentThread.messages || []), data.message],
                has_unread_messages: true,
                last_message: data.message.message,
                last_message_time: data.message.createdAt,
                last_message_sender_id: data.message.sender_id,
              };
              const otherThreads = oldData.filter(
                (t) => t.id !== data.threadId
              );
              return [updatedThread, ...otherThreads];
            } else {
              const newThread: Thread = {
                id: data.threadId,
                user_id: data.message.sender_id,
                started_at: new Date(),
                type: data.message.thread?.type || "general",
                subType: "one-to-one",
                created_by: data.message.sender_id,
                messages: [data.message],
                has_unread_messages: true,
                last_message: data.message.message,
                last_message_time: data.message.createdAt,
                last_message_sender_id: data.message.sender_id,
                Participants_ids: [
                  data.message.sender_id,
                  userData?.id as string,
                ],
                client: null,
              };
              return [newThread, ...oldData];
            }
          }
        );

        // Update single thread query cache if it exists
        queryClient.setQueryData(
          ["thread", data.threadId],
          (oldData: Thread | undefined) => {
            if (!oldData) return oldData;
            const currentThread = threadsRef.current.find(
              (t) => t.id === data.threadId
            );
            if (currentThread) {
              return {
                ...currentThread,
                messages: [...(currentThread.messages || []), data.message],
                has_unread_messages: true,
                last_message: data.message.message,
                last_message_time: data.message.createdAt,
                last_message_sender_id: data.message.sender_id,
              };
            }
            return {
              ...oldData,
              messages: [...(oldData.messages || []), data.message],
              has_unread_messages: true,
              last_message: data.message.message,
              last_message_time: data.message.createdAt,
              last_message_sender_id: data.message.sender_id,
            };
          }
        );
      }
    );

    // Listen for message read status events
    socket?.on(
      "messageRead",
      (data: {
        messageId: string;
        threadId: string;
        readBy: string;
        readAt: Date;
        message: Message;
      }) => {
        console.log("📖 [SOCKET] Message read by another user:", data);

        // Update current thread messages
        setCurrentThreadMessages((prev) => {
          const updated = prev.map((msg) => {
            const msgId =
              (msg as Message & { message_id?: string }).message_id || msg.id;

            if (msgId === data.messageId) {
              return { ...msg, read_by: data.message.read_by };
            }
            return msg;
          });

          return updated;
        });

        // Update selected thread messages
        setSelectedThread((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            messages:
              prev.messages?.map((msg) =>
                ((msg as Message & { message_id?: string }).message_id ||
                  msg.id) === data.messageId
                  ? { ...msg, read_by: data.message.read_by }
                  : msg
              ) || [],
          };
        });

        // Update threads list
        setThreads((prev) =>
          prev.map((thread) => {
            if (thread.id === data.threadId) {
              return {
                ...thread,
                messages:
                  thread.messages?.map((msg) =>
                    ((msg as Message & { message_id?: string }).message_id ||
                      msg.id) === data.messageId
                      ? { ...msg, read_by: data.message.read_by }
                      : msg
                  ) || [],
              };
            }
            return thread;
          })
        );
      }
    );

    // Listen for confirmation when current user marks message as read
    socket?.on(
      "messageMarkedAsRead",
      (data: {
        messageId: string;
        threadId: string;
        readBy: string;
        readAt: Date;
        message: Message;
      }) => {
        console.log(
          "✅ [SOCKET] Message marked as read by current user:",
          data
        );

        // Update current thread messages
        setCurrentThreadMessages((prev) => {
          const updated = prev.map((msg) => {
            const msgId =
              (msg as Message & { message_id?: string }).message_id || msg.id;

            if (msgId === data.messageId) {
              return { ...msg, read_by: data.message.read_by };
            }
            return msg;
          });

          return updated;
        });

        setSelectedThread((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            messages:
              prev.messages?.map((msg) =>
                ((msg as Message & { message_id?: string }).message_id ||
                  msg.id) === data.messageId
                  ? { ...msg, read_by: data.message.read_by }
                  : msg
              ) || [],
          };
        });

        // Update threads list
        setThreads((prev) =>
          prev.map((thread) => {
            if (thread.id === data.threadId) {
              return {
                ...thread,
                messages:
                  thread.messages?.map((msg) =>
                    ((msg as Message & { message_id?: string }).message_id ||
                      msg.id) === data.messageId
                      ? { ...msg, read_by: data.message.read_by }
                      : msg
                  ) || [],
              };
            }
            return thread;
          })
        );
      }
    );

    // Listen for typing events
    socket?.on(
      "userTyping",
      (data: { thread_id: string; user_id: string; is_typing: boolean }) => {
        console.log("⌨️ [SOCKET] User typing status:", data);

        setTypingUsers((prev) => {
          const newTypingUsers = { ...prev };

          if (!newTypingUsers[data.thread_id]) {
            newTypingUsers[data.thread_id] = {};
          }

          if (data.is_typing) {
            // Add or update typing user
            newTypingUsers[data.thread_id][data.user_id] = {
              user_id: data.user_id,
              is_typing: true,
            };
          } else {
            // Remove typing user
            delete newTypingUsers[data.thread_id][data.user_id];

            // Clean up empty thread objects
            if (Object.keys(newTypingUsers[data.thread_id]).length === 0) {
              delete newTypingUsers[data.thread_id];
            }
          }

          return newTypingUsers;
        });
      }
    );

    // Listen for messageSent event to update temporary message ID with server ID
    socket?.on(
      "messageSent",
      (data: {
        threadId: string;
        message: {
          message: string;
          message_id: string;
          sender_id: string;
          thread_id: string;
          createdAt: Date;
          sender?: {
            id: string;
            first_name: string;
            last_name: string;
            avatar?: string;
            email: string;
          };
          thread?: {
            id: string;
            type: string;
            client_id?: string;
          };
        };
      }) => {
        console.log("✅ [SOCKET] Message sent confirmation received:", data);

        setCurrentThreadMessages((prev) => {
          return prev.map((msg) => {
            if (
              msg.message === data.message.message &&
              msg.sender_id === data.message.sender_id &&
              msg.thread_id === data.message.thread_id &&
              msg.id &&
              typeof msg.id === "string" &&
              msg.id.match(/^\d+$/) &&
              msg.id.length >= 10
            ) {
              console.log(
                "🔄 [SOCKET] Updating temporary message ID:",
                msg.id,
                "->",
                data.message.message_id
              );
              return {
                ...msg,
                id: data.message.message_id,
                createdAt: new Date(data.message.createdAt),
                read_by: [
                  {
                    user_id: data.message.sender_id,
                    read_at: new Date(data.message.createdAt).toISOString(),
                  },
                ],
              };
            }
            return msg;
          });
        });

        setSelectedThread((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            messages:
              prev.messages?.map((msg) => {
                if (
                  msg.message === data.message.message &&
                  msg.sender_id === data.message.sender_id &&
                  msg.thread_id === data.message.thread_id &&
                  msg.id &&
                  typeof msg.id === "string" &&
                  msg.id.match(/^\d+$/) &&
                  msg.id.length >= 10
                ) {
                  console.log(
                    "🔄 [SOCKET] Updating selected thread message ID:",
                    msg.id,
                    "->",
                    data.message.message_id
                  );
                  return {
                    ...msg,
                    id: data.message.message_id,
                    createdAt: new Date(data.message.createdAt),
                    read_by: [
                      {
                        user_id: data.message.sender_id,
                        read_at: new Date(data.message.createdAt).toISOString(),
                      },
                    ],
                  };
                }
                return msg;
              }) || [],
          };
        });

        setThreads((prev) =>
          prev.map((thread) => {
            if (thread.id === data.threadId) {
              return {
                ...thread,
                messages:
                  thread.messages?.map((msg) => {
                    if (
                      msg.message === data.message.message &&
                      msg.sender_id === data.message.sender_id &&
                      msg.thread_id === data.message.thread_id &&
                      msg.id &&
                      typeof msg.id === "string" &&
                      msg.id.match(/^\d+$/) &&
                      msg.id.length >= 10
                    ) {
                      console.log(
                        "🔄 [SOCKET] Updating thread message ID:",
                        msg.id,
                        "->",
                        data.message.message_id
                      );
                      return {
                        ...msg,
                        id: data.message.message_id,
                        createdAt: new Date(data.message.createdAt),
                        read_by: [
                          {
                            user_id: data.message.sender_id,
                            read_at: new Date(
                              data.message.createdAt
                            ).toISOString(),
                          },
                        ],
                      };
                    }
                    return msg;
                  }) || [],
              };
            }
            return thread;
          })
        );
      }
    );
  }, [socket, userData?.id]);

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
                message: message.trim(),
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
            message: message.trim(),
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
        message: message.trim(),
        sender_id: senderID,
        thread_id: thread,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
        read_by: [], // Initialize empty read_by array
      },
    ]);
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

  const updateParamThreads = (threads: Thread[]) => {
    return threads.sort((a, b) => {
      if (!a.last_message_time && !b.last_message_time) return 0;
      if (!a.last_message_time) return 1;
      if (!b.last_message_time) return -1;
      return (
        new Date(String(b.last_message_time)).getTime() -
        new Date(String(a.last_message_time)).getTime()
      );
    });
  };

  const clearPendingThreadData = () => {
    setPendingThreadData(null);
  };

  const addThreadToList = (thread: Thread) => {
    setThreads((prev) => {
      const existingThread = prev.find((t) => t.id === thread.id);
      if (existingThread) {
        return prev;
      }
      return [thread, ...prev];
    });
  };

  const navigateToExistingThread = (
    threadId: string,
    navigate: (path: string) => void
  ) => {
    setPendingThreadData(null);

    const currentPath = location.pathname;

    if (
      currentPath.includes(`/${ROUTES.clients}/`) &&
      currentPath.includes(`/${ROUTES.clientMessages}`)
    ) {
      const pathParts = currentPath.split("/");
      const clientIndex = pathParts.findIndex(
        (part) => part === ROUTES.clients
      );
      const currentClientId = pathParts[clientIndex + 1];

      if (currentClientId) {
        navigate(
          `/${ROUTES.clients}/${currentClientId}/${ROUTES.clientMessages}/${threadId}`
        );
      } else {
        navigate(`${ROUTES.messages}/${threadId}`);
      }
    } else {
      navigate(`${ROUTES.messages}/${threadId}`);
    }

    toast.success("Redirected to existing conversation");
  };

  const clearExistingThreadData = () => {
    setExistingThreadData(null);
  };

  const markMessageAsRead = (messageId: string, threadId: string) => {
    if (socket && userData?.id) {
      console.log("📤 [SOCKET] Marking message as read:", messageId);
      socket.emit("markMessageAsRead", {
        message_id: messageId,
        thread_id: threadId,
        user_id: userData.id,
      });
    }
  };

  const emitTypingStart = (threadId: string) => {
    if (socket && userData?.id) {
      console.log("📤 [SOCKET] Emitting typing start:", threadId);
      socket.emit("typingStart", {
        thread_id: threadId,
        user_id: userData.id,
      });
    }
  };

  const emitTypingStop = (threadId: string) => {
    if (socket && userData?.id) {
      console.log("📤 [SOCKET] Emitting typing stop:", threadId);
      socket.emit("typingStop", {
        thread_id: threadId,
        user_id: userData.id,
      });
    }
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
        updateThreadsSorting,
        pendingThreadData,
        setPendingThreadData,
        clearPendingThreadData,
        addThreadToList,
        navigateToExistingThread,
        existingThreadData,
        setExistingThreadData,
        clearExistingThreadData,
        markMessageAsRead,
        typingUsers,
        emitTypingStart,
        emitTypingStop,
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
