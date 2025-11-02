import React, { useState } from "react";
import {
  Card,
  EmptyStateCard,
  AddThreadModal,
  BorderedCard,
} from "@agensy/components";
import { ICONS, ROUTES, DASHBOARD_RECENT_MESSAGES } from "@agensy/constants";
import { useNavigate } from "react-router-dom";
import { DateUtils } from "@agensy/utils";
import { useAuthContext, useMessagesContext } from "@agensy/context";
import { v4 as uuidv4 } from "uuid";
import type { AddThreadFormData, IUser } from "@agensy/types";

export const RecentMessagesCard: React.FC = () => {
  const navigate = useNavigate();
  const [isAddThreadModalOpen, setIsAddThreadModalOpen] =
    useState<boolean>(false);
  const messages = DASHBOARD_RECENT_MESSAGES;
  const { userData, accessUsers } = useAuthContext();
  const { setPendingThreadData, setCurrentThreadMessages, setSelectedThread } =
    useMessagesContext();

  const formatTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffMins < 1) return "Just now";
    if (diffMins < 60)
      return `${diffMins} ${diffMins === 1 ? "minute" : "minutes"} ago`;
    if (diffHours < 24)
      return `${diffHours} ${diffHours === 1 ? "hour" : "hours"} ago`;
    return DateUtils.formatSimpleDate(date.toISOString());
  };

  const getSenderName = (thread: (typeof messages)[0]): string => {
    let displayName: string;
    if (thread.name) {
      displayName = thread.name;
    } else {
      displayName = "Private Message";
    }

    // Truncate to maximum 15 characters like ThreadList
    return displayName.length > 15
      ? displayName.substring(0, 15) + "..."
      : displayName;
  };

  const handleAddMessage = () => {
    setIsAddThreadModalOpen(true);
  };

  const handleAddThread = (data: AddThreadFormData) => {
    const threadId = uuidv4();

    setCurrentThreadMessages([]);
    setSelectedThread(null);

    // Handle broadcast type
    if (data.type === "broadcast") {
      setPendingThreadData({
        id: threadId,
        participants_ids: [userData?.id as string],
        type: "broadcast",
        name: data.name || "Agensy Broadcast",
        participants: [userData as IUser],
        created_by: userData?.id as string,
      });
    } else {
      // Handle regular thread creation
      setPendingThreadData({
        id: threadId,
        participants_ids: [
          userData?.id as string,
          ...(data.participant_ids || []),
        ],
        client_id: data.client_id,
        participants: data.participant_ids
          ?.sort((a, b) => (a || "").localeCompare(b || ""))
          .map((id) => accessUsers?.find((user) => user.id === id) as IUser),
        created_by: userData?.id as string,
      });
    }

    setIsAddThreadModalOpen(false);
    navigate(`${ROUTES.messages}/${threadId}`);
  };

  const handleExistingThreadFound = (threadId: string) => {
    setIsAddThreadModalOpen(false);
    navigate(`${ROUTES.messages}/${threadId}`);
  };

  return (
    <>
      <Card
        title="Recent Messages"
        buttonText={<ICONS.plus size={18} />}
        ariaLabel="Add message"
        onButtonClick={handleAddMessage}
        className="border-gray-300"
      >
        {messages.length > 0 ? (
          <div className="space-y-1.5">
            {messages.map((thread) => (
              <BorderedCard key={thread.id} className="!p-2">
                <div
                  className="cursor-pointer"
                  onClick={() => navigate(`${ROUTES.messages}/${thread.id}`)}
                >
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-semibold text-lg text-gray-800 truncate min-w-0 flex-1">
                        {getSenderName(thread)}
                      </h3>
                      {thread.has_unread_messages && thread.unread_count && (
                        <span className="bg-red-500 text-white text-xs font-medium rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5 flex-shrink-0">
                          {thread.unread_count}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col gap-1.5 text-sm text-gray-600">
                      <div className="flex items-center gap-2 min-w-0">
                        <ICONS.chat
                          className="text-gray-400 flex-shrink-0"
                          size={14}
                        />
                        <span className="truncate max-w-xs">
                          {thread.last_message || "No message"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ICONS.clockCircle
                          className="text-gray-400 flex-shrink-0"
                          size={14}
                        />
                        <span className="truncate">
                          {formatTimeAgo(
                            thread.last_message_time || thread.started_at
                          )}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ICONS.group
                          className="text-gray-400 flex-shrink-0"
                          size={14}
                        />
                        <span className="truncate">
                          {thread.type === "client"
                            ? "Client Thread"
                            : thread.name
                            ? "Broadcast"
                            : "General"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </BorderedCard>
            ))}
          </div>
        ) : (
          <EmptyStateCard
            label="messages"
            ICON={ICONS.chat}
            onClick={handleAddMessage}
          />
        )}
      </Card>
      <AddThreadModal
        isOpen={isAddThreadModalOpen}
        onClose={() => setIsAddThreadModalOpen(false)}
        onSubmit={handleAddThread}
        onExistingThreadFound={handleExistingThreadFound}
        showBroadCastOption={true}
      />
    </>
  );
};

export default RecentMessagesCard;
