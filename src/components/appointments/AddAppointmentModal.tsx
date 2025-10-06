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
import {
  APP_ACTIONS,
  APPOINTMENT_TYPES,
  ROLES,
  SUBSCRIPTION_STATUSES,
} from "@agensy/constants";
import { useAuthContext } from "@agensy/context";
import { DateUtils } from "@agensy/utils";

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
  const { handleFilterPermission } = useAuthContext();
  const inputRef = useRef<HTMLInputElement>(null);
  const { clients } = useAuthContext();

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
    setValue,
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

  const selectedClientId = watch("clientId");
  const healthCares = useMemo(() => {
    const selectedClient = clients?.find(
      (client: Client) => client.id === selectedClientId
    );
    return selectedClient?.healthcareProviders || [];
  }, [clients, selectedClientId]);

  const clientArray = (): { label: string; value: string }[] => {
    if (!clients) {
      return [];
    }
    return clients
      .filter(
        (item) =>
          item.Users.find((user) => user.UserRoles.role === ROLES.PRIMARY_USER)
            ?.subscription_status === SUBSCRIPTION_STATUSES.ACTIVE
      )
      .map((item: Client) => {
        const userPermissions = handleFilterPermission(
          item.id as string,
          APP_ACTIONS.ClientAppointmentAdd
        );
        if (userPermissions) {
          return {
            label: `${item.first_name} ${item.last_name}`,
            value: item.id || "",
          };
        }
        return null;
      })
      .filter(
        (item): item is { label: string; value: string } => item !== null
      );
  };

  useEffect(() => {
    if (
      watch("healthcare_provider_id") &&
      watch("healthcare_provider_id").length > 0
    ) {
      setValue(
        "location",
        healthCares.find((item) => item.id === watch("healthcare_provider_id"))
          ?.address || ""
      );
    }
  }, [watch("healthcare_provider_id")]);

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
        title: editData.title || "",
        appointment_type: editData.appointment_type || "",
        location: editData.location || "",
        start_time: editData.start_time
          ? DateUtils.formatDateTime(editData.start_time)
          : "",
        end_time: editData.end_time
          ? DateUtils.formatDateTime(editData.end_time)
          : "",
        notes: editData.notes || "",
        clientId: editData.client_id || "",
        healthcare_provider_id: editData.healthcare_provider_id || "",
      });
    }
  }, [editData, reset]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFormSubmit = (data: AppointmentFormData) => {
    console.log(data);
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
          {editData ? "Update Appointment" : "Add  Appointment"}
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
          label="Care Recipient"
          data={clientArray()}
          labelOption="Select Care Recipient"
        />

        <Select
          control={control}
          name="healthcare_provider_id"
          label="Healthcare Provider"
          data={
            healthCares
              ?.filter(
                (item: HealthcareProvider) =>
                  item && item.id && item.provider_name
              )
              ?.map((item: HealthcareProvider) => ({
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
