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
import {
  type EditAccessFormData,
  editAccessSchema,
  type AccessInfo,
} from "@agensy/types";

interface EditAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: EditAccessFormData) => void;
  isLoading?: boolean;
  editData?: AccessInfo;
}

export const EditAccessModal: React.FC<EditAccessModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  editData,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<EditAccessFormData>({
    resolver: zodResolver(editAccessSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      relation: "",
      phone: "",
      role: "",
    },
  });

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        reset({
          first_name: "",
          last_name: "",
          relation: "",
          phone: "",
          role: "",
        });
      }, 200);
    }
  }, [isOpen, reset]);

  useEffect(() => {
    if (editData) {
      reset({
        first_name: editData.first_name,
        last_name: editData.last_name,
        relation: editData.relation,
        phone: editData.phone,
        role: editData.UserRoles?.role,
      });
    }
  }, [editData, reset]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFormSubmit = (data: EditAccessFormData) => {
    onSubmit?.(data);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={"Edit User"}
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
            Edit User
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

export default EditAccessModal;
