import React from "react";
import type { Message, Thread } from "@agensy/types";
import { ICONS } from "@agensy/constants";
import { Dropdown } from "antd";
import { DateUtils } from "@agensy/utils";
import dayjs from "dayjs";

interface MessageReadStatusProps {
  message: Message;
  thread: Thread;
  currentUserId: string;
}

export const MessageReadStatus: React.FC<MessageReadStatusProps> = ({
  message,
  thread,
  currentUserId,
}) => {
  const participantsCount = thread.participants_ids?.length || 0;
  const readByCount = (message.read_by || []).length;
  const allRead = readByCount >= participantsCount;

  if (message.sender_id !== currentUserId) {
    return null;
  }

  const allParticipants = [
    ...(thread.participants || []),
    ...(thread.left_participants || []),
  ];

  const currentParticipantIds = (thread.participants_ids || []).filter(
    (id) => id !== message.sender_id
  );

  const leftParticipantIds = (thread.left_participants_ids || []).filter(
    (id) => {
      const hasRead = (message.read_by || []).some((r) => r.user_id === id);
      return hasRead;
    }
  );

  const allParticipantIds = [...currentParticipantIds, ...leftParticipantIds];

  const readStatuses = allParticipantIds
    .map((participantId) => {
      const user = allParticipants.find((u) => u.id === participantId);
      const readBy = (message.read_by || []).find(
        (r) => r.user_id === participantId
      );

      const isLeftParticipant =
        thread.left_participants_ids?.includes(participantId);

      return {
        userId: participantId,
        user: user,
        hasRead: !!readBy,
        readAt: readBy?.read_at,
        isLeft: isLeftParticipant,
      };
    })
    .sort((a, b) => {
      if (a.hasRead && !b.hasRead) return -1;
      if (!a.hasRead && b.hasRead) return 1;

      if (a.hasRead && b.hasRead) {
        if (!a.readAt && !b.readAt) return 0;
        if (!a.readAt) return 1;
        if (!b.readAt) return -1;
        return dayjs(b.readAt).valueOf() - dayjs(a.readAt).valueOf();
      }

      return 0;
    });

  const dropdownContent = (
    <div className="bg-white border border-gray-200 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] p-2 min-w-[250px] max-w-[280px] backdrop-blur-sm">
      <div className="space-y-3 max-h-[230px] overflow-y-auto">
        {readStatuses.map((status) => (
          <div
            key={status.userId}
            className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-all duration-200 border border-transparent hover:border-gray-100"
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="flex flex-col min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className="text-[12px] font-medium text-darkGray truncate">
                      {status.user
                        ? `${status.user.first_name} ${status.user.last_name}`
                        : "Unknown User"}
                    </span>
                    {status.isLeft && (
                      <span className="text-[9px] px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded font-medium flex-shrink-0">
                        Left
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                    {status.hasRead ? (
                      <div className="flex items-center gap-1 px-2 py-1 bg-green-50 rounded-full">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-[10px] font-medium text-green-600">
                          Read
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 px-2 py-1 bg-gray-50 rounded-full">
                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                        <span className="text-[10px] text-slateGrey">
                          Delivered
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {status.user?.is_online && !status.isLeft && (
                    <span className="text-xs text-green-600 font-medium">
                      Online
                    </span>
                  )}
                  {status.hasRead && (
                    <span className="text-xs text-slateGrey">
                      {status.readAt
                        ? DateUtils.formatRelativeTimeShort(status.readAt)
                        : "Just now"}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    // @ts-expect-error - Dropdown is not typed
    <Dropdown
      overlay={dropdownContent}
      trigger={["click"]}
      placement="topRight"
    >
      <div
        className="flex items-center cursor-pointer rounded-lg p-1 transition-colors duration-200"
        title={allRead ? "Read by all" : "Delivered"}
      >
        <div className="flex">
          <ICONS.doubleCheck
            className={`sm:w-4 sm:h-4 w-3 h-3 ${
              allRead ? "text-green-400" : "text-gray-100"
            }`}
          />
        </div>
      </div>
    </Dropdown>
  );
};

export default MessageReadStatus;
