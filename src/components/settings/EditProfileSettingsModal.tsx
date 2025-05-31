import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useRef } from "react";
import {
  Modal,
  Input,
  PrimaryButton,
  PhoneNumberInput,
} from "@agensy/components";
import { profileSchema, type IUser, type ProfileFormData } from "@agensy/types";

interface EditProfileSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProfileFormData) => void;
  isLoading?: boolean;
  initialData?: IUser;
}

export const EditProfileSettingsModal: React.FC<
  EditProfileSettingsModalProps
> = ({ isOpen, onClose, onSubmit, isLoading = false, initialData }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      phone: "",
    },
  });

  useEffect(() => {
    if (initialData && isOpen) {
      reset(initialData);
    }
  }, [initialData, isOpen, reset]);

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        reset({
          first_name: "",
          last_name: "",
          phone: "",
        });
      }, 300);
    }
  }, [isOpen, reset]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFormSubmit = (data: ProfileFormData) => {
    onSubmit(data);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Edit Profile Settings"
      footer={
        <PrimaryButton
          onClick={() => inputRef.current?.click()}
          type="button"
          className="w-fit"
          isLoading={isLoading}
          disabled={isLoading}
        >
          Save Changes
        </PrimaryButton>
      }
      height="h-[55%]"
      maxWidth="xl:max-w-[25%] lg:max-w-[40%] md:max-w-[50%] sm:max-w-[60%]"
    >
      <form className="space-y-4" onSubmit={handleSubmit(handleFormSubmit)}>
        <Input
          label="First Name"
          register={register("first_name")}
          error={errors.first_name?.message}
        />

        <Input
          label="Last Name"
          register={register("last_name")}
          error={errors.last_name?.message}
        />

        <PhoneNumberInput control={control} name="phone" label="Phone Number" />

        <input type="submit" ref={inputRef} className="hidden" />
      </form>
    </Modal>
  );
};

export default EditProfileSettingsModal;
