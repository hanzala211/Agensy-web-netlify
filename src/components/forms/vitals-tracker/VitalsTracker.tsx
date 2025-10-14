import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CommonLoader,
  Input,
  PrimaryButton,
  StickyScrollToTop,
} from "@agensy/components";
import { APP_ACTIONS, ICONS } from "@agensy/constants";
import { DatePickerField } from "@agensy/components";
import {
  vitalsTrackerFormSchema,
  type OpenedFileData,
  type Vital,
  type VitalsTrackerFormData,
} from "@agensy/types";
import { VitalsTrackerTable } from "./VitalsTrackerTable";
import { HeightInput } from "./HeightInput";
import { useParams } from "react-router-dom";
import { useGetVitalsTracker, usePostVitalsTracker } from "@agensy/api";
import { useEffect, useCallback, useState } from "react";
import { DateUtils, StringUtils, toast } from "@agensy/utils";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthContext, useClientContext } from "@agensy/context";

const defaultValues: VitalsTrackerFormData = {
  firstName: "",
  lastName: "",
  dateOfBirth: "",
  bloodType: "",
  height: "",
  vitals: [],
};

export const VitalsTracker = () => {
  const params = useParams();
  const { handleFilterPermission } = useAuthContext();
  const queryClient = useQueryClient();
  const [heightValue, setHeightValue] = useState("");
  const {
    setOpenedFileData,
    setHasUnsavedChanges,
    shouldDownloadAfterSave,
    setShouldDownloadAfterSave,
    setHandleSaveAndDownload,
  } = useClientContext();
  const {
    data: vitalsTrackerData,
    isFetching: isLoadingVitals,
    refetch,
  } = useGetVitalsTracker(params.clientId!);
  const postVitalsTrackerMutation = usePostVitalsTracker();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    setValue,
    watch,
  } = useForm<VitalsTrackerFormData>({
    resolver: zodResolver(vitalsTrackerFormSchema),
    defaultValues,
  });

  useEffect(() => {
    setHasUnsavedChanges(isDirty);
  }, [isDirty, setHasUnsavedChanges]);

  const watchedHeight = watch("height");

  useEffect(() => {
    if (watchedHeight !== heightValue) {
      setHeightValue(watchedHeight || "");
    }
  }, [watchedHeight, heightValue]);

  const handleHeightChange = (value: string) => {
    setHeightValue(value);
    setValue("height", value);
  };

  const { fields, append, remove } = useFieldArray({
    control,
    name: "vitals",
  });

  const mapVitalsToFormData = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vitals: any[],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    client_info: any
  ): VitalsTrackerFormData => {
    const formData: VitalsTrackerFormData = {
      firstName: client_info.first_name ? client_info.first_name : "",
      lastName: client_info.last_name ? client_info.last_name : "",
      dateOfBirth: client_info.date_of_birth
        ? DateUtils.formatDateToRequiredFormat(client_info.date_of_birth)
        : "",
      bloodType: client_info.blood_type || "",
      height: client_info.height || "",
      vitals: vitals
        .sort((a, b) => (a.index || 0) - (b.index || 0))
        .map((item) => ({
          date: item?.date
            ? DateUtils.formatDateToRequiredFormat(item.date)
            : "",
          heartRate: item?.heart_rate || "",
          oxygen: item?.oxygen_saturation || "",
          bloodPressure: item?.blood_pressure || "",
          temperature: item?.temperature || "",
          weight: item?.weight || "",
          other: item?.other_vital_signs || "",
          id: item?.id ? String(item.id) : null,
        })),
    };

    return formData;
  };

  const mapFormDataToVitals = (
    formData: VitalsTrackerFormData
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): { client_info: Record<string, any>; vitals: Vital[] } => {
    const vitals: Vital[] = [];

    formData.vitals?.forEach((vital, index) => {
      if (
        vital.date ||
        vital.heartRate ||
        vital.bloodPressure ||
        vital.temperature ||
        vital.weight ||
        vital.oxygen ||
        vital.other ||
        vital.id
      ) {
        const item: Vital = {
          id: vital.id ? String(vital.id) : null,
          date: vital.date ? DateUtils.changetoISO(vital.date) : null,
          heart_rate: vital.heartRate ? vital.heartRate : null,
          blood_pressure: vital.bloodPressure
            ? String(vital.bloodPressure)
            : null,
          temperature: vital.temperature ? vital.temperature : null,
          weight: vital.weight ? vital.weight : null,
          oxygen_saturation: vital.oxygen ? vital.oxygen : null,
          other_vital_signs: vital.other ? vital.other : null,
          index: index,
        };
        if (!item.id) {
          delete item.id;
        }
        vitals.push(item);
      }
    });

    return {
      vitals,
      client_info: {
        first_name: formData.firstName ? formData.firstName : null,
        last_name: formData.lastName ? formData.lastName : null,
        date_of_birth: formData.dateOfBirth
          ? DateUtils.changetoISO(formData.dateOfBirth)
          : null,
        blood_type: formData.bloodType ? formData.bloodType : null,
        height: formData.height ? formData.height : null,
      },
    };
  };

  const handleAddRow = () => {
    append({
      date: "",
      heartRate: "",
      oxygen: "",
      bloodPressure: "",
      temperature: "",
      weight: "",
      other: "",
      id: null,
    });
  };

  const handleDeleteRow = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  const createSafeOpenedFileData = (
    formData: VitalsTrackerFormData,
    lastUpdate?: string
  ) => {
    return {
      firstName: formData.firstName || "",
      lastName: formData.lastName || "",
      dateOfBirth: formData.dateOfBirth || "",
      bloodType: formData.bloodType || "",
      height: formData.height || "",
      vitals: JSON.parse(JSON.stringify(formData.vitals || [])),
      last_update: JSON.parse(
        JSON.stringify({
          updatedAt: lastUpdate || "",
        })
      ),
    };
  };

  useEffect(() => {
    if (postVitalsTrackerMutation.status === "success") {
      toast.success(
        "Vitals Tracker Successfully Updated",
        "Your client's vitals tracker has been saved and is now up to date."
      );
      queryClient.invalidateQueries({ queryKey: ["client", params.clientId] });
      setHasUnsavedChanges(false);
      const formData = mapVitalsToFormData(
        postVitalsTrackerMutation.data.vitals_tracker,
        postVitalsTrackerMutation.data.client_info
      );
      reset(formData);

      setOpenedFileData(
        createSafeOpenedFileData(
          formData,
          postVitalsTrackerMutation.data?.last_update?.updatedAt
        ) as unknown as OpenedFileData
      );

      // Trigger PDF download if requested
      if (shouldDownloadAfterSave) {
        setShouldDownloadAfterSave(false);
        setTimeout(() => {
          StringUtils.triggerPDFDownload();
        }, 500);
      }
    } else if (postVitalsTrackerMutation.status === "error") {
      toast.error("Error Occurred", String(postVitalsTrackerMutation.error));
      // Reset download flag on error
      if (shouldDownloadAfterSave) {
        setShouldDownloadAfterSave(false);
      }
    }
  }, [postVitalsTrackerMutation.status]);

  useEffect(() => {
    return () => {
      setHasUnsavedChanges(false);
    };
  }, [setHasUnsavedChanges]);

  useEffect(() => {
    if (vitalsTrackerData) {
      const formData = mapVitalsToFormData(
        vitalsTrackerData.vitals_tracker,
        vitalsTrackerData.client_info
      );
      reset(formData);
      setHeightValue(formData.height || "");

      // Use the helper function
      setOpenedFileData(
        createSafeOpenedFileData(
          formData,
          vitalsTrackerData?.last_update?.updatedAt
        ) as unknown as OpenedFileData
      );
    }
  }, [vitalsTrackerData]);

  useEffect(() => {
    refetch();
  }, []);

  const onSubmit = useCallback(
    (data: VitalsTrackerFormData) => {
      const postData = mapFormDataToVitals(data);
      postVitalsTrackerMutation.mutate({
        clientId: params.clientId!,
        data: postData,
      });
    },
    [postVitalsTrackerMutation, params.clientId]
  );

  const handleSaveAndDownload = useCallback(() => {
    setShouldDownloadAfterSave(true);
    handleSubmit(onSubmit)();
  }, []);

  // Register the save function with context
  useEffect(() => {
    setHandleSaveAndDownload(() => handleSaveAndDownload);
    return () => setHandleSaveAndDownload(undefined);
  }, [setHandleSaveAndDownload, handleSaveAndDownload]);

  const vitalsFields = [
    { key: "date", label: "Date", type: "date" },
    {
      key: "heartRate",
      label: "Heart Rate",
      type: "number",
      placeholder: "bpm",
    },
    { key: "oxygen", label: "Oxygen", type: "number", placeholder: "%" },
    {
      key: "bloodPressure",
      label: "Blood Pressure",
      type: "number",
      placeholder: "mmHg",
    },
    {
      key: "temperature",
      label: "Temperature",
      type: "number",
      placeholder: "°F",
    },
    { key: "weight", label: "Weight", type: "number", placeholder: "lbs" },
    {
      key: "other",
      label: "Other",
      type: "text",
      placeholder: "Additional info",
    },
  ];

  if (isLoadingVitals)
    return (
      <div className="flex justify-center items-center h-screen">
        <CommonLoader />
      </div>
    );

  return (
    <div className="bg-gray-50 w-full">
      <form
        autoComplete="off"
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-8"
      >
        <Card title="Personal Information">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input
              label="First Name:"
              register={register("firstName")}
              error={errors.firstName?.message as string}
            />
            <Input
              label="Last Name:"
              register={register("lastName")}
              error={errors.lastName?.message as string}
            />
            <DatePickerField
              control={control}
              name={"dateOfBirth"}
              label="Date of Birth:"
            />
            <Input
              label="Blood Type:"
              register={register("bloodType")}
              error={errors.bloodType?.message as string}
            />
            <div className="flex flex-col w-full md:col-span-2">
              <label className="mb-3">Height:</label>
              <HeightInput value={heightValue} onChange={handleHeightChange} />
              {errors.height && (
                <span className="text-red-500 text-sm mt-1">
                  {errors.height.message}
                </span>
              )}
            </div>
          </div>
        </Card>
        <Card
          title="Vitals Tracker"
          buttonText={<ICONS.plus size={16} />}
          onButtonClick={handleAddRow}
          ariaLabel="Add Vitals Entry"
          showButton={true}
          className="mb-6"
        >
          <VitalsTrackerTable
            fields={fields}
            errors={errors}
            vitalsFields={vitalsFields}
            register={register}
            control={control}
            onDeleteRow={handleDeleteRow}
          />
        </Card>

        {handleFilterPermission(
          params.clientId as string,
          APP_ACTIONS.EditAgensyForms
        ) && (
          <div className="bg-basicWhite/90 backdrop-blur-sm rounded-2xl border border-gray-200/80 shadow-xs hover:shadow-sm transition-all duration-300 overflow-hidden">
            <div className="flex flex-col sm:flex-row justify-end gap-4 p-6">
              <PrimaryButton
                type="submit"
                isLoading={postVitalsTrackerMutation.isPending}
                disabled={postVitalsTrackerMutation.isPending}
                className="sm:!w-fit w-full md:text-base text-sm"
              >
                Save Vitals
              </PrimaryButton>
            </div>
          </div>
        )}
      </form>
      <StickyScrollToTop />
    </div>
  );
};
