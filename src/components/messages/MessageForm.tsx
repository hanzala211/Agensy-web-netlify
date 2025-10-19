import React, { useState, useEffect, useRef } from "react";
import { PrimaryButton } from "../common/PrimaryButton";
import {
  useAuthContext,
  useMessagesContext,
  useSocketContext,
} from "@agensy/context";
import { useParams } from "react-router-dom";

interface MessageFormProps {
  onSendMessage: (content: string) => void;
  isLoading?: boolean;
}

export const MessageForm: React.FC<MessageFormProps> = ({
  onSendMessage,
  isLoading,
}) => {
  const { userData } = useAuthContext();
  const {
    updateSelectedThread,
    updateCurrentThreadMessages,
    updateThreads,
    updateThreadsSorting,
    pendingThreadData,
    clearPendingThreadData,
    emitTypingStart,
    emitTypingStop,
  } = useMessagesContext();
  const params = useParams();
  const { socket } = useSocketContext();
  const [message, setMessage] = useState<string>("");
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasEmittedTypingRef = useRef(false);

  const handleTypingStart = () => {
    if (!hasEmittedTypingRef.current && (params.threadId as string)) {
      emitTypingStart(params.threadId as string);
      hasEmittedTypingRef.current = true;
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      handleTypingStop();
    }, 2000); // Stop typing after 2 seconds of inactivity
  };

  const handleTypingStop = () => {
    if (hasEmittedTypingRef.current && (params.threadId as string)) {
      emitTypingStop(params.threadId as string);
      hasEmittedTypingRef.current = false;
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMessage(value);

    if (value.trim()) {
      handleTypingStart();
    } else {
      handleTypingStop();
    }
  };

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (hasEmittedTypingRef.current) {
        handleTypingStop();
      }
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !socket || !userData?.id) return;

    handleTypingStop();

    onSendMessage(message.trim());
    setMessage("");

    if (pendingThreadData && pendingThreadData.id === params.threadId) {
      console.log("Sending message in new thread", pendingThreadData);

      updateCurrentThreadMessages(
        message.trim(),
        params.threadId as string,
        String(userData.id)
      );

      socket.emit("sendMessage", {
        id: pendingThreadData.id ? pendingThreadData.id : params.threadId,
        sender_id: userData.id,
        message: message.trim(),
        participants_ids: pendingThreadData.participants_ids,
        client_id: pendingThreadData.client_id,
        type: pendingThreadData.type,
      });

      clearPendingThreadData();
    } else {
      console.log("Sending message in old thread", params.threadId);
      socket.emit("sendMessage", {
        message: message.trim(),
        id: params.threadId as string,
        sender_id: userData.id,
      });

      updateSelectedThread(
        params.threadId as string,
        String(userData.id),
        message.trim()
      );

      updateThreads(
        params.threadId as string,
        String(userData.id),
        message.trim()
      );

      updateCurrentThreadMessages(
        message.trim(),
        params.threadId as string,
        String(userData.id)
      );

      updateThreadsSorting();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 p-3 sm:p-4 border-y">
      <input
        type="text"
        value={message}
        onChange={handleInputChange}
        placeholder="Type a message..."
        className="flex-1 px-3 sm:px-4 py-2 text-sm sm:text-base !bg-lightGray border-[1px] border-mediumGray rounded-xl focus:outline-none focus-within:border-basicBlue focus-within:shadow-sm focus-within:shadow-blue-200 placeholder:!text-slateGrey transition-all duration-200"
      />
      <PrimaryButton
        type="submit"
        disabled={!message.trim() || isLoading || !socket}
        className="px-4 sm:px-6 !w-fit text-sm sm:text-base"
      >
        Send
      </PrimaryButton>
    </form>
  );
};

export default MessageForm;
