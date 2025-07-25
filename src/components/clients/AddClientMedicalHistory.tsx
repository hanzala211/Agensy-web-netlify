import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useRef } from "react";
import {
  Modal,
  PrimaryButton,
  DatePickerField,
  TextArea,
  ModalArrayField,
  Select,
  ScoringInput,
} from "@agensy/components";
import {
  medicalHistorySchema,
  type ClientMedical,
  type MedicalHistoryArrayField,
  type MedicalHistoryFormData,
} from "@agensy/types";
import { COGNITIVE_STATUS, TEST_TYPES } from "@agensy/constants";
import { DateUtils } from "@agensy/utils";

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
      cognitive_score: "",
      notes: "",
      cognitive_status_text: "",
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
        cognitive_score: "",
        notes: "",
        cognitive_status_text: "",
      });
    }
  }, [isOpen, reset, editData]);

  useEffect(() => {
    if (editData) {
      reset({
        diagnoses: editData?.diagnoses ? editData?.diagnoses?.split(", ") : [],
        allergies: editData?.allergies ? editData?.allergies?.split(", ") : [],
        dietary_restrictions: editData?.dietary_restrictions
          ? editData?.dietary_restrictions?.split(", ")
          : [],
        surgical_history: editData?.surgical_history
          ? editData?.surgical_history?.split(", ")
          : [],
        cognitive_status:
          editData?.cognitive_status && editData?.cognitive_status.length > 0
            ? COGNITIVE_STATUS.some(
                (item) => item?.value === editData?.cognitive_status
              )
              ? editData?.cognitive_status
              : "Other"
            : "",
        cognitive_status_text: COGNITIVE_STATUS.some(
          (item) => item?.value === editData?.cognitive_status
        )
          ? ""
          : editData?.cognitive_status
          ? editData?.cognitive_status
          : "",
        last_cognitive_screening: DateUtils.formatDateToRequiredFormat(
          editData?.last_cognitive_screening
        ),
        cognitive_score: editData?.cognitive_score || "",
        notes: editData?.notes || "",
        test_type: editData.test_type || "",
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
    const currentValue = watch(field) || [];
    setValue(field, [...currentValue, ""]);
  };

  const removeArrayItem = (field: MedicalHistoryArrayField, index: number) => {
    const currentValue = watch(field) || [];
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
          items={watch("diagnoses") as string[]}
          register={register}
          errors={errors}
          removeArrayItem={removeArrayItem}
          addArrayItem={addArrayItem}
          field="diagnoses"
        />
        <ModalArrayField
          label="Allergies"
          items={watch("allergies") as string[]}
          register={register}
          errors={errors}
          removeArrayItem={removeArrayItem}
          addArrayItem={addArrayItem}
          field="allergies"
        />
        <ModalArrayField
          label="Dietary Restrictions"
          items={watch("dietary_restrictions") as string[]}
          register={register}
          errors={errors}
          removeArrayItem={removeArrayItem}
          addArrayItem={addArrayItem}
          field="dietary_restrictions"
        />
        <ModalArrayField
          label="Surgical History"
          items={watch("surgical_history") as string[]}
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
          enableTextInput={true}
          textInputTriggerValue="Other"
          textInputName="cognitive_status_text"
          textInputPlaceholder="Enter Cognitive Status"
        />

        <DatePickerField
          control={control}
          name="last_cognitive_screening"
          label="Last Cognitive Screening"
        />

        <div className="grid md:grid-cols-2 gap-4">
          <ScoringInput
            control={control}
            name="cognitive_score"
            label="Cognitive Score"
            placeholder="e.g., 26/30 (from MMSE or SLUMS)"
          />
          <Select
            label="Test Type"
            control={control}
            labelOption="Select Test Type"
            name="test_type"
            data={TEST_TYPES as { label: string; value: string }[]}
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
