import type { OCRField } from "@agensy/types";

export const capitalizeFirstLetter = (str: string): string => {
  if (!str || str.length === 0) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const filterAndJoinWithCommas = <T>(
  array: T[] | undefined | null,
  accessor: (item: T) => string
): string | null => {
  return array && array.length > 0
    ? (() => {
        const filteredValues = array
          ?.filter((item) => {
            const value = accessor(item);
            return value && value.trim() !== "";
          })
          .map(accessor)
          .join(", ");
        return filteredValues || null;
      })()
    : null;
};

export const extractLinksFromText = (
  text: string
): Array<{ text: string; url?: string }> => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const segments: Array<{ text: string; url?: string }> = [];
  let lastIndex = 0;
  let match;

  while ((match = urlRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ text: text.slice(lastIndex, match.index) });
    }

    segments.push({ text: match[1], url: match[1] });

    lastIndex = match.index + match[1].length;
  }

  if (lastIndex < text.length) {
    segments.push({ text: text.slice(lastIndex) });
  }

  return segments;
};

export const formatKeyLabel = (key: string) => {
  return key
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, (char: string) => char.toUpperCase());
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isFilled(value: any): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === "string" && value.trim() === "") return false;
  if (Array.isArray(value) && value.length === 0) return false;
  if (
    typeof value === "object" &&
    !Array.isArray(value) &&
    Object.keys(value).length === 0
  )
    return false;
  return true; // 0, false, non-empty string/array/object are valid
}

export const mapExtractedDataToFormValues = (
  extractedData: OCRField[],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formDefaults: Record<string, any>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Record<string, any> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filledValues: Record<string, any> = {};

  extractedData.forEach(({ key, value }) => {
    if (key in formDefaults && isFilled(value)) {
      filledValues[key] = value;
    }
  });

  return filledValues;
};
