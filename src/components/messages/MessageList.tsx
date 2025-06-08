import React, { useEffect, useMemo, useRef } from "react";
import type { Message } from "@agensy/types";
import { DateUtils } from "@agensy/utils";
import dayjs from "dayjs";
import { DATE_FOMRAT } from "@agensy/constants";
import { useMessagesContext } from "@agensy/context";

interface MessageListProps {
  currentUserId: string;
}

interface MessagesByDate {
  [key: string]: Message[];
}

export const MessageList: React.FC<MessageListProps> = ({ currentUserId }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { selectedThread, currentThreadMessages } = useMessagesContext();

  useEffect(() => {
    if (
      scrollRef.current &&
      selectedThread?.messages?.length &&
      window.innerWidth > 768
    ) {
      scrollRef.current.scrollIntoView({ behavior: "instant" });
    }
  }, [selectedThread]);

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

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex flex-col gap-3 p-3 sm:gap-4 sm:p-4">
        {sortedDates.map((date) => (
          <React.Fragment key={date}>
            <div className="flex justify-center">
              <div className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">
                {DateUtils.formatSimpleDate(date)}
              </div>
            </div>
            {messagesByDate[date].map((message) => {
              const isSender = message.sender_id === currentUserId;
              return (
                <div
                  key={message.id}
                  className={`flex ${
                    isSender ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`relative max-w-[85%] sm:max-w-[70%] rounded-lg ${
                      isSender
                        ? "bg-primaryColor text-white rounded-tr-none"
                        : "bg-basicWhite text-basicBlack border-[1px] border-gray-200 rounded-tl-none"
                    } px-2.5 py-2 sm:px-3 sm:py-2`}
                  >
                    <div className="flex flex-col gap-1">
                      <p className="text-sm break-words pr-12 sm:pr-14">
                        {message.content}
                      </p>
                      <span className="text-[10px] sm:text-[11px] opacity-70 absolute bottom-1 right-2 sm:bottom-1.5 sm:right-2.5">
                        {DateUtils.formatToTime(String(message.createdAt))}
                      </span>
                    </div>
                  </div>
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
