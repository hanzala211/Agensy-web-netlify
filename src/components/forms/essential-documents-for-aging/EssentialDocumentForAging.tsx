import {
  useGetEssentialDocumentsForAging,
  usePostEssentialDocumentsForAgingMutation,
} from "@agensy/api";
import { Card, CommonLoader, PrimaryButton } from "@agensy/components";
import { useClientContext } from "@agensy/context";
import { toast } from "@agensy/utils";
import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useParams } from "react-router-dom";

interface AdvanceCareDocument {
  id?: string;
  category: string;
  document_name: string;
  in_place: boolean;
  notes?: string | null;
}

interface FormData {
  documents: AdvanceCareDocument[];
}

const advanceCarePlanningDocuments: AdvanceCareDocument[] = [
  {
    category: "Advance Care Planning",
    document_name: "Medical Power of Attorney (Health Care Proxy)",
    in_place: false,
    notes: "",
  },
  {
    category: "Advance Care Planning",
    document_name: "Out of Hospital Do Not Resuscitate (OOH DNR)",
    in_place: false,
    notes: "",
  },
  {
    category: "Advance Care Planning",
    document_name: "Physician Orders for Life Sustaining Treatment (POLST)",
    in_place: false,
    notes: "",
  },
  {
    category: "Advance Care Planning",
    document_name:
      "Designation of Guardian in Event of Later Incapacity or Need",
    in_place: false,
    notes: "",
  },
  {
    category: "Advance Care Planning",
    document_name:
      "Directive to Physician and Family or Surrogates (Living Will)",
    in_place: false,
    notes: "",
  },
  {
    category: "Advance Care Planning",
    document_name: "Declaration for Mental Health Treatment",
    in_place: false,
    notes: "",
  },
  {
    category: "Financial & Legal",
    document_name: "Durable Power of Attorney (Finances)",
    in_place: false,
    notes: "",
  },
  {
    category: "Financial & Legal",
    document_name: "Will",
    in_place: false,
    notes: "",
  },
  {
    category: "Financial & Legal",
    document_name: "Revocable Living Trust",
    in_place: false,
    notes: "",
  },
  {
    category: "Health & Insurance",
    document_name: "Health Insurance Information",
    in_place: false,
    notes: "",
  },
  {
    category: "Health & Insurance",
    document_name: "HIPAA Release Form",
    in_place: false,
    notes: "",
  },
  {
    category: "End of Life Planning",
    document_name: "Funeral Instructions",
    in_place: false,
    notes: "",
  },
  {
    category: "End of Life Planning",
    document_name: "Burial Instructions",
    in_place: false,
    notes: "",
  },
  {
    category: "End of Life Preferences",
    document_name: "Organ and Tissue Donation Directive",
    in_place: false,
    notes: "",
  },
  {
    category: "Identification & Access",
    document_name: "Photo ID (Driver's License, Passport)",
    in_place: false,
    notes: "",
  },
  {
    category: "Identification & Access",
    document_name: "Social Security Card",
    in_place: false,
    notes: "",
  },
  {
    category: "Identification & Access",
    document_name: "List of Accounts and Passwords",
    in_place: false,
    notes: "",
  },
  {
    category: "Identification & Access",
    document_name: "List of Key Contacts",
    in_place: false,
    notes: "",
  },
  {
    category: "Other Documents",
    document_name: "Declaration",
    in_place: false,
    notes: "",
  },
];

export const EssentialDocumentForAging = () => {
  const { setOpenedFileData } = useClientContext();
  const params = useParams();
  const {
    data: essentialDocuments,
    isFetching: isFetchingEssentialDocuments,
    refetch,
    status: getStatus,
  } = useGetEssentialDocumentsForAging(params.clientId!);
  const postEssentialDocumentsForAgingMutation =
    usePostEssentialDocumentsForAgingMutation();
  const { control, handleSubmit, watch, setValue } = useForm<FormData>({
    defaultValues: {
      documents: advanceCarePlanningDocuments,
    },
  });

  useEffect(() => {
    if (getStatus === "success" && essentialDocuments?.essential_documents) {
      const updatedDocuments = advanceCarePlanningDocuments.map(
        (defaultDoc) => {
          const matchingDoc = essentialDocuments.essential_documents.find(
            (backendDoc: AdvanceCareDocument) =>
              backendDoc.document_name === defaultDoc.document_name
          );

          return matchingDoc
            ? {
                ...defaultDoc,
                id: matchingDoc.id,
                in_place: matchingDoc.in_place,
                notes: matchingDoc.notes,
              }
            : defaultDoc;
        }
      );

      setValue("documents", updatedDocuments);
    }
  }, [getStatus, essentialDocuments]);

  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    if (essentialDocuments?.essential_documents) {
      setOpenedFileData({
        essential_documents: essentialDocuments?.essential_documents,
        last_update: {
          updatedAt: essentialDocuments?.last_update?.updatedAt,
        },
      });
    }
  }, [essentialDocuments]);

  useEffect(() => {
    if (postEssentialDocumentsForAgingMutation.status === "success") {
      toast.success("Essential documents for aging updated successfully");
    } else if (postEssentialDocumentsForAgingMutation.status === "error") {
      toast.error("Failed to update essential documents for aging");
    }
  }, [postEssentialDocumentsForAgingMutation.status]);

  const { fields } = useFieldArray({
    control,
    name: "documents",
  });

  const watchedDocuments = watch("documents");

  const onSubmit = (data: FormData) => {
    data.documents.forEach((document) => {
      if (document.notes && document.notes.length > 0) {
        return document;
      } else {
        document.notes = null;
        return document;
      }
    });

    postEssentialDocumentsForAgingMutation.mutate({
      clientId: params.clientId!,
      data: {
        essential_documents: data.documents,
      },
    });
  };

  return (
    <div className="space-y-6">
      <Card title="Instructions">
        <div className="space-y-6 text-primaryColor">
          <p>
            It's essential for care recipients to have all of their legal
            documents completed and up to date to ensure their wishes are
            honored and to avoid delays or confusion during a medical or
            financial crisis. Each state has its own laws and forms for
            documents like advance directives, powers of attorney, and DNR
            orders, so it's important that care recipients either consult an
            attorney or, at minimum, verify they are using the correct forms by
            checking their state government's website. If they plan to move to
            another state, their documents may need to be updated to remain
            valid.
          </p>
          <p>
            Care recipients should also inform their designated powers of
            attorney where these documents are kept and how to access them. In
            some cases, such as out-of-hospital DNR orders, state regulations
            may require that the documents be posted in a visible location like
            the refrigerator to be honored by emergency responders. Keeping
            these documents accurate, accessible, and state-compliant helps
            ensure peace of mind for both the individual and their loved ones.
          </p>
        </div>
      </Card>
      {isFetchingEssentialDocuments ? (
        <div className="flex justify-center items-center h-screen">
          <CommonLoader />
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <Card title="Essential Documents List">
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-4 bg-gray-50 border-b border-gray-300">
                <div className="px-4 py-3 font-medium text-gray-700 border-r border-gray-300">
                  Category
                </div>
                <div className="px-4 py-3 font-medium text-gray-700 border-r border-gray-300">
                  Name of Document
                </div>
                <div className="px-4 py-3 font-medium text-gray-700 border-r border-gray-300">
                  In place? Yes / No
                </div>
                <div className="px-4 py-3 font-medium text-gray-700">
                  Notes (Where is the document kept. Who has a copy)
                </div>
              </div>

              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid items-center grid-cols-1 lg:grid-cols-4 gap-4 p-4 border border-gray-200 hover:bg-gray-50"
                >
                  <div className="text-gray-700">
                    {watchedDocuments[index]?.category}
                  </div>
                  <div className="text-gray-700">
                    {watchedDocuments[index]?.document_name}
                  </div>
                  <div className="flex items-center lg:justify-center">
                    <input
                      type="checkbox"
                      checked={watchedDocuments[index]?.in_place || false}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setValue(
                          `documents.${index}.in_place`,
                          e.target.checked
                        );
                      }}
                      className="ml-2 w-4 h-4"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={watchedDocuments[index]?.notes || ""}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setValue(`documents.${index}.notes`, e.target.value);
                      }}
                      placeholder="Enter notes here..."
                      className={`text-darkGray bg-lightGray placeholder:text-darkGray p-2
                        border-[1px] border-mediumGray rounded-xl w-full outline-none focus-within:border-basicBlue focus-within:shadow-sm focus-within:shadow-blue-200 transition-all duration-200`}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end">
              <PrimaryButton
                type="submit"
                isLoading={postEssentialDocumentsForAgingMutation.isPending}
                disabled={postEssentialDocumentsForAgingMutation.isPending}
                className="sm:!w-fit w-full md:text-base text-sm"
              >
                Save Essential Document for Aging
              </PrimaryButton>
            </div>
          </Card>
        </form>
      )}
    </div>
  );
};
