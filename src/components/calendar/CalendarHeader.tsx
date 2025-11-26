import React from "react";
import { AntdBadge, StatefulSelect } from "@agensy/components";
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
    <div className="flex items-center 2xl:justify-between 2xl:flex-row flex-col gap-3 mb-4">
      <div className="flex items-center gap-3 w-full justify-between 2xl:justify-start 2xl:w-fit">
        <h2 className="sm:text-base text-xs font-semibold text-gray-800">
          {CalendarUtils.getHeaderDate(currentDate, viewMode)}
        </h2>
        <div className="flex gap-1.5 bg-gray-100 p-1 rounded-md">
          <button
            onClick={() => onViewModeChange("month")}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-300 ${
              viewMode === "month"
                ? "bg-white text-primaryColor shadow-[0_0_8px_rgba(0,0,0,0.08)]"
                : "text-gray-600 hover:text-primaryColor"
            }`}
          >
            Month
          </button>
          <button
            onClick={() => onViewModeChange("week")}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-300 ${
              viewMode === "week"
                ? "bg-white text-primaryColor shadow-[0_0_8px_rgba(0,0,0,0.08)]"
                : "text-gray-600 hover:text-primaryColor"
            }`}
          >
            Week
          </button>
          <button
            onClick={() => onViewModeChange("day")}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-300 ${
              viewMode === "day"
                ? "bg-white text-primaryColor shadow-[0_0_8px_rgba(0,0,0,0.08)]"
                : "text-gray-600 hover:text-primaryColor"
            }`}
          >
            Day
          </button>
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
          />
        </div>
        <div className="w-full 2xl:w-48">
          <StatefulSelect
            label="Type"
            name="type"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            data={APPOINTMENT_TYPE_FILTERS}
          />
        </div>
      </div>
      <div className="flex items-center 2xl:flex-row w-full 2xl:w-fit mt-3 2xl:mt-0 flex-col gap-3">
        <div className="flex gap-3 w-full 2xl:w-fit">
          <div className="sm:grid w-full 2xl:grid-cols-2 grid-cols-4 place-items-center 2xl:place-items-start gap-3 hidden">
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
          <button
            onClick={onPrevious}
            className="flex items-center justify-center w-10 h-10 rounded-lg text-gray-600 hover:text-primaryColor hover:bg-gray-100 transition-all duration-300 focus:outline-none"
          >
            <ICONS.leftArrow size={20} />
          </button>
          <button
            onClick={onNext}
            className="flex items-center justify-center w-10 h-10 rounded-lg text-gray-600 hover:text-primaryColor hover:bg-gray-100 transition-all duration-300 focus:outline-none"
          >
            <ICONS.rightArrow size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
