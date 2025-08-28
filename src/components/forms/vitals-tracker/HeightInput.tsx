import { StatefulInput } from "@agensy/components";
import { useState, useEffect } from "react";

interface HeightInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const HeightInput = ({ value, onChange }: HeightInputProps) => {
  const [feet, setFeet] = useState("");
  const [inches, setInches] = useState("");

  // Parse initial value (e.g., "5'11''" -> feet: "5", inches: "11")
  useEffect(() => {
    if (value) {
      const match = value.match(/^(\d+)'(\d+)''$/);
      if (match) {
        setFeet(match[1]);
        setInches(match[2]);
      }
    }
  }, [value]);

  const handleFeetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFeet = e.target.value;
    const feetNum = parseInt(newFeet) || 0;
    setFeet(newFeet);

    // Convert to format and update parent
    const heightString = `${feetNum}'${inches || "0"}''`;
    onChange(heightString);
  };

  const handleInchesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newInches = e.target.value;
    const inchesNum = parseInt(newInches) || 0;

    if (inchesNum >= 12) {
      // Convert to next foot
      const currentFeet = parseInt(feet) || 0;
      const newFeet = currentFeet + Math.floor(inchesNum / 12);
      const remainingInches = inchesNum % 12;

      setFeet(String(newFeet));
      setInches(String(remainingInches));

      const heightString = `${newFeet}'${remainingInches}''`;
      onChange(heightString);
    } else {
      setInches(newInches);

      const currentFeet = parseInt(feet) || 0;
      const heightString = `${currentFeet}'${inchesNum}''`;
      onChange(heightString);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-1 items-center min-w-[80px]">
      <div className="flex items-center gap-1">
        <StatefulInput
          label=""
          type="number"
          value={feet}
          onChange={handleFeetChange}
          placeholder="0"
          inputClassname="w-10 sm:w-12 text-center text-sm"
        />
        <span className="text-gray-600 font-medium text-sm">'</span>
      </div>
      <div className="flex items-center gap-1">
        <StatefulInput
          label=""
          type="number"
          value={inches}
          onChange={handleInchesChange}
          placeholder="0"
          inputClassname="w-10 sm:w-12 text-center text-sm"
        />
        <span className="text-gray-600 font-medium text-sm">''</span>
      </div>
    </div>
  );
};
