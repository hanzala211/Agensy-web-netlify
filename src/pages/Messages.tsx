import React, { useEffect, useState } from "react";
import type { AddThreadFormData, Thread } from "@agensy/types";
import { AddThreadModal, ThreadList } from "@agensy/components";
import { ICONS, ROUTES } from "@agensy/constants";
import { useMessagesContext } from "@agensy/context";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { useCreateThread } from "@agensy/api";
import { toast } from "@agensy/utils";

export const Messages: React.FC = () => {
  const createThreadMutation = useCreateThread();
  const params = useParams();
  const { showThreadList, setShowThreadList, setThreads, threads } =
    useMessagesContext();
  const [isAddThreadModalOpen, setIsAddThreadModalOpen] =
    useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (window.innerWidth < 1024 && params.threadId) {
      setShowThreadList(false);
    }
  }, [window.innerWidth, params.threadId]);

  useEffect(() => {
    if (createThreadMutation.status === "success") {
      toast.success("Thread created successfully");
      setIsAddThreadModalOpen(false);
      setThreads((prev) => [
        ...(prev || []),
        createThreadMutation.data as Thread,
      ]);
    } else if (createThreadMutation.status === "error") {
      toast.error("Failed to create thread");
    }
  }, [createThreadMutation.status]);

  const handleAddThread = (data: AddThreadFormData) => {
    const postData = {
      type: data.type,
      participant_id: data.participant_id,
      client_id: data.type === "client" ? data.client_id : null,
      sub_type: "one-to-one",
    };
    createThreadMutation.mutate(postData);
  };

  const handleThreadClick = (thread: Thread) => {
    navigate(`${ROUTES.messages}/${thread.id}`);
  };

  return (
    <React.Fragment>
      <div className="flex h-screen relative bg-white">
        <div
          className={`
          ${
            showThreadList ? "flex" : "hidden"
          } w-full lg:w-1/3 border-r absolute lg:relative inset-0 bg-white z-10`}
        >
          <ThreadList
            selectedThreadId={params.threadId}
            onAddThread={() => setIsAddThreadModalOpen(true)}
            threads={threads}
            onThreadClick={handleThreadClick}
          />
        </div>

        <div className="flex-1 flex flex-col w-full lg:w-2/3">
          {params.threadId ? (
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
      <AddThreadModal
        isOpen={isAddThreadModalOpen}
        onClose={() => setIsAddThreadModalOpen(false)}
        onSubmit={handleAddThread}
        isLoading={createThreadMutation.isPending}
      />
    </React.Fragment>
  );
};

export default Messages;
