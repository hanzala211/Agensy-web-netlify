import React, { useState } from "react";
import {
  Card,
  EmptyStateCard,
  AddThreadModal,
  BorderedCard,
} from "@agensy/components";
import { ICONS, ROUTES } from "@agensy/constants";
import { useNavigate } from "react-router-dom";
import { DateUtils } from "@agensy/utils";
import { useAuthContext, useMessagesContext } from "@agensy/context";
import { v4 as uuidv4 } from "uuid";
import type { AddThreadFormData, IUser } from "@agensy/types";

interface RecentMessagesCardProps {
  messages?: Array<{
    id: string;
    title: string | null;
    type: "client" | "general" | "broadcast";
    client_id: string | null;
    client?: {
      id: string;
      first_name: string;
      last_name: string;
    } | null;
    participants?: Array<{
      id: string;
      first_name: string;
      last_name: string;
      avatar?: string | null;
      email?: string;
    }>;
    unread_count: number;
    last_message: string | null;
    last_message_time: string;
  }>;
}

export const RecentMessagesCard: React.FC<RecentMessagesCardProps> = ({
  messages = [],
}) => {
  const navigate = useNavigate();
  const [isAddThreadModalOpen, setIsAddThreadModalOpen] =
    useState<boolean>(false);
  const { userData, accessUsers } = useAuthContext();
  const { setPendingThreadData, setCurrentThreadMessages, setSelectedThread } =
    useMessagesContext();

  const getSenderName = (thread: (typeof messages)[0]): string => {
    let displayName: string;

    // Broadcast threads
    if (thread.type === "broadcast") {
      displayName = thread.title || "System Announcement";
    } else if (thread.title) {
      // Thread has a name
      displayName = thread.title;
    } else if (thread.participants && thread.participants.length > 2) {
      // Group thread: show participant names (excluding current user)
      const participantNames = thread.participants
        ?.filter((participant) => participant.id !== userData?.id)
        .map((participant) => participant.first_name)
        .join(", ")
        .concat(", You");

      displayName = participantNames || "Unknown User";
    } else {
      // One-to-one thread: show the other user's name
      const otherUser = thread.participants?.find(
        (participant) => participant.id !== userData?.id
      );

      if (otherUser) {
        displayName = `${otherUser.first_name} ${otherUser.last_name}`;
      } else if (thread.client) {
        // Fallback to client name if no other user found
        displayName = `${thread.client.first_name} ${thread.client.last_name}`;
      } else {
        displayName = "Unknown User";
      }
    }

    // Truncate to maximum 15 characters like ThreadList
    return displayName && displayName.length > 15
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
            {messages.slice(0, 3).map((thread) => (
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
                      {thread.unread_count > 0 && thread.unread_count && (
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
                          {DateUtils.formatRelativeTimeShort(
                            thread.last_message_time as string
                          )}
                        </span>
                      </div>
                      {(thread.type === "client" && thread.client) ||
                      thread.type === "broadcast" ||
                      (thread.participants &&
                        thread.participants.length > 2) ? (
                        <div className="flex items-center gap-2">
                          <ICONS.group
                            className="text-gray-400 flex-shrink-0"
                            size={14}
                          />
                          <span className="truncate">
                            {thread.type === "client" && thread.client ? (
                              <>
                                <span className="font-bold">Re:</span>{" "}
                                {`${thread.client.first_name} ${thread.client.last_name}`
                                  .length > 15
                                  ? `${thread.client.first_name} ${thread.client.last_name}`.substring(
                                      0,
                                      15
                                    ) + "..."
                                  : `${thread.client.first_name} ${thread.client.last_name}`}
                                (Group)
                              </>
                            ) : thread.type === "broadcast" ? (
                              <span className="text-primaryColor font-semibold">
                                Broadcast
                              </span>
                            ) : thread.participants &&
                              thread.participants.length > 2 ? (
                              "General (Group)"
                            ) : (
                              ""
                            )}
                          </span>
                        </div>
                      ) : null}
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
