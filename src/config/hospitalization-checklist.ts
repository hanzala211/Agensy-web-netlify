import type { ChecklistField } from "@agensy/types";

export const hospitalizationChecklistSchema: ChecklistField[] = [
  {
    id: "0",
    type: "heading",
    label: "IN TRANSIT TO HOSPITAL",
    parentId: null,
    headingId: "0",
  },
  {
    id: "1",
    type: "group",
    label: "Confirm that EMS is going to the correct hospital.",
    parentId: null,
    headingId: "0",
  },
  {
    id: "1.1",
    type: "checkbox",
    label: "Confirm the address or branch of the hospital.",
    parentId: "1",
    headingId: "0",
  },
  {
    id: "2",
    type: "group",
    label: "Remember your Agensy log in information.",
    parentId: null,
    headingId: "0",
  },
  {
    id: "2.1",
    type: "checkbox",
    label:
      "This will allow you to access your Face Sheet, Health History, and Advance Directive Documents",
    parentId: "2",
    headingId: "0",
  },
  {
    id: "3",
    type: "group",
    label: "Know your code status.",
    parentId: null,
    headingId: "0",
  },
  {
    id: "3.1",
    type: "checkbox",
    label:
      "Notify emergency personnel if your loved one has executed a Do Not Resuscitate document.",
    parentId: "3",
    headingId: "0",
  },
  {
    id: "4",
    type: "heading",
    label: "ADMISSION",
    parentId: null,
    headingId: "4",
  },
  {
    id: "5",
    type: "group",
    label: "Confirm hospital location and contact information.",
    parentId: null,
    headingId: "4",
  },
  {
    id: "6",
    type: "group",
    label:
      "Notify staff if your loved one has dementia or a cognitive impairment that will impact their care.",
    parentId: null,
    headingId: "4",
  },
  {
    id: "6.1",
    type: "checkbox",
    label:
      "If needed, go to the hospital or have a family / friend / or caregiver help.",
    parentId: "6",
    headingId: "4",
  },
  {
    id: "7",
    type: "group",
    label: "Notify emergency contact / family of hospitalization.",
    parentId: null,
    headingId: "4",
  },
  {
    id: "8",
    type: "group",
    label: "Confirm hospital has client’s code status.",
    parentId: null,
    headingId: "4",
  },
  {
    id: "8.1",
    type: "checkbox",
    label:
      "If transferred from a facility, was a copy of the DNR sent with the client?",
    parentId: "8",
    headingId: "4",
  },
  {
    id: "8.2",
    type: "checkbox",
    label: "If transferred from home, provide the hospital with an OOH DNR.",
    parentId: "8",
    headingId: "4",
  },
  {
    id: "9",
    type: "group",
    label: "Confirm hospital has Medical Power of Attorney (MPOA) paperwork.",
    parentId: null,
    headingId: "4",
  },
  {
    id: "9.1",
    type: "checkbox",
    label: "Ensure MPOA document is current / correct.",
    parentId: "9",
    headingId: "4",
  },
  {
    id: "10",
    type: "group",
    label: "Locate cell phone, wallet or purse and make sure they are secure.",
    parentId: null,
    headingId: "4",
  },
  {
    id: "11",
    type: "group",
    label: "Fax or hand deliver signed copy of the HIPPA release document.",
    parentId: null,
    headingId: "4",
  },
  {
    id: "12",
    type: "group",
    label: "Update private duty caregiving Agensy of hospitalization.",
    parentId: null,
    headingId: "4",
  },
  {
    id: "12.1",
    type: "checkbox",
    label:
      "If the client needs caregivers, provide the Agensy with the name, address and room number.",
    parentId: "12",
    headingId: "4",
  },
  {
    id: "12.2",
    type: "checkbox",
    label:
      "If client does not need caregivers while in the hospital, call Agensy to cancel shifts and discuss discharge planning.",
    parentId: "12",
    headingId: "4",
  },
  {
    id: "13",
    type: "group",
    label: "Medication List.",
    parentId: null,
    headingId: "4",
  },
  {
    id: "13.1",
    type: "checkbox",
    label: "Confirm hospital received current medication list.",
    parentId: "13",
    headingId: "4",
  },
  {
    id: "13.2",
    type: "checkbox",
    label:
      "Review medication list for any “red flag” or “frequently missed” medications.",
    parentId: "13",
    headingId: "4",
  },
  {
    id: "13.2.1",
    type: "radio",
    label: "",
    options: [
      "Parkinson’s medications.",
      "Psychiatric or mood stabilizing medication.",
      "Antibiotics, PRN meds, or new meds that may not have made it onto formal medication list.",
    ],
    parentId: "13.2",
    headingId: "4",
  },
  {
    id: "13.3",
    type: "checkbox",
    label:
      "Request medication list if admitted into the hospital to ensure all medications are being administered.",
    parentId: "13",
    headingId: "4",
  },
  {
    id: "13.4",
    type: "checkbox",
    label:
      "Request and reconcile med list each time the patient switches between floors / departments (ER, ICU, Med / Surg).",
    parentId: "13",
    headingId: "4",
  },
  {
    id: "14",
    type: "group",
    label: "Write your name and phone number on the hospital whiteboard.",
    parentId: null,
    headingId: "4",
  },
  {
    id: "15",
    type: "group",
    label: "Cancel or reschedule any appointments (medical or otherwise).",
    parentId: null,
    headingId: "4",
  },
  {
    id: "15.1",
    type: "checkbox",
    label: "Make note of appointments that need to be rescheduled.",
    parentId: "15",
    headingId: "4",
  },
  {
    id: "15.2",
    type: "checkbox",
    label: "Cancel transportation ASAP to avoid cancellation fee.",
    parentId: "15",
    headingId: "4",
  },
  {
    id: "15.3",
    type: "checkbox",
    label: "Notify home health that client is at hospital.",
    parentId: "15",
    headingId: "4",
  },
  {
    id: "16",
    type: "group",
    label: "Introduce yourself to hospital case manager or social worker.",
    parentId: null,
    headingId: "4",
  },
  {
    id: "17",
    type: "group",
    label: "Ensure pets are taken care of.",
    parentId: null,
    headingId: "4",
  },
  {
    id: "18",
    type: "group",
    label:
      "Ensure any family members (spouse or children) that client is responsible for are taken care of.",
    parentId: null,
    headingId: "4",
  },
  {
    id: "18.1",
    type: "checkbox",
    label: "Schedule caregivers or check in visits if needed.",
    parentId: "18",
    headingId: "4",
  },
  {
    id: "19",
    type: "heading",
    label: "DURING HOSPITALIZATION",
    parentId: null,
    headingId: "19",
  },
  {
    id: "20",
    type: "group",
    label: "Request assessment by therapy if appropriate.",
    parentId: null,
    headingId: "19",
  },
  {
    id: "20.1",
    type: "radio",
    options: [
      "Often patients are left in bed if no one is advocating for them to walk / transfer in and out of bed to chair, etc. Clients experience greater physical decline if left in bed.",
    ],
    label: "",
    parentId: "20",
    headingId: "19",
  },

  {
    id: "20.2",
    type: "checkbox",
    label: "Physical therapy, Occupational therapy, Speech therapy.",
    parentId: "20",
    headingId: "19",
  },
  {
    id: "20.3",
    type: "checkbox",
    label:
      "Ensure staff is helping client transfer into chair, or walk halls if appropriate.",
    parentId: "20",
    headingId: "19",
  },
  {
    id: "20.4",
    type: "checkbox",
    label: "Request updates from therapies to help guide discharge planning.",
    parentId: "20",
    headingId: "19",
  },
  {
    id: "20.4.1",
    type: "radio",
    options: [
      "Is patient able to walk and transfer without assistance.",
      "If assistance is needed at home, consider using caregivers, home health and family support.",
    ],
    label: "",
    parentId: "20.4",
    headingId: "19",
  },
  {
    id: "21",
    type: "group",
    label:
      "Keep in daily contact with case management to discuss discharge planning.",
    parentId: null,
    headingId: "19",
  },
  {
    id: "21.1",
    type: "checkbox",
    label:
      "Will discharge be to home, skilled nursing, rehab, assisted living or memory care.",
    parentId: "21",
    headingId: "19",
  },
  {
    id: "21.2",
    type: "checkbox",
    label: "Is there a need for 1:1 caregivers for the first few days.",
    parentId: "21",
    headingId: "19",
  },
  {
    id: "22",
    type: "group",
    label:
      "Monitor for hospital acquired delirium or changes in mental status.",
    parentId: null,
    headingId: "19",
  },
  {
    id: "22.1",
    type: "checkbox",
    label: "Alert staff to any changes.",
    parentId: "22",
    headingId: "19",
  },
  {
    id: "22.2",
    type: "checkbox",
    label: "Review medications - have any medications been stopped / started?",
    parentId: "22",
    headingId: "19",
  },
  {
    id: "22.3",
    type: "checkbox",
    label: "Schedule sitter or caregiver if needed.",
    parentId: "22",
    headingId: "19",
  },
  {
    id: "23",
    type: "group",
    label: "Meet with case management and nursing staff at each visit.",
    parentId: null,
    headingId: "19",
  },
  {
    id: "23.1",
    type: "checkbox",
    label: "Request updates on discharge planning.",
    parentId: "23",
    headingId: "19",
  },
  {
    id: "23.1.1",
    type: "radio",
    options: [
      "When will patient discharge.",
      "Will they discharge home, to rehab, or to skilled nursing (SNF).",
      "Will they need durable medical equipment (DME) when they discharge",
      "Will they discharge with home health.",
    ],
    label: "",
    parentId: "23.1",
    headingId: "19",
  },
  {
    id: "23.1.1.1",
    type: "radio",
    options: ["Advocate for no Friday / weekend discharges."],
    label: "",
    parentId: "23.1.1",
    headingId: "19",
    parentOption: "When will patient discharge.",
  },
  {
    id: "23.1.1.2",
    type: "radio",
    options: ["Write down where the referral is being sent."],
    label: "",
    parentId: "23.1.1",
    headingId: "19",
    parentOption: "Will they discharge with home health.",
  },
  {
    id: "23.2",
    type: "checkbox",
    label:
      "The hospital case manager will assist with discharge to an in-network rehab or skilled nursing facility, coordinating transportation, referrals to home health or hospice.",
    parentId: "23",
    headingId: "19",
  },
  {
    id: "23.2.1",
    type: "checkbox",
    label:
      "Staff changes frequently through the week, so do not assume you will have the same case manager during the entire hospital stay.",
    parentId: "23.2",
    headingId: "19",
  },
  {
    id: "24",
    type: "group",
    label: "Safety planning.",
    parentId: null,
    headingId: "19",
  },
  {
    id: "24.1",
    type: "checkbox",
    label:
      "Does client need to discharge to a higher level of care - Assisted Living, Memory Care, etc.",
    parentId: "24",
    headingId: "19",
  },
  {
    id: "24.2",
    type: "checkbox",
    label:
      "If discharging to a senior living community (a new move) - start working on admission paperwork immediately",
    parentId: "24",
    headingId: "19",
  },
  {
    id: "24.2.1",
    type: "radio",
    label: "",
    options: [
      "Request chest x-ray or TB skin test.",
      "Request medication list signed off on by provider.",
    ],
    parentId: "24.2",
    headingId: "19",
  },
  {
    id: "24.3",
    type: "checkbox",
    label:
      "Request input from medical staff and therapies on appropriate level of care.",
    parentId: "24",
    headingId: "19",
  },
  {
    id: "25",
    type: "group",
    label:
      "If client lives in a senior living community communicate all changes back to staff.",
    parentId: null,
    headingId: "19",
  },
  {
    id: "25.1",
    type: "checkbox",
    label: "Anticipated discharge date.",
    parentId: "25",
    headingId: "19",
  },
  {
    id: "25.2",
    type: "checkbox",
    label: "Changes in condition.",
    parentId: "25",
    headingId: "19",
  },
  {
    id: "25.3",
    type: "checkbox",
    label: "Any extra services that are needed.",
    parentId: "25",
    headingId: "19",
  },
  {
    id: "26",
    type: "group",
    label: "Coordinate caregivers.",
    parentId: null,
    headingId: "19",
  },
  {
    id: "26.1",
    type: "checkbox",
    label: "Will client need caregivers when they return home.",
    parentId: "26",
    headingId: "19",
  },
  {
    id: "26.2",
    type: "checkbox",
    label: "Notify caregiving Agensy of discharge date.",
    parentId: "26",
    headingId: "19",
  },
  {
    id: "26.3",
    type: "checkbox",
    label: "Determine if increased care is needed.",
    parentId: "26",
    headingId: "19",
  },
  {
    id: "26.3.1",
    type: "radio",
    options: [
      "Medical staff (MD, PT, OT, Nursing) can weigh in on recommended level of care.",
      "24/7 for first 48 hours.",
    ],
    label: "",
    parentId: "26.3",
    headingId: "19",
  },
  {
    id: "27",
    type: "group",
    label: "Order groceries / food for home, clean out fridge of expired food.",
    parentId: null,
    headingId: "19",
  },
  {
    id: "28",
    type: "heading",
    label: "DISCHARGE",
    parentId: null,
    headingId: "28",
  },
  {
    id: "29",
    type: "group",
    label: "Coordinate transportation home with hospital case manager.",
    parentId: null,
    headingId: "28",
  },
  {
    id: "29.1",
    type: "checkbox",
    label:
      "Who will provide transportation - caregiver, family, wheelchair van or private ambulance.",
    parentId: "29",
    headingId: "28",
  },
  {
    id: "30",
    type: "group",
    label:
      "Notify family, senior living community and caregivers / caregiving Agensy of anticipated discharge time and date.",
    parentId: null,
    headingId: "28",
  },
  {
    id: "30.1",
    type: "checkbox",
    label: "If possible, coordinate “tuck in” visit.",
    parentId: "30",
    headingId: "28",
  },
  {
    id: "30.1.1",
    type: "radio",
    options: [
      "Make sure client is comfortable at home when they return.",
      "Make sure they are able to get to / from dining room or have meals delivered to their room.",
      "Confirm any new medications are picked up and ready for administration.",
    ],
    label: "",
    parentId: "30.1",
    headingId: "28",
  },
  {
    id: "31",
    type: "group",
    label:
      "Coordinate pick up or delivery of any prescriptions or over the counter medications prescribed.",
    parentId: null,
    headingId: "28",
  },
  {
    id: "31.1",
    type: "checkbox",
    label: "Make note of 24 hour pharmacies in the area.",
    parentId: "31",
    headingId: "28",
  },
  {
    id: "31.2",
    type: "checkbox",
    label:
      "Make note of “often missed” medications - pain medication, PRN medication, antibiotics, psychiatric and mood stabilizing medications.",
    parentId: "31",
    headingId: "28",
  },
  {
    id: "32",
    type: "group",
    label: "Review hospital discharge packet.",
    parentId: null,
    headingId: "28",
  },
  {
    id: "32.1",
    type: "checkbox",
    label: "Look for referrals to specialty providers.",
    parentId: "32",
    headingId: "28",
  },
  {
    id: "32.1.1",
    type: "radio",
    options: ["Coordinate all post-hospitalization follow up."],
    label: "",
    parentId: "32.1",
    headingId: "28",
  },
  {
    id: "32.2",
    type: "checkbox",
    label:
      "Scan and email discharge instructions to senior living community if needed",
    parentId: "32",
    headingId: "28",
  },
  {
    id: "32.3",
    type: "checkbox",
    label:
      "Scan copy of discharge instructions into Agensy online health portal",
    parentId: "32",
    headingId: "28",
  },

  {
    id: "33",
    type: "group",
    label:
      "Reconcile discharge medication list against admission medication list.",
    parentId: null,
    headingId: "28",
  },
  {
    id: "33.1",
    type: "checkbox",
    label:
      "Ensure medication changes are relayed to medication management team.",
    parentId: "33",
    headingId: "28",
  },
  {
    id: "33.2",
    type: "checkbox",
    label:
      "Send copy of new medication list to primary care and specialty care providers.",
    parentId: "33",
    headingId: "28",
  },
  {
    id: "34",
    type: "group",
    label:
      "Make sure cell phone, wallet, purse and any personal items are removed from hospital room.",
    parentId: null,
    headingId: "28",
  },
  {
    id: "35",
    type: "heading",
    label: "POST HOSPITALIZATION",
    parentId: null,
    headingId: "35",
  },
  {
    id: "36",
    type: "group",
    label: "Schedule follow up with primary care within 2 weeks of discharge.",
    parentId: null,
    headingId: "35",
  },
  {
    id: "36.1",
    type: "checkbox",
    label: "Schedule transportation.",
    parentId: "36",
    headingId: "35",
  },
  {
    id: "36.2",
    type: "checkbox",
    label: "Provide PCP with new medication list.",
    parentId: "36",
    headingId: "35",
  },
  {
    id: "36.3",
    type: "checkbox",
    label: "Update provider on new diagnoses or surgeries.",
    parentId: "36",
    headingId: "35",
  },
  {
    id: "37",
    type: "group",
    label: "Schedule specialty provider appointments.",
    parentId: null,
    headingId: "35",
  },
  {
    id: "37.1",
    type: "checkbox",
    label: "Schedule transportation.",
    parentId: "37",
    headingId: "35",
  },
  {
    id: "37.2",
    type: "checkbox",
    label: "Provide specialty providers with new medication list.",
    parentId: "37",
    headingId: "35",
  },
  {
    id: "37.3",
    type: "checkbox",
    label: "Update provider on new diagnoses or surgeries.",
    parentId: "37",
    headingId: "35",
  },
  {
    id: "38",
    type: "group",
    label:
      "Confirm any medications prescribed in the hospital have made it onto the client’s medication list and are being administered as directed.",
    parentId: null,
    headingId: "35",
  },
  {
    id: "38.1",
    type: "checkbox",
    label: "Make note of “start and stop” date for new medications.",
    parentId: "38",
    headingId: "35",
  },
  {
    id: "39",
    type: "group",
    label:
      "Confirm home health started and document how often they will visit client.",
    parentId: null,
    headingId: "35",
  },
  {
    id: "39.1",
    type: "checkbox",
    label:
      "Call home health provider and request updates from visiting providers and when they will discharge client from services.",
    parentId: "39",
    headingId: "35",
  },
  {
    id: "39.2",
    type: "checkbox",
    label:
      "Make a note of which home health provider is seeing client in Agensy Health History form.",
    parentId: "39",
    headingId: "35",
  },
  {
    id: "40",
    type: "group",
    label: "Assess need for continued caregiver services.",
    parentId: null,
    headingId: "35",
  },
  {
    id: "40.1",
    type: "checkbox",
    label: "Does care need to be reduced.",
    parentId: "40",
    headingId: "35",
  },
  {
    id: "40.2",
    type: "checkbox",
    label: "Review feedback from caregivers.",
    parentId: "40",
    headingId: "35",
  },
  {
    id: "40.3",
    type: "checkbox",
    label:
      "Leave caregiver journal or notebook to review notes from all caregivers involved, including overnight staff.",
    parentId: "40",
    headingId: "35",
  },
  {
    id: "41",
    type: "group",
    label: "Update medical records.",
    parentId: null,
    headingId: "35",
  },
  {
    id: "41.1",
    type: "checkbox",
    label:
      "Update Agensy Health History form with information from hospitalization.",
    parentId: "39",
    headingId: "35",
  },
  {
    id: "41.2",
    type: "checkbox",
    label:
      "Upload copy of hospital records and discharge paperwork into Agensy online portal.",
    parentId: "39",
    headingId: "35",
  },
];

export const generateHospitalizationChecklistDefaultValues = (): Record<
  string,
  boolean | null
> => {
  const defaultValues: Record<string, boolean | null> = {};

  hospitalizationChecklistSchema.forEach((field) => {
    if (field.type === "checkbox") {
      defaultValues[field.id] = false;
    } else if (field.type === "radio") {
      defaultValues[field.id] = null;
    }
  });

  return defaultValues;
};
