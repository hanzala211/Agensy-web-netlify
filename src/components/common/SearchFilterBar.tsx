import type React from "react";
import StatefulInput from "./StatefulInput";
import { COLORS, ICONS } from "@agensy/constants";
import StatefulSelect from "./StatefulSelect";
import type { ReactNode } from "react";
import { PrimaryButton } from "./PrimaryButton";
import StatefulDatePicker from "./StatefulDatePicker";

interface SearchFilterBarProps {
  searchPlaceholder?: string;
  searchValue?: string;
  setSearchValue?: (value: string) => void;
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
  customFilterWidth?: string;
  applyWidth?: boolean;
  label?: string;
  moveToNextLine?: boolean; // Move date pickers to next line with border top
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
  customFilterWidth,
  applyWidth = true,
  label = "",
  moveToNextLine = true,
}) => {
  return (
    <div className="mb-4">
      <div className="bg-white rounded-md border border-gray-200 md2:p-4 p-3">
        {/* Main Search and Filter Row */}
        <div className="flex flex-col xl:flex-row gap-3 items-start xl:items-end">
          {/* Search Input - Takes more space */}
          {searchPlaceholder && searchValue !== undefined && setSearchValue && (
            <div
              className={`flex-1 w-full ${
                applyWidth ? "lg=:max-w-md xl:max-w-lg" : "lg:max-w-sm"
              }`}
            >
              <StatefulInput
                icon={ICONS.search}
                label={label}
                placeholder={searchPlaceholder}
                value={searchValue}
                onChange={(e) => setSearchValue?.(e.target.value.trimStart())}
                iconSize={16}
                iconColor={COLORS.darkGray}
              />
            </div>
          )}

          {/* Filters Group */}
          <div className="flex flex-col md2:flex-row gap-2.5 flex-1 xl:flex-initial xl:w-fit w-full">
            {showExtraFilter && (
              <div
                className={`w-full md2:flex-1 ${
                  customFilterWidth || "md2:max-w-[180px] xl:max-w-[200px]"
                }`}
                style={customFilterWidth ? { width: customFilterWidth } : {}}
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

            <div
              className={`w-full md2:flex-1 ${
                customFilterWidth || "md2:max-w-[180px] xl:max-w-[200px]"
              }`}
              style={customFilterWidth ? { width: customFilterWidth } : {}}
            >
              <StatefulSelect
                label={filterLabel}
                name="filterBy"
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
                data={filterData}
              />
            </div>

            <div
              className={`w-full md2:flex-1 ${
                customFilterWidth || "md2:max-w-[180px] xl:max-w-[200px]"
              }`}
              style={customFilterWidth ? { width: customFilterWidth } : {}}
            >
              <StatefulSelect
                label={sortLabel}
                name="sortBy"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                data={sortData}
              />
            </div>
          </div>

          {/* Date Pickers - On same line when moveToNextLine is false */}
          {showDatePicker && !moveToNextLine && (
            <div className="flex md2:flex-row flex-col gap-2.5 flex-1 xl:flex-initial w-full xl:w-fit">
              <div className="flex-1 min-w-0 md2:max-w-xs">
                <StatefulDatePicker
                  divClass="w-full"
                  value={firstDateValue as string}
                  setValue={
                    setFirstDateValue as React.Dispatch<
                      React.SetStateAction<string>
                    >
                  }
                  label={firstDateLabel}
                  showTime={true}
                  placeholder="Select Date"
                />
              </div>
              <div className="flex-1 min-w-0 md2:max-w-xs">
                <StatefulDatePicker
                  divClass="w-full"
                  value={secondDateValue as string}
                  setValue={
                    setSecondDateValue as React.Dispatch<
                      React.SetStateAction<string>
                    >
                  }
                  label={secondDateLabel}
                  showTime={true}
                  placeholder="Select Date"
                />
              </div>
            </div>
          )}

          {/* Action Button */}
          {showButton && (
            <PrimaryButton
              className="w-full xl:w-auto !min-h-[40px] !text-sm !px-4 !py-2 whitespace-nowrap"
              onClick={onButtonClick}
              aria_label={
                typeof buttonText === "string" ? (buttonText as string) : "Add"
              }
            >
              {buttonText}
            </PrimaryButton>
          )}
        </div>

        {/* Date Pickers - On next line when moveToNextLine is true */}
        {showDatePicker && moveToNextLine && (
          <div className="flex flex-col sm:flex-row gap-2.5 mt-3 pt-3 border-t border-gray-100">
            <div className="flex-1 sm:max-w-xs">
              <StatefulDatePicker
                divClass="w-full"
                value={firstDateValue as string}
                setValue={
                  setFirstDateValue as React.Dispatch<
                    React.SetStateAction<string>
                  >
                }
                label={firstDateLabel}
                showTime={true}
                placeholder="Select Date"
              />
            </div>
            <div className="flex-1 sm:max-w-xs">
              <StatefulDatePicker
                divClass="w-full"
                value={secondDateValue as string}
                setValue={
                  setSecondDateValue as React.Dispatch<
                    React.SetStateAction<string>
                  >
                }
                label={secondDateLabel}
                showTime={true}
                placeholder="Select Date"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
