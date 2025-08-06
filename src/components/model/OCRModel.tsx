import React, { useState, useRef, useEffect, useMemo } from "react";
import { Modal } from "../common/Modal";
import { PrimaryButton } from "../common/PrimaryButton";
import { CommonLoader } from "../common/CommonLoader";
import { ICONS } from "@agensy/constants";
import {
  StatefulDatePicker,
  StatefulInput,
  StatefulSelect,
} from "@agensy/components";
import { StringUtils, toast } from "@agensy/utils";
import { isHeicImage, convertHeicToJpeg } from "../../utils/heicUtils";
import { useOCRScanMutation } from "@agensy/api";
import type { ClientMedications, OCRField } from "@agensy/types";
import { OCR_DOCUMENT_TYPES } from "@agensy/constants";

interface MappedField {
  field: string;
  label: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: string | any[];
}

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

  const handleMedicationChange = (
    key: string,
    index: number,
    fieldName: string,
    value: string
  ) => {
    setOcrResults((prev) =>
      prev.map((field) => {
        if (field.key === key && Array.isArray(field.value)) {
          const updatedMedications = [...field.value];
          updatedMedications[index] = {
            ...updatedMedications[index],
            [fieldName]: value,
          };
          return { ...field, value: updatedMedications };
        }
        return field;
      })
    );
  };

  const addMedication = (key: string) => {
    setOcrResults((prev) =>
      prev.map((field) => {
        if (field.key === key && Array.isArray(field.value)) {
          const newMedication: ClientMedications = {
            medication_name: "",
            dosage: "",
            frequency: "",
            purpose: "",
            indication: "",
            start_date: "",
            end_date: "",
            refill_due: "",
            id: "",
          };
          return { ...field, value: [...field.value, newMedication] };
        }
        return field;
      })
    );
  };

  const removeMedication = (key: string, index: number) => {
    setOcrResults((prev) =>
      prev.map((field) => {
        if (field.key === key && Array.isArray(field.value)) {
          const updatedMedications = field.value.filter((_, i) => i !== index);
          return { ...field, value: updatedMedications };
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
                PNG, JPG, PDF up to 20MB
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
                {Array.isArray(field.value) && field.key === "medications" ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <button
                        type="button"
                        onClick={() => addMedication(field.key)}
                        className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm"
                      >
                        <ICONS.plus size={14} />
                        <span>Add Medication</span>
                      </button>
                    </div>
                    <div className="space-y-4">
                      {field.value.map(
                        (medication: ClientMedications, index: number) => (
                          <div
                            key={index}
                            className="p-4 rounded-lg border border-gray-200"
                          >
                            <div className="flex items-center justify-between mb-4">
                              <span className="text-sm font-medium text-gray-700">
                                Medication {index + 1}
                              </span>
                              {field.value.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    removeMedication(field.key, index)
                                  }
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <ICONS.delete size={16} />
                                </button>
                              )}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <StatefulInput
                                type="text"
                                placeholder="Medication Name"
                                inputClassname="!font-normal"
                                value={medication.medication_name || ""}
                                onChange={(e) =>
                                  handleMedicationChange(
                                    field.key,
                                    index,
                                    "medication_name",
                                    e.target.value
                                  )
                                }
                              />
                              <StatefulInput
                                type="text"
                                placeholder="Dosage"
                                inputClassname="!font-normal"
                                value={medication.dosage || ""}
                                onChange={(e) =>
                                  handleMedicationChange(
                                    field.key,
                                    index,
                                    "dosage",
                                    e.target.value
                                  )
                                }
                              />
                              <StatefulInput
                                type="text"
                                placeholder="Frequency"
                                inputClassname="!font-normal"
                                value={medication.frequency || ""}
                                onChange={(e) =>
                                  handleMedicationChange(
                                    field.key,
                                    index,
                                    "frequency",
                                    e.target.value
                                  )
                                }
                              />
                              <StatefulInput
                                type="text"
                                placeholder="Purpose"
                                inputClassname="!font-normal"
                                value={medication.purpose || ""}
                                onChange={(e) =>
                                  handleMedicationChange(
                                    field.key,
                                    index,
                                    "purpose",
                                    e.target.value
                                  )
                                }
                              />
                              <StatefulInput
                                type="text"
                                placeholder="Indication"
                                inputClassname="!font-normal"
                                value={medication.indication || ""}
                                onChange={(e) =>
                                  handleMedicationChange(
                                    field.key,
                                    index,
                                    "indication",
                                    e.target.value
                                  )
                                }
                              />
                              <StatefulInput
                                type="text"
                                placeholder="Prescribing Doctor"
                                inputClassname="!font-normal"
                                value={medication.prescribing_doctor || ""}
                                onChange={(e) =>
                                  handleMedicationChange(
                                    field.key,
                                    index,
                                    "prescribing_doctor",
                                    e.target.value
                                  )
                                }
                              />
                              <StatefulDatePicker
                                placeholder="Start Date"
                                value={medication.start_date || ""}
                                onChangeFunc={(date) =>
                                  handleMedicationChange(
                                    field.key,
                                    index,
                                    "start_date",
                                    date
                                  )
                                }
                              />
                              <StatefulDatePicker
                                placeholder="End Date"
                                value={medication.end_date || ""}
                                onChangeFunc={(date) =>
                                  handleMedicationChange(
                                    field.key,
                                    index,
                                    "end_date",
                                    date
                                  )
                                }
                              />
                              <StatefulDatePicker
                                placeholder="Refill Due"
                                value={medication.refill_due || ""}
                                onChangeFunc={(date) =>
                                  handleMedicationChange(
                                    field.key,
                                    index,
                                    "refill_due",
                                    date
                                  )
                                }
                                divClass="col-span-2"
                              />
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                ) : field.key.includes("date") || field.key.includes("due") ? (
                  <StatefulDatePicker
                    placeholder={field.label}
                    value={field.value || ""}
                    onChangeFunc={(date) => handleFieldChange(field.key, date)}
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
            ))}
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
