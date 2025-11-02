import type { UseFormRegisterReturn } from "react-hook-form";
import { ErrorMessage } from "@agensy/components";

interface TextAreaProps {
  label?: string;
  placeholder?: string;
  className?: string;
  name?: string;
  rows?: number;
  error?: string;
  register?: UseFormRegisterReturn;
}

export const TextArea: React.FC<TextAreaProps> = ({
  label,
  placeholder,
  className,
  name,
  rows = 4,
  error,
  register,
}) => {
  return (
    <div className="space-y-2">
      <div className="flex gap-2 flex-col relative w-full">
        {label && !placeholder && <label htmlFor={name}>{label}</label>}
        <textarea
          {...register}
          id={name}
          placeholder={placeholder}
          rows={rows}
          className={`${className} resize-none text-darkGray bg-lightGray placeholder:text-darkGray p-2
          border-[1px] border-mediumGray rounded-md w-full outline-none focus-within:border-basicBlue focus-within:shadow-sm focus-within:shadow-blue-200 transition-all duration-200`}
        />
      </div>
      {error && <ErrorMessage error={error} />}
    </div>
  );
};

export default TextArea;
