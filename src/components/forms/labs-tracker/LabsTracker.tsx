import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CommonLoader, PrimaryButton } from "@agensy/components";
import {
  labsTrackerFormSchema,
  type LabsTrackerFormData,
  type OpenedFileData,
} from "@agensy/types";
import { LabsTrackerCard } from "./LabsTrackerCard";
import { useGetLabsTracker, usePostLabsTracker } from "@agensy/api";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { DateUtils, toast } from "@agensy/utils";
import { useQueryClient } from "@tanstack/react-query";
import { useClientContext } from "@agensy/context";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FlatFormData = { [key: string]: any };

const defaultValues: LabsTrackerFormData = {
  date1: "",
  doctorName1: "",
  type1: "",
  providerCompanyUsed1: "",
  purpose1: "",
  results1: "",
  id1: "",

  date2: "",
  doctorName2: "",
  type2: "",
  providerCompanyUsed2: "",
  purpose2: "",
  results2: "",
  id2: "",

  date3: "",
  doctorName3: "",
  type3: "",
  providerCompanyUsed3: "",
  purpose3: "",
  results3: "",
  id3: "",

  date4: "",
  doctorName4: "",
  type4: "",
  providerCompanyUsed4: "",
  purpose4: "",
  results4: "",
  id4: "",

  date5: "",
  doctorName5: "",
  type5: "",
  providerCompanyUsed5: "",
  purpose5: "",
  results5: "",
  id5: "",

  date6: "",
  doctorName6: "",
  type6: "",
  providerCompanyUsed6: "",
  purpose6: "",
  results6: "",
  id6: "",

  date7: "",
  doctorName7: "",
  type7: "",
  providerCompanyUsed7: "",
  purpose7: "",
  results7: "",
  id7: "",

  date8: "",
  doctorName8: "",
  type8: "",
  providerCompanyUsed8: "",
  purpose8: "",
  results8: "",
  id8: "",
};

export const LabsTracker = () => {
  const params = useParams();
  const { setOpenedFileData } = useClientContext();
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
    formState: { errors },
    reset,
    getValues,
  } = useForm<LabsTrackerFormData>({
    resolver: zodResolver(labsTrackerFormSchema),
    defaultValues,
  });
  const postLabsTracker = usePostLabsTracker();

  useEffect(() => {
    if (postLabsTracker.status === "success") {
      toast.success(
        "Labs Tests Tracker Successfully Updated",
        "Your client's labs test tracker has been saved and is now up to date."
      );
      queryClient.invalidateQueries({ queryKey: ["client", params.clientId] });
    } else if (postLabsTracker.status === "error") {
      toast.error("Error Occurred", String(postLabsTracker.error));
    }
  }, [postLabsTracker.status]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapLabsToFormData = (labs: any[]) => {
    const formData: FlatFormData = {};

    for (let i = 0; i < 12; i++) {
      const item = labs[i];

      const idx = item?.index;

      formData[`date${idx}`] = DateUtils.formatDateToRequiredFormat(
        item?.date ?? ""
      );
      formData[`doctorName${idx}`] = item?.doctor_name ?? "";
      formData[`type${idx}`] = item?.type ?? "";
      formData[`providerCompanyUsed${idx}`] = item?.provider_company ?? "";
      formData[`purpose${idx}`] = item?.purpose ?? "";
      formData[`results${idx}`] = item?.results ?? "";
      formData[`id${idx}`] = item?.id ?? null;
    }

    return formData;
  };

  const mapFormDataToVitals = (formData: FlatFormData) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const labs: any[] = [];

    for (let i = 1; i <= 12; i++) {
      const date = formData[`date${i}`];
      const doctorName = formData[`doctorName${i}`];
      const type = formData[`type${i}`];
      const providerCompanyUsed = formData[`providerCompanyUsed${i}`];
      const purpose = formData[`purpose${i}`];
      const results = formData[`results${i}`];
      const id = formData[`id${i}`];
      const index = i;

      if (
        date ||
        doctorName ||
        type ||
        purpose ||
        providerCompanyUsed ||
        results ||
        id
      ) {
        const item = {
          id: id ? id : null,
          date: date ? DateUtils.changetoISO(date) : null,
          doctor_name: doctorName ? doctorName : null,
          type: type ? type : null,
          provider_company: providerCompanyUsed ? providerCompanyUsed : null,
          purpose: purpose ? purpose : null,
          results: results ? results : null,
          index: index ? index : null,
        };
        if (!item.id) {
          delete item.id;
        }
        labs.push(item);
      }
    }

    return labs;
  };

  useEffect(() => {
    if (labsTrackerData) {
      const formData = mapLabsToFormData(
        labsTrackerData?.labs_tests_imaging_tracker
      );
      reset(formData);

      setOpenedFileData({
        ...getValues(),
        last_update: {
          updatedAt: labsTrackerData?.last_update?.updatedAt || "",
        },
      } as unknown as OpenedFileData);
    }
  }, [labsTrackerData]);

  useEffect(() => {
    refetch();
  }, []);

  const onSubmit = (data: LabsTrackerFormData) => {
    postLabsTracker.mutate({
      data: { labs_tests_imaging_trackers: mapFormDataToVitals(data) },
      clientId: params.clientId!,
    });
  };

  if (isLoadingLabs)
    return (
      <div className="flex justify-center items-center h-screen">
        <CommonLoader />
      </div>
    );

  return (
    <div className="bg-gray-50 w-full">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <Card title="Labs Tracker" className="mb-6">
          <div className="space-y-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <LabsTrackerCard
                register={register}
                errors={errors}
                index={item}
                control={control}
              />
            ))}
          </div>
        </Card>

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
      </form>
    </div>
  );
};
