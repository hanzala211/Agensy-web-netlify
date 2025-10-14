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
    <div className="flex items-center justify-between border-t border-gray-100 pt-5">
      <button
        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
          currentPage > 1
            ? "text-primaryColor hover:bg-gray-100 hover:shadow-[0_0_8px_rgba(0,0,0,0.06)]"
            : "text-gray-400 cursor-not-allowed opacity-60"
        }`}
        onClick={onPrevPage}
        disabled={currentPage <= 1}
      >
        <ICONS.leftArrow size={16} />
        <span>Previous</span>
      </button>

      <div className="px-4 py-2 bg-gray-50 rounded-lg">
        <span className="text-sm font-medium text-gray-700">
          Page <span className="text-primaryColor">{currentPage}</span> of{" "}
          {totalPages}
        </span>
      </div>

      <button
        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
          currentPage < totalPages
            ? "text-primaryColor hover:bg-gray-100 hover:shadow-[0_0_8px_rgba(0,0,0,0.06)]"
            : "text-gray-400 cursor-not-allowed opacity-60"
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
