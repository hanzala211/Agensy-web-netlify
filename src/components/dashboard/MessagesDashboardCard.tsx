import React from "react";
import { Card } from "@agensy/components";
import { ICONS, ROUTES, DASHBOARD_DUMMY_MESSAGES } from "@agensy/constants";
import { useNavigate } from "react-router-dom";
import { DateUtils } from "@agensy/utils";

export const MessagesDashboardCard: React.FC = () => {
  const navigate = useNavigate();
  const messages = DASHBOARD_DUMMY_MESSAGES;

  return (
    <Card
      title="Messages"
      buttonText={<ICONS.eyeOn />}
      ariaLabel="View all messages"
      onButtonClick={() => navigate(ROUTES.messages)}
      className="border-gray-300"
    >
      <div className="flex flex-col h-full">
        {messages.length > 0 ? (
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className="p-4 rounded-lg border border-gray-100 hover:border-gray-200 transition-all duration-300 hover:shadow-sm cursor-pointer"
                onClick={() => navigate(`${ROUTES.messages}/${message.id}`)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-gray-800 truncate">
                        {message.subject}
                      </h3>
                      {!message.read && (
                        <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                      {message.content}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-gray-400">
                        {message.createdAt &&
                          DateUtils.formatDateToRequiredFormat(
                            message.createdAt.toISOString()
                          )}
                      </span>
                    </div>
                  </div>
                  <ICONS.rightArrow className="text-gray-400 w-5 h-5 flex-shrink-0 ml-4" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500 text-center">No messages found</p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default MessagesDashboardCard;
