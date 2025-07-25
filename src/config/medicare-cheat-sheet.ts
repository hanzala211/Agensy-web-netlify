import type { ChecklistField } from "@agensy/types";

export const medicareCheatSheetSchema: ChecklistField[] = [
  {
    id: "0",
    type: "heading",
    label: "ELIGIBILITY FOR MEDICARE:",
    parentId: null,
    headingId: "0",
  },
  {
    id: "1",
    type: "group",
    label: "Individuals 65+",
    parentId: null,
    headingId: "0",
  },
  {
    id: "2",
    type: "group",
    label: "Individuals under 65 with certain disabilities",
    parentId: null,
    headingId: "0",
  },
  {
    id: "2.1",
    type: "group",
    label: "Disability requirements follow those of SSDI",
    parentId: "2",
    headingId: "0",
  },
  {
    id: "2.1.1",
    type: "link",
    label:
      "https://www.ssa.gov/disability/professionals/bluebook/listing-impairments.htm",
    parentId: "2.1",
    headingId: "0",
  },
  {
    id: "3",
    type: "group",
    label: "Individuals with end stage renal disease",
    parentId: null,
    headingId: "0",
  },
  {
    id: "4",
    type: "heading",
    label: "MEDICARE ENROLLMENT PERIOD",
    parentId: null,
    headingId: "4",
  },
  {
    id: "5",
    type: "group",
    label:
      "You can register for Medicare at any point after age 65, HOWEVER, there is a recommended time frame in which to do so",
    parentId: null,
    headingId: "4",
  },
  {
    id: "5.1",
    type: "group",
    label: "There is an 'initial enrollment period' that Medicare provides",
    parentId: null,
    headingId: "4",
  },
  {
    id: "5.1.1",
    type: "group",
    label: "Lasts for 7 months",
    parentId: "5.1",
    headingId: "4",
  },
  {
    id: "5.1.1.1",
    type: "group",
    label:
      "Starts 3 months before you turn 65 and lasts for 3 months after you turn 65",
    parentId: "5.1.1",
    headingId: "4",
  },
  {
    id: "5.1.2",
    type: "group",
    label:
      "IMPORTANT: This is the time period in which you can qualify for a supplemental plan with Traditional Medicare – no questions asked",
    parentId: "5.1",
    headingId: "4",
  },
  {
    id: "5.1.2.1",
    type: "group",
    label:
      "Individuals with pre-existing health conditions, upcoming recommended procedures, or frequent injections may not qualify for supplemental plans after this time period or may be charged a higher premium",
    parentId: "5.1.2",
    headingId: "4",
  },
  {
    id: "6",
    type: "heading",
    label: "THE 4 PARTS OF MEDICARE:",
    parentId: null,
    headingId: "6",
  },
  {
    id: "7",
    type: "group",
    label: "Part A = Hospital Coverage",
    parentId: null,
    headingId: "6",
  },
  {
    id: "7.1",
    type: "group",
    label: "Inpatient hospital stays, home health, skilled nursing care",
    parentId: "7",
    headingId: "6",
  },
  {
    id: "8",
    type: "group",
    label: "Part B = Medical Coverage",
    parentId: null,
    headingId: "6",
  },
  {
    id: "8.1",
    type: "group",
    label:
      "Doctor visits, outpatient services, x-rays, lab tests, preventative screenings",
    parentId: "8",
    headingId: "6",
  },
  {
    id: "9",
    type: "group",
    label: "Part C = Medicare Advantage",
    parentId: null,
    headingId: "6",
  },
  {
    id: "10",
    type: "group",
    label: "Part D = Prescription Drug Coverage",
    parentId: null,
    headingId: "6",
  },
  {
    id: "11",
    type: "heading",
    label:
      "RECOMMENDED OPTION BY GERIATRIC PROFESSIONALS: Have Traditional Medicare (Part A & B) with a supplemental (F or G plan)",
    parentId: null,
    headingId: "11",
  },
  {
    id: "12",
    type: "group",
    label: "Traditional (Original) Medicare is Part A and B only.",
    parentId: null,
    headingId: "11",
  },
  {
    id: "12.1",
    type: "group",
    label:
      "Part A is given at no cost if you have worked for 10+ years and paid Medicare taxes during that time",
    parentId: "12",
    headingId: "11",
  },
  {
    id: "12.1.1",
    type: "group",
    label:
      "If you haven't worked for 10+ years, you can still get Part A. However, you will have to pay a monthly premium (ranging between $200-$500) and you must also get Part B which also includes a monthly premium.",
    parentId: "12.1",
    headingId: "11",
  },
  {
    id: "12.1.1.1",
    type: "group",
    label:
      "There are some exceptions to qualify for Part A without a premium, even if you've worked less than 10 years:",
    parentId: "12.1.1",
    headingId: "11",
  },
  {
    id: "12.1.1.1.1",
    type: "group",
    label: "Spread eligibility",
    parentId: "12.1.1.1",
    headingId: "11",
  },
  {
    id: "12.1.1.1.2",
    type: "group",
    label: "Qualifying medical conditions and disabilities",
    parentId: "12.1.1.1",
    headingId: "11",
  },
  {
    id: "12.1.1.1.3",
    type: "group",
    label: "SUB/regiment",
    parentId: "12.1.1.1",
    headingId: "11",
  },
  {
    id: "12.2",
    type: "group",
    label: "Part B has a monthly payment of $174.70 a month (as of 2024)",
    parentId: "12",
    headingId: "11",
  },
  {
    id: "12.2.1",
    type: "group",
    label:
      "The monthly payment will automatically come out of your social security if you have started collecting social security",
    parentId: "12.2",
    headingId: "11",
  },
  {
    id: "12.2.2",
    type: "group",
    label:
      "Without Part B, you will have to pay out of pocket for any doctor visits, outpatient services, x-rays, lab tests, preventative screenings",
    parentId: "12.2",
    headingId: "11",
  },
  {
    id: "13",
    type: "group",
    label: "Supplemental Plans (also known as MediPay Plans):",
    parentId: null,
    headingId: "11",
  },
  {
    id: "13.1",
    type: "group",
    label:
      "There are several supplemental plans that can be chosen based on your area.",
    parentId: "13",
    headingId: "11",
  },
  {
    id: "13.2",
    type: "group",
    label: "They are associated with a letter.",
    parentId: "13",
    headingId: "11",
  },
  {
    id: "13.3",
    type: "group",
    label: "Supplemental plans do have a premium you must pay.",
    parentId: "13",
    headingId: "11",
  },
  {
    id: "13.4",
    type: "group",
    label:
      "Supplemental plans are elective, so you can get them at any time of the year.",
    parentId: "13",
    headingId: "11",
  },
  {
    id: "13.4.1",
    type: "group",
    label:
      "However, each supplemental plan has medical qualifying factors that must be met in order to get the supplemental plan.",
    parentId: "13.4",
    headingId: "11",
  },
  {
    id: "13.4.1.1",
    type: "group",
    label:
      "Individuals with pre-existing health conditions, upcoming recommended procedures, or frequent injections may not qualify for supplemental plans or may be charged a higher premium (this is why it's important to apply during the initial enrollment period etc.)",
    parentId: "13.4.1",
    headingId: "11",
  },
  {
    id: "13.5",
    type: "group",
    label:
      "IMPORTANT: To get a supplemental plan, you must have Traditional Medicare",
    parentId: "13",
    headingId: "11",
  },
  {
    id: "13.5.1",
    type: "group",
    label:
      "You cannot get a supplemental plan when you have a Medicare Advantage Plan",
    parentId: "13.5",
    headingId: "11",
  },
  {
    id: "13.6",
    type: "group",
    label: "The two best supplemental plans are:",
    parentId: "13",
    headingId: "11",
  },
  {
    id: "13.6.1",
    type: "group",
    label: "Plan F",
    parentId: "13.6",
    headingId: "11",
  },
  {
    id: "13.6.1.1",
    type: "group",
    label: "Offers the most coverage of all supplemental plans",
    parentId: "13.6.1",
    headingId: "11",
  },
  {
    id: "13.6.1.2",
    type: "group",
    label:
      "Not available to everyone – limited to beneficiaries who were eligible for Medicare prior to 1/1/2020",
    parentId: "13.6.1",
    headingId: "11",
  },
  {
    id: "13.6.1.2.1",
    type: "group",
    label:
      "It's possible someone may qualify for plan F if they were eligible prior to 2020 but hadn't switched over to Traditional Medicare yet",
    parentId: "13.6.1.2",
    headingId: "11",
  },
  {
    id: "13.6.1.2.1.1",
    type: "group",
    label: "Ex:Still working past age 65 and turned 65 prior to 2020",
    parentId: "13.6.1.2.1",
    headingId: "11",
  },
  {
    id: "13.6.2",
    type: "group",
    label: "Plan G",
    parentId: "13.6",
    headingId: "11",
  },
  {
    id: "13.6.2.1",
    type: "group",
    label:
      "Available to all who qualify for Medicare, including those who become eligible after 1/1/2020",
    parentId: "13.6.2",
    headingId: "11",
  },
  {
    id: "13.6.2.2",
    type: "group",
    label:
      "Main exception from Plan F is that it does not cover your Part B deductible",
    parentId: "13.6.2",
    headingId: "11",
  },
  {
    id: "14",
    type: "group",
    label:
      "ALSO IMPORTANT: It is recommended that you have a supplemental plan if you have traditional Medicare.",
    parentId: null,
    headingId: "11",
  },
  {
    id: "14.1",
    type: "group",
    label:
      "Medicare Part B has an 80% of total income you meet the Medicare deductible. Part B will pay for 80% of covered services. You are responsible for the remaining 20%.",
    parentId: "14",
    headingId: "11",
  },
  {
    id: "14.1.1",
    type: "group",
    label: "A supplemental plan can pick up the remaining 20%",
    parentId: "14.1",
    headingId: "11",
  },
  {
    id: "14.1.1.1",
    type: "group",
    label:
      "With no supplemental plan, you are responsible for that 20%. There is no max amount for the 20%, so the bill can continue to go up with no cap.",
    parentId: "14.1.1",
    headingId: "11",
  },
  {
    id: "15",
    type: "heading",
    label: "MEDICARE ADVANTAGE PLANS (PART C)",
    parentId: null,
    headingId: "15",
  },
  {
    id: "16",
    type: "group",
    label:
      "Medicare Advantage plans are considered 'Private' plans. They are managed by private companies, not the government itself (it's corporate).",
    parentId: null,
    headingId: "15",
  },
  {
    id: "17",
    type: "group",
    label:
      "These plans are cheaper upfront than Traditional Medicare and often include added perks (dental, vision, hearing, drug plans, facelifts), BUT they have restrictions on where you can receive treatment, by whom, and for how long. This can become very limiting as someone's healthcare needs increase.",
    parentId: null,
    headingId: "15",
  },
  {
    id: "18",
    type: "heading",
    label: "PRESCRIPTION DRUG PLANS (PART D)",
    parentId: null,
    headingId: "18",
  },
  {
    id: "19",
    type: "group",
    label:
      "When you have Traditional Medicare with a supplemental, it is also recommended that you get a prescription drug plan.",
    parentId: null,
    headingId: "18",
  },
  {
    id: "19.1",
    type: "group",
    label:
      "Supplemental plans can no longer be sold with prescription drug coverage",
    parentId: "19",
    headingId: "18",
  },
  {
    id: "20",
    type: "group",
    label:
      "Each Part D plan has its own formulary (list of covered medications)",
    parentId: null,
    headingId: "18",
  },
  {
    id: "20.1",
    type: "group",
    label:
      "Consult with an insurance broker on which plan may be best for you, given your current medication or potential future medication needs",
    parentId: "20",
    headingId: "18",
  },
  {
    id: "21",
    type: "group",
    label: "Part D plans typically have a $545 deductible",
    parentId: null,
    headingId: "18",
  },
  {
    id: "21.1",
    type: "group",
    label:
      "Once this is met, the drug plan will typically follow the same 80/20 rule as Traditional Medicare",
    parentId: "21",
    headingId: "18",
  },
  {
    id: "22",
    type: "group",
    label:
      "Starting 2025, there will no longer be a 'donut hole' for medications",
    parentId: null,
    headingId: "18",
  },
  {
    id: "22.1",
    type: "group",
    label:
      "In 2025, the most anyone will pay out of pocket for medications for the year is $2,000",
    parentId: "22",
    headingId: "18",
  },
  {
    id: "23",
    type: "group",
    label:
      "IMPORTANT: If you do not enroll with a Part D plan within your initial enrollment period, you may be subject to a late enrollment penalty (a fee added to your monthly premium)",
    parentId: null,
    headingId: "18",
  },
  {
    id: "23.1",
    type: "group",
    label:
      "As of 2024, typical penalty is 50 cents for each month after 65 you have not been enrolled. The total is the late enrollment penalty that is paid monthly.",
    parentId: "23",
    headingId: "18",
  },
  {
    id: "23.2",
    type: "group",
    label: "You must wait for open enrollment to enroll in a Part D plan.",
    parentId: "23",
    headingId: "18",
  },
  {
    id: "24",
    type: "heading",
    label: "SWITCHING FROM MEDICARE ADVANTAGE TO TRADITIONAL",
    parentId: null,
    headingId: "24",
  },
  {
    id: "25",
    type: "group",
    label:
      "There are 3 ways you can switch back to Traditional Medicare from a Medicare Advantage plan if you are outside of your 1-year trial period:",
    parentId: null,
    headingId: "24",
  },
  {
    id: "26",
    type: "group",
    label: "a. You are medically well enough",
    parentId: null,
    headingId: "24",
  },
  {
    id: "27",
    type: "group",
    label: "b. You move",
    parentId: null,
    headingId: "24",
  },
  {
    id: "27.1",
    type: "group",
    label:
      "Tip: If you are on a Medicare advantage plan, you can change your social security address and typically insurance won't look into.",
    parentId: "27",
    headingId: "24",
  },
  {
    id: "27.2",
    type: "group",
    label:
      "Medicare advantage plans are by geographic region, so if you 'move' out of that region, you may be able to switch back to Traditional Medicare",
    parentId: "27",
    headingId: "24",
  },
  {
    id: "28",
    type: "group",
    label: "c. Your current plan goes away by no fault of your own",
    parentId: null,
    headingId: "24",
  },
  {
    id: "29",
    type: "group",
    label:
      "Another way is if someone goes on to hospice. When someone enters hospice, their insurance reverts back to traditional Medicare",
    parentId: null,
    headingId: "24",
  },
  {
    id: "30",
    type: "heading",
    label: "RESOURCES:",
    parentId: null,
    headingId: "30",
  },
  {
    id: "31",
    type: "link",
    label: "Medicare website: https://www.medicare.gov/",
    parentId: null,
    headingId: "30",
  },
  {
    id: "32",
    type: "link",
    label: "Social Security website: https://www.ssa.gov/",
    parentId: null,
    headingId: "30",
  },
  {
    id: "33",
    type: "group",
    label: "Howard Polanski",
    parentId: null,
    headingId: "30",
  },
];

export const generateMedicareCheatSheetDefaultValues = (): Record<
  string,
  boolean | null
> => {
  const defaultValues: Record<string, boolean | null> = {};

  medicareCheatSheetSchema.forEach((field) => {
    if (field.type === "checkbox") {
      defaultValues[field.id] = false;
    } else if (field.type === "radio") {
      defaultValues[field.id] = null;
    }
  });

  return defaultValues;
};
