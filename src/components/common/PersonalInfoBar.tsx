import type React from "react";

interface PersonalInfoBarProps {
  leftLabel: string;
  leftValue: string;
  rightLabel: string;
  rightValue: string;
  thirdValue?: string;
  thirdLabel?: string;
}

export const PersonalInfoBar: React.FC<PersonalInfoBarProps> = ({
  leftLabel,
  leftValue,
  rightLabel,
  rightValue,
  thirdLabel = "",
  thirdValue = "",
}) => {
  const truncateText = (text: string): string => {
    return text.length > 14 ? text.substring(0, 14) + "..." : text;
  };

  const InfoItem: React.FC<{
    label: string;
    value: string;
    showDivider?: boolean;
  }> = ({ label, value, showDivider = false }) => {
    return (
      <>
        <div className="flex flex-col gap-1 flex-1 min-w-0 px-2.5 sm:px-3 first:pl-0 last:pr-0">
          <span className="text-[10px] sm:text-xs text-gray-500 font-semibold uppercase tracking-wider">
            {label}
          </span>
          <span className="text-sm sm:text-base text-darkGray font-semibold truncate leading-snug">
            {truncateText(value)}
          </span>
        </div>
        {showDivider && (
          <div className="hidden sm:block w-px h-12 bg-gradient-to-b from-transparent via-gray-200 to-transparent mx-1.5 sm:mx-2 flex-shrink-0" />
        )}
      </>
    );
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow transition-shadow duration-200 md:p-4 p-3 mt-3 w-full">
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-1.5 sm:items-start w-full">
        <InfoItem label={leftLabel} value={leftValue} />
        <InfoItem label={rightLabel} value={rightValue} />
        {thirdLabel && thirdValue && (
          <InfoItem label={thirdLabel} value={thirdValue} />
        )}
      </div>
    </div>
  );
};
