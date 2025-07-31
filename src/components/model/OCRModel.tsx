import React, { useState, useRef, useEffect, useMemo } from "react";
import { Modal } from "../common/Modal";
import { PrimaryButton } from "../common/PrimaryButton";
import { CommonLoader } from "../common/CommonLoader";
import { ICONS } from "@agensy/constants";
import { StatefulInput } from "@agensy/components";
import { StringUtils, toast } from "@agensy/utils";
import { isHeicImage, convertHeicToJpeg } from "../../utils/heicUtils";
import { useOCRScanMutation } from "@agensy/api";
import type { OCRField } from "@agensy/types";

interface OCRModelProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitProp: (data: OCRField[]) => void;
}

export const OCRModel: React.FC<OCRModelProps> = ({
  isOpen,
  onClose,
  onSubmitProp,
}) => {
  const postOCRScanMutation = useOCRScanMutation();
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [convertedImage, setConvertedImage] = useState<string | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [ocrResults, setOcrResults] = useState<OCRField[]>([]);
  const [fileType, setFileType] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (postOCRScanMutation.status === "success") {
      setCurrentStep(3);

      toast.success(
        "Document processed successfully",
        "The uploaded document was scanned and processed without any issues."
      );

      const response = postOCRScanMutation.data;

      const mappedFields = response?.mappedFields || {};
      const keyValuePairs = response?.rawTextractResults?.keyValuePairs || {};

      const structuredData = Object.entries(mappedFields).map(
        ([key, value]) => {
          const matchedLabelEntry = Object.entries(keyValuePairs).find(
            ([, kvpValue]) => kvpValue === value
          );

          const formattedKey = StringUtils.formatKeyLabel(key);

          return {
            key,
            value,
            label: matchedLabelEntry?.[0] || formattedKey,
          };
        }
      );

      console.log("Structured OCR Data:", structuredData);
      setOcrResults(structuredData as OCRField[]);
    } else if (postOCRScanMutation.status === "error") {
      setCurrentStep(1);
      toast.error(
        "Document processing failed",
        "An error occurred while processing the document. Please try again."
      );
      setSelectedImage(null);
      setConvertedImage(null);
      setIsConverting(false);
    }
  }, [postOCRScanMutation.status]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
        setSelectedImage(imageDataUrl);
        setFileType(file.type);
        setCurrentStep(2);

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
            setCurrentStep(1);
            setSelectedImage(null);
            if (fileInputRef.current) fileInputRef.current.value = "";
            return;
          } finally {
            setIsConverting(false);
          }
        }
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
        const formData = new FormData();
        formData.append("document", fileToSubmit);
        postOCRScanMutation.mutate({
          data: formData,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFieldChange = (key: string, value: string) => {
    setOcrResults((prev) =>
      prev.map((field) => (field.key === key ? { ...field, value } : field))
    );
  };

  const handleSubmit = () => {
    setTimeout(() => {
      setOcrResults([]);
      setCurrentStep(1);
      setSelectedImage(null);
      setConvertedImage(null);
      setIsConverting(false);
    }, 500);
    onClose();
    toast.success(
      "OCR Results Populated",
      "OCR results have been populated to the form"
    );
    onSubmitProp(ocrResults);
  };

  const handleClose = () => {
    setTimeout(() => {
      setCurrentStep(1);
      setSelectedImage(null);
      setConvertedImage(null);
      setIsConverting(false);
    }, 500);
    onClose();
  };

  const renderStep1 = () => (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-semibold text-gray-800">
          Upload Document for OCR
        </h2>
        <p className="text-gray-600 max-w-md">
          Upload an image or document to extract text and data using our OCR
          technology
        </p>
      </div>

      <div className="w-full">
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all duration-200"
          onClick={handleFileSelect}
        >
          <div className="space-y-4">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
              <ICONS.upload className="text-gray-600 w-8 h-8" />
            </div>
            <div>
              <p className="text-lg font-medium text-gray-700">
                Click to upload
              </p>
              <p className="text-sm text-gray-500">or drag and drop</p>
              <p className="text-xs text-gray-400 mt-2">
                PNG, JPG, PDF up to 10MB
              </p>
            </div>
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.pdf"
          onChange={handleImageUpload}
          className="hidden"
        />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-semibold text-gray-800">
          Processing Document
        </h2>
        <p className="text-gray-600">
          {isConverting
            ? "Converting HEIC image to JPEG format..."
            : "Extracting text and data from your document..."}
        </p>
      </div>

      <div className="flex flex-col items-center space-y-4">
        <CommonLoader size={30} />
      </div>
    </div>
  );

  const isPDF = useMemo(() => {
    return fileType === "application/pdf";
  }, [fileType]);

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="flex flex-col gap-6">
        {/* Image Display */}
        <div className="space-y-4">
          <div className="bg-gray-100 rounded-lg p-4">
            {selectedImage && !isPDF ? (
              <img
                src={convertedImage || selectedImage}
                alt="Uploaded document"
                className="w-full h-auto max-h-80 object-contain rounded"
              />
            ) : (
              <iframe
                src={selectedImage as string}
                title="Uploaded document"
                className="w-full h-auto max-h-80 object-contain rounded"
              />
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-4">
            {ocrResults.map((field) => (
              <div key={field.key} className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  {field.label}
                </label>
                <StatefulInput
                  type="text"
                  value={field.value}
                  onChange={(e) => handleFieldChange(field.key, e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderFooter = () => {
    if (currentStep === 3) {
      return (
        <div className="flex justify-end space-x-4">
          <PrimaryButton onClick={handleSubmit} className="max-w-xs">
            Populate form
          </PrimaryButton>
        </div>
      );
    }
    return null;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="OCR Document Processing"
      maxWidth={`${
        currentStep === 1 || currentStep === 2
          ? "max-w-xl md:h-[60vh] h-[90vh]"
          : "max-w-3xl"
      }`}
      footer={renderFooter()}
    >
      {currentStep === 1 && renderStep1()}
      {currentStep === 2 && renderStep2()}
      {currentStep === 3 && renderStep3()}
    </Modal>
  );
};
