import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useRef } from "react";
import {
  Modal,
  PrimaryButton,
  Input,
  DatePickerField,
  Select,
  TextArea,
} from "@agensy/components";
import type { ClientMedications } from "@agensy/types";
import { medicationSchema, type MedicationFormData } from "@agensy/types";
import { MEDICATION_FREQUENCY_OPTIONS } from "@agensy/constants";

interface AddMedicationModalProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit: (data: MedicationFormData) => void;
  isLoading?: boolean;
  editMedication?: ClientMedications | null;
}

export const AddMedicationModal: React.FC<AddMedicationModalProps> = ({
  isOpen,
  setIsOpen,
  onSubmit,
  isLoading = false,
  editMedication,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<MedicationFormData>({
    resolver: zodResolver(medicationSchema),
    defaultValues: {
      medication_name: "",
      dosage: "",
      frequency: "",
      purpose: "",
      prescribing_doctor: "",
      start_date: "",
      end_date: "",
      refill_due: "",
      notes: "",
    },
  });

  useEffect(() => {
    if (editMedication) {
      reset({
        medication_name: editMedication.medication_name || "",
        dosage: editMedication.dosage || "",
        frequency: editMedication.frequency || "",
        purpose: editMedication.purpose || "",
        prescribing_doctor: editMedication.prescribing_doctor || "",
        start_date: editMedication.start_date || "",
        end_date: editMedication.end_date || "",
        refill_due: editMedication.refill_due || "",
        notes: editMedication.notes as string,
      });
    }
  }, [editMedication, reset, isOpen]);

  useEffect(() => {
    if (!isOpen && !editMedication) {
      setTimeout(() => {
        reset({
          medication_name: "",
          dosage: "",
          frequency: "",
          purpose: "",
          prescribing_doctor: "",
          start_date: "",
          end_date: "",
          refill_due: "",
          notes: "",
        });
      }, 200);
    }
  }, [isOpen, reset, editMedication]);

  const handleClose = () => {
    setIsOpen(false);
    reset();
  };

  const handleFormSubmit = (data: MedicationFormData) => {
    onSubmit(data);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={editMedication ? "Edit Medication" : "Add Medication"}
      footer={
        <PrimaryButton
          onClick={() => inputRef.current?.click()}
          type="button"
          className="w-fit"
          isLoading={isLoading}
          disabled={isLoading}
        >
          {editMedication ? "Save Changes" : "Save Medication"}
        </PrimaryButton>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit(handleFormSubmit)}>
        <Input
          label="Medication Name"
          register={register("medication_name")}
          error={errors.medication_name?.message}
        />

        <Input
          label="Dosage"
          register={register("dosage")}
          error={errors.dosage?.message}
        />

        <Select
          control={control}
          name="frequency"
          label="Frequency"
          data={MEDICATION_FREQUENCY_OPTIONS}
          labelOption="Select frequency"
        />

        <Input
          label="Purpose"
          register={register("purpose")}
          error={errors.purpose?.message}
        />

        <Input
          label="Prescribing Doctor"
          register={register("prescribing_doctor")}
          error={errors.prescribing_doctor?.message}
        />

        <DatePickerField
          control={control}
          name="refill_due"
          label="Refill Due"
        />

        <DatePickerField
          control={control}
          name="start_date"
          label="Start Date"
        />

        <DatePickerField control={control} name="end_date" label="End Date" />
        <TextArea register={register("notes")} label="Note" />

        <input type="submit" ref={inputRef} className="hidden" />
      </form>
    </Modal>
  );
};

export default AddMedicationModal;
