import { DATE_FOMRAT } from "@agensy/constants";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

export const formatRelativeTime = (isoDate: string): string => {
  const date = dayjs(isoDate);
  const now = dayjs();
  const diffMinutes = now.diff(date, "minute");
  const diffHours = now.diff(date, "hour");
  const diffDays = now.diff(date, "day");

  if (diffMinutes < 1) {
    return "Just now";
  } else if (diffMinutes < 60) {
    return `${diffMinutes} ${diffMinutes === 1 ? "minute" : "minutes"} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} ${diffHours === 1 ? "hour" : "hours"} ago`;
  } else if (diffDays === 0) {
    return "Today";
  } else if (diffDays === 1) {
    return "Yesterday";
  } else if (diffDays < 7) {
    return `${diffDays} ${diffDays === 1 ? "day" : "days"} ago`;
  } else if (diffDays < 14) {
    return "1 week ago";
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} ${weeks === 1 ? "week" : "weeks"} ago`;
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `${months} ${months === 1 ? "month" : "months"} ago`;
  } else {
    const years = Math.floor(diffDays / 365);
    return `${years} ${years === 1 ? "year" : "years"} ago`;
  }
};
export const formatRelativeTimeShort = (isoDate: string): string => {
  const date = dayjs(isoDate);
  const now = dayjs();
  const diffMinutes = now.diff(date, "minute");
  const diffHours = now.diff(date, "hour");
  const diffDays = now.diff(date, "day");

  if (diffMinutes < 1) {
    return "Just now";
  } else if (diffMinutes < 60) {
    return `${diffMinutes} ${diffMinutes === 1 ? "min" : "mins"} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} ${diffHours === 1 ? "hr" : "hrs"} ago`;
  } else if (diffDays === 0) {
    return "Today";
  } else if (diffDays === 1) {
    return "Yesterday";
  } else if (diffDays < 7) {
    return `${diffDays} ${diffDays === 1 ? "day" : "days"}`;
  } else if (diffDays < 14) {
    return "1 week ago";
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} ${weeks === 1 ? "week" : "weeks"} ago`;
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `${months} ${months === 1 ? "month" : "months"} ago`;
  } else {
    const years = Math.floor(diffDays / 365);
    return `${years} ${years === 1 ? "year" : "years"} ago`;
  }
};

export const formatDateToRequiredFormat = (
  isoDateString: string,
  format?: string
): string => {
  if (!isoDateString) {
    return "";
  }
  const date = dayjs.utc(isoDateString).local();
  return date.format(format || DATE_FOMRAT);
};

export const formatDateTime = (isoDateString: string): string => {
  const date = dayjs.utc(isoDateString).local();
  return date.format(`${DATE_FOMRAT} hh:mm A`);
};

export const formatToTime = (dateStr: string): string => {
  return dayjs(dateStr).format("hh:mm A");
};

export const formatSimpleDate = (isoDate: string): string => {
  const date = dayjs(isoDate);
  const now = dayjs();
  const diffDays = now.diff(date, "day");

  if (diffDays === 0) {
    return "Today";
  } else if (diffDays === 1) {
    return "Yesterday";
  } else {
    return date.format(DATE_FOMRAT);
  }
};

export const changetoISO = (date: string) => {
  return dayjs(date).format("YYYY-MM-DDTHH:mm:ssZ");
};

export const changeMonthYearToISO = (date: string) => {
  if (!date || date.trim() === "") {
    return null;
  }

  if (date.includes("/") && date.split("/").length === 2) {
    const [month, year] = date.split("/");

    const monthNum = parseInt(month, 10);
    const yearNum = parseInt(year, 10);

    if (isNaN(monthNum) || isNaN(yearNum) || monthNum < 1 || monthNum > 12) {
      return null;
    }

    return dayjs(`${year}-${month.padStart(2, "0")}-01`).toISOString();
  }

  try {
    return dayjs(date).toISOString();
  } catch {
    console.warn("Invalid date format:", date);
    return null;
  }
};

export const convertISOToDateFormat = (isoDateString: string): string => {
  if (!isoDateString) {
    return "";
  }
  const date = dayjs.utc(isoDateString).local();
  return date.format(`${DATE_FOMRAT} hh:mm A`);
};
