import React, { useEffect, useMemo, useState } from "react";
import type { AddThreadFormData, Thread } from "@agensy/types";
import { AddThreadModal, ThreadList } from "@agensy/components";
import { ICONS } from "@agensy/constants";
import { useMessagesContext } from "@agensy/context";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { useCreateThread } from "@agensy/api";
import { toast } from "@agensy/utils";

export const ClientMessages: React.FC = () => {
  const createThreadMutation = useCreateThread();
  const params = useParams();
  const { showThreadList, setShowThreadList, setThreads, threads } =
    useMessagesContext();
  const [isAddThreadModalOpen, setIsAddThreadModalOpen] =
    useState<boolean>(false);
  const navigate = useNavigate();
  const clientThreads = useMemo(
    () =>
      threads?.filter(
        (thread) =>
          thread.type === "client" && params.clientId === thread.client_id
      ),
    [threads, params.clientId]
  );

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
    navigate(`${thread.id}`);
  };

  return (
    <div className="flex h-[calc(100vh-180px)] rounded-xl overflow-hidden border">
      <div
        className={`
        ${
          showThreadList ? "flex" : "hidden"
        } w-full lg:w-1/3 border-r   border-b relative inset-0 z-10`}
      >
        <ThreadList
          onThreadClick={handleThreadClick}
          selectedThreadId={params.threadId}
          onAddThread={() => setIsAddThreadModalOpen(true)}
          threads={clientThreads}
          showBadge={false}
        />
      </div>

      <div className="flex-1 flex flex-col w-full lg:w-2/3">
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

      <AddThreadModal
        showType={false}
        isOpen={isAddThreadModalOpen}
        onClose={() => setIsAddThreadModalOpen(false)}
        onSubmit={handleAddThread}
        isLoading={createThreadMutation.isPending}
      />
    </div>
  );
};

export default ClientMessages;
