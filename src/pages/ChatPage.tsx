import { useGetSingleThreadQuery } from "@agensy/api";
import {
  CommonLoader,
  ConfirmationModal,
  MessageForm,
  MessageList,
} from "@agensy/components";
import { ICONS, ROUTES, ROLES } from "@agensy/constants";
import { useAuthContext, useMessagesContext } from "@agensy/context";
import type {
  Client,
  IUser,
  Message,
  PendingThreadData,
  Thread,
} from "@agensy/types";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNavigate, useParams } from "react-router-dom";

export const ChatPage: React.FC = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { accessUsers, clients } = useAuthContext();
  const [cachedUser, setCachedUser] = useState<IUser | null>(null);
  const [cachedClient, setCachedClient] = useState<Client | null>(null);
  const [cachedGroupName, setCachedGroupName] = useState<string>("");
  const [cachedBroadcastName, setCachedBroadcastName] = useState<string>("");
  const [cachedThreadType, setCachedThreadType] = useState<
    "one-to-one" | "group" | "broadcast" | null
  >(null);
  const {
    data: threadData,
    isFetching: isThreadLoading,
    status: getThreadStatus,
    error: threadError,
    refetch: loadThread,
  } = useGetSingleThreadQuery(params.threadId as string);
  const { userData } = useAuthContext();
  const {
    selectedThread,
    setShowThreadList,
    setSelectedThread,
    setCurrentThreadMessages,
    pendingThreadData,
    addThreadToList,
    updateThreadWithFullData,
    typingUsers,
    leaveThread,
    deleteThread,
  } = useMessagesContext();
  const [confirmLeave, setConfirmLeave] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isAdmin = userData?.Roles?.some((role) => role.role === ROLES.ADMIN);

  const isCurrentlyLoading = useCallback((): boolean => {
    return (
      isThreadLoading && !pendingThreadData && !cachedUser && !cachedThreadType
    );
  }, [isThreadLoading, pendingThreadData, cachedUser, cachedThreadType]);

  const clearCachedData = () => {
    setCachedUser(null);
    setCachedClient(null);
    setCachedGroupName("");
    setCachedBroadcastName("");
    setCachedThreadType(null);
  };

  const formatGroupParticipantNames = (
    thread: Thread | PendingThreadData
  ): string => {
    if (!thread.participants) return "Group Chat";

    const participantNames = thread.participants
      .filter((participant) => {
        const isCurrentUser = participant.id === userData?.id;
        const isLeftParticipant =
          "left_participants_ids" in thread &&
          thread.left_participants_ids?.includes(participant.id as string);
        return !isCurrentUser && !isLeftParticipant;
      })
      .map((participant) => participant.first_name)
      .join(", ")
      .concat(", You");

    if (participantNames && participantNames.length > 15) {
      return participantNames.substring(0, 15) + "...";
    }
    return participantNames || "Group Chat";
  };

  const processThreadForUser = useCallback(
    (thread: Thread | PendingThreadData): IUser | null => {
      if (!thread) return null;

      if (thread.type === "broadcast") {
        setCachedThreadType("broadcast");
        setCachedBroadcastName(thread.name || "Agensy Broadcast");
        return null;
      }

      const isOneToOne = thread.participants_ids.length <= 2;
      setCachedThreadType(isOneToOne ? "one-to-one" : "group");

      // For groups, return null
      if (!isOneToOne) {
        return null;
      }

      // Find the other participant for one-to-one chats
      const otherParticipantId = thread.participants_ids.find(
        (id: string) => id !== userData?.id
      );
      const user = thread?.participants?.find(
        (u: IUser) => u.id === otherParticipantId
      );

      if (user) {
        setCachedUser(user);
      }

      return {
        ...user,
        is_online: accessUsers.find((item) => item.id === user?.id)?.is_online,
      } as IUser;
    },
    [userData?.id, accessUsers]
  );

  const selectedUser = useMemo(() => {
    if (selectedThread && !pendingThreadData) {
      return processThreadForUser(selectedThread);
    }

    if (pendingThreadData && !selectedThread) {
      return processThreadForUser(pendingThreadData);
    }

    if (cachedUser && cachedThreadType === "one-to-one") {
      return cachedUser;
    }

    return accessUsers?.find(
      (participant) =>
        participant.id !== userData?.id &&
        selectedThread?.participants_ids.includes(participant.id as string)
    );
  }, [
    selectedThread,
    accessUsers,
    pendingThreadData,
    userData?.id,
    cachedUser,
    cachedThreadType,
  ]);

  const getThreadDisplayName = () => {
    const currentThread = selectedThread || pendingThreadData;
    let displayName: string;

    if (cachedThreadType === "broadcast") {
      displayName = cachedBroadcastName || "Broadcast";
    } else if (
      currentThread &&
      "type" in currentThread &&
      currentThread.type === "broadcast"
    ) {
      displayName = currentThread.name || "Broadcast";
    } else if (cachedThreadType === "one-to-one" && cachedUser) {
      displayName = `${cachedUser.first_name} ${cachedUser.last_name}`;
    } else if (cachedThreadType === "group") {
      if (cachedGroupName) {
        displayName = cachedGroupName;
      } else if (currentThread) {
        displayName =
          currentThread.name || formatGroupParticipantNames(currentThread);
      } else {
        displayName = "";
      }
    } else if (currentThread) {
      // Fallback: determine type from current thread
      const isGroupChat = currentThread.participants_ids?.length > 2;

      if (isGroupChat) {
        displayName =
          currentThread.name || formatGroupParticipantNames(currentThread);
      } else {
        displayName = selectedUser
          ? `${selectedUser.first_name} ${selectedUser.last_name}`
          : "";
      }
    } else {
      displayName = cachedGroupName || "";
    }

    // Truncate to maximum 15 characters
    return displayName && displayName.length > 15
      ? displayName.substring(0, 15) + "..."
      : displayName;
  };

  const selectedClient = useMemo(() => {
    const currentThread = selectedThread || pendingThreadData;
    if (currentThread) {
      if (selectedThread?.type === "client" && selectedThread?.client_id) {
        return clients?.find((c) => c.id === selectedThread.client_id);
      }
      if (pendingThreadData?.client_id) {
        return clients?.find((c) => c.id === pendingThreadData.client_id);
      }
    }
    // Fallback to cached client
    if (cachedClient) {
      return cachedClient;
    }
    return null;
  }, [selectedThread, pendingThreadData, clients, cachedClient]);

  // Permission logic for delete button
  const canDeleteThread = () => {
    const currentThread = selectedThread || pendingThreadData;
    if (!currentThread) return false;

    // Admin can delete any thread
    if (isAdmin) return true;

    // Broadcast: only admin can delete (already covered above)
    if (currentThread.type === "broadcast") return false;

    // One-to-one: anyone can delete
    if (currentThread.participants_ids.length <= 2) return true;

    // Group: creator or primary user (family admin) can delete
    const isCreator = currentThread.created_by === userData?.id;
    return isCreator;
  };

  // Click-outside handler for dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDeleteThread = () => {
    const currentThread = selectedThread || pendingThreadData;

    if (!currentThread) return;

    clearCachedData();

    deleteThread(currentThread.id as string);

    if (params.clientId) {
      navigate(
        `/${ROUTES.clients}/${params.clientId}/${ROUTES.clientMessages}`
      );
    } else {
      navigate(`${ROUTES.messages}`);
    }

    setConfirmDelete(false);
    setShowDropdown(false);
    setSelectedThread(null);
    setShowThreadList(true);
  };

  useEffect(() => {
    if (params.threadId && selectedThread && pendingThreadData) {
      const isSameThread =
        selectedThread.id === params.threadId &&
        pendingThreadData.id === params.threadId;
      if (!isSameThread) {
        clearCachedData();
      }
    } else if (params.threadId && !pendingThreadData && !selectedThread) {
      clearCachedData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.threadId]);

  useEffect(() => {
    const currentThread = selectedThread || pendingThreadData;
    if (currentThread) {
      if (currentThread.type === "broadcast") {
        setCachedThreadType("broadcast");
        setCachedBroadcastName(currentThread.name || "Broadcast");
        return;
      }

      // Cache client if thread has client_id, otherwise clear it
      if (currentThread.client_id) {
        const client = clients?.find((c) => c.id === currentThread.client_id);
        if (client) {
          setCachedClient(client);
        } else {
          setCachedClient(null);
        }
      } else {
        // Clear cached client if current thread doesn't have client_id
        setCachedClient(null);
      }

      const isOneToOne = currentThread.participants_ids.length <= 2;
      setCachedThreadType(isOneToOne ? "one-to-one" : "group");

      if (isOneToOne) {
        if (cachedGroupName) {
          setCachedGroupName("");
        }
      } else {
        if (currentThread.name) {
          setCachedGroupName(currentThread.name);
        } else if (!cachedGroupName) {
          const participantNames = currentThread.participants
            ?.filter((participant) => {
              const isCurrentUser = participant.id === userData?.id;
              const isLeftParticipant =
                "left_participants_ids" in currentThread &&
                currentThread.left_participants_ids?.includes(
                  participant.id as string
                );
              return !isCurrentUser && !isLeftParticipant;
            })
            .map((participant) => participant.first_name)
            .join(", ")
            .concat(", You");

          const groupName =
            participantNames && participantNames.length > 15
              ? participantNames.substring(0, 15) + "..."
              : participantNames || "Group Chat";

          setCachedGroupName(groupName);
        }
      }
    }
  }, [
    selectedThread,
    pendingThreadData,
    userData?.id,
    cachedGroupName,
    clients,
  ]);

  useEffect(() => {
    if (params.threadId && !pendingThreadData) {
      loadThread();
    }
  }, [params.threadId, pendingThreadData]);

  useEffect(() => {
    if (getThreadStatus === "success" && threadData) {
      setSelectedThread(threadData);
      const messagesWithReadBy = (threadData?.messages || []).map(
        (message: Message) => ({
          ...message,
          read_by: message.read_by || [],
        })
      );
      setCurrentThreadMessages(messagesWithReadBy);
      updateThreadWithFullData(threadData);
      addThreadToList(threadData);
    }
  }, [getThreadStatus, threadData]);

  useEffect(() => {
    if (threadError && !pendingThreadData) {
      navigate(`${ROUTES.messages}`);
    }
  }, [threadError, pendingThreadData]);

  useEffect(() => {
    return () => {
      clearCachedData();
    };
  }, []);

  const renderTypingIndicator = () => {
    const currentThreadId = selectedThread?.id || pendingThreadData?.id;
    if (!currentThreadId) return null;

    const threadTypingUsers = typingUsers[currentThreadId];
    const isAnyoneTyping =
      threadTypingUsers && Object.keys(threadTypingUsers).length > 0;

    if (isAnyoneTyping) {
      const typingUserIds = Object.keys(threadTypingUsers);
      const typingUserNames = typingUserIds
        .map((userId) => {
          const typingUser = (
            selectedThread || pendingThreadData
          )?.participants?.find((u) => u.id === userId);
          if (typingUser) {
            const fullName = `${typingUser.first_name} ${typingUser.last_name}`;
            return fullName.length > 15
              ? fullName.substring(0, 15) + "..."
              : fullName;
          }
          return "Someone";
        })
        .filter(
          (name) => name !== `${userData?.first_name} ${userData?.last_name}`
        );

      return (
        <div className="px-3 sm:px-4 py-2 bg-blue-50 border-b border-blue-100 shadow-sm">
          <p className="text-sm text-blue-600 italic">
            {typingUserNames.length > 0
              ? `${typingUserNames.join(", ")} ${
                  typingUserNames.length === 1 ? "is" : "are"
                } typing...`
              : "Someone is typing..."}
          </p>
        </div>
      );
    }
    return null;
  };

  const handleLeaveThread = () => {
    const currentThread = selectedThread || pendingThreadData;

    if (!currentThread) return;

    clearCachedData();

    leaveThread(currentThread.id as string);

    if (params.clientId) {
      navigate(
        `/${ROUTES.clients}/${params.clientId}/${ROUTES.clientMessages}`
      );
    } else {
      navigate(`${ROUTES.messages}`);
    }

    setConfirmLeave(false);
    setSelectedThread(null);
    setShowThreadList(true);
  };

  const handleBack = () => {
    // Clear cached data when navigating away
    clearCachedData();

    if (!params.clientId) {
      navigate(`${ROUTES.messages}`);
      setShowThreadList(true);
      setSelectedThread(null);
    } else {
      setSelectedThread(null);
      setShowThreadList(true);
      navigate(
        `/${ROUTES.clients}/${params.clientId}/${ROUTES.clientMessages}`
      );
    }
  };

  return (
    <React.Fragment>
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-2 p-3 sm:p-4 border-b border-gray-200 shadow-sm bg-white">
          <button
            onClick={handleBack}
            className="p-1 rounded-lg lg:hidden hover:bg-gray-100 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primaryColor focus:ring-offset-2"
          >
            <ICONS.leftArrow />
          </button>
          <div className="flex-shrink-0 relative">
            {!isCurrentlyLoading() ? (
              pendingThreadData?.type === "broadcast" ||
              selectedThread?.type === "broadcast" ||
              cachedThreadType === "broadcast" ? (
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primaryColor to-blue-700 text-white flex items-center justify-center text-sm font-medium shadow-sm">
                  <ICONS.broadcast className="w-6 h-6" />
                </div>
              ) : cachedThreadType === "one-to-one" && selectedUser ? (
                selectedUser?.avatar ? (
                  <img
                    src={selectedUser?.avatar}
                    alt="profile"
                    className="w-12 h-12 rounded-full object-cover shadow-sm"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primaryColor to-basicBlue text-white flex items-center justify-center text-sm font-medium shadow-sm">
                    <div className="w-full h-full flex items-center text-lg justify-center">
                      {(selectedUser?.first_name?.[0]?.toUpperCase() || "") +
                        (selectedUser?.last_name?.[0]?.toUpperCase() || "")}
                    </div>
                  </div>
                )
              ) : cachedThreadType === "group" ? (
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primaryColor to-basicBlue text-white flex items-center justify-center text-sm font-medium shadow-sm">
                  <ICONS.group className="w-6 h-6" />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse"></div>
              )
            ) : (
              <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse"></div>
            )}
            {/* Show online status only for 1-on-1 chats */}
            {!isCurrentlyLoading() &&
              cachedThreadType === "one-to-one" &&
              selectedUser && (
                <div
                  className={`absolute -bottom-1 -right-1 w-4 h-4 border-2 border-white rounded-full shadow-sm ${
                    selectedUser.is_online ? "bg-green-500" : "bg-gray-400"
                  }`}
                ></div>
              )}
          </div>
          <div className="flex-1 min-w-0">
            {!isCurrentlyLoading() ? (
              <div className="flex flex-col">
                <h3 className="font-medium truncate text-darkGray">
                  {getThreadDisplayName()}
                </h3>
                {selectedClient && (
                  <p className="text-xs text-gray-500 mt-1">
                    <span className="font-bold">Re:</span>{" "}
                    {`${selectedClient.first_name} ${selectedClient.last_name}`
                      .length > 15
                      ? `${selectedClient.first_name} ${selectedClient.last_name}`.substring(
                          0,
                          15
                        ) + "..."
                      : `${selectedClient.first_name} ${selectedClient.last_name}`}
                  </p>
                )}
              </div>
            ) : (
              <div className="h-5 bg-gray-200 rounded animate-pulse w-32"></div>
            )}
          </div>

          {/* Dropdown Menu for thread actions - Only show if at least one option is available */}
          {(cachedThreadType === "group" || canDeleteThread()) && (
            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primaryColor focus:ring-offset-2 flex items-center justify-center"
                title="Thread options"
              >
                <ICONS.moreVertical />
              </button>

              {showDropdown && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50 overflow-hidden">
                  {cachedThreadType === "group" && (
                    <button
                      onClick={() => {
                        setShowDropdown(false);
                        setConfirmLeave(true);
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-gray-100 transition-colors duration-200 flex items-center gap-2 text-gray-700"
                    >
                      <ICONS.exit className="w-4 h-4" />
                      <span>Leave Group</span>
                    </button>
                  )}

                  {canDeleteThread() && (
                    <button
                      onClick={() => {
                        setShowDropdown(false);
                        setConfirmDelete(true);
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-red-50 transition-colors duration-200 flex items-center gap-2 text-red-600"
                    >
                      <ICONS.delete className="w-4 h-4" />
                      <span>Delete Thread</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto">
            {isCurrentlyLoading() ? (
              <div className="flex items-center justify-center h-full">
                <CommonLoader />
              </div>
            ) : !threadData &&
              !pendingThreadData &&
              !selectedThread &&
              !cachedUser &&
              !isThreadLoading ? (
              <div className="flex items-center justify-center h-full text-gray-500">
                <p>Thread not found or you don't have access to it</p>
              </div>
            ) : (
              <MessageList currentUserId={userData?.id as string} />
            )}
          </div>

          {/* Typing indicator above input */}
          {renderTypingIndicator()}

          {(!selectedThread ||
            (selectedThread && selectedThread.type !== "broadcast")) &&
            !(pendingThreadData && pendingThreadData.type === "broadcast") && (
              <MessageForm
                onSendMessage={() => {}}
                isLoading={isCurrentlyLoading()}
              />
            )}

          {/* Show message form for admin in broadcast, read-only message for non-admins */}
          {(selectedThread && selectedThread.type === "broadcast") ||
          (pendingThreadData && pendingThreadData.type === "broadcast") ? (
            isAdmin ? (
              <MessageForm
                onSendMessage={() => {}}
                isLoading={isCurrentlyLoading()}
              />
            ) : (
              <div className="px-4 py-3 border-t bg-primaryColor text-center">
                <p className="text-sm text-white font-medium">
                  This is a broadcast announcement. Replies are not permitted.
                </p>
              </div>
            )
          ) : null}
        </div>
      </div>
      <ConfirmationModal
        title="Leave Group"
        isModalOpen={confirmLeave}
        onOk={handleLeaveThread}
        onCancel={() => setConfirmLeave(false)}
      >
        <p>Are you sure you want to leave this group?</p>
      </ConfirmationModal>
      <ConfirmationModal
        title="Delete Thread"
        isModalOpen={confirmDelete}
        onOk={handleDeleteThread}
        onCancel={() => setConfirmDelete(false)}
      >
        <p>
          Are you sure you want to delete this thread? This will permanently
          delete the thread and all messages for all participants.
        </p>
      </ConfirmationModal>
    </React.Fragment>
  );
};
