import { ICONS } from "@agensy/constants";
import type { ChecklistField } from "@agensy/types";

interface FormData {
  [key: string]: boolean | string | null;
}
interface ChecklistFieldRendererProps {
  field: ChecklistField;
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  schema: ChecklistField[];
}

// Get nesting level based on parentId chain
const getNestingLevel = (fieldId: string, schema: ChecklistField[]): number => {
  let level = 0;
  let currentField = schema.find((f: ChecklistField) => f.id === fieldId);

  while (currentField?.parentId) {
    level++;
    currentField = schema.find(
      (f: ChecklistField) => f.id === currentField!.parentId
    );
  }

  return level;
};

const getFieldsByParent = (
  parentId: string,
  schema: ChecklistField[]
): ChecklistField[] => {
  return schema.filter((field: ChecklistField) => field.parentId === parentId);
};

// Get all descendant field IDs recursively
const getAllDescendantFieldIds = (
  parentId: string,
  schema: ChecklistField[]
): string[] => {
  const directChildren = getFieldsByParent(parentId, schema);
  let allDescendants: string[] = [];

  directChildren.forEach((child) => {
    allDescendants.push(child.id);
    // Recursively get descendants of this child
    allDescendants = [
      ...allDescendants,
      ...getAllDescendantFieldIds(child.id, schema),
    ];
  });

  return allDescendants;
};

// Check if a field should be visible based on its parent checkbox state
const isFieldVisible = (
  field: ChecklistField,
  formData: FormData,
  schema: ChecklistField[]
): boolean => {
  if (!field.parentId) return true; // Root fields are always visible

  const parent = schema.find((f) => f.id === field.parentId);
  if (!parent) return true;

  // If parent is a checkbox and it's unchecked, hide this field
  if (parent.type === "checkbox" && !formData[parent.id]) {
    return false;
  }

  // If parent is a group, check its parent recursively
  if (parent.type === "group") {
    return isFieldVisible(parent, formData, schema);
  }

  return true;
};

export const FieldRenderer = ({
  field,
  formData,
  setFormData,
  schema,
}: ChecklistFieldRendererProps) => {
  // Check if this field should be visible
  if (!isFieldVisible(field, formData, schema)) {
    return null;
  }

  const nestingLevel = getNestingLevel(field.id, schema);
  const indentationStyle = {
    marginLeft: `${nestingLevel * 12}px`,
    marginBottom: "8px",
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (field.id) {
      setFormData({ ...formData, [field.id]: e.target.value });
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (field.id) {
      const isChecked = e.target.checked;
      const newFormData = { ...formData, [field.id]: isChecked };

      // If unchecking, remove all nested field values
      if (!isChecked) {
        const descendantIds = getAllDescendantFieldIds(field.id, schema);
        descendantIds.forEach((id) => {
          delete newFormData[id];
        });
      }

      setFormData(newFormData);
    }
  };

  if (field.type === "group") {
    const childFields = getFieldsByParent(field.id, schema);

    return (
      <div style={indentationStyle} className="px-2 sm:px-4 md:px-6">
        <div
          className={`${
            nestingLevel === 0
              ? "font-bold text-lg text-primaryColor pl-0"
              : "font-semibold text-sm text-[#374151] pl-1 sm:pl-2 md:pl-[10px]"
          } mb-[10px] flex items-center gap-2 ${
            nestingLevel > 0 ? "border-l-2 border-[#e5e7eb]" : "border-none"
          }`}
        >
          <ICONS.rightSolid className="w-4 h-4 flex-shrink-0" />
          {field.label}
        </div>
        {childFields.map((childField) => (
          <FieldRenderer
            key={childField.id}
            field={childField}
            formData={formData}
            setFormData={setFormData}
            schema={schema}
          />
        ))}
      </div>
    );
  }

  if (field.type === "checkbox") {
    const childFields = getFieldsByParent(field.id, schema);

    return (
      <div style={indentationStyle}>
        <label className="flex items-center w-fit cursor-pointer px-1">
          <input
            type="checkbox"
            checked={field.id ? Boolean(formData[field.id]) : false}
            onChange={handleCheckboxChange}
            className="mr-[8px]"
          />
          <span className="text-[14px]">{field.label}</span>
        </label>
        {/* Render child fields only if checkbox is checked */}
        {field.id &&
          formData[field.id] &&
          childFields.map((childField) => (
            <FieldRenderer
              key={childField.id}
              field={childField}
              formData={formData}
              setFormData={setFormData}
              schema={schema}
            />
          ))}
      </div>
    );
  }

  if (field.type === "radio") {
    return (
      <div style={indentationStyle}>
        <div className="font-medium mb-[6px] text-[14px]">{field.label}</div>
        <div className="ml-1 sm:ml-2 md:ml-[10px]">
          {field.options?.map((option) => (
            <label
              key={option}
              className="flex items-center cursor-pointer mb-[4px]"
            >
              <input
                type="radio"
                name={field.id}
                value={option}
                checked={field.id ? formData[field.id] === option : false}
                onChange={handleChange}
                className="mr-[8px]"
              />
              <span className="text-[13px]">{option}</span>
            </label>
          ))}
        </div>
      </div>
    );
  }

  return null;
};
