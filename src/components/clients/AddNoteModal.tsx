import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useRef } from "react";
import { Modal, TextArea, PrimaryButton } from "@agensy/components";
import { noteSchema, type NoteFormData } from "@agensy/types";

interface AddNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: NoteFormData) => void;
  isLoading?: boolean;
  initialNote?: string;
}

export const AddNoteModal: React.FC<AddNoteModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  initialNote = "",
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<NoteFormData>({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      note: initialNote,
    },
  });

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        reset({ note: "" });
      }, 300);
    }
  }, [isOpen, reset]);

  useEffect(() => {
    if (initialNote) {
      reset({ note: initialNote });
    }
  }, [initialNote, reset]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFormSubmit = (data: NoteFormData) => {
    onSubmit(data);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={`${initialNote ? "Edit Note" : "Add Note"}`}
      maxWidth="max-w-md"
      height="h-[60vh]"
      footer={
        <PrimaryButton
          onClick={() => inputRef.current?.click()}
          type="button"
          className="w-fit"
          isLoading={isLoading}
          disabled={isLoading}
        >
          {initialNote ? "Save Changes" : "Save Note"}
        </PrimaryButton>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit(handleFormSubmit)}>
        <TextArea
          label="Note"
          register={register("note")}
          error={errors.note?.message}
          rows={13}
          placeholder="Enter your note here..."
        />
        <input type="submit" ref={inputRef} className="hidden" />
      </form>
    </Modal>
  );
};

export default AddNoteModal;
