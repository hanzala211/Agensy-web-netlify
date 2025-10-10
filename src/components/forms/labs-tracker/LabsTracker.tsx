import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CommonLoader,
  Input,
  DatePickerField,
  PrimaryButton,
  StickyScrollToTop,
} from "@agensy/components";
import { APP_ACTIONS, ICONS } from "@agensy/constants";
import {
  labsTrackerFormSchema,
  type Client,
  type LabsTrackerFormData,
  type OpenedFileData,
} from "@agensy/types";
import { LabsTrackerCard } from "./LabsTrackerCard";
import { useGetLabsTracker, usePostLabsTracker } from "@agensy/api";
import { useParams } from "react-router-dom";
import { useEffect, useCallback, useState } from "react";
import { DateUtils, StringUtils, toast } from "@agensy/utils";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthContext, useClientContext } from "@agensy/context";

const defaultValues: LabsTrackerFormData = {
  firstName: "",
  lastName: "",
  dateOfBirth: "",
  labs: [],
};

export const LabsTracker = () => {
  const params = useParams();
  const {
    setOpenedFileData,
    setHasUnsavedChanges,
    shouldDownloadAfterSave,
    setShouldDownloadAfterSave,
    setHandleSaveAndDownload,
  } = useClientContext();
  const [providers, setProviders] = useState<
    { label: string; value: string }[]
  >([]);
  const {
    data: labsTrackerData,
    isFetching: isLoadingLabs,
    refetch,
  } = useGetLabsTracker(params.clientId!);
  const queryClient = useQueryClient();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<LabsTrackerFormData>({
    resolver: zodResolver(labsTrackerFormSchema),
    defaultValues,
  });
  const { handleFilterPermission } = useAuthContext();

  useEffect(() => {
    const client = queryClient.getQueryData(["client", params.clientId]) as
      | Client
      | undefined;
    const providers = client?.healthcareProviders.map((item) => ({
      label: `${item.provider_name}`,
      value: item.id,
    }));

    setProviders(providers as { label: string; value: string }[]);
  }, []);

  useEffect(() => {
    setHasUnsavedChanges(isDirty);
  }, [isDirty, setHasUnsavedChanges]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "labs",
  });

  const postLabsTracker = usePostLabsTracker();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapLabsToFormData = (labs: any[], client_info: any) => {
    if (!labs || labs.length === 0) {
      return {
        labs: [],
        firstName: client_info.first_name,
        lastName: client_info.last_name,
        dateOfBirth: client_info.date_of_birth
          ? DateUtils.formatDateToRequiredFormat(client_info.date_of_birth)
          : "",
      };
    }

    const mappedLabs = labs
      .sort((a, b) => (a.index || 0) - (b.index || 0))
      .map((item) => ({
        date: DateUtils.formatDateToRequiredFormat(item?.date ?? ""),
        doctorName: item?.doctor_name ?? "",
        type: item?.type ?? "",
        providerCompanyUsed: item?.provider_company ?? "",
        purpose: item?.purpose ?? "",
        results: item?.results ?? "",
        id: item?.id ?? "",
      }));

    return {
      labs: mappedLabs,
      firstName: client_info.first_name,
      lastName: client_info.last_name,
      dateOfBirth: client_info.date_of_birth
        ? DateUtils.formatDateToRequiredFormat(client_info.date_of_birth)
        : "",
    };
  };

  useEffect(() => {
    if (postLabsTracker.status === "success") {
      toast.success(
        "Labs Tests Tracker Successfully Updated",
        "Your client's labs test tracker has been saved and is now up to date."
      );
      queryClient.invalidateQueries({ queryKey: ["client", params.clientId] });
      setHasUnsavedChanges(false);
      const formData = mapLabsToFormData(
        postLabsTracker.data.labs_tests_imaging_tracker,
        postLabsTracker.data.client_info
      );
      reset(formData);

      formData?.labs?.forEach((item) => {
        item.doctorName = providers?.find(
          (provider) => provider.value === item.doctorName
        )?.label;
      });

      setOpenedFileData({
        firstName: formData.firstName || "",
        lastName: formData.lastName || "",
        dateOfBirth: formData.dateOfBirth || "",
        labs: JSON.parse(JSON.stringify(formData.labs || [])),
        last_update: JSON.parse(
          JSON.stringify({
            updatedAt:
              postLabsTracker.data?.last_update?.updatedAt ||
              labsTrackerData?.last_update?.updatedAt ||
              "",
          })
        ),
      } as unknown as OpenedFileData);

      // Trigger PDF download if requested
      if (shouldDownloadAfterSave) {
        setShouldDownloadAfterSave(false);
        setTimeout(() => {
          StringUtils.triggerPDFDownload();
        }, 500);
      }
    } else if (postLabsTracker.status === "error") {
      toast.error("Error Occurred", String(postLabsTracker.error));
      // Reset download flag on error
      if (shouldDownloadAfterSave) {
        setShouldDownloadAfterSave(false);
      }
    }
  }, [postLabsTracker.status, setHasUnsavedChanges]);

  // Cleanup unsaved changes when component unmounts
  useEffect(() => {
    return () => {
      setHasUnsavedChanges(false);
    };
  }, [setHasUnsavedChanges]);

  const mapFormDataToVitals = (formData: LabsTrackerFormData) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const labs: any[] = [];

    if (formData.labs && formData.labs.length > 0) {
      formData.labs.forEach((lab, index) => {
        if (
          lab.date ||
          lab.doctorName ||
          lab.type ||
          lab.purpose ||
          lab.providerCompanyUsed ||
          lab.results ||
          lab.id
        ) {
          const item = {
            id: lab.id ? lab.id : null,
            date: lab.date ? DateUtils.changetoISO(lab.date) : null,
            doctor_name: lab.doctorName
              ? providers?.find((provider) => provider.value === lab.doctorName)
                  ?.value
              : null,
            type: lab.type ? lab.type : null,
            provider_company: lab.providerCompanyUsed
              ? lab.providerCompanyUsed
              : null,
            purpose: lab.purpose ? lab.purpose : null,
            results: lab.results ? lab.results : null,
            index: index + 1,
          };
          if (!item.id) {
            // @ts-expect-error // fix this
            delete item.id;
          }
          labs.push(item);
        }
      });
    }

    return labs;
  };

  const addNewLab = () => {
    append({
      date: "",
      doctorName: "",
      type: "",
      providerCompanyUsed: "",
      purpose: "",
      results: "",
      id: "",
    });
  };

  useEffect(() => {
    if (labsTrackerData) {
      const formData = mapLabsToFormData(
        labsTrackerData?.labs_tests_imaging_tracker,
        labsTrackerData?.client_info
      );
      reset(formData);

      formData?.labs?.forEach((item) => {
        item.doctorName = providers?.find(
          (provider) => provider.value === item.doctorName
        )?.label;
      });

      setOpenedFileData({
        firstName: formData.firstName || "",
        lastName: formData.lastName || "",
        dateOfBirth: formData.dateOfBirth || "",
        labs: JSON.parse(JSON.stringify(formData.labs || [])),
        last_update: JSON.parse(
          JSON.stringify({
            updatedAt: labsTrackerData?.last_update?.updatedAt || "",
          })
        ),
      } as unknown as OpenedFileData);
    }
  }, [labsTrackerData]);
  useEffect(() => {
    refetch();
  }, []);

  const onSubmit = useCallback(
    (data: LabsTrackerFormData) => {
      postLabsTracker.mutate({
        data: {
          labs_tests_imaging_trackers: mapFormDataToVitals(data),
          client_info: {
            first_name: data.firstName ? data.firstName : null,
            last_name: data.lastName ? data.lastName : null,
            date_of_birth: data.dateOfBirth
              ? DateUtils.changetoISO(data.dateOfBirth)
              : null,
          },
        },
        clientId: params.clientId!,
      });
    },
    [postLabsTracker, params.clientId]
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

  if (isLoadingLabs)
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
            <div className="md:col-span-2">
              <DatePickerField
                control={control}
                name={"dateOfBirth"}
                label="Date of Birth:"
              />
            </div>
          </div>
        </Card>
        <Card
          title="Labs Tracker"
          className="mb-6"
          buttonText={<ICONS.plus size={16} />}
          onButtonClick={addNewLab}
          ariaLabel="Add New Lab Test"
          showButton={true}
        >
          <div className="space-y-6">
            {fields.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No lab tests added yet.</p>
                <p className="text-sm">
                  Click the + button above to add your first lab test.
                </p>
              </div>
            ) : (
              fields.map((field, index) => (
                <LabsTrackerCard
                  providers={
                    providers as unknown as { label: string; value: string }[]
                  }
                  key={field.id}
                  register={register}
                  errors={errors}
                  index={index}
                  control={control}
                  onRemove={() => remove(index)}
                  canRemove={fields.length > 1}
                />
              ))
            )}
          </div>
        </Card>

        {handleFilterPermission(
          params.clientId as string,
          APP_ACTIONS.EditAgensyForms
        ) && (
          <div className="bg-basicWhite/90 backdrop-blur-sm rounded-2xl border border-gray-200/80 shadow-xs hover:shadow-sm transition-all duration-300 overflow-hidden">
            <div className="flex flex-col sm:flex-row justify-end gap-4 p-6">
              <PrimaryButton
                type="submit"
                isLoading={postLabsTracker.isPending}
                disabled={postLabsTracker.isPending}
                className="sm:!w-fit w-full md:text-base text-sm"
              >
                Save Labs Tracker
              </PrimaryButton>
            </div>
          </div>
        )}
      </form>
      <StickyScrollToTop />
    </div>
  );
};
