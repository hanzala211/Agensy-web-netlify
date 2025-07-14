import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useRef } from "react";
import {
  Modal,
  PrimaryButton,
  Input,
  DatePickerField,
  TextArea,
  ModalArrayField,
  Select,
} from "@agensy/components";
import {
  medicalHistorySchema,
  type ClientMedical,
  type MedicalHistoryArrayField,
  type MedicalHistoryFormData,
} from "@agensy/types";
import { COGNITIVE_STATUS } from "@agensy/constants";

interface AddClientMedicalHistoryProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit?: (data: MedicalHistoryFormData) => void;
  isLoading?: boolean;
  editData?: ClientMedical | null;
}

export const AddClientMedicalHistory: React.FC<
  AddClientMedicalHistoryProps
> = ({ isOpen, setIsOpen, onSubmit, isLoading = false, editData }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
    setValue,
    watch,
  } = useForm<MedicalHistoryFormData>({
    resolver: zodResolver(medicalHistorySchema),
    defaultValues: {
      diagnoses: [""],
      allergies: [""],
      dietary_restrictions: [""],
      surgical_history: [""],
      cognitive_status: "",
      last_cognitive_screening: "",
      cognitive_score: 0,
      total_score: 0,
      notes: "",
    },
  });

  useEffect(() => {
    if (!isOpen && !editData) {
      reset({
        diagnoses: [""],
        allergies: [""],
        dietary_restrictions: [""],
        surgical_history: [""],
        cognitive_status: "",
        last_cognitive_screening: "",
        cognitive_score: 0,
        total_score: 0,
        notes: "",
      });
    }
  }, [isOpen, reset, editData]);

  useEffect(() => {
    if (editData) {
      reset({
        diagnoses: editData?.diagnoses?.split(", "),
        allergies: editData?.allergies?.split(", "),
        dietary_restrictions: editData?.dietary_restrictions?.split(", "),
        surgical_history: editData?.surgical_history?.split(", "),
        cognitive_status: editData?.cognitive_status,
        last_cognitive_screening: editData?.last_cognitive_screening,
        cognitive_score: parseInt(editData?.cognitive_score?.split("/")[0]),
        total_score: parseInt(editData?.cognitive_score?.split("/")[1]),
        notes: editData?.notes,
      });
    }
  }, [editData, reset, isOpen]);

  const handleClose = () => {
    setIsOpen(false);
    reset();
  };

  const handleFormSubmit = (data: MedicalHistoryFormData) => {
    if (onSubmit) onSubmit(data);
  };

  const addArrayItem = (field: MedicalHistoryArrayField) => {
    const currentValue = watch(field);
    setValue(field, [...currentValue, ""]);
  };

  const removeArrayItem = (field: MedicalHistoryArrayField, index: number) => {
    const currentValue = watch(field);
    setValue(
      field,
      currentValue.filter((_, i) => i !== index)
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={editData ? "Edit Medical History" : "Add Medical History"}
      footer={
        <PrimaryButton
          onClick={() => inputRef.current?.click()}
          type="button"
          className="w-fit"
          isLoading={isLoading}
          disabled={isLoading}
        >
          {editData ? "Save Changes" : "Save Medical History"}
        </PrimaryButton>
      }
    >
      <form className="space-y-6" onSubmit={handleSubmit(handleFormSubmit)}>
        <ModalArrayField
          label="Diagnosis"
          items={watch("diagnoses")}
          register={register}
          errors={errors}
          removeArrayItem={removeArrayItem}
          addArrayItem={addArrayItem}
          field="diagnoses"
        />
        <ModalArrayField
          label="Allergies"
          items={watch("allergies")}
          register={register}
          errors={errors}
          removeArrayItem={removeArrayItem}
          addArrayItem={addArrayItem}
          field="allergies"
        />
        <ModalArrayField
          label="Dietary Restrictions"
          items={watch("dietary_restrictions")}
          register={register}
          errors={errors}
          removeArrayItem={removeArrayItem}
          addArrayItem={addArrayItem}
          field="dietary_restrictions"
        />
        <ModalArrayField
          label="Surgical History"
          items={watch("surgical_history")}
          register={register}
          errors={errors}
          removeArrayItem={removeArrayItem}
          addArrayItem={addArrayItem}
          field="surgical_history"
        />
        <Select
          label="Cognitive Status"
          control={control}
          labelOption="Select Cognitive Status"
          name="cognitive_status"
          data={COGNITIVE_STATUS as { label: string; value: string }[]}
        />

        <DatePickerField
          control={control}
          name="last_cognitive_screening"
          label="Last Cognitive Screening"
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            type="number"
            label="Cognitive Score"
            register={register("cognitive_score", { valueAsNumber: true })}
            error={errors.cognitive_score?.message}
            placeholder="e.g., 26 (from MMSE or SLUMS)"
          />

          <Input
            label="Total Score"
            type="number"
            register={register("total_score", { valueAsNumber: true })}
            error={errors.total_score?.message}
            placeholder="e.g., 30 (MMSE) or 30 (SLUMS)"
          />
        </div>

        <TextArea
          label="Notes"
          register={register("notes")}
          error={errors.notes?.message}
          rows={4}
          placeholder="Please specify assessment type (MMSE or SLUMS) and any additional observations..."
        />

        <input type="submit" ref={inputRef} className="hidden" />
      </form>
    </Modal>
  );
};

export default AddClientMedicalHistory;
