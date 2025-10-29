import React, { useEffect, useMemo, useState } from "react";
import type { AddThreadFormData, IUser, Thread } from "@agensy/types";
import { AddThreadModal, ThreadList } from "@agensy/components";
import { ICONS, ROUTES } from "@agensy/constants";
import { useAuthContext, useMessagesContext } from "@agensy/context";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

export const ClientMessages: React.FC = () => {
  const params = useParams();
  const { userData, accessUsers } = useAuthContext();
  const {
    showThreadList,
    setShowThreadList,
    threads,
    setPendingThreadData,
    setCurrentThreadMessages,
    setSelectedThread,
  } = useMessagesContext();
  const [isAddThreadModalOpen, setIsAddThreadModalOpen] =
    useState<boolean>(false);
  const navigate = useNavigate();

  const clientThreads = useMemo(
    () =>
      threads
        ?.filter(
          (thread) =>
            thread.type === "client" && params.clientId === thread.client_id
        )
        .sort((a, b) => {
          return (
            new Date(String(b.last_message_time)).getTime() -
            new Date(String(a.last_message_time)).getTime()
          );
        }),
    [threads, params.clientId]
  );

  useEffect(() => {
    if (window.innerWidth < 1024 && params.threadId) {
      setShowThreadList(false);
    }
  }, [window.innerWidth, params.threadId]);

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
      participants_ids: [
        userData?.id as string,
        ...(data.participant_ids || []),
      ],
      client_id: data.client_id,
      participants: data.participant_ids?.map(
        (id) => accessUsers?.find((user) => user.id === id) as IUser
      ),
      created_by: userData?.id as string,
    });

    setIsAddThreadModalOpen(false);
    navigate(
      `/${ROUTES.clients}/${params.clientId}/${ROUTES.clientMessages}/${threadId}`
    );
  };

  const handleExistingThreadFound = (threadId: string) => {
    setIsAddThreadModalOpen(false);
    navigate(
      `/${ROUTES.clients}/${params.clientId}/${ROUTES.clientMessages}/${threadId}`
    );
  };

  const handleThreadClick = (thread: Thread) => {
    navigate(`${thread.id}`);
  };

  return (
    <div className="h-[calc(100vh-270px)] flex flex-col bg-gray-50 rounded-md overflow-hidden shadow-[0_0_15px_rgba(0,0,0,0.1)]">
      <div className="flex flex-1 overflow-hidden">
        <div
          className={`
          ${
            showThreadList ? "flex" : "hidden"
          } w-full lg:w-1/3 border-r border-gray-200 relative bg-white flex flex-col`}
        >
          <ThreadList
            onThreadClick={handleThreadClick}
            selectedThreadId={params.threadId}
            onAddThread={() => setIsAddThreadModalOpen(true)}
            threads={clientThreads}
          />
        </div>

        <div className="flex-1 flex flex-col w-full lg:w-2/3 bg-white">
          {params.threadId ? (
            <Outlet />
          ) : (
            <div
              className={`flex-1 flex items-center ${
                params.threadId ? "" : "lg:flex hidden"
              } justify-center text-gray-500`}
            >
              <div className="text-center p-4">
                <ICONS.chat className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">Select a chat to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <AddThreadModal
        showType={false}
        isOpen={isAddThreadModalOpen}
        onClose={() => setIsAddThreadModalOpen(false)}
        onSubmit={handleAddThread}
        onExistingThreadFound={handleExistingThreadFound}
      />
    </div>
  );
};

export default ClientMessages;
