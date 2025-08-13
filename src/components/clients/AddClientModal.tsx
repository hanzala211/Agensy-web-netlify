import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useRef } from "react";
import { clientSchema, type Client, type ClientFormData } from "@agensy/types";
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
  onSubmit?: (data: ClientFormData) => void;
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
        firstName: editClient.first_name ? editClient.first_name : "",
        lastName: editClient.last_name ? editClient.last_name : "",
        dateOfBirth: editClient.date_of_birth
          ? DateUtils.formatDateToRequiredFormat(editClient.date_of_birth)
          : "",
        gender: editClient.gender ? editClient.gender : "",
        maritalStatus: editClient.marital_status
          ? editClient.marital_status
          : "",
        address: editClient.address ? editClient.address : "",
        city: editClient.city ? editClient.city : "",
        state: editClient.state ? editClient.state : "",
        zipCode: editClient.zip ? editClient.zip : "",
        livingSituation: editClient.living_situation
          ? editClient.living_situation
          : "",
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
      firstName: data.firstName,
      lastName: data.lastName,
      dateOfBirth: data.dateOfBirth
        ? DateUtils.changetoISO(data.dateOfBirth)
        : null,
      gender: data.gender ? data.gender : null,
      maritalStatus: data.maritalStatus ? data.maritalStatus : null,
      address: data.address ? data.address : null,
      city: data.city ? data.city : null,
      state: data.state ? data.state : null,
      zipCode: data.zipCode ? data.zipCode : null,
      livingSituation: data.livingSituation ? data.livingSituation : null,
      hospital_phone: data.hospital_phone ? data.hospital_phone : null,
      hospital_address: data.hospital_address ? data.hospital_address : null,
      pharmacy_name: data.pharmacy_name ? data.pharmacy_name : null,
      pharmacy_phone: data.pharmacy_phone ? data.pharmacy_phone : null,
      pharmacy_address: data.pharmacy_address ? data.pharmacy_address : null,
      pharmacy_fax: data.pharmacy_fax ? data.pharmacy_fax : null,
      preferred_hospital: data.preferred_hospital
        ? data.preferred_hospital
        : null,
    };
    if (onSubmitProp) {
      onSubmitProp(postData as unknown as ClientFormData);
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
