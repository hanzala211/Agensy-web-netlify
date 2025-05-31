import { ICONS } from "@agensy/constants";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPrevPage: () => void;
  onNextPage: () => void;
}
export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPrevPage,
  onNextPage,
}) => {
  return (
    <div className="flex items-center justify-between border-t border-mediumGray pt-4">
      <button
        className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium ${
          currentPage > 1
            ? "text-primaryColor hover:bg-lightGray"
            : "text-slateGrey cursor-not-allowed"
        }`}
        onClick={onPrevPage}
        disabled={currentPage <= 1}
      >
        <ICONS.leftArrow size={16} />
        <span>Previous</span>
      </button>

      <span className="text-sm text-darkGray">
        Page {currentPage} of {totalPages}
      </span>

      <button
        className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium ${
          currentPage < totalPages
            ? "text-primaryColor hover:bg-lightGray"
            : "text-slateGrey cursor-not-allowed"
        }`}
        onClick={onNextPage}
        disabled={currentPage >= totalPages}
      >
        <span>Next</span>
        <ICONS.rightArrow size={16} />
      </button>
    </div>
  );
};

export default Pagination;
