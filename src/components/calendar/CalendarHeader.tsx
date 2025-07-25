import React from "react";
import { TertiaryButton, AntdBadge, StatefulSelect } from "@agensy/components";
import { APPOINTMENT_TYPE_FILTERS, ICONS } from "@agensy/constants";
import { CalendarUtils } from "@agensy/utils";
import type { Client, ViewMode } from "@agensy/types";
import { useAuthContext } from "@agensy/context";

interface CalendarHeaderProps {
  currentDate: Date;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onPrevious: () => void;
  onNext: () => void;
  clientFilter: string;
  setClientFilter: (filter: string) => void;
  typeFilter: string;
  setTypeFilter: (filter: string) => void;
}

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentDate,
  viewMode,
  onViewModeChange,
  onPrevious,
  onNext,
  clientFilter,
  setClientFilter,
  typeFilter,
  setTypeFilter,
}) => {
  const { clients } = useAuthContext();

  return (
    <div className="flex items-center 2xl:justify-between 2xl:flex-row flex-col gap-4 xl:gap-0 mb-4">
      <div className="flex items-baseline gap-4 w-full justify-between 2xl:justify-start 2xl:w-fit">
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
      <div className="flex 2xl:flex-row w-full 2xl:w-fit flex-col gap-2">
        <div className="w-full 2xl:w-48">
          <StatefulSelect
            label="Care Recipient"
            name="client"
            value={clientFilter}
            onChange={(e) => setClientFilter(e.target.value)}
            data={[
              { label: "All", value: "all" },
              ...(clients?.map((client: Client) => ({
                label: `${client.first_name} ${client.last_name}`,
                value: client.id as string,
              })) || []),
            ]}
            className="!p-2 !h-10 !w-full"
          />
        </div>
        <div className="w-full 2xl:w-48">
          <StatefulSelect
            label="Type"
            name="type"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            data={APPOINTMENT_TYPE_FILTERS}
            className="!p-2 !h-10"
          />
        </div>
      </div>
      <div className="flex items-center 2xl:flex-row w-full 2xl:w-fit mt-4 2xl:mt-0 flex-col md:gap-6">
        <div className="flex gap-2 w-full 2xl:w-fit">
          <div className="sm:grid w-full 2xl:grid-cols-2 grid-cols-4 place-items-center  2xl:place-items-start gap-3 hidden">
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
        <div className="flex gap-2 2xl:justify-normal justify-between 2xl:w-fit w-full">
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
