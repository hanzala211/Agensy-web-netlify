import type { ChecklistField } from "@agensy/types";

export const nextStepAfterDeathSchema: ChecklistField[] = [
  {
    id: "0",
    type: "heading",
    label: "IMMEDIATE FIRST STEPS AT TIME OF DEATH",
    parentId: null,
    headingId: "0",
  },
  {
    id: "1",
    type: "group",
    label: "If client is on hospice",
    parentId: null,
    headingId: "0",
  },
  {
    id: "1.1",
    type: "checkbox",
    label: "Call hospice agency",
    name: "complete-roi-for-each",
    parentId: "1",
    headingId: "0",
  },
  {
    id: "1.2",
    type: "checkbox",
    label: "Notify family",
    name: "complete-roi-for-each",
    parentId: "1",
    headingId: "0",
  },
  {
    id: "1.3",
    type: "checkbox",
    label:
      "If appropriate, plan to meet family at home / community / hospital, etc.",
    name: "complete-roi-for-each",
    parentId: "1",
    headingId: "0",
  },
  {
    id: "1.4",
    type: "checkbox",
    label: "Ensure hospice has correct funeral home in client’s file.",
    name: "complete-roi-for-each",
    parentId: "1",
    headingId: "0",
  },
  {
    id: "2",
    type: "group",
    label: "If client is not on hospice and passes at home",
    parentId: null,
    headingId: "0",
  },
  {
    id: "2.1",
    type: "checkbox",
    label:
      "Call 911 - they will send out the Medical Examiner to confirm time of death, etc",
    parentId: "2",
    name: "request-care-recipient-sign-blank-roi",
    headingId: "0",
  },
  {
    id: "2.2",
    type: "checkbox",
    label:
      "Call preferred funeral home to arrange transport of body to funeral home.",
    name: "roi-expire-after-1-year",
    parentId: "2",
    headingId: "0",
  },
  {
    id: "2.3",
    type: "checkbox",
    label: "Notify family / emergency contact",
    name: "do-not-put-death-upon-death-on-expiration-blank",
    parentId: "2",
    headingId: "0",
  },
  {
    id: "3",
    type: "group",
    label:
      "If client does not have preferred funeral home: call the Travis County Medical Examiner to attend to the body.",
    name: "care-recipient-questionnaire",
    parentId: null,
    headingId: "0",
  },
  {
    id: "3.1",
    type: "link",
    label: "https://www.traviscountytx.gov/medical-examiner/faq",
    name: "care-recipient-questionnaire",
    parentId: "3",
    headingId: "0",
  },
  {
    id: "4",
    type: "heading",
    label: "DEATH CERTIFICATES/TIME OF DEATH",
    parentId: null,
    headingId: "4",
  },
  {
    id: "5",
    type: "group",
    label:
      "Order death certificates – ask for a minimum of 10. Several agencies often ask for an original, and a death certificate is needed to complete further steps.",
    parentId: null,
    headingId: "4",
  },
  {
    id: "5.1",
    label:
      "Note for SW: make a copy of the death certificate to have to reference",
    name: "a-signed-by-primary-care-physician-medication-list-preferred",
    parentId: "5",
    type: "checkbox",
    headingId: "4",
  },
  {
    id: "6",
    type: "group",
    label: "Make a note of time of death if possible.",
    parentId: null,
    headingId: "4",
  },
  {
    id: "7",
    type: "heading",
    label: "ENTITIES TO NOTIFY",
    parentId: null,
    headingId: "7",
  },
  {
    id: "8",
    type: "group",
    label:
      "Call Medicare and Social Security to confirm they were notified of the death",
    parentId: null,
    headingId: "7",
  },
  {
    id: "8.1",
    label:
      "The funeral home should notify social security of death, and then Medicare will nd out from social security, but still call to be safe",
    name: "a-signed-by-primary-care-physician-medication-list-preferred",
    parentId: "8",
    type: "checkbox",
    headingId: "7",
  },
  {
    id: "9",
    type: "group",
    label:
      "Notify MD offices so they do not call in the future with any appointment reminders or scheduling needs.",
    parentId: null,
    headingId: "7",
  },
  {
    id: "10",
    type: "group",
    label: "Notify pharmacy and cancel any auto-deliveries.",
    parentId: null,
    headingId: "7",
  },
  {
    id: "11",
    type: "group",
    label: "Notify caregiving agency to cancel shifts.",
    parentId: null,
    headingId: "7",
  },
  {
    id: "12",
    type: "group",
    label:
      "Give notice to client’s community and figure out how long family has financial occupancy of apartment for",
    parentId: null,
    headingId: "7",
  },
  {
    id: "12.1",
    type: "checkbox",
    label:
      "Make note of last day of financial occupancy (often 30 day notice is required).",
    parentId: "12",
    headingId: "7",
  },
  {
    id: "13",
    type: "heading",
    label:
      "Make note of last day of financial occupancy (often 30 day notice is required).",
    parentId: null,
    headingId: "13",
  },
  {
    id: "14",
    type: "heading",
    label: "FOR INSURANCE",
    parentId: null,
    headingId: "14",
  },
  {
    id: "15",
    type: "group",
    label:
      "Notify any life insurance companies of the death and begin a claim.",
    parentId: null,
    headingId: "14",
  },
  {
    id: "15.1",
    type: "checkbox",
    label:
      "Have on hand the deceased’s death certificate, SSN, and insurance policy",
    parentId: "15",
    headingId: "14",
  },
  {
    id: "15.2",
    type: "checkbox",
    label:
      "You can either use the portal to begin a claim or call the company directly.",
    parentId: "15",
    headingId: "14",
  },
  {
    id: "16",
    type: "group",
    label:
      "Call any other insurance (medical or otherwise) to notify of death.",
    parentId: null,
    headingId: "14",
  },
  {
    id: "16.1",
    type: "checkbox",
    label: "Ask how long any premiums will need to continue to be paid.",
    parentId: "16",
    headingId: "14",
  },
  {
    id: "16.2",
    type: "checkbox",
    label: "The VA may have burial benefits",
    parentId: "16",
    headingId: "14",
  },
  {
    id: "17",
    type: "heading",
    label: "IF DECEASED HAD A SPOUSE",
    parentId: null,
    headingId: "17",
  },
  {
    id: "18",
    type: "group",
    label: "If deceased had a spouse",
    parentId: null,
    headingId: "17",
  },
  {
    id: "18.1",
    type: "checkbox",
    label:
      "Call social security to begin the process of seeing if they qualify for survivorship benefits.",
    parentId: "18",
    headingId: "17",
  },
  {
    id: "18.2",
    type: "checkbox",
    label:
      "See if primary/supplemental insurance will keep them on deceased spouse’s plan (if they were using their spouse’s health insurance plan).",
    parentId: "18",
    headingId: "17",
  },
  {
    id: "18.3",
    type: "checkbox",
    label:
      "If the deceased had a pension, see whether there are any pension benefits.",
    parentId: "18",
    headingId: "17",
  },
  {
    id: "19",
    type: "heading",
    label: "SURVIVORSHIP BENEFITS PROCESS",
    parentId: null,
    headingId: "19",
  },
  {
    id: "20",
    type: "group",
    label:
      "Step 1: Call the national social security # (1-800-772-1213) and ask to begin a survivorship benefits application.",
    parentId: null,
    headingId: "19",
  },
  {
    id: "20.1",
    type: "checkbox",
    label:
      "Have a death certificate on hand, because they will ask for date of death, cause of death, SSN, and the deceased’s mother’s maiden name.",
    parentId: "20",
    headingId: "19",
  },
  {
    id: "20.2",
    type: "checkbox",
    label:
      "Also have the SSN and mother’s maiden name for the survivor on hand.",
    parentId: "20",
    headingId: "19",
  },
  {
    id: "20.1.1",
    type: "radio",
    label: "",
    options: ["The survivor must be with you at the time of the call."],
    parentId: "20.2",
    headingId: "19",
  },
  {
    id: "21",
    type: "group",
    label:
      "Step 2: After completing the application over the phone, you will be told that someone from the local office will call you in about 7 business days to schedule an appointment to finalize the application. They will not call. So you will need to call the national number to schedule an appointment. This may take several tries.",
    parentId: null,
    headingId: "19",
  },
  {
    id: "21.1",
    type: "checkbox",
    label: "For the scheduled phone appointment, you will need",
    parentId: "21",
    headingId: "19",
  },
  {
    id: "21.1.1",
    type: "radio",
    label: "",
    options: [
      "Original marriage certificate.",
      "Death certificate",
      "Bank account information (for direct deposit)",
    ],
    parentId: "21.1",
    headingId: "19",
  },
  {
    id: "21.1.1.1",
    type: "radio",
    label: "",
    options: ["Routing number", "Account number"],
    parentId: "21.1.1",
    headingId: "19",
    parentOption: "Bank account information (for direct deposit)",
  },
  {
    id: "22",
    type: "group",
    label:
      "Step 3: Have the scheduled phone call with the local office. They will reconfirm information and ask for the marriage date and bank information.",
    parentId: null,
    headingId: "19",
  },
  {
    id: "22.1",
    type: "checkbox",
    label: "Survivor must be with you at time of call.",
    parentId: "22",
    headingId: "19",
  },
  {
    id: "23",
    type: "group",
    label:
      "Step 4: To finish the process, they will ask that you either mail in the original marriage certificate or make an appointment at the local social security office to present an agent with the original marriage certificate.",
    parentId: null,
    headingId: "19",
  },
  {
    id: "23.1",
    type: "checkbox",
    label:
      "If you go in person, have both the SSN of the deceased and survivor on hand.",
    parentId: "23",
    headingId: "19",
  },
  {
    id: "23.2",
    type: "checkbox",
    label:
      "You do not need to have the survivor with you for an in-person appointment.",
    parentId: "23",
    headingId: "19",
  },
  {
    id: "24",
    type: "heading",
    label: "ADDITIONAL STEPS",
    parentId: null,
    headingId: "24",
  },
  {
    id: "25",
    type: "group",
    label: "Forward mail to a family member, friend, etc.",
    parentId: null,
    headingId: "24",
  },
  {
    id: "25.1",
    type: "link",
    label: "https://www.usps.com/manage/forward.htm",
    parentId: "25",
    headingId: "24",
  },
  {
    id: "26",
    type: "group",
    label: "Assist family in setting up services to pack up apartment.",
    parentId: null,
    headingId: "24",
  },
  {
    id: "27",
    type: "group",
    label:
      "Cancel any accounts / auto-deliveries / subscriptions you have access to or that family will give access to if they do not want to do it themselves.",
    parentId: null,
    headingId: "24",
  },
  {
    id: "27.1",
    type: "checkbox",
    label:
      "Examples include: newspaper, streaming services, subscriptions, food delivery, etc.",
    parentId: "27",
    headingId: "24",
  },
  {
    id: "28",
    type: "group",
    label:
      "Often families will place a freeze on their loved one’s credit – you can do this through mailing a copy of the death certificate to one credit bureau, they will notify the other two.",
    parentId: null,
    headingId: "24",
  },
  {
    id: "28.1",
    type: "link",
    label:
      "https://www.equifax.com/personal/help/relative-death-contact-credit-bureaus/",
    parentId: "28",
    headingId: "24",
  },
];

export const generateNextStepAfterDeathDefaultValues = (): Record<
  string,
  boolean | null
> => {
  const defaultValues: Record<string, boolean | null> = {};

  nextStepAfterDeathSchema.forEach((field) => {
    if (field.type === "checkbox") {
      defaultValues[field.id] = false;
    } else if (field.type === "radio") {
      defaultValues[field.id] = null;
    }
  });

  return defaultValues;
};
