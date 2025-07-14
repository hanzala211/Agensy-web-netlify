import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useRef } from "react";
import {
  clientHealthProviderSchema,
  type ClientHealthProviderFormData,
  type HealthcareProvider,
} from "@agensy/types";
import {
  DatePickerField,
  Input,
  Modal,
  PhoneNumberInput,
  PrimaryButton,
  Select,
  TextArea,
} from "@agensy/components";
import { SPECIALTIES } from "@agensy/constants";
import { DateUtils } from "@agensy/utils";

interface AddClientHealthProviderModalProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  title: string;
  btnText: string;
  onSubmit?: (data: ClientHealthProviderFormData) => void;
  isButtonLoading?: boolean;
  editItem?: HealthcareProvider;
}

export const AddClientHealthProviderModal: React.FC<
  AddClientHealthProviderModalProps
> = ({
  isOpen,
  setIsOpen,
  title,
  btnText,
  onSubmit: onSubmitProp,
  isButtonLoading = false,
  editItem,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<ClientHealthProviderFormData>({
    resolver: zodResolver(clientHealthProviderSchema),
    defaultValues: {
      provider_type: "",
      provider_name: "",
      specialty: "",
      address: "",
      phone: "",
      fax: "",
      last_visit: "",
      next_visit: "",
      notes: "",
    },
  });

  useEffect(() => {
    if (editItem) {
      reset({
        provider_name: editItem.provider_name,
        provider_type: editItem.provider_type,
        last_visit: editItem.last_visit
          ? DateUtils.formatDateToRequiredFormat(editItem.last_visit)
          : "",
        specialty: editItem.specialty,
        address: editItem.address,
        phone: editItem.phone,
        fax: editItem.fax,
        next_visit: editItem.next_visit
          ? DateUtils.formatDateToRequiredFormat(editItem.next_visit)
          : "",
        notes: editItem.notes,
      });
    }
  }, [editItem, isOpen]);

  useEffect(() => {
    if (!isOpen && !editItem) {
      setTimeout(() => {
        reset({
          provider_name: "",
          provider_type: "",
          last_visit: "",
          specialty: "",
          address: "",
          phone: "",
          fax: "",
          next_visit: "",
          notes: "",
        });
      }, 300);
    }
  }, [isOpen, reset, editItem]);

  const handleClose = () => {
    setIsOpen(false);
    reset();
  };

  const onSubmit = (data: ClientHealthProviderFormData) => {
    if (onSubmitProp) {
      onSubmitProp(data);
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
      <form onSubmit={handleSubmit(onSubmit)} className="pb-4 space-y-4">
        <Input
          label="Provider Type"
          register={register("provider_type")}
          error={errors.provider_type?.message}
        />

        <Input
          label="Provider Name"
          register={register("provider_name")}
          error={errors.provider_name?.message}
        />

        <Select
          label="Specialty"
          control={control}
          data={SPECIALTIES}
          name="specialty"
          labelOption="Select Specialty"
        />

        <Input
          label="Address"
          register={register("address")}
          error={errors.address?.message}
        />

        <PhoneNumberInput control={control} name="phone" label="Phone" />

        <PhoneNumberInput control={control} name="fax" label="Fax" />

        <DatePickerField
          control={control}
          name="last_visit"
          label="Last Visit"
        />

        <DatePickerField
          control={control}
          name="next_visit"
          label="Next Visit"
        />

        <TextArea register={register("notes")} label="Note" />
        <input type="submit" className="hidden" ref={inputRef} />
      </form>
    </Modal>
  );
};

export default AddClientHealthProviderModal;
