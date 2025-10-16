import React, { useState, useRef, useEffect, useMemo } from "react";
import { Modal } from "../common/Modal";
import { PrimaryButton } from "../common/PrimaryButton";
import { CommonLoader } from "../common/CommonLoader";
import {
  ICONS,
  MEDICATION_FREQUENCY_OPTIONS,
  SPECIALTIES,
  STATES,
} from "@agensy/constants";
import {
  StatefulDatePicker,
  StatefulInput,
  StatefulPhoneInput,
  StatefulSelect,
} from "@agensy/components";
import { StringUtils, toast } from "@agensy/utils";
import { isHeicImage, convertHeicToJpeg } from "../../utils/heicUtils";
import { useOCRScanMutation } from "@agensy/api";
import type {
  ClientMedications,
  HealthcareProvider,
  OCRField,
  MappedField,
} from "@agensy/types";
import { OCR_DOCUMENT_TYPES } from "@agensy/constants";

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
  const [selectedDocumentType, setSelectedDocumentType] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (postOCRScanMutation.status === "success") {
      setCurrentStep(3);

      toast.success(
        "Document processed successfully",
        "The uploaded document was scanned and processed without any issues."
      );

      const response = postOCRScanMutation.data;

      const mappedFields = response?.mappedFields || [];

      const structuredData = mappedFields.map((field: MappedField) => {
        const formattedKey = StringUtils.formatKeyLabel(field.field);

        return {
          key: field.label,
          value: field.value,
          label: formattedKey,
        };
      });
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
        setConvertedImage(null);
        setFileType(file.type);
        setSelectedFile(file);

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
            setSelectedImage(null);
            setSelectedFile(null);
            if (fileInputRef.current) fileInputRef.current.value = "";
            return;
          } finally {
            setIsConverting(false);
          }
        }
      };
      reader.readAsDataURL(file);
    }
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
      handleImageUpload(syntheticEvent);
    }
  };

  const handleNextClick = () => {
    if (!selectedFile) {
      toast.error("Please select a file first");
      return;
    }

    if (!selectedDocumentType) {
      toast.error("Please select a document type");
      return;
    }

    setCurrentStep(2);

    let fileToSubmit = selectedFile as File;

    if (selectedFile && !selectedFile.type) {
      const fileName = selectedFile.name.toLowerCase();
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
        fileToSubmit = new File([selectedFile], selectedFile.name, {
          type: correctMimeType,
          lastModified: selectedFile.lastModified,
        });
      }
    }

    const formData = new FormData();
    formData.append("document", fileToSubmit);
    formData.append("document_type", selectedDocumentType);
    postOCRScanMutation.mutate({
      data: formData,
    });
  };

  const handleFieldChange = (key: string, value: string) => {
    setOcrResults((prev) =>
      prev.map((field) => (field.key === key ? { ...field, value } : field))
    );
  };

  const handleValueChange = (
    key: string,
    index: number,
    fieldName: string,
    value: string
  ) => {
    setOcrResults((prev) =>
      prev.map((field) => {
        if (field.key === key && Array.isArray(field.value)) {
          const updatedValueItem = [...field.value];
          updatedValueItem[index] = {
            ...updatedValueItem[index],
            [fieldName]: value,
          };
          return { ...field, value: updatedValueItem };
        }
        return field;
      })
    );
  };

  const removeItem = (key: string, index: number) => {
    setOcrResults((prev) =>
      prev.map((field) => {
        if (field.key === key && Array.isArray(field.value)) {
          const updatedItem = field.value.filter((_, i) => i !== index);
          return { ...field, value: updatedItem };
        }
        return field;
      })
    );
  };

  const handleSubmit = () => {
    setTimeout(() => {
      setOcrResults([]);
      setCurrentStep(1);
      setSelectedImage(null);
      setConvertedImage(null);
      setIsConverting(false);
      setSelectedDocumentType("");
      setSelectedFile(null);
      setIsDragOver(false);
    }, 500);
    onClose();
    toast.success(
      "OCR Results Populated",
      "OCR results have been populated to the form"
    );
    console.log(ocrResults);
    onSubmitProp(ocrResults);
  };

  const handleClose = () => {
    setTimeout(() => {
      setCurrentStep(1);
      setSelectedImage(null);
      setConvertedImage(null);
      setIsConverting(false);
      setSelectedDocumentType("");
      setSelectedFile(null);
      setIsDragOver(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }, 500);
    onClose();
  };

  const isPDF = useMemo(() => {
    return fileType === "application/pdf";
  }, [fileType]);

  const renderFilePreview = () => {
    if (!selectedImage) return null;

    return (
      <div className="space-y-3 h-full">
        <div className="bg-gray-100 h-full rounded-lg p-4">
          {!isPDF ? (
            isConverting ? (
              <div className="flex h-[200px] flex-col items-center justify-center py-8">
                <CommonLoader size={24} />
                <p className="text-sm text-gray-600 mt-2">
                  Converting HEIC image...
                </p>
              </div>
            ) : (
              <div className="relative group">
                <img
                  src={convertedImage || selectedImage}
                  alt="Uploaded document"
                  className="w-full h-auto max-h-80 object-contain rounded"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <button
                    onClick={handleFileSelect}
                    className="bg-white text-gray-800 px-4 py-2 rounded-lg shadow-lg hover:bg-blue-200 transition-colors duration-200 flex items-center space-x-2"
                  >
                    <ICONS.edit className="w-4 h-4 text-black" />
                  </button>
                </div>
              </div>
            )
          ) : (
            <iframe
              src={selectedImage as string}
              title="Uploaded document"
              className="w-full h-[500px] object-contain rounded"
            />
          )}
        </div>
        {isPDF && (
          <div className="flex justify-center">
            <button
              onClick={handleFileSelect}
              className="bg-blue-400 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-600 transition-colors duration-200 flex items-center space-x-2"
            >
              <ICONS.edit className="w-4 h-4" />
              <span>Change PDF</span>
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderUploadArea = () => {
    if (selectedImage) {
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
              <ICONS.upload className="text-gray-600 w-8 h-8" />
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

  const renderStep1 = () => (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-semibold text-gray-800">
          Upload Document for OCR
        </h2>
        <p className="text-gray-600 max-w-md">
          Upload an image or document to extract text and data using our OCR
          technology
        </p>
      </div>

      <div className="w-full max-w-lg space-y-6">
        <div className="space-y-2">
          <StatefulSelect
            label="Document Type"
            data={OCR_DOCUMENT_TYPES}
            value={selectedDocumentType}
            onChange={(e) => setSelectedDocumentType(e.target.value)}
            labelOption="Select document type"
            className="w-full"
          />
        </div>

        {renderUploadArea()}

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

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="flex flex-col gap-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 flex items-start space-x-2 sm:space-x-3">
          <span className="text-blue-600 flex-shrink-0 mt-0.5 text-base sm:text-lg">
            <ICONS.info className="w-4 h-4 sm:w-5 sm:h-5" />
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm text-blue-900 leading-relaxed">
              <span className="font-medium">How OCR population works:</span> The
              extracted data will be matched against your form fields.
              Duplicates and already-populated fields will be skipped. Only
              fields that exist and are empty in your form will be populated.
            </p>
          </div>
        </div>
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
                className="w-full h-[250px] object-contain rounded"
              />
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-4">
            {ocrResults.length > 0 ? (
              ocrResults.map((field) => (
                <div key={field.key} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {field.label}
                  </label>
                  {Array.isArray(field.value) && field.key === "medications" ? (
                    <div className="space-y-4">
                      <div className="space-y-4">
                        {field.value.map(
                          (medication: ClientMedications, index: number) => (
                            <div
                              key={index}
                              className="p-4 rounded-lg border border-gray-200"
                            >
                              <div className="flex items-center justify-end mb-4">
                                {field.value.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => removeItem(field.key, index)}
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    <ICONS.delete size={16} />
                                  </button>
                                )}
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <StatefulInput
                                  type="text"
                                  label="Medication Name"
                                  inputClassname="!font-normal"
                                  value={medication.medication_name || ""}
                                  onChange={(e) =>
                                    handleValueChange(
                                      field.key,
                                      index,
                                      "medication_name",
                                      e.target.value
                                    )
                                  }
                                />
                                <StatefulInput
                                  type="text"
                                  label="Dosage"
                                  inputClassname="!font-normal"
                                  value={medication.dosage || ""}
                                  onChange={(e) =>
                                    handleValueChange(
                                      field.key,
                                      index,
                                      "dosage",
                                      e.target.value
                                    )
                                  }
                                />
                                <StatefulSelect
                                  label="Frequency"
                                  labelOption="Select Frequency"
                                  data={MEDICATION_FREQUENCY_OPTIONS}
                                  value={medication.frequency || ""}
                                  onChange={(e) =>
                                    handleValueChange(
                                      field.key,
                                      index,
                                      "frequency",
                                      e.target.value
                                    )
                                  }
                                />
                                <StatefulInput
                                  type="text"
                                  label="Purpose"
                                  inputClassname="!font-normal"
                                  value={medication.purpose || ""}
                                  onChange={(e) =>
                                    handleValueChange(
                                      field.key,
                                      index,
                                      "purpose",
                                      e.target.value
                                    )
                                  }
                                />
                                <StatefulInput
                                  type="text"
                                  label="Indication"
                                  inputClassname="!font-normal"
                                  value={medication.indication || ""}
                                  onChange={(e) =>
                                    handleValueChange(
                                      field.key,
                                      index,
                                      "indication",
                                      e.target.value
                                    )
                                  }
                                />
                                <StatefulInput
                                  type="text"
                                  label="Prescribing Doctor"
                                  inputClassname="!font-normal"
                                  value={medication.prescribing_doctor || ""}
                                  onChange={(e) =>
                                    handleValueChange(
                                      field.key,
                                      index,
                                      "prescribing_doctor",
                                      e.target.value
                                    )
                                  }
                                />
                                <StatefulDatePicker
                                  label="Start Date"
                                  value={medication.start_date || ""}
                                  onChangeFunc={(date) =>
                                    handleValueChange(
                                      field.key,
                                      index,
                                      "start_date",
                                      date
                                    )
                                  }
                                />
                                <StatefulDatePicker
                                  label="End Date"
                                  value={medication.end_date || ""}
                                  onChangeFunc={(date) =>
                                    handleValueChange(
                                      field.key,
                                      index,
                                      "end_date",
                                      date
                                    )
                                  }
                                />
                                <StatefulDatePicker
                                  label="Refill Due"
                                  value={medication.refill_due || ""}
                                  onChangeFunc={(date) =>
                                    handleValueChange(
                                      field.key,
                                      index,
                                      "refill_due",
                                      date
                                    )
                                  }
                                  divClass="md:col-span-2"
                                />
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  ) : Array.isArray(field.value) &&
                    field.key === "healthcareProviders" ? (
                    <div className="space-y-4">
                      <div className="space-y-4">
                        {field.value.map(
                          (
                            healthcareProvider: HealthcareProvider,
                            index: number
                          ) => (
                            <div
                              key={index}
                              className="p-4 rounded-lg border border-gray-200"
                            >
                              <div className="flex items-center justify-end mb-4">
                                {field.value.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => removeItem(field.key, index)}
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    <ICONS.delete size={16} />
                                  </button>
                                )}
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <StatefulInput
                                  type="text"
                                  label="Provider Name"
                                  inputClassname="!font-normal"
                                  value={healthcareProvider.provider_name || ""}
                                  onChange={(e) =>
                                    handleValueChange(
                                      field.key,
                                      index,
                                      "provider_name",
                                      e.target.value
                                    )
                                  }
                                />
                                <StatefulSelect
                                  label="Specialty"
                                  labelOption="Select Specialty"
                                  value={healthcareProvider.specialty || ""}
                                  data={SPECIALTIES}
                                  onChange={(e) =>
                                    handleValueChange(
                                      field.key,
                                      index,
                                      "specialty",
                                      e.target.value
                                    )
                                  }
                                />
                                <StatefulInput
                                  type="text"
                                  label="Address"
                                  inputClassname="!font-normal"
                                  value={healthcareProvider.address || ""}
                                  onChange={(e) =>
                                    handleValueChange(
                                      field.key,
                                      index,
                                      "address",
                                      e.target.value
                                    )
                                  }
                                />
                                <StatefulPhoneInput
                                  label="Phone"
                                  value={healthcareProvider.phone || ""}
                                  onChange={(e) =>
                                    handleValueChange(
                                      field.key,
                                      index,
                                      "phone",
                                      e
                                    )
                                  }
                                />
                                <StatefulPhoneInput
                                  label="Fax"
                                  value={healthcareProvider.fax || ""}
                                  onChange={(e) =>
                                    handleValueChange(
                                      field.key,
                                      index,
                                      "fax",
                                      e
                                    )
                                  }
                                />
                                <StatefulDatePicker
                                  label="Last Visit"
                                  value={healthcareProvider.last_visit || ""}
                                  onChangeFunc={(date) =>
                                    handleValueChange(
                                      field.key,
                                      index,
                                      "last_visit",
                                      date
                                    )
                                  }
                                />
                                <StatefulDatePicker
                                  label="Next Visit"
                                  value={healthcareProvider.next_visit || ""}
                                  onChangeFunc={(date) =>
                                    handleValueChange(
                                      field.key,
                                      index,
                                      "next_visit",
                                      date
                                    )
                                  }
                                />
                                <StatefulInput
                                  label="Notes"
                                  value={healthcareProvider.notes || ""}
                                  onChange={(e) =>
                                    handleValueChange(
                                      field.key,
                                      index,
                                      "notes",
                                      e.target.value
                                    )
                                  }
                                />
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  ) : field.key.includes("date") ||
                    field.key.includes("due") ? (
                    <StatefulDatePicker
                      placeholder={field.label}
                      value={field.value || ""}
                      onChangeFunc={(date) =>
                        handleFieldChange(field.key, date)
                      }
                    />
                  ) : field.key.toLowerCase().includes("phone") ||
                    field.key.toLowerCase().includes("fax") ? (
                    <StatefulPhoneInput
                      value={field.value || ""}
                      onChange={(e) => handleFieldChange(field.key, e)}
                    />
                  ) : field.key === "state" ? (
                    <StatefulSelect
                      labelOption="Select State"
                      data={STATES}
                      value={field.value || ""}
                      onChange={(e) =>
                        handleFieldChange(field.key, e.target.value)
                      }
                    />
                  ) : (
                    <StatefulInput
                      type="text"
                      value={field.value}
                      onChange={(e) =>
                        handleFieldChange(field.key, e.target.value)
                      }
                    />
                  )}
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <p className="text-gray-600">No OCR results found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderFooter = () => {
    if (currentStep === 1) {
      return (
        <div className="flex justify-end space-x-4">
          <PrimaryButton onClick={handleNextClick} className="max-w-xs">
            Next
          </PrimaryButton>
        </div>
      );
    } else if (currentStep === 3) {
      return (
        <div className="flex justify-end space-x-4">
          <PrimaryButton onClick={handleSubmit} className="max-w-xs">
            Populate Form
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
      title="Document Text Extraction"
      maxWidth={`${
        currentStep === 1 || currentStep === 2
          ? "max-w-xl md:h-[75vh] h-[90vh]"
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
