import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useRef } from "react";
import {
  hospitalSchema,
  type Client,
  type HospitalFormData,
} from "@agensy/types";
import {
  Modal,
  ClientProviderInfoStep,
  PrimaryButton,
} from "@agensy/components";

interface EditClientHealthcareModalProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit?: (data: HospitalFormData) => void;
  isButtonLoading?: boolean;
  editClient?: Client | null;
}

export const EditClientHealthcareModal: React.FC<
  EditClientHealthcareModalProps
> = ({
  isOpen,
  setIsOpen,
  onSubmit: onSubmitProp,
  isButtonLoading = false,
  editClient,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<HospitalFormData>({
    resolver: zodResolver(hospitalSchema),
    defaultValues: {
      preferred_hospital: "",
      hospital_phone: "",
      hospital_address: "",
      pharmacy_name: "",
      pharmacy_phone: "",
      pharmacy_address: "",
      pharmacy_fax: "",
    },
  });

  useEffect(() => {
    if (editClient) {
      reset({
        preferred_hospital: editClient.preferred_hospital || "",
        hospital_phone: editClient.hospital_phone || "",
        hospital_address: editClient.hospital_address || "",
        pharmacy_name: editClient.pharmacy_name || "",
        pharmacy_phone: editClient.pharmacy_phone || "",
        pharmacy_address: editClient.pharmacy_address || "",
        pharmacy_fax: editClient.pharmacy_fax || "",
      });
    }
  }, [editClient, reset, isOpen]);

  useEffect(() => {
    if (!isOpen && !editClient) {
      reset({
        preferred_hospital: "",
        hospital_phone: "",
        hospital_address: "",
        pharmacy_name: "",
        pharmacy_phone: "",
        pharmacy_address: "",
        pharmacy_fax: "",
      });
    }
  }, [isOpen, reset, editClient]);

  const handleClose = () => {
    setIsOpen(false);
    reset();
  };

  const onSubmit = (data: HospitalFormData) => {
    if (onSubmitProp) onSubmitProp(data);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Edit Healthcare Information"
      footer={
        <PrimaryButton
          onClick={() => inputRef.current?.click()}
          className="w-fit"
          isLoading={isButtonLoading}
          disabled={isButtonLoading}
        >
          Save Changes
        </PrimaryButton>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <ClientProviderInfoStep
          register={register}
          control={control}
          errors={errors}
          showLabel={false}
        />
        <input type="submit" ref={inputRef} className="hidden" />
      </form>
    </Modal>
  );
};

export default EditClientHealthcareModal;
