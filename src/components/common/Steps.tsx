import type React from "react";

interface StepsProps {
  totalSteps: number;
  step: number;
}

export const Steps: React.FC<StepsProps> = ({ totalSteps, step }) => {
  return (
    <div className="flex justify-center mb-8">
      <div className="flex items-center">
        {[...Array(totalSteps)].map((_, index) => (
          <div key={index} className="flex items-center">
            <div
              className={`flex items-center justify-center h-8 w-8 rounded-full border-2 transition-colors ${
                step > index + 1
                  ? "bg-blue-600 border-blue-600 text-white"
                  : step === index + 1
                  ? "border-blue-600 text-blue-600"
                  : "border-gray-300 text-gray-400"
              }`}
            >
              {step > index + 1 ? "✓" : index + 1}
            </div>
            {index < totalSteps - 1 && (
              <div
                className={`w-16 h-1 mx-1 ${
                  step > index + 1 ? "bg-blue-600" : "bg-gray-300"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Steps;
