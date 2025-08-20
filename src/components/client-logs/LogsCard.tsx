import { BorderedCard } from "@agensy/components";
import { FORM_TYPE_OPTIONS, ICONS } from "@agensy/constants";
import type { LogEntry } from "@agensy/types";
import { DateUtils } from "@agensy/utils";

export const LogsCard = (log: LogEntry) => {
  const label =
    FORM_TYPE_OPTIONS.find((o) => o.value === log.form_type)?.label ||
    log.form_type;
  const userName = `${log.user.first_name} ${log.user.last_name}`;
  return (
    <BorderedCard
      key={log.id}
      className="flex items-start justify-between gap-4"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-lightBlue flex items-center justify-center">
          <ICONS.fileTextIcon className="text-primaryColor" />
        </div>
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-darkGray">{label}</span>
          </div>
          <div className="text-sm text-slateGrey mt-1">
            <span>By {userName}</span>
            <span className="mx-2">•</span>
            <span title={DateUtils.formatDateTime(log.created_at)}>
              {DateUtils.formatRelativeTime(log.created_at)}
            </span>
          </div>
        </div>
      </div>
    </BorderedCard>
  );
};
