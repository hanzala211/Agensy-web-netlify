import { ICONS } from "@agensy/constants";

export const MultipleTextInputs = ({
  label,
  value = [],
  onChange,
  error,
}: {
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
  error?: string;
}) => {
  const addItem = () => {
    onChange([...value, ""]);
  };

  const removeItem = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, newValue: string) => {
    const newArray = [...value];
    newArray[index] = newValue;
    onChange(newArray);
  };

  // Ensure value is always an array
  const safeValue = Array.isArray(value) ? value : [];

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      {safeValue.map((item, index) => (
        <div key={index} className="flex gap-2">
          <div className="flex-1">
            <input
              type="text"
              value={item || ""}
              onChange={(e) => updateItem(index, e.target.value)}
              className=" text-darkGray bg-lightGray placeholder:text-darkGray p-2
            border-[1px] border-mediumGray rounded-xl w-full outline-none focus-within:border-basicBlue focus-within:shadow-sm focus-within:shadow-blue-200 transition-all duration-200"
              placeholder={`Enter ${label.toLowerCase()} item ${index + 1}`}
            />
          </div>
          {safeValue.length > 1 && (
            <button
              type="button"
              onClick={() => removeItem(index)}
              className="px-3 py-2 text-red-600 border border-red-200 rounded-md hover:bg-red-50 hover:border-red-300 transition-colors"
            >
              <ICONS.delete />
            </button>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={addItem}
        className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm"
      >
        <ICONS.plus />
        Add {label} Item
      </button>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};
