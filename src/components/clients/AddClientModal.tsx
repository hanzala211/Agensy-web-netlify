import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useRef } from "react";
import {
  clientSchema,
  type Client,
  type ClientAddRequestData,
  type ClientFormData,
} from "@agensy/types";
import {
  Modal,
  ClientPersonalInfoStep,
  PrimaryButton,
  ClientProviderInfoStep,
} from "@agensy/components";
import { DateUtils } from "@agensy/utils";

interface AddClientModalProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  title: string;
  btnText: string;
  onSubmit?: (data: ClientAddRequestData) => void;
  isButtonLoading?: boolean;
  editClient?: Client | null;
}

export const AddClientModal: React.FC<AddClientModalProps> = ({
  isOpen,
  setIsOpen,
  title,
  btnText,
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
    setValue,
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    reValidateMode: "onSubmit",
    defaultValues: {
      gender: "other",
      livingSituation: "",
      maritalStatus: "",
      dateOfBirth: "",
      firstName: "",
      lastName: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
    },
  });

  useEffect(() => {
    if (editClient) {
      reset({
        firstName: editClient.first_name,
        lastName: editClient.last_name,
        dateOfBirth: editClient.date_of_birth,
        gender: editClient.gender as "male" | "female" | "other",
        maritalStatus: editClient.marital_status,
        address: editClient.address,
        city: editClient.city,
        state: editClient.state,
        zipCode: editClient.zip,
        livingSituation: editClient.living_situation,
      });
      setValue("isEdit", true);
    } else {
      setValue("isEdit", false);
    }
  }, [editClient, reset, isOpen]);

  useEffect(() => {
    if (!isOpen && !editClient) {
      reset({
        firstName: "",
        lastName: "",
        dateOfBirth: "",
        gender: "other",
        maritalStatus: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        livingSituation: "",
      });
    }
  }, [isOpen, reset, editClient]);

  const handleClose = () => {
    setIsOpen(false);
    reset();
  };

  const onSubmit = (data: ClientFormData) => {
    const postData = {
      first_name: data.firstName,
      last_name: data.lastName,
      date_of_birth: DateUtils.changetoISO(data.dateOfBirth),
      gender: data.gender,
      marital_status: data.maritalStatus,
      address: data.address,
      city: data.city,
      state: data.state,
      zip: data.zipCode,
      living_situation: data.livingSituation,
      hospital_phone: data.hospital_phone,
      hospital_address: data.hospital_address,
      pharmacy_name: data.pharmacy_name,
      pharmacy_phone: data.pharmacy_phone,
      pharmacy_address: data.pharmacy_address,
      pharmacy_fax: data.pharmacy_fax,
      preferred_hospital: data.preferred_hospital,
    };
    if (onSubmitProp) {
      onSubmitProp(postData as ClientAddRequestData);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={title}
      footer={
        <PrimaryButton
          onClick={() => inputRef.current?.click()}
          type="submit"
          className="w-fit"
          isLoading={isButtonLoading}
          disabled={isButtonLoading}
        >
          {btnText}
        </PrimaryButton>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} id="clientForm" className="pb-4">
        <ClientPersonalInfoStep
          register={register}
          control={control}
          errors={errors}
          showLabel={editClient ? false : true}
        />
        {!editClient && (
          <ClientProviderInfoStep
            register={register}
            control={control}
            errors={errors}
          />
        )}
        <input type="submit" ref={inputRef} className="hidden" />
      </form>
    </Modal>
  );
};

export default AddClientModal;
