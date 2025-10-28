import React, { useState, useEffect, useRef, useCallback } from "react";
import { PrimaryButton } from "@agensy/components";
import {
  useAuthContext,
  useMessagesContext,
  useSocketContext,
} from "@agensy/context";
import { useParams } from "react-router-dom";
import { COLORS, ICONS } from "@agensy/constants";
import { useUploadThreadFileMutation } from "@agensy/api";
import { FiLoader } from "react-icons/fi";
import { toast } from "@agensy/utils";
import { v4 as uuidv4 } from "uuid";
import { HEICUtils } from "@agensy/utils";

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
  const uploadFileMutation = useUploadThreadFileMutation();
  const [message, setMessage] = useState<string>("");
  const [uploadFileData, setUploadFileData] = useState<{
    file_url: string;
    file_name: string;
    file_key: number;
  } | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [convertedImage, setConvertedImage] = useState<string | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasEmittedTypingRef = useRef(false);

  const handleTypingStart = () => {
    if (!hasEmittedTypingRef.current && (params.threadId as string)) {
      emitTypingStart(params.threadId as string);
      hasEmittedTypingRef.current = true;
    }

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      handleTypingStop();
    }, 1000);
  };

  const handleTypingStop = useCallback(() => {
    if (hasEmittedTypingRef.current && (params.threadId as string)) {
      emitTypingStop(params.threadId as string);
      hasEmittedTypingRef.current = false;
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
      debounceTimeoutRef.current = null;
    }
  }, [params.threadId, emitTypingStop]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setMessage(value);

    const target = e.target;
    target.style.height = "auto";
    target.style.height = Math.min(target.scrollHeight, 120) + "px";

    if (value.trim()) {
      handleTypingStart();
    } else {
      handleTypingStop();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        toast.error("File size must be less than 10MB");
        return;
      }

      const isValidFile = () => {
        if (file.type.startsWith("image/") || file.type === "application/pdf") {
          return true;
        }

        const fileName = file.name.toLowerCase();
        const validExtensions = [
          ".jpg",
          ".jpeg",
          ".png",
          ".gif",
          ".webp",
          ".heic",
          ".heif",
          ".pdf",
          ".doc",
          ".docx",
        ];

        return validExtensions.some((ext) => fileName.endsWith(ext));
      };

      if (!isValidFile()) {
        toast.error("Only PDF, image, and document files are allowed");
        return;
      }

      setSelectedFile(file);
      setConvertedImage(null);

      let fileToUpload = file;
      if (file && !file.type) {
        const fileName = file.name.toLowerCase();
        let correctMimeType = "";

        if (fileName.endsWith(".heic")) {
          correctMimeType = "image/heic";
        } else if (fileName.endsWith(".heif")) {
          correctMimeType = "image/heif";
        } else if (fileName.endsWith(".pdf")) {
          correctMimeType = "application/pdf";
        } else if (fileName.endsWith(".jpg") || fileName.endsWith(".jpeg")) {
          correctMimeType = "image/jpeg";
        } else if (fileName.endsWith(".png")) {
          correctMimeType = "image/png";
        } else if (fileName.endsWith(".gif")) {
          correctMimeType = "image/gif";
        } else if (fileName.endsWith(".webp")) {
          correctMimeType = "image/webp";
        } else if (fileName.endsWith(".doc")) {
          correctMimeType = "application/msword";
        } else if (fileName.endsWith(".docx")) {
          correctMimeType =
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        }

        if (correctMimeType) {
          fileToUpload = new File([file], file.name, {
            type: correctMimeType,
            lastModified: file.lastModified,
          });
        }
      }

      if (HEICUtils.isHeicImage(fileToUpload.type, fileToUpload.name)) {
        setIsConverting(true);
        try {
          const reader = new FileReader();
          reader.onload = async (e) => {
            const imageDataUrl = e.target?.result as string;
            try {
              const convertedUrl = await HEICUtils.convertHeicToJpeg(
                imageDataUrl
              );
              setConvertedImage(convertedUrl);
            } catch (error) {
              console.error("Failed to convert HEIC image:", error);
              toast.error(
                "Failed to convert HEIC image. Please try a different format."
              );
              setSelectedFile(null);
              if (fileInputRef.current) fileInputRef.current.value = "";
              return;
            } finally {
              setIsConverting(false);
            }
          };
          reader.readAsDataURL(fileToUpload);
        } catch (error) {
          console.error("Failed to read HEIC file:", error);
          toast.error("Failed to process HEIC file");
          setSelectedFile(null);
          if (fileInputRef.current) fileInputRef.current.value = "";
          setIsConverting(false);
          return;
        }
      }

      uploadFileMutation.mutate(fileToUpload);
    }
  };

  const handleFileRemove = () => {
    setSelectedFile(null);
    setConvertedImage(null);
    setIsConverting(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };

  const getFileType = (file: File): string => {
    const type = file.type.toLowerCase();
    const fileName = file.name.toLowerCase();

    if (
      type.startsWith("image/") ||
      type === "image/heic" ||
      type === "image/heif" ||
      fileName.endsWith(".heic") ||
      fileName.endsWith(".heif")
    ) {
      return "image";
    }

    if (type === "application/pdf") return "pdf";
    if (
      type === "application/msword" ||
      type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    )
      return "document";
    return "other";
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  useEffect(() => {
    if (uploadFileMutation.status === "success") {
      setUploadFileData(uploadFileMutation.data);
      console.log("File uploaded successfully:", uploadFileMutation.data);
    } else if (uploadFileMutation.status === "error") {
      console.error("File upload failed:", uploadFileMutation.error);
      handleFileRemove();
      toast.error("Failed to upload file");
    }
  }, [uploadFileMutation.status]);

  useEffect(() => {
    setSelectedFile(null);
    setConvertedImage(null);
    setIsConverting(false);
  }, [params.threadId]);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      if (hasEmittedTypingRef.current) {
        handleTypingStop();
      }
    };
  }, [handleTypingStop]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((!message.trim() && !selectedFile) || !socket || !userData?.id) return;

    handleTypingStop();

    const messageId = uuidv4();

    onSendMessage(message.trim());
    setMessage("");
    setSelectedFile(null);
    setConvertedImage(null);
    setIsConverting(false);
    setUploadFileData(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    if (pendingThreadData && pendingThreadData.id === params.threadId) {
      console.log("Sending message in new thread", pendingThreadData);

      updateCurrentThreadMessages(
        message.trim(),
        params.threadId as string,
        String(userData.id),
        uploadFileData || undefined,
        messageId
      );

      // Handle broadcast messages
      if (pendingThreadData.type === "broadcast") {
        socket.emit("sendBroadcast", {
          id: pendingThreadData.id ? pendingThreadData.id : params.threadId,
          message_id: messageId,
          sender_id: userData.id,
          message: message.trim() ? message.trim() : null,
          file_url: uploadFileData?.file_url ? uploadFileData?.file_url : null,
          file_name: uploadFileData?.file_name
            ? uploadFileData?.file_name
            : null,
          file_key: uploadFileData?.file_key ? uploadFileData?.file_key : null,
        });
      } else {
        socket.emit("sendMessage", {
          id: pendingThreadData.id ? pendingThreadData.id : params.threadId,
          sender_id: userData.id,
          message: message.trim() ? message.trim() : null,
          participants_ids: pendingThreadData.participants_ids,
          client_id: pendingThreadData.client_id
            ? pendingThreadData.client_id
            : null,
          file_url: uploadFileData?.file_url ? uploadFileData?.file_url : null,
          file_name: uploadFileData?.file_name
            ? uploadFileData?.file_name
            : null,
          file_key: uploadFileData?.file_key ? uploadFileData?.file_key : null,
          message_id: messageId,
        });
      }

      clearPendingThreadData();
    } else {
      console.log("Sending message in old thread", params.threadId);
      socket.emit("sendMessage", {
        message: message.trim() ? message.trim() : null,
        id: params.threadId as string,
        sender_id: userData.id,
        file_url: uploadFileData?.file_url ? uploadFileData?.file_url : null,
        file_name: uploadFileData?.file_name ? uploadFileData?.file_name : null,
        file_key: uploadFileData?.file_key ? uploadFileData?.file_key : null,
        message_id: messageId,
      });

      updateSelectedThread(
        params.threadId as string,
        String(userData.id),
        message.trim(),
        uploadFileData || undefined,
        messageId
      );

      updateThreads(
        params.threadId as string,
        String(userData.id),
        message.trim(),
        uploadFileData || undefined,
        messageId
      );

      updateCurrentThreadMessages(
        message.trim(),
        params.threadId as string,
        String(userData.id),
        uploadFileData || undefined,
        messageId
      );

      updateThreadsSorting();
    }
  };

  return (
    <div className="border-y">
      {selectedFile && (
        <div className="px-3 sm:px-4 py-3 bg-gray-50 border-b">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="w-80 h-32">
                {getFileType(selectedFile) === "image" && (
                  <div className="relative w-full h-full">
                    {isConverting ? (
                      <div className="absolute inset-0 bg-black bg-opacity-30 rounded-lg flex items-center justify-center">
                        <div className="bg-white rounded-lg p-4 shadow-lg text-center">
                          <FiLoader className="animate-spin text-gray-600 w-6 h-6 mx-auto mb-2" />
                          <p className="text-sm text-gray-600 font-medium">
                            Converting HEIC image...
                          </p>
                        </div>
                      </div>
                    ) : convertedImage ? (
                      <img
                        src={convertedImage}
                        alt={selectedFile.name}
                        className="w-full h-full rounded-lg border border-gray-200 object-contain"
                      />
                    ) : (
                      <img
                        src={URL.createObjectURL(selectedFile)}
                        alt={selectedFile.name}
                        className="w-full h-full rounded-lg border border-gray-200 object-contain"
                        onLoad={() => {
                          URL.revokeObjectURL(
                            URL.createObjectURL(selectedFile)
                          );
                        }}
                      />
                    )}

                    {uploadFileMutation.isPending && !isConverting && (
                      <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-1">
                        <FiLoader className="animate-spin text-white w-4 h-4" />
                      </div>
                    )}

                    {!isConverting && (
                      <button
                        type="button"
                        onClick={handleFileRemove}
                        className="absolute top-2 right-2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full p-1 transition-all duration-200"
                        title="Remove file"
                      >
                        <ICONS.close />
                      </button>
                    )}

                    <div className="absolute top-3 left-2">
                      <ICONS.clip color={COLORS.primaryColor} size={12} />
                    </div>
                  </div>
                )}

                {getFileType(selectedFile) === "pdf" && (
                  <div className="relative border border-gray-200 rounded-lg overflow-hidden w-[200px] h-full">
                    <iframe
                      src={URL.createObjectURL(selectedFile)}
                      className="w-full h-full"
                      title={selectedFile.name}
                    />
                    {uploadFileMutation.isPending ? (
                      <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-1">
                        <FiLoader className="animate-spin text-white w-4 h-4" />
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={handleFileRemove}
                        className="absolute top-2 right-2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full p-1 transition-all duration-200"
                        title="Remove file"
                      >
                        <ICONS.close />
                      </button>
                    )}
                    <div className="absolute top-3 left-2">
                      <ICONS.clip color={COLORS.primaryColor} size={12} />
                    </div>
                  </div>
                )}

                {getFileType(selectedFile) === "document" && (
                  <div className="relative border border-gray-200 rounded-lg p-3 w-[200px] h-full">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        <ICONS.clip color={COLORS.primaryColor} size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className="text-sm font-medium text-gray-900 truncate"
                          title={selectedFile.name}
                        >
                          {selectedFile.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatFileSize(selectedFile.size)}
                        </p>
                      </div>
                    </div>
                    {uploadFileMutation.isPending ? (
                      <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-1">
                        <FiLoader className="animate-spin text-white w-4 h-4" />
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={handleFileRemove}
                        className="absolute top-2 right-2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full p-1 transition-all duration-200"
                        title="Remove file"
                      >
                        <ICONS.close />
                      </button>
                    )}
                  </div>
                )}

                {getFileType(selectedFile) === "other" && (
                  <div className="flex items-center justify-center gap-2 p-3 bg-gray-100 rounded-lg w-full h-full">
                    <ICONS.close />
                    <span className="text-sm text-gray-600">
                      File preview not available
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex gap-2 p-3 sm:p-4 items-end">
        <textarea
          value={message}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onBlur={handleTypingStop}
          placeholder="Type a message... (Shift+Enter for new line)"
          className="flex-1 px-3 sm:px-4 py-2 overflow-auto text-sm sm:text-base !bg-lightGray border-[1px] border-mediumGray rounded-xl focus:outline-none focus-within:border-basicBlue focus-within:shadow-sm focus-within:shadow-blue-200 placeholder:!text-slateGrey transition-all duration-200 resize-none"
          rows={1}
          style={{
            minHeight: "70px",
            maxHeight: "120px",
            height: "40px",
          }}
        />

        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileSelect}
          className="hidden"
          accept=".pdf,.jpg,.jpeg,.png,.gif,.webp,.heic,.heif,.doc,.docx"
        />

        <button
          type="button"
          onClick={handleAttachmentClick}
          className="px-4 py-4 text-gray-500 rounded-full hover:text-gray-700 hover:bg-gray-100 transition-colors"
          title="Attach file"
        >
          <ICONS.clip className="w-4 h-4" />
        </button>

        <PrimaryButton
          type="submit"
          disabled={
            (!message.trim() && !selectedFile) ||
            isLoading ||
            !socket ||
            uploadFileMutation.isPending ||
            isConverting
          }
          className="!py-0.5 !px-4 !w-fit !cursor-pointer"
        >
          <ICONS.send className="w-4 h-4" />
        </PrimaryButton>
      </form>
    </div>
  );
};

export default MessageForm;
