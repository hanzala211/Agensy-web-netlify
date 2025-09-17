import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useRef, useMemo } from "react";
import {
  clientSchema,
  type Client,
  type ClientFormData,
  type IUser,
} from "@agensy/types";
import {
  Modal,
  ClientPersonalInfoStep,
  PrimaryButton,
  ClientProviderInfoStep,
} from "@agensy/components";
import { DateUtils, toast } from "@agensy/utils";
import { useAuthContext } from "@agensy/context";
import { useNavigate } from "react-router-dom";
import { ROLES, SUBSCRIPTION_STATUSES } from "@agensy/constants";

interface AddClientModalProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  title: string;
  btnText: string;
  onSubmit?: (data: ClientFormData) => void;
  isButtonLoading?: boolean;
  editClient?: Client | null;
}

export const AddClientModal: React.FC<AddClientModalProps> = ({
  isOpen,
  setIsOpen,
  title,
  btnText,
  onSubmit: onSubmitProp,
  isButtonLoading = false,
  editClient,
}) => {
  const { userData, accessUsers } = useAuthContext();
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
    setValue,
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    reValidateMode: "onSubmit",
    defaultValues: {
      gender: "other",
      livingSituation: "",
      maritalStatus: "",
      dateOfBirth: "",
      firstName: "",
      lastName: "",
      preferredName: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      familyAdminId: "",
      showFamilyAdmin: false,
    },
  });

  const hasAdminRole =
    userData?.Roles?.some((role) => role.role === ROLES.ADMIN) ||
    userData?.UserRoles?.some((role) => role.role === ROLES.ADMIN);

  const familyAdmins = useMemo(() => {
    const filteredUsers =
      accessUsers?.filter((user: IUser) => {
        return user.Roles?.some((role) => role.role === ROLES.PRIMARY_USER);
      }) || [];

    if (
      userData &&
      userData.Roles?.some((role) => role.role === ROLES.PRIMARY_USER)
    ) {
      return [userData, ...filteredUsers];
    }

    return filteredUsers;
  }, [accessUsers, userData]);

  useEffect(() => {
    if (editClient) {
      reset({
        firstName: editClient.first_name ? editClient.first_name : "",
        lastName: editClient.last_name ? editClient.last_name : "",
        preferredName: editClient.preferred_name
          ? editClient.preferred_name
          : "",
        dateOfBirth: editClient.date_of_birth
          ? DateUtils.formatDateToRequiredFormat(editClient.date_of_birth)
          : "",
        gender: editClient.gender ? editClient.gender : "",
        maritalStatus: editClient.marital_status
          ? editClient.marital_status
          : "",
        address: editClient.address ? editClient.address : "",
        city: editClient.city ? editClient.city : "",
        state: editClient.state ? editClient.state : "",
        zipCode: editClient.zip ? editClient.zip : "",
        livingSituation: editClient.living_situation
          ? editClient.living_situation
          : "",
        familyAdminId: "",
        showFamilyAdmin: hasAdminRole,
      });
      setValue("isEdit", true);
    } else {
      setValue("isEdit", false);
      setValue("showFamilyAdmin", hasAdminRole);
    }
  }, [editClient, reset, isOpen, hasAdminRole, setValue]);

  useEffect(() => {
    if (!isOpen && !editClient) {
      reset({
        firstName: "",
        lastName: "",
        preferredName: "",
        dateOfBirth: "",
        gender: "other",
        maritalStatus: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        livingSituation: "",
        familyAdminId: "",
        showFamilyAdmin: hasAdminRole,
      });
    }
  }, [isOpen, reset, editClient]);

  const handleClose = () => {
    setIsOpen(false);
    reset();
  };

  const onSubmit = (data: ClientFormData) => {
    if (
      (userData?.subscription_status === SUBSCRIPTION_STATUSES.INACTIVE ||
        userData?.subscription_status === SUBSCRIPTION_STATUSES.CANCELLED) &&
      userData.Roles?.some((item) => item.role !== ROLES.ADMIN)
    ) {
      toast.error(
        "Subscription Error!",
        "Please upgrade your subscription to add a care recipient."
      );
      navigate("/settings/billing");
      return;
    }
    const postData = {
      firstName: data.firstName,
      lastName: data.lastName,
      preferredName: data.preferredName ? data.preferredName : null,
      dateOfBirth: data.dateOfBirth
        ? DateUtils.changetoISO(data.dateOfBirth)
        : null,
      gender: data.gender ? data.gender : null,
      maritalStatus: data.maritalStatus ? data.maritalStatus : null,
      address: data.address ? data.address : null,
      city: data.city ? data.city : null,
      state: data.state ? data.state : null,
      zipCode: data.zipCode ? data.zipCode : null,
      livingSituation: data.livingSituation ? data.livingSituation : null,
      hospital_phone: data.hospital_phone ? data.hospital_phone : null,
      hospital_address: data.hospital_address ? data.hospital_address : null,
      pharmacy_name: data.pharmacy_name ? data.pharmacy_name : null,
      pharmacy_phone: data.pharmacy_phone ? data.pharmacy_phone : null,
      pharmacy_address: data.pharmacy_address ? data.pharmacy_address : null,
      pharmacy_fax: data.pharmacy_fax ? data.pharmacy_fax : null,
      preferred_hospital: data.preferred_hospital
        ? data.preferred_hospital
        : null,
      familyAdminId: data.familyAdminId ? data.familyAdminId : null,
    };
    if (onSubmitProp) {
      onSubmitProp(postData as unknown as ClientFormData);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={title}
      footer={
        <PrimaryButton
          onClick={() => inputRef.current?.click()}
          type="submit"
          className="w-fit"
          isLoading={isButtonLoading}
          disabled={isButtonLoading}
        >
          {btnText}
        </PrimaryButton>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} id="clientForm" className="pb-4">
        <ClientPersonalInfoStep
          register={register}
          hasAdminRole={hasAdminRole && !editClient}
          control={control}
          errors={errors}
          showLabel={editClient ? false : true}
          familyAdmins={familyAdmins}
        />
        {!editClient && (
          <ClientProviderInfoStep
            register={register}
            control={control}
            errors={errors}
          />
        )}
        <input type="submit" ref={inputRef} className="hidden" />
      </form>
    </Modal>
  );
};

export default AddClientModal;
