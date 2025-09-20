import { ICONS } from "@agensy/constants";
import type { ChecklistField } from "@agensy/types";
import { StringUtils } from "@agensy/utils";

interface FormData {
  [key: string]: boolean | string | null;
}
interface ChecklistFieldRendererProps {
  field: ChecklistField;
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  schema: ChecklistField[];
}

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

const getAllDescendantFieldIds = (
  parentId: string,
  schema: ChecklistField[]
): string[] => {
  const directChildren = getFieldsByParent(parentId, schema);
  let allDescendants: string[] = [];

  directChildren.forEach((child) => {
    allDescendants.push(child.id);
    allDescendants = [
      ...allDescendants,
      ...getAllDescendantFieldIds(child.id, schema),
    ];
  });

  return allDescendants;
};

const isFieldVisible = (
  field: ChecklistField,
  formData: FormData,
  schema: ChecklistField[]
): boolean => {
  if (!field.parentId) return true;

  const parent = schema.find((f) => f.id === field.parentId);
  if (!parent) return true;

  if (parent.type === "checkbox" && !formData[parent.id]) {
    return false;
  }

  if (parent.type === "radio") {
    const selectedOption = formData[parent.id];

    if (field.parentOption) {
      return selectedOption === field.parentOption;
    }

    return selectedOption !== undefined && selectedOption !== null;
  }

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
  if (!isFieldVisible(field, formData, schema)) {
    return null;
  }

  const nestingLevel = getNestingLevel(field.id, schema);
  const indentationStyle = {
    marginLeft: `${nestingLevel * 12}px`,
    marginBottom: "8px",
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (field.id) {
      const isChecked = e.target.checked;
      const newFormData = { ...formData, [field.id]: isChecked };

      if (!isChecked) {
        const descendantIds = getAllDescendantFieldIds(field.id, schema);
        descendantIds.forEach((id) => {
          delete newFormData[id];
        });
      }

      setFormData(newFormData);
    }
  };

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (field.id) {
      const selectedValue = e.target.value;
      const newFormData = { ...formData, [field.id]: selectedValue };

      const descendantIds = getAllDescendantFieldIds(field.id, schema);
      descendantIds.forEach((id) => {
        delete newFormData[id];
      });

      setFormData(newFormData);
    }
  };

  if (field.type === "group") {
    const childFields = getFieldsByParent(field.id, schema);

    return (
      <div className="px-2 sm:px-4 md:px-6">
        <div
          className={`${
            nestingLevel === 0
              ? "font-bold text-lg text-primaryColor pl-0"
              : "font-semibold text-sm text-[#374151] pl-1 sm:pl-2 md:pl-[10px]"
          } mb-[10px] flex items-center gap-2 ${
            nestingLevel > 0 ? "border-l-2 border-[#e5e7eb]" : "border-none"
          }`}
          style={indentationStyle}
        >
          <ICONS.rightSolid className="w-4 h-4 flex-shrink-0" />
          {field.label}
        </div>
        <div style={{ marginLeft: `${(nestingLevel + 1) * 12}px` }}>
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
      </div>
    );
  }

  if (field.type === "checkbox") {
    const childFields = getFieldsByParent(field.id, schema);

    return (
      <div>
        <label
          className="flex items-center w-fit cursor-pointer px-1"
          style={indentationStyle}
        >
          <input
            type="checkbox"
            checked={field.id ? Boolean(formData[field.id]) : false}
            onChange={handleCheckboxChange}
            className={`mr-[8px] w-3.5 h-3.5 flex-shrink-0 ${
              !field.parentId ? "ml-4" : ""
            }`}
          />
          <span
            className={`${
              !field.parentId
                ? "font-bold text-lg text-primaryColor ml-2"
                : "text-[14px]"
            }`}
          >
            {field.label}
          </span>
        </label>
        {field.id && formData[field.id] && childFields.length > 0 && (
          <div style={{ marginLeft: `${(nestingLevel + 1) * 12}px` }}>
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
        )}
      </div>
    );
  }

  if (field.type === "radio") {
    const childFields = getFieldsByParent(field.id, schema);

    return (
      <div>
        <div
          className="font-medium mb-[6px] text-[14px]"
          style={indentationStyle}
        >
          {field.label}
        </div>
        <div className="ml-1 sm:ml-2 md:ml-[10px]">
          {field.options?.map((option) => (
            <div key={option}>
              <label className="flex items-center cursor-pointer mb-[4px]">
                <input
                  type="radio"
                  name={field.id}
                  value={option}
                  checked={field.id ? formData[field.id] === option : false}
                  onChange={handleRadioChange}
                  className="mr-[8px]"
                />
                <span className="text-[13px]">{option}</span>
              </label>
              {field.id &&
                formData[field.id] === option &&
                childFields
                  .filter(
                    (childField) =>
                      !childField.parentOption ||
                      childField.parentOption === option
                  )
                  .map((childField) => (
                    <div
                      key={childField.id}
                      style={{ marginLeft: `${(nestingLevel + 1) * 12}px` }}
                    >
                      <FieldRenderer
                        field={childField}
                        formData={formData}
                        setFormData={setFormData}
                        schema={schema}
                      />
                    </div>
                  ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (field.type === "link") {
    const segments = StringUtils.extractLinksFromText(field.label);

    return (
      <div className="px-2 sm:px-4 md:px-6">
        <div
          className={`font-semibold text-sm text-primaryColor pl-1 sm:pl-2 md:pl-[10px] mb-[10px] flex items-center gap-2`}
          style={indentationStyle}
        >
          <ICONS.rightSolid className="w-4 h-4 flex-shrink-0" />
          <div className="text-[14px] leading-relaxed">
            {segments.map(
              (segment: { text: string; url?: string }, index: number) => (
                <span key={index}>
                  {segment.url ? (
                    <a
                      href={segment.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline break-all"
                    >
                      {segment.text}
                    </a>
                  ) : (
                    segment.text
                  )}
                </span>
              )
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
};
