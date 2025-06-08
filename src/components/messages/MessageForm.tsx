import React, { useState } from "react";
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
  const { updateSelectedThread, updateCurrentThreadMessages } =
    useMessagesContext();
  const params = useParams();
  const { socket } = useSocketContext();
  const [message, setMessage] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !socket || !userData?.id) return;
    onSendMessage(message.trim());
    setMessage("");

    updateSelectedThread(
      params.threadId as string,
      String(userData.id),
      message.trim()
    );

    updateCurrentThreadMessages(
      message.trim(),
      params.threadId as string,
      String(userData.id)
    );

    socket.emit("sendMessage", {
      content: message.trim(),
      threadId: params.threadId,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 p-3 sm:p-4 border-y">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
        className="flex-1 px-3 sm:px-4 py-2 text-sm sm:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
