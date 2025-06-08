import { useGetSingleThreadQuery } from "@agensy/api";
import { CommonLoader, MessageForm, MessageList } from "@agensy/components";
import { ICONS, ROUTES } from "@agensy/constants";
import { useAuthContext, useMessagesContext } from "@agensy/context";
import React, { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";

export const ChatPage: React.FC = () => {
  const params = useParams();
  const navigate = useNavigate();
  const {
    data: threadData,
    isLoading: isThreadLoading,
    status: getThreadStatus,
    refetch: loadThread,
  } = useGetSingleThreadQuery(params.threadId as string);
  const { userData } = useAuthContext();
  const {
    selectedThread,
    setShowThreadList,
    setSelectedThread,
    setCurrentThreadMessages,
  } = useMessagesContext();
  const selectedUser = useMemo(() => {
    return selectedThread?.participants.find(
      (participant) => participant.id !== userData?.id
    );
  }, [selectedThread]);

  useEffect(() => {
    if (getThreadStatus === "success") {
      setSelectedThread(threadData);
      setCurrentThreadMessages(threadData?.messages || []);
    }
  }, [getThreadStatus]);

  useEffect(() => {
    if (params.threadId) {
      loadThread();
    }
  }, [params.threadId]);

  const handleBack = () => {
    if (!params.clientId) {
      navigate(`${ROUTES.messages}`);
      setShowThreadList(true);
    } else {
      setShowThreadList(true);
      navigate(
        `/${ROUTES.clients}/${params.clientId}/${ROUTES.clientMessages}`
      );
    }
  };

  return (
    <React.Fragment>
      <div className="flex items-center gap-2 p-3 sm:p-4 border-b border-r">
        <button onClick={handleBack} className="p-1 rounded-lg lg:hidden">
          <ICONS.leftArrow />
        </button>
        <div className="flex-shrink-0">
          {selectedUser?.avatar ? (
            <img
              src={selectedUser?.avatar}
              alt="profile"
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primaryColor to-basicBlue text-white flex items-center justify-center text-sm font-medium shadow-sm">
              <div className="w-full h-full flex items-center text-lg justify-center">
                {(selectedUser?.first_name?.[0]?.toUpperCase() || "") +
                  (selectedUser?.last_name?.[0]?.toUpperCase() || "")}
              </div>
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium truncate">
            {selectedUser?.first_name} {selectedUser?.last_name}
          </h3>
        </div>
      </div>

      <div className="flex flex-col h-[100dvh] md:max-h-[calc(100dvh-100px)] max-h-[calc(100dvh-205px)] overflow-y-auto">
        {isThreadLoading ? (
          <div className="flex items-center justify-center h-full">
            <CommonLoader />
          </div>
        ) : !threadData ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p>Thread not found or you don't have access to it</p>
          </div>
        ) : (
          <MessageList currentUserId={userData?.id as string} />
        )}
      </div>
      <MessageForm
        onSendMessage={() => {}}
        isLoading={isThreadLoading || !threadData}
      />
    </React.Fragment>
  );
};
