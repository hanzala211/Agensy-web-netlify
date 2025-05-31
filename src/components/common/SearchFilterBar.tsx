import type React from "react";
import StatefulInput from "./StatefulInput";
import { COLORS, ICONS } from "@agensy/constants";
import StatefulSelect from "./StatefulSelect";
import type { ReactNode } from "react";
import { PrimaryButton } from "./PrimaryButton";
import StatefulDatePicker from "./StatefulDatePicker";

interface SearchFilterBarProps {
  searchPlaceholder: string;
  searchValue: string;
  setSearchValue: (value: string) => void;
  filterBy: string;
  setFilterBy: (value: string) => void;
  sortBy: string;
  setSortBy: (value: string) => void;
  filterData: { label: string; value: string }[];
  sortData: { label: string; value: string }[];
  filterLabel?: string;
  sortLabel?: string;
  showButton?: boolean;
  buttonText?: ReactNode;
  onButtonClick?: () => void;
  showExtraFilter?: boolean;
  extraFilterLabel?: string;
  extraFilterData?: { label: string; value: string }[];
  setExtraFilter?: (value: string) => void;
  extraFilter?: string;
  showDatePicker?: boolean;
  firstDateValue?: string;
  setFirstDateValue?: React.Dispatch<React.SetStateAction<string>>;
  secondDateValue?: string;
  setSecondDateValue?: React.Dispatch<React.SetStateAction<string>>;
  firstDateLabel?: string;
  secondDateLabel?: string;
}

export const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  searchPlaceholder,
  searchValue,
  setSearchValue,
  filterBy,
  setFilterBy,
  sortBy,
  setSortBy,
  filterData,
  sortData,
  filterLabel = "Filter by",
  sortLabel = "Sort by",
  showButton = false,
  buttonText = "Test",
  onButtonClick,
  showExtraFilter = false,
  extraFilterLabel = "Extra Filter",
  extraFilterData = [],
  setExtraFilter,
  extraFilter,
  showDatePicker = false,
  firstDateValue,
  setFirstDateValue,
  secondDateValue,
  setSecondDateValue,
  firstDateLabel = "From",
  secondDateLabel = "To",
}) => {
  return (
    <div className="rounded-xl mb-6">
      <div
        className={`flex flex-col ${
          showDatePicker ? "2xl:flex-row 2xl:items-end" : "xl:flex-row xl:items-end"
        } gap-4`}
      >
        <div className="flex-1">
          <StatefulInput
            icon={ICONS.search}
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            iconSize={18}
            iconColor={COLORS.darkGray}
          />
        </div>

        <div
          className={`flex flex-col ${
            showDatePicker ? "2xl:flex-row 2xl:items-end" : "xl:flex-row xl:items-end"
          } gap-4`}
        >
          {showExtraFilter && (
            <div
              className={`w-full ${showDatePicker ? "2xl:w-48" : "xl:w-48"}`}
            >
              <StatefulSelect
                label={extraFilterLabel}
                name="extraFilter"
                value={extraFilter}
                onChange={(e) => setExtraFilter?.(e.target.value)}
                data={extraFilterData}
              />
            </div>
          )}

          <div className={`w-full ${showDatePicker ? "2xl:w-48" : "xl:w-48"}`}>
            <StatefulSelect
              label={filterLabel}
              name="filterBy"
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              data={filterData}
            />
          </div>

          <div className={`w-full ${showDatePicker ? "2xl:w-48" : "xl:w-48"}`}>
            <StatefulSelect
              label={sortLabel}
              name="sortBy"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              data={sortData}
            />
          </div>
        </div>
        {showButton && (
          <PrimaryButton
            className="!px-6 xl:!w-fit py-3 rounded-xl text-sm font-medium shadow-sm flex items-center justify-center gap-1"
            onClick={onButtonClick}
            aria_label={
              typeof buttonText === "string" ? (buttonText as string) : "Add"
            }
          >
            {buttonText}
          </PrimaryButton>
        )}
        {showDatePicker && (
          <StatefulDatePicker
            value={firstDateValue as string}
            setValue={
              setFirstDateValue as React.Dispatch<React.SetStateAction<string>>
            }
            label={firstDateLabel}
            showTime={true}
            placeholder="Select Date"
          />
        )}
        {showDatePicker && (
          <StatefulDatePicker
            value={secondDateValue as string}
            setValue={
              setSecondDateValue as React.Dispatch<React.SetStateAction<string>>
            }
            label={secondDateLabel}
            showTime={true}
            placeholder="Select Date"
          />
        )}
      </div>
    </div>
  );
};
