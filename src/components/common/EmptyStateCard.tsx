import type { IconType } from "react-icons";

export const EmptyStateCard = ({
  ICON,
  label,
  showText = true,
  onClick,
  isEdit = false,
}: {
  ICON: IconType;
  label: string;
  showText?: boolean;
  onClick?: () => void;
  isEdit?: boolean;
}) => {
  return (
    <div
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-10 text-gray-500 bg-gray-50/50 rounded-lg border border-dashed border-gray-200 ${
        onClick ? "hover:bg-gray-50/70 cursor-pointer" : ""
      }`}
    >
      <ICON size={32} className="text-gray-300 mb-3" />
      <p className="text-center font-medium">No {label} Found</p>
      {showText && (
        <p className="text-center text-sm text-gray-400">
          Click the button above to {isEdit ? "edit" : "add one"}
        </p>
      )}
    </div>
  );
};
