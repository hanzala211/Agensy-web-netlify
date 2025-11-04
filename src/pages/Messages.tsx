import React, { useEffect, useState } from "react";
import type { AddThreadFormData, IUser, Thread } from "@agensy/types";
import {
  AddThreadModal,
  HEADER_HEIGHT_PX,
  ThreadList,
} from "@agensy/components";
import { ICONS, ROUTES } from "@agensy/constants";
import {
  useAuthContext,
  useHeaderContext,
  useMessagesContext,
} from "@agensy/context";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

export const Messages: React.FC = () => {
  const params = useParams();
  const { setHeaderConfig } = useHeaderContext();
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
  const [isNavigating, setIsNavigating] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    setHeaderConfig({
      showButton: true,
      title: "Messaging",
      showBackButton: false,
      buttonText: "New Message",
      buttonAriaLabel: "Start new chat",
      onButtonClick: () => setIsAddThreadModalOpen(true),
    });
    return () => {
      setHeaderConfig({
        showButton: false,
        title: "",
        showBackButton: false,
        buttonText: "",
        buttonAriaLabel: "",
      });
      setPendingThreadData(null);
      setSelectedThread(null);
      setCurrentThreadMessages([]);
    };
  }, []);

  useEffect(() => {
    if (window.innerWidth < 1024 && params.threadId) {
      setShowThreadList(false);
    }
  }, [params.threadId, setShowThreadList]);

  useEffect(() => {
    if (!params.threadId) {
      setSelectedThread(null);
      setCurrentThreadMessages([]);
    }
    // Reset navigation state when params change
    setIsNavigating(false);
  }, [params.threadId]);

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

  const handleThreadClick = (thread: Thread) => {
    setIsNavigating(true);
    navigate(`${ROUTES.messages}/${thread.id}`);
  };

  return (
    <React.Fragment>
      <div className="h-[calc(100vh-72px)] flex flex-col bg-gray-50">
        <div className="flex flex-1 overflow-hidden">
          <div
            style={{
              marginTop: `${HEADER_HEIGHT_PX}px`,
            }}
            className={`
            ${
              showThreadList ? "flex" : "hidden"
            } w-full md:w-1/3 border-r md:!mt-0 !mt-0 border-gray-200 absolute md:relative inset-0 bg-white z-10 flex flex-col`}
          >
            <ThreadList
              selectedThreadId={params.threadId}
              onAddThread={() => setIsAddThreadModalOpen(true)}
              className="pt-[calc(60px+1.25rem)]"
              threads={threads}
              onThreadClick={handleThreadClick}
              showHeader={false}
            />
          </div>

          <div className="flex flex-col w-full md:w-2/3 bg-white">
            {params.threadId || isNavigating ? (
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
        onExistingThreadFound={handleExistingThreadFound}
        showBroadCastOption={true}
      />
    </React.Fragment>
  );
};

export default Messages;
