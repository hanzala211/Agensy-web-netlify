import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useRef } from "react";
import {
  Modal,
  Input,
  Select,
  PrimaryButton,
  PhoneNumberInput,
} from "@agensy/components";
import { RELATIONSHIP_TO_CLIENT, ACCESS_ROLE_OPTIONS } from "@agensy/constants";
import { type AccessFormData, accessSchema } from "@agensy/types";

interface AddAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: unknown) => void;
  isLoading?: boolean;
}

export const AddAccessModal: React.FC<AddAccessModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<AccessFormData>({
    resolver: zodResolver(accessSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      relation: "",
      email: "",
      phone: "",
      role: "",
    },
  });

  useEffect(() => {
    if (!isOpen) {
      reset({
        first_name: "",
        last_name: "",
        relation: "",
        email: "",
        phone: "",
        role: "",
      });
    }
  }, [isOpen, reset]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFormSubmit = (data: AccessFormData) => {
    const postData = {
      ...data,
      phone: data.phone ? data.phone : null,
    };
    onSubmit(postData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={"Add User"}
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
            Add User
          </PrimaryButton>
          <PrimaryButton
            onClick={handleClose}
            type="button"
            className="w-fit bg-white !text-basicBlue border border-basicBlue hover:bg-blue-50"
            isLoading={false}
          >
            Cancel
          </PrimaryButton>
        </div>
      }
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

        <Input
          label="Email"
          type="email"
          register={register("email")}
          error={errors.email?.message}
        />

        <Input
          label="Password"
          name="password"
          type="password"
          register={register("password")}
          error={errors["password"]?.message}
          isPassword={true}
        />

        <Select
          control={control}
          name="relation"
          label="Relationship"
          data={RELATIONSHIP_TO_CLIENT}
          labelOption="Select relationship"
        />

        <PhoneNumberInput control={control} name="phone" label="Phone Number" />

        <Select
          control={control}
          name="role"
          label="Role"
          data={ACCESS_ROLE_OPTIONS}
          labelOption="Select access role"
        />

        <input type="submit" ref={inputRef} className="hidden" />
      </form>
    </Modal>
  );
};

export default AddAccessModal;
