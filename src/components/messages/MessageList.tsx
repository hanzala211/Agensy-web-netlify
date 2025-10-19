import React, { useEffect, useMemo, useRef } from "react";
import type { Message } from "@agensy/types";
import { DateUtils } from "@agensy/utils";
import dayjs from "dayjs";
import { DATE_FOMRAT, ICONS } from "@agensy/constants";
import { useMessagesContext, useAuthContext } from "@agensy/context";
import { MessageReadStatus } from "@agensy/components";
import { Dropdown } from "antd";

interface MessageListProps {
  currentUserId: string;
}

interface MessagesByDate {
  [key: string]: Message[];
}

export const MessageList: React.FC<MessageListProps> = ({ currentUserId }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { selectedThread, currentThreadMessages, markMessageAsRead } =
    useMessagesContext();
  const { accessUsers } = useAuthContext();
  const messageRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const readTimeouts = useRef<Map<string, NodeJS.Timeout>>(new Map());

  useEffect(() => {
    if (scrollRef.current && selectedThread?.messages?.length) {
      scrollRef.current.scrollIntoView({ behavior: "instant" });
    }
  }, [selectedThread]);

  useEffect(() => {
    if (scrollRef.current && currentThreadMessages.length > 0) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentThreadMessages.length]);

  const messagesByDate = useMemo(() => {
    const sortedMessages = [...currentThreadMessages].sort(
      (a, b) => dayjs(a.createdAt).valueOf() - dayjs(b.createdAt).valueOf()
    );

    return sortedMessages.reduce((acc: MessagesByDate, message) => {
      const date = dayjs(message.createdAt).format(DATE_FOMRAT);
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(message);
      return acc;
    }, {});
  }, [currentThreadMessages]);

  const sortedDates = useMemo(() => {
    return Object.keys(messagesByDate).sort(
      (a, b) => dayjs(a).valueOf() - dayjs(b).valueOf()
    );
  }, [messagesByDate]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const messageId = entry.target.getAttribute("data-message-id");
          if (!messageId || !selectedThread) return;

          if (entry.isIntersecting) {
            const timeout = setTimeout(() => {
              const message = currentThreadMessages.find(
                (m) => m.id === messageId
              );
              if (message && message.sender_id !== currentUserId) {
                const isAlreadyRead = message.read_by?.some(
                  (r) => r.user_id === currentUserId
                );

                const isBackendId =
                  messageId &&
                  messageId.length > 10 &&
                  !messageId.match(/^\d+$/); // Not just numbers (Date.now())

                if (!isAlreadyRead && isBackendId) {
                  if (
                    messageId &&
                    messageId !== "null" &&
                    messageId !== "undefined"
                  ) {
                    markMessageAsRead(messageId, selectedThread.id as string);
                  }
                }
              }
            }, 1000);

            readTimeouts.current.set(messageId, timeout);
          } else {
            const timeout = readTimeouts.current.get(messageId);
            if (timeout) {
              clearTimeout(timeout);
              readTimeouts.current.delete(messageId);
            }
          }
        });
      },
      {
        threshold: 0.1, // Lower threshold - only 10% needs to be visible
        rootMargin: "0px 0px -50px 0px", // Add margin to trigger earlier
      }
    );

    messageRefs.current.forEach((element) => {
      observer.observe(element);
    });

    return () => {
      observer.disconnect();
      const timeouts = readTimeouts.current;
      timeouts.forEach((timeout) => clearTimeout(timeout));
      timeouts.clear();
    };
  }, [currentThreadMessages, selectedThread, currentUserId, markMessageAsRead]);

  // Auto-mark last message as read when new messages are added
  useEffect(() => {
    if (currentThreadMessages.length > 0 && selectedThread) {
      const lastMessage =
        currentThreadMessages[currentThreadMessages.length - 1];

      if (lastMessage && lastMessage.sender_id !== currentUserId) {
        const isAlreadyRead = lastMessage.read_by?.some(
          (r: { user_id: string }) => r.user_id === currentUserId
        );

        const isBackendId =
          lastMessage.id &&
          (lastMessage.id as string).length > 10 &&
          !(lastMessage.id as string).match(/^\d+$/);

        if (!isAlreadyRead && isBackendId) {
          if (
            lastMessage.id &&
            lastMessage.id !== "null" &&
            lastMessage.id !== "undefined"
          ) {
            markMessageAsRead(
              lastMessage.id as string,
              selectedThread.id as string
            );
          }
        }
      }
    }
  }, [currentThreadMessages.length, selectedThread, currentUserId]);

  const handleDoubleClick = (message: Message) => {
    if (message.sender_id !== currentUserId && selectedThread) {
      const isBackendId =
        message.id &&
        (message.id as string).length > 10 &&
        !(message.id as string).match(/^\d+$/);

      if (
        isBackendId &&
        message.id &&
        message.id !== "null" &&
        message.id !== "undefined"
      ) {
        markMessageAsRead(message.id as string, selectedThread.id as string);
      }
    }
  };

  const dropdownContent = (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[120px]">
      <div
        className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 cursor-pointer text-red-600"
        onClick={() => {
          // TODO: Add delete functionality
          console.log("Delete message clicked");
        }}
      >
        <ICONS.delete className="w-4 h-4" />
        <span className="text-sm">Delete</span>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex flex-col gap-3 pl-5 pr-1 sm:gap-4 sm:p-4">
        {sortedDates.map((date) => (
          <React.Fragment key={date}>
            <div className="flex justify-center">
              <div className="bg-lightGray text-slateGrey text-xs px-3 py-1 rounded-full shadow-sm">
                {DateUtils.formatSimpleDate(date)}
              </div>
            </div>
            {messagesByDate[date].map((message) => {
              const isSender = message.sender_id === currentUserId;
              const sender = accessUsers?.find(
                (user) => user.id === message.sender_id
              );

              return (
                <div
                  key={message.id}
                  className={`flex group ${
                    isSender ? "justify-end" : "justify-start"
                  }`}
                  ref={(el) => {
                    if (el) {
                      messageRefs.current.set(message.id as string, el);
                    }
                  }}
                  data-message-id={message.id}
                >
                  {isSender && selectedThread && (
                    <div className="flex items-end mr-1">
                      {/* @ts-expect-error - Dropdown is not typed */}
                      <Dropdown
                        overlay={dropdownContent}
                        trigger={["click"]}
                        placement="bottomLeft"
                      >
                        <div className="flex items-center cursor-pointer hover:bg-gray-100 rounded-lg p-1 transition-colors duration-200 opacity-0 group-hover:opacity-100">
                          <ICONS.moreVertical className="w-4 h-4 text-gray-500" />
                        </div>
                      </Dropdown>
                    </div>
                  )}
                  <div
                    className={`relative max-w-[85%] sm:max-w-[70%] rounded-lg ${
                      isSender
                        ? "bg-primaryColor text-white rounded-tr-none shadow-[0_4px_12px_rgba(42,107,184,0.2)]"
                        : "bg-basicWhite text-basicBlack border-[1px] border-gray-200 rounded-tl-none ml-5 shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
                    } px-2.5 py-2 sm:px-3 sm:py-2`}
                    onDoubleClick={() => handleDoubleClick(message)}
                  >
                    <div className="flex flex-col gap-1">
                      <p className="text-sm break-words pr-12 sm:pr-14">
                        {message.message}
                      </p>
                      <span className="text-[10px] sm:text-[11px] opacity-70 absolute bottom-1 right-2 sm:bottom-1.5 sm:right-2.5">
                        {DateUtils.formatToTime(String(message.createdAt))}
                      </span>
                    </div>
                    {!isSender &&
                      sender &&
                      sender.first_name &&
                      sender.last_name && (
                        <div className="absolute -top-1 -left-7 w-6 h-6 rounded-full border-2 border-white shadow-sm">
                          {sender.avatar ? (
                            <img
                              src={sender.avatar}
                              alt={`${sender.first_name} ${sender.last_name}`}
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full rounded-full bg-primaryColor text-white flex items-center justify-center text-[9px] font-medium shadow-sm">
                              {(sender.first_name[0]?.toUpperCase() || "") +
                                (sender.last_name[0]?.toUpperCase() || "")}
                            </div>
                          )}
                        </div>
                      )}
                  </div>

                  {isSender && selectedThread && (
                    <div className="flex items-end gap-1">
                      <MessageReadStatus
                        message={message}
                        thread={selectedThread}
                        currentUserId={currentUserId}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </React.Fragment>
        ))}
        <div ref={scrollRef} />
      </div>
    </div>
  );
};

export default MessageList;
