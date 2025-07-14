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
