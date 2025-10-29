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
  const InfoItem: React.FC<{
    label: string;
    value: string;
    showDivider?: boolean;
  }> = ({ label, value, showDivider = true }) => (
    <>
      <div className="flex flex-col gap-1 flex-1 min-w-0">
        <span className="text-xs sm:text-sm text-slateGrey font-medium uppercase tracking-wide">
          {label}
        </span>
        <span className="text-sm sm:text-base text-darkGray font-semibold truncate">
          {value}
        </span>
      </div>
      {showDivider && (
        <div className="hidden sm:block w-px h-12 bg-gray-200 mx-3 flex-shrink-0" />
      )}
    </>
  );

  return (
    <div className="bg-white rounded-md border border-gray-200 p-4 sm:p-5 mt-4 w-full">
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-0 sm:items-center w-full">
        <InfoItem label={leftLabel} value={leftValue} />
        <InfoItem label={rightLabel} value={rightValue} />
        {thirdLabel && thirdValue && (
          <InfoItem label={thirdLabel} value={thirdValue} showDivider={false} />
        )}
      </div>
    </div>
  );
};
