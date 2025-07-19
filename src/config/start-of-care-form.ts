import type { ChecklistField } from "@agensy/types";

export const checklistSchema: ChecklistField[] = [
  {
    id: "0",
    type: "heading",
    label: "AGENSY INTAKE PAPERWORK",
    parentId: null,
    headingId: "0",
  },
  {
    id: "1",
    type: "group",
    label: "Service Agreement",
    parentId: null,
    headingId: "0",
  },
  {
    id: "2",
    type: "group",
    label: "Release of Information (ROI)",
    parentId: null,
    headingId: "0",
  },
  {
    id: "2.1",
    type: "checkbox",
    label: "Complete ROI for each new care recipient.",
    name: "complete-roi-for-each",
    parentId: "2",
    headingId: "0",
  },
  {
    id: "2.2",
    type: "checkbox",
    label:
      "Request care recipient sign a blank ROI so it can be used to request records from multiple providers.",
    parentId: "2",
    name: "request-care-recipient-sign-blank-roi",
    headingId: "0",
  },
  {
    id: "2.3",
    type: "checkbox",
    label: "ROI's expire after 1 year unless noted otherwise on form.",
    name: "roi-expire-after-1-year",
    parentId: "2",
    headingId: "0",
  },
  {
    id: "2.4",
    type: "checkbox",
    label:
      'Do not put "death" or "upon death" on expiration blank. This will keep you from being able to request records or do backend paperwork after death.',
    name: "do-not-put-death-upon-death-on-expiration-blank",
    parentId: "2",
    headingId: "0",
  },
  {
    id: "3",
    type: "group",
    label: "Care Recipient Questionnaire Completed",
    name: "care-recipient-questionnaire",
    parentId: null,
    headingId: "0",
  },
  {
    id: "4",
    type: "group",
    label: "Medication List",
    parentId: null,
    headingId: "0",
  },
  {
    id: "4.1",
    label: "A signed (by primary care physician) medication list preferred.",
    name: "a-signed-by-primary-care-physician-medication-list-preferred",
    parentId: "4",
    type: "checkbox",
    headingId: "0",
  },
  {
    id: "5",
    type: "heading",
    label: "MEDICATION LIST",
    parentId: null,
    headingId: "5",
  },
  {
    id: "6",
    type: "group",
    label: "Does it include supplements and vitamins.",
    parentId: null,
    headingId: "5",
  },
  {
    id: "7",
    type: "group",
    label: "Take a picture of the medication list the client uses",
    parentId: null,
    headingId: "5",
  },
  {
    id: "8",
    type: "group",
    label: "Take pictures of pill bottles with dosage and provider names.",
    parentId: null,
    headingId: "5",
  },
  {
    id: "9",
    type: "group",
    label:
      "Ask to see pill box, medication box, system being used to track medication administration.",
    parentId: null,
    headingId: "5",
  },
  {
    id: "10",
    type: "heading",
    label: "INSURANCE CARD",
    parentId: null,
    headingId: "10",
  },
  {
    id: "11",
    type: "group",
    label:
      "Take pictures *front and back* of the following: Medicare (red, white & blue) card, Supplemental insurance cards, Vision & Dental, Prescription cards, pacemaker card.",
    parentId: null,
    headingId: "10",
  },
  {
    id: "11",
    type: "heading",
    label: "ID OR DRIVER’S LICENSE",
    parentId: null,
    headingId: "11",
  },
  {
    id: "12",
    type: "group",
    label: "Take picture of ID card.",
    parentId: null,
    headingId: "11",
  },
  {
    id: "13",
    type: "group",
    label: "Make note of when license or ID card expires",
    parentId: null,
    headingId: "11",
  },
  {
    id: "14",
    type: "heading",
    label: "LEGAL PAPERWORK",
    parentId: null,
    headingId: "14",
  },
  {
    id: "15",
    type: "group",
    label: "Medical Power of Attorney (MPOA)",
    parentId: null,
    headingId: "14",
  },
  {
    id: "16",
    type: "group",
    label: "Statutory Durable Power of Attorney (POA, FPOA, DPOA)",
    parentId: null,
    headingId: "14",
  },
  {
    id: "17",
    type: "group",
    label: "Advanced Directives",
    parentId: null,
    headingId: "14",
  },
  {
    id: "17.1",
    type: "checkbox",
    label: "Declaration for Mental Health Treatment (DMHT)",
    parentId: "17",
    headingId: "14",
  },
  {
    id: "17.2",
    type: "checkbox",
    label: "Directive to Physicians and Family or Surrogates (Living Will)",
    parentId: "17",
    headingId: "14",
  },
  {
    id: "17.3",
    type: "checkbox",
    label: "Out-of-Hospital Do Not Resuscitate (OOH-DNR)",
    parentId: "17",
    headingId: "14",
  },
  {
    id: "17.4",
    type: "checkbox",
    label: "Declaration of Guardianship",
    parentId: "17",
    headingId: "14",
  },
  {
    id: "17.5",
    type: "checkbox",
    label: "Disposition of Remains",
    parentId: "17",
    headingId: "14",
  },
  {
    id: "18",
    type: "heading",
    label: "MEDICAL RECORD REQUEST",
    parentId: null,
    headingId: "18",
  },
  {
    id: "19",
    type: "group",
    label: "Review Release of Information to ensure completion.",
    parentId: null,
    headingId: "18",
  },
  {
    id: "20",
    type: "group",
    label:
      "Request last two visit notes; History and Physical (H&P); and Signed medication list.",
    parentId: null,
    headingId: "18",
  },
  {
    id: "21",
    type: "heading",
    label: "LONG TERM CARE INSURANCE",
    parentId: null,
    headingId: "21",
  },
  {
    id: "22",
    type: "group",
    label: "Request policy for review.",
    parentId: null,
    headingId: "21",
  },
  {
    id: "23",
    type: "group",
    label:
      "Call LTC Insurance company to request authorization to speak on client’s behalf / ask questions.",
    parentId: null,
    headingId: "21",
  },
  {
    id: "23.1",
    type: "checkbox",
    label:
      "They will likely send you an authorization form to have the care recipient sign.",
    parentId: "23",
    headingId: "21",
  },
  {
    id: "24",
    type: "group",
    label: "Does LTC policy have case management / care coordination benefits?",
    parentId: null,
    headingId: "21",
  },
  {
    id: "25",
    type: "heading",
    label: "CODE STATUS",
    parentId: null,
    headingId: "25",
  },
  {
    id: "26",
    type: "group",
    label: "Is client Full Code or Do Not Resuscitate",
    parentId: null,
    headingId: "25",
  },
  {
    id: "26.1",
    type: "checkbox",
    label: "Take picture or scan copy of Out of Hospital DNR",
    parentId: "26",
    headingId: "25",
  },
  {
    id: "26.2",
    type: "checkbox",
    label:
      "Confirm document is notarized / double signed, and signed off on by a physician.",
    parentId: "26",
    headingId: "25",
  },
  {
    id: "26.2.1",
    type: "group",
    label: "Helpful tip",
    parentId: "26.2",
    headingId: "25",
  },
  {
    id: "26.2.1.1",
    type: "radio",
    options: [
      "If the document is being notarized, you should count 6 signatures upon completion (2 of client, 2 of physician, and 2 of notary).",
      "If the document is being witnessed by two people, you should count 8 signatures upon completion (2 of client, 2 of each witness, and 2 of physician).",
    ],
    label: "",
    parentId: "26.2.1",
    headingId: "25",
  },
  // {
  //   id: "26.2.1.1.1",
  //   type: "radio",
  //   options: [
  //     "If the document is being notarized, you should count 6 signatures upon completion (2 of client, 2 of physician, and 2 of notary).",
  //   ],
  //   label: "",
  //   parentId: "26.2.1.1",
  //   parentOption:
  //     "If the document is being notarized, you should count 6 signatures upon completion (2 of client, 2 of physician, and 2 of notary).",
  //   headingId: "25",
  // }, // for nested radio options inside radios has to provide parentOption so we can know under which radio option this field belongs to
  {
    id: "26.3",
    type: "checkbox",
    label:
      "Provide education to care recipient on where to keep document in their home (refrigerator or to left of front door).",
    parentId: "26",
    headingId: "25",
  },
  {
    id: "27",
    type: "heading",
    label: "EMERGENCY AND FAMILY CONTACT INFORMATION",
    parentId: null,
    headingId: "27",
  },
  {
    id: "28",
    type: "group",
    label: "Who is primary point of contact?",
    parentId: null,
    headingId: "27",
  },
  {
    id: "29",
    type: "group",
    label: "Who should provider share updates and information with?",
    parentId: null,
    headingId: "27",
  },
  {
    id: "30",
    label: "Who should provider not share information with?",
    parentId: null,
    headingId: "27",
    type: "group",
  },
  {
    id: "31",
    label: "GET UPCOMING APPOINTMENTS",
    parentId: null,
    headingId: "31",
    type: "heading",
  },
  {
    id: "32",
    label: "Put upcoming appointments on shared calendar",
    type: "group",
    headingId: "31",
    parentId: null,
  },
  {
    id: "32.1",
    label:
      "Include the address of the appointment and the name of provider or practice",
    type: "checkbox",
    headingId: "31",
    parentId: "32",
  },
  {
    id: "33",
    label: "Arrange transportation for care recipient.",
    type: "group",
    headingId: "31",
    parentId: null,
  },
  {
    id: "34",
    label: "Confirm medical records have been sent to provider",
    type: "group",
    headingId: "31",
    parentId: null,
  },
  {
    id: "35",
    label: "Confirm medication list is accurate prior to appointment.",
    type: "group",
    headingId: "31",
    parentId: null,
  },
  {
    id: "36",
    label: "SEND RECAP EMAIL TO PRIMARY POINT OF CONTACT",
    type: "heading",
    headingId: "36",
    parentId: null,
  },
  {
    id: "37",
    label:
      "Include information covered in visit, upcoming appointments, identified concerns and intervention, referrals and resources, and next schedule appointment or visit.",
    type: "group",
    headingId: "36",
    parentId: null,
  },
  {
    id: "37.1",
    label: "Put on Calendar.",
    type: "checkbox",
    headingId: "36",
    parentId: "37",
  },
  {
    id: "37.2",
    label: "Schedule labs or imaging if needed.",
    type: "checkbox",
    headingId: "36",
    parentId: "37",
  },
  {
    id: "37.3",
    label: "Monitor for side effects if medication changes made.",
    type: "checkbox",
    headingId: "36",
    parentId: "37",
  },
];

export const generateChecklistDefaultValues = (): Record<
  string,
  boolean | null
> => {
  const defaultValues: Record<string, boolean | null> = {};

  checklistSchema.forEach((field) => {
    if (field.type === "checkbox") {
      defaultValues[field.id] = false;
    } else if (field.type === "radio") {
      defaultValues[field.id] = null;
    }
  });

  return defaultValues;
};
