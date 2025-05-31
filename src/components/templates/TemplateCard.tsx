import { TertiaryButton } from "@agensy/components";

import { BorderedCard } from "@agensy/components";
import { ICONS, ROUTES } from "@agensy/constants";
import type { Template } from "@agensy/types";
import { useNavigate } from "react-router-dom";
import { DateUtils } from "@agensy/utils";

interface TemplateCardProps {
  template: Template;
  showCompletedDate?: boolean;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  showCompletedDate,
}) => {
  const navigate = useNavigate();

  return (
    <BorderedCard>
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 md:gap-2">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <ICONS.document />
            <span className="font-semibold text-base">{template.title}</span>
          </div>
          <div className="text-sm text-gray-500">
            Type:{" "}
            <span className="font-semibold capitalize">{template.type}</span>
          </div>
          <div className="text-sm text-gray-500">
            Description:{" "}
            <span className="font-semibold">{template.description}</span>
          </div>
          {showCompletedDate && template.completedDate && (
            <div className="text-sm text-gray-500">
              Completed on:{" "}
              <span className="font-semibold">
                {DateUtils.formatDateToRequiredFormat(
                  template.completedDate.toISOString()
                )}
              </span>
            </div>
          )}
        </div>
        <div className="flex gap-2 md:flex-shrink-0">
          <TertiaryButton
            onClick={() => {
              if (showCompletedDate) {
                console.log("Tsst");
                navigate(`fill/${template.id}`);
              } else if (!showCompletedDate) {
                console.log("Test");
              }
            }}
            aria_label={showCompletedDate ? "Download template" : "Fill form"}
            className="hover:bg-green-50 hover:text-green-500 hover:border-green-300"
          >
            {showCompletedDate ? (
              <ICONS.download size={16} />
            ) : (
              <ICONS.edit size={16} />
            )}
          </TertiaryButton>
          {showCompletedDate && (
            <TertiaryButton
              onClick={() => navigate(`${ROUTES.templates}/${template.id}`)}
              aria_label="View template"
              className="hover:bg-blue-50 hover:text-blue-500 hover:border-blue-300"
            >
              <ICONS.eyeOn size={16} />
            </TertiaryButton>
          )}
        </div>
      </div>
    </BorderedCard>
  );
};

export default TemplateCard;
