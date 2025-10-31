import React from "react";
import type { Thread } from "@agensy/types";
import { BorderedCard } from "../common/BorderedCard";
import { DateUtils } from "@agensy/utils";
import { CardSkeleton, UnreadCountBadge } from "@agensy/components";
import { ICONS } from "@agensy/constants";
import { useAuthContext, useMessagesContext } from "@agensy/context";
import { useParams } from "react-router-dom";

interface ThreadListProps {
  selectedThreadId?: string;
  onAddThread: () => void;
  threads: Thread[];
  onThreadClick: (thread: Thread) => void;
  className?: string;
  showHeader?: boolean; // Show "Messaging" header with plus icon
}

export const ThreadList: React.FC<ThreadListProps> = ({
  selectedThreadId,
  onAddThread,
  threads,
  onThreadClick,
  className,
  showHeader = true,
}) => {
  const params = useParams();
  const { userData, clients, accessUsers } = useAuthContext();
  const {
    isThreadsLoading,
    setThreads,
    setSelectedThread,
    setShowThreadList,
    setCurrentThreadMessages,
    typingUsers,
    setPendingThreadData,
  } = useMessagesContext();

  const renderTypingIndicator = (thread: Thread) => {
    const threadTypingUsers = typingUsers[thread.id as string];
    const isAnyoneTyping =
      threadTypingUsers && Object.keys(threadTypingUsers).length > 0;

    if (isAnyoneTyping) {
      const typingUserIds = Object.keys(threadTypingUsers);
      const typingUserNames = typingUserIds
        .map((userId) => {
          const typingUser = thread.participants?.find((u) => u.id === userId);
          return typingUser
            ? `${typingUser.first_name} ${typingUser.last_name}`
            : "Someone";
        })
        .filter(
          (name) => name !== `${userData?.first_name} ${userData?.last_name}`
        );

      return (
        <div className="flex justify-between w-full items-baseline gap-2 sm:text-sm text-blue-600 text-xs mt-2 md:mt-0">
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

  const handleThreadClick = (thread: Thread) => {
    if (params.threadId === thread.id) {
      return;
    }
    setCurrentThreadMessages([]);
    setSelectedThread(null);
    setPendingThreadData(null);

    onThreadClick(thread);
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
        {showHeader && (
          <div
            className={`flex justify-between items-center p-[0.75rem] ${className} md:pt-5 border-b border-gray-200`}
          >
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
        )}
        <div className="flex-1 overflow-y-auto">
          <div className="flex flex-col gap-0 p-1">
            {isThreadsLoading ? (
              <div className="h-full flex flex-col gap-5">
                <CardSkeleton />
                <CardSkeleton />
                <CardSkeleton />
                <CardSkeleton />
              </div>
            ) : (
              threads?.map((thread: Thread) => {
                const client =
                  thread.type === "client" && thread.client_id
                    ? clients?.find((c) => c.id === thread.client_id)
                    : null;

                const user =
                  thread.participants_ids.length <= 2
                    ? thread.participants?.find(
                        (participant) =>
                          participant.id !== userData?.id &&
                          thread.participants_ids.includes(
                            participant.id as string
                          )
                      )
                    : null;

                const getThreadDisplayName = () => {
                  let displayName: string;

                  // Broadcast threads
                  if (thread.type === "broadcast") {
                    displayName = thread.name || "System Announcement";
                  } else if (thread.name) {
                    displayName = thread.name;
                  } else if (thread.participants_ids.length > 2) {
                    const participantNames = thread.participants
                      ?.filter(
                        (participant) =>
                          participant.id !== userData?.id &&
                          !thread.left_participants_ids?.includes(
                            participant.id as string
                          )
                      )
                      .map((participant) => participant.first_name)
                      .join(", ")
                      .concat(", You");

                    displayName = participantNames || "Unknown User";
                  } else {
                    displayName = user
                      ? `${user.first_name} ${user.last_name}`
                      : "Unknown User";
                  }

                  // Truncate to maximum 15 characters
                  return displayName && displayName.length > 15
                    ? displayName.substring(0, 15) + "..."
                    : displayName;
                };

                return (
                  <BorderedCard
                    key={thread.id}
                    className={`cursor-pointer !p-4 relative transition-colors duration-300 ${
                      selectedThreadId === thread.id
                        ? "!bg-gradient-to-r !from-blue-50 !to-blue-50"
                        : ""
                    }`}
                    onClick={() => handleThreadClick(thread)}
                  >
                    <div className="flex gap-2 sm:gap-3 items-start w-full">
                      <div className="flex gap-2 sm:gap-3 items-center w-full">
                        <div className="flex-shrink-0 relative">
                          {thread.type === "broadcast" ? (
                            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primaryColor to-blue-600 text-white flex items-center justify-center text-sm font-medium shadow-sm">
                              <ICONS.broadcast className="w-6 h-6" />
                            </div>
                          ) : thread.participants_ids.length <= 2 &&
                            user?.avatar ? (
                            <img
                              src={user?.avatar}
                              alt={`${user?.first_name} ${user?.last_name}`}
                              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover shadow-sm"
                            />
                          ) : thread.participants_ids.length <= 2 && user ? (
                            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primaryColor to-basicBlue text-white flex items-center justify-center text-sm font-medium shadow-sm">
                              {(user?.first_name?.[0]?.toUpperCase() || "") +
                                (user?.last_name?.[0]?.toUpperCase() || "")}
                            </div>
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primaryColor to-basicBlue text-white flex items-center justify-center text-sm font-medium shadow-sm">
                              <ICONS.group className="w-6 h-6" />
                            </div>
                          )}
                          <div className="absolute -top-1 -left-1">
                            <UnreadCountBadge
                              count={thread.unread_count || 0}
                              className="shadow-[0_2px_4px_rgba(0,0,0,0.2)]"
                            />
                          </div>
                          {thread.type !== "broadcast" &&
                            thread.participants_ids.length <= 2 &&
                            user &&
                            (() => {
                              const userOnlineStatus = accessUsers?.find(
                                (item) => item.id === user.id
                              )?.is_online;
                              return (
                                <div
                                  className={`absolute -bottom-1 -right-1 w-4 h-4 border-2 border-white rounded-full shadow-sm ${
                                    userOnlineStatus
                                      ? "bg-green-500"
                                      : "bg-gray-400"
                                  }`}
                                ></div>
                              );
                            })()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="grid grid-cols-1 xl:grid-cols-[3fr_2fr] 2xl:grid-cols-[1.8fr_1.3fr] items-start sm:items-center">
                            <div className="flex flex-col">
                              <h4 className="font-medium text-sm sm:text-base md:max-w-[300px] 2xl:max-w-xs max-w-[10rem] text-darkGray line-clamp-4">
                                {getThreadDisplayName()}
                              </h4>
                            </div>
                            {thread.type === "client" && client && (
                              <div className="hidden xl:flex justify-end">
                                <p className="text-xs text-gray-500 truncate max-w-[200px]">
                                  <span className="font-bold">Re:</span>{" "}
                                  {`${client.first_name} ${client.last_name}`
                                    .length > 10
                                    ? `${client.first_name} ${client.last_name}`.substring(
                                        0,
                                        10
                                      ) + "..."
                                    : `${client.first_name} ${client.last_name}`}
                                </p>
                              </div>
                            )}
                            {thread.type === "broadcast" && (
                              <div className="hidden xl:flex justify-end">
                                <p className="text-xs text-primaryColor font-semibold">
                                  Broadcast
                                </p>
                              </div>
                            )}
                          </div>
                          {renderTypingIndicator(thread) ||
                            (thread.last_message && (
                              <div className="flex flex-col sm:flex-row sm:justify-between w-full sm:items-baseline items-start gap-1 sm:gap-2 sm:text-sm text-slateGrey text-xs mt-2 md:mt-0">
                                <p className="max-w-xs truncate mt-0.5 sm:mt-1">
                                  {thread.type === "broadcast"
                                    ? "Broadcast: " + thread.last_message
                                    : thread.last_message_sender_id ===
                                      userData?.id
                                    ? "You: " + thread.last_message
                                    : (() => {
                                        const allParticipants = [
                                          ...(thread.participants || []),
                                          ...(thread.left_participants || []),
                                        ];
                                        const sender = allParticipants.find(
                                          (p) =>
                                            p.id ===
                                            thread.last_message_sender_id
                                        );
                                        return (
                                          sender?.first_name +
                                            ": " +
                                            thread.last_message ||
                                          "Unknown User"
                                        );
                                      })()}
                                </p>
                                <p className="sm:ml-auto">
                                  {DateUtils.formatRelativeTimeShort(
                                    String(thread.last_message_time)
                                  )}
                                </p>
                              </div>
                            ))}
                          {thread.type === "client" && client && (
                            <div className="xl:hidden mt-2">
                              <p className="text-xs text-gray-500 truncate">
                                <span className="font-bold">Re:</span>{" "}
                                {`${client.first_name} ${client.last_name}`
                                  .length > 15
                                  ? `${client.first_name} ${client.last_name}`.substring(
                                      0,
                                      15
                                    ) + "..."
                                  : `${client.first_name} ${client.last_name}`}
                              </p>
                            </div>
                          )}
                          {thread.type === "broadcast" && (
                            <div className="xl:hidden mt-2">
                              <p className="text-xs text-primaryColor font-semibold">
                                Broadcast
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
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
