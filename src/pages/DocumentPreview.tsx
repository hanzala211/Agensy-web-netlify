import {
  Card,
  H1,
  EmptyStateCard,
  TertiaryButton,
  DocumentPreviewSkeleton,
  CommonLoader,
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
import { DateUtils, toast, HEICUtils } from "@agensy/utils";
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
  const [convertedImageUrl, setConvertedImageUrl] = useState<string | null>(
    null
  );
  const [isConvertingHeic, setIsConvertingHeic] = useState(false);
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

  const isHeic = useMemo(() => {
    return document
      ? HEICUtils.isHeicImage(document.file_type, document.file_name)
      : false;
  }, [document]);

  useEffect(() => {
    const convertHeicImage = async () => {
      if (document && isHeic && document.file_url && !convertedImageUrl) {
        setIsConvertingHeic(true);
        try {
          const convertedUrl = await HEICUtils.convertHeicToJpeg(
            document.file_url
          );
          setConvertedImageUrl(convertedUrl);
        } catch (error) {
          console.error("Failed to convert HEIC image:", error);
          toast.error("Failed to load HEIC image");
        } finally {
          setIsConvertingHeic(false);
        }
      }
    };

    convertHeicImage();
  }, [document, isHeic, convertedImageUrl]);

  useEffect(() => {
    return () => {
      if (convertedImageUrl) {
        URL.revokeObjectURL(convertedImageUrl);
        setConvertedImageUrl(null);
      }
    };
  }, [convertedImageUrl]);

  const handlePrint = useCallback(() => {
    const printUrl =
      isHeic && convertedImageUrl ? convertedImageUrl : document?.file_url;
    printJS({
      printable: printUrl,
      type: isPDF ? "pdf" : "image",
      onLoadingStart: () => {
        toast.info("Preparing document for printing...");
      },
    });
  }, [document, isPDF, isHeic, convertedImageUrl]);

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
              <div className="flex items-center gap-3">
                {params.clientId && (
                  <button
                    onClick={handleClickBack}
                    title="Back"
                    className="h-[32px] w-[32px] flex-shrink-0 flex items-center justify-center rounded-full transition-all duration-300"
                  >
                    <ICONS.fullLeftArrow
                      color={COLORS.primaryColor}
                      size={18}
                    />
                  </button>
                )}
                <H1>{document?.title}</H1>
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
            {isHeic && isConvertingHeic ? (
              <div className="flex flex-col items-center justify-center space-y-4">
                <CommonLoader size={24} />
                <p className="text-gray-600">Converting HEIC image...</p>
              </div>
            ) : isHeic && convertedImageUrl ? (
              <img
                src={convertedImageUrl}
                alt={document?.title}
                className="max-h-[400px] w-auto mx-auto"
              />
            ) : isHeic ? (
              <div className="flex flex-col items-center justify-center space-y-4">
                <ICONS.document size={48} className="text-gray-400" />
                <p className="text-gray-600">
                  HEIC image format not supported in browser
                </p>
                <p className="text-sm text-gray-500">
                  Please download the file to view it
                </p>
              </div>
            ) : isImage ? (
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
