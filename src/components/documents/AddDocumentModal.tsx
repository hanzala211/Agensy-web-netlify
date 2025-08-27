import React, { useRef, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Modal,
  Input,
  Select,
  TextArea,
  PrimaryButton,
  SecondaryButton,
  CommonLoader,
} from "@agensy/components";
import { documentSchema } from "@agensy/types";
import type { DocumentFormData, ConfidenceScore } from "@agensy/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { StringUtils, toast } from "@agensy/utils";
import { DOCUMENT_CATEGORY_OPTIONS } from "@agensy/constants";

interface AddDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: DocumentFormData) => void;
  isLoading?: boolean;
  handleAnalyze?: (file: File) => void;
  isAnalyzing?: boolean;
  analyzedDocRes?: ConfidenceScore | null;
}

export const AddDocumentModal: React.FC<AddDocumentModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  handleAnalyze,
  isAnalyzing,
  analyzedDocRes,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | undefined>(undefined);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [fileType, setFileType] = useState<string | null>(null);
  const [titleConfidence, setTitleConfidence] = useState<number | null>(null);
  const [descriptionConfidence, setDescriptionConfidence] = useState<
    number | null
  >(null);
  const [categoryConfidence, setCategoryConfidence] = useState<number | null>(
    null
  );

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
    },
    resolver: zodResolver(documentSchema),
  });

  useEffect(() => {
    if (file && handleAnalyze) {
      handleAnalyze(file);
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
      });
      setFile(undefined);
      if (filePreview) {
        URL.revokeObjectURL(filePreview);
      }
      setFilePreview(null);
      setFileType(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }, [isOpen, reset, filePreview]);

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      if (filePreview) {
        URL.revokeObjectURL(filePreview);
      }
    };
  }, [filePreview]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      if (file.type === "application/pdf" || file.type.startsWith("image/")) {
        return true;
      }

      const fileName = file.name.toLowerCase();
      const validExtensions = [
        ".pdf",
        ".jpg",
        ".jpeg",
        ".png",
        ".gif",
        ".heic",
        ".heif",
      ];

      return validExtensions.some((ext) => fileName.endsWith(ext));
    };

    if (isValidFile()) {
      // Clean up previous preview URL if it exists
      if (filePreview) {
        URL.revokeObjectURL(filePreview);
      }

      setFile(file);
      setFileType(file.type);
      setValue("file", file);

      // Create preview for the file
      const previewUrl = URL.createObjectURL(file);
      setFilePreview(previewUrl);
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
    });
    setFile(undefined);
    setFilePreview(null);
    setFileType(null);
    setTitleConfidence(null);
    setDescriptionConfidence(null);
    setCategoryConfidence(null);
    onClose();
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const isPDF = fileType === "application/pdf";

  const renderFilePreview = () => {
    if (!filePreview) return null;

    return (
      <div className="space-y-3">
        <div className="bg-gray-100 rounded-lg p-4">
          {!isPDF ? (
            <div className="relative group">
              <img
                src={filePreview}
                alt="Uploaded document"
                className="w-full h-auto max-h-80 object-contain rounded"
              />
              {isAnalyzing && (
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                  <div className="flex flex-col items-center space-y-3">
                    <CommonLoader color="white" />
                    <p className="text-white text-sm font-medium">
                      Analyzing document...
                    </p>
                  </div>
                </div>
              )}
              {!isAnalyzing && (
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <button
                    onClick={handleFileSelect}
                    className="bg-white text-gray-800 px-4 py-2 rounded-lg shadow-lg hover:bg-blue-200 transition-colors duration-200 flex items-center space-x-2"
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
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-blue-600"
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
              <p className="text-sm font-medium text-gray-900">
                Choose a file or drag and drop
              </p>
              <p className="text-xs text-gray-500 mt-1">
                PDF, JPG, PNG, GIF, HEIC up to 20MB
              </p>
            </div>
            <SecondaryButton
              onClick={handleFileSelect}
              className="mt-2"
              type="button"
            >
              Browse Files
            </SecondaryButton>
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
            onClick={() => inputRef.current?.click()}
            type="button"
            className="w-fit"
            isLoading={isLoading}
            disabled={isLoading || !file}
          >
            Upload
          </PrimaryButton>
          <PrimaryButton
            onClick={handleCancel}
            type="button"
            className="w-fit bg-white !text-basicBlue border border-basicBlue hover:bg-blue-50"
            isLoading={false}
          >
            Cancel
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

      {/* Hidden file input - always accessible */}
      <input
        type="file"
        accept="application/pdf,image/*,.heic,.heif"
        onChange={handleFileChange}
        className="hidden"
        ref={fileInputRef}
      />

      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <input type="submit" ref={inputRef} className="hidden" />
      </form>
    </Modal>
  );
};
