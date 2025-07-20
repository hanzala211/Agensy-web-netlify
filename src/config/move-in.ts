import type { ChecklistField } from "@agensy/types";

export const moveInSchema: ChecklistField[] = [
  {
    id: "0",
    type: "heading",
    label: "PRIOR TO MOVE",
    parentId: null,
    headingId: "0",
  },
  {
    id: "1",
    type: "group",
    label:
      "Required paperwork varies between communities, but you should expect to complete the following: (this is often a lengthy process that requires review and signature from multiple providers, give yourself one to two weeks to complete)",
    parentId: null,
    headingId: "0",
  },
  {
    id: "1.1",
    type: "checkbox",
    label:
      "Admission paperwork for community (demographic information, insurance information, likes / dislikes, health history, financial information)",

    parentId: "1",
    headingId: "0",
  },
  {
    id: "1.2",
    type: "checkbox",
    label:
      "Financial Occupancy - the date the resident starts paying for the apartment / services",
    parentId: "1",
    headingId: "0",
  },
  {
    id: "1.3",
    type: "checkbox",
    label: "Provider Plan of Care",
    parentId: "1",
    headingId: "0",
  },
  {
    id: "1.3.1",
    type: "radio",
    label: "",
    options: [
      "Needs to be completed by client’s current primary care physician",
      "Client needs to have seen their primary care physician within the last six months",
      "Vaccination records / Is client allowed to have flu vaccine",
      "Medication list",
      "Preferred Hospital",
      "Preferred pharmacy, or complete delivery pharmacy paperwork",
      "Ask community if they have preferred providers (visiting Primary Care, visiting geriatric psychiatry, podiatry, dentist, home health, hospice) - when appropriate, use preferred provider and add them to your list of current medical providers",
      "Dietary restrictions and food allergies",
      "Tuberculosis test",
    ],
    parentId: "1.3",
    headingId: "0",
  },
  {
    id: "1.3.1.1",
    type: "radio",
    label: "",
    options: [
      "If your loved one refuses to see their doctor, let the community know and ask if nursing staff can complete the Provider Plan of Care, or if there is a visiting doctor who can assist.",
    ],
    parentId: "1.3.1",
    headingId: "0",
    parentOption:
      "Client needs to have seen their primary care physician within the last six months",
  },
  {
    id: "1.3.1.2",
    type: "radio",
    label: "",
    options: [
      "Can be done via skin test or chest x-ray. If client is in hospital request chest x-ray. Use mobile x-ray if client is unable to leave their home",
      "Some communities will allow client to have TB test when they arrive on campus.",
      "CVS Minute Clinic and some urgent care facilities will do TB skin tests",
    ],
    parentId: "1.3.1",
    headingId: "0",
    parentOption: "Tuberculosis test",
  },
  {
    id: "1.4",
    type: "checkbox",
    label:
      "Tour the community or request a copy of the floor plan so you can decide what furniture and personal items should be moved",
    parentId: "1",
    headingId: "0",
  },
  {
    id: "1.4.1",
    type: "radio",
    label: "",
    options: [
      "For memory care, make sure you bring some personal items so you can orient your loved one to their new space. It’s often disorienting if they don’t recognize any of the items in their room.",
      "Take inventory of any items you might need, like shower curtain rings, trash cans, or silverware.",
      "Make note of any durable medical or safety equipment your loved one might need, like a shower chair or a bedside rail.",
      "In the state of Texas, it is legally required that you post notice if you are using video monitoring equipment. Understand your state and community rules on remote video monitoring",
      "As you’re considering what furniture to bring, imagine navigating the space using a walker or a wheelchair. Make sure to keep pathways clear and avoid using rugs or carpets that might be a trip hazard.",
    ],
    parentId: "1.4",
    headingId: "0",
  },
  {
    id: "1.5",
    type: "checkbox",
    label: "Put a communication plan in place for your loved one",
    parentId: "1",
    headingId: "0",
  },
  {
    id: "1.5.1",
    type: "radio",
    label: "",
    options: [
      "Many memory care communities recommend that families not contact their loved one for the first two weeks after their move. This allows the new resident to settle into community living and get used to having staff attend their needs",
    ],
    parentId: "1.5",
    headingId: "0",
  },
  {
    id: "1.5.1.1",
    type: "radio",
    label: "",
    options: ["Ask who to contact for regular updates and pictures"],
    parentId: "1.5.1",
    headingId: "0",
    parentOption:
      "Many memory care communities recommend that families not contact their loved one for the first two weeks after their move. This allows the new resident to settle into community living and get used to having staff attend their needs",
  },

  {
    id: "2",
    type: "heading",
    label: "ONE TO TWO DAYS BEFORE THE MOVE",
    parentId: null,
    headingId: "2",
  },
  {
    id: "3",
    type: "group",
    label:
      "Confirm with administration that all of your paperwork is complete and correct. Discuss what time you should arrive and who you should expect to greet you and orient you to the community",
    parentId: null,
    headingId: "2",
  },
  {
    id: "4",
    type: "group",
    label:
      "If there is concern about your loved one becoming distressed when you leave, notify staff and how they plan to redirect their new resident.",
    parentId: null,
    headingId: "2",
  },
  {
    id: "4.1",
    type: "checkbox",
    label:
      "Strategize with staff about the best time to arrive (meal time, prior to an activity, etc.)",
    parentId: "4",
    headingId: "2",
  },
  {
    id: "5",
    type: "heading",
    label: "DAY OF MOVE",
    parentId: null,
    headingId: "5",
  },
  {
    id: "6",
    label:
      "Check medications and med list into nursing staff first thing in the morning (reconciliation often takes several hours)",
    parentId: null,
    type: "group",
    headingId: "5",
  },
  {
    id: "6.1",
    label: "Make note of who you checked meds in with",
    parentId: "6",
    type: "checkbox",
    headingId: "5",
  },
  {
    id: "6.2",
    label:
      "Make sure medication will be administered at the appropriate time (if checking into community at 10:00AM, confirm that they will receive noon meds, etc.) If needed, keep 1 to 2 days worth of medications in a pill strip to self-administer.",
    parentId: "6",
    type: "checkbox",
    headingId: "5",
  },
  {
    id: "6.3",
    label:
      "All medications, including over the counter medication, should be checked into community staff. In most communities, you are violating your lease agreement if you keep medication or supplements in your room.",
    parentId: "6",
    type: "checkbox",
    headingId: "5",
  },
  {
    id: "7",
    type: "group",
    label: "Unpack clothing and personal items",
    parentId: null,
    headingId: "5",
  },
  {
    id: "7.1",
    label: "Make a list of any forgotten items",
    parentId: "7",
    type: "checkbox",
    headingId: "5",
  },
  {
    id: "7.2",
    label:
      "If items are being delivered make sure you notify community staff so they can help unpack",
    parentId: "7",
    type: "checkbox",
    headingId: "5",
  },
  {
    id: "8",
    type: "group",
    label:
      "Make a list of toiletries (shampoo, soap, toilet paper, toothpaste) that you are responsible for ordering, if possible, set these items to auto ship",
    parentId: null,
    headingId: "5",
  },
  {
    id: "9",
    type: "group",
    label:
      "Orient the resident to community (introduce to staff, show them where dining room and activity areas are)",
    parentId: null,
    headingId: "5",
  },
  {
    id: "10",
    type: "group",
    label:
      "Introduce yourself to staff (executive director, sales office, nursing staff, med techs, front desk) and learn who your point of contact is for questions during the week, at night, and on the weekend",
    parentId: null,
    headingId: "5",
  },
  {
    id: "11",
    type: "group",
    label:
      "Make sure staff knows if your loved one has a cell phone and if they require assistance charging the device and making calls",
    parentId: null,
    headingId: "5",
  },
  {
    id: "12",
    type: "heading",
    label: "WITHIN 1 WEEK OF MOVE IN",
    parentId: null,
    headingId: "12",
  },
  {
    id: "13",
    type: "group",
    label:
      "Request current copy of medication list, reconcile this against the admission med list",
    parentId: null,
    headingId: "12",
  },
  {
    id: "14",
    type: "group",
    label:
      "Request a hard copy of the care plan to review shower days, laundry and housekeeping times, and hands on assistance provided by staff.",
    parentId: null,
    headingId: "12",
  },
  {
    id: "15",
    type: "group",
    label:
      "Coordinate visits with visiting providers (primary care, podiatry, dentist, home health, etc.)",
    parentId: null,
    headingId: "12",
  },
  {
    id: "15.1",
    type: "checkbox",
    label: "If appropriate, attend first visit with all new providers",
    parentId: "15",
    headingId: "12",
  },
  {
    id: "15.2",
    type: "checkbox",
    label:
      "Learn how to place a transportation request at communities that offer transportation",
    parentId: "15",
    headingId: "12",
  },
  {
    id: "15.3",
    type: "checkbox",
    label:
      "Check with administration to see how medication changes need to be reported back to the community after an off site visit",
    parentId: "15",
    headingId: "12",
  },
  {
    id: "16",
    type: "group",
    label: "Check supplies and order as needed",
    parentId: null,
    headingId: "12",
  },
  {
    id: "17",
    type: "group",
    label:
      "Check in with AM, PM, and weekend floor staff to see how the resident is settling in",
    parentId: null,
    headingId: "12",
  },
  {
    id: "17.1",
    type: "checkbox",
    label:
      "Try to visit during different times of the day to meet AM and PM staff",
    parentId: "17",
    headingId: "12",
  },
  {
    id: "18",
    type: "group",
    label:
      "Update the Face Sheet to reflect new medical providers and home health agencies involved in care",
    parentId: null,
    headingId: "12",
  },
  {
    id: "19",
    type: "group",
    label:
      "Make sure all demographic information (address, phone number, etc.) has been updated on the emergency list",
    parentId: null,
    headingId: "12",
  },
  {
    id: "20",
    type: "group",
    label:
      "Schedule Care Plan with nursing and administrative staff (see Care Plan form and video)",
    parentId: null,
    headingId: "12",
  },
  {
    id: "21",
    type: "group",
    label:
      "Update address with Social Security, Medicare and other insurance companies forward mail",
    parentId: null,
    headingId: "12",
  },
  {
    id: "22",
    type: "group",
    label: "Update address on drivers license or identification card",
    parentId: null,
    headingId: "12",
  },
];

export const generateMoveInDefaultValues = (): Record<
  string,
  boolean | null
> => {
  const defaultValues: Record<string, boolean | null> = {};

  moveInSchema.forEach((field) => {
    if (field.type === "checkbox") {
      defaultValues[field.id] = false;
    } else if (field.type === "radio") {
      defaultValues[field.id] = null;
    }
  });

  return defaultValues;
};
