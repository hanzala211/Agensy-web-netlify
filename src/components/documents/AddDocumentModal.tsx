import React, { useRef, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Modal,
  Input,
  Select,
  TextArea,
  PrimaryButton,
  SecondaryButton,
  ErrorMessage,
} from "@agensy/components";
import { documentSchema } from "@agensy/types";
import type { DocumentFormData } from "@agensy/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { StringUtils, toast } from "@agensy/utils";
import { DOCUMENT_CATEGORY_OPTIONS } from "@agensy/constants";

interface AddDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: DocumentFormData) => void;
  isLoading?: boolean;
}

export const AddDocumentModal: React.FC<AddDocumentModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string>("");
  const [file, setFile] = useState<File | undefined>(undefined);

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
    if (!isOpen) {
      reset({
        documentType: "",
        title: "",
        description: "",
        file: undefined,
      });
      setFile(undefined);
      setFileName("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }, [isOpen, reset]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (
      file &&
      (file.type === "application/pdf" || file.type.startsWith("image/"))
    ) {
      setFile(file);
      setFileName(file.name);
      setValue("file", file);
    } else {
      if (fileInputRef.current) fileInputRef.current.value = "";
      toast.error("Please upload a valid file");
    }
  };

  const handleFormSubmit = (data: DocumentFormData) => {
    if (onSubmit) {
      onSubmit({ ...data, file: file as File });
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
    setFileName("");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      title="Add Document"
      maxWidth="max-w-3xl"
      height="h-[90%]"
      footer={
        <div className="flex gap-4 justify-end">
          <PrimaryButton
            onClick={() => inputRef.current?.click()}
            type="button"
            className="w-fit"
            isLoading={isLoading}
            disabled={isLoading}
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
      <form
        className="flex flex-col gap-5"
        onSubmit={handleSubmit(handleFormSubmit)}
      >
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
        />

        <Input
          label="Title"
          register={register("title", { required: true })}
          error={errors.title?.message}
        />
        <TextArea
          label="Description"
          register={register("description")}
          error={errors.description?.message}
          rows={3}
        />
        <div className="flex flex-col gap-2">
          <SecondaryButton
            onClick={() => fileInputRef.current?.click()}
            className="w-full"
            type="button"
          >
            Choose File
          </SecondaryButton>
          <input
            type="file"
            accept="application/pdf,image/*"
            onChange={handleFileChange}
            className="hidden"
            ref={fileInputRef}
          />
          <div className="text-sm text-gray-500 mt-3">
            {fileName ? fileName : "No file chosen"}
          </div>
          <ErrorMessage error={errors.file?.message as string} />
        </div>
        <input type="submit" ref={inputRef} className="hidden" />
      </form>
    </Modal>
  );
};
