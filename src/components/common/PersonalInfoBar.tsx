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
  return (
    <div className="flex flex-col md:flex-row gap-4 items-center place-items-center mt-4 w-full justify-between md:justify-start">
      <p className="w-fit p-1">
        {leftLabel}:{" "}
        <span className="text-darkGray font-bold">{leftValue}</span>
      </p>
      <div className="bg-mediumGray md:w-fit w-full border-mediumGray p-[1px] md:py-5" />
      <p>
        {rightLabel}:{" "}
        <span className="text-darkGray font-bold">{rightValue}</span>
      </p>
      {thirdLabel && (
        <>
          <div className="bg-mediumGray md:w-fit w-full border-mediumGray p-[1px] md:py-5" />
          <p>
            {thirdLabel}:{" "}
            <span className="text-darkGray font-bold">{thirdValue}</span>
          </p>
        </>
      )}
    </div>
  );
};
