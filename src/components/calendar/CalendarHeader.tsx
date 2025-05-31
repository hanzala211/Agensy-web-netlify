import React from "react";
import { TertiaryButton, AntdBadge } from "@agensy/components";
import { ICONS } from "@agensy/constants";
import { CalendarUtils } from "@agensy/utils";
import type { ViewMode } from "@agensy/types";

interface CalendarHeaderProps {
  currentDate: Date;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onPrevious: () => void;
  onNext: () => void;
}

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentDate,
  viewMode,
  onViewModeChange,
  onPrevious,
  onNext,
}) => {
  return (
    <div className="flex items-center xl:justify-between xl:flex-row flex-col gap-4 xl:gap-0 mb-4">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-semibold">
          {CalendarUtils.getHeaderDate(currentDate, viewMode)}
        </h2>
        <div className="flex gap-2">
          <TertiaryButton
            onClick={() => onViewModeChange("month")}
            className={`px-3 py-1 ${viewMode === "month" ? "bg-gray-100" : ""}`}
          >
            Month
          </TertiaryButton>
          <TertiaryButton
            onClick={() => onViewModeChange("week")}
            className={`px-3 py-1 md:block hidden ${
              viewMode === "week" ? "bg-gray-100" : ""
            }`}
          >
            Week
          </TertiaryButton>
          <TertiaryButton
            onClick={() => onViewModeChange("day")}
            className={`px-3 py-1 ${viewMode === "day" ? "bg-gray-100" : ""}`}
          >
            Day
          </TertiaryButton>
        </div>
      </div>
      <div className="flex items-center xl:flex-row flex-col md:gap-6">
        <div className="flex gap-2">
          <div className="md:grid grid-cols-2 place-items-center xl:place-items-start gap-3 hidden">
            <AntdBadge status="default" size="large" text="Past Appointment" />
            <AntdBadge status="error" size="large" text="Cancelled" />
            <AntdBadge
              status="success"
              size="large"
              text="Upcoming Appointment"
            />
            <AntdBadge status="processing" size="large" text="Live Now" />
          </div>
        </div>
        <div className="flex gap-2">
          <TertiaryButton
            onClick={onPrevious}
            className="flex items-center justify-center w-12 h-12 p-0"
          >
            <ICONS.leftArrow size={17} />
          </TertiaryButton>
          <TertiaryButton
            onClick={onNext}
            className="flex items-center justify-center w-12 h-12 p-0"
          >
            <ICONS.rightArrow size={17} />
          </TertiaryButton>
        </div>
      </div>
    </div>
  );
};
