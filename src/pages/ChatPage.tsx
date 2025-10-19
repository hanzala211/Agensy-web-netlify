import { useGetSingleThreadQuery } from "@agensy/api";
import { CommonLoader, MessageForm, MessageList } from "@agensy/components";
import { ICONS, ROUTES } from "@agensy/constants";
import { useAuthContext, useMessagesContext } from "@agensy/context";
import type { Message } from "@agensy/types";
import React, { useEffect, useMemo, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";

export const ChatPage: React.FC = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { accessUsers } = useAuthContext();
  const [isSilentFetch, setIsSilentFetch] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [cachedUser, setCachedUser] = useState<any>(null);
  const {
    data: threadData,
    isLoading: isThreadLoading,
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
  } = useMessagesContext();
  const prevPendingThreadData = useRef(pendingThreadData);
  const selectedUser = useMemo(() => {
    if (pendingThreadData) {
      const otherParticipantId = pendingThreadData.participants_ids.find(
        (id) => id !== userData?.id
      );
      const user = accessUsers?.find((user) => user.id === otherParticipantId);
      if (user) {
        setCachedUser(user);
      }
      return user;
    }

    if (cachedUser) {
      return cachedUser;
    }

    return accessUsers?.find(
      (participant) =>
        participant.id !== userData?.id &&
        selectedThread?.Participants_ids.includes(participant.id as string)
    );
  }, [
    selectedThread,
    accessUsers,
    pendingThreadData,
    userData?.id,
    cachedUser,
  ]);

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
      setIsSilentFetch(false);
    }
  }, [getThreadStatus, threadData]);

  useEffect(() => {
    if (params.threadId && !pendingThreadData) {
      loadThread();
    }
  }, [params.threadId, pendingThreadData]);

  useEffect(() => {
    if (
      prevPendingThreadData.current &&
      !pendingThreadData &&
      params.threadId
    ) {
      setIsSilentFetch(true);
    }
    prevPendingThreadData.current = pendingThreadData;
  }, [pendingThreadData, params.threadId]);

  useEffect(() => {
    if (threadError && !pendingThreadData) {
      navigate(`${ROUTES.messages}`);
    }
  }, [threadError]);

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
          const typingUser = accessUsers?.find((u) => u.id === userId);
          return typingUser
            ? `${typingUser.first_name} ${typingUser.last_name}`
            : "Someone";
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

  const handleBack = () => {
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
            {selectedUser ? (
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
            ) : (
              <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse"></div>
            )}
            {/* Online status indicator */}
            {selectedUser && (
              <div
                className={`absolute -bottom-1 -right-1 w-4 h-4 border-2 border-white rounded-full shadow-sm ${
                  selectedUser.is_online ? "bg-green-500" : "bg-gray-400"
                }`}
              ></div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            {selectedUser ? (
              <h3 className="font-medium truncate text-darkGray">
                {selectedUser?.first_name} {selectedUser?.last_name}
              </h3>
            ) : (
              <div className="h-5 bg-gray-200 rounded animate-pulse w-32"></div>
            )}
          </div>
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto">
            {isThreadLoading &&
            !pendingThreadData &&
            !threadData &&
            !selectedThread &&
            !isSilentFetch ? (
              <div className="flex items-center justify-center h-full">
                <CommonLoader />
              </div>
            ) : !threadData &&
              !pendingThreadData &&
              !selectedThread &&
              !cachedUser ? (
              <div className="flex items-center justify-center h-full text-gray-500">
                <p>Thread not found or you don't have access to it</p>
              </div>
            ) : (
              <MessageList currentUserId={userData?.id as string} />
            )}
          </div>

          {/* Typing indicator above input */}
          {renderTypingIndicator()}

          <MessageForm
            onSendMessage={() => {}}
            isLoading={
              isThreadLoading &&
              !pendingThreadData &&
              !threadData &&
              !selectedThread &&
              !isSilentFetch
            }
          />
        </div>
      </div>
    </React.Fragment>
  );
};
