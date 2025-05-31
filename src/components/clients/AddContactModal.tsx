import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Modal,
  Input,
  PrimaryButton,
  PhoneNumberInput,
  Select,
} from "@agensy/components";
import { RELATIONSHIP_TO_CLIENT } from "@agensy/constants";
import { contactSchema } from "@agensy/types";
import type { ClientContact, ContactFormData } from "@agensy/types";
import { useEffect, useRef } from "react";

interface AddContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ContactFormData) => void;
  isLoading?: boolean;
  editContact?: ClientContact | null;
}

export const AddContactModal = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  editContact,
}: AddContactModalProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      contact_type: "primary",
      first_name: "",
      last_name: "",
      relationship: "daughter",
      phone: "",
    },
  });

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        reset({
          contact_type: "primary",
          first_name: "",
          last_name: "",
          relationship: "daughter",
          phone: "",
        });
      }, 300);
    }
  }, [isOpen]);

  useEffect(() => {
    if (editContact && isOpen) {
      reset({
        first_name: editContact.first_name,
        last_name: editContact.last_name,
        relationship: editContact.relationship,
        phone: editContact.phone,
        contact_type: editContact.contact_type,
      });
    }
  }, [editContact, reset, isOpen]);

  const handleClose = () => {
    onClose();
    reset({
      contact_type: "primary",
      first_name: "",
      last_name: "",
      relationship: "daughter",
      phone: "",
    });
  };

  const handleFormSubmit = (data: ContactFormData) => {
    onSubmit(data);
  };

  const contactTypeOptions = [
    { label: "Primary", value: "primary" },
    { label: "Secondary", value: "secondary" },
    { label: "Emergency", value: "emergency" },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={editContact ? "Edit Contact" : "Add New Contact"}
      footer={
        <PrimaryButton
          onClick={() => inputRef.current?.click()}
          type="button"
          className="w-fit"
          isLoading={isLoading}
          disabled={isLoading}
        >
          {editContact ? "Update Contact" : "Add Contact"}
        </PrimaryButton>
      }
    >
      <form className="space-y-6" onSubmit={handleSubmit(handleFormSubmit)}>
        <Select
          control={control}
          name="contact_type"
          label="Contact Type"
          data={contactTypeOptions}
          aria_label="Select contact type"
        />

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
          label="Relationship"
          control={control}
          name="relationship"
          data={RELATIONSHIP_TO_CLIENT}
        />

        <PhoneNumberInput control={control} name="phone" label="Phone Number" />
        <input type="submit" ref={inputRef} className="hidden" />
      </form>
    </Modal>
  );
};

export default AddContactModal;
