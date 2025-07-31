import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  Input,
  DatePickerField,
  PrimaryButton,
  TextArea,
  TertiaryButton,
  Select,
  CommonLoader,
  PhoneNumberInput,
} from "@agensy/components";
import {
  comprehensiveCarePlanSchema,
  type ClientMedications,
  type ComprehensiveCarePlanFormData,
  type HealthcareProvider,
  type OpenedFileData,
} from "@agensy/types";
import { ICONS, SPECIALTIES } from "@agensy/constants";
import { useParams } from "react-router-dom";
import {
  useGetComprehensiveCarePlan,
  usePostComprehensiveCarePlanMutation,
} from "@agensy/api";
import { DateUtils } from "@agensy/utils";
import { useEffect } from "react";
import { toast } from "@agensy/utils";
import { useQueryClient } from "@tanstack/react-query";
import { useClientContext } from "@agensy/context";

const MultipleTextInputs = ({
  label,
  value = [],
  onChange,
  error,
}: {
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
  error?: string;
}) => {
  const addItem = () => {
    onChange([...value, ""]);
  };

  const removeItem = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, newValue: string) => {
    const newArray = [...value];
    newArray[index] = newValue;
    onChange(newArray);
  };

  // Ensure value is always an array
  const safeValue = Array.isArray(value) ? value : [];

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      {safeValue.map((item, index) => (
        <div key={index} className="flex gap-2">
          <div className="flex-1">
            <input
              type="text"
              value={item || ""}
              onChange={(e) => updateItem(index, e.target.value)}
              className=" text-darkGray bg-lightGray placeholder:text-darkGray p-2
          border-[1px] border-mediumGray rounded-xl w-full outline-none focus-within:border-basicBlue focus-within:shadow-sm focus-within:shadow-blue-200 transition-all duration-200"
              placeholder={`Enter ${label.toLowerCase()} item ${index + 1}`}
            />
          </div>
          {safeValue.length > 1 && (
            <button
              type="button"
              onClick={() => removeItem(index)}
              className="px-3 py-2 text-red-600 border border-red-200 rounded-md hover:bg-red-50 hover:border-red-300 transition-colors"
            >
              <ICONS.delete />
            </button>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={addItem}
        className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm"
      >
        <ICONS.plus />
        Add {label} Item
      </button>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};

export const ComprehensiveCarePlan = () => {
  const { setOpenedFileData } = useClientContext();
  const { clientId } = useParams();
  const queryClient = useQueryClient();
  const postComprehensiveCarePlanMutation =
    usePostComprehensiveCarePlanMutation();
  const {
    data: comprehensiveCarePlan,
    refetch,
    isFetching: isLoadingCarePlan,
  } = useGetComprehensiveCarePlan(clientId!);

  useEffect(() => {
    refetch();
  }, []);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    getValues,
    formState: { errors },
  } = useForm<ComprehensiveCarePlanFormData>({
    resolver: zodResolver(comprehensiveCarePlanSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      preferredHospital: "",
      pharmacyName: "",
      dateOfAssessment: "",
      dateOfCarePlan: "",
      personCompletingAssessment: "",
      presentForAssessment: "",
      goalsForAssessment: [] as string[],
      nextStepCareRecipient: [] as string[],
      nextStepCarePartner: [] as string[],
      focusedRecommendations: [],
      initialRequest: "",
      careRecipientGoals: "",
      demographicAndHistoricInformation: "",
      medicalHistory: "",
      medications: [],
      allergies: [],
      healthcareProviders: [],
      functionalAdls: {
        categoryName: "functional_adls",
        summary: "",
        deficitsNoted: "",
        detailedTable: {
          katzIndex: { description: "", score: "" },
          bathing: { description: "", score: "" },
          dressing: { description: "", score: "" },
          toileting: { description: "", score: "" },
          transfers: { description: "", score: "" },
          continence: { description: "", score: "" },
          feeding: { description: "", score: "" },
        },
        additionalData: "",
      },
      functionalIadls: {
        categoryName: "functional_iadls",
        summary: "",
        detailedTable: {
          telephone: { description: "", score: "" },
          shopping: { description: "", score: "" },
          foodPreparation: { description: "", score: "" },
          housekeeping: { description: "", score: "" },
          laundry: { description: "", score: "" },
          transportation: { description: "", score: "" },
          medication: { description: "", score: "" },
          finances: { description: "", score: "" },
        },
        additionalData: {
          identifiedProblem1: {
            identifiedProblem: "",
            interventionAction: "",
            goal: "",
            referralOptions: "",
          },
          identifiedProblem2: {
            identifiedProblem: "",
            interventionAction: "",
            goal: "",
            referralOptions: "",
          },
          identifiedProblem3: {
            identifiedProblem: "",
            interventionAction: "",
            goal: "",
            referralOptions: "",
          },
          identifiedProblem4: {
            identifiedProblem: "",
            interventionAction: "",
            goal: "",
            referralOptions: "",
          },
        },
      },
      homeSafety: {
        categoryName: "home_safety",
        summary: "",
        deficitsNoted: "",
        detailedTable: {
          arePathwaysClear: false,
          areThereThrowRugs: false,
          areStairsSafe: false,
          isThereClutterOrHoarding: false,
          isThereFireEscapeRoute: false,
          areFloorsSlippery: false,
          conditionOfFloorSurfaces: false,
          conditionOfCarpeting: false,
          areChairsSturdyAndStable: false,
          electricityFullyFunctional: false,
          adequateLighting: false,
          exposedWiresOrCords: false,
          conditionOfWiresAndPlugs: false,
          smokeDetectorsPresent: false,
          areThereSpaceHeaters: false,
          careRecipientSmokes: false,
          fireExtinguisherAccessible: false,
          conditionOfAppliances: false,
          kitchenSafetyHazards: false,
          locksOnDoorsAndWindows: false,
          emergencyNumbersPosted: false,
          accessibleTelephones: false,
          weaponsOrFirearmsPresent: false,
          petsPresent: false,
          unsanitaryConditionsPresent: false,
          medicationsSafelyStored: false,
          adequateAirConditioningOrHeat: false,
          conditionOfTubOrShower: false,
          conditionOfBed: false,
          other: false,
        },
      },
      memoryAndReasoning: {
        categoryName: "memory_reasoning",
        summary: "",
        deficitsNoted: "",
        detailedTable: {
          identifiedProblem1: {
            identifiedProblem: "",
            interventionAction: "",
            goal: "",
            referralOptions: "",
          },
          identifiedProblem2: {
            identifiedProblem: "",
            interventionAction: "",
            goal: "",
            referralOptions: "",
          },
          identifiedProblem3: {
            identifiedProblem: "",
            interventionAction: "",
            goal: "",
            referralOptions: "",
          },
          identifiedProblem4: {
            identifiedProblem: "",
            interventionAction: "",
            goal: "",
            referralOptions: "",
          },
        },
      },
      geriatricDepression: {
        categoryName: "geriatric_depression",
        summary: "",
        deficitsNoted: "",
        detailedTable: {
          identifiedProblem1: {
            identifiedProblem: "",
            interventionAction: "",
            goal: "",
            referralOptions: "",
          },
          identifiedProblem2: {
            identifiedProblem: "",
            interventionAction: "",
            goal: "",
            referralOptions: "",
          },
          identifiedProblem3: {
            identifiedProblem: "",
            interventionAction: "",
            goal: "",
            referralOptions: "",
          },
          identifiedProblem4: {
            identifiedProblem: "",
            interventionAction: "",
            goal: "",
            referralOptions: "",
          },
          identifiedProblem5: {
            identifiedProblem: "",
            interventionAction: "",
            goal: "",
            referralOptions: "",
          },
        },
      },
      nutritionalHealth: {
        categoryName: "nutritional_health",
        summary: "",
        deficitsNoted: "",
        detailedTable: {
          identifiedProblem1: {
            identifiedProblem: "",
            interventionAction: "",
            goal: "",
            referralOptions: "",
          },
          identifiedProblem2: {
            identifiedProblem: "",
            interventionAction: "",
            goal: "",
            referralOptions: "",
          },
          identifiedProblem3: {
            identifiedProblem: "",
            interventionAction: "",
            goal: "",
            referralOptions: "",
          },
          identifiedProblem4: {
            identifiedProblem: "",
            interventionAction: "",
            goal: "",
            referralOptions: "",
          },
          identifiedProblem5: {
            identifiedProblem: "",
            interventionAction: "",
            goal: "",
            referralOptions: "",
          },
        },
      },
      legalAndFinancial: {
        categoryName: "legal_financial",
        summary: "",
        deficitsNoted: "",
        detailedTable: {
          identifiedProblem1: {
            identifiedProblem: "",
            interventionAction: "",
            goal: "",
            referralOptions: "",
          },
          identifiedProblem2: {
            identifiedProblem: "",
            interventionAction: "",
            goal: "",
            referralOptions: "",
          },
          identifiedProblem3: {
            identifiedProblem: "",
            interventionAction: "",
            goal: "",
            referralOptions: "",
          },
          identifiedProblem4: {
            identifiedProblem: "",
            interventionAction: "",
            goal: "",
            referralOptions: "",
          },
          identifiedProblem5: {
            identifiedProblem: "",
            interventionAction: "",
            goal: "",
            referralOptions: "",
          },
          identifiedProblem6: {
            identifiedProblem: "",
            interventionAction: "",
            goal: "",
            referralOptions: "",
          },
          identifiedProblem7: {
            identifiedProblem: "",
            interventionAction: "",
            goal: "",
            referralOptions: "",
          },
          identifiedProblem8: {
            identifiedProblem: "",
            interventionAction: "",
            goal: "",
            referralOptions: "",
          },
          identifiedProblem9: {
            identifiedProblem: "",
            interventionAction: "",
            goal: "",
            referralOptions: "",
          },
          identifiedProblem10: {
            identifiedProblem: "",
            interventionAction: "",
            goal: "",
            referralOptions: "",
          },
        },
      },
      careGiverSupport: {
        summary: "",
        deficitsNoted: "",
        detailedTable: {
          identifiedProblem1: {
            identifiedProblem: "",
            interventionAction: "",
            goal: "",
            referralOptions: "",
          },
          identifiedProblem2: {
            identifiedProblem: "",
            interventionAction: "",
            goal: "",
            referralOptions: "",
          },
          identifiedProblem3: {
            identifiedProblem: "",
            interventionAction: "",
            goal: "",
            referralOptions: "",
          },
          identifiedProblem4: {
            identifiedProblem: "",
            interventionAction: "",
            goal: "",
            referralOptions: "",
          },
        },
      },
    },
  });

  const {
    fields: nextStepCareRecipientFields,
    append: appendNextStepCareRecipient,
    remove: removeNextStepCareRecipient,
  } = useFieldArray<ComprehensiveCarePlanFormData>({
    control,
    // @ts-expect-error - TODO: fix this
    name: "nextStepCareRecipient",
  });

  const {
    fields: nextStepCarePartnerFields,
    append: appendNextStepCarePartner,
    remove: removeNextStepCarePartner,
  } = useFieldArray<ComprehensiveCarePlanFormData>({
    control,
    // @ts-expect-error - TODO: fix this
    name: "nextStepCarePartner",
  });

  const {
    fields: focusedRecommendationsFields,
    append: appendFocusedRecommendation,
    remove: removeFocusedRecommendation,
  } = useFieldArray<ComprehensiveCarePlanFormData>({
    control,
    name: "focusedRecommendations",
  });

  const {
    fields: medicationsFields,
    append: appendMedication,
    remove: removeMedication,
  } = useFieldArray<ComprehensiveCarePlanFormData>({
    control,
    name: "medications",
  });

  const {
    fields: allergiesFields,
    append: appendAllergy,
    remove: removeAllergy,
  } = useFieldArray<ComprehensiveCarePlanFormData>({
    control,
    name: "allergies",
  });

  const {
    fields: healthcareProvidersFields,
    append: appendHealthcareProvider,
    remove: removeHealthcareProvider,
  } = useFieldArray<ComprehensiveCarePlanFormData>({
    control,
    name: "healthcareProviders",
  });

  useEffect(() => {
    if (postComprehensiveCarePlanMutation.status === "success") {
      toast.success(
        "Comprehensive Care Plan Successfully Updated",
        "Your client's comprehensive care plan has been saved and is now up to date."
      );
      queryClient.invalidateQueries({ queryKey: ["client", clientId] });
    } else if (postComprehensiveCarePlanMutation.status === "error") {
      toast.error(
        "Error Occurred",
        String(postComprehensiveCarePlanMutation.error)
      );
    }
  }, [postComprehensiveCarePlanMutation.status]);

  useEffect(() => {
    if (comprehensiveCarePlan) {
      reset({
        firstName: comprehensiveCarePlan.client_info.first_name || "",
        lastName: comprehensiveCarePlan.client_info.last_name || "",
        dateOfBirth: comprehensiveCarePlan.client_info.date_of_birth
          ? DateUtils.formatDateToRequiredFormat(
              comprehensiveCarePlan.client_info.date_of_birth
            )
          : "",
        preferredHospital:
          comprehensiveCarePlan.client_info.preferred_hospital || "",
        pharmacyName: comprehensiveCarePlan.client_info.pharmacy_name || "",
        demographicAndHistoricInformation:
          comprehensiveCarePlan.comprehensive_care_plan_assessment
            .demographic_and_historic_information || "",
        careRecipientGoals: comprehensiveCarePlan
          .comprehensive_care_plan_assessment.care_recipient_goals
          ? comprehensiveCarePlan.comprehensive_care_plan_assessment
              .care_recipient_goals
          : "",
        initialRequest: comprehensiveCarePlan.comprehensive_care_plan_assessment
          .initial_request
          ? comprehensiveCarePlan.comprehensive_care_plan_assessment
              .initial_request
          : "",
        medicalHistory: comprehensiveCarePlan.comprehensive_care_plan_assessment
          .medical_history
          ? comprehensiveCarePlan.comprehensive_care_plan_assessment
              .medical_history
          : "",
        focusedRecommendations:
          comprehensiveCarePlan.focused_recommendations &&
          comprehensiveCarePlan.focused_recommendations.length > 0
            ? comprehensiveCarePlan.focused_recommendations?.map(
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
          summary: comprehensiveCarePlan.functional_adls?.summary
            ? comprehensiveCarePlan.functional_adls?.summary
            : "",
          categoryName: comprehensiveCarePlan.functional_adls?.category_name
            ? comprehensiveCarePlan.functional_adls?.category_name
            : "",
          deficitsNoted: comprehensiveCarePlan.functional_adls?.deficits_noted
            ? comprehensiveCarePlan.functional_adls?.deficits_noted
              ? "true"
              : "false"
            : "false",
          detailedTable: {
            bathing: {
              description: comprehensiveCarePlan.functional_adls?.detailed_table
                ?.bathing?.description
                ? comprehensiveCarePlan.functional_adls?.detailed_table?.bathing
                    ?.description
                : "",
              score: comprehensiveCarePlan.functional_adls?.detailed_table
                ?.bathing?.score
                ? String(
                    comprehensiveCarePlan.functional_adls?.detailed_table
                      ?.bathing?.score
                  )
                : "",
            },
            dressing: {
              description: comprehensiveCarePlan.functional_adls?.detailed_table
                ?.dressing?.description
                ? String(
                    comprehensiveCarePlan.functional_adls?.detailed_table
                      ?.dressing?.description
                  )
                : "",
              score: comprehensiveCarePlan.functional_adls?.detailed_table
                ?.dressing?.score
                ? String(
                    comprehensiveCarePlan.functional_adls?.detailed_table
                      ?.dressing?.score
                  )
                : "",
            },
            feeding: {
              description: comprehensiveCarePlan.functional_adls?.detailed_table
                ?.feeding?.description
                ? comprehensiveCarePlan.functional_adls?.detailed_table?.feeding
                    ?.description
                : "",
              score: comprehensiveCarePlan.functional_adls?.detailed_table
                ?.feeding?.score
                ? String(
                    comprehensiveCarePlan.functional_adls?.detailed_table
                      ?.feeding?.score
                  )
                : "",
            },
            toileting: {
              description: comprehensiveCarePlan.functional_adls?.detailed_table
                ?.toileting?.description
                ? comprehensiveCarePlan.functional_adls?.detailed_table
                    ?.toileting?.description
                : "",
              score: comprehensiveCarePlan.functional_adls?.detailed_table
                ?.toileting?.score
                ? String(
                    comprehensiveCarePlan.functional_adls?.detailed_table
                      ?.toileting?.score
                  )
                : "",
            },
            continence: {
              description: comprehensiveCarePlan.functional_adls?.detailed_table
                ?.continence?.description
                ? comprehensiveCarePlan.functional_adls?.detailed_table
                    ?.continence?.description
                : "",
              score: comprehensiveCarePlan.functional_adls?.detailed_table
                ?.continence?.score
                ? String(
                    comprehensiveCarePlan.functional_adls?.detailed_table
                      ?.continence?.score
                  )
                : "",
            },
            transfers: {
              description: comprehensiveCarePlan.functional_adls?.detailed_table
                ?.transfers?.description
                ? comprehensiveCarePlan.functional_adls?.detailed_table
                    ?.transfers?.description
                : "",
              score: comprehensiveCarePlan.functional_adls?.detailed_table
                ?.transfers?.score
                ? String(
                    comprehensiveCarePlan.functional_adls?.detailed_table
                      ?.transfers?.score
                  )
                : "",
            },
            katzIndex: {
              description: comprehensiveCarePlan.functional_adls?.detailed_table
                ?.katz_index?.description
                ? comprehensiveCarePlan.functional_adls?.detailed_table
                    ?.katz_index?.description
                : "",
              score: comprehensiveCarePlan.functional_adls?.detailed_table
                ?.katz_index?.score
                ? String(
                    comprehensiveCarePlan.functional_adls?.detailed_table
                      ?.katz_index?.score
                  )
                : "",
            },
          },
        },
        functionalIadls: {
          summary: comprehensiveCarePlan.functional_iadls?.summary
            ? comprehensiveCarePlan.functional_iadls?.summary
            : "",
          categoryName: comprehensiveCarePlan.functional_iadls?.category_name
            ? comprehensiveCarePlan.functional_iadls?.category_name
            : "",
          detailedTable: {
            telephone: {
              description: comprehensiveCarePlan.functional_iadls
                ?.detailed_table?.telephone?.description
                ? comprehensiveCarePlan.functional_iadls?.detailed_table
                    ?.telephone?.description
                : "",
              score: comprehensiveCarePlan.functional_iadls?.detailed_table
                ?.telephone?.score
                ? String(
                    comprehensiveCarePlan.functional_iadls?.detailed_table
                      ?.telephone?.score
                  )
                : "",
            },
            shopping: {
              description: comprehensiveCarePlan.functional_iadls
                ?.detailed_table?.shopping?.description
                ? comprehensiveCarePlan.functional_iadls?.detailed_table
                    ?.shopping?.description
                : "",
              score: comprehensiveCarePlan.functional_iadls?.detailed_table
                ?.shopping?.score
                ? String(
                    comprehensiveCarePlan.functional_iadls?.detailed_table
                      ?.shopping?.score
                  )
                : "",
            },
            foodPreparation: {
              description: comprehensiveCarePlan.functional_iadls
                ?.detailed_table?.foodPreparation?.description
                ? comprehensiveCarePlan.functional_iadls?.detailed_table
                    ?.foodPreparation?.description
                : "",
              score: comprehensiveCarePlan.functional_iadls?.detailed_table
                ?.foodPreparation?.score
                ? String(
                    comprehensiveCarePlan.functional_iadls?.detailed_table
                      ?.foodPreparation?.score
                  )
                : "",
            },
            housekeeping: {
              description: comprehensiveCarePlan.functional_iadls
                ?.detailed_table?.housekeeping?.description
                ? comprehensiveCarePlan.functional_iadls?.detailed_table
                    ?.housekeeping?.description
                : "",
              score: comprehensiveCarePlan.functional_iadls?.detailed_table
                ?.housekeeping?.score
                ? String(
                    comprehensiveCarePlan.functional_iadls?.detailed_table
                      ?.housekeeping?.score
                  )
                : "",
            },
            laundry: {
              description: comprehensiveCarePlan.functional_iadls
                ?.detailed_table?.laundry?.description
                ? comprehensiveCarePlan.functional_iadls?.detailed_table
                    ?.laundry?.description
                : "",
              score: comprehensiveCarePlan.functional_iadls?.detailed_table
                ?.laundry?.score
                ? String(
                    comprehensiveCarePlan.functional_iadls?.detailed_table
                      ?.laundry?.score
                  )
                : "",
            },
            transportation: {
              description: comprehensiveCarePlan.functional_iadls
                ?.detailed_table?.transportation?.description
                ? comprehensiveCarePlan.functional_iadls?.detailed_table
                    ?.transportation?.description
                : "",
              score: comprehensiveCarePlan.functional_iadls?.detailed_table
                ?.transportation?.score
                ? String(
                    comprehensiveCarePlan.functional_iadls?.detailed_table
                      ?.transportation?.score
                  )
                : "",
            },
            medication: {
              description: comprehensiveCarePlan.functional_iadls
                ?.detailed_table?.medication?.description
                ? comprehensiveCarePlan.functional_iadls?.detailed_table
                    ?.medication?.description
                : "",
              score: comprehensiveCarePlan.functional_iadls?.detailed_table
                ?.medication?.score
                ? String(
                    comprehensiveCarePlan.functional_iadls?.detailed_table
                      ?.medication?.score
                  )
                : "",
            },
            finances: {
              description: comprehensiveCarePlan.functional_iadls
                ?.detailed_table?.finances?.description
                ? comprehensiveCarePlan.functional_iadls?.detailed_table
                    ?.finances?.description
                : "",
              score: comprehensiveCarePlan.functional_iadls?.detailed_table
                ?.finances?.score
                ? String(
                    comprehensiveCarePlan.functional_iadls?.detailed_table
                      ?.finances?.score
                  )
                : "",
            },
          },
          additionalData: {
            identifiedProblem1: {
              identifiedProblem: comprehensiveCarePlan.functional_iadls
                ?.additional_data?.identified_problem_1?.identified_problem
                ? comprehensiveCarePlan.functional_iadls?.additional_data
                    ?.identified_problem_1?.identified_problem
                : "",
              goal: comprehensiveCarePlan.functional_iadls?.additional_data
                ?.identified_problem_1?.goal
                ? comprehensiveCarePlan.functional_iadls?.additional_data
                    ?.identified_problem_1?.goal
                : "",
              referralOptions: comprehensiveCarePlan.functional_iadls
                ?.additional_data?.identified_problem_1?.referral_options
                ? comprehensiveCarePlan.functional_iadls?.additional_data
                    ?.identified_problem_1?.referral_options
                : "",
              interventionAction: comprehensiveCarePlan.functional_iadls
                ?.additional_data?.identified_problem_1?.intervention_action
                ? comprehensiveCarePlan.functional_iadls?.additional_data
                    ?.identified_problem_1?.intervention_action
                : "",
            },
            identifiedProblem2: {
              identifiedProblem: comprehensiveCarePlan.functional_iadls
                ?.additional_data?.identified_problem_2?.identified_problem
                ? comprehensiveCarePlan.functional_iadls?.additional_data
                    ?.identified_problem_2?.identified_problem
                : "",
              goal: comprehensiveCarePlan.functional_iadls?.additional_data
                ?.identified_problem_2?.goal
                ? comprehensiveCarePlan.functional_iadls?.additional_data
                    ?.identified_problem_2?.goal
                : "",
              referralOptions: comprehensiveCarePlan.functional_iadls
                ?.additional_data?.identified_problem_2?.referral_options
                ? comprehensiveCarePlan.functional_iadls?.additional_data
                    ?.identified_problem_2?.referral_options
                : "",
              interventionAction: comprehensiveCarePlan.functional_iadls
                ?.additional_data?.identified_problem_2?.intervention_action
                ? comprehensiveCarePlan.functional_iadls?.additional_data
                    ?.identified_problem_2?.intervention_action
                : "",
            },
            identifiedProblem3: {
              identifiedProblem: comprehensiveCarePlan.functional_iadls
                ?.additional_data?.identified_problem_3?.identified_problem
                ? comprehensiveCarePlan.functional_iadls?.additional_data
                    ?.identified_problem_3?.identified_problem
                : "",
              referralOptions: comprehensiveCarePlan.functional_iadls
                ?.additional_data?.identified_problem_3?.referral_options
                ? comprehensiveCarePlan.functional_iadls?.additional_data
                    ?.identified_problem_3?.referral_options
                : "",
              interventionAction: comprehensiveCarePlan.functional_iadls
                ?.additional_data?.identified_problem_3?.intervention_action
                ? comprehensiveCarePlan.functional_iadls?.additional_data
                    ?.identified_problem_3?.intervention_action
                : "",
            },
            identifiedProblem4: {
              identifiedProblem: comprehensiveCarePlan.functional_iadls
                ?.additional_data?.identified_problem_4?.identified_problem
                ? comprehensiveCarePlan.functional_iadls?.additional_data
                    ?.identified_problem_4?.identified_problem
                : "",
              goal: comprehensiveCarePlan.functional_iadls?.additional_data
                ?.identified_problem_4?.goal
                ? comprehensiveCarePlan.functional_iadls?.additional_data
                    ?.identified_problem_4?.goal
                : "",
              referralOptions: comprehensiveCarePlan.functional_adls
                ?.additional_data?.identified_problem_4?.referral_options
                ? comprehensiveCarePlan.functional_iadls?.additional_data
                    ?.identified_problem_4?.referral_options
                : "",
              interventionAction: comprehensiveCarePlan.functional_adls
                ?.additional_data?.identified_problem_4?.intervention_action
                ? comprehensiveCarePlan.functional_iadls?.additional_data
                    ?.identified_problem_4?.intervention_action
                : "",
            },
          },
        },
        homeSafety: {
          summary: comprehensiveCarePlan.home_safety?.summary
            ? comprehensiveCarePlan.home_safety?.summary
            : "",
          categoryName: comprehensiveCarePlan.home_safety?.category_name
            ? comprehensiveCarePlan.home_safety?.category_name
            : "",
          deficitsNoted: comprehensiveCarePlan.home_safety?.deficits_noted
            ? comprehensiveCarePlan.home_safety?.deficits_noted
              ? "true"
              : "false"
            : "false",
          detailedTable: {
            arePathwaysClear: comprehensiveCarePlan.home_safety?.detailed_table
              ?.are_pathways_clear
              ? comprehensiveCarePlan.home_safety?.detailed_table
                  ?.are_pathways_clear
              : false,
            areThereThrowRugs: comprehensiveCarePlan.home_safety?.detailed_table
              ?.are_there_throw_rugs
              ? comprehensiveCarePlan.home_safety?.detailed_table
                  ?.are_there_throw_rugs
              : false,
            areFloorsSlippery: comprehensiveCarePlan.home_safety?.detailed_table
              ?.are_floors_slippery
              ? comprehensiveCarePlan.home_safety?.detailed_table
                  ?.are_floors_slippery
              : false,
            areStairsSafe: comprehensiveCarePlan.home_safety?.detailed_table
              ?.are_stairs_safe
              ? comprehensiveCarePlan.home_safety?.detailed_table
                  ?.are_stairs_safe
              : false,
            isThereClutterOrHoarding: comprehensiveCarePlan.home_safety
              ?.detailed_table?.is_there_clutter_or_hoarding
              ? comprehensiveCarePlan.home_safety?.detailed_table
                  ?.is_there_clutter_or_hoarding
              : false,
            isThereFireEscapeRoute: comprehensiveCarePlan.home_safety
              ?.detailed_table?.is_there_fire_escape_route
              ? comprehensiveCarePlan.home_safety?.detailed_table
                  ?.is_there_fire_escape_route
              : false,
            conditionOfFloorSurfaces: comprehensiveCarePlan.home_safety
              ?.detailed_table?.condition_of_floor_surfaces
              ? comprehensiveCarePlan.home_safety?.detailed_table
                  ?.condition_of_floor_surfaces
              : false,
            conditionOfCarpeting: comprehensiveCarePlan.home_safety
              ?.detailed_table?.condition_of_carpeting
              ? comprehensiveCarePlan.home_safety?.detailed_table
                  ?.condition_of_carpeting
              : false,
            areChairsSturdyAndStable: comprehensiveCarePlan.home_safety
              ?.detailed_table?.are_chairs_sturdy_and_stable
              ? comprehensiveCarePlan.home_safety?.detailed_table
                  ?.are_chairs_sturdy_and_stable
              : false,
            electricityFullyFunctional: comprehensiveCarePlan.home_safety
              ?.detailed_table?.electricity_fully_functional
              ? comprehensiveCarePlan.home_safety?.detailed_table
                  ?.electricity_fully_functional
              : false,
            adequateLighting: comprehensiveCarePlan.home_safety?.detailed_table
              ?.adequate_lighting
              ? comprehensiveCarePlan.home_safety?.detailed_table
                  ?.adequate_lighting
              : false,
            exposedWiresOrCords: comprehensiveCarePlan.home_safety
              ?.detailed_table?.exposed_wires_or_cords
              ? comprehensiveCarePlan.home_safety?.detailed_table
                  ?.exposed_wires_or_cords
              : false,
            conditionOfWiresAndPlugs: comprehensiveCarePlan.home_safety
              ?.detailed_table?.condition_of_wires_and_plugs
              ? comprehensiveCarePlan.home_safety?.detailed_table
                  ?.condition_of_wires_and_plugs
              : false,
            smokeDetectorsPresent: comprehensiveCarePlan.home_safety
              ?.detailed_table?.smoke_detectors_present
              ? comprehensiveCarePlan.home_safety?.detailed_table
                  ?.smoke_detectors_present
              : false,
            areThereSpaceHeaters: comprehensiveCarePlan.home_safety
              ?.detailed_table?.are_there_space_heaters
              ? comprehensiveCarePlan.home_safety?.detailed_table
                  ?.are_there_space_heaters
              : false,
            careRecipientSmokes: comprehensiveCarePlan.home_safety
              ?.detailed_table?.care_recipient_smokes
              ? comprehensiveCarePlan.home_safety?.detailed_table
                  ?.care_recipient_smokes
              : false,
            fireExtinguisherAccessible: comprehensiveCarePlan.home_safety
              ?.detailed_table?.fire_extinguisher_accessible
              ? comprehensiveCarePlan.home_safety?.detailed_table
                  ?.fire_extinguisher_accessible
              : false,
            conditionOfAppliances: comprehensiveCarePlan.home_safety
              ?.detailed_table?.condition_of_appliances
              ? comprehensiveCarePlan.home_safety?.detailed_table
                  ?.condition_of_appliances
              : false,
            kitchenSafetyHazards: comprehensiveCarePlan.home_safety
              ?.detailed_table?.kitchen_safety_hazards
              ? comprehensiveCarePlan.home_safety?.detailed_table
                  ?.kitchen_safety_hazards
              : false,
            locksOnDoorsAndWindows: comprehensiveCarePlan.home_safety
              ?.detailed_table?.locks_on_doors_and_windows
              ? comprehensiveCarePlan.home_safety?.detailed_table
                  ?.locks_on_doors_and_windows
              : false,
            emergencyNumbersPosted: comprehensiveCarePlan.home_safety
              ?.detailed_table?.emergency_numbers_posted
              ? comprehensiveCarePlan.home_safety?.detailed_table
                  ?.emergency_numbers_posted
              : false,
            accessibleTelephones: comprehensiveCarePlan.home_safety
              ?.detailed_table?.accessible_telephones
              ? comprehensiveCarePlan.home_safety?.detailed_table
                  ?.accessible_telephones
              : false,
            weaponsOrFirearmsPresent: comprehensiveCarePlan.home_safety
              ?.detailed_table?.weapons_or_firearms_present
              ? comprehensiveCarePlan.home_safety?.detailed_table
                  ?.weapons_or_firearms_present
              : false,
            petsPresent: comprehensiveCarePlan.home_safety?.detailed_table
              ?.pets_present
              ? comprehensiveCarePlan.home_safety?.detailed_table?.pets_present
              : false,
            unsanitaryConditionsPresent: comprehensiveCarePlan.home_safety
              ?.detailed_table?.unsanitary_conditions_present
              ? comprehensiveCarePlan.home_safety?.detailed_table
                  ?.unsanitary_conditions_present
              : false,
            medicationsSafelyStored: comprehensiveCarePlan.home_safety
              ?.detailed_table?.medications_safely_stored
              ? comprehensiveCarePlan.home_safety?.detailed_table
                  ?.medications_safely_stored
              : false,
            adequateAirConditioningOrHeat: comprehensiveCarePlan.home_safety
              ?.detailed_table?.adequate_air_conditioning_or_heat
              ? comprehensiveCarePlan.home_safety?.detailed_table
                  ?.adequate_air_conditioning_or_heat
              : false,
            conditionOfTubOrShower: comprehensiveCarePlan.home_safety
              ?.detailed_table?.condition_of_tub_or_shower
              ? comprehensiveCarePlan.home_safety?.detailed_table
                  ?.condition_of_tub_or_shower
              : false,
            conditionOfBed: comprehensiveCarePlan.home_safety?.detailed_table
              ?.condition_of_bed
              ? comprehensiveCarePlan.home_safety?.detailed_table
                  ?.condition_of_bed
              : false,
            other: comprehensiveCarePlan.home_safety?.detailed_table?.other
              ? comprehensiveCarePlan.home_safety?.detailed_table?.other
              : false,
          },
        },
        memoryAndReasoning: {
          summary: comprehensiveCarePlan.memory_and_reasoning?.summary
            ? comprehensiveCarePlan.memory_and_reasoning?.summary
            : "",
          categoryName: comprehensiveCarePlan.memory_and_reasoning
            ?.category_name
            ? comprehensiveCarePlan.memory_and_reasoning?.category_name
            : "",
          deficitsNoted: comprehensiveCarePlan.memory_and_reasoning
            ?.deficits_noted
            ? comprehensiveCarePlan.memory_and_reasoning?.deficits_noted
              ? "true"
              : "false"
            : "false",
          detailedTable: {
            identifiedProblem1: {
              identifiedProblem: comprehensiveCarePlan.memory_and_reasoning
                ?.detailed_table?.identified_problem_1?.identified_problem
                ? comprehensiveCarePlan.memory_and_reasoning?.detailed_table
                    ?.identified_problem_1?.identified_problem
                : "",
              goal: comprehensiveCarePlan.memory_and_reasoning?.detailed_table
                ?.identified_problem_1?.goal
                ? comprehensiveCarePlan.memory_and_reasoning?.detailed_table
                    ?.identified_problem_1?.goal
                : "",
              referralOptions: comprehensiveCarePlan.memory_and_reasoning
                ?.detailed_table?.identified_problem_1?.referral_options
                ? comprehensiveCarePlan.memory_and_reasoning?.detailed_table
                    ?.identified_problem_1?.referral_options
                : "",
              interventionAction: comprehensiveCarePlan.memory_and_reasoning
                ?.detailed_table?.identified_problem_1?.intervention_action
                ? comprehensiveCarePlan.memory_and_reasoning?.detailed_table
                    ?.identified_problem_1?.intervention_action
                : "",
            },
            identifiedProblem2: {
              identifiedProblem: comprehensiveCarePlan.memory_and_reasoning
                ?.detailed_table?.identified_problem_2?.identified_problem
                ? comprehensiveCarePlan.memory_and_reasoning?.detailed_table
                    ?.identified_problem_2?.identified_problem
                : "",
              goal: comprehensiveCarePlan.memory_and_reasoning?.detailed_table
                ?.identified_problem_2?.goal
                ? comprehensiveCarePlan.memory_and_reasoning?.detailed_table
                    ?.identified_problem_2?.goal
                : "",
              referralOptions: comprehensiveCarePlan.memory_and_reasoning
                ?.detailed_table?.identified_problem_2?.referral_options
                ? comprehensiveCarePlan.memory_and_reasoning?.detailed_table
                    ?.identified_problem_2?.referral_options
                : "",
              interventionAction: comprehensiveCarePlan.memory_and_reasoning
                ?.detailed_table?.identified_problem_2?.intervention_action
                ? comprehensiveCarePlan.memory_and_reasoning?.detailed_table
                    ?.identified_problem_2?.intervention_action
                : "",
            },
            identifiedProblem3: {
              identifiedProblem: comprehensiveCarePlan.memory_and_reasoning
                ?.detailed_table?.identified_problem_3?.identified_problem
                ? comprehensiveCarePlan.memory_and_reasoning?.detailed_table
                    ?.identified_problem_3?.identified_problem
                : "",
              goal: comprehensiveCarePlan.memory_and_reasoning?.detailed_table
                ?.identified_problem_3?.goal
                ? comprehensiveCarePlan.memory_and_reasoning?.detailed_table
                    ?.identified_problem_3?.goal
                : "",
              referralOptions: comprehensiveCarePlan.memory_and_reasoning
                ?.detailed_table?.identified_problem_3?.referral_options
                ? comprehensiveCarePlan.memory_and_reasoning?.detailed_table
                    ?.identified_problem_3?.referral_options
                : "",
              interventionAction: comprehensiveCarePlan.memory_and_reasoning
                ?.detailed_table?.identified_problem_3?.intervention_action
                ? comprehensiveCarePlan.memory_and_reasoning?.detailed_table
                    ?.identified_problem_3?.intervention_action
                : "",
            },
            identifiedProblem4: {
              identifiedProblem: comprehensiveCarePlan.memory_and_reasoning
                ?.detailed_table?.identified_problem_4?.identified_problem
                ? comprehensiveCarePlan.memory_and_reasoning?.detailed_table
                    ?.identified_problem_4?.identified_problem
                : "",
              goal: comprehensiveCarePlan.memory_and_reasoning?.detailed_table
                ?.identified_problem_4?.goal
                ? comprehensiveCarePlan.memory_and_reasoning?.detailed_table
                    ?.identified_problem_4?.goal
                : "",
              referralOptions: comprehensiveCarePlan.memory_and_reasoning
                ?.detailed_table?.identified_problem_4?.referral_options
                ? comprehensiveCarePlan.memory_and_reasoning?.detailed_table
                    ?.identified_problem_4?.referral_options
                : "",
              interventionAction: comprehensiveCarePlan.memory_and_reasoning
                ?.detailed_table?.identified_problem_4?.intervention_action
                ? comprehensiveCarePlan.memory_and_reasoning?.detailed_table
                    ?.identified_problem_4?.intervention_action
                : "",
            },
          },
        },
        geriatricDepression: {
          summary: comprehensiveCarePlan.geriatric_depression?.summary
            ? comprehensiveCarePlan.geriatric_depression?.summary
            : "",
          categoryName: comprehensiveCarePlan.geriatric_depression
            ?.category_name
            ? comprehensiveCarePlan.geriatric_depression?.category_name
            : "",
          deficitsNoted: comprehensiveCarePlan.geriatric_depression
            ?.deficits_noted
            ? comprehensiveCarePlan.geriatric_depression?.deficits_noted
              ? "true"
              : "false"
            : "false",
          detailedTable: {
            identifiedProblem1: {
              identifiedProblem: comprehensiveCarePlan.geriatric_depression
                ?.detailed_table?.identified_problem_1?.identified_problem
                ? comprehensiveCarePlan.geriatric_depression?.detailed_table
                    ?.identified_problem_1?.identified_problem
                : "",
              goal: comprehensiveCarePlan.geriatric_depression?.detailed_table
                ?.identified_problem_1?.goal
                ? comprehensiveCarePlan.geriatric_depression?.detailed_table
                    ?.identified_problem_1?.goal
                : "",
              referralOptions: comprehensiveCarePlan.geriatric_depression
                ?.detailed_table?.identified_problem_1?.referral_options
                ? comprehensiveCarePlan.geriatric_depression?.detailed_table
                    ?.identified_problem_1?.referral_options
                : "",
              interventionAction: comprehensiveCarePlan.geriatric_depression
                ?.detailed_table?.identified_problem_1?.intervention_action
                ? comprehensiveCarePlan.geriatric_depression?.detailed_table
                    ?.identified_problem_1?.intervention_action
                : "",
            },
            identifiedProblem2: {
              identifiedProblem: comprehensiveCarePlan.geriatric_depression
                ?.detailed_table?.identified_problem_2?.identified_problem
                ? comprehensiveCarePlan.geriatric_depression?.detailed_table
                    ?.identified_problem_2?.identified_problem
                : "",
              goal: comprehensiveCarePlan.geriatric_depression?.detailed_table
                ?.identified_problem_2?.goal
                ? comprehensiveCarePlan.geriatric_depression?.detailed_table
                    ?.identified_problem_2?.goal
                : "",
              referralOptions: comprehensiveCarePlan.geriatric_depression
                ?.detailed_table?.identified_problem_2?.referral_options
                ? comprehensiveCarePlan.geriatric_depression?.detailed_table
                    ?.identified_problem_2?.referral_options
                : "",
              interventionAction: comprehensiveCarePlan.geriatric_depression
                ?.detailed_table?.identified_problem_2?.intervention_action
                ? comprehensiveCarePlan.geriatric_depression?.detailed_table
                    ?.identified_problem_2?.intervention_action
                : "",
            },
            identifiedProblem3: {
              identifiedProblem: comprehensiveCarePlan.geriatric_depression
                ?.detailed_table?.identified_problem_3?.identified_problem
                ? comprehensiveCarePlan.geriatric_depression?.detailed_table
                    ?.identified_problem_3?.identified_problem
                : "",
              goal: comprehensiveCarePlan.geriatric_depression?.detailed_table
                ?.identified_problem_3?.goal
                ? comprehensiveCarePlan.geriatric_depression?.detailed_table
                    ?.identified_problem_3?.goal
                : "",
              referralOptions: comprehensiveCarePlan.geriatric_depression
                ?.detailed_table?.identified_problem_3?.referral_options
                ? comprehensiveCarePlan.geriatric_depression?.detailed_table
                    ?.identified_problem_3?.referral_options
                : "",
              interventionAction: comprehensiveCarePlan.geriatric_depression
                ?.detailed_table?.identified_problem_3?.intervention_action
                ? comprehensiveCarePlan.geriatric_depression?.detailed_table
                    ?.identified_problem_3?.intervention_action
                : "",
            },
            identifiedProblem4: {
              identifiedProblem: comprehensiveCarePlan.geriatric_depression
                ?.detailed_table?.identified_problem_4?.identified_problem
                ? comprehensiveCarePlan.geriatric_depression?.detailed_table
                    ?.identified_problem_4?.identified_problem
                : "",
              goal: comprehensiveCarePlan.geriatric_depression?.detailed_table
                ?.identified_problem_4?.goal
                ? comprehensiveCarePlan.geriatric_depression?.detailed_table
                    ?.identified_problem_4?.goal
                : "",
              referralOptions: comprehensiveCarePlan.geriatric_depression
                ?.detailed_table?.identified_problem_4?.referral_options
                ? comprehensiveCarePlan.geriatric_depression?.detailed_table
                    ?.identified_problem_4?.referral_options
                : "",
              interventionAction: comprehensiveCarePlan.geriatric_depression
                ?.detailed_table?.identified_problem_4?.intervention_action
                ? comprehensiveCarePlan.geriatric_depression?.detailed_table
                    ?.identified_problem_4?.intervention_action
                : "",
            },
            identifiedProblem5: {
              identifiedProblem: comprehensiveCarePlan.geriatric_depression
                ?.detailed_table?.identified_problem_5?.identified_problem
                ? comprehensiveCarePlan.geriatric_depression?.detailed_table
                    ?.identified_problem_5?.identified_problem
                : "",
              goal: comprehensiveCarePlan.geriatric_depression?.detailed_table
                ?.identified_problem_5?.goal
                ? comprehensiveCarePlan.geriatric_depression?.detailed_table
                    ?.identified_problem_5?.goal
                : "",
              referralOptions: comprehensiveCarePlan.geriatric_depression
                ?.detailed_table?.identified_problem_5?.referral_options
                ? comprehensiveCarePlan.geriatric_depression?.detailed_table
                    ?.identified_problem_5?.referral_options
                : "",
              interventionAction: comprehensiveCarePlan.geriatric_depression
                ?.detailed_table?.identified_problem_5?.intervention_action
                ? comprehensiveCarePlan.geriatric_depression?.detailed_table
                    ?.identified_problem_5?.intervention_action
                : "",
            },
          },
        },
        nutritionalHealth: {
          summary: comprehensiveCarePlan.nutritional_health?.summary
            ? comprehensiveCarePlan.nutritional_health?.summary
            : "",
          deficitsNoted: comprehensiveCarePlan.nutritional_health
            ?.deficits_noted
            ? comprehensiveCarePlan.nutritional_health?.deficits_noted
              ? "true"
              : "false"
            : "false",
          categoryName: comprehensiveCarePlan.nutritional_health?.category_name
            ? comprehensiveCarePlan.nutritional_health?.category_name
            : "",
          detailedTable: {
            identifiedProblem1: {
              identifiedProblem: comprehensiveCarePlan.nutritional_health
                ?.detailed_table?.identified_problem_1?.identified_problem
                ? comprehensiveCarePlan.nutritional_health?.detailed_table
                    ?.identified_problem_1?.identified_problem
                : "",
              goal: comprehensiveCarePlan.nutritional_health?.detailed_table
                ?.identified_problem_1?.goal
                ? comprehensiveCarePlan.nutritional_health?.detailed_table
                    ?.identified_problem_1?.goal
                : "",
              referralOptions: comprehensiveCarePlan.nutritional_health
                ?.detailed_table?.identified_problem_1?.referral_options
                ? comprehensiveCarePlan.nutritional_health?.detailed_table
                    ?.identified_problem_1?.referral_options
                : "",
              interventionAction: comprehensiveCarePlan.nutritional_health
                ?.detailed_table?.identified_problem_1?.intervention_action
                ? comprehensiveCarePlan.nutritional_health?.detailed_table
                    ?.identified_problem_1?.intervention_action
                : "",
            },
            identifiedProblem2: {
              identifiedProblem: comprehensiveCarePlan.nutritional_health
                ?.detailed_table?.identified_problem_2?.identified_problem
                ? comprehensiveCarePlan.nutritional_health?.detailed_table
                    ?.identified_problem_2?.identified_problem
                : "",
              goal: comprehensiveCarePlan.nutritional_health?.detailed_table
                ?.identified_problem_2?.goal
                ? comprehensiveCarePlan.nutritional_health?.detailed_table
                    ?.identified_problem_2?.goal
                : "",
              referralOptions: comprehensiveCarePlan.nutritional_health
                ?.detailed_table?.identified_problem_2?.referral_options
                ? comprehensiveCarePlan.nutritional_health?.detailed_table
                    ?.identified_problem_2?.referral_options
                : "",
              interventionAction: comprehensiveCarePlan.nutritional_health
                ?.detailed_table?.identified_problem_2?.intervention_action
                ? comprehensiveCarePlan.nutritional_health?.detailed_table
                    ?.identified_problem_2?.intervention_action
                : "",
            },
            identifiedProblem3: {
              identifiedProblem: comprehensiveCarePlan.nutritional_health
                ?.detailed_table?.identified_problem_3?.identified_problem
                ? comprehensiveCarePlan.nutritional_health?.detailed_table
                    ?.identified_problem_3?.identified_problem
                : "",
              goal: comprehensiveCarePlan.nutritional_health?.detailed_table
                ?.identified_problem_3?.goal
                ? comprehensiveCarePlan.nutritional_health?.detailed_table
                    ?.identified_problem_3?.goal
                : "",
              referralOptions: comprehensiveCarePlan.nutritional_health
                ?.detailed_table?.identified_problem_3?.referral_options
                ? comprehensiveCarePlan.nutritional_health?.detailed_table
                    ?.identified_problem_3?.referral_options
                : "",
              interventionAction: comprehensiveCarePlan.nutritional_health
                ?.detailed_table?.identified_problem_3?.intervention_action
                ? comprehensiveCarePlan.nutritional_health?.detailed_table
                    ?.identified_problem_3?.intervention_action
                : "",
            },
            identifiedProblem4: {
              identifiedProblem: comprehensiveCarePlan.nutritional_health
                ?.detailed_table?.identified_problem_4?.identified_problem
                ? comprehensiveCarePlan.nutritional_health?.detailed_table
                    ?.identified_problem_4?.identified_problem
                : "",
              goal: comprehensiveCarePlan.nutritional_health?.detailed_table
                ?.identified_problem_4?.goal
                ? comprehensiveCarePlan.nutritional_health?.detailed_table
                    ?.identified_problem_4?.goal
                : "",
              referralOptions: comprehensiveCarePlan.nutritional_health
                ?.detailed_table?.identified_problem_4?.referral_options
                ? comprehensiveCarePlan.nutritional_health?.detailed_table
                    ?.identified_problem_4?.referral_options
                : "",
              interventionAction: comprehensiveCarePlan.nutritional_health
                ?.detailed_table?.identified_problem_4?.intervention_action
                ? comprehensiveCarePlan.nutritional_health?.detailed_table
                    ?.identified_problem_4?.intervention_action
                : "",
            },
            identifiedProblem5: {
              identifiedProblem: comprehensiveCarePlan.nutritional_health
                ?.detailed_table?.identified_problem_5?.identified_problem
                ? comprehensiveCarePlan.nutritional_health?.detailed_table
                    ?.identified_problem_5?.identified_problem
                : "",
              goal: comprehensiveCarePlan.nutritional_health?.detailed_table
                ?.identified_problem_5?.goal
                ? comprehensiveCarePlan.nutritional_health?.detailed_table
                    ?.identified_problem_5?.goal
                : "",
              referralOptions: comprehensiveCarePlan.nutritional_health
                ?.detailed_table?.identified_problem_5?.referral_options
                ? comprehensiveCarePlan.nutritional_health?.detailed_table
                    ?.identified_problem_5?.referral_options
                : "",
              interventionAction: comprehensiveCarePlan.nutritional_health
                ?.detailed_table?.identified_problem_5?.intervention_action
                ? comprehensiveCarePlan.nutritional_health?.detailed_table
                    ?.identified_problem_5?.intervention_action
                : "",
            },
          },
        },
        legalAndFinancial: {
          summary: comprehensiveCarePlan.legal_and_financial?.summary
            ? comprehensiveCarePlan.legal_and_financial?.summary
            : "",
          categoryName: comprehensiveCarePlan.legal_and_financial?.category_name
            ? comprehensiveCarePlan.legal_and_financial?.category_name
            : "",
          deficitsNoted: comprehensiveCarePlan.legal_and_financial
            ?.deficits_noted
            ? comprehensiveCarePlan.legal_and_financial?.deficits_noted
              ? "true"
              : "false"
            : "false",
          detailedTable: {
            identifiedProblem1: {
              identifiedProblem: comprehensiveCarePlan.legal_and_financial
                ?.detailed_table?.identified_problem_1?.identified_problem
                ? comprehensiveCarePlan.legal_and_financial?.detailed_table
                    ?.identified_problem_1?.identified_problem
                : "",
              goal: comprehensiveCarePlan.legal_and_financial?.detailed_table
                ?.identified_problem_1?.goal
                ? comprehensiveCarePlan.legal_and_financial?.detailed_table
                    ?.identified_problem_1?.goal
                : "",
              referralOptions: comprehensiveCarePlan.legal_and_financial
                ?.detailed_table?.identified_problem_1?.referral_options
                ? comprehensiveCarePlan.legal_and_financial?.detailed_table
                    ?.identified_problem_1?.referral_options
                : "",
              interventionAction: comprehensiveCarePlan.legal_and_financial
                ?.detailed_table?.identified_problem_1?.intervention_action
                ? comprehensiveCarePlan.legal_and_financial?.detailed_table
                    ?.identified_problem_1?.intervention_action
                : "",
            },
            identifiedProblem2: {
              identifiedProblem: comprehensiveCarePlan.legal_and_financial
                ?.detailed_table?.identified_problem_2?.identified_problem
                ? comprehensiveCarePlan.legal_and_financial?.detailed_table
                    ?.identified_problem_2?.identified_problem
                : "",
              goal: comprehensiveCarePlan.legal_and_financial?.detailed_table
                ?.identified_problem_2?.goal
                ? comprehensiveCarePlan.legal_and_financial?.detailed_table
                    ?.identified_problem_2?.goal
                : "",
              referralOptions: comprehensiveCarePlan.legal_and_financial
                ?.detailed_table?.identified_problem_2?.referral_options
                ? comprehensiveCarePlan.legal_and_financial?.detailed_table
                    ?.identified_problem_2?.referral_options
                : "",
              interventionAction: comprehensiveCarePlan.legal_and_financial
                ?.detailed_table?.identified_problem_2?.intervention_action
                ? comprehensiveCarePlan.legal_and_financial?.detailed_table
                    ?.identified_problem_2?.intervention_action
                : "",
            },
            identifiedProblem3: {
              identifiedProblem: comprehensiveCarePlan.legal_and_financial
                ?.detailed_table?.identified_problem_3?.identified_problem
                ? comprehensiveCarePlan.legal_and_financial?.detailed_table
                    ?.identified_problem_3?.identified_problem
                : "",
              goal: comprehensiveCarePlan.legal_and_financial?.detailed_table
                ?.identified_problem_3?.goal
                ? comprehensiveCarePlan.legal_and_financial?.detailed_table
                    ?.identified_problem_3?.goal
                : "",
              referralOptions: comprehensiveCarePlan.legal_and_financial
                ?.detailed_table?.identified_problem_3?.referral_options
                ? comprehensiveCarePlan.legal_and_financial?.detailed_table
                    ?.identified_problem_3?.referral_options
                : "",
              interventionAction: comprehensiveCarePlan.legal_and_financial
                ?.detailed_table?.identified_problem_3?.intervention_action
                ? comprehensiveCarePlan.legal_and_financial?.detailed_table
                    ?.identified_problem_3?.intervention_action
                : "",
            },
            identifiedProblem4: {
              identifiedProblem: comprehensiveCarePlan.legal_and_financial
                ?.detailed_table?.identified_problem_4?.identified_problem
                ? comprehensiveCarePlan.legal_and_financial?.detailed_table
                    ?.identified_problem_4?.identified_problem
                : "",
              goal: comprehensiveCarePlan.legal_and_financial?.detailed_table
                ?.identified_problem_4?.goal
                ? comprehensiveCarePlan.legal_and_financial?.detailed_table
                    ?.identified_problem_4?.goal
                : "",
              referralOptions: comprehensiveCarePlan.legal_and_financial
                ?.detailed_table?.identified_problem_4?.referral_options
                ? comprehensiveCarePlan.legal_and_financial?.detailed_table
                    ?.identified_problem_4?.referral_options
                : "",
              interventionAction: comprehensiveCarePlan.legal_and_financial
                ?.detailed_table?.identified_problem_4?.intervention_action
                ? comprehensiveCarePlan.legal_and_financial?.detailed_table
                    ?.identified_problem_4?.intervention_action
                : "",
            },
            identifiedProblem5: {
              identifiedProblem: comprehensiveCarePlan.legal_and_financial
                ?.detailed_table?.identified_problem_5?.identified_problem
                ? comprehensiveCarePlan.legal_and_financial?.detailed_table
                    ?.identified_problem_5?.identified_problem
                : "",
              goal: comprehensiveCarePlan.legal_and_financial?.detailed_table
                ?.identified_problem_5?.goal
                ? comprehensiveCarePlan.legal_and_financial?.detailed_table
                    ?.identified_problem_5?.goal
                : "",
              referralOptions: comprehensiveCarePlan.legal_and_financial
                ?.detailed_table?.identified_problem_5?.referral_options
                ? comprehensiveCarePlan.legal_and_financial?.detailed_table
                    ?.identified_problem_5?.referral_options
                : "",
              interventionAction: comprehensiveCarePlan.legal_and_financial
                ?.detailed_table?.identified_problem_5?.intervention_action
                ? comprehensiveCarePlan.legal_and_financial?.detailed_table
                    ?.identified_problem_5?.intervention_action
                : "",
            },
            identifiedProblem6: {
              identifiedProblem: comprehensiveCarePlan.legal_and_financial
                ?.detailed_table?.identified_problem_6?.identified_problem
                ? comprehensiveCarePlan.legal_and_financial?.detailed_table
                    ?.identified_problem_6?.identified_problem
                : "",
              goal: comprehensiveCarePlan.legal_and_financial?.detailed_table
                ?.identified_problem_6?.goal
                ? comprehensiveCarePlan.legal_and_financial?.detailed_table
                    ?.identified_problem_6?.goal
                : "",
              referralOptions: comprehensiveCarePlan.legal_and_financial
                ?.detailed_table?.identified_problem_6?.referral_options
                ? comprehensiveCarePlan.legal_and_financial?.detailed_table
                    ?.identified_problem_6?.referral_options
                : "",
              interventionAction: comprehensiveCarePlan.legal_and_financial
                ?.detailed_table?.identified_problem_6?.intervention_action
                ? comprehensiveCarePlan.legal_and_financial?.detailed_table
                    ?.identified_problem_6?.intervention_action
                : "",
            },
            identifiedProblem7: {
              identifiedProblem: comprehensiveCarePlan.legal_and_financial
                ?.detailed_table?.identified_problem_7?.identified_problem
                ? comprehensiveCarePlan.legal_and_financial?.detailed_table
                    ?.identified_problem_7?.identified_problem
                : "",
              goal: comprehensiveCarePlan.legal_and_financial?.detailed_table
                ?.identified_problem_7?.goal
                ? comprehensiveCarePlan.legal_and_financial?.detailed_table
                    ?.identified_problem_7?.goal
                : "",
              referralOptions: comprehensiveCarePlan.legal_and_financial
                ?.detailed_table?.identified_problem_7?.referral_options
                ? comprehensiveCarePlan.legal_and_financial?.detailed_table
                    ?.identified_problem_7?.referral_options
                : "",
              interventionAction: comprehensiveCarePlan.legal_and_financial
                ?.detailed_table?.identified_problem_7?.intervention_action
                ? comprehensiveCarePlan.legal_and_financial?.detailed_table
                    ?.identified_problem_7?.intervention_action
                : "",
            },
            identifiedProblem8: {
              identifiedProblem: comprehensiveCarePlan.legal_and_financial
                ?.detailed_table?.identified_problem_8?.identified_problem
                ? comprehensiveCarePlan.legal_and_financial?.detailed_table
                    ?.identified_problem_8?.identified_problem
                : "",
              goal: comprehensiveCarePlan.legal_and_financial?.detailed_table
                ?.identified_problem_8?.goal
                ? comprehensiveCarePlan.legal_and_financial?.detailed_table
                    ?.identified_problem_8?.goal
                : "",
              referralOptions: comprehensiveCarePlan.legal_and_financial
                ?.detailed_table?.identified_problem_8?.referral_options
                ? comprehensiveCarePlan.legal_and_financial?.detailed_table
                    ?.identified_problem_8?.referral_options
                : "",
              interventionAction: comprehensiveCarePlan.legal_and_financial
                ?.detailed_table?.identified_problem_8?.intervention_action
                ? comprehensiveCarePlan.legal_and_financial?.detailed_table
                    ?.identified_problem_8?.intervention_action
                : "",
            },
            identifiedProblem9: {
              identifiedProblem: comprehensiveCarePlan.legal_and_financial
                ?.detailed_table?.identified_problem_9?.identified_problem
                ? comprehensiveCarePlan.legal_and_financial?.detailed_table
                    ?.identified_problem_9?.identified_problem
                : "",
              goal: comprehensiveCarePlan.legal_and_financial?.detailed_table
                ?.identified_problem_9?.goal
                ? comprehensiveCarePlan.legal_and_financial?.detailed_table
                    ?.identified_problem_9?.goal
                : "",
              referralOptions: comprehensiveCarePlan.legal_and_financial
                ?.detailed_table?.identified_problem_9?.referral_options
                ? comprehensiveCarePlan.legal_and_financial?.detailed_table
                    ?.identified_problem_9?.referral_options
                : "",
              interventionAction: comprehensiveCarePlan.legal_and_financial
                ?.detailed_table?.identified_problem_9?.intervention_action
                ? comprehensiveCarePlan.legal_and_financial?.detailed_table
                    ?.identified_problem_9?.intervention_action
                : "",
            },
            identifiedProblem10: {
              identifiedProblem: comprehensiveCarePlan.legal_and_financial
                ?.detailed_table?.identified_problem_10?.identified_problem
                ? comprehensiveCarePlan.legal_and_financial?.detailed_table
                    ?.identified_problem_10?.identified_problem
                : "",
              goal: comprehensiveCarePlan.legal_and_financial?.detailed_table
                ?.identified_problem_10?.goal
                ? comprehensiveCarePlan.legal_and_financial?.detailed_table
                    ?.identified_problem_10?.goal
                : "",
              referralOptions: comprehensiveCarePlan.legal_and_financial
                ?.detailed_table?.identified_problem_10?.referral_options
                ? comprehensiveCarePlan.legal_and_financial?.detailed_table
                    ?.identified_problem_10?.referral_options
                : "",
              interventionAction: comprehensiveCarePlan.legal_and_financial
                ?.detailed_table?.identified_problem_10?.intervention_action
                ? comprehensiveCarePlan.legal_and_financial?.detailed_table
                    ?.identified_problem_10?.intervention_action
                : "",
            },
          },
        },
        careGiverSupport: {
          summary: comprehensiveCarePlan.care_giver_support?.summary
            ? comprehensiveCarePlan.care_giver_support?.summary
            : "",
          categoryName: comprehensiveCarePlan.care_giver_support?.category_name
            ? comprehensiveCarePlan.care_giver_support?.category_name
            : "",
          deficitsNoted: comprehensiveCarePlan.care_giver_support
            ?.deficits_noted
            ? comprehensiveCarePlan.care_giver_support?.deficits_noted
              ? "true"
              : "false"
            : "false",
          detailedTable: {
            identifiedProblem1: {
              identifiedProblem: comprehensiveCarePlan.care_giver_support
                ?.detailed_table?.identified_problem_1?.identified_problem
                ? comprehensiveCarePlan.care_giver_support?.detailed_table
                    ?.identified_problem_1?.identified_problem
                : "",
              goal: comprehensiveCarePlan.care_giver_support?.detailed_table
                ?.identified_problem_1?.goal
                ? comprehensiveCarePlan.care_giver_support?.detailed_table
                    ?.identified_problem_1?.goal
                : "",
              referralOptions: comprehensiveCarePlan.care_giver_support
                ?.detailed_table?.identified_problem_1?.referral_options
                ? comprehensiveCarePlan.care_giver_support?.detailed_table
                    ?.identified_problem_1?.referral_options
                : "",
              interventionAction: comprehensiveCarePlan.care_giver_support
                ?.detailed_table?.identified_problem_1?.intervention_action
                ? comprehensiveCarePlan.care_giver_support?.detailed_table
                    ?.identified_problem_1?.intervention_action
                : "",
            },
            identifiedProblem2: {
              identifiedProblem: comprehensiveCarePlan.care_giver_support
                ?.detailed_table?.identified_problem_2?.identified_problem
                ? comprehensiveCarePlan.care_giver_support?.detailed_table
                    ?.identified_problem_2?.identified_problem
                : "",
              goal: comprehensiveCarePlan.care_giver_support?.detailed_table
                ?.identified_problem_2?.goal
                ? comprehensiveCarePlan.care_giver_support?.detailed_table
                    ?.identified_problem_2?.goal
                : "",
              referralOptions: comprehensiveCarePlan.care_giver_support
                ?.detailed_table?.identified_problem_2?.referral_options
                ? comprehensiveCarePlan.care_giver_support?.detailed_table
                    ?.identified_problem_2?.referral_options
                : "",
              interventionAction: comprehensiveCarePlan.care_giver_support
                ?.detailed_table?.identified_problem_2?.intervention_action
                ? comprehensiveCarePlan.care_giver_support?.detailed_table
                    ?.identified_problem_2?.intervention_action
                : "",
            },
            identifiedProblem3: {
              identifiedProblem: comprehensiveCarePlan.care_giver_support
                ?.detailed_table?.identified_problem_3?.identified_problem
                ? comprehensiveCarePlan.care_giver_support?.detailed_table
                    ?.identified_problem_3?.identified_problem
                : "",
              goal: comprehensiveCarePlan.care_giver_support?.detailed_table
                ?.identified_problem_3?.goal
                ? comprehensiveCarePlan.care_giver_support?.detailed_table
                    ?.identified_problem_3?.goal
                : "",
              referralOptions: comprehensiveCarePlan.care_giver_support
                ?.detailed_table?.identified_problem_3?.referral_options
                ? comprehensiveCarePlan.care_giver_support?.detailed_table
                    ?.identified_problem_3?.referral_options
                : "",
              interventionAction: comprehensiveCarePlan.care_giver_support
                ?.detailed_table?.identified_problem_3?.intervention_action
                ? comprehensiveCarePlan.care_giver_support?.detailed_table
                    ?.identified_problem_3?.intervention_action
                : "",
            },
            identifiedProblem4: {
              identifiedProblem: comprehensiveCarePlan.care_giver_support
                ?.detailed_table?.identified_problem_4?.identified_problem
                ? comprehensiveCarePlan.care_giver_support?.detailed_table
                    ?.identified_problem_4?.identified_problem
                : "",
              goal: comprehensiveCarePlan.care_giver_support?.detailed_table
                ?.identified_problem_4?.goal
                ? comprehensiveCarePlan.care_giver_support?.detailed_table
                    ?.identified_problem_4?.goal
                : "",
              referralOptions: comprehensiveCarePlan.care_giver_support
                ?.detailed_table?.identified_problem_4?.referral_options
                ? comprehensiveCarePlan.care_giver_support?.detailed_table
                    ?.identified_problem_4?.referral_options
                : "",
              interventionAction: comprehensiveCarePlan.care_giver_support
                ?.detailed_table?.identified_problem_4?.intervention_action
                ? comprehensiveCarePlan.care_giver_support?.detailed_table
                    ?.identified_problem_4?.intervention_action
                : "",
            },
          },
        },
        dateOfAssessment: comprehensiveCarePlan?.initial_assessment
          ?.date_of_assessment
          ? DateUtils.formatDateToRequiredFormat(
              comprehensiveCarePlan.initial_assessment.date_of_assessment
            )
          : "",
        dateOfCarePlan: comprehensiveCarePlan?.initial_assessment
          ?.date_of_care_plan
          ? DateUtils.formatDateToRequiredFormat(
              comprehensiveCarePlan.initial_assessment.date_of_care_plan
            )
          : "",
        personCompletingAssessment: comprehensiveCarePlan?.initial_assessment
          ?.person_completing_assessment
          ? comprehensiveCarePlan?.initial_assessment
              ?.person_completing_assessment
          : "",
        presentForAssessment: comprehensiveCarePlan?.initial_assessment
          ?.present_for_assessment
          ? comprehensiveCarePlan?.initial_assessment?.present_for_assessment
          : "",
        goalsForAssessment: comprehensiveCarePlan?.initial_assessment
          ?.goals_for_assessment
          ? comprehensiveCarePlan?.initial_assessment?.goals_for_assessment.split(
              ", "
            )
          : [],
        nextStepCareRecipient: comprehensiveCarePlan?.initial_assessment
          ?.next_step_care_recipient
          ? comprehensiveCarePlan?.initial_assessment?.next_step_care_recipient.split(
              ", "
            )
          : [],
        nextStepCarePartner: comprehensiveCarePlan?.initial_assessment
          ?.next_step_care_partner
          ? comprehensiveCarePlan?.initial_assessment?.next_step_care_partner.split(
              ", "
            )
          : [],
        medications: comprehensiveCarePlan?.medications?.map(
          (medication: ClientMedications) => {
            return {
              medicationName: medication.medication_name,
              id: medication.id,
              dosage: medication.dosage || "",
              frequency: medication.frequency || "",
              indication: medication.indication ? medication.indication : "",
              startDate: medication.start_date
                ? DateUtils.formatDateToRequiredFormat(medication.start_date)
                : "",
              endDate: medication.end_date
                ? DateUtils.formatDateToRequiredFormat(medication.end_date)
                : "",
            };
          }
        ),
        healthcareProviders: comprehensiveCarePlan?.healthcare_providers?.map(
          (provider: HealthcareProvider) => {
            return {
              providerType: provider.provider_type || "",
              providerName: provider.provider_name || "",
              specialty: provider.specialty || "",
              address: provider.address || "",
              phone: provider.phone || "",
              id: provider.id,
            };
          }
        ),
        allergies:
          comprehensiveCarePlan?.medical_info?.allergies &&
          comprehensiveCarePlan?.medical_info?.allergies.length > 0
            ? comprehensiveCarePlan?.medical_info?.allergies
                ?.split(", ")
                ?.map((item: string) => ({
                  allergen: item,
                }))
            : [],
      });
      setOpenedFileData({
        ...getValues(),
        last_update: {
          updatedAt: comprehensiveCarePlan?.last_update?.updatedAt,
        },
      } as unknown as OpenedFileData);
    }
  }, [comprehensiveCarePlan]);

  const onSubmit = (data: ComprehensiveCarePlanFormData) => {
    console.log(data);
    const medications = data.medications?.map((medication) => {
      const med = {
        medication_name: medication.medicationName
          ? medication.medicationName
          : null,
        dosage: medication.dosage,
        frequency: medication.frequency ? medication.frequency : null,
        start_date: medication.startDate
          ? DateUtils.changetoISO(medication.startDate)
          : null,
        end_date: medication.endDate
          ? DateUtils.changetoISO(medication.endDate)
          : null,
        indication: medication.indication ? medication.indication : null,
        id: medication.id ? medication.id : null,
      };
      if (med.id) {
        return med;
      } else {
        // @ts-expect-error - TODO: fix this
        delete med.id;
        return med;
      }
    });

    const healthCareProviders = data.healthcareProviders?.map((provider) => {
      const providerData = {
        provider_type: provider.providerType ? provider.providerType : null,
        provider_name: provider.providerName ? provider.providerName : null,
        specialty: provider.specialty ? provider.specialty : null,
        address: provider.address ? provider.address : null,
        phone: provider.phone ? provider.phone : null,
        id: provider.id ? provider.id : null,
      };
      if (providerData.id) {
        return providerData;
      } else {
        // @ts-expect-error - TODO: fix this
        delete providerData.id;
        return providerData;
      }
    });

    const focusedRecommendations = data.focusedRecommendations?.map(
      (item, index) => {
        const focused = {
          option_number: index + 1 || null,
          name: item.name ? item.name : null,
          description: item.description ? item.description : null,
          details: item.details
            ? item.details.length > 0
              ? item.details.join(", ")
              : null
            : null,
          id: item.id ? item.id : null,
        };
        if (focused.id) {
          return focused;
        } else {
          // @ts-expect-error - TODO: fix this
          delete focused.id;
          return focused;
        }
      }
    );

    const postData = {
      client_info: {
        first_name: data.firstName,
        last_name: data.lastName,
        date_of_birth: data.dateOfBirth
          ? DateUtils.changetoISO(data.dateOfBirth)
          : null,
        preferred_hospital: data.preferredHospital
          ? data.preferredHospital
          : null,
        pharmacy_name: data.pharmacyName ? data.pharmacyName : null,
      },
      medications: medications,
      medical_info: {
        allergies:
          data.allergies?.length && data.allergies.length > 0
            ? data.allergies.map((allergy) => allergy.allergen).join(", ")
            : null,
      },
      healthcare_providers: healthCareProviders,
      initial_assessment: {
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
            ? data.goalsForAssessment.join(", ")
            : null
          : null,
        next_step_care_recipient: data.nextStepCareRecipient
          ? data.nextStepCareRecipient.length > 0
            ? data.nextStepCareRecipient.join(", ")
            : null
          : null,
        next_step_care_partner: data.nextStepCarePartner
          ? data.nextStepCarePartner.length > 0
            ? data.nextStepCarePartner.join(", ")
            : null
          : null,
      },
      focused_recommendations: focusedRecommendations,
      functional_adls: {
        summary: data.functionalAdls?.summary
          ? data.functionalAdls?.summary
          : null,
        deficits_noted: data.functionalAdls?.deficitsNoted
          ? data.functionalAdls?.deficitsNoted === "true"
            ? true
            : false
          : false,
        category_name: data.functionalAdls?.categoryName
          ? data.functionalAdls?.categoryName
          : "functional_adls",
        detailed_table: {
          katz_index: {
            description: data.functionalAdls?.detailedTable?.katzIndex
              ?.description
              ? data.functionalAdls?.detailedTable?.katzIndex?.description
              : null,
            score: data.functionalAdls?.detailedTable?.katzIndex?.score
              ? Number(data.functionalAdls?.detailedTable?.katzIndex?.score)
              : null,
          },
          bathing: {
            description: data.functionalAdls?.detailedTable?.bathing
              ?.description
              ? data.functionalAdls?.detailedTable?.bathing?.description
              : null,
            score: data.functionalAdls?.detailedTable?.bathing?.score
              ? Number(data.functionalAdls?.detailedTable?.bathing?.score)
              : null,
          },
          dressing: {
            description: data.functionalAdls?.detailedTable?.dressing
              ?.description
              ? data.functionalAdls?.detailedTable?.dressing?.description
              : null,
            score: data.functionalAdls?.detailedTable?.dressing?.score
              ? Number(data.functionalAdls?.detailedTable?.dressing?.score)
              : null,
          },
          toileting: {
            description: data.functionalAdls?.detailedTable?.toileting
              ?.description
              ? data.functionalAdls?.detailedTable?.toileting?.description
              : null,
            score: data.functionalAdls?.detailedTable?.toileting?.score
              ? Number(data.functionalAdls?.detailedTable?.toileting?.score)
              : null,
          },
          transfers: {
            description: data.functionalAdls?.detailedTable?.transfers
              ?.description
              ? data.functionalAdls?.detailedTable?.transfers?.description
              : null,
            score: data.functionalAdls?.detailedTable?.transfers?.score
              ? Number(data.functionalAdls?.detailedTable?.transfers?.score)
              : null,
          },
          continence: {
            description: data.functionalAdls?.detailedTable?.continence
              ?.description
              ? data.functionalAdls?.detailedTable?.continence?.description
              : null,
            score: data.functionalAdls?.detailedTable?.continence?.score
              ? Number(data.functionalAdls?.detailedTable?.continence?.score)
              : null,
          },
          feeding: {
            description: data.functionalAdls?.detailedTable?.feeding
              ?.description
              ? data.functionalAdls?.detailedTable?.feeding?.description
              : null,
            score: data.functionalAdls?.detailedTable?.feeding?.score
              ? Number(data.functionalAdls?.detailedTable?.feeding?.score)
              : null,
          },
        },
      },
      functional_iadls: {
        summary: data.functionalIadls?.summary
          ? data.functionalIadls?.summary
          : null,
        category_name: data.functionalIadls?.categoryName
          ? data.functionalIadls?.categoryName
          : "functional_iadls",
        detailed_table: {
          telephone: {
            description: data.functionalIadls?.detailedTable?.telephone
              ?.description
              ? data.functionalIadls?.detailedTable?.telephone?.description
              : null,
            score: data.functionalIadls?.detailedTable?.telephone?.score
              ? Number(data.functionalIadls?.detailedTable?.telephone?.score)
              : null,
          },
          shopping: {
            description: data.functionalIadls?.detailedTable?.shopping
              ?.description
              ? data.functionalIadls?.detailedTable?.shopping?.description
              : null,
            score: data.functionalIadls?.detailedTable?.shopping?.score
              ? Number(data.functionalIadls?.detailedTable?.shopping?.score)
              : null,
          },
          foodPreparation: {
            description: data.functionalIadls?.detailedTable?.foodPreparation
              ?.description
              ? data.functionalIadls?.detailedTable?.foodPreparation
                  ?.description
              : null,
            score: data.functionalIadls?.detailedTable?.foodPreparation?.score
              ? Number(
                  data.functionalIadls?.detailedTable?.foodPreparation?.score
                )
              : null,
          },
          housekeeping: {
            description: data.functionalIadls?.detailedTable?.housekeeping
              ?.description
              ? data.functionalIadls?.detailedTable?.housekeeping?.description
              : null,
            score: data.functionalIadls?.detailedTable?.housekeeping?.score
              ? Number(data.functionalIadls?.detailedTable?.housekeeping?.score)
              : null,
          },
          laundry: {
            description: data.functionalIadls?.detailedTable?.laundry
              ?.description
              ? data.functionalIadls?.detailedTable?.laundry?.description
              : null,
            score: data.functionalIadls?.detailedTable?.laundry?.score
              ? Number(data.functionalIadls?.detailedTable?.laundry?.score)
              : null,
          },
          transportation: {
            description: data.functionalIadls?.detailedTable?.transportation
              ?.description
              ? data.functionalIadls?.detailedTable?.transportation?.description
              : null,
            score: data.functionalIadls?.detailedTable?.transportation?.score
              ? Number(
                  data.functionalIadls?.detailedTable?.transportation?.score
                )
              : null,
          },
          medication: {
            description: data.functionalIadls?.detailedTable?.medication
              ?.description
              ? data.functionalIadls?.detailedTable?.medication?.description
              : null,
            score: data.functionalIadls?.detailedTable?.medication?.score
              ? Number(data.functionalIadls?.detailedTable?.medication?.score)
              : null,
          },
          finances: {
            description: data.functionalIadls?.detailedTable?.finances
              ?.description
              ? data.functionalIadls?.detailedTable?.finances?.description
              : null,
            score: data.functionalIadls?.detailedTable?.finances?.score
              ? Number(data.functionalIadls?.detailedTable?.finances?.score)
              : null,
          },
        },
        additional_data: {
          identified_problem_1: {
            identified_problem: data.functionalIadls?.additionalData
              ?.identifiedProblem1?.identifiedProblem
              ? data.functionalIadls?.additionalData?.identifiedProblem1
                  .identifiedProblem
              : null,
            intervention_action: data.functionalIadls?.additionalData
              ?.identifiedProblem1?.interventionAction
              ? data.functionalIadls?.additionalData?.identifiedProblem1
                  .interventionAction
              : null,
            goal: data.functionalIadls?.additionalData?.identifiedProblem1?.goal
              ? data.functionalIadls?.additionalData?.identifiedProblem1.goal
              : null,
            referral_options: data.functionalIadls?.additionalData
              ?.identifiedProblem1?.referralOptions
              ? data.functionalIadls?.additionalData?.identifiedProblem1
                  .referralOptions
              : null,
          },
          identified_problem_2: {
            identified_problem: data.functionalIadls?.additionalData
              ?.identifiedProblem2?.identifiedProblem
              ? data.functionalIadls?.additionalData?.identifiedProblem2
                  .identifiedProblem
              : null,
            intervention_action: data.functionalIadls?.additionalData
              ?.identifiedProblem2?.interventionAction
              ? data.functionalIadls?.additionalData?.identifiedProblem2
                  .interventionAction
              : null,
            goal: data.functionalIadls?.additionalData?.identifiedProblem2?.goal
              ? data.functionalIadls?.additionalData?.identifiedProblem2.goal
              : null,
            referral_options: data.functionalIadls?.additionalData
              ?.identifiedProblem2?.referralOptions
              ? data.functionalIadls?.additionalData?.identifiedProblem2
                  .referralOptions
              : null,
          },
          identified_problem_3: {
            identified_problem: data.functionalIadls?.additionalData
              ?.identifiedProblem3?.identifiedProblem
              ? data.functionalIadls?.additionalData?.identifiedProblem3
                  .identifiedProblem
              : null,
            intervention_action: data.functionalIadls?.additionalData
              ?.identifiedProblem3?.interventionAction
              ? data.functionalIadls?.additionalData?.identifiedProblem3
                  .interventionAction
              : null,
            goal: data.functionalIadls?.additionalData?.identifiedProblem3?.goal
              ? data.functionalIadls?.additionalData?.identifiedProblem3.goal
              : null,
            referral_options: data.functionalIadls?.additionalData
              ?.identifiedProblem3?.referralOptions
              ? data.functionalIadls?.additionalData?.identifiedProblem3
                  .referralOptions
              : null,
          },
          identified_problem_4: {
            identified_problem: data.functionalIadls?.additionalData
              ?.identifiedProblem4?.identifiedProblem
              ? data.functionalIadls?.additionalData?.identifiedProblem4
                  .identifiedProblem
              : null,
            intervention_action: data.functionalIadls?.additionalData
              ?.identifiedProblem4?.interventionAction
              ? data.functionalIadls?.additionalData?.identifiedProblem4
                  .interventionAction
              : null,
            goal: data.functionalIadls?.additionalData?.identifiedProblem4?.goal
              ? data.functionalIadls?.additionalData?.identifiedProblem4.goal
              : null,
            referral_options: data.functionalIadls?.additionalData
              ?.identifiedProblem4?.referralOptions
              ? data.functionalIadls?.additionalData?.identifiedProblem4
                  .referralOptions
              : null,
          },
        },
      },
      home_safety: {
        summary: data.homeSafety?.summary ? data.homeSafety?.summary : null,
        deficits_noted: data.homeSafety?.deficitsNoted
          ? data.homeSafety?.deficitsNoted === "true"
            ? true
            : false
          : false,
        category_name: data.homeSafety?.categoryName
          ? data.homeSafety?.categoryName
          : "home_safety",
        detailed_table: {
          are_pathways_clear: data.homeSafety?.detailedTable?.arePathwaysClear
            ? data.homeSafety?.detailedTable?.arePathwaysClear
            : null,
          are_there_throw_rugs: data.homeSafety?.detailedTable
            ?.areThereThrowRugs
            ? data.homeSafety?.detailedTable?.areThereThrowRugs
            : null,
          are_stairs_safe: data.homeSafety?.detailedTable?.areStairsSafe
            ? data.homeSafety?.detailedTable?.areStairsSafe
            : null,
          is_there_clutter_or_hoarding: data.homeSafety?.detailedTable
            ?.isThereClutterOrHoarding
            ? data.homeSafety?.detailedTable?.isThereClutterOrHoarding
            : null,
          are_floors_slippery: data.homeSafety?.detailedTable?.areFloorsSlippery
            ? data.homeSafety?.detailedTable?.areFloorsSlippery
            : null,
          condition_of_floor_surfaces: data.homeSafety?.detailedTable
            ?.conditionOfFloorSurfaces
            ? data.homeSafety?.detailedTable?.conditionOfFloorSurfaces
            : null,
          condition_of_carpeting: data.homeSafety?.detailedTable
            ?.conditionOfCarpeting
            ? data.homeSafety?.detailedTable?.conditionOfCarpeting
            : null,
          are_chairs_sturdy_and_stable: data.homeSafety?.detailedTable
            ?.areChairsSturdyAndStable
            ? data.homeSafety?.detailedTable?.areChairsSturdyAndStable
            : null,
          electricity_fully_functional: data.homeSafety?.detailedTable
            ?.electricityFullyFunctional
            ? data.homeSafety?.detailedTable?.electricityFullyFunctional
            : null,
          adequate_lighting: data.homeSafety?.detailedTable?.adequateLighting
            ? data.homeSafety?.detailedTable?.adequateLighting
            : null,
          exposed_wires_or_cords: data.homeSafety?.detailedTable
            ?.exposedWiresOrCords
            ? data.homeSafety?.detailedTable?.exposedWiresOrCords
            : null,
          condition_of_wires_and_plugs: data.homeSafety?.detailedTable
            ?.conditionOfWiresAndPlugs
            ? data.homeSafety?.detailedTable?.conditionOfWiresAndPlugs
            : null,
          are_there_space_heaters: data.homeSafety?.detailedTable
            ?.areThereSpaceHeaters
            ? data.homeSafety?.detailedTable?.areThereSpaceHeaters
            : null,
          care_recipient_smokes: data.homeSafety?.detailedTable
            ?.careRecipientSmokes
            ? data.homeSafety?.detailedTable?.careRecipientSmokes
            : null,
          fire_extinguisher_accessible: data.homeSafety?.detailedTable
            ? data.homeSafety?.detailedTable?.fireExtinguisherAccessible
            : null,
          condition_of_appliances: data.homeSafety?.detailedTable
            ?.conditionOfAppliances
            ? data.homeSafety?.detailedTable?.conditionOfAppliances
            : null,
          kitchen_safety_hazards: data.homeSafety?.detailedTable
            ?.kitchenSafetyHazards
            ? data.homeSafety?.detailedTable?.kitchenSafetyHazards
            : null,
          locks_on_doors_and_windows: data.homeSafety?.detailedTable
            ?.locksOnDoorsAndWindows
            ? data.homeSafety?.detailedTable?.locksOnDoorsAndWindows
            : null,
          emergency_numbers_posted: data.homeSafety?.detailedTable
            ?.emergencyNumbersPosted
            ? data.homeSafety?.detailedTable?.emergencyNumbersPosted
            : null,
          accessible_telephones: data.homeSafety?.detailedTable
            ? data.homeSafety?.detailedTable?.accessibleTelephones
            : null,
          weapons_or_firearms_present: data.homeSafety?.detailedTable
            ?.weaponsOrFirearmsPresent
            ? data.homeSafety?.detailedTable?.weaponsOrFirearmsPresent
            : null,
          pets_present: data.homeSafety?.detailedTable?.petsPresent
            ? data.homeSafety?.detailedTable?.petsPresent
            : null,
          condition_of_bed: data.homeSafety?.detailedTable?.conditionOfBed
            ? data.homeSafety?.detailedTable?.conditionOfBed
            : null,
          other: data.homeSafety?.detailedTable?.other
            ? data.homeSafety?.detailedTable?.other
            : null,
        },
      },
      memory_and_reasoning: {
        summary: data.memoryAndReasoning?.summary
          ? data.memoryAndReasoning?.summary
          : null,
        deficits_noted: data.memoryAndReasoning?.deficitsNoted
          ? data.memoryAndReasoning?.deficitsNoted === "true"
            ? true
            : false
          : false,
        category_name: data.memoryAndReasoning?.categoryName
          ? data.memoryAndReasoning?.categoryName
          : "memory_reasoning",
        detailed_table: {
          identified_problem_1: {
            identified_problem: data.memoryAndReasoning?.detailedTable
              ?.identifiedProblem1?.identifiedProblem
              ? data.memoryAndReasoning?.detailedTable?.identifiedProblem1
                  ?.identifiedProblem
              : null,
            intervention_action: data.memoryAndReasoning?.detailedTable
              ?.identifiedProblem1?.interventionAction
              ? data.memoryAndReasoning?.detailedTable?.identifiedProblem1
                  ?.interventionAction
              : null,
            goal: data.memoryAndReasoning?.detailedTable?.identifiedProblem1
              ?.goal
              ? data.memoryAndReasoning?.detailedTable?.identifiedProblem1?.goal
              : null,
            referral_options: data.memoryAndReasoning?.detailedTable
              ?.identifiedProblem1?.referralOptions
              ? data.memoryAndReasoning?.detailedTable?.identifiedProblem1
                  ?.referralOptions
              : null,
          },
          identified_problem_2: {
            identified_problem: data.memoryAndReasoning?.detailedTable
              ?.identifiedProblem2?.identifiedProblem
              ? data.memoryAndReasoning?.detailedTable?.identifiedProblem2
                  ?.identifiedProblem
              : null,
            intervention_action: data.memoryAndReasoning?.detailedTable
              ?.identifiedProblem2?.interventionAction
              ? data.memoryAndReasoning?.detailedTable?.identifiedProblem2
                  ?.interventionAction
              : null,
            goal: data.memoryAndReasoning?.detailedTable?.identifiedProblem2
              ?.goal
              ? data.memoryAndReasoning?.detailedTable?.identifiedProblem2?.goal
              : null,
            referral_options: data.memoryAndReasoning?.detailedTable
              ?.identifiedProblem2?.referralOptions
              ? data.memoryAndReasoning?.detailedTable?.identifiedProblem2
                  ?.referralOptions
              : null,
          },
          identified_problem_3: {
            identified_problem: data.memoryAndReasoning?.detailedTable
              ?.identifiedProblem3?.identifiedProblem
              ? data.memoryAndReasoning?.detailedTable?.identifiedProblem3
                  ?.identifiedProblem
              : null,
            intervention_action: data.memoryAndReasoning?.detailedTable
              ?.identifiedProblem3?.interventionAction
              ? data.memoryAndReasoning?.detailedTable?.identifiedProblem3
                  ?.interventionAction
              : null,
            goal: data.memoryAndReasoning?.detailedTable?.identifiedProblem3
              ?.goal
              ? data.memoryAndReasoning?.detailedTable?.identifiedProblem3?.goal
              : null,
            referral_options: data.memoryAndReasoning?.detailedTable
              ?.identifiedProblem3?.referralOptions
              ? data.memoryAndReasoning?.detailedTable?.identifiedProblem3
                  ?.referralOptions
              : null,
          },
          identified_problem_4: {
            identified_problem: data.memoryAndReasoning?.detailedTable
              ?.identifiedProblem4?.identifiedProblem
              ? data.memoryAndReasoning?.detailedTable?.identifiedProblem4
                  ?.identifiedProblem
              : null,
            intervention_action: data.memoryAndReasoning?.detailedTable
              ?.identifiedProblem4?.interventionAction
              ? data.memoryAndReasoning?.detailedTable?.identifiedProblem4
                  ?.interventionAction
              : null,
            goal: data.memoryAndReasoning?.detailedTable?.identifiedProblem4
              ?.goal
              ? data.memoryAndReasoning?.detailedTable?.identifiedProblem4?.goal
              : null,
            referral_options: data.memoryAndReasoning?.detailedTable
              ?.identifiedProblem4?.referralOptions
              ? data.memoryAndReasoning?.detailedTable?.identifiedProblem4
                  ?.referralOptions
              : null,
          },
        },
      },
      geriatric_depression: {
        summary: data.geriatricDepression?.summary
          ? data.geriatricDepression?.summary
          : null,
        deficits_noted: data.geriatricDepression?.deficitsNoted
          ? data.geriatricDepression?.deficitsNoted === "true"
            ? true
            : false
          : false,
        category_name: data.geriatricDepression?.categoryName
          ? data.geriatricDepression?.categoryName
          : "geriatric_depression",
        detailed_table: {
          identified_problem_1: {
            identified_problem: data.geriatricDepression?.detailedTable
              ?.identifiedProblem1?.identifiedProblem
              ? data.geriatricDepression?.detailedTable?.identifiedProblem1
                  ?.identifiedProblem
              : null,
            intervention_action: data.geriatricDepression?.detailedTable
              ?.identifiedProblem1?.interventionAction
              ? data.geriatricDepression?.detailedTable?.identifiedProblem1
                  ?.interventionAction
              : null,
            goal: data.geriatricDepression?.detailedTable?.identifiedProblem1
              ?.goal,
          },
          identified_problem_2: {
            identified_problem: data.geriatricDepression?.detailedTable
              ?.identifiedProblem2?.identifiedProblem
              ? data.geriatricDepression?.detailedTable?.identifiedProblem2
                  ?.identifiedProblem
              : null,
            intervention_action: data.geriatricDepression?.detailedTable
              ?.identifiedProblem2?.interventionAction
              ? data.geriatricDepression?.detailedTable?.identifiedProblem2
                  ?.interventionAction
              : null,
            goal: data.geriatricDepression?.detailedTable?.identifiedProblem2
              ?.goal
              ? data.geriatricDepression?.detailedTable?.identifiedProblem2
                  ?.goal
              : null,
            referral_options: data.geriatricDepression?.detailedTable
              ?.identifiedProblem2?.referralOptions
              ? data.geriatricDepression?.detailedTable?.identifiedProblem2
                  ?.referralOptions
              : null,
          },
          identified_problem_3: {
            identified_problem: data.geriatricDepression?.detailedTable
              ?.identifiedProblem3?.identifiedProblem
              ? data.geriatricDepression?.detailedTable?.identifiedProblem3
                  ?.identifiedProblem
              : null,
            intervention_action: data.geriatricDepression?.detailedTable
              ?.identifiedProblem3?.interventionAction
              ? data.geriatricDepression?.detailedTable?.identifiedProblem3
                  ?.interventionAction
              : null,
            goal: data.geriatricDepression?.detailedTable?.identifiedProblem3
              ?.goal
              ? data.geriatricDepression?.detailedTable?.identifiedProblem3
                  ?.goal
              : null,
            referral_options: data.geriatricDepression?.detailedTable
              ?.identifiedProblem3?.referralOptions
              ? data.geriatricDepression?.detailedTable?.identifiedProblem3
                  ?.referralOptions
              : null,
          },
          identified_problem_4: {
            identified_problem: data.geriatricDepression?.detailedTable
              ?.identifiedProblem4?.identifiedProblem
              ? data.geriatricDepression?.detailedTable?.identifiedProblem4
                  ?.identifiedProblem
              : null,
            intervention_action: data.geriatricDepression?.detailedTable
              ?.identifiedProblem4?.interventionAction
              ? data.geriatricDepression?.detailedTable?.identifiedProblem4
                  ?.interventionAction
              : null,
            goal: data.geriatricDepression?.detailedTable?.identifiedProblem4
              ?.goal
              ? data.geriatricDepression?.detailedTable?.identifiedProblem4
                  ?.goal
              : null,
            referral_options: data.geriatricDepression?.detailedTable
              ?.identifiedProblem4?.referralOptions
              ? data.geriatricDepression?.detailedTable?.identifiedProblem4
                  ?.referralOptions
              : null,
          },
          identified_problem_5: {
            identified_problem: data.geriatricDepression?.detailedTable
              ?.identifiedProblem5?.identifiedProblem
              ? data.geriatricDepression?.detailedTable?.identifiedProblem5
                  ?.identifiedProblem
              : null,
            intervention_action: data.geriatricDepression?.detailedTable
              ?.identifiedProblem5?.interventionAction
              ? data.geriatricDepression?.detailedTable?.identifiedProblem5
                  ?.interventionAction
              : null,
            goal: data.geriatricDepression?.detailedTable?.identifiedProblem5
              ?.goal
              ? data.geriatricDepression?.detailedTable?.identifiedProblem5
                  ?.goal
              : null,
            referral_options: data.geriatricDepression?.detailedTable
              ?.identifiedProblem5?.referralOptions
              ? data.geriatricDepression?.detailedTable?.identifiedProblem5
                  ?.referralOptions
              : null,
          },
        },
      },
      nutritional_health: {
        summary: data.nutritionalHealth?.summary
          ? data.nutritionalHealth?.summary
          : null,
        deficits_noted: data.nutritionalHealth?.deficitsNoted
          ? data.nutritionalHealth?.deficitsNoted === "true"
            ? true
            : false
          : false,
        category_name: data.nutritionalHealth?.categoryName
          ? data.nutritionalHealth?.categoryName
          : "nutritional_health",
        detailed_table: {
          identified_problem_1: {
            identified_problem: data.nutritionalHealth?.detailedTable
              ?.identifiedProblem1?.identifiedProblem
              ? data.nutritionalHealth?.detailedTable?.identifiedProblem1
                  ?.identifiedProblem
              : null,
            intervention_action: data.nutritionalHealth?.detailedTable
              ?.identifiedProblem1?.interventionAction
              ? data.nutritionalHealth?.detailedTable?.identifiedProblem1
                  ?.interventionAction
              : null,
            goal: data.nutritionalHealth?.detailedTable?.identifiedProblem1
              ?.goal
              ? data.nutritionalHealth?.detailedTable?.identifiedProblem1?.goal
              : null,
            referral_options: data.nutritionalHealth?.detailedTable
              ?.identifiedProblem1?.referralOptions
              ? data.nutritionalHealth?.detailedTable?.identifiedProblem1
                  ?.referralOptions
              : null,
          },
          identified_problem_2: {
            identified_problem: data.nutritionalHealth?.detailedTable
              ?.identifiedProblem2?.identifiedProblem
              ? data.nutritionalHealth?.detailedTable?.identifiedProblem2
                  ?.identifiedProblem
              : null,
            intervention_action: data.nutritionalHealth?.detailedTable
              ?.identifiedProblem2?.interventionAction
              ? data.nutritionalHealth?.detailedTable?.identifiedProblem2
                  ?.interventionAction
              : null,
          },
          identified_problem_3: {
            identified_problem: data.nutritionalHealth?.detailedTable
              ?.identifiedProblem3?.identifiedProblem
              ? data.nutritionalHealth?.detailedTable?.identifiedProblem3
                  ?.identifiedProblem
              : null,
            intervention_action: data.nutritionalHealth?.detailedTable
              ?.identifiedProblem3?.interventionAction
              ? data.nutritionalHealth?.detailedTable?.identifiedProblem3
                  ?.interventionAction
              : null,
          },
          identified_problem_4: {
            identified_problem: data.nutritionalHealth?.detailedTable
              ?.identifiedProblem4?.identifiedProblem
              ? data.nutritionalHealth?.detailedTable?.identifiedProblem4
                  ?.identifiedProblem
              : null,
            intervention_action: data.nutritionalHealth?.detailedTable
              ?.identifiedProblem4?.interventionAction
              ? data.nutritionalHealth?.detailedTable?.identifiedProblem4
                  ?.interventionAction
              : null,
            goal: data.nutritionalHealth?.detailedTable?.identifiedProblem4
              ?.goal
              ? data.nutritionalHealth?.detailedTable?.identifiedProblem4?.goal
              : null,
            referral_options: data.nutritionalHealth?.detailedTable
              ?.identifiedProblem4?.referralOptions
              ? data.nutritionalHealth?.detailedTable?.identifiedProblem4
                  ?.referralOptions
              : null,
          },
          identified_problem_5: {
            identified_problem: data.nutritionalHealth?.detailedTable
              ?.identifiedProblem5?.identifiedProblem
              ? data.nutritionalHealth?.detailedTable?.identifiedProblem5
                  ?.identifiedProblem
              : null,
            intervention_action: data.nutritionalHealth?.detailedTable
              ?.identifiedProblem5?.interventionAction
              ? data.nutritionalHealth?.detailedTable?.identifiedProblem5
                  ?.interventionAction
              : null,
            goal: data.nutritionalHealth?.detailedTable?.identifiedProblem5
              ?.goal
              ? data.nutritionalHealth?.detailedTable?.identifiedProblem5?.goal
              : null,
            referral_options: data.nutritionalHealth?.detailedTable
              ?.identifiedProblem5?.referralOptions
              ? data.nutritionalHealth?.detailedTable?.identifiedProblem5
                  ?.referralOptions
              : null,
          },
        },
      },
      legal_and_financial: {
        summary: data.legalAndFinancial?.summary
          ? data.legalAndFinancial?.summary
          : null,
        deficits_noted: data.legalAndFinancial?.deficitsNoted
          ? data.legalAndFinancial?.deficitsNoted === "true"
            ? true
            : false
          : false,
        category_name: data.legalAndFinancial?.categoryName
          ? data.legalAndFinancial?.categoryName
          : "legal_financial",
        detailed_table: {
          identified_problem_1: {
            identified_problem: data.legalAndFinancial?.detailedTable
              ?.identifiedProblem1?.identifiedProblem
              ? data.legalAndFinancial?.detailedTable?.identifiedProblem1
                  ?.identifiedProblem
              : null,
            intervention_action: data.legalAndFinancial?.detailedTable
              ?.identifiedProblem1?.interventionAction
              ? data.legalAndFinancial?.detailedTable?.identifiedProblem1
                  ?.interventionAction
              : null,
            goal: data.legalAndFinancial?.detailedTable?.identifiedProblem1
              ?.goal
              ? data.legalAndFinancial?.detailedTable?.identifiedProblem1?.goal
              : null,
            referral_options: data.legalAndFinancial?.detailedTable
              ?.identifiedProblem1?.referralOptions
              ? data.legalAndFinancial?.detailedTable?.identifiedProblem1
                  ?.referralOptions
              : null,
          },
          identified_problem_2: {
            identified_problem: data.legalAndFinancial?.detailedTable
              ?.identifiedProblem2?.identifiedProblem
              ? data.legalAndFinancial?.detailedTable?.identifiedProblem2
                  ?.identifiedProblem
              : null,
            intervention_action: data.legalAndFinancial?.detailedTable
              ?.identifiedProblem2?.interventionAction
              ? data.legalAndFinancial?.detailedTable?.identifiedProblem2
                  ?.interventionAction
              : null,
            goal: data.legalAndFinancial?.detailedTable?.identifiedProblem2
              ?.goal
              ? data.legalAndFinancial?.detailedTable?.identifiedProblem2?.goal
              : null,
            referral_options: data.legalAndFinancial?.detailedTable
              ?.identifiedProblem2?.referralOptions
              ? data.legalAndFinancial?.detailedTable?.identifiedProblem2
                  ?.referralOptions
              : null,
          },
          identified_problem_3: {
            identified_problem: data.legalAndFinancial?.detailedTable
              ?.identifiedProblem3?.identifiedProblem
              ? data.legalAndFinancial?.detailedTable?.identifiedProblem3
                  ?.identifiedProblem
              : null,
            intervention_action: data.legalAndFinancial?.detailedTable
              ?.identifiedProblem3?.interventionAction
              ? data.legalAndFinancial?.detailedTable?.identifiedProblem3
                  ?.interventionAction
              : null,
            goal: data.legalAndFinancial?.detailedTable?.identifiedProblem3
              ?.goal
              ? data.legalAndFinancial?.detailedTable?.identifiedProblem3?.goal
              : null,
            referral_options: data.legalAndFinancial?.detailedTable
              ?.identifiedProblem3?.referralOptions
              ? data.legalAndFinancial?.detailedTable?.identifiedProblem3
                  ?.referralOptions
              : null,
          },
          identified_problem_4: {
            identified_problem: data.legalAndFinancial?.detailedTable
              ?.identifiedProblem4?.identifiedProblem
              ? data.legalAndFinancial?.detailedTable?.identifiedProblem4
                  ?.identifiedProblem
              : null,
            intervention_action: data.legalAndFinancial?.detailedTable
              ?.identifiedProblem4?.interventionAction
              ? data.legalAndFinancial?.detailedTable?.identifiedProblem4
                  ?.interventionAction
              : null,
            goal: data.legalAndFinancial?.detailedTable?.identifiedProblem4
              ?.goal
              ? data.legalAndFinancial?.detailedTable?.identifiedProblem4?.goal
              : null,
            referral_options: data.legalAndFinancial?.detailedTable
              ?.identifiedProblem4?.referralOptions
              ? data.legalAndFinancial?.detailedTable?.identifiedProblem4
                  ?.referralOptions
              : null,
          },
          identified_problem_5: {
            identified_problem: data.legalAndFinancial?.detailedTable
              ?.identifiedProblem5?.identifiedProblem
              ? data.legalAndFinancial?.detailedTable?.identifiedProblem5
                  ?.identifiedProblem
              : null,
            intervention_action: data.legalAndFinancial?.detailedTable
              ?.identifiedProblem5?.interventionAction
              ? data.legalAndFinancial?.detailedTable?.identifiedProblem5
                  ?.interventionAction
              : null,
            goal: data.legalAndFinancial?.detailedTable?.identifiedProblem5
              ?.goal
              ? data.legalAndFinancial?.detailedTable?.identifiedProblem5?.goal
              : null,
            referral_options:
              data.legalAndFinancial?.detailedTable?.identifiedProblem5
                ?.referralOptions,
          },
          identified_problem_6: {
            identified_problem: data.legalAndFinancial?.detailedTable
              ?.identifiedProblem6?.identifiedProblem
              ? data.legalAndFinancial?.detailedTable?.identifiedProblem6
                  ?.identifiedProblem
              : null,
            intervention_action: data.legalAndFinancial?.detailedTable
              ?.identifiedProblem6?.interventionAction
              ? data.legalAndFinancial?.detailedTable?.identifiedProblem6
                  ?.interventionAction
              : null,
            goal: data.legalAndFinancial?.detailedTable?.identifiedProblem6
              ?.goal
              ? data.legalAndFinancial?.detailedTable?.identifiedProblem6?.goal
              : null,
            referral_options: data.legalAndFinancial?.detailedTable
              ?.identifiedProblem6?.referralOptions
              ? data.legalAndFinancial?.detailedTable?.identifiedProblem6
                  ?.referralOptions
              : null,
          },
          identified_problem_7: {
            identified_problem: data.legalAndFinancial?.detailedTable
              ?.identifiedProblem7?.identifiedProblem
              ? data.legalAndFinancial?.detailedTable?.identifiedProblem7
                  ?.identifiedProblem
              : null,
            intervention_action: data.legalAndFinancial?.detailedTable
              ?.identifiedProblem7?.interventionAction
              ? data.legalAndFinancial?.detailedTable?.identifiedProblem7
                  ?.interventionAction
              : null,
            goal: data.legalAndFinancial?.detailedTable?.identifiedProblem7
              ?.goal
              ? data.legalAndFinancial?.detailedTable?.identifiedProblem7?.goal
              : null,
            referral_options: data.legalAndFinancial?.detailedTable
              ?.identifiedProblem7?.referralOptions
              ? data.legalAndFinancial?.detailedTable?.identifiedProblem7
                  ?.referralOptions
              : null,
          },
          identified_problem_8: {
            identified_problem: data.legalAndFinancial?.detailedTable
              ?.identifiedProblem8?.identifiedProblem
              ? data.legalAndFinancial?.detailedTable?.identifiedProblem8
                  ?.identifiedProblem
              : null,
            intervention_action: data.legalAndFinancial?.detailedTable
              ?.identifiedProblem8?.interventionAction
              ? data.legalAndFinancial?.detailedTable?.identifiedProblem8
                  ?.interventionAction
              : null,
            goal: data.legalAndFinancial?.detailedTable?.identifiedProblem8
              ?.goal
              ? data.legalAndFinancial?.detailedTable?.identifiedProblem8?.goal
              : null,
            referral_options: data.legalAndFinancial?.detailedTable
              ?.identifiedProblem8?.referralOptions
              ? data.legalAndFinancial?.detailedTable?.identifiedProblem8
                  ?.referralOptions
              : null,
          },
          identified_problem_9: {
            identified_problem: data.legalAndFinancial?.detailedTable
              ?.identifiedProblem9?.identifiedProblem
              ? data.legalAndFinancial?.detailedTable?.identifiedProblem9
                  ?.identifiedProblem
              : null,
            intervention_action: data.legalAndFinancial?.detailedTable
              ?.identifiedProblem9?.interventionAction
              ? data.legalAndFinancial?.detailedTable?.identifiedProblem9
                  ?.interventionAction
              : null,
            goal: data.legalAndFinancial?.detailedTable?.identifiedProblem9
              ?.goal
              ? data.legalAndFinancial?.detailedTable?.identifiedProblem9?.goal
              : null,
            referral_options: data.legalAndFinancial?.detailedTable
              ?.identifiedProblem9?.referralOptions
              ? data.legalAndFinancial?.detailedTable?.identifiedProblem9
                  ?.referralOptions
              : null,
          },
          identified_problem_10: {
            identified_problem: data.legalAndFinancial?.detailedTable
              ?.identifiedProblem10?.identifiedProblem
              ? data.legalAndFinancial?.detailedTable?.identifiedProblem10
                  ?.identifiedProblem
              : null,
            intervention_action: data.legalAndFinancial?.detailedTable
              ?.identifiedProblem10?.interventionAction
              ? data.legalAndFinancial?.detailedTable?.identifiedProblem10
                  ?.interventionAction
              : null,
            goal: data.legalAndFinancial?.detailedTable?.identifiedProblem10
              ?.goal
              ? data.legalAndFinancial?.detailedTable?.identifiedProblem10?.goal
              : null,
            referral_options: data.legalAndFinancial?.detailedTable
              ?.identifiedProblem10?.referralOptions
              ? data.legalAndFinancial?.detailedTable?.identifiedProblem10
                  ?.referralOptions
              : null,
          },
        },
      },
      care_giver_support: {
        summary: data.careGiverSupport?.summary
          ? data.careGiverSupport?.summary
          : null,
        deficits_noted: data.careGiverSupport?.deficitsNoted
          ? data.careGiverSupport?.deficitsNoted === "true"
            ? true
            : false
          : false,
        category_name: data.careGiverSupport?.categoryName
          ? data.careGiverSupport?.categoryName
          : "care_giver_support",
        detailed_table: {
          identified_problem_1: {
            identified_problem: data.careGiverSupport?.detailedTable
              ?.identifiedProblem1?.identifiedProblem
              ? data.careGiverSupport?.detailedTable?.identifiedProblem1
                  ?.identifiedProblem
              : null,
            intervention_action: data.careGiverSupport?.detailedTable
              ?.identifiedProblem1?.interventionAction
              ? data.careGiverSupport?.detailedTable?.identifiedProblem1
                  ?.interventionAction
              : null,
            goal: data.careGiverSupport?.detailedTable?.identifiedProblem1?.goal
              ? data.careGiverSupport?.detailedTable?.identifiedProblem1?.goal
              : null,
            referral_options: data.careGiverSupport?.detailedTable
              ?.identifiedProblem1?.referralOptions
              ? data.careGiverSupport?.detailedTable?.identifiedProblem1
                  ?.referralOptions
              : null,
          },
          identified_problem_2: {
            identified_problem: data.careGiverSupport?.detailedTable
              ?.identifiedProblem2?.identifiedProblem
              ? data.careGiverSupport?.detailedTable?.identifiedProblem2
                  ?.identifiedProblem
              : null,
            intervention_action: data.careGiverSupport?.detailedTable
              ?.identifiedProblem2?.interventionAction
              ? data.careGiverSupport?.detailedTable?.identifiedProblem2
                  ?.interventionAction
              : null,
            goal: data.careGiverSupport?.detailedTable?.identifiedProblem2?.goal
              ? data.careGiverSupport?.detailedTable?.identifiedProblem2?.goal
              : null,
            referral_options: data.careGiverSupport?.detailedTable
              ?.identifiedProblem2?.referralOptions
              ? data.careGiverSupport?.detailedTable?.identifiedProblem2
                  ?.referralOptions
              : null,
          },
          identified_problem_3: {
            identified_problem: data.careGiverSupport?.detailedTable
              ?.identifiedProblem3?.identifiedProblem
              ? data.careGiverSupport?.detailedTable?.identifiedProblem3
                  ?.identifiedProblem
              : null,
            intervention_action: data.careGiverSupport?.detailedTable
              ?.identifiedProblem3?.interventionAction
              ? data.careGiverSupport?.detailedTable?.identifiedProblem3
                  ?.interventionAction
              : null,
            referral_options: data.careGiverSupport?.detailedTable
              ?.identifiedProblem3?.referralOptions
              ? data.careGiverSupport?.detailedTable?.identifiedProblem3
                  ?.referralOptions
              : null,
          },
          identified_problem_4: {
            identified_problem: data.careGiverSupport?.detailedTable
              ?.identifiedProblem4?.identifiedProblem
              ? data.careGiverSupport?.detailedTable?.identifiedProblem4
                  ?.identifiedProblem
              : null,
            intervention_action: data.careGiverSupport?.detailedTable
              ?.identifiedProblem4?.interventionAction
              ? data.careGiverSupport?.detailedTable?.identifiedProblem4
                  ?.interventionAction
              : null,
            goal: data.careGiverSupport?.detailedTable?.identifiedProblem4?.goal
              ? data.careGiverSupport?.detailedTable?.identifiedProblem4?.goal
              : null,
            referral_options: data.careGiverSupport?.detailedTable
              ?.identifiedProblem4?.referralOptions
              ? data.careGiverSupport?.detailedTable?.identifiedProblem4
                  ?.referralOptions
              : null,
          },
        },
      },
      comprehensive_care_plan_assessment: {
        initial_request: data.initialRequest ? data.initialRequest : null,
        care_recipient_goals: data.careRecipientGoals
          ? data.careRecipientGoals
          : null,
        demographic_and_historic_information:
          data.demographicAndHistoricInformation
            ? data.demographicAndHistoricInformation
            : null,
        medical_history: data.medicalHistory ? data.medicalHistory : null,
      },
    };

    postComprehensiveCarePlanMutation.mutate({
      clientId: clientId as string,
      data: postData,
    });
  };

  if (isLoadingCarePlan) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CommonLoader />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <Card title="Comprehensive Care Plan">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
          <Input
            label="Preferred Hospital"
            register={register("preferredHospital")}
            error={errors.preferredHospital?.message}
          />
          <Input
            label="Pharmacy Name"
            register={register("pharmacyName")}
            error={errors.pharmacyName?.message}
          />
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

      <Card title="Initial Request">
        <div className="mb-5">
          <TextArea
            label="Initial Request"
            register={register("initialRequest")}
            error={errors.initialRequest?.message}
            rows={4}
            placeholder="Provide details and reasons for assessment and reason for assessment and engagement with services."
          />
        </div>
      </Card>

      <Card title="Care Recipients Stated Goals">
        <div className="mb-5">
          <TextArea
            label="Care Recipients Stated Goals"
            register={register("careRecipientGoals")}
            error={errors.careRecipientGoals?.message}
            rows={4}
            placeholder="Provide details of the care recipients stated goals and requests pertaining to service provision."
          />
        </div>
      </Card>

      <Card title="Demographic and Historic Information">
        <div className="mb-5">
          <TextArea
            label="Demographic and Historic Information"
            register={register("demographicAndHistoricInformation")}
            error={errors.demographicAndHistoricInformation?.message}
            rows={4}
            placeholder="Provide demographic and historic information about the care recipient."
          />
        </div>
      </Card>

      <Card title="Medical History">
        <div className="mb-5">
          <TextArea
            label="Medical History"
            register={register("medicalHistory")}
            error={errors.medicalHistory?.message}
            rows={4}
            placeholder="Provide detailed medical history including diagnoses, treatments, medications, and any relevant medical conditions."
          />
        </div>
      </Card>

      <Card
        title="Medications"
        buttonText={<ICONS.plus size={16} />}
        onButtonClick={() =>
          appendMedication({
            id: null,
            medicationName: "",
            dosage: "",
            frequency: "",
            startDate: "",
            endDate: "",
            indication: "",
          })
        }
        ariaLabel="Add Medication"
        showButton={true}
      >
        <div className="space-y-6">
          {medicationsFields.map((field, index) => (
            <div
              key={field.id}
              className="p-4 rounded-lg border border-gray-200"
            >
              <div className="flex items-center mb-4">
                <span className="text-sm font-medium text-gray-700 mr-2">
                  Medication {index + 1}:
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <Input
                  label="Medication Name"
                  register={register(`medications.${index}.medicationName`)}
                  error={errors.medications?.[index]?.medicationName?.message}
                />
                <Input
                  label="Dosage"
                  register={register(`medications.${index}.dosage`)}
                  error={errors.medications?.[index]?.dosage?.message}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <Input
                  label="Frequency"
                  register={register(`medications.${index}.frequency`)}
                  error={errors.medications?.[index]?.frequency?.message}
                />
                <Input
                  label="Indication"
                  register={register(`medications.${index}.indication`)}
                  error={errors.medications?.[index]?.indication?.message}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <DatePickerField
                  control={control}
                  name={`medications.${index}.startDate`}
                  label="Start Date"
                />
                <DatePickerField
                  control={control}
                  name={`medications.${index}.endDate`}
                  label="End Date"
                />
              </div>
              {medicationsFields.length > 1 && (
                <div className="flex justify-end">
                  <TertiaryButton
                    type="button"
                    onClick={() => removeMedication(index)}
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

      <Card
        title="Allergies"
        buttonText={<ICONS.plus size={16} />}
        onButtonClick={() =>
          appendAllergy({
            allergen: "",
          })
        }
        ariaLabel="Add Allergy"
        showButton={true}
      >
        <div className="space-y-6">
          {allergiesFields.map((field, index) => (
            <div key={field.id} className="p-3 rounded-lg border">
              <div className="w-full flex gap-4 items-center">
                <div className="w-full">
                  <Input
                    label="Allergen"
                    register={register(`allergies.${index}.allergen`)}
                    error={errors.allergies?.[index]?.allergen?.message}
                    placeholder="e.g., Penicillin, Sulfa drugs, Latex"
                  />
                </div>
                {allergiesFields.length > 1 && (
                  <TertiaryButton
                    type="button"
                    onClick={() => removeAllergy(index)}
                    className="text-red-600 border border-red-200 hover:bg-red-50 hover:border-red-300"
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
        title="Healthcare Providers"
        buttonText={<ICONS.plus size={16} />}
        onButtonClick={() =>
          appendHealthcareProvider({
            id: null,
            providerName: "",
            providerType: "",
            specialty: "",
            address: "",
            phone: "",
          })
        }
        ariaLabel="Add Healthcare Provider"
        showButton={true}
      >
        <div className="space-y-6">
          {healthcareProvidersFields.map((field, index) => (
            <div
              key={field.id}
              className="p-4 rounded-lg border border-gray-200"
            >
              <div className="flex items-center mb-4">
                <span className="text-sm font-medium text-gray-700 mr-2">
                  Provider {index + 1}:
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <Input
                  label="Provider Name"
                  register={register(
                    `healthcareProviders.${index}.providerName`
                  )}
                  error={
                    errors.healthcareProviders?.[index]?.providerName?.message
                  }
                />
                <Input
                  label="Provider Type"
                  register={register(
                    `healthcareProviders.${index}.providerType`
                  )}
                  error={
                    errors.healthcareProviders?.[index]?.providerType?.message
                  }
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <Select
                  label="Specialty"
                  name={`healthcareProviders.${index}.specialty`}
                  control={control}
                  data={SPECIALTIES}
                  labelOption="Select Specialty"
                />
                <PhoneNumberInput
                  label="Phone"
                  name={`healthcareProviders.${index}.phone`}
                  control={control}
                />
              </div>
              <div className="mb-4">
                <Input
                  label="Address"
                  register={register(`healthcareProviders.${index}.address`)}
                  error={errors.healthcareProviders?.[index]?.address?.message}
                />
              </div>
              {healthcareProvidersFields.length > 1 && (
                <div className="flex justify-end">
                  <TertiaryButton
                    type="button"
                    onClick={() => removeHealthcareProvider(index)}
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

      <Card title="I. Functional - Activities of Daily Living (ADLs)">
        <div className="mb-4">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-sm font-medium text-gray-700">
              Were deficits noted or recommendations warranted?
            </span>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  {...register("functionalAdls.deficitsNoted")}
                  value="true"
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm">Yes</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  {...register("functionalAdls.deficitsNoted")}
                  value="false"
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm">No</span>
              </label>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-4 border border-gray-200 rounded-lg">
            <h4 className="font-medium text-gray-700 mb-2">1. Bathing</h4>
            <div className="mb-3">
              <TextArea
                label="Description"
                register={register(
                  "functionalAdls.detailedTable.bathing.description"
                )}
                error={
                  errors.functionalAdls?.detailedTable?.bathing?.description
                    ?.message
                }
                rows={3}
                placeholder="Describe the extent to which the care recipient requires assistance with bathing themselves, and any specific needs related to the activity of bathing such as special shampoos, etc."
              />
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700">
                Katz Index Score:
              </span>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    {...register("functionalAdls.detailedTable.bathing.score")}
                    value="0"
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm">0</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    {...register("functionalAdls.detailedTable.bathing.score")}
                    value="1"
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm">1</span>
                </label>
              </div>
            </div>
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
            <h4 className="font-medium text-gray-700 mb-2">2. Dressing</h4>
            <div className="mb-3">
              <TextArea
                label="Description"
                register={register(
                  "functionalAdls.detailedTable.dressing.description"
                )}
                error={
                  errors.functionalAdls?.detailedTable?.dressing?.description
                    ?.message
                }
                rows={3}
                placeholder="Describe the extent to which the care recipient requires assistance with dressing themselves, identifying whether clothing is clean, etc."
              />
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700">
                Katz Index Score:
              </span>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    {...register("functionalAdls.detailedTable.dressing.score")}
                    value="0"
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm">0</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    {...register("functionalAdls.detailedTable.dressing.score")}
                    value="1"
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm">1</span>
                </label>
              </div>
            </div>
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
            <h4 className="font-medium text-gray-700 mb-2">3. Toileting</h4>
            <div className="mb-3">
              <TextArea
                label="Description"
                register={register(
                  "functionalAdls.detailedTable.toileting.description"
                )}
                error={
                  errors.functionalAdls?.detailedTable?.toileting?.description
                    ?.message
                }
                rows={3}
                placeholder="Describe the extent to which the care recipient requires any assistance with toileting."
              />
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700">
                Katz Index Score:
              </span>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    {...register(
                      "functionalAdls.detailedTable.toileting.score"
                    )}
                    value="0"
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm">0</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    {...register(
                      "functionalAdls.detailedTable.toileting.score"
                    )}
                    value="1"
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm">1</span>
                </label>
              </div>
            </div>
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
            <h4 className="font-medium text-gray-700 mb-2">4. Transfers</h4>
            <div className="mb-3">
              <TextArea
                label="Description"
                register={register(
                  "functionalAdls.detailedTable.transfers.description"
                )}
                error={
                  errors.functionalAdls?.detailedTable?.transfers?.description
                    ?.message
                }
                rows={3}
                placeholder="Describe the extent to which the care recipient requires any assistance with transfers."
              />
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700">
                Katz Index Score:
              </span>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    {...register(
                      "functionalAdls.detailedTable.transfers.score"
                    )}
                    value="0"
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm">0</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    {...register(
                      "functionalAdls.detailedTable.transfers.score"
                    )}
                    value="1"
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm">1</span>
                </label>
              </div>
            </div>
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
            <h4 className="font-medium text-gray-700 mb-2">5. Continence</h4>
            <div className="mb-3">
              <TextArea
                label="Description"
                register={register(
                  "functionalAdls.detailedTable.continence.description"
                )}
                error={
                  errors.functionalAdls?.detailedTable?.continence?.description
                    ?.message
                }
                rows={3}
                placeholder="Describe care recipient's urine and bowel continence."
              />
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700">
                Katz Index Score:
              </span>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    {...register(
                      "functionalAdls.detailedTable.continence.score"
                    )}
                    value="0"
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm">0</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    {...register(
                      "functionalAdls.detailedTable.continence.score"
                    )}
                    value="1"
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm">1</span>
                </label>
              </div>
            </div>
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
            <h4 className="font-medium text-gray-700 mb-2">6. Feeding</h4>
            <div className="mb-3">
              <TextArea
                label="Description"
                register={register(
                  "functionalAdls.detailedTable.feeding.description"
                )}
                error={
                  errors.functionalAdls?.detailedTable?.feeding?.description
                    ?.message
                }
                rows={3}
                placeholder="Describe the extent to which the care recipient requires any assistance with feeding."
              />
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700">
                Katz Index Score:
              </span>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    {...register("functionalAdls.detailedTable.feeding.score")}
                    value="0"
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm">0</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    {...register("functionalAdls.detailedTable.feeding.score")}
                    value="1"
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm">1</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <TextArea
            label="Summary"
            register={register("functionalAdls.summary")}
            error={errors.functionalAdls?.summary?.message}
            rows={4}
          />
        </div>

        <div className="mt-4 p-3 bg-blue-100 rounded border-l-4 border-blue-500 text-sm text-gray-700">
          <p className="font-medium mb-2">Definition of Independence:</p>
          <p>
            Independence means without supervision, direction, or active
            personal assistance, except as specially noted below. This is based
            on actual status and not ability. A patient who refuses to perform a
            function is considered as not performing the function, even though
            he or she is deemed able.
          </p>
          <p className="mt-2 text-xs italic">
            Source: Katz- Progress in the Development of the Index ADL (tool)
          </p>
        </div>
      </Card>

      <Card title="Independent Activities of Daily Living (IADL's)">
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-gray-700">
            <strong>IADL Scale</strong> - measuring eight (8) aspects of living
            that are critical to living independently
          </p>
        </div>

        <div className="space-y-6">
          <div className="p-4 border border-gray-200 rounded-lg">
            <h4 className="font-medium text-gray-700 mb-2">
              1. Ability to use telephone
            </h4>
            <p className="text-sm text-gray-600 mb-3">
              Can the care recipient use a telephone independently? Does the
              care recipient own a cellphone?
            </p>
            <div className="mb-3">
              <TextArea
                label="Answer and describe:"
                register={register(
                  "functionalIadls.detailedTable.telephone.description"
                )}
                error={
                  errors.functionalIadls?.detailedTable?.telephone?.description
                    ?.message
                }
                rows={3}
                placeholder="Describe the care recipient's ability to use telephone and cellphone independently"
              />
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700">
                IADL Scale Score:
              </span>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    {...register(
                      "functionalIadls.detailedTable.telephone.score"
                    )}
                    value="0"
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm">0</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    {...register(
                      "functionalIadls.detailedTable.telephone.score"
                    )}
                    value="1"
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm">1</span>
                </label>
              </div>
            </div>
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
            <h4 className="font-medium text-gray-700 mb-2">2. Shopping</h4>
            <p className="text-sm text-gray-600 mb-3">
              Can the care recipient shop independently, either in-person or
              online such as Amazon, etc.?
            </p>
            <div className="mb-3">
              <TextArea
                label="Answer and describe:"
                register={register(
                  "functionalIadls.detailedTable.shopping.description"
                )}
                error={
                  errors.functionalIadls?.detailedTable?.shopping?.description
                    ?.message
                }
                rows={3}
                placeholder="Describe the care recipient's ability to shop independently"
              />
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700">
                IADL Scale Score:
              </span>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    {...register(
                      "functionalIadls.detailedTable.shopping.score"
                    )}
                    value="0"
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm">0</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    {...register(
                      "functionalIadls.detailedTable.shopping.score"
                    )}
                    value="1"
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm">1</span>
                </label>
              </div>
            </div>
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
            <h4 className="font-medium text-gray-700 mb-2">
              3. Food Preparation
            </h4>
            <p className="text-sm text-gray-600 mb-3">
              Can the care recipient prepare or order meals independently?
            </p>
            <div className="mb-3">
              <TextArea
                label="Answer and describe:"
                register={register(
                  "functionalIadls.detailedTable.foodPreparation.description"
                )}
                error={
                  errors.functionalIadls?.detailedTable?.foodPreparation
                    ?.description?.message
                }
                rows={3}
                placeholder="Describe the care recipient's ability to prepare or order meals independently"
              />
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700">
                IADL Scale Score:
              </span>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    {...register(
                      "functionalIadls.detailedTable.foodPreparation.score"
                    )}
                    value="0"
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm">0</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    {...register(
                      "functionalIadls.detailedTable.foodPreparation.score"
                    )}
                    value="1"
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm">1</span>
                </label>
              </div>
            </div>
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
            <h4 className="font-medium text-gray-700 mb-2">4. Housekeeping</h4>
            <p className="text-sm text-gray-600 mb-3">
              Can the care recipient independently perform basic necessary
              upkeep of their living space?
            </p>
            <div className="mb-3">
              <TextArea
                label="Answer and describe:"
                register={register(
                  "functionalIadls.detailedTable.housekeeping.description"
                )}
                error={
                  errors.functionalIadls?.detailedTable?.housekeeping
                    ?.description?.message
                }
                rows={3}
                placeholder="Describe the care recipient's ability to perform housekeeping tasks independently"
              />
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700">
                IADL Scale Score:
              </span>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    {...register(
                      "functionalIadls.detailedTable.housekeeping.score"
                    )}
                    value="0"
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm">0</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    {...register(
                      "functionalIadls.detailedTable.housekeeping.score"
                    )}
                    value="1"
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm">1</span>
                </label>
              </div>
            </div>
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
            <h4 className="font-medium text-gray-700 mb-2">5. Laundry</h4>
            <p className="text-sm text-gray-600 mb-3">
              Can the care recipient independently complete their own laundry,
              including loading and unloading clothes, folding and hanging,
              etc.? Can the care recipient consistently remember to empty the
              dryer lint trap to avoid a serious fire hazard?
            </p>
            <div className="mb-3">
              <TextArea
                label="Answer and describe:"
                register={register(
                  "functionalIadls.detailedTable.laundry.description"
                )}
                error={
                  errors.functionalIadls?.detailedTable?.laundry?.description
                    ?.message
                }
                rows={3}
                placeholder="Describe the care recipient's ability to complete laundry tasks independently"
              />
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700">
                IADL Scale Score:
              </span>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    {...register("functionalIadls.detailedTable.laundry.score")}
                    value="0"
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm">0</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    {...register("functionalIadls.detailedTable.laundry.score")}
                    value="1"
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm">1</span>
                </label>
              </div>
            </div>
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
            <h4 className="font-medium text-gray-700 mb-2">
              6. Mode of Transportation
            </h4>
            <p className="text-sm text-gray-600 mb-3">
              Does the care recipient drive independently? Does the care
              recipient own a vehicle? If not, who regularly transports them?
            </p>
            <div className="mb-3">
              <TextArea
                label="Answer and describe:"
                register={register(
                  "functionalIadls.detailedTable.transportation.description"
                )}
                error={
                  errors.functionalIadls?.detailedTable?.transportation
                    ?.description?.message
                }
                rows={3}
                placeholder="Describe the care recipient's transportation abilities and arrangements"
              />
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700">
                IADL Scale Score:
              </span>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    {...register(
                      "functionalIadls.detailedTable.transportation.score"
                    )}
                    value="0"
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm">0</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    {...register(
                      "functionalIadls.detailedTable.transportation.score"
                    )}
                    value="1"
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm">1</span>
                </label>
              </div>
            </div>
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
            <h4 className="font-medium text-gray-700 mb-2">
              7. Responsibility of own medication
            </h4>
            <p className="text-sm text-gray-600 mb-3">
              To what extent can the care recipient manage their own
              medications? Can they identify and distinguish between
              medications, and consistently take the correct doses at the
              prescribed times? Do they set recurring alarms or other reminders?
              Do they use pill organizers or machine dispensers?
            </p>
            <div className="mb-3">
              <TextArea
                label="Answer and describe:"
                register={register(
                  "functionalIadls.detailedTable.medication.description"
                )}
                error={
                  errors.functionalIadls?.detailedTable?.medication?.description
                    ?.message
                }
                rows={3}
                placeholder="Describe the care recipient's ability to manage medications independently"
              />
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700">
                IADL Scale Score:
              </span>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    {...register(
                      "functionalIadls.detailedTable.medication.score"
                    )}
                    value="0"
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm">0</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    {...register(
                      "functionalIadls.detailedTable.medication.score"
                    )}
                    value="1"
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm">1</span>
                </label>
              </div>
            </div>
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
            <h4 className="font-medium text-gray-700 mb-2">
              8. Ability to handle finances
            </h4>
            <p className="text-sm text-gray-600 mb-3">
              Can the care recipient manage their own finances independently?
              What assistance do they receive, and from who?
            </p>
            <div className="mb-3">
              <TextArea
                label="Answer and describe:"
                register={register(
                  "functionalIadls.detailedTable.finances.description"
                )}
                error={
                  errors.functionalIadls?.detailedTable?.finances?.description
                    ?.message
                }
                rows={3}
                placeholder="Describe the care recipient's ability to manage finances independently"
              />
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700">
                IADL Scale Score:
              </span>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    {...register(
                      "functionalIadls.detailedTable.finances.score"
                    )}
                    value="0"
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm">0</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    {...register(
                      "functionalIadls.detailedTable.finances.score"
                    )}
                    value="1"
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm">1</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <TextArea
            label="Summary"
            register={register("functionalIadls.summary")}
            error={errors.functionalIadls?.summary?.message}
            rows={4}
          />
        </div>

        <div className="mt-6">
          <h4 className="font-medium text-gray-700 mb-4">
            Description of Daily Routine:
          </h4>
          <div className="space-y-4">
            <div className="p-4 border border-gray-200 rounded-lg">
              <h5 className="font-medium text-gray-700 mb-3">Problem 1</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <TextArea
                    label="Identified Problem"
                    register={register(
                      "functionalIadls.additionalData.identifiedProblem1.identifiedProblem"
                    )}
                    error={
                      errors.functionalIadls?.additionalData?.identifiedProblem1
                        ?.identifiedProblem?.message
                    }
                    rows={3}
                  />
                </div>
                <div>
                  <TextArea
                    label="Intervention / Action"
                    register={register(
                      "functionalIadls.additionalData.identifiedProblem1.interventionAction"
                    )}
                    error={
                      errors.functionalIadls?.additionalData?.identifiedProblem1
                        ?.interventionAction?.message
                    }
                    rows={3}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <TextArea
                    label="Goal"
                    register={register(
                      "functionalIadls.additionalData.identifiedProblem1.goal"
                    )}
                    error={
                      errors.functionalIadls?.additionalData?.identifiedProblem1
                        ?.goal?.message
                    }
                    rows={3}
                  />
                </div>
                <div>
                  <TextArea
                    label="Referral Options"
                    register={register(
                      "functionalIadls.additionalData.identifiedProblem1.referralOptions"
                    )}
                    error={
                      errors.functionalIadls?.additionalData?.identifiedProblem1
                        ?.referralOptions?.message
                    }
                    rows={3}
                  />
                </div>
              </div>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg">
              <h5 className="font-medium text-gray-700 mb-3">Problem 2</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <TextArea
                    label="Identified Problem"
                    register={register(
                      "functionalIadls.additionalData.identifiedProblem2.identifiedProblem"
                    )}
                    error={
                      errors.functionalIadls?.additionalData?.identifiedProblem2
                        ?.identifiedProblem?.message
                    }
                    rows={3}
                  />
                </div>
                <div>
                  <TextArea
                    label="Intervention / Action"
                    register={register(
                      "functionalIadls.additionalData.identifiedProblem2.interventionAction"
                    )}
                    error={
                      errors.functionalIadls?.additionalData?.identifiedProblem2
                        ?.interventionAction?.message
                    }
                    rows={3}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <TextArea
                    label="Goal"
                    register={register(
                      "functionalIadls.additionalData.identifiedProblem2.goal"
                    )}
                    error={
                      errors.functionalIadls?.additionalData?.identifiedProblem2
                        ?.goal?.message
                    }
                    rows={3}
                  />
                </div>
                <div>
                  <TextArea
                    label="Referral Options"
                    register={register(
                      "functionalIadls.additionalData.identifiedProblem2.referralOptions"
                    )}
                    error={
                      errors.functionalIadls?.additionalData?.identifiedProblem2
                        ?.referralOptions?.message
                    }
                    rows={3}
                  />
                </div>
              </div>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg">
              <h5 className="font-medium text-gray-700 mb-3">Problem 3</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <TextArea
                    label="Identified Problem"
                    register={register(
                      "functionalIadls.additionalData.identifiedProblem3.identifiedProblem"
                    )}
                    error={
                      errors.functionalIadls?.additionalData?.identifiedProblem3
                        ?.identifiedProblem?.message
                    }
                    rows={3}
                  />
                </div>
                <div>
                  <TextArea
                    label="Intervention / Action"
                    register={register(
                      "functionalIadls.additionalData.identifiedProblem3.interventionAction"
                    )}
                    error={
                      errors.functionalIadls?.additionalData?.identifiedProblem3
                        ?.interventionAction?.message
                    }
                    rows={3}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <TextArea
                    label="Goal"
                    register={register(
                      "functionalIadls.additionalData.identifiedProblem3.goal"
                    )}
                    error={
                      errors.functionalIadls?.additionalData?.identifiedProblem3
                        ?.goal?.message
                    }
                    rows={3}
                  />
                </div>
                <div>
                  <TextArea
                    label="Referral Options"
                    register={register(
                      "functionalIadls.additionalData.identifiedProblem3.referralOptions"
                    )}
                    error={
                      errors.functionalIadls?.additionalData?.identifiedProblem3
                        ?.referralOptions?.message
                    }
                    rows={3}
                  />
                </div>
              </div>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg">
              <h5 className="font-medium text-gray-700 mb-3">Problem 4</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <TextArea
                    label="Identified Problem"
                    register={register(
                      "functionalIadls.additionalData.identifiedProblem4.identifiedProblem"
                    )}
                    error={
                      errors.functionalIadls?.additionalData?.identifiedProblem4
                        ?.identifiedProblem?.message
                    }
                    rows={3}
                  />
                </div>
                <div>
                  <TextArea
                    label="Intervention / Action"
                    register={register(
                      "functionalIadls.additionalData.identifiedProblem4.interventionAction"
                    )}
                    error={
                      errors.functionalIadls?.additionalData?.identifiedProblem4
                        ?.interventionAction?.message
                    }
                    rows={3}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <TextArea
                    label="Goal"
                    register={register(
                      "functionalIadls.additionalData.identifiedProblem4.goal"
                    )}
                    error={
                      errors.functionalIadls?.additionalData?.identifiedProblem4
                        ?.goal?.message
                    }
                    rows={3}
                  />
                </div>
                <div>
                  <TextArea
                    label="Referral Options"
                    register={register(
                      "functionalIadls.additionalData.identifiedProblem4.referralOptions"
                    )}
                    error={
                      errors.functionalIadls?.additionalData?.identifiedProblem4
                        ?.referralOptions?.message
                    }
                    rows={3}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card title="II. Home Safety">
        <div className="mb-4">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-sm font-medium text-gray-700">
              Were deficits noted or recommendations warranted?
            </span>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  {...register("homeSafety.deficitsNoted")}
                  value="true"
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Yes</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  {...register("homeSafety.deficitsNoted")}
                  value="false"
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">No</span>
              </label>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h4 className="font-medium text-gray-700 mb-4">
            Home Environment Safety Checklist:
          </h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <span className="text-sm text-gray-700">Are pathways clear?</span>
              <input
                type="checkbox"
                {...register("homeSafety.detailedTable.arePathwaysClear")}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <span className="text-sm text-gray-700">
                Are there throw rugs?
              </span>
              <input
                type="checkbox"
                {...register("homeSafety.detailedTable.areThereThrowRugs")}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <span className="text-sm text-gray-700">
                Are stairs safe (carpets, railings, etc)?
              </span>
              <input
                type="checkbox"
                {...register("homeSafety.detailedTable.areStairsSafe")}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <span className="text-sm text-gray-700">
                Is there notable clutter or evidence of hoarding?
              </span>
              <input
                type="checkbox"
                {...register(
                  "homeSafety.detailedTable.isThereClutterOrHoarding"
                )}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <span className="text-sm text-gray-700">
                Is there an accessible fire escape route?
              </span>
              <input
                type="checkbox"
                {...register("homeSafety.detailedTable.isThereFireEscapeRoute")}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <span className="text-sm text-gray-700">
                Are floors slippery?
              </span>
              <input
                type="checkbox"
                {...register("homeSafety.detailedTable.areFloorsSlippery")}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <span className="text-sm text-gray-700">
                What is the condition of floor surfaces?
              </span>
              <input
                type="checkbox"
                {...register(
                  "homeSafety.detailedTable.conditionOfFloorSurfaces"
                )}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <span className="text-sm text-gray-700">
                What is the condition of carpeting?
              </span>
              <input
                type="checkbox"
                {...register("homeSafety.detailedTable.conditionOfCarpeting")}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <span className="text-sm text-gray-700">
                Are chairs sturdy and stable?
              </span>
              <input
                type="checkbox"
                {...register(
                  "homeSafety.detailedTable.areChairsSturdyAndStable"
                )}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <span className="text-sm text-gray-700">
                Electricity fully functional?
              </span>
              <input
                type="checkbox"
                {...register(
                  "homeSafety.detailedTable.electricityFullyFunctional"
                )}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <span className="text-sm text-gray-700">Adequate lighting?</span>
              <input
                type="checkbox"
                {...register("homeSafety.detailedTable.adequateLighting")}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <span className="text-sm text-gray-700">
                Exposed wires or cords?
              </span>
              <input
                type="checkbox"
                {...register("homeSafety.detailedTable.exposedWiresOrCords")}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <span className="text-sm text-gray-700">
                Condition of wires and plugs?
              </span>
              <input
                type="checkbox"
                {...register(
                  "homeSafety.detailedTable.conditionOfWiresAndPlugs"
                )}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <span className="text-sm text-gray-700">
                Smoke detectors present?
              </span>
              <input
                type="checkbox"
                {...register("homeSafety.detailedTable.smokeDetectorsPresent")}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <span className="text-sm text-gray-700">
                Are there space heaters?
              </span>
              <input
                type="checkbox"
                {...register("homeSafety.detailedTable.areThereSpaceHeaters")}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <span className="text-sm text-gray-700">
                Care recipient smokes?
              </span>
              <input
                type="checkbox"
                {...register("homeSafety.detailedTable.careRecipientSmokes")}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <span className="text-sm text-gray-700">
                Fire extinguisher accessible?
              </span>
              <input
                type="checkbox"
                {...register(
                  "homeSafety.detailedTable.fireExtinguisherAccessible"
                )}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <span className="text-sm text-gray-700">
                Condition of appliances?
              </span>
              <input
                type="checkbox"
                {...register("homeSafety.detailedTable.conditionOfAppliances")}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <span className="text-sm text-gray-700">
                Kitchen safety hazards?
              </span>
              <input
                type="checkbox"
                {...register("homeSafety.detailedTable.kitchenSafetyHazards")}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <span className="text-sm text-gray-700">
                Locks on doors and windows?
              </span>
              <input
                type="checkbox"
                {...register("homeSafety.detailedTable.locksOnDoorsAndWindows")}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <span className="text-sm text-gray-700">
                Emergency numbers posted?
              </span>
              <input
                type="checkbox"
                {...register("homeSafety.detailedTable.emergencyNumbersPosted")}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <span className="text-sm text-gray-700">
                Accessible telephones?
              </span>
              <input
                type="checkbox"
                {...register("homeSafety.detailedTable.accessibleTelephones")}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <span className="text-sm text-gray-700">
                Weapons or firearms present?
              </span>
              <input
                type="checkbox"
                {...register(
                  "homeSafety.detailedTable.weaponsOrFirearmsPresent"
                )}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <span className="text-sm text-gray-700">Pets present?</span>
              <input
                type="checkbox"
                {...register("homeSafety.detailedTable.petsPresent")}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <span className="text-sm text-gray-700">
                Unsanitary conditions present?
              </span>
              <input
                type="checkbox"
                {...register(
                  "homeSafety.detailedTable.unsanitaryConditionsPresent"
                )}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <span className="text-sm text-gray-700">
                Medications safely stored?
              </span>
              <input
                type="checkbox"
                {...register(
                  "homeSafety.detailedTable.medicationsSafelyStored"
                )}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <span className="text-sm text-gray-700">
                Adequate air conditioning or heat?
              </span>
              <input
                type="checkbox"
                {...register(
                  "homeSafety.detailedTable.adequateAirConditioningOrHeat"
                )}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <span className="text-sm text-gray-700">
                Condition of tub or shower?
              </span>
              <input
                type="checkbox"
                {...register("homeSafety.detailedTable.conditionOfTubOrShower")}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <span className="text-sm text-gray-700">Condition of bed?</span>
              <input
                type="checkbox"
                {...register("homeSafety.detailedTable.conditionOfBed")}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <span className="text-sm text-gray-700">Other?</span>
              <input
                type="checkbox"
                {...register("homeSafety.detailedTable.other")}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="mt-6">
          <TextArea
            label="Summary"
            register={register("homeSafety.summary")}
            error={errors.homeSafety?.summary?.message}
            rows={4}
          />
        </div>
      </Card>

      <Card title="III. Memory & Reasoning">
        <div className="mb-4">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-sm font-medium text-gray-700">
              Were deficits noted or recommendations warranted?
            </span>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  {...register("memoryAndReasoning.deficitsNoted")}
                  value="true"
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Yes</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  {...register("memoryAndReasoning.deficitsNoted")}
                  value="false"
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">No</span>
              </label>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <TextArea
            label="Summary"
            register={register("memoryAndReasoning.summary")}
            error={errors.memoryAndReasoning?.summary?.message}
            rows={6}
            placeholder="Provide a narrative description of the care recipient's memory, reasoning, and other cognitive capacities. Include the nature of any decline (rapid/gradual), the care recipient's insight into their decline and safety concerns, presence of hallucinations or delusions, ability to engage in linear conversation, patterns of perseveration, emotional expression, triggers for emotional responses, and the impact of cognition on organization and ADLs/IADLs."
          />
        </div>

        <div className="mt-6">
          <h4 className="font-medium text-gray-700 mb-4">
            Identified Problems:
          </h4>
          <div className="space-y-4">
            <div className="p-4 border border-gray-200 rounded-lg">
              <h5 className="font-medium text-gray-700 mb-3">Problem 1</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <TextArea
                    label="Identified Problem"
                    register={register(
                      "memoryAndReasoning.detailedTable.identifiedProblem1.identifiedProblem"
                    )}
                    error={
                      errors.memoryAndReasoning?.detailedTable
                        ?.identifiedProblem1?.identifiedProblem?.message
                    }
                    rows={3}
                  />
                </div>
                <div>
                  <TextArea
                    label="Intervention / Action"
                    register={register(
                      "memoryAndReasoning.detailedTable.identifiedProblem1.interventionAction"
                    )}
                    error={
                      errors.memoryAndReasoning?.detailedTable
                        ?.identifiedProblem1?.interventionAction?.message
                    }
                    rows={3}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <TextArea
                    label="Goal"
                    register={register(
                      "memoryAndReasoning.detailedTable.identifiedProblem1.goal"
                    )}
                    error={
                      errors.memoryAndReasoning?.detailedTable
                        ?.identifiedProblem1?.goal?.message
                    }
                    rows={3}
                  />
                </div>
                <div>
                  <TextArea
                    label="Referral Options"
                    register={register(
                      "memoryAndReasoning.detailedTable.identifiedProblem1.referralOptions"
                    )}
                    error={
                      errors.memoryAndReasoning?.detailedTable
                        ?.identifiedProblem1?.referralOptions?.message
                    }
                    rows={3}
                  />
                </div>
              </div>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg">
              <h5 className="font-medium text-gray-700 mb-3">Problem 2</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <TextArea
                    label="Identified Problem"
                    register={register(
                      "memoryAndReasoning.detailedTable.identifiedProblem2.identifiedProblem"
                    )}
                    error={
                      errors.memoryAndReasoning?.detailedTable
                        ?.identifiedProblem2?.identifiedProblem?.message
                    }
                    rows={3}
                  />
                </div>
                <div>
                  <TextArea
                    label="Intervention / Action"
                    register={register(
                      "memoryAndReasoning.detailedTable.identifiedProblem2.interventionAction"
                    )}
                    error={
                      errors.memoryAndReasoning?.detailedTable
                        ?.identifiedProblem2?.interventionAction?.message
                    }
                    rows={3}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <TextArea
                    label="Goal"
                    register={register(
                      "memoryAndReasoning.detailedTable.identifiedProblem2.goal"
                    )}
                    error={
                      errors.memoryAndReasoning?.detailedTable
                        ?.identifiedProblem2?.goal?.message
                    }
                    rows={3}
                  />
                </div>
                <div>
                  <TextArea
                    label="Referral Options"
                    register={register(
                      "memoryAndReasoning.detailedTable.identifiedProblem2.referralOptions"
                    )}
                    error={
                      errors.memoryAndReasoning?.detailedTable
                        ?.identifiedProblem2?.referralOptions?.message
                    }
                    rows={3}
                  />
                </div>
              </div>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg">
              <h5 className="font-medium text-gray-700 mb-3">Problem 3</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <TextArea
                    label="Identified Problem"
                    register={register(
                      "memoryAndReasoning.detailedTable.identifiedProblem3.identifiedProblem"
                    )}
                    error={
                      errors.memoryAndReasoning?.detailedTable
                        ?.identifiedProblem3?.identifiedProblem?.message
                    }
                    rows={3}
                  />
                </div>
                <div>
                  <TextArea
                    label="Intervention / Action"
                    register={register(
                      "memoryAndReasoning.detailedTable.identifiedProblem3.interventionAction"
                    )}
                    error={
                      errors.memoryAndReasoning?.detailedTable
                        ?.identifiedProblem3?.interventionAction?.message
                    }
                    rows={3}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <TextArea
                    label="Goal"
                    register={register(
                      "memoryAndReasoning.detailedTable.identifiedProblem3.goal"
                    )}
                    error={
                      errors.memoryAndReasoning?.detailedTable
                        ?.identifiedProblem3?.goal?.message
                    }
                    rows={3}
                  />
                </div>
                <div>
                  <TextArea
                    label="Referral Options"
                    register={register(
                      "memoryAndReasoning.detailedTable.identifiedProblem3.referralOptions"
                    )}
                    error={
                      errors.memoryAndReasoning?.detailedTable
                        ?.identifiedProblem3?.referralOptions?.message
                    }
                    rows={3}
                  />
                </div>
              </div>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg">
              <h5 className="font-medium text-gray-700 mb-3">Problem 4</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <TextArea
                    label="Identified Problem"
                    register={register(
                      "memoryAndReasoning.detailedTable.identifiedProblem4.identifiedProblem"
                    )}
                    error={
                      errors.memoryAndReasoning?.detailedTable
                        ?.identifiedProblem4?.identifiedProblem?.message
                    }
                    rows={3}
                  />
                </div>
                <div>
                  <TextArea
                    label="Intervention / Action"
                    register={register(
                      "memoryAndReasoning.detailedTable.identifiedProblem4.interventionAction"
                    )}
                    error={
                      errors.memoryAndReasoning?.detailedTable
                        ?.identifiedProblem4?.interventionAction?.message
                    }
                    rows={3}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <TextArea
                    label="Goal"
                    register={register(
                      "memoryAndReasoning.detailedTable.identifiedProblem4.goal"
                    )}
                    error={
                      errors.memoryAndReasoning?.detailedTable
                        ?.identifiedProblem4?.goal?.message
                    }
                    rows={3}
                  />
                </div>
                <div>
                  <TextArea
                    label="Referral Options"
                    register={register(
                      "memoryAndReasoning.detailedTable.identifiedProblem4.referralOptions"
                    )}
                    error={
                      errors.memoryAndReasoning?.detailedTable
                        ?.identifiedProblem4?.referralOptions?.message
                    }
                    rows={3}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card title="IV. Geriatric Depression">
        <div className="mb-4">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-sm font-medium text-gray-700">
              Were deficits noted or recommendations warranted?
            </span>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  {...register("geriatricDepression.deficitsNoted")}
                  value="true"
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Yes</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  {...register("geriatricDepression.deficitsNoted")}
                  value="false"
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">No</span>
              </label>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <TextArea
            label="Summary"
            register={register("geriatricDepression.summary")}
            error={errors.geriatricDepression?.summary?.message}
            rows={6}
            placeholder="Summarize any evidence of depression gleaned from care recipients self-report, collateral report, or direct observation. How often and to what degree does the care recipient express or demonstrate feeling sad, unmotivated, discouraged, or hopeless? Does the care recipient have opportunities to engage in activities relevant to their interests and intellect? Have others expressed any concerns for the care recipient's emotional wellbeing? If evidence of depression is noted, please indicate any suspected or suggested causes or contributing factors."
          />
        </div>

        <div className="mt-6">
          <h4 className="font-medium text-gray-700 mb-4">
            Identified Problems:
          </h4>
          <div className="space-y-4">
            <div className="p-4 border border-gray-200 rounded-lg">
              <h5 className="font-medium text-gray-700 mb-3">Problem 1</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <TextArea
                    label="Identified Problem"
                    register={register(
                      "geriatricDepression.detailedTable.identifiedProblem1.identifiedProblem"
                    )}
                    error={
                      errors.geriatricDepression?.detailedTable
                        ?.identifiedProblem1?.identifiedProblem?.message
                    }
                    rows={3}
                  />
                </div>
                <div>
                  <TextArea
                    label="Intervention / Action"
                    register={register(
                      "geriatricDepression.detailedTable.identifiedProblem1.interventionAction"
                    )}
                    error={
                      errors.geriatricDepression?.detailedTable
                        ?.identifiedProblem1?.interventionAction?.message
                    }
                    rows={3}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <TextArea
                    label="Goal"
                    register={register(
                      "geriatricDepression.detailedTable.identifiedProblem1.goal"
                    )}
                    error={
                      errors.geriatricDepression?.detailedTable
                        ?.identifiedProblem1?.goal?.message
                    }
                    rows={3}
                  />
                </div>
                <div>
                  <TextArea
                    label="Referral Options"
                    register={register(
                      "geriatricDepression.detailedTable.identifiedProblem1.referralOptions"
                    )}
                    error={
                      errors.geriatricDepression?.detailedTable
                        ?.identifiedProblem1?.referralOptions?.message
                    }
                    rows={3}
                  />
                </div>
              </div>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg">
              <h5 className="font-medium text-gray-700 mb-3">Problem 2</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <TextArea
                    label="Identified Problem"
                    register={register(
                      "geriatricDepression.detailedTable.identifiedProblem2.identifiedProblem"
                    )}
                    error={
                      errors.geriatricDepression?.detailedTable
                        ?.identifiedProblem2?.identifiedProblem?.message
                    }
                    rows={3}
                  />
                </div>
                <div>
                  <TextArea
                    label="Intervention / Action"
                    register={register(
                      "geriatricDepression.detailedTable.identifiedProblem2.interventionAction"
                    )}
                    error={
                      errors.geriatricDepression?.detailedTable
                        ?.identifiedProblem2?.interventionAction?.message
                    }
                    rows={3}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <TextArea
                    label="Goal"
                    register={register(
                      "geriatricDepression.detailedTable.identifiedProblem2.goal"
                    )}
                    error={
                      errors.geriatricDepression?.detailedTable
                        ?.identifiedProblem2?.goal?.message
                    }
                    rows={3}
                  />
                </div>
                <div>
                  <TextArea
                    label="Referral Options"
                    register={register(
                      "geriatricDepression.detailedTable.identifiedProblem2.referralOptions"
                    )}
                    error={
                      errors.geriatricDepression?.detailedTable
                        ?.identifiedProblem2?.referralOptions?.message
                    }
                    rows={3}
                  />
                </div>
              </div>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg">
              <h5 className="font-medium text-gray-700 mb-3">Problem 3</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <TextArea
                    label="Identified Problem"
                    register={register(
                      "geriatricDepression.detailedTable.identifiedProblem3.identifiedProblem"
                    )}
                    error={
                      errors.geriatricDepression?.detailedTable
                        ?.identifiedProblem3?.identifiedProblem?.message
                    }
                    rows={3}
                  />
                </div>
                <div>
                  <TextArea
                    label="Intervention / Action"
                    register={register(
                      "geriatricDepression.detailedTable.identifiedProblem3.interventionAction"
                    )}
                    error={
                      errors.geriatricDepression?.detailedTable
                        ?.identifiedProblem3?.interventionAction?.message
                    }
                    rows={3}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <TextArea
                    label="Goal"
                    register={register(
                      "geriatricDepression.detailedTable.identifiedProblem3.goal"
                    )}
                    error={
                      errors.geriatricDepression?.detailedTable
                        ?.identifiedProblem3?.goal?.message
                    }
                    rows={3}
                  />
                </div>
                <div>
                  <TextArea
                    label="Referral Options"
                    register={register(
                      "geriatricDepression.detailedTable.identifiedProblem3.referralOptions"
                    )}
                    error={
                      errors.geriatricDepression?.detailedTable
                        ?.identifiedProblem3?.referralOptions?.message
                    }
                    rows={3}
                  />
                </div>
              </div>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg">
              <h5 className="font-medium text-gray-700 mb-3">Problem 4</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <TextArea
                    label="Identified Problem"
                    register={register(
                      "geriatricDepression.detailedTable.identifiedProblem4.identifiedProblem"
                    )}
                    error={
                      errors.geriatricDepression?.detailedTable
                        ?.identifiedProblem4?.identifiedProblem?.message
                    }
                    rows={3}
                  />
                </div>
                <div>
                  <TextArea
                    label="Intervention / Action"
                    register={register(
                      "geriatricDepression.detailedTable.identifiedProblem4.interventionAction"
                    )}
                    error={
                      errors.geriatricDepression?.detailedTable
                        ?.identifiedProblem4?.interventionAction?.message
                    }
                    rows={3}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <TextArea
                    label="Goal"
                    register={register(
                      "geriatricDepression.detailedTable.identifiedProblem4.goal"
                    )}
                    error={
                      errors.geriatricDepression?.detailedTable
                        ?.identifiedProblem4?.goal?.message
                    }
                    rows={3}
                  />
                </div>
                <div>
                  <TextArea
                    label="Referral Options"
                    register={register(
                      "geriatricDepression.detailedTable.identifiedProblem4.referralOptions"
                    )}
                    error={
                      errors.geriatricDepression?.detailedTable
                        ?.identifiedProblem4?.referralOptions?.message
                    }
                    rows={3}
                  />
                </div>
              </div>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg">
              <h5 className="font-medium text-gray-700 mb-3">Problem 5</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <TextArea
                    label="Identified Problem"
                    register={register(
                      "geriatricDepression.detailedTable.identifiedProblem5.identifiedProblem"
                    )}
                    error={
                      errors.geriatricDepression?.detailedTable
                        ?.identifiedProblem5?.identifiedProblem?.message
                    }
                    rows={3}
                  />
                </div>
                <div>
                  <TextArea
                    label="Intervention / Action"
                    register={register(
                      "geriatricDepression.detailedTable.identifiedProblem5.interventionAction"
                    )}
                    error={
                      errors.geriatricDepression?.detailedTable
                        ?.identifiedProblem5?.interventionAction?.message
                    }
                    rows={3}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <TextArea
                    label="Goal"
                    register={register(
                      "geriatricDepression.detailedTable.identifiedProblem5.goal"
                    )}
                    error={
                      errors.geriatricDepression?.detailedTable
                        ?.identifiedProblem5?.goal?.message
                    }
                    rows={3}
                  />
                </div>
                <div>
                  <TextArea
                    label="Referral Options"
                    register={register(
                      "geriatricDepression.detailedTable.identifiedProblem5.referralOptions"
                    )}
                    error={
                      errors.geriatricDepression?.detailedTable
                        ?.identifiedProblem5?.referralOptions?.message
                    }
                    rows={3}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card title="V. Nutritional Health">
        <div className="mb-4">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-sm font-medium text-gray-700">
              Were deficits noted or recommendations warranted?
            </span>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  {...register("nutritionalHealth.deficitsNoted")}
                  value="true"
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Yes</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  {...register("nutritionalHealth.deficitsNoted")}
                  value="false"
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">No</span>
              </label>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <TextArea
            label="Summary"
            register={register("nutritionalHealth.summary")}
            error={errors.nutritionalHealth?.summary?.message}
            rows={6}
            placeholder="Summarize any pertinent information regarding the care recipient's current diet, dietary needs such as food allergies or intolerances, community meal plans, and any deficits noted in the care recipient's current access to consistently suitable meals."
          />
        </div>

        <div className="mt-6">
          <h4 className="font-medium text-gray-700 mb-4">
            Identified Problems:
          </h4>
          <div className="space-y-4">
            <div className="p-4 border border-gray-200 rounded-lg">
              <h5 className="font-medium text-gray-700 mb-3">Problem 1</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <TextArea
                    label="Identified Problem"
                    register={register(
                      "nutritionalHealth.detailedTable.identifiedProblem1.identifiedProblem"
                    )}
                    error={
                      errors.nutritionalHealth?.detailedTable
                        ?.identifiedProblem1?.identifiedProblem?.message
                    }
                    rows={3}
                  />
                </div>
                <div>
                  <TextArea
                    label="Intervention / Action"
                    register={register(
                      "nutritionalHealth.detailedTable.identifiedProblem1.interventionAction"
                    )}
                    error={
                      errors.nutritionalHealth?.detailedTable
                        ?.identifiedProblem1?.interventionAction?.message
                    }
                    rows={3}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <TextArea
                    label="Goal"
                    register={register(
                      "nutritionalHealth.detailedTable.identifiedProblem1.goal"
                    )}
                    error={
                      errors.nutritionalHealth?.detailedTable
                        ?.identifiedProblem1?.goal?.message
                    }
                    rows={3}
                  />
                </div>
                <div>
                  <TextArea
                    label="Referral Options"
                    register={register(
                      "nutritionalHealth.detailedTable.identifiedProblem1.referralOptions"
                    )}
                    error={
                      errors.nutritionalHealth?.detailedTable
                        ?.identifiedProblem1?.referralOptions?.message
                    }
                    rows={3}
                  />
                </div>
              </div>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg">
              <h5 className="font-medium text-gray-700 mb-3">Problem 2</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <TextArea
                    label="Identified Problem"
                    register={register(
                      "nutritionalHealth.detailedTable.identifiedProblem2.identifiedProblem"
                    )}
                    error={
                      errors.nutritionalHealth?.detailedTable
                        ?.identifiedProblem2?.identifiedProblem?.message
                    }
                    rows={3}
                  />
                </div>
                <div>
                  <TextArea
                    label="Intervention / Action"
                    register={register(
                      "nutritionalHealth.detailedTable.identifiedProblem2.interventionAction"
                    )}
                    error={
                      errors.nutritionalHealth?.detailedTable
                        ?.identifiedProblem2?.interventionAction?.message
                    }
                    rows={3}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <TextArea
                    label="Goal"
                    register={register(
                      "nutritionalHealth.detailedTable.identifiedProblem2.goal"
                    )}
                    error={
                      errors.nutritionalHealth?.detailedTable
                        ?.identifiedProblem2?.goal?.message
                    }
                    rows={3}
                  />
                </div>
                <div>
                  <TextArea
                    label="Referral Options"
                    register={register(
                      "nutritionalHealth.detailedTable.identifiedProblem2.referralOptions"
                    )}
                    error={
                      errors.nutritionalHealth?.detailedTable
                        ?.identifiedProblem2?.referralOptions?.message
                    }
                    rows={3}
                  />
                </div>
              </div>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg">
              <h5 className="font-medium text-gray-700 mb-3">Problem 3</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <TextArea
                    label="Identified Problem"
                    register={register(
                      "nutritionalHealth.detailedTable.identifiedProblem3.identifiedProblem"
                    )}
                    error={
                      errors.nutritionalHealth?.detailedTable
                        ?.identifiedProblem3?.identifiedProblem?.message
                    }
                    rows={3}
                  />
                </div>
                <div>
                  <TextArea
                    label="Intervention / Action"
                    register={register(
                      "nutritionalHealth.detailedTable.identifiedProblem3.interventionAction"
                    )}
                    error={
                      errors.nutritionalHealth?.detailedTable
                        ?.identifiedProblem3?.interventionAction?.message
                    }
                    rows={3}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <TextArea
                    label="Goal"
                    register={register(
                      "nutritionalHealth.detailedTable.identifiedProblem3.goal"
                    )}
                    error={
                      errors.nutritionalHealth?.detailedTable
                        ?.identifiedProblem3?.goal?.message
                    }
                    rows={3}
                  />
                </div>
                <div>
                  <TextArea
                    label="Referral Options"
                    register={register(
                      "nutritionalHealth.detailedTable.identifiedProblem3.referralOptions"
                    )}
                    error={
                      errors.nutritionalHealth?.detailedTable
                        ?.identifiedProblem3?.referralOptions?.message
                    }
                    rows={3}
                  />
                </div>
              </div>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg">
              <h5 className="font-medium text-gray-700 mb-3">Problem 4</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <TextArea
                    label="Identified Problem"
                    register={register(
                      "nutritionalHealth.detailedTable.identifiedProblem4.identifiedProblem"
                    )}
                    error={
                      errors.nutritionalHealth?.detailedTable
                        ?.identifiedProblem4?.identifiedProblem?.message
                    }
                    rows={3}
                  />
                </div>
                <div>
                  <TextArea
                    label="Intervention / Action"
                    register={register(
                      "nutritionalHealth.detailedTable.identifiedProblem4.interventionAction"
                    )}
                    error={
                      errors.nutritionalHealth?.detailedTable
                        ?.identifiedProblem4?.interventionAction?.message
                    }
                    rows={3}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <TextArea
                    label="Goal"
                    register={register(
                      "nutritionalHealth.detailedTable.identifiedProblem4.goal"
                    )}
                    error={
                      errors.nutritionalHealth?.detailedTable
                        ?.identifiedProblem4?.goal?.message
                    }
                    rows={3}
                  />
                </div>
                <div>
                  <TextArea
                    label="Referral Options"
                    register={register(
                      "nutritionalHealth.detailedTable.identifiedProblem4.referralOptions"
                    )}
                    error={
                      errors.nutritionalHealth?.detailedTable
                        ?.identifiedProblem4?.referralOptions?.message
                    }
                    rows={3}
                  />
                </div>
              </div>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg">
              <h5 className="font-medium text-gray-700 mb-3">Problem 5</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <TextArea
                    label="Identified Problem"
                    register={register(
                      "nutritionalHealth.detailedTable.identifiedProblem5.identifiedProblem"
                    )}
                    error={
                      errors.nutritionalHealth?.detailedTable
                        ?.identifiedProblem5?.identifiedProblem?.message
                    }
                    rows={3}
                  />
                </div>
                <div>
                  <TextArea
                    label="Intervention / Action"
                    register={register(
                      "nutritionalHealth.detailedTable.identifiedProblem5.interventionAction"
                    )}
                    error={
                      errors.nutritionalHealth?.detailedTable
                        ?.identifiedProblem5?.interventionAction?.message
                    }
                    rows={3}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <TextArea
                    label="Goal"
                    register={register(
                      "nutritionalHealth.detailedTable.identifiedProblem5.goal"
                    )}
                    error={
                      errors.nutritionalHealth?.detailedTable
                        ?.identifiedProblem5?.goal?.message
                    }
                    rows={3}
                  />
                </div>
                <div>
                  <TextArea
                    label="Referral Options"
                    register={register(
                      "nutritionalHealth.detailedTable.identifiedProblem5.referralOptions"
                    )}
                    error={
                      errors.nutritionalHealth?.detailedTable
                        ?.identifiedProblem5?.referralOptions?.message
                    }
                    rows={3}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card title="VI. Legal and Financial">
        <div className="mb-4">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-sm font-medium text-gray-700">
              Were deficits noted or recommendations warranted?
            </span>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  {...register("legalAndFinancial.deficitsNoted")}
                  value="true"
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Yes</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  {...register("legalAndFinancial.deficitsNoted")}
                  value="false"
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">No</span>
              </label>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <TextArea
            label="Summary"
            register={register("legalAndFinancial.summary")}
            error={errors.legalAndFinancial?.summary?.message}
            rows={6}
            placeholder="Summarize the care recipient's general legal and financial status in a narrative format. Is all legal and financial documentation up to date and appropriate? Do the care recipient or their family have any concerns for the cost of care or other services? Does the care recipient have a designated power of attorney and/or a living will?"
          />
        </div>

        <div className="mt-6">
          <h4 className="font-medium text-gray-700 mb-4">
            Identified Problems:
          </h4>
          <div className="space-y-4">
            <div className="p-4 border border-gray-200 rounded-lg">
              <h5 className="font-medium text-gray-700 mb-3">Problem 1</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <TextArea
                    label="Identified Problem"
                    register={register(
                      "legalAndFinancial.detailedTable.identifiedProblem1.identifiedProblem"
                    )}
                    error={
                      errors.legalAndFinancial?.detailedTable
                        ?.identifiedProblem1?.identifiedProblem?.message
                    }
                    rows={3}
                  />
                </div>
                <div>
                  <TextArea
                    label="Intervention / Action"
                    register={register(
                      "legalAndFinancial.detailedTable.identifiedProblem1.interventionAction"
                    )}
                    error={
                      errors.legalAndFinancial?.detailedTable
                        ?.identifiedProblem1?.interventionAction?.message
                    }
                    rows={3}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <TextArea
                    label="Goal"
                    register={register(
                      "legalAndFinancial.detailedTable.identifiedProblem1.goal"
                    )}
                    error={
                      errors.legalAndFinancial?.detailedTable
                        ?.identifiedProblem1?.goal?.message
                    }
                    rows={3}
                  />
                </div>
                <div>
                  <TextArea
                    label="Referral Options"
                    register={register(
                      "legalAndFinancial.detailedTable.identifiedProblem1.referralOptions"
                    )}
                    error={
                      errors.legalAndFinancial?.detailedTable
                        ?.identifiedProblem1?.referralOptions?.message
                    }
                    rows={3}
                  />
                </div>
              </div>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg">
              <h5 className="font-medium text-gray-700 mb-3">Problem 2</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <TextArea
                    label="Identified Problem"
                    register={register(
                      "legalAndFinancial.detailedTable.identifiedProblem2.identifiedProblem"
                    )}
                    error={
                      errors.legalAndFinancial?.detailedTable
                        ?.identifiedProblem2?.identifiedProblem?.message
                    }
                    rows={3}
                  />
                </div>
                <div>
                  <TextArea
                    label="Intervention / Action"
                    register={register(
                      "legalAndFinancial.detailedTable.identifiedProblem2.interventionAction"
                    )}
                    error={
                      errors.legalAndFinancial?.detailedTable
                        ?.identifiedProblem2?.interventionAction?.message
                    }
                    rows={3}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <TextArea
                    label="Goal"
                    register={register(
                      "legalAndFinancial.detailedTable.identifiedProblem2.goal"
                    )}
                    error={
                      errors.legalAndFinancial?.detailedTable
                        ?.identifiedProblem2?.goal?.message
                    }
                    rows={3}
                  />
                </div>
                <div>
                  <TextArea
                    label="Referral Options"
                    register={register(
                      "legalAndFinancial.detailedTable.identifiedProblem2.referralOptions"
                    )}
                    error={
                      errors.legalAndFinancial?.detailedTable
                        ?.identifiedProblem2?.referralOptions?.message
                    }
                    rows={3}
                  />
                </div>
              </div>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg">
              <h5 className="font-medium text-gray-700 mb-3">Problem 3</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <TextArea
                    label="Identified Problem"
                    register={register(
                      "legalAndFinancial.detailedTable.identifiedProblem3.identifiedProblem"
                    )}
                    error={
                      errors.legalAndFinancial?.detailedTable
                        ?.identifiedProblem3?.identifiedProblem?.message
                    }
                    rows={3}
                  />
                </div>
                <div>
                  <TextArea
                    label="Intervention / Action"
                    register={register(
                      "legalAndFinancial.detailedTable.identifiedProblem3.interventionAction"
                    )}
                    error={
                      errors.legalAndFinancial?.detailedTable
                        ?.identifiedProblem3?.interventionAction?.message
                    }
                    rows={3}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <TextArea
                    label="Goal"
                    register={register(
                      "legalAndFinancial.detailedTable.identifiedProblem3.goal"
                    )}
                    error={
                      errors.legalAndFinancial?.detailedTable
                        ?.identifiedProblem3?.goal?.message
                    }
                    rows={3}
                  />
                </div>
                <div>
                  <TextArea
                    label="Referral Options"
                    register={register(
                      "legalAndFinancial.detailedTable.identifiedProblem3.referralOptions"
                    )}
                    error={
                      errors.legalAndFinancial?.detailedTable
                        ?.identifiedProblem3?.referralOptions?.message
                    }
                    rows={3}
                  />
                </div>
              </div>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg">
              <h5 className="font-medium text-gray-700 mb-3">Problem 4</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <TextArea
                    label="Identified Problem"
                    register={register(
                      "legalAndFinancial.detailedTable.identifiedProblem4.identifiedProblem"
                    )}
                    error={
                      errors.legalAndFinancial?.detailedTable
                        ?.identifiedProblem4?.identifiedProblem?.message
                    }
                    rows={3}
                  />
                </div>
                <div>
                  <TextArea
                    label="Intervention / Action"
                    register={register(
                      "legalAndFinancial.detailedTable.identifiedProblem4.interventionAction"
                    )}
                    error={
                      errors.legalAndFinancial?.detailedTable
                        ?.identifiedProblem4?.interventionAction?.message
                    }
                    rows={3}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <TextArea
                    label="Goal"
                    register={register(
                      "legalAndFinancial.detailedTable.identifiedProblem4.goal"
                    )}
                    error={
                      errors.legalAndFinancial?.detailedTable
                        ?.identifiedProblem4?.goal?.message
                    }
                    rows={3}
                  />
                </div>
                <div>
                  <TextArea
                    label="Referral Options"
                    register={register(
                      "legalAndFinancial.detailedTable.identifiedProblem4.referralOptions"
                    )}
                    error={
                      errors.legalAndFinancial?.detailedTable
                        ?.identifiedProblem4?.referralOptions?.message
                    }
                    rows={3}
                  />
                </div>
              </div>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg">
              <h5 className="font-medium text-gray-700 mb-3">Problem 5</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <TextArea
                    label="Identified Problem"
                    register={register(
                      "legalAndFinancial.detailedTable.identifiedProblem5.identifiedProblem"
                    )}
                    error={
                      errors.legalAndFinancial?.detailedTable
                        ?.identifiedProblem5?.identifiedProblem?.message
                    }
                    rows={3}
                  />
                </div>
                <div>
                  <TextArea
                    label="Intervention / Action"
                    register={register(
                      "legalAndFinancial.detailedTable.identifiedProblem5.interventionAction"
                    )}
                    error={
                      errors.legalAndFinancial?.detailedTable
                        ?.identifiedProblem5?.interventionAction?.message
                    }
                    rows={3}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <TextArea
                    label="Goal"
                    register={register(
                      "legalAndFinancial.detailedTable.identifiedProblem5.goal"
                    )}
                    error={
                      errors.legalAndFinancial?.detailedTable
                        ?.identifiedProblem5?.goal?.message
                    }
                    rows={3}
                  />
                </div>
                <div>
                  <TextArea
                    label="Referral Options"
                    register={register(
                      "legalAndFinancial.detailedTable.identifiedProblem5.referralOptions"
                    )}
                    error={
                      errors.legalAndFinancial?.detailedTable
                        ?.identifiedProblem5?.referralOptions?.message
                    }
                    rows={3}
                  />
                </div>
              </div>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg">
              <h5 className="font-medium text-gray-700 mb-3">Problem 6</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <TextArea
                    label="Identified Problem"
                    register={register(
                      "legalAndFinancial.detailedTable.identifiedProblem6.identifiedProblem"
                    )}
                    error={
                      errors.legalAndFinancial?.detailedTable
                        ?.identifiedProblem6?.identifiedProblem?.message
                    }
                    rows={3}
                  />
                </div>
                <div>
                  <TextArea
                    label="Intervention / Action"
                    register={register(
                      "legalAndFinancial.detailedTable.identifiedProblem6.interventionAction"
                    )}
                    error={
                      errors.legalAndFinancial?.detailedTable
                        ?.identifiedProblem6?.interventionAction?.message
                    }
                    rows={3}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <TextArea
                    label="Goal"
                    register={register(
                      "legalAndFinancial.detailedTable.identifiedProblem6.goal"
                    )}
                    error={
                      errors.legalAndFinancial?.detailedTable
                        ?.identifiedProblem6?.goal?.message
                    }
                    rows={3}
                  />
                </div>
                <div>
                  <TextArea
                    label="Referral Options"
                    register={register(
                      "legalAndFinancial.detailedTable.identifiedProblem6.referralOptions"
                    )}
                    error={
                      errors.legalAndFinancial?.detailedTable
                        ?.identifiedProblem6?.referralOptions?.message
                    }
                    rows={3}
                  />
                </div>
              </div>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg">
              <h5 className="font-medium text-gray-700 mb-3">Problem 7</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <TextArea
                    label="Identified Problem"
                    register={register(
                      "legalAndFinancial.detailedTable.identifiedProblem7.identifiedProblem"
                    )}
                    error={
                      errors.legalAndFinancial?.detailedTable
                        ?.identifiedProblem7?.identifiedProblem?.message
                    }
                    rows={3}
                  />
                </div>
                <div>
                  <TextArea
                    label="Intervention / Action"
                    register={register(
                      "legalAndFinancial.detailedTable.identifiedProblem7.interventionAction"
                    )}
                    error={
                      errors.legalAndFinancial?.detailedTable
                        ?.identifiedProblem7?.interventionAction?.message
                    }
                    rows={3}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <TextArea
                    label="Goal"
                    register={register(
                      "legalAndFinancial.detailedTable.identifiedProblem7.goal"
                    )}
                    error={
                      errors.legalAndFinancial?.detailedTable
                        ?.identifiedProblem7?.goal?.message
                    }
                    rows={3}
                  />
                </div>
                <div>
                  <TextArea
                    label="Referral Options"
                    register={register(
                      "legalAndFinancial.detailedTable.identifiedProblem7.referralOptions"
                    )}
                    error={
                      errors.legalAndFinancial?.detailedTable
                        ?.identifiedProblem7?.referralOptions?.message
                    }
                    rows={3}
                  />
                </div>
              </div>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg">
              <h5 className="font-medium text-gray-700 mb-3">Problem 8</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <TextArea
                    label="Identified Problem"
                    register={register(
                      "legalAndFinancial.detailedTable.identifiedProblem8.identifiedProblem"
                    )}
                    error={
                      errors.legalAndFinancial?.detailedTable
                        ?.identifiedProblem8?.identifiedProblem?.message
                    }
                    rows={3}
                  />
                </div>
                <div>
                  <TextArea
                    label="Intervention / Action"
                    register={register(
                      "legalAndFinancial.detailedTable.identifiedProblem8.interventionAction"
                    )}
                    error={
                      errors.legalAndFinancial?.detailedTable
                        ?.identifiedProblem8?.interventionAction?.message
                    }
                    rows={3}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <TextArea
                    label="Goal"
                    register={register(
                      "legalAndFinancial.detailedTable.identifiedProblem8.goal"
                    )}
                    error={
                      errors.legalAndFinancial?.detailedTable
                        ?.identifiedProblem8?.goal?.message
                    }
                    rows={3}
                  />
                </div>
                <div>
                  <TextArea
                    label="Referral Options"
                    register={register(
                      "legalAndFinancial.detailedTable.identifiedProblem8.referralOptions"
                    )}
                    error={
                      errors.legalAndFinancial?.detailedTable
                        ?.identifiedProblem8?.referralOptions?.message
                    }
                    rows={3}
                  />
                </div>
              </div>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg">
              <h5 className="font-medium text-gray-700 mb-3">Problem 9</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <TextArea
                    label="Identified Problem"
                    register={register(
                      "legalAndFinancial.detailedTable.identifiedProblem9.identifiedProblem"
                    )}
                    error={
                      errors.legalAndFinancial?.detailedTable
                        ?.identifiedProblem9?.identifiedProblem?.message
                    }
                    rows={3}
                  />
                </div>
                <div>
                  <TextArea
                    label="Intervention / Action"
                    register={register(
                      "legalAndFinancial.detailedTable.identifiedProblem9.interventionAction"
                    )}
                    error={
                      errors.legalAndFinancial?.detailedTable
                        ?.identifiedProblem9?.interventionAction?.message
                    }
                    rows={3}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <TextArea
                    label="Goal"
                    register={register(
                      "legalAndFinancial.detailedTable.identifiedProblem9.goal"
                    )}
                    error={
                      errors.legalAndFinancial?.detailedTable
                        ?.identifiedProblem9?.goal?.message
                    }
                    rows={3}
                  />
                </div>
                <div>
                  <TextArea
                    label="Referral Options"
                    register={register(
                      "legalAndFinancial.detailedTable.identifiedProblem9.referralOptions"
                    )}
                    error={
                      errors.legalAndFinancial?.detailedTable
                        ?.identifiedProblem9?.referralOptions?.message
                    }
                    rows={3}
                  />
                </div>
              </div>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg">
              <h5 className="font-medium text-gray-700 mb-3">Problem 10</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <TextArea
                    label="Identified Problem"
                    register={register(
                      "legalAndFinancial.detailedTable.identifiedProblem10.identifiedProblem"
                    )}
                    error={
                      errors.legalAndFinancial?.detailedTable
                        ?.identifiedProblem10?.identifiedProblem?.message
                    }
                    rows={3}
                  />
                </div>
                <div>
                  <TextArea
                    label="Intervention / Action"
                    register={register(
                      "legalAndFinancial.detailedTable.identifiedProblem10.interventionAction"
                    )}
                    error={
                      errors.legalAndFinancial?.detailedTable
                        ?.identifiedProblem10?.interventionAction?.message
                    }
                    rows={3}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <TextArea
                    label="Goal"
                    register={register(
                      "legalAndFinancial.detailedTable.identifiedProblem10.goal"
                    )}
                    error={
                      errors.legalAndFinancial?.detailedTable
                        ?.identifiedProblem10?.goal?.message
                    }
                    rows={3}
                  />
                </div>
                <div>
                  <TextArea
                    label="Referral Options"
                    register={register(
                      "legalAndFinancial.detailedTable.identifiedProblem10.referralOptions"
                    )}
                    error={
                      errors.legalAndFinancial?.detailedTable
                        ?.identifiedProblem10?.referralOptions?.message
                    }
                    rows={3}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card title="VII. Caregiver Support">
        <div className="mb-4">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-sm font-medium text-gray-700">
              Were deficits noted or recommendations warranted?
            </span>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  {...register("careGiverSupport.deficitsNoted")}
                  value="true"
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Yes</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  {...register("careGiverSupport.deficitsNoted")}
                  value="false"
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">No</span>
              </label>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <TextArea
            label="Summary"
            register={register("careGiverSupport.summary")}
            error={errors.careGiverSupport?.summary?.message}
            rows={6}
            placeholder="Summarize any caregiver support that the care recipient receives from a family, community, or other agency. Who are the care recipient's caregivers and what duties do they primarily perform? What is the care recipient's association to and opinion of their caregivers? Are there any concerns for the caregivers' competence, ability, or availability?"
          />
        </div>

        <div className="mt-6">
          <h4 className="font-medium text-gray-700 mb-4">
            Identified Problems:
          </h4>
          <div className="space-y-4">
            <div className="p-4 border border-gray-200 rounded-lg">
              <h5 className="font-medium text-gray-700 mb-3">Problem 1</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <TextArea
                    label="Identified Problem"
                    register={register(
                      "careGiverSupport.detailedTable.identifiedProblem1.identifiedProblem"
                    )}
                    error={
                      errors.careGiverSupport?.detailedTable?.identifiedProblem1
                        ?.identifiedProblem?.message
                    }
                    rows={3}
                  />
                </div>
                <div>
                  <TextArea
                    label="Intervention / Action"
                    register={register(
                      "careGiverSupport.detailedTable.identifiedProblem1.interventionAction"
                    )}
                    error={
                      errors.careGiverSupport?.detailedTable?.identifiedProblem1
                        ?.interventionAction?.message
                    }
                    rows={3}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <TextArea
                    label="Goal"
                    register={register(
                      "careGiverSupport.detailedTable.identifiedProblem1.goal"
                    )}
                    error={
                      errors.careGiverSupport?.detailedTable?.identifiedProblem1
                        ?.goal?.message
                    }
                    rows={3}
                  />
                </div>
                <div>
                  <TextArea
                    label="Referral Options"
                    register={register(
                      "careGiverSupport.detailedTable.identifiedProblem1.referralOptions"
                    )}
                    error={
                      errors.careGiverSupport?.detailedTable?.identifiedProblem1
                        ?.referralOptions?.message
                    }
                    rows={3}
                  />
                </div>
              </div>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg">
              <h5 className="font-medium text-gray-700 mb-3">Problem 2</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <TextArea
                    label="Identified Problem"
                    register={register(
                      "careGiverSupport.detailedTable.identifiedProblem2.identifiedProblem"
                    )}
                    error={
                      errors.careGiverSupport?.detailedTable?.identifiedProblem2
                        ?.identifiedProblem?.message
                    }
                    rows={3}
                  />
                </div>
                <div>
                  <TextArea
                    label="Intervention / Action"
                    register={register(
                      "careGiverSupport.detailedTable.identifiedProblem2.interventionAction"
                    )}
                    error={
                      errors.careGiverSupport?.detailedTable?.identifiedProblem2
                        ?.interventionAction?.message
                    }
                    rows={3}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <TextArea
                    label="Goal"
                    register={register(
                      "careGiverSupport.detailedTable.identifiedProblem2.goal"
                    )}
                    error={
                      errors.careGiverSupport?.detailedTable?.identifiedProblem2
                        ?.goal?.message
                    }
                    rows={3}
                  />
                </div>
                <div>
                  <TextArea
                    label="Referral Options"
                    register={register(
                      "careGiverSupport.detailedTable.identifiedProblem2.referralOptions"
                    )}
                    error={
                      errors.careGiverSupport?.detailedTable?.identifiedProblem2
                        ?.referralOptions?.message
                    }
                    rows={3}
                  />
                </div>
              </div>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg">
              <h5 className="font-medium text-gray-700 mb-3">Problem 3</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <TextArea
                    label="Identified Problem"
                    register={register(
                      "careGiverSupport.detailedTable.identifiedProblem3.identifiedProblem"
                    )}
                    error={
                      errors.careGiverSupport?.detailedTable?.identifiedProblem3
                        ?.identifiedProblem?.message
                    }
                    rows={3}
                  />
                </div>
                <div>
                  <TextArea
                    label="Intervention / Action"
                    register={register(
                      "careGiverSupport.detailedTable.identifiedProblem3.interventionAction"
                    )}
                    error={
                      errors.careGiverSupport?.detailedTable?.identifiedProblem3
                        ?.interventionAction?.message
                    }
                    rows={3}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <TextArea
                    label="Goal"
                    register={register(
                      "careGiverSupport.detailedTable.identifiedProblem3.goal"
                    )}
                    error={
                      errors.careGiverSupport?.detailedTable?.identifiedProblem3
                        ?.goal?.message
                    }
                    rows={3}
                  />
                </div>
                <div>
                  <TextArea
                    label="Referral Options"
                    register={register(
                      "careGiverSupport.detailedTable.identifiedProblem3.referralOptions"
                    )}
                    error={
                      errors.careGiverSupport?.detailedTable?.identifiedProblem3
                        ?.referralOptions?.message
                    }
                    rows={3}
                  />
                </div>
              </div>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg">
              <h5 className="font-medium text-gray-700 mb-3">Problem 4</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <TextArea
                    label="Identified Problem"
                    register={register(
                      "careGiverSupport.detailedTable.identifiedProblem4.identifiedProblem"
                    )}
                    error={
                      errors.careGiverSupport?.detailedTable?.identifiedProblem4
                        ?.identifiedProblem?.message
                    }
                    rows={3}
                  />
                </div>
                <div>
                  <TextArea
                    label="Intervention / Action"
                    register={register(
                      "careGiverSupport.detailedTable.identifiedProblem4.interventionAction"
                    )}
                    error={
                      errors.careGiverSupport?.detailedTable?.identifiedProblem4
                        ?.interventionAction?.message
                    }
                    rows={3}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <TextArea
                    label="Goal"
                    register={register(
                      "careGiverSupport.detailedTable.identifiedProblem4.goal"
                    )}
                    error={
                      errors.careGiverSupport?.detailedTable?.identifiedProblem4
                        ?.goal?.message
                    }
                    rows={3}
                  />
                </div>
                <div>
                  <TextArea
                    label="Referral Options"
                    register={register(
                      "careGiverSupport.detailedTable.identifiedProblem4.referralOptions"
                    )}
                    error={
                      errors.careGiverSupport?.detailedTable?.identifiedProblem4
                        ?.referralOptions?.message
                    }
                    rows={3}
                  />
                </div>
              </div>
            </div>
          </div>
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
            type="submit"
            isLoading={postComprehensiveCarePlanMutation.isPending}
            disabled={postComprehensiveCarePlanMutation.isPending}
            className="sm:!w-fit w-full md:text-base text-sm"
          >
            Save Comprehensive Care Plan
          </PrimaryButton>
        </div>
      </div>
    </form>
  );
};
