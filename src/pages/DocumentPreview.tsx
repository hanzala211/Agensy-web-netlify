import {
  Card,
  H1,
  EmptyStateCard,
  TertiaryButton,
  DocumentPreviewSkeleton,
} from "@agensy/components";
import {
  COLORS,
  DOCUMENT_CATEGORY_OPTIONS,
  ICONS,
  ROUTES,
} from "@agensy/constants";
import {
  useGetSingleDocumentQuery,
  useGetSingleGeneralDocumentQuery,
} from "@agensy/api";
import { useNavigate, useParams } from "react-router-dom";
import { useClientContext } from "@agensy/context";
import { useCallback, useEffect, useMemo, useState } from "react";
import { DateUtils, toast } from "@agensy/utils";
import printJS from "print-js";
import type { Document } from "@agensy/types";

export const DocumentPreview: React.FC = () => {
  const params = useParams();
  const { selectedClient, handleDownload } = useClientContext();
  const {
    data: clientDocument,
    isLoading: isLoadingClientDocument,
    isError: isErrorClientDocument,
    refetch: loadClientDocument,
  } = useGetSingleDocumentQuery(
    params.clientId as string,
    params.documentId as string
  );
  const {
    data: generalDocument,
    isLoading: isLoadingGeneralDocument,
    isError: isErrorGeneralDocument,
    refetch: loadGeneralDocument,
  } = useGetSingleGeneralDocumentQuery(params.documentId as string);
  const [document, setDocument] = useState<Document | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (params.clientId) {
      loadClientDocument();
    } else {
      loadGeneralDocument();
    }
  }, []);

  useEffect(() => {
    if (clientDocument) {
      setDocument(clientDocument);
    } else if (generalDocument) {
      setDocument(generalDocument);
    }
  }, [clientDocument, generalDocument]);

  const categoryName = useMemo(() => {
    return (
      [...(DOCUMENT_CATEGORY_OPTIONS || [])].find(
        (cat) => cat.value === document?.category
      )?.label || "Unknown"
    );
  }, [selectedClient, document?.category]);

  const isImage = useMemo(() => {
    return document?.file_type?.startsWith("image/");
  }, [document]);

  const isPDF = useMemo(() => {
    return document?.file_type === "application/pdf";
  }, [document]);

  const handlePrint = useCallback(() => {
    printJS({
      printable: document?.file_url,
      type: isPDF ? "pdf" : "image",
      onLoadingStart: () => {
        toast.info("Preparing document for printing...");
      },
    });
  }, [document, isPDF]);

  if (isLoadingClientDocument || isLoadingGeneralDocument)
    return <DocumentPreviewSkeleton hasClientId={!!params.clientId} />;

  if (isErrorClientDocument || isErrorGeneralDocument || !document)
    return (
      <div className="w-full max-w-7xl mx-auto h-96">
        <EmptyStateCard
          ICON={ICONS.document}
          label="Document"
          showText={false}
        />
      </div>
    );

  const handleClickBack = () => {
    navigate(`/${ROUTES.clients}/${params.clientId}/${ROUTES.clientDocuments}`);
  };

  return (
    <div className={`${params.clientId ? "" : "border-t-[2px]"}`}>
      <div className={`max-w-7xl mx-auto py-5 px-2`}>
        <Card>
          <div className="flex flex-col md:flex-row md:justify-between gap-4 mb-6">
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-4">
                {params.clientId && (
                  <button
                    onClick={handleClickBack}
                    title="Back"
                    className="bg-basicBlue h-[25px] w-[25px] sm:h-[30px] sm:w-[30px] flex-shrink-0 flex items-center justify-center text-[12px] sm:text-[15px] rounded-full"
                  >
                    <ICONS.fullLeftArrow color={COLORS.basicWhite} />
                  </button>
                )}
                <H1 className="mb-1">{document?.title}</H1>
              </div>
              <div className="text-gray-500 text-sm">
                <span className="font-medium">Category:</span> {categoryName}
              </div>
              <div className="text-gray-500 text-sm flex flex-col gap-2">
                <span className="font-medium">
                  Uploaded:{" "}
                  {DateUtils.formatDateToRequiredFormat(
                    String(document?.createdAt)
                  )}
                </span>
                <span className="font-medium">
                  Description: {document.description}
                </span>
                <span className="font-medium">
                  By: {document?.uploadedBy?.first_name}{" "}
                  {document?.uploadedBy?.last_name}
                </span>
              </div>
              <div className="text-gray-500 text-sm">
                <span className="font-medium">Type:</span> {document?.file_type}{" "}
                <span className="ml-2 font-medium">Size:</span>{" "}
                {(document?.file_size / (1024 * 1024)).toFixed(2)} MB
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <TertiaryButton
                onClick={() => handleDownload(document)}
                aria_label="Download document"
                className="hover:bg-green-50 hover:text-green-500 hover:border-green-300"
              >
                <span className="flex items-center gap-2">
                  <ICONS.download />
                </span>
              </TertiaryButton>
              <TertiaryButton
                onClick={handlePrint}
                aria_label="Print document"
                className="hover:bg-blue-50 hover:text-blue-500 hover:border-blue-300"
              >
                <span className="flex items-center gap-2">
                  <ICONS.print />
                </span>
              </TertiaryButton>
            </div>
          </div>
          <div className="border rounded-lg min-h-[320px] bg-gray-50 flex items-center justify-center overflow-hidden">
            {isImage ? (
              <img
                src={document?.file_url}
                alt={document?.title}
                className="max-h-[400px] w-auto mx-auto"
              />
            ) : isPDF ? (
              <iframe
                src={document?.file_url}
                title="Document Preview"
                className="w-full h-[700px] border-0"
              />
            ) : (
              <EmptyStateCard
                ICON={ICONS.document}
                label="Document Preview"
                showText={false}
              />
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DocumentPreview;
