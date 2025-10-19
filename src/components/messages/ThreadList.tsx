import React from "react";
import type { Thread } from "@agensy/types";
import { BorderedCard } from "../common/BorderedCard";
import { DateUtils, StringUtils } from "@agensy/utils";
import { AntdTag, CardSkeleton, UnreadCountBadge } from "@agensy/components";
import { ICONS } from "@agensy/constants";
import { useAuthContext, useMessagesContext } from "@agensy/context";

interface ThreadListProps {
  selectedThreadId?: string;
  onAddThread: () => void;
  threads: Thread[];
  onThreadClick: (thread: Thread) => void;
  showBadge?: boolean;
}

export const ThreadList: React.FC<ThreadListProps> = ({
  selectedThreadId,
  onAddThread,
  threads,
  onThreadClick,
  showBadge = true,
}) => {
  const { userData, accessUsers } = useAuthContext();
  const {
    isThreadsLoading,
    setThreads,
    setSelectedThread,
    setShowThreadList,
    setCurrentThreadMessages,
    typingUsers,
  } = useMessagesContext();

  const renderTypingIndicator = (thread: Thread) => {
    const threadTypingUsers = typingUsers[thread.id as string];
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
        <div className="flex justify-between w-full items-baseline gap-2 sm:text-sm text-blue-600 text-xs">
          <p className="max-w-sm truncate mt-0.5 sm:mt-1 italic">
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

  const getUnreadMessageCount = (thread: Thread) => {
    if (!thread.messages || !userData?.id) return 0;

    return thread.messages.filter((message) => {
      // Never count messages sent by current user as unread
      if (message.sender_id === userData.id) {
        return false;
      }

      if (!message.read_by || message.read_by.length === 0) {
        return true;
      }

      const hasCurrentUserRead = message.read_by.some(
        (readEntry) => readEntry.user_id === userData.id
      );

      return !hasCurrentUserRead;
    }).length;
  };

  const handleThreadClick = (thread: Thread) => {
    setCurrentThreadMessages([]);
    setSelectedThread(null);

    onThreadClick(thread);
    setSelectedThread(thread);
    const messagesWithReadBy = (thread.messages || []).map((message) => ({
      ...message,
      read_by: message.read_by || [],
    }));
    setCurrentThreadMessages(messagesWithReadBy);
    setThreads((prev) => {
      return prev.map((t) => {
        if (t.id === thread.id) {
          return { ...t, has_unread_messages: false };
        }
        return t;
      });
    });
    if (window.innerWidth < 1024) {
      setShowThreadList(false);
    }
  };

  return (
    <React.Fragment>
      <div className="flex flex-col h-full w-full">
        <div className="flex justify-between items-center p-[0.75rem] pt-[calc(60px+1.25rem)] md:pt-5 border-b border-gray-200">
          <h2 className="text-lg sm:text-xl font-semibold text-darkGray">
            Messaging
          </h2>
          <button
            onClick={onAddThread}
            className="w-12 h-12 flex items-center justify-center rounded-full hover:bg-gray-100 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primaryColor focus:ring-offset-2"
          >
            <ICONS.plus />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          <div className="flex flex-col gap-3 p-4">
            {isThreadsLoading ? (
              <div className="h-full flex flex-col gap-5">
                <CardSkeleton />
                <CardSkeleton />
                <CardSkeleton />
                <CardSkeleton />
              </div>
            ) : (
              threads?.map((thread: Thread) => {
                const user = accessUsers?.find(
                  (participant) =>
                    participant.id !== userData?.id &&
                    thread.Participants_ids.includes(participant.id as string)
                );

                const isLoading =
                  !accessUsers || accessUsers.length === 0 || !user;

                return (
                  <BorderedCard
                    key={thread.id}
                    className={`cursor-pointer relative transition-colors duration-300 ${
                      selectedThreadId === thread.id
                        ? "!bg-gradient-to-r !from-blue-50 !to-blue-50 border-2 border-primaryColor"
                        : ""
                    }`}
                    onClick={() => handleThreadClick(thread)}
                  >
                    <div className="flex gap-2 sm:gap-3 items-start w-full">
                      <div className="flex gap-2 sm:gap-3 items-center w-full">
                        <div className="flex-shrink-0 relative">
                          {isLoading ? (
                            <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse"></div>
                          ) : user?.avatar ? (
                            <img
                              src={user?.avatar}
                              alt={`${user?.first_name} ${user?.last_name}`}
                              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover shadow-sm"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primaryColor to-basicBlue text-white flex items-center justify-center text-sm font-medium shadow-sm">
                              {(user?.first_name?.[0]?.toUpperCase() || "") +
                                (user?.last_name?.[0]?.toUpperCase() || "")}
                            </div>
                          )}
                          {/* Unread count badge */}
                          <div className="absolute -top-1 -left-1">
                            <UnreadCountBadge
                              count={getUnreadMessageCount(thread)}
                              className="shadow-[0_2px_4px_rgba(0,0,0,0.2)]"
                            />
                          </div>
                          {/* Online status indicator */}
                          {!isLoading && user && (
                            <div
                              className={`absolute -bottom-1 -right-1 w-4 h-4 border-2 border-white rounded-full shadow-sm ${
                                user.is_online ? "bg-green-500" : "bg-gray-400"
                              }`}
                            ></div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="grid 2xl:grid-cols-[1.8fr_1.3fr] xl:grid-cols-[1fr_2fr] lg:grid-cols-[1fr_1fr] grid-cols-[1fr_2fr] items-start sm:items-center">
                            {isLoading ? (
                              <div className="h-5 bg-gray-200 rounded animate-pulse w-32"></div>
                            ) : (
                              <h4 className="font-medium text-sm sm:text-base md:max-w-[300px] 2xl:max-w-xs max-w-[10rem] text-darkGray line-clamp-4">
                                {user
                                  ? `${user.first_name} ${user.last_name}`
                                  : "Unknown User"}
                              </h4>
                            )}
                          </div>
                          {renderTypingIndicator(thread) ||
                            (thread.last_message && (
                              <div className="flex justify-between w-full items-baseline gap-2 sm:text-sm text-slateGrey text-xs">
                                {isLoading ? (
                                  <div className="h-4 bg-gray-200 rounded animate-pulse w-24 mt-1"></div>
                                ) : (
                                  <p className="max-w-sm truncate mt-0.5 sm:mt-1">
                                    {thread.last_message_sender_id ===
                                    userData?.id
                                      ? "You: " + thread.last_message
                                      : accessUsers?.find(
                                          (p) =>
                                            p.id ===
                                            thread.last_message_sender_id
                                        )?.first_name +
                                          ": " +
                                          thread.last_message || "Unknown User"}
                                  </p>
                                )}
                                <p>
                                  {DateUtils.formatRelativeTime(
                                    String(thread.last_message_time)
                                  )}
                                </p>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                    {showBadge && (
                      <div className="absolute right-2 top-2">
                        <AntdTag
                          color={thread.type === "general" ? "blue" : "green"}
                        >
                          {StringUtils.capitalizeFirstLetter(
                            thread.type === "general"
                              ? "General"
                              : "Care Recipient"
                          )}
                        </AntdTag>
                      </div>
                    )}
                  </BorderedCard>
                );
              })
            )}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default ThreadList;
