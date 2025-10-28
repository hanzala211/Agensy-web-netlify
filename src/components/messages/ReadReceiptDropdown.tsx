import React from "react";
import type { Message, Thread } from "@agensy/types";
import { DateUtils } from "@agensy/utils";
import { useAuthContext } from "@agensy/context";
import { Dropdown } from "antd";

interface ReadReceiptDropdownProps {
  message: Message;
  thread: Thread;
  onClose: () => void;
}

export const ReadReceiptDropdown: React.FC<ReadReceiptDropdownProps> = ({
  message,
  thread,
  onClose,
}) => {
  const { accessUsers } = useAuthContext();

  const participants =
    thread.participants_ids?.filter((id) => id !== message.sender_id) || [];
  const readStatuses = participants.map((participantId) => {
    const user = accessUsers?.find((u) => u.id === participantId);
    const readBy = message.read_by?.find((r) => r.user_id === participantId);

    return {
      userId: participantId,
      user: user,
      hasRead: !!readBy,
      readAt: readBy?.read_at,
    };
  });

  const dropdownContent = (
    <div className="bg-white border border-gray-200 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] p-4 min-w-[320px] max-w-[360px] backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
        <h4 className="text-sm font-semibold text-darkGray flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          Read by
        </h4>
        <span className="text-xs text-slateGrey">
          {readStatuses.length} recipient{readStatuses.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="space-y-3 max-h-[300px] overflow-y-auto">
        {readStatuses.map((status) => (
          <div
            key={status.userId}
            className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-all duration-200 border border-transparent hover:border-gray-100"
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primaryColor to-basicBlue flex items-center justify-center shadow-sm flex-shrink-0">
                {status.user?.avatar ? (
                  <img
                    src={status.user.avatar}
                    alt={`${status.user.first_name} ${status.user.last_name}`}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-sm font-semibold text-white">
                    {(status.user?.first_name?.[0] || "") +
                      (status.user?.last_name?.[0] || "")}
                  </span>
                )}
              </div>

              <div className="flex flex-col min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-darkGray truncate">
                    {status.user
                      ? `${status.user.first_name} ${status.user.last_name}`
                      : "Unknown User"}
                  </span>
                  <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                    {status.hasRead ? (
                      <div className="flex items-center gap-1 px-2 py-1 bg-green-50 rounded-full">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-xs font-medium text-green-600">
                          Read
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 px-2 py-1 bg-gray-50 rounded-full">
                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                        <span className="text-xs text-slateGrey">
                          Delivered
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {status.user?.is_online && (
                    <span className="text-xs text-green-600 font-medium">
                      Online
                    </span>
                  )}
                  {status.hasRead && (
                    <span className="text-xs text-slateGrey">
                      {status.readAt
                        ? DateUtils.formatRelativeTime(status.readAt)
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
      onVisibleChange={(visible: boolean) => {
        if (!visible) {
          onClose();
        }
      }}
    >
      <div />
    </Dropdown>
  );
};

export default ReadReceiptDropdown;
