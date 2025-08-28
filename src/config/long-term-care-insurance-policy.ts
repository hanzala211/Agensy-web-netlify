import type { ChecklistField } from "@agensy/types";

export const longTermCareInsurancePolicySchema: ChecklistField[] = [
  {
    id: "0",
    type: "heading",
    label: "Understanding Your Policy",
    parentId: null,
    headingId: "0",
  },
  {
    id: "1",
    type: "checkbox",
    label: "I have a copy of the full policy (not just the summary).",
    parentId: null,
    headingId: "0",
  },
  {
    id: "2",
    type: "checkbox",
    label: "I know the name of the insurance company and how to contact them.",
    parentId: null,
    headingId: "0",
  },
  {
    id: "2.1",
    type: "group",
    label:
      "Over time, companies may change ownership / their name. Keep a record of the company name and current contact information, as well as a record of the name of the company you originally purchased the policy from.",
    parentId: "2",
    headingId: "0",
  },
  {
    id: "3",
    type: "checkbox",
    label: "I know the policy number.",
    parentId: null,
    headingId: "0",
  },
  {
    id: "4",
    type: "checkbox",
    label:
      "I know the date the policy was issued and whether it is still active.",
    parentId: null,
    headingId: "0",
  },
  {
    id: "5",
    type: "checkbox",
    label:
      "I understand whether my policy is tax-qualified (can affect how benefits are taxed).",
    parentId: null,
    headingId: "0",
  },
  {
    id: "6",
    type: "checkbox",
    label:
      "I know whether my policy is reimbursement-based (pays me back) or indemnity-based (pays a set amount).",
    parentId: null,
    headingId: "0",
  },
  {
    id: "7",
    type: "checkbox",
    label:
      "I have identified a family member or advocate who understands my policy and can help manage claims.",
    parentId: null,
    headingId: "0",
  },
  {
    id: "7.1",
    type: "group",
    label:
      "The forms that allow my Power of Attorney or legal representative to speak to the company are on file and up to date",
    parentId: "7",
    headingId: "0",
  },
  {
    id: "8",
    type: "heading",
    label: "Benefit Amounts & Coverage",
    parentId: null,
    headingId: "8",
  },
  {
    id: "9",
    type: "checkbox",
    label: "I know the daily or monthly benefit limit",
    parentId: null,
    headingId: "8",
  },
  {
    id: "10",
    type: "checkbox",
    label: "I know the maximum lifetime benefit",
    parentId: null,
    headingId: "8",
  },
  {
    id: "11",
    type: "checkbox",
    label: "I understand the types of services covered, including:",
    parentId: null,
    headingId: "8",
  },
  {
    id: "11.1",
    type: "group",
    label: "Home care",
    parentId: "11",
    headingId: "8",
  },
  {
    id: "11.2",
    type: "group",
    label: "Assisted living",
    parentId: "11",
    headingId: "8",
  },
  {
    id: "11.3",
    type: "group",
    label: "Nursing home care",
    parentId: "11",
    headingId: "8",
  },
  {
    id: "11.4",
    type: "group",
    label: "Adult day care",
    parentId: "11",
    headingId: "8",
  },
  {
    id: "11.8",
    type: "group",
    label: "Adult day care",
    parentId: "11",
    headingId: "8",
  },
  {
    id: "11.5",
    type: "group",
    label: "Care coordination services",
    parentId: "11",
    headingId: "8",
  },
  {
    id: "11.6",
    type: "group",
    label: "Hospice care",
    parentId: "11",
    headingId: "8",
  },
  {
    id: "11.7",
    type: "group",
    label: "Respite care for family caregivers",
    parentId: "11",
    headingId: "8",
  },
  {
    id: "12",
    type: "checkbox",
    label: "In home safety assessments and home modifications",
    parentId: null,
    headingId: "8",
  },
  {
    id: "13",
    type: "checkbox",
    label:
      "I know if my policy covers informal caregivers (like family or friends) or only professional/licensed caregivers.",
    parentId: null,
    headingId: "8",
  },
  {
    id: "14",
    type: "checkbox",
    label: "I understand what is not covered (exclusions or limitations).",
    parentId: null,
    headingId: "8",
  },
  {
    id: "15",
    type: "heading",
    label: "When & How to Use Benefits",
    parentId: null,
    headingId: "15",
  },
  {
    id: "16",
    type: "checkbox",
    label:
      "I know the 'benefit trigger'—what must happen before I can receive benefits",
    parentId: null,
    headingId: "15",
  },
  {
    id: "17",
    type: "checkbox",
    label:
      "Most policies require that you need assistance with two or more Activities of Daily Living (ADL's) and / or a diagnosis of cognitive impairment. Please group, Activities of Daily Living (ADL's) are different from Instrumental Activities of Daily Living (IADL's).",
    parentId: null,
    headingId: "15",
  },
  {
    id: "18",
    type: "checkbox",
    label: "I know the elimination period.",
    parentId: null,
    headingId: "15",
  },
  {
    id: "19",
    type: "group",
    label:
      "An elimination period is how long you have to pay for services out of pocket before benefits begin. Elimination periods can vary in length of time, so review your policy to understand yours. Speak to your care coordinator or representative to see what qualifies toward your elimination period.",
    parentId: null,
    headingId: "15",
  },
  {
    id: "20",
    type: "checkbox",
    label: "I know how to file a claim and what documentation is required.",
    parentId: null,
    headingId: "15",
  },
  {
    id: "21",
    type: "checkbox",
    label:
      "What information does my Primary Care Physician need to provide so I can file a claim?",
    parentId: null,
    headingId: "15",
  },
  {
    id: "22",
    type: "group",
    label:
      "Many policies require an annual update to your medical paperwork to ensure you still meet qualifications. Check to see if your doctor, assisted living facility, or a care manager can complete this paperwork. Make sure your Power of Attorney, or a trusted family member, is aware of this annual requirement.",
    parentId: null,
    headingId: "15",
  },
  {
    id: "23",
    type: "checkbox",
    label:
      "My physician may not be familiar with long-term care insurance, or the requirements to file a claim. I have a short paragraph explaining the policy, my benefits, and the requirements of the insurance company.",
    parentId: null,
    headingId: "15",
  },
  {
    id: "24",
    type: "checkbox",
    label:
      "I have a care plan or care assessment ready, or I know how to get one.",
    parentId: null,
    headingId: "15",
  },
  {
    id: "25",
    type: "checkbox",
    label:
      "I understand the role of the insurance company's care manager or nurse evaluator.",
    parentId: null,
    headingId: "15",
  },
  {
    id: "26",
    type: "group",
    label:
      "Most long-term care insurance companies have care managers or nurse evaluators who can help you file a claim and understand your benefits. They can also help connect you to local resources, like in home care companies, or home health agencies.",
    parentId: null,
    headingId: "15",
  },
  {
    id: "27",
    type: "heading",
    label: "Policy Features & Options",
    parentId: null,
    headingId: "27",
  },
  {
    id: "28",
    type: "checkbox",
    label: "I know if my policy includes inflation protection",
    parentId: null,
    headingId: "27",
  },
  {
    id: "29",
    type: "checkbox",
    label: "I know whether there is a waiver of premium",
    parentId: null,
    headingId: "27",
  },
  {
    id: "29.1",
    type: "group",
    label:
      "Many policies waive your monthly premium payment when a claim is filed and approved.",
    parentId: "29",
    headingId: "27",
  },
  {
    id: "30",
    type: "checkbox",
    label: "I know if there are shared benefits for spouses or partners",
    parentId: null,
    headingId: "27",
  },
  {
    id: "31",
    type: "checkbox",
    label:
      "I know if I have any riders or optional features added to my policy.",
    parentId: null,
    headingId: "27",
  },
  {
    id: "32",
    type: "heading",
    label: "Maintaining My Policy",
    parentId: null,
    headingId: "32",
  },
  {
    id: "33",
    type: "checkbox",
    label: "I know how much the premium is and how often it is due.",
    parentId: null,
    headingId: "32",
  },
  {
    id: "34",
    type: "checkbox",
    label: "I know what happens if I miss a payment.",
    parentId: null,
    headingId: "32",
  },
  {
    id: "35",
    type: "checkbox",
    label: "I know if my policy has a non-forfeiture benefit",
    parentId: null,
    headingId: "32",
  },
  {
    id: "35.1",
    type: "group",
    label: "If you stop paying your premium, do you receive any benefit?",
    parentId: "35",
    headingId: "32",
  },
  {
    id: "36",
    type: "checkbox",
    label: "I have set up auto-pay or reminders for premiums.",
    parentId: null,
    headingId: "32",
  },
  {
    id: "36.1",
    type: "group",
    label:
      "My Durable Power of Attorney (power of attorney for finances) is aware of this policy and how my monthly premiums are paid.",
    parentId: "36",
    headingId: "32",
  },
  {
    id: "37",
    type: "checkbox",
    label:
      "I've told a trusted person where to find the policy and this checklist.",
    parentId: null,
    headingId: "32",
  },
  {
    id: "37.1",
    type: "group",
    label:
      "This person understands how I plan to incorporate these benefits into my long-term care plan.",
    parentId: "37",
    headingId: "32",
  },
  {
    id: "38",
    type: "heading",
    label: "Pro Tip: Keep a 'Claims File'",
    parentId: null,
    headingId: "38",
  },
  {
    id: "39",
    type: "group",
    label: "Include:",
    parentId: null,
    headingId: "38",
  },
  {
    id: "39.1",
    type: "checkbox",
    label: "A copy of your LTCI policy",
    parentId: "39",
    headingId: "38",
  },
  {
    id: "39.2",
    type: "checkbox",
    label: "This checklist",
    parentId: "39",
    headingId: "38",
  },
  {
    id: "39.3",
    type: "checkbox",
    label: "Contact information for the insurer",
    parentId: "39",
    headingId: "38",
  },
  {
    id: "39.4",
    type: "checkbox",
    label:
      "Phone Number, Name of the Company, Address, Any previous company names and the date of the name change",
    parentId: "39",
    headingId: "38",
  },
  {
    id: "39.5",
    type: "checkbox",
    label: "Copies of care plans and the evaluation from my medical provider",
    parentId: "39",
    headingId: "38",
  },
  {
    id: "39.6",
    type: "checkbox",
    label: "Copies from any communication with the insurance company",
    parentId: "39",
    headingId: "38",
  },
  {
    id: "39.7",
    type: "checkbox",
    label: "Records of services provided and receipts",
    parentId: "39",
    headingId: "38",
  },
];

export const generateLongTermCareInsurancePolicyDefaultValues = (): Record<
  string,
  boolean | null
> => {
  const defaultValues: Record<string, boolean | null> = {};

  longTermCareInsurancePolicySchema.forEach((field) => {
    if (field.type === "checkbox") {
      defaultValues[field.id] = false;
    } else if (field.type === "radio") {
      defaultValues[field.id] = null;
    }
  });

  return defaultValues;
};
