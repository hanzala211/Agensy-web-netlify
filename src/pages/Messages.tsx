import React, { useEffect, useState } from "react";
import type { AddThreadFormData, Thread } from "@agensy/types";
import { AddThreadModal, ThreadList } from "@agensy/components";
import { ICONS, ROUTES } from "@agensy/constants";
import { useAuthContext, useMessagesContext } from "@agensy/context";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

export const Messages: React.FC = () => {
  const params = useParams();
  const { userData } = useAuthContext();
  const {
    showThreadList,
    setShowThreadList,
    threads,
    setPendingThreadData,
    existingThreadData,
    clearExistingThreadData,
    navigateToExistingThread,
    setCurrentThreadMessages,
    setSelectedThread,
    selectedThread,
  } = useMessagesContext();
  const [isAddThreadModalOpen, setIsAddThreadModalOpen] =
    useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (window.innerWidth < 1024 && params.threadId) {
      setShowThreadList(false);
    }
  }, [params.threadId, setShowThreadList]);

  useEffect(() => {
    if (existingThreadData) {
      navigateToExistingThread(existingThreadData.threadId, navigate);
      clearExistingThreadData();
    }
  }, [existingThreadData]);

  useEffect(() => {
    if (!params.threadId) {
      setSelectedThread(null);
      setCurrentThreadMessages([]);
    }
  }, [params.threadId]);

  const handleAddThread = (data: AddThreadFormData) => {
    const threadId = uuidv4();

    setCurrentThreadMessages([]);
    setSelectedThread(null);

    setPendingThreadData({
      id: threadId,
      type: data.type as "general" | "client",
      participants_ids: [userData?.id as string, data.participant_id],
      client_id: data.client_id,
    });

    setIsAddThreadModalOpen(false);
    navigate(`${ROUTES.messages}/${threadId}`);
  };

  const handleThreadClick = (thread: Thread) => {
    navigate(`${ROUTES.messages}/${thread.id}`);
  };

  return (
    <React.Fragment>
      <div className="h-[calc(100vh-60px)] md:h-screen flex flex-col bg-gray-50">
        <div className="flex flex-1 overflow-hidden">
          <div
            className={`
            ${
              showThreadList ? "flex" : "hidden"
            } w-full md:w-1/3 border-r border-gray-200 absolute md:relative inset-0 bg-white z-10 flex flex-col`}
          >
            <ThreadList
              selectedThreadId={params.threadId}
              onAddThread={() => setIsAddThreadModalOpen(true)}
              threads={threads}
              onThreadClick={handleThreadClick}
            />
          </div>

          <div className="flex-1 flex flex-col w-full md:w-2/3 bg-white">
            {selectedThread || params.threadId ? (
              <Outlet />
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                <div className="text-center p-4">
                  <ICONS.chat className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">Select a chat to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <AddThreadModal
        isOpen={isAddThreadModalOpen}
        onClose={() => setIsAddThreadModalOpen(false)}
        onSubmit={handleAddThread}
      />
    </React.Fragment>
  );
};

export default Messages;
