import { DATE_FOMRAT } from "@agensy/constants";
import dayjs from "dayjs";

export const formatRelativeTime = (isoDate: string): string => {
  const date = dayjs(isoDate);
  const now = dayjs();
  const diffDays = now.diff(date, "day");

  if (diffDays === 0) {
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

export const formatDateToRequiredFormat = (isoDateString: string): string => {
  const date = dayjs(isoDateString);
  return date.format(DATE_FOMRAT);
};

export const formatDateTime = (isoDateString: string): string => {
  const date = dayjs(isoDateString);
  return date.format(`${DATE_FOMRAT} hh:mm A`);
};
