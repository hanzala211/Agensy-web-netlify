import React from "react";
import type { Thread } from "@agensy/types";
import { BorderedCard } from "../common/BorderedCard";
import { DateUtils, StringUtils } from "@agensy/utils";
import { AntdTag, CardSkeleton } from "@agensy/components";
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
  const { userData } = useAuthContext();
  const {
    isThreadsLoading,
    setThreads,
    setSelectedThread,
    setShowThreadList,
    setCurrentThreadMessages,
  } = useMessagesContext();

  const handleThreadClick = (thread: Thread) => {
    onThreadClick(thread);
    setSelectedThread(thread);
    setCurrentThreadMessages(thread.messages || []);
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
        <div className="flex justify-between items-center p-3 sm:p-4 border-b">
          <h2 className="text-lg sm:text-xl font-semibold">Messaging</h2>
          <button
            onClick={onAddThread}
            className="w-12 h-12 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <ICONS.plus />
          </button>
        </div>
        <div className="h-[100dvh] max-h-[calc(100dvh-140px)] md:max-h-[100dvh] overflow-y-auto">
          <div className="flex flex-col gap-2 p-3 sm:p-4">
            {isThreadsLoading ? (
              <div className="h-full flex flex-col gap-5">
                <CardSkeleton />
                <CardSkeleton />
                <CardSkeleton />
                <CardSkeleton />
              </div>
            ) : (
              threads?.map((thread: Thread) => {
                const user = thread?.participants?.find(
                  (participant) => participant.id !== userData?.id
                );
                return (
                  <BorderedCard
                    key={thread.id}
                    className={`cursor-pointer relative transition-colors p-3 sm:p-4  ${
                      selectedThreadId === thread.id
                        ? "!bg-gradient-to-r !from-blue-100 !to-blue-100 border-2"
                        : ""
                    }`}
                    onClick={() => handleThreadClick(thread)}
                  >
                    <div className="flex gap-2 sm:gap-3 items-start w-full">
                      <div className="flex gap-2 sm:gap-3 items-center w-full">
                        <div className="flex-shrink-0">
                          {user?.avatar ? (
                            <img
                              src={user?.avatar}
                              alt={`${user?.first_name} ${user?.last_name}`}
                              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primaryColor to-basicBlue text-white flex items-center justify-center text-sm font-medium shadow-sm">
                              {(user?.first_name?.[0]?.toUpperCase() || "") +
                                (user?.last_name?.[0]?.toUpperCase() || "")}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="grid 2xl:grid-cols-[1.8fr_1.3fr] xl:grid-cols-[1fr_2fr] lg:grid-cols-[1fr_1fr] grid-cols-[1fr_2fr] items-start sm:items-center">
                            <h4 className="font-medium text-sm sm:text-base md:max-w-[300px] 2xl:max-w-xs max-w-[10rem] text-[14px] line-clamp-4">
                              {user
                                ? `${user.first_name} ${user.last_name}`
                                : "Unknown User"}
                            </h4>
                            {thread?.has_unread_messages && (
                              <div className="w-2 h-2 rounded-full bg-red-500" />
                            )}
                          </div>
                          {thread.last_message && (
                            <div className="flex justify-between w-full items-baseline gap-2 sm:text-sm text-gray-600 text-xs">
                              <p className="max-w-sm truncate mt-0.5 sm:mt-1">
                                {thread.last_message_sender_id === userData?.id
                                  ? "You: " + thread.last_message
                                  : thread.participants?.find(
                                      (p) =>
                                        p.id === thread.last_message_sender_id
                                    )?.first_name +
                                    ": " +
                                    thread.last_message}
                              </p>
                              <p>
                                {DateUtils.formatRelativeTime(
                                  String(thread.last_message_time)
                                )}
                              </p>
                            </div>
                          )}
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
