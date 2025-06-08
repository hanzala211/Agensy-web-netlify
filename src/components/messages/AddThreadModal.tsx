import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useMemo, useRef } from "react";
import { Modal, PrimaryButton, RadioInput } from "@agensy/components";
import { addThreadFormSchema, type AddThreadFormData } from "@agensy/types";
import type { AccessInfo, Client, IUser } from "@agensy/types";
import { useAuthContext } from "@agensy/context";
import { Select } from "antd";
import { useParams } from "react-router-dom";

interface AddThreadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: AddThreadFormData) => void;
  isLoading?: boolean;
  showType?: boolean;
}

export const AddThreadModal: React.FC<AddThreadModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  showType = true,
}) => {
  const { accessUsers, clients, userData } = useAuthContext();
  const inputRef = useRef<HTMLInputElement>(null);
  const params = useParams();

  const { handleSubmit, control, reset, watch, register, setValue } =
    useForm<AddThreadFormData>({
      resolver: zodResolver(addThreadFormSchema),
      defaultValues: {
        type: showType ? "general" : "client",
        participant_id: "",
        client_id: "",
      },
    });

  useEffect(() => {
    if (watch("type") !== "client") {
      setValue("client_id", "");
    }
  }, [watch("type")]);

  useEffect(() => {
    if (watch("client_id")) {
      setValue("participant_id", "");
    }
  }, [watch("client_id")]);

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        reset({
          type: showType ? "general" : "client",
          participant_id: "",
          client_id: params.clientId || "",
        });
      }, 300);
    }
  }, [isOpen, reset]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFormSubmit = (data: AddThreadFormData) => {
    if (onSubmit) {
      onSubmit(data);
    }
  };

  const users = useMemo(() => {
    return (
      (watch("client_id") &&
        clients
          ?.find((client) => client.id === watch("client_id"))
          ?.Users.filter((user) => user.id !== userData?.id)) ||
      []
    );
  }, [clients, watch("client_id")]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Start Messaging"
      maxWidth="max-w-lg"
      height={showType ? "sm:h-[45vh] h-[70vh]" : "sm:h-[35vh] h-[50vh]"}
      footer={
        <PrimaryButton
          onClick={() => inputRef.current?.click()}
          type="button"
          className="w-fit"
          isLoading={isLoading}
          disabled={isLoading}
        >
          Start Messaging
        </PrimaryButton>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit(handleFormSubmit)}>
        {showType && (
          <div className="flex items-center justify-around">
            <RadioInput
              register={register("type")}
              label="General"
              value="general"
            />
            <RadioInput
              register={register("type")}
              label="Client"
              value="client"
            />
          </div>
        )}
        {watch("type") === "client" && showType && (
          <div>
            <label className="text-neutralGray mb-2 block">Select Client</label>
            <Controller
              name="client_id"
              control={control}
              render={({ field: { value, onChange, ...field } }) => (
                <Select
                  {...field}
                  value={value || undefined}
                  onChange={onChange}
                  showSearch
                  placeholder="Search to Select Client"
                  optionFilterProp="value"
                  style={{ width: "100%" }}
                  filterOption={(
                    input: string,
                    option: { label: string; value: string }
                  ) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  // @ts-expect-error - Antd types are not compatible with our types
                  options={
                    clients?.map((client: Client) => ({
                      label: `${client.first_name} ${client.last_name}`,
                      value: client.id as string,
                    })) || []
                  }
                />
              )}
            />
          </div>
        )}
        <div>
          <label className="text-neutralGray mb-2 block">
            Select Recipient
          </label>
          <Controller
            name="participant_id"
            control={control}
            render={({ field: { value, onChange, ...field } }) => (
              <Select
                {...field}
                value={value || undefined}
                onChange={onChange}
                showSearch
                style={{ width: "100%" }}
                placeholder="Send Message to"
                optionFilterProp="value"
                filterOption={(
                  input: string,
                  option: { label: string; value: string }
                ) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                // @ts-expect-error - Antd types are not compatible with our types
                options={
                  users.length > 0 || watch("client_id")
                    ? users?.map((user: AccessInfo) => ({
                        label: `${user.first_name} ${user.last_name}`,
                        value: user.id as string,
                      }))
                    : accessUsers?.map((user: IUser) => ({
                        label: `${user.first_name} ${user.last_name}`,
                        value: user.id as string,
                      })) || []
                }
              />
            )}
          />
        </div>

        <input type="submit" ref={inputRef} className="hidden" />
      </form>
    </Modal>
  );
};

export default AddThreadModal;
