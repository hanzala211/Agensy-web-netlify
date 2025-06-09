import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useMemo, useRef } from "react";
import {
  Modal,
  Input,
  Select,
  TextArea,
  PrimaryButton,
  DatePickerField,
} from "@agensy/components";
import { appointmentSchema } from "@agensy/types";
import type {
  Appointment,
  AppointmentFormData,
  Client,
  HealthcareProvider,
} from "@agensy/types";
import { APPOINTMENT_TYPES } from "@agensy/constants";
import { useAuthContext } from "@agensy/context";

interface AddAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: AppointmentFormData) => void;
  isLoading?: boolean;
  editData?: Appointment;
}

export const AddAppointmentModal: React.FC<AddAppointmentModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  editData,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { clients } = useAuthContext();

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      title: "",
      appointment_type: "",
      location: "",
      start_time: "",
      end_time: "",
      notes: "",
      clientId: "",
      healthcare_provider_id: "",
    },
  });

  const healthCares = useMemo(() => {
    return clients
      ?.filter((client: Client) => client.id === watch("clientId"))
      ?.map((client: Client) => client.healthcareProviders);
  }, [clients, watch("clientId")]);

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        reset({
          title: "",
          appointment_type: "",
          location: "",
          start_time: "",
          end_time: "",
          notes: "",
          clientId: "",
          healthcare_provider_id: "",
        });
      }, 300);
    }
  }, [isOpen, reset]);

  useEffect(() => {
    if (editData) {
      reset({
        title: editData.title,
        appointment_type: editData.appointment_type,
        location: editData.location,
        start_time: editData.start_time,
        end_time: editData.end_time,
        notes: editData.notes,
        clientId: editData.client_id,
        healthcare_provider_id: editData.healthcare_provider_id,
      });
    }
  }, [editData, reset]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFormSubmit = (data: AppointmentFormData) => {
    if (onSubmit) {
      onSubmit(data);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={editData ? "Edit Appointment" : "Add Appointment"}
      maxWidth="max-w-2xl"
      height="h-[80%]"
      footer={
        <PrimaryButton
          onClick={() => inputRef.current?.click()}
          type="button"
          className="w-fit"
          isLoading={isLoading}
          disabled={isLoading}
        >
          {editData ? "Update Appointment" : "Save Appointment"}
        </PrimaryButton>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit(handleFormSubmit)}>
        <Input
          label="Title"
          register={register("title")}
          error={errors.title?.message}
        />

        <Select
          control={control}
          name="appointment_type"
          label="Type"
          data={APPOINTMENT_TYPES}
          labelOption="Select Appointment Type"
        />

        <Select
          control={control}
          name="clientId"
          label="Client"
          data={
            clients?.map((client: Client) => ({
              label: `${client.first_name} ${client.last_name}`,
              value: client.id as string,
            })) || []
          }
          labelOption="Select Client"
        />

        <Select
          control={control}
          name="healthcare_provider_id"
          label="Healthcare Provider"
          data={
            healthCares?.flat()?.map((item: HealthcareProvider) => ({
              label: `${item.provider_name}`,
              value: item.id as string,
            })) || []
          }
          labelOption="Select Healthcare Provider"
        />

        <Input
          label="Location"
          register={register("location")}
          error={errors.location?.message}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DatePickerField
            control={control}
            name="start_time"
            label="Start Time"
            showTime={true}
            placeholder="YYYY-MM-DD HH:MM AM/PM"
          />

          <DatePickerField
            control={control}
            name="end_time"
            label="End Time"
            showTime={true}
            placeholder="YYYY-MM-DD HH:MM AM/PM"
          />
        </div>

        <TextArea
          label="Notes"
          register={register("notes")}
          error={errors.notes?.message}
          rows={3}
        />

        {editData &&
          editData.active &&
          new Date(editData.end_time) < new Date() && (
            <TextArea
              label="Post Appointment Notes"
              register={register("post_appointment_notes")}
              error={errors.post_appointment_notes?.message}
              rows={3}
            />
          )}
        <input type="submit" ref={inputRef} className="hidden" />
      </form>
    </Modal>
  );
};

export default AddAppointmentModal;
