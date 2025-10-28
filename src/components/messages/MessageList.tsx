import React, { useEffect, useMemo, useRef, useState } from "react";
import type { Message } from "@agensy/types";
import { DateUtils, HEICUtils } from "@agensy/utils";
import { toast } from "@agensy/utils";
import dayjs from "dayjs";
import { DATE_FOMRAT, ICONS, COLORS, ROLES } from "@agensy/constants";
import { useMessagesContext, useAuthContext } from "@agensy/context";
import { MessageReadStatus } from "@agensy/components";
import { Dropdown } from "antd";
import { FilePreviewModal } from "./FilePreviewModal";

interface MessageListProps {
  currentUserId: string;
}

interface MessagesByDate {
  [key: string]: Message[];
}

const getFileType = (fileName: string): string => {
  const extension = fileName.split(".").pop()?.toLowerCase();
  if (!extension) return "other";

  const imageExtensions = ["jpg", "jpeg", "png", "gif", "webp", "heic", "heif"];
  const pdfExtensions = ["pdf"];
  const documentExtensions = ["doc", "docx"];

  if (imageExtensions.includes(extension)) return "image";
  if (pdfExtensions.includes(extension)) return "pdf";
  if (documentExtensions.includes(extension)) return "document";
  return "other";
};

const handleFileDownload = async (fileUrl: string, fileName: string) => {
  try {
    toast.info("Processing Document...");
    const fileResponse = await fetch(fileUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/octet-stream",
      },
    });

    const blob = await fileResponse.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    toast.success("Document download started");
  } catch (err) {
    console.error("Download failed:", err);
    toast.error("Failed to download file");
  }
};

export const MessageList: React.FC<MessageListProps> = ({ currentUserId }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const {
    selectedThread,
    currentThreadMessages,
    markMessageAsRead,
    deleteMessage,
  } = useMessagesContext();
  const { userData } = useAuthContext();
  const hasMarkedAsRead = useRef<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalFile, setModalFile] = useState<{
    url: string;
    name: string;
    type: string;
  } | null>(null);
  const [convertedImages, setConvertedImages] = useState<{
    [key: string]: string;
  }>({});
  const [convertingImages, setConvertingImages] = useState<{
    [key: string]: boolean;
  }>({});

  const isAdmin = userData?.Roles?.some((role) => role.role === ROLES.ADMIN);

  useEffect(() => {
    if (scrollRef.current && selectedThread?.messages?.length) {
      scrollRef.current.scrollIntoView({ behavior: "instant" });
    }
  }, [selectedThread]);

  useEffect(() => {
    if (scrollRef.current && currentThreadMessages.length > 0) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentThreadMessages.length]);

  useEffect(() => {
    hasMarkedAsRead.current = false;
  }, [selectedThread?.id]);

  useEffect(() => {
    if (
      selectedThread &&
      currentThreadMessages.length > 0 &&
      !hasMarkedAsRead.current
    ) {
      const hasUnreadMessages = currentThreadMessages.some(
        (message) =>
          message.sender_id !== currentUserId &&
          !message.read_by?.some((r) => r.user_id === currentUserId)
      );

      if (hasUnreadMessages) {
        console.log(
          "📖 [MESSAGE_LIST] Marking all messages as read for thread:",
          selectedThread.id
        );
        markMessageAsRead(selectedThread.id as string);
        hasMarkedAsRead.current = true;
      }
    }
  }, [selectedThread, currentThreadMessages, currentUserId, markMessageAsRead]);

  useEffect(() => {
    currentThreadMessages.forEach((message) => {
      if (
        message.file_url &&
        message.file_name &&
        message.id &&
        isHeicImage(message.file_name) &&
        !convertedImages[message.id] &&
        !convertingImages[message.id]
      ) {
        convertHeicImage(message.file_url, message.id as string);
      }
    });
  }, [currentThreadMessages, convertedImages, convertingImages]);

  useEffect(() => {
    return () => {
      Object.values(convertedImages).forEach((url) => {
        if (url) URL.revokeObjectURL(url);
      });
    };
  }, [selectedThread?.id]);

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

  const handleDoubleClick = (message: Message) => {
    if (
      message.sender_id !== currentUserId &&
      selectedThread &&
      !hasMarkedAsRead.current
    ) {
      console.log(
        "📖 [MESSAGE_LIST] Double-click: Marking all messages as read for thread:",
        selectedThread.id
      );
      markMessageAsRead(selectedThread.id as string);
      hasMarkedAsRead.current = true;
    }
  };

  const handleFileClick = (
    fileUrl: string,
    fileName: string,
    messageId?: string
  ) => {
    const fileType = getFileType(fileName);
    let urlToUse = fileUrl;

    if (messageId && isHeicImage(fileName) && convertedImages[messageId]) {
      urlToUse = convertedImages[messageId];
    }

    setModalFile({
      url: urlToUse,
      name: fileName,
      type: fileType,
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalFile(null);
  };

  const convertHeicImage = async (fileUrl: string, messageId: string) => {
    if (convertedImages[messageId] || convertingImages[messageId]) return;

    setConvertingImages((prev) => ({ ...prev, [messageId]: true }));

    try {
      const convertedUrl = await HEICUtils.convertHeicToJpeg(fileUrl);
      setConvertedImages((prev) => ({ ...prev, [messageId]: convertedUrl }));
    } catch (error) {
      console.error("Failed to convert HEIC image:", error);
      toast.error("Failed to convert HEIC image");
    } finally {
      setConvertingImages((prev) => ({ ...prev, [messageId]: false }));
    }
  };

  const isHeicImage = (fileName: string): boolean => {
    const extension = fileName.split(".").pop()?.toLowerCase();
    return extension === "heic" || extension === "heif";
  };

  const getDropdownContent = (messageId: string, threadId: string) => (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[120px]">
      <div
        className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 cursor-pointer text-red-600"
        onClick={() => {
          deleteMessage(messageId, threadId);
        }}
      >
        <ICONS.delete className="w-4 h-4" />
        <span className="text-sm">Delete</span>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex flex-col gap-3 pl-5 pr-1 sm:gap-4 sm:p-4">
        {sortedDates.map((date) => (
          <React.Fragment key={date}>
            <div className="flex justify-center">
              <div className="bg-lightGray text-slateGrey text-xs px-3 py-1 rounded-full shadow-sm">
                {DateUtils.formatSimpleDate(date)}
              </div>
            </div>
            {messagesByDate[date].map((message) => {
              const isSender = message.sender_id === currentUserId;

              const allParticipants = [
                ...(selectedThread?.participants || []),
                ...(selectedThread?.left_participants || []),
              ];
              const sender = allParticipants.find(
                (user) => user.id === message.sender_id
              );

              return (
                <div
                  key={message.id}
                  className={`flex group ${
                    isSender ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`flex gap-2 w-full relative ${
                      isSender ? "justify-end" : ""
                    }`}
                  >
                    {/* Dropdown for sender messages - appears on the left */}
                    {isSender && selectedThread && (
                      <div className="flex items-start pt-2">
                        {/* @ts-expect-error - Dropdown is not typed */}
                        <Dropdown
                          overlay={getDropdownContent(
                            message.id as string,
                            selectedThread.id as string
                          )}
                          trigger={["click"]}
                          placement="bottomLeft"
                        >
                          <div className="flex items-center cursor-pointer hover:bg-gray-100 rounded-lg p-1 transition-colors duration-200 opacity-0 group-hover:opacity-100">
                            <ICONS.moreVertical className="w-4 h-4 text-gray-500" />
                          </div>
                        </Dropdown>
                      </div>
                    )}
                    {!isSender &&
                      sender &&
                      sender.first_name &&
                      sender.last_name && (
                        <div className="top-0 left-0 w-6 h-6 rounded-full border-2 border-white shadow-sm">
                          {sender.avatar ? (
                            <img
                              src={sender.avatar}
                              alt={`${sender.first_name} ${sender.last_name}`}
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full rounded-full bg-primaryColor text-white flex items-center justify-center text-[9px] font-medium shadow-sm">
                              {(sender.first_name[0]?.toUpperCase() || "") +
                                (sender.last_name[0]?.toUpperCase() || "")}
                            </div>
                          )}
                        </div>
                      )}
                    <div
                      className={`relative max-w-[85%] sm:max-w-[70%] rounded-lg ${
                        isSender
                          ? "bg-primaryColor text-white rounded-tr-none mr-1 shadow-[0_4px_12px_rgba(42,107,184,0.2)]"
                          : "bg-basicWhite text-basicBlack border-[1px] border-gray-200 rounded-tl-none ml-1 shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
                      } px-2.5 py-2 sm:px-3 sm:py-2`}
                      onDoubleClick={() => handleDoubleClick(message)}
                    >
                      <div className="flex flex-col gap-1 pb-5">
                        {/* File Preview */}
                        {message.file_url && message.file_name && (
                          <div className="mb-2">
                            {getFileType(message.file_name) === "image" && (
                              <div
                                className="relative w-52 h-36 bg-white rounded-lg overflow-hidden shadow-sm cursor-pointer"
                                onClick={() =>
                                  handleFileClick(
                                    message.file_url!,
                                    message.file_name!,
                                    message.id as string
                                  )
                                }
                              >
                                {isHeicImage(message.file_name) &&
                                convertingImages[message.id as string] ? (
                                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                    <div className="text-center">
                                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primaryColor mx-auto mb-2"></div>
                                      <p className="text-xs text-gray-600">
                                        Converting HEIC...
                                      </p>
                                    </div>
                                  </div>
                                ) : (
                                  <img
                                    src={
                                      convertedImages[message.id as string] ||
                                      message.file_url
                                    }
                                    alt={message.file_name}
                                    className="w-full h-full object-cover"
                                  />
                                )}
                                <div className="absolute top-2 left-2 bg-white bg-opacity-90 rounded-full p-1">
                                  <ICONS.clip
                                    color={COLORS.primaryColor}
                                    size={10}
                                  />
                                </div>
                                <button
                                  onClick={async (e) => {
                                    e.stopPropagation();
                                    await handleFileDownload(
                                      message.file_url!,
                                      message.file_name!
                                    );
                                  }}
                                  className="absolute top-2 right-2 bg-black bg-opacity-60 hover:bg-opacity-80 text-white rounded-full p-1.5 transition-all duration-200"
                                  title="Download file"
                                >
                                  <ICONS.download className="w-3 h-3" />
                                </button>
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2">
                                  <p className="text-white text-xs font-medium truncate">
                                    {message.file_name}
                                  </p>
                                </div>
                              </div>
                            )}

                            {getFileType(message.file_name) === "pdf" && (
                              <div
                                className="relative w-52 h-36 bg-white rounded-lg overflow-hidden shadow-sm cursor-pointer"
                                onClick={() =>
                                  handleFileClick(
                                    message.file_url!,
                                    message.file_name!,
                                    message.id as string
                                  )
                                }
                              >
                                <iframe
                                  src={message.file_url}
                                  className="w-full h-full"
                                  title={message.file_name}
                                />
                                <div className="absolute top-2 left-2 bg-white bg-opacity-90 rounded-full p-1">
                                  <ICONS.clip
                                    color={COLORS.primaryColor}
                                    size={10}
                                  />
                                </div>
                                <button
                                  onClick={async (e) => {
                                    e.stopPropagation();
                                    await handleFileDownload(
                                      message.file_url!,
                                      message.file_name!
                                    );
                                  }}
                                  className="absolute top-2 right-2 bg-black bg-opacity-60 hover:bg-opacity-80 text-white rounded-full p-1.5 transition-all duration-200"
                                  title="Download file"
                                >
                                  <ICONS.download className="w-3 h-3" />
                                </button>
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2">
                                  <p className="text-white text-xs font-medium truncate">
                                    {message.file_name}
                                  </p>
                                </div>
                              </div>
                            )}

                            {getFileType(message.file_name) === "document" && (
                              <div
                                className="relative w-52 h-20 bg-white rounded-lg shadow-sm border border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors"
                                onClick={() =>
                                  handleFileClick(
                                    message.file_url!,
                                    message.file_name!,
                                    message.id as string
                                  )
                                }
                              >
                                <div className="flex items-center gap-3 p-3 h-full">
                                  <div className="flex-shrink-0">
                                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                                      <ICONS.clip
                                        color={COLORS.primaryColor}
                                        size={16}
                                      />
                                    </div>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p
                                      className="text-sm font-medium text-gray-900 truncate"
                                      title={message.file_name}
                                    >
                                      {message.file_name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      Document
                                    </p>
                                  </div>
                                </div>
                                <button
                                  onClick={async (e) => {
                                    e.stopPropagation();
                                    await handleFileDownload(
                                      message.file_url!,
                                      message.file_name!
                                    );
                                  }}
                                  className="absolute top-2 right-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full p-1.5 transition-all duration-200"
                                  title="Download file"
                                >
                                  <ICONS.download className="w-3 h-3" />
                                </button>
                              </div>
                            )}

                            {getFileType(message.file_name) === "other" && (
                              <div
                                className="relative w-52 h-20 bg-white rounded-lg shadow-sm border border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors"
                                onClick={() =>
                                  handleFileClick(
                                    message.file_url!,
                                    message.file_name!,
                                    message.id as string
                                  )
                                }
                              >
                                <div className="flex items-center gap-3 p-3 h-full">
                                  <div className="flex-shrink-0">
                                    <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center">
                                      <ICONS.clip
                                        color={COLORS.primaryColor}
                                        size={16}
                                      />
                                    </div>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p
                                      className="text-sm font-medium text-gray-900 truncate"
                                      title={message.file_name}
                                    >
                                      {message.file_name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      File
                                    </p>
                                  </div>
                                </div>
                                <button
                                  onClick={async (e) => {
                                    e.stopPropagation();
                                    await handleFileDownload(
                                      message.file_url!,
                                      message.file_name!
                                    );
                                  }}
                                  className="absolute top-2 right-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full p-1.5 transition-all duration-200"
                                  title="Download file"
                                >
                                  <ICONS.download className="w-3 h-3" />
                                </button>
                              </div>
                            )}
                          </div>
                        )}

                        {message.message && (
                          <p
                            className="sm:text-[12px] text-[10px] pr-12 sm:pr-14 whitespace-pre-wrap max-w-full"
                            style={{
                              wordBreak: "break-all",
                              overflowWrap: "anywhere",
                              wordWrap: "break-word",
                            }}
                          >
                            {message.message}
                          </p>
                        )}

                        <span
                          className={`sm:text-[8px] text-[7px] opacity-70 absolute bottom-1.5 ${
                            isSender ? "sm:right-6 right-5" : "right-1"
                          }`}
                        >
                          {DateUtils.formatToTime(String(message.createdAt))}
                        </span>
                        {isSender &&
                          selectedThread &&
                          selectedThread.type !== "broadcast" && (
                            <div className="text-[8px] opacity-70 absolute bottom-0.5 right-[0.5px]">
                              <MessageReadStatus
                                message={message}
                                thread={selectedThread}
                                currentUserId={currentUserId}
                              />
                            </div>
                          )}
                      </div>
                    </div>
                    {/* Dropdown for admin viewing non-sender messages - appears on the right */}
                    {!isSender && isAdmin && selectedThread && (
                      <div className="flex items-start pt-2">
                        {/* @ts-expect-error - Dropdown is not typed */}
                        <Dropdown
                          overlay={getDropdownContent(
                            message.id as string,
                            selectedThread.id as string
                          )}
                          trigger={["click"]}
                          placement="bottomRight"
                        >
                          <div className="flex items-center cursor-pointer hover:bg-gray-100 rounded-lg p-1 transition-colors duration-200 opacity-0 group-hover:opacity-100">
                            <ICONS.moreVertical className="w-4 h-4 text-gray-500" />
                          </div>
                        </Dropdown>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </React.Fragment>
        ))}
        <div ref={scrollRef} />
      </div>

      {modalFile && (
        <FilePreviewModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          fileUrl={modalFile.url}
          fileName={modalFile.name}
          fileType={modalFile.type}
        />
      )}
    </div>
  );
};

export default MessageList;
