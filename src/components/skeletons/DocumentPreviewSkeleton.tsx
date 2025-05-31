import { Card } from "@agensy/components";
import { ICONS } from "@agensy/constants";

interface DocumentPreviewSkeletonProps {
  hasClientId?: boolean;
}

export const DocumentPreviewSkeleton: React.FC<
  DocumentPreviewSkeletonProps
> = ({ hasClientId }) => {
  return (
    <div className={`${hasClientId ? "" : "border-t-[2px]"}`}>
      <div className="w-full max-w-7xl mx-auto h-full flex flex-col gap-4 px-2 py-5">
        <Card>
          <div className="flex flex-col md:flex-row md:justify-between gap-4 mb-6">
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-4">
                {hasClientId && (
                  <div className="bg-gray-200 h-[25px] w-[25px] sm:h-[30px] sm:w-[30px] flex-shrink-0 rounded-full animate-pulse" />
                )}
                <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="h-5 w-40 bg-gray-200 rounded animate-pulse" />
              <div className="space-y-2">
                <div className="h-5 w-56 bg-gray-200 rounded animate-pulse" />
                <div className="h-5 w-64 bg-gray-200 rounded animate-pulse" />
                <div className="h-5 w-48 bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="h-5 w-72 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="flex flex-row md:flex-col gap-2">
              <div className="h-7 w-7 bg-gray-200 rounded animate-pulse" />
              <div className="h-7 w-7 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
          <div className="border rounded-lg min-h-[490px] bg-gray-100 flex items-center justify-center overflow-hidden animate-pulse">
            <div className="h-16 w-16 text-gray-300">
              <ICONS.document />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DocumentPreviewSkeleton;
