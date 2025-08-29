import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  Input,
  DatePickerField,
  PrimaryButton,
  TextArea,
  TertiaryButton,
  CommonLoader,
  MultipleTextInputs,
} from "@agensy/components";
import {
  initialCareAssessmentPlanSchema,
  type InitialCareAssessmentPlanFormData,
  type OpenedFileData,
} from "@agensy/types";
import { ICONS } from "@agensy/constants";
import { DateUtils, toast } from "@agensy/utils";
import { useParams } from "react-router-dom";
import {
  useGetInitialCareAssessmentPlan,
  usePostInitialCareAssessmentPlan,
} from "@agensy/api";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useClientContext } from "@agensy/context";

export const InitialCareAssessmentPlan = () => {
  const params = useParams();
  const queryClient = useQueryClient();
  const { setOpenedFileData, setHasUnsavedChanges } = useClientContext();
  const {
    data: initialCareAssessment,
    isFetching: isLoadingData,
    refetch,
  } = useGetInitialCareAssessmentPlan(params.clientId!);
  const {
    register,
    control,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors, isDirty },
    getValues,
  } = useForm<InitialCareAssessmentPlanFormData>({
    resolver: zodResolver(initialCareAssessmentPlanSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      dateOfAssessment: "",
      dateOfCarePlan: "",
      personCompletingAssessment: "",
      presentForAssessment: "",
      goalsForAssessment: [] as string[],
      focusedRecommendations: [],
      functionalAdls: {
        summary: "",
      },
      functionalIadls: {
        summary: "",
      },
      homeSafety: {
        summary: "",
      },
      memoryAndRecommendations: {
        summary: "",
      },
      geriatricDepression: {
        summary: "",
      },
      nutritionalHealth: {
        summary: "",
      },
      legalAndFinancial: {
        summary: "",
      },
      caregiverSupport: {
        summary: "",
      },
      nextStepCareRecipient: [],
      nextStepCarePartner: [],
    },
  });

  // Watch form changes to detect unsaved changes
  useEffect(() => {
    setHasUnsavedChanges(isDirty);
  }, [isDirty, setHasUnsavedChanges]);

  useEffect(() => {
    refetch();
  }, []);

  const postInitialCareAssessmentPlanMutation =
    usePostInitialCareAssessmentPlan();

  const {
    fields: focusedRecommendationsFields,
    append: appendFocusedRecommendation,
    remove: removeFocusedRecommendation,
  } = useFieldArray({
    control,
    name: "focusedRecommendations",
  });

  const {
    fields: nextStepCareRecipientFields,
    append: appendNextStepCareRecipient,
    remove: removeNextStepCareRecipient,
  } = useFieldArray<InitialCareAssessmentPlanFormData>({
    control,
    // @ts-expect-error - TODO: fix this
    name: "nextStepCareRecipient",
  });

  const {
    fields: nextStepCarePartnerFields,
    append: appendNextStepCarePartner,
    remove: removeNextStepCarePartner,
  } = useFieldArray<InitialCareAssessmentPlanFormData>({
    control,
    // @ts-expect-error - TODO: fix this
    name: "nextStepCarePartner",
  });

  useEffect(() => {
    if (postInitialCareAssessmentPlanMutation.status === "success") {
      toast.success(
        "Initial Care Assessment Plan Successfully Updated",
        "Your client's initial care assessment plan has been saved and is now up to date."
      );
      queryClient.invalidateQueries({ queryKey: ["client", params.clientId] });
      setHasUnsavedChanges(false);
    } else if (postInitialCareAssessmentPlanMutation.status === "error") {
      toast.error(
        "Error Occurred",
        String(postInitialCareAssessmentPlanMutation.error)
      );
    }
  }, [postInitialCareAssessmentPlanMutation.status, setHasUnsavedChanges]);

  // Cleanup unsaved changes when component unmounts
  useEffect(() => {
    return () => {
      setHasUnsavedChanges(false);
    };
  }, [setHasUnsavedChanges]);

  useEffect(() => {
    if (initialCareAssessment) {
      reset({
        firstName: initialCareAssessment?.client_info?.first_name || "",
        lastName: initialCareAssessment?.client_info?.last_name || "",
        dateOfAssessment: initialCareAssessment?.initial_care_plan_assessment
          ?.date_of_assessment
          ? DateUtils.formatDateToRequiredFormat(
              initialCareAssessment?.initial_care_plan_assessment
                .date_of_assessment
            )
          : "",
        dateOfCarePlan: initialCareAssessment?.initial_care_plan_assessment
          ?.date_of_care_plan
          ? DateUtils.formatDateToRequiredFormat(
              initialCareAssessment?.initial_care_plan_assessment
                .date_of_care_plan
            )
          : "",
        dateOfBirth: initialCareAssessment?.client_info?.date_of_birth
          ? DateUtils.formatDateToRequiredFormat(
              initialCareAssessment?.client_info.date_of_birth
            )
          : "",
        personCompletingAssessment:
          initialCareAssessment?.initial_care_plan_assessment
            ?.person_completing_assessment || "",
        presentForAssessment:
          initialCareAssessment?.initial_care_plan_assessment
            ?.present_for_assessment || "",
        goalsForAssessment:
          (initialCareAssessment?.initial_care_plan_assessment
            ?.goals_for_assessment &&
            initialCareAssessment?.initial_care_plan_assessment
              ?.goals_for_assessment.length > 0 &&
            initialCareAssessment?.initial_care_plan_assessment?.goals_for_assessment.split(
              ", "
            )) ||
          [],
        focusedRecommendations:
          initialCareAssessment.focused_recommendations &&
          initialCareAssessment.focused_recommendations.length > 0
            ? initialCareAssessment.focused_recommendations?.map(
                (item: {
                  name: string | null;
                  description: string | null;
                  details: string | null;
                  id: string | null;
                }) => ({
                  name: item.name ? item.name : "",
                  description: item.description ? item.description : "",
                  details:
                    item.details && item.details.length > 0
                      ? item.details.split(", ")
                      : [],
                  id: item.id ? item.id : null,
                })
              )
            : [],
        functionalAdls: {
          summary: initialCareAssessment.functional_adls?.summary
            ? initialCareAssessment.functional_adls?.summary
            : "",
          categoryName: initialCareAssessment.functional_adls?.category_name
            ? initialCareAssessment.functional_adls?.category_name
            : "",
        },
        functionalIadls: {
          summary: initialCareAssessment.functional_iadls?.summary
            ? initialCareAssessment.functional_iadls?.summary
            : "",
          categoryName: initialCareAssessment.functional_iadls?.category_name
            ? initialCareAssessment.functional_iadls?.category_name
            : "",
        },
        homeSafety: {
          summary: initialCareAssessment.home_safety?.summary
            ? initialCareAssessment.home_safety?.summary
            : "",
          categoryName: initialCareAssessment.home_safety?.category_name
            ? initialCareAssessment.home_safety?.category_name
            : "",
        },
        memoryAndRecommendations: {
          summary: initialCareAssessment.memory_and_recommendations?.summary
            ? initialCareAssessment.memory_and_recommendations?.summary
            : "",
          categoryName:
            initialCareAssessment.memory_and_recommendations?.category_name,
        },
        legalAndFinancial: {
          summary: initialCareAssessment.legal_and_financial?.summary
            ? initialCareAssessment.legal_and_financial?.summary
            : "",
          categoryName:
            initialCareAssessment.legal_and_financial?.category_name,
        },
        geriatricDepression: {
          summary: initialCareAssessment.geriatric_depression?.summary
            ? initialCareAssessment.geriatric_depression?.summary
            : "",
          categoryName:
            initialCareAssessment.geriatric_depression?.category_name,
        },
        caregiverSupport: {
          summary: initialCareAssessment.care_giver_support?.summary
            ? initialCareAssessment.care_giver_support?.summary
            : "",
          categoryName: initialCareAssessment.care_giver_support?.category_name,
        },
        nutritionalHealth: {
          summary: initialCareAssessment.nutritional_health?.summary
            ? initialCareAssessment.nutritional_health?.summary
            : "",
          categoryName: initialCareAssessment.nutritional_health?.category_name,
        },
        nextStepCareRecipient: initialCareAssessment
          .initial_care_plan_assessment.next_step_care_recipient
          ? initialCareAssessment.initial_care_plan_assessment.next_step_care_recipient.split(
              ", "
            )
          : [],
        nextStepCarePartner: initialCareAssessment.initial_care_plan_assessment
          .next_step_care_partner
          ? initialCareAssessment.initial_care_plan_assessment.next_step_care_partner.split(
              ", "
            )
          : [],
      });
      setOpenedFileData({
        ...getValues(),
        last_update: {
          updatedAt: initialCareAssessment?.last_update?.updatedAt,
        },
      } as unknown as OpenedFileData);
    }
  }, [initialCareAssessment]);

  const onSubmit = (data: InitialCareAssessmentPlanFormData) => {
    console.log(data);
    const focusedRecommendations = data.focusedRecommendations?.map(
      (item, index) => {
        const recommendation = {
          id: item.id ? item.id : null,
          option_number: index + 1 || null,
          name: item.name ? item.name : null,
          description: item.description ? item.description : null,
          details: item.details
            ? item.details.length > 0
              ? item.details.join(", ")
              : null
            : null,
        };
        if (recommendation.id) {
          return recommendation;
        } else {
          // @ts-expect-error :// TODO: fix this
          delete recommendation.id;
          return recommendation;
        }
      }
    );

    const functionalAdls = {
      summary: data.functionalAdls?.summary
        ? data.functionalAdls?.summary
        : null,
      category_name: data.functionalAdls?.categoryName
        ? data.functionalAdls?.categoryName
        : "functional_adls",
    };

    const functionalIadls = {
      summary: data.functionalIadls?.summary
        ? data.functionalIadls?.summary
        : null,
      category_name: data.functionalIadls?.categoryName
        ? data.functionalIadls?.categoryName
        : "functional_iadls",
    };

    const homeSafety = {
      summary: data.homeSafety?.summary ? data.homeSafety?.summary : null,
      category_name: data.homeSafety?.categoryName
        ? data.homeSafety?.categoryName
        : "home_safety",
    };

    const memoryAndRecommendations = {
      summary: data.memoryAndRecommendations?.summary
        ? data.memoryAndRecommendations?.summary
        : null,
      category_name: data.memoryAndRecommendations?.categoryName
        ? data.memoryAndRecommendations?.categoryName
        : "memory_reasoning",
    };

    const geriatricDepression = {
      summary: data.geriatricDepression?.summary
        ? data.geriatricDepression?.summary
        : null,
      category_name: data.geriatricDepression?.categoryName
        ? data.geriatricDepression?.categoryName
        : "geriatric_depression",
    };
    const nutritional_health = {
      summary: data.nutritionalHealth?.summary
        ? data.nutritionalHealth?.summary
        : null,
      category_name: data.nutritionalHealth?.categoryName
        ? data.nutritionalHealth?.categoryName
        : "nutritional_health",
    };
    const legal_and_financial = {
      summary: data.legalAndFinancial?.summary
        ? data.legalAndFinancial?.summary
        : null,
      category_name: data.legalAndFinancial?.categoryName
        ? data.legalAndFinancial?.categoryName
        : "legal_financial",
    };
    const care_giver_support = {
      summary: data.caregiverSupport?.summary
        ? data.caregiverSupport?.summary
        : null,
      category_name: data.caregiverSupport?.categoryName
        ? data.caregiverSupport?.categoryName
        : "care_giver_support",
    };

    const postData = {
      client_info: {
        first_name: data.firstName ? data.firstName : null,
        last_name: data.lastName ? data.lastName : null,
        date_of_birth: data.dateOfBirth
          ? DateUtils.changetoISO(data.dateOfBirth)
          : null,
      },
      initial_care_plan_assessment: {
        date_of_assessment: data.dateOfAssessment
          ? DateUtils.changetoISO(data.dateOfAssessment)
          : null,
        date_of_care_plan: data.dateOfCarePlan
          ? DateUtils.changetoISO(data.dateOfCarePlan)
          : null,
        person_completing_assessment: data.personCompletingAssessment
          ? data.personCompletingAssessment
          : null,
        present_for_assessment: data.presentForAssessment
          ? data.presentForAssessment
          : null,
        goals_for_assessment: data.goalsForAssessment
          ? data.goalsForAssessment.length > 0
            ? data.goalsForAssessment.join(", ").length > 0
              ? data.goalsForAssessment.join(", ")
              : null
            : null
          : null,
        next_step_care_recipient: data.nextStepCareRecipient
          ? data.nextStepCareRecipient.length > 0
            ? data.nextStepCareRecipient.join(", ").length > 0
              ? data.nextStepCareRecipient.join(", ")
              : null
            : null
          : null,
        next_step_care_partner: data.nextStepCarePartner
          ? data.nextStepCarePartner.length > 0
            ? data.nextStepCarePartner.join(", ").length > 0
              ? data.nextStepCarePartner.join(", ")
              : null
            : null
          : null,
      },
      focused_recommendations: focusedRecommendations || [],

      functional_adls: functionalAdls,
      functional_iadls: functionalIadls,
      home_safety: homeSafety,
      memory_and_recommendations: memoryAndRecommendations,
      geriatric_depression: geriatricDepression,
      nutritional_health: nutritional_health,
      legal_and_financial: legal_and_financial,
      care_giver_support: care_giver_support,
    };

    postInitialCareAssessmentPlanMutation.mutate({
      clientId: params.clientId!,
      data: postData,
    });
  };

  if (isLoadingData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CommonLoader />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <Card title="Initial Care Assessment Plan">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
          <Input
            label="First Name"
            register={register("firstName")}
            error={errors.firstName?.message}
          />
          <Input
            label="Last Name"
            register={register("lastName")}
            error={errors.lastName?.message}
          />
        </div>
        <div className="mb-5">
          <DatePickerField
            control={control}
            name="dateOfBirth"
            label="Date of Birth"
          />
          {errors.dateOfBirth && (
            <p className="text-red-500 text-xs mt-1">
              {errors.dateOfBirth.message}
            </p>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <DatePickerField
            control={control}
            name="dateOfAssessment"
            label="Date of Assessment"
          />
          <DatePickerField
            control={control}
            name="dateOfCarePlan"
            label="Date of Care Plan"
          />
        </div>
      </Card>

      <Card title="Assessment Information">
        <div className="mb-5">
          <Input
            label="Person Completing Assessment"
            register={register("personCompletingAssessment")}
            error={errors.personCompletingAssessment?.message}
          />
        </div>
      </Card>

      <Card title="Assessment Details">
        <div className="mb-5">
          <Input
            label="Present for Assessment"
            register={register("presentForAssessment")}
            error={errors.presentForAssessment?.message}
          />
        </div>
      </Card>

      <Card
        title="Goals for Assessment"
        buttonText={<ICONS.plus size={16} />}
        onButtonClick={() => {
          const currentGoals = watch("goalsForAssessment") || [];
          setValue("goalsForAssessment", [...currentGoals, ""]);
        }}
        ariaLabel="Add Goal for Assessment"
        showButton={true}
      >
        <div className="space-y-6">
          {(watch("goalsForAssessment") || []).map((goal, index) => (
            <div key={index} className="p-3 rounded-lg border">
              <div className="w-full flex gap-4 items-center">
                <div className="w-full">
                  <Input
                    placeholder={`Goal ${index + 1}`}
                    register={register(`goalsForAssessment.${index}`)}
                    error={errors.goalsForAssessment?.[index]?.message}
                  />
                </div>
                {(watch("goalsForAssessment") || []).length > 1 && (
                  <TertiaryButton
                    type="button"
                    onClick={() => {
                      const currentGoals = watch("goalsForAssessment") || [];
                      console.log(goal);
                      const newGoals = currentGoals.filter(
                        (_, i) => i !== index
                      );
                      setValue("goalsForAssessment", newGoals);
                    }}
                    className="text-red-600 border !m-0 border-red-200 hover:bg-red-50 hover:border-red-300"
                  >
                    <ICONS.delete />
                  </TertiaryButton>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card
        title="Focused Recommendations"
        buttonText={<ICONS.plus size={16} />}
        onButtonClick={() =>
          appendFocusedRecommendation({
            id: null,
            name: "",
            description: "",
            details: [],
          })
        }
        ariaLabel="Add Focused Recommendation"
        showButton={true}
      >
        <div className="space-y-6">
          {focusedRecommendationsFields.map((field, index) => (
            <div
              key={field.id}
              className="p-4 rounded-lg border border-gray-200"
            >
              <div className="flex items-center mb-4">
                <span className="text-sm font-medium text-gray-700 mr-2">
                  Option {index + 1}:
                </span>
              </div>
              <div className="mb-4">
                <Input
                  label="Name"
                  register={register(`focusedRecommendations.${index}.name`)}
                  error={errors.focusedRecommendations?.[index]?.name?.message}
                />
              </div>
              <div className="mb-4">
                <Input
                  label="Description"
                  register={register(
                    `focusedRecommendations.${index}.description`
                  )}
                  error={
                    errors.focusedRecommendations?.[index]?.description?.message
                  }
                />
              </div>
              <div className="mb-4">
                <MultipleTextInputs
                  label="Details"
                  value={watch(`focusedRecommendations.${index}.details`) || []}
                  onChange={(newValue) => {
                    setValue(
                      `focusedRecommendations.${index}.details`,
                      newValue
                    );
                  }}
                  error={
                    errors.focusedRecommendations?.[index]?.details?.message
                  }
                />
              </div>
              {focusedRecommendationsFields.length > 1 && (
                <div className="flex justify-end">
                  <TertiaryButton
                    type="button"
                    onClick={() => removeFocusedRecommendation(index)}
                    className="text-red-600 border border-red-200 hover:bg-red-50 hover:border-red-300"
                  >
                    <ICONS.delete />
                  </TertiaryButton>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      <Card title="Functional">
        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2 underline">
              Activities of Daily Living (ADLs)
            </h4>
            <div className="mb-4 p-3 bg-blue-100 rounded border-l-4 border-blue-500 text-sm text-gray-700">
              [Offer a brief summary of the ADL's the care recipient is
              independent with and those they require any assistance with.
              Assess: bathing, dressing, toileting, transfers, continence, and
              feeding. Describe the care recipient's perceptions and attitude
              towards receiving ADL assistance, whether verbal prompting /
              reminders are sufficient, and any other information pertinent to
              the provision of assistance with ADLs.]
            </div>
            <TextArea
              label="ADLs Summary"
              register={register("functionalAdls.summary")}
              error={errors.functionalAdls?.summary?.message}
              rows={4}
            />
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2 underline">
              Independent Activities of Daily Living (IADL's)
            </h4>
            <div className="mb-4 p-3 bg-blue-100 rounded border-l-4 border-blue-500 text-sm text-gray-700">
              [Offer a brief summary of the IADL's the care recipient is
              independent with and those they require any assistance with.
              Assess: ability to use telephone, shopping, food preparation,
              housekeeping, laundry, mode of transportation, responsibility of
              own medication, and ability to handle finances. Describe the care
              recipient's perceptions and attitude towards receiving IADL
              assistance, whether verbal prompting / reminders are sufficient,
              and any other information pertinent to the provision of assistance
              with IADLs.]
            </div>
            <TextArea
              label="IADLs Summary"
              register={register("functionalIadls.summary")}
              error={errors.functionalIadls?.summary?.message}
              rows={4}
            />
          </div>
        </div>
      </Card>

      <Card title="Home Safety">
        <div className="mb-4 p-3 bg-blue-100 rounded border-l-4 border-blue-500 text-sm text-gray-700">
          [Summarize your observations of the care recipient's home environment
          and any pertinent safety and/or functional concerns in a narrative
          fashion. Address whether the care recipient require assistance
          maintaining the property including home upkeep, lawn maintenance, etc.
          Describe the home: how many stories, do the staircase have a railing
          or landings, are there safety gates or can they be installed, is the
          yard fenced, are pathways wide enough for a walker or wheelchair, are
          showers accessible, and do drawers and cabinets have safety latches,
          etc. Please note any modifications that may be necessary to address
          any safety concerns observed.]
        </div>
        <div className="mb-5">
          <TextArea
            label="Home Safety Summary"
            register={register("homeSafety.summary")}
            error={errors.homeSafety?.summary?.message}
            rows={4}
          />
        </div>
      </Card>

      <Card title="Memory & Reasoning">
        <div className="mb-4 p-3 bg-blue-100 rounded border-l-4 border-blue-500 text-sm text-gray-700">
          [Please include a description of the care recipient’s general memory,
          reasoning, and other cognitive capacities. If there is any notable
          decline, has it been rapid or gradual? What insight into their own
          cognitive decline does the care recipient demonstrate? Likewise, what
          insight into any pertinent safety concerns does the care recipient
          demonstrate? Does the care recipient experience any hallucinations or
          evidence any delusions? To what degree is the care recipient able to
          engage in linear conversation, and are there patterns or
          perseverations informed by the care recipient’s cognitive concerns?
          What is the care recipient’s range of emotional expression, and is it
          situationally appropriate? Do any conversational topics or other
          stimuli trigger an acute emotional response? How does the care
          recipient’s cognition impact their ability to remain organized, or
          attend to their ADLs and IADLs (see above sections)?]
        </div>
        <div className="mb-5">
          <TextArea
            label="Memory & Reasoning Summary"
            register={register("memoryAndRecommendations.summary")}
            error={errors.memoryAndRecommendations?.summary?.message}
            rows={4}
          />
        </div>
      </Card>

      <Card title="Geriatric Depression">
        <div className="mb-4 p-3 bg-blue-100 rounded border-l-4 border-blue-500 text-sm text-gray-700">
          [Summarize any evidence of depression gleaned from care recipient
          self-report, collateral report, or direct observation. How often and
          to what degree does the care recipient express or demonstrate feeling
          sad, unmotivated, discouraged, or hopeless? Does the care recipient
          have opportunities to engage in activities relevant to their interests
          and intellect? Have others expressed any concerns for the care
          recipient’s emotional wellbeing? If evidence of depression is noted,
          please indicate any suspected or suggested causes or contributing
          factors.]
        </div>
        <div className="mb-5">
          <TextArea
            label="Geriatric Depression Summary"
            register={register("geriatricDepression.summary")}
            error={errors.geriatricDepression?.summary?.message}
            rows={4}
          />
        </div>
      </Card>

      <Card title="Nutritional Health">
        <div className="mb-4 p-3 bg-blue-100 rounded border-l-4 border-blue-500 text-sm text-gray-700">
          [Summarize any pertinent information regarding the care recipient's
          current diet, dietary needs such as food allergies or intolerances,
          community meal plans, and any deficits noted in the care recipient's
          current access to consistently suitable meals.]
        </div>
        <div className="mb-5">
          <TextArea
            label="Nutritional Health Summary"
            register={register("nutritionalHealth.summary")}
            error={errors.nutritionalHealth?.summary?.message}
            rows={4}
          />
        </div>
      </Card>

      <Card title="Legal and Financial">
        <div className="mb-4 p-3 bg-blue-100 rounded border-l-4 border-blue-500 text-sm text-gray-700">
          [Summarize the care recipient's general legal and financial status in
          a narrative format. Is all legal and financial documentation up to
          date and appropriate? Do the care recipient or their family have any
          concerns for the cost of care or other services? Does the care
          recipient have a designated power of attorney and/or a living will?]
        </div>
        <div className="mb-5">
          <TextArea
            label="Legal and Financial Summary"
            register={register("legalAndFinancial.summary")}
            error={errors.legalAndFinancial?.summary?.message}
            rows={4}
          />
        </div>
      </Card>

      <Card title="Caregiver Support">
        <div className="mb-4 p-3 bg-blue-100 rounded border-l-4 border-blue-500 text-sm text-gray-700">
          [Summarize any caregiver support that the care recipient receives from
          a family, community, or other agency. Who are the care recipient's
          caregivers and what duties do they primarily perform? What is the care
          recipient's association to and opinion of their caregivers? Are there
          any concerns for the caregivers' competence, ability, or
          availability?]
        </div>
        <div className="mb-5">
          <TextArea
            label="Caregiver Support Summary"
            register={register("caregiverSupport.summary")}
            error={errors.caregiverSupport?.summary?.message}
            rows={4}
          />
        </div>
      </Card>

      <Card
        title="Next Steps - Care Recipient"
        buttonText={<ICONS.plus size={16} />}
        onButtonClick={() => {
          // @ts-expect-error - TODO: fix this
          appendNextStepCareRecipient("");
        }}
        ariaLabel="Add Care Recipient Step"
        showButton={true}
      >
        <div className="space-y-4 w-full">
          {nextStepCareRecipientFields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-3 w-full">
              <Input
                label={`Step ${index + 1}`}
                mainClassname="w-full"
                register={register(`nextStepCareRecipient.${index}`)}
                error={errors.nextStepCareRecipient?.[index]?.message}
                placeholder="Physical therapy sessions, medication review, etc."
              />
              {nextStepCareRecipientFields.length > 1 && (
                <TertiaryButton
                  type="button"
                  onClick={() => removeNextStepCareRecipient(index)}
                  className="text-red-600 border border-red-200 hover:bg-red-50 hover:border-red-300"
                >
                  <ICONS.delete />
                </TertiaryButton>
              )}
            </div>
          ))}
        </div>
      </Card>

      <Card
        title="Next Steps - Care Partner"
        buttonText={<ICONS.plus size={16} />}
        onButtonClick={() => {
          // @ts-expect-error - TODO: fix this
          appendNextStepCarePartner("");
        }}
        ariaLabel="Add Care Partner Step"
        showButton={true}
      >
        <div className="mb-2 text-xs italic text-gray-500">
          (All next steps are optional and will be completed at the request of
          the care recipient.)
        </div>
        <div className="space-y-4 w-full">
          {nextStepCarePartnerFields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-3 w-full">
              <Input
                label={`Step ${index + 1}`}
                register={register(`nextStepCarePartner.${index}`)}
                error={errors.nextStepCarePartner?.[index]?.message}
                placeholder="Family caregiver training, schedule coordination, etc."
                mainClassname="w-full"
              />
              {nextStepCarePartnerFields.length > 1 && (
                <TertiaryButton
                  type="button"
                  onClick={() => removeNextStepCarePartner(index)}
                  className="text-red-600 border border-red-200 hover:bg-red-50 hover:border-red-300"
                >
                  <ICONS.delete />
                </TertiaryButton>
              )}
            </div>
          ))}
        </div>
      </Card>

      <div className="bg-basicWhite/90 backdrop-blur-sm rounded-2xl border border-gray-200/80 shadow-xs hover:shadow-sm transition-all duration-300 overflow-hidden">
        <div className="flex flex-col sm:flex-row justify-end gap-4 p-6">
          <PrimaryButton
            isLoading={postInitialCareAssessmentPlanMutation.isPending}
            disabled={postInitialCareAssessmentPlanMutation.isPending}
            type="submit"
            className="sm:!w-fit w-full md:text-base text-sm"
          >
            Save Initial Care Assessment Plan
          </PrimaryButton>
        </div>
      </div>
    </form>
  );
};
