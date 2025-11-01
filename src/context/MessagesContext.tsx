import type {
  IUser,
  Message,
  MessagesContextType,
  PendingThreadData,
  Thread,
  TypingUsers,
} from "@agensy/types";
import { createContext, useContext, useEffect, useState, useRef } from "react";
import { useSocketContext } from "./SocketContext";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthContext } from "./AuthContext";
import { useGetAllThreadsQuery } from "@agensy/api";
import dayjs from "dayjs";
import { sortBy } from "lodash";
import { ROUTES } from "@agensy/constants";

const MessagesContext = createContext<MessagesContextType | undefined>(
  undefined
);

export const MessagesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const navigate = useNavigate();
  const { userData } = useAuthContext();
  const location = useLocation();
  const [selectedThread, setSelectedThread] = useState<Thread | null>(null);
  const [showThreadList, setShowThreadList] = useState<boolean>(true);
  const [currentThreadMessages, setCurrentThreadMessages] = useState<Message[]>(
    []
  );
  const [threads, setThreads] = useState<Thread[]>([]);
  const [pendingThreadData, setPendingThreadData] =
    useState<PendingThreadData | null>(null);
  const [typingUsers, setTypingUsers] = useState<TypingUsers>({});
  const selectedThreadRef = useRef<Thread | null>(null);
  const currentMessagesRef = useRef<Message[]>([]);
  const { socket } = useSocketContext();
  const {
    data: threadsData,
    isFetching: isThreadsLoading,
    refetch: loadThreads,
    status: threadsFetchStatus,
  } = useGetAllThreadsQuery();

  useEffect(() => {
    currentMessagesRef.current = currentThreadMessages;
  }, [currentThreadMessages]);

  useEffect(() => {
    if (userData && threadsFetchStatus === "pending") loadThreads();
  }, [userData]);

  useEffect(() => {
    if (threadsData) {
      const sortedThreads = updateParamThreads([...threadsData]);
      setThreads(sortedThreads);
    }
  }, [threadsData]);

  useEffect(() => {
    selectedThreadRef.current = selectedThread;
  }, [selectedThread]);

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
      (data: {
        threadId: string;
        message: Message;
        threadType: string;
        participants: IUser[];
      }) => {
        console.log(data);
        setThreads((prev) => {
          const existingThread = prev.find((t) => t.id === data.threadId);

          if (existingThread) {
            return prev.map((thread) => {
              if (thread.id === data.threadId) {
                let lastMessage = data.message.message;
                if (!lastMessage && data.message.file_name) {
                  lastMessage = data.message.file_name;
                }

                return {
                  ...thread,
                  has_unread_messages: true,
                  last_message: lastMessage,
                  last_message_time: data.message.createdAt,
                  last_message_sender_id: data.message.sender_id,
                  unread_count: (thread.unread_count || 0) + 1,
                  participants: data.participants,
                  participants_ids: data.participants.map(
                    (participant) => participant.id as string
                  ),
                };
              }
              return thread;
            });
          }

          let lastMessage = data.message.message;
          if (!lastMessage && data.message.file_name) {
            lastMessage = data.message.file_name;
          }

          const newThread: Thread = {
            id: data.threadId,
            user_id: data.message.sender_id,
            participants: data.participants,
            started_at: new Date(),
            type: data.threadType as "general" | "client",
            created_by: data.message.sender_id,
            has_unread_messages: true,
            last_message: lastMessage,
            last_message_time: data.message.createdAt,
            last_message_sender_id: data.message.sender_id,
            participants_ids: data.participants.map(
              (item) => item.id as string
            ),
            client: null,
            unread_count: 1,
          };
          return [...prev, newThread];
        });

        setSelectedThread((prev) => {
          if (prev?.id === data.threadId) {
            return {
              ...prev,
              participants: data.participants,
              participants_ids: data.participants.map(
                (participant) => participant.id as string
              ),
            };
          }
          return prev;
        });

        setCurrentThreadMessages((prev) => {
          if (
            prev &&
            data.message.sender_id !== userData?.id &&
            selectedThreadRef.current?.id === data.threadId
          ) {
            return [
              ...(prev || []),
              { ...data.message, id: data.message.message_id as string },
            ];
          }
          return prev;
        });

        const currentThreadId = selectedThreadRef.current?.id;

        if (
          currentThreadId === data.threadId &&
          data.message.sender_id !== userData?.id &&
          data.message.message_id
        ) {
          setTimeout(() => {
            markMessageAsRead(data.threadId);
          }, 300);
        }

        updateThreadsSorting();
      }
    );

    // Listen for message read status events
    socket?.on(
      "messageRead",
      (data: { threadId: string; readBy: string; readAt: Date }) => {
        console.log("📖 [SOCKET] Messages read by another user:", data);

        // Helper function to add read status to a message
        const addReadStatus = (msg: Message) => {
          const existingReadBy = msg.read_by || [];
          const isAlreadyRead = existingReadBy.some(
            (read) => read.user_id === data.readBy
          );

          if (!isAlreadyRead) {
            return {
              ...msg,
              read_by: [
                ...existingReadBy,
                {
                  user_id: data.readBy,
                  read_at:
                    new Date(data.readAt).toISOString() ||
                    new Date().toISOString(),
                },
              ],
            };
          }
          return msg;
        };

        // Update current thread messages - mark all messages as read by the user
        setCurrentThreadMessages((prev) => {
          return prev.map(addReadStatus);
        });
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
            newTypingUsers[data.thread_id][data.user_id] = {
              user_id: data.user_id,
              is_typing: true,
            };
          } else {
            delete newTypingUsers[data.thread_id][data.user_id];
            if (Object.keys(newTypingUsers[data.thread_id]).length === 0) {
              delete newTypingUsers[data.thread_id];
            }
          }

          return newTypingUsers;
        });
      }
    );

    // Listen for broadcast messages
    socket?.on(
      "receiveBroadcast",
      (data: {
        id: string;
        thread_type: string;
        thread_name: string;
        message: string;
        message_id: string;
        sender_id: string;
        file_url?: string;
        file_name?: string;
        file_key?: string;
        createdAt: Date;
      }) => {
        console.log("📢 [SOCKET] Received broadcast:", data);

        const threadName = data.thread_name || "System Announcement";
        let lastMessage = data.message;
        if (!lastMessage && data.file_name) {
          lastMessage = data.file_name;
        }

        setThreads((prev) => {
          const existingThread = prev.find((t) => t.id === data.id);

          if (existingThread) {
            return prev.map((thread) => {
              if (thread.id === data.id) {
                return {
                  ...thread,
                  has_unread_messages: true,
                  last_message: lastMessage,
                  last_message_time: data.createdAt,
                  last_message_sender_id: data.sender_id,
                  unread_count: (thread.unread_count || 0) + 1,
                  name: threadName,
                };
              }
              return thread;
            });
          }

          const newThread: Thread = {
            id: data.id,
            user_id: data.sender_id,
            participants: [],
            started_at: new Date(),
            type: "broadcast",
            created_by: data.sender_id,
            has_unread_messages: true,
            last_message: lastMessage,
            last_message_time: data.createdAt,
            last_message_sender_id: data.sender_id,
            participants_ids: [],
            client: null,
            unread_count: 1,
            name: threadName,
          };
          return [...prev, newThread];
        });

        setCurrentThreadMessages((prev) => {
          const currentThreadId = selectedThreadRef.current?.id;
          if (currentThreadId === data.id) {
            return [
              ...(prev || []),
              {
                id: data.message_id,
                message_id: data.message_id,
                thread_id: data.id,
                sender_id: data.sender_id,
                message: data.message,
                createdAt: data.createdAt,
                file_url: data.file_url,
                file_name: data.file_name,
                file_key: data.file_key?.toString(),
              },
            ];
          }
          return prev;
        });

        updateThreadsSorting();
      }
    );

    // Listen for message deletion events
    socket?.on(
      "messageDeleted",
      (data: {
        messageId: string;
        threadId: string;
        deletedBy: string;
        deletedAt: Date;
        lastMessage: string;
        lastMessageSenderId: string;
        participants: IUser[];
        messageReadByUsers: string[];
      }) => {
        console.log("🗑️ [SOCKET] Message deleted:", data);

        setCurrentThreadMessages(() => {
          const filteredMessages = currentMessagesRef.current.filter(
            (msg) => msg.id !== data.messageId
          );
          console.log(filteredMessages);
          return filteredMessages;
        });

        setThreads((prev) =>
          prev.map((thread) => {
            if (thread.id === data.threadId) {
              return {
                ...thread,
                last_message: data.lastMessage,
                last_message_sender_id: data.lastMessageSenderId as string,
                participants: data.participants,
                participants_ids: data.participants.map(
                  (participant) => participant.id as string
                ),
                unread_count: data.messageReadByUsers.find(
                  (item) => item === userData?.id
                )
                  ? thread.unread_count || 0
                  : (thread.unread_count || 0) - 1,
              };
            }
            return thread;
          })
        );
        setSelectedThread((prev) => {
          if (prev?.id === data.threadId) {
            return {
              ...prev,
              participants: data.participants,
              participants_ids: data.participants.map(
                (participant) => participant.id as string
              ),
            };
          }
          return prev;
        });
      }
    );

    // Listen for user left thread events
    socket?.on(
      "userLeftThread",
      (data: {
        threadId: string;
        userId: string;
        participants: string[];
        leftAt: Date;
        leftParticipants: string[];
      }) => {
        console.log("🚪 [SOCKET] User left thread:", data);

        if (data.userId === userData?.id) {
          setThreads((prev) =>
            prev.filter((thread) => thread.id !== data.threadId)
          );

          if (selectedThreadRef.current?.id === data.threadId) {
            setSelectedThread(null);
            setCurrentThreadMessages([]);
          }
        } else {
          setThreads((prev) =>
            prev.map((thread) => {
              if (thread.id === data.threadId) {
                const leavingUser = thread.participants?.find(
                  (p) => p.id === data.userId
                );

                const updatedParticipants = thread.participants?.filter(
                  (p) => p.id !== data.userId
                );

                const updatedLeftParticipants = leavingUser
                  ? [
                      ...(thread.left_participants || []),
                      ...(thread.left_participants?.some(
                        (p) => p.id === data.userId
                      )
                        ? []
                        : [leavingUser]),
                    ]
                  : thread.left_participants?.filter(
                      (p) => p.id !== data.userId
                    );

                return {
                  ...thread,
                  participants_ids: data.participants,
                  participants: updatedParticipants,
                  left_participants_ids: data.leftParticipants,
                  left_participants: updatedLeftParticipants,
                };
              }
              return thread;
            })
          );

          if (selectedThreadRef.current?.id === data.threadId) {
            setSelectedThread((prev) => {
              if (!prev) return prev;

              const leavingUser = prev.participants?.find(
                (p) => p.id === data.userId
              );

              const updatedParticipants = prev.participants?.filter(
                (p) => p.id !== data.userId
              );

              const updatedLeftParticipants = leavingUser
                ? [
                    ...(prev.left_participants || []),
                    ...(prev.left_participants?.some(
                      (p) => p.id === data.userId
                    )
                      ? []
                      : [leavingUser]),
                  ]
                : prev.left_participants?.filter((p) => p.id !== data.userId);

              return {
                ...prev,
                participants_ids: data.participants,
                participants: updatedParticipants,
                left_participants_ids: data.leftParticipants,
                left_participants: updatedLeftParticipants,
              };
            });
          }
        }
      }
    );

    // Listen for thread deletion events
    socket?.on(
      "threadDeleted",
      (data: { threadId: string; deletedBy: string; deletedAt: Date }) => {
        console.log("🗑️ [SOCKET] Thread deleted:", data);

        // Remove thread from threads array
        setThreads((prev) =>
          prev.filter((thread) => thread.id !== data.threadId)
        );

        // Clear selected thread if it's the deleted one
        if (selectedThreadRef.current?.id === data.threadId) {
          setSelectedThread(null);
          setCurrentThreadMessages([]);
          navigate(ROUTES.messages);
        }
      }
    );

    return () => {
      socket?.off("userTyping");
      socket?.off("messageDeleted");
      socket?.off("receiveMessage");
      socket?.off("userLeftThread");
      socket?.off("receiveBroadcast");
      socket?.off("threadDeleted");
    };
  }, [socket, userData?.id]);

  const updateThreads = (
    threadId: string,
    lastMessageSender: string,
    message: string,
    fileData?: { file_url: string; file_name: string; file_key: number },
    messageId?: string
  ) => {
    setThreads((prev) => {
      return prev.map((t) => {
        if (t.id === threadId) {
          let lastMessage = message.trim();
          if (!lastMessage && fileData?.file_name) {
            lastMessage = fileData.file_name;
          }

          return {
            ...t,
            last_message: lastMessage,
            last_message_time: new Date(),
            last_message_sender_id: lastMessageSender,
            participants: t.participants?.some(
              (item) => item.id === lastMessageSender
            )
              ? [...(t.participants || [])]
              : [...(t.participants || []), userData as IUser],
            participants_ids: t.participants_ids?.includes(
              lastMessageSender as string
            )
              ? [...(t.participants_ids || [])]
              : [...(t.participants_ids || []), lastMessageSender as string],
            messages: [
              ...(t.messages || []),
              {
                message: message.trim(),
                sender_id: lastMessageSender,
                thread_id: threadId as string,
                id: messageId || Date.now().toString(),
                message_id: messageId,
                createdAt: new Date(),
                updatedAt: new Date(),
                file_url: fileData?.file_url,
                file_name: fileData?.file_name,
                file_key: fileData?.file_key?.toString(),
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
    message: string,
    fileData?: { file_url: string; file_name: string; file_key: number },
    messageId?: string
  ) => {
    setSelectedThread((prev) => {
      if (!prev) return prev;

      let lastMessage = message.trim();
      if (!lastMessage && fileData?.file_name) {
        lastMessage = fileData.file_name;
      }

      return {
        ...prev,
        messages: [
          ...(prev.messages || []),
          {
            message: message.trim(),
            sender_id: lastMessageSender,
            thread_id: threadId as string,
            id: messageId || Date.now().toString(),
            message_id: messageId,
            createdAt: new Date(),
            updatedAt: new Date(),
            file_url: fileData?.file_url,
            file_name: fileData?.file_name,
            file_key: fileData?.file_key?.toString(),
          },
        ],
        participants: prev.participants?.some(
          (item) => item.id === lastMessageSender
        )
          ? [...(prev.participants || [])]
          : [...(prev.participants || []), userData as IUser],

        participants_ids: prev.participants_ids?.includes(
          lastMessageSender as string
        )
          ? [...(prev.participants_ids || [])]
          : [...(prev.participants_ids || []), lastMessageSender as string],
        last_message: lastMessage,
        last_message_time: new Date(),
        last_message_sender_id: lastMessageSender,
      };
    });
  };

  const updateCurrentThreadMessages = (
    message: string,
    thread: string,
    senderID: string,
    fileData?: { file_url: string; file_name: string; file_key: number },
    messageId?: string
  ) => {
    console.log("Sender in current thread message:", senderID);
    setCurrentThreadMessages((prev) => [
      ...(prev || []),
      {
        message: message.trim(),
        sender_id: senderID,
        thread_id: thread,
        id: messageId || Date.now().toString(),
        message_id: messageId,
        createdAt: new Date(),
        updatedAt: new Date(),
        read_by: [
          {
            user_id: senderID,
            read_at: new Date().toISOString(),
          },
        ],
        file_url: fileData?.file_url,
        file_name: fileData?.file_name,
        file_key: fileData?.file_key?.toString(),
      },
    ]);
  };

  const updateThreadsSorting = () => {
    setThreads((prev) => {
      return sortBy(prev, (thread) => {
        if (!thread.last_message_time) return Infinity;
        return -dayjs(thread.last_message_time).valueOf();
      });
    });
  };

  const updateParamThreads = (threads: Thread[]) => {
    return sortBy(threads, (thread) => {
      if (!thread.last_message_time) return Infinity;
      return -dayjs(thread.last_message_time).valueOf();
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

  const updateThreadWithFullData = (thread: Thread) => {
    setThreads((prev) => {
      const existingThreadIndex = prev.findIndex((t) => t.id === thread.id);

      if (existingThreadIndex !== -1) {
        const updatedThreads = [...prev];
        updatedThreads[existingThreadIndex] = {
          ...thread,
          has_unread_messages: prev[existingThreadIndex].has_unread_messages,
        };
        return updatedThreads;
      } else {
        return [thread, ...prev];
      }
    });
  };

  const markMessageAsRead = (threadId: string) => {
    if (socket && userData?.id) {
      console.log("📤 [SOCKET] Marking message as read");
      setThreads((prev) =>
        prev.map((thread) => {
          if (thread.id === threadId) {
            return {
              ...thread,
              unread_count: 0,
            };
          }
          return thread;
        })
      );
      socket.emit("markMessageAsRead", {
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

  const deleteMessage = (messageId: string, threadId: string) => {
    if (socket && userData?.id) {
      console.log("🗑️ [SOCKET] Emitting delete message:", {
        messageId,
        threadId,
      });
      const sortedMessages = [...currentThreadMessages].sort(
        (a, b) => dayjs(a.createdAt).valueOf() - dayjs(b.createdAt).valueOf()
      );
      const lastMessage = sortedMessages[sortedMessages.length - 1];
      const isLastMessage = lastMessage?.id === messageId;

      setCurrentThreadMessages((prev) => {
        const filteredMessages = prev.filter((msg) => msg.id !== messageId);
        currentMessagesRef.current = filteredMessages;
        return filteredMessages;
      });

      setThreads((prev) =>
        prev.map((thread) => {
          if (thread.id === threadId) {
            return {
              ...thread,
              participants: thread.participants?.some(
                (item) => item.id === userData.id
              )
                ? [...(thread.participants || [])]
                : [...(thread.participants || []), userData as IUser],

              participants_ids: thread.participants_ids?.includes(
                userData.id as string
              )
                ? [...(thread.participants_ids || [])]
                : [...(thread.participants_ids || []), userData.id as string],
            };
          }
          return thread;
        })
      );

      setSelectedThread((prev) => {
        if (prev?.id === threadId) {
          return {
            ...prev,
            participants: prev.participants?.some(
              (item) => item.id === userData.id
            )
              ? [...(prev.participants || [])]
              : [...(prev.participants || []), userData as IUser],

            participants_ids: prev.participants_ids?.includes(
              userData.id as string
            )
              ? [...(prev.participants_ids || [])]
              : [...(prev.participants_ids || []), userData.id as string],
          };
        }
        return prev;
      });

      if (isLastMessage) {
        setThreads((prev) =>
          prev.map((thread) => {
            if (thread.id === threadId) {
              return {
                ...thread,
                last_message: "This message is deleted",
                last_message_sender_id: userData?.id as string,
              };
            }
            return thread;
          })
        );
      }

      console.log(isLastMessage);

      socket.emit("deleteMessage", {
        message_id: messageId,
        thread_id: threadId,
        user_id: userData.id,
        last_message: isLastMessage,
      });
    }
  };

  const leaveThread = (threadId: string) => {
    if (socket && userData?.id) {
      console.log("🚪 [SOCKET] Emitting leave thread:", threadId);

      setThreads((prev) => prev.filter((thread) => thread.id !== threadId));

      if (selectedThreadRef.current?.id === threadId) {
        setSelectedThread(null);
        setCurrentThreadMessages([]);
      }

      socket.emit("leaveThread", {
        thread_id: threadId,
        user_id: userData.id,
      });
    }
  };

  const deleteThread = (threadId: string) => {
    if (socket && userData?.id) {
      console.log("🗑️ [SOCKET] Emitting delete thread:", threadId);

      setThreads((prev) => prev.filter((thread) => thread.id !== threadId));

      if (selectedThreadRef.current?.id === threadId) {
        setSelectedThread(null);
        setCurrentThreadMessages([]);
      }

      socket.emit("deleteThread", {
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
        updateThreadWithFullData,
        markMessageAsRead,
        typingUsers,
        emitTypingStart,
        emitTypingStop,
        deleteMessage,
        leaveThread,
        deleteThread,
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
