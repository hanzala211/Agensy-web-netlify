import React, { useRef, useEffect, useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import {
  Modal,
  Input,
  Select,
  TextArea,
  PrimaryButton,
  CommonLoader,
} from "@agensy/components";
import { documentSchema } from "@agensy/types";
import type { DocumentFormData, ConfidenceScore, IUser } from "@agensy/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { StringUtils, toast } from "@agensy/utils";
import {
  DOCUMENT_CATEGORY_OPTIONS,
  ROLES,
  SUBSCRIPTION_STATUSES,
} from "@agensy/constants";
import { isHeicImage, convertHeicToJpeg } from "../../utils/heicUtils";
import { useAuthContext } from "@agensy/context";

interface AddDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: DocumentFormData) => void;
  isLoading?: boolean;
  handleAnalyze?: (file: File) => void;
  isAnalyzing?: boolean;
  analyzedDocRes?: ConfidenceScore | null;
  showPrimaryUser?: boolean; // When true, shows primary user dropdown and makes primaryUserId required
}

export const AddDocumentModal: React.FC<AddDocumentModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  handleAnalyze,
  isAnalyzing,
  analyzedDocRes,
  showPrimaryUser = false,
}) => {
  const { accessUsers, userData } = useAuthContext();
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | undefined>(undefined);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [convertedImage, setConvertedImage] = useState<string | null>(null);
  const [fileType, setFileType] = useState<string | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [titleConfidence, setTitleConfidence] = useState<number | null>(null);
  const [descriptionConfidence, setDescriptionConfidence] = useState<
    number | null
  >(null);
  const [categoryConfidence, setCategoryConfidence] = useState<number | null>(
    null
  );
  const [isDragOver, setIsDragOver] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm<DocumentFormData>({
    defaultValues: {
      documentType: "",
      title: "",
      description: "",
      file: undefined,
      primaryUserId: "",
      showPrimaryUser: showPrimaryUser,
    },
    resolver: zodResolver(documentSchema),
  });

  useEffect(() => {
    if (file && handleAnalyze) {
      let fileToSubmit = file as File;

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
        }

        if (correctMimeType) {
          fileToSubmit = new File([file], file.name, {
            type: correctMimeType,
            lastModified: file.lastModified,
          });
        }
      }
      handleAnalyze(fileToSubmit);
    }
  }, [file]);

  useEffect(() => {
    if (analyzedDocRes) {
      setValue("documentType", analyzedDocRes?.category);
      setValue("title", analyzedDocRes?.title);
      setValue("description", analyzedDocRes?.description);
      setTitleConfidence(analyzedDocRes?.confidenceScores?.title);
      setDescriptionConfidence(analyzedDocRes?.confidenceScores?.description);
      setCategoryConfidence(analyzedDocRes?.confidenceScores?.category);
    }
  }, [analyzedDocRes]);

  useEffect(() => {
    if (!isOpen) {
      reset({
        documentType: "",
        title: "",
        description: "",
        file: undefined,
        primaryUserId: "",
        showPrimaryUser: showPrimaryUser,
      });
      setFile(undefined);
      setFilePreview(null);
      setConvertedImage(null);
      setFileType(null);
      setIsConverting(false);
      setIsDragOver(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }, [isOpen, reset]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB in bytes
    console.log(file);

    if (!file) {
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      if (fileInputRef.current) fileInputRef.current.value = "";
      toast.error("File size must be less than 20MB");
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
        ".heic",
        ".heif",
        ".pdf",
      ];

      return validExtensions.some((ext) => fileName.endsWith(ext));
    };

    if (isValidFile()) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const imageDataUrl = e.target?.result as string;
        setFilePreview(imageDataUrl);
        setConvertedImage(null);
        setFileType(file.type);
        setFile(file);
        setValue("file", file);

        if (isHeicImage(file.type, file.name)) {
          setIsConverting(true);
          try {
            const convertedUrl = await convertHeicToJpeg(imageDataUrl);
            setConvertedImage(convertedUrl);
          } catch (error) {
            console.error("Failed to convert HEIC image:", error);
            toast.error(
              "Failed to convert HEIC image. Please try a different format."
            );
            setFile(undefined);
            setFilePreview(null);
            setFileType(null);
            if (fileInputRef.current) fileInputRef.current.value = "";
            return;
          } finally {
            setIsConverting(false);
          }
        }
      };
      reader.readAsDataURL(file);
    } else {
      if (fileInputRef.current) fileInputRef.current.value = "";
      toast.error("Please upload a valid file (PDF or image format)");
    }
  };

  const handleFormSubmit = (data: DocumentFormData) => {
    if (onSubmit) {
      let fileToSubmit = file as File;

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
        }

        if (correctMimeType) {
          fileToSubmit = new File([file], file.name, {
            type: correctMimeType,
            lastModified: file.lastModified,
          });
        }
      }

      onSubmit({ ...data, file: fileToSubmit });
    }
  };

  const handleCancel = () => {
    reset({
      documentType: "",
      title: "",
      description: "",
      file: undefined,
      primaryUserId: "",
      showPrimaryUser: showPrimaryUser,
    });
    setFile(undefined);
    setFilePreview(null);
    setConvertedImage(null);
    setFileType(null);
    setIsConverting(false);
    setIsDragOver(false);
    setTitleConfidence(null);
    setDescriptionConfidence(null);
    setCategoryConfidence(null);
    onClose();
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      const syntheticEvent = {
        target: { files: [file] },
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      handleFileChange(syntheticEvent);
    }
  };

  const isPDF = useMemo(() => {
    return fileType === "application/pdf";
  }, [fileType]);

  const primaryUsers = useMemo(() => {
    const filteredUsers = accessUsers.filter((user: IUser) => {
      return user.UserRoles?.some((role) => role.role === ROLES.PRIMARY_USER);
    });

    const subscribedUsers = filteredUsers.filter(
      (item) => item.subscription_status === SUBSCRIPTION_STATUSES.ACTIVE
    );

    if (
      userData &&
      userData.Roles?.some((role) => role.role === ROLES.PRIMARY_USER) &&
      userData.subscription_status === SUBSCRIPTION_STATUSES.ACTIVE
    ) {
      return [userData, ...subscribedUsers];
    }

    return subscribedUsers;
  }, [accessUsers, userData]);

  const renderFilePreview = () => {
    if (!filePreview) return null;

    return (
      <div className="space-y-3">
        <div className="bg-gray-100 rounded-md p-4">
          {!isPDF ? (
            isConverting ? (
              <div className="flex h-[200px] flex-col items-center justify-center py-8">
                <CommonLoader color="black" />
                <p className="text-sm text-gray-600 mt-2">
                  Converting HEIC image...
                </p>
              </div>
            ) : (
              <div className="relative group">
                <img
                  src={convertedImage || filePreview}
                  alt="Uploaded document"
                  className="w-full h-auto max-h-80 object-contain rounded"
                />
                {isAnalyzing && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-md flex items-center justify-center">
                    <div className="flex flex-col items-center space-y-3">
                      <CommonLoader color="white" />
                      <p className="text-white text-sm font-medium">
                        Analyzing document...
                      </p>
                    </div>
                  </div>
                )}
                {!isAnalyzing && (
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-md flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <button
                      onClick={handleFileSelect}
                      className="bg-white text-gray-800 px-4 py-2 rounded-md shadow-lg hover:bg-blue-200 transition-colors duration-200 flex items-center space-x-2"
                    >
                      <svg
                        className="w-4 h-4 text-black"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                      <span>Change File</span>
                    </button>
                  </div>
                )}
              </div>
            )
          ) : (
            <div className="space-y-3">
              <iframe
                src={filePreview}
                title="Uploaded document"
                className="w-full h-[400px] object-contain rounded"
              />
              {isAnalyzing && (
                <div className="flex flex-col items-center space-y-3">
                  <CommonLoader color="black" />
                  <p className="text-black text-sm font-medium">
                    Analyzing document...
                  </p>
                </div>
              )}
              {!isAnalyzing && (
                <div className="flex justify-center">
                  <button
                    onClick={handleFileSelect}
                    className="bg-blue-400 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-600 transition-colors duration-200 flex items-center space-x-2"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    <span>Change PDF</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  const getConfidenceColor = (score: number | null) => {
    if (score === null) return "!border-gray-300";
    if (score === 0) return "!border-red-500";
    if (score >= 0.9) return "!border-green-500";
    if (score >= 0.7 && score <= 0.89) return "!border-yellow-500";
    return "!border-red-500";
  };

  const renderUploadArea = () => {
    if (filePreview) {
      return (
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Uploaded Document
          </label>
          {renderFilePreview()}
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          Upload Document
        </label>
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200 ${
            isDragOver
              ? "border-blue-500 bg-blue-100"
              : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
          }`}
          onClick={handleFileSelect}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="space-y-4">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>
            <div>
              <p className="text-lg font-medium text-gray-700">
                {isDragOver ? "Drop file here" : "Click to upload"}
              </p>
              <p className="text-sm text-gray-500">
                {isDragOver ? "Release to upload" : "or drag and drop"}
              </p>
              <p className="text-xs text-gray-400 mt-2">
                PNG, JPG, PDF, HEIC up to 20MB
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      title="Add Document"
      maxWidth="max-w-4xl"
      height="h-[90%]"
      footer={
        <div className="flex gap-4 justify-end">
          <PrimaryButton
            onClick={handleCancel}
            type="button"
            className="w-fit bg-white !text-basicBlue hover:!text-basicWhite border border-basicBlue hover:bg-blue-50"
            isLoading={false}
          >
            Cancel
          </PrimaryButton>
          <PrimaryButton
            onClick={() => inputRef.current?.click()}
            type="button"
            className="w-fit"
            isLoading={isLoading}
            disabled={isLoading || !file}
          >
            Upload
          </PrimaryButton>
        </div>
      }
    >
      <div className="flex flex-col gap-6">
        <div className="space-y-6">{renderUploadArea()}</div>

        <div className="space-y-6">
          <Select
            control={control}
            name="documentType"
            label="Category"
            data={
              [...(DOCUMENT_CATEGORY_OPTIONS || [])].map((item) => ({
                label: StringUtils.capitalizeFirstLetter(item.label),
                value: item.value as string,
              })) || []
            }
            aria_label="Select document type"
            labelOption="Select document category"
            buttonLabel="Add Category"
            showButton={false}
            className={`${getConfidenceColor(categoryConfidence)}`}
          />

          {showPrimaryUser && (
            <Select
              control={control}
              name="primaryUserId"
              label="Family Admin"
              data={primaryUsers.map((user: IUser) => ({
                label:
                  user.id === userData?.id
                    ? `${user.first_name} ${user.last_name} (You)`
                    : `${user.first_name} ${user.last_name}`,
                value: user.id as string,
              }))}
              aria_label="Select family admin"
              labelOption="Select family admin"
              buttonLabel="Add Family Admin"
              showButton={false}
            />
          )}

          <Input
            label="Title"
            register={register("title", { required: true })}
            error={errors.title?.message}
            inputClassname={`${getConfidenceColor(titleConfidence)}`}
          />

          <TextArea
            label="Description"
            register={register("description")}
            error={errors.description?.message}
            rows={3}
            className={`${getConfidenceColor(descriptionConfidence)}`}
          />
        </div>
      </div>

      <input
        type="file"
        accept="application/pdf,image/*,.heic,.heif"
        onChange={handleFileChange}
        className="hidden"
        ref={fileInputRef}
      />

      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <input type="submit" ref={inputRef} className="hidden" />
        <input
          type="hidden"
          {...register("showPrimaryUser")}
          value={showPrimaryUser.toString()}
        />
      </form>
    </Modal>
  );
};
