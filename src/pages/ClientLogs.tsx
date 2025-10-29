import React, { useEffect, useMemo, useState } from "react";
import {
  CommonLoader,
  EmptyStateCard,
  LogsCard,
  Pagination,
  SearchFilterBar,
} from "@agensy/components";
import { FORM_TYPE_OPTIONS, ICONS, SORT_OPTIONS } from "@agensy/constants";
import type { Client, LogEntry } from "@agensy/types";
import { useParams } from "react-router-dom";
import { useGetClientAuditLogs } from "@agensy/api";
import { DateUtils } from "@agensy/utils";
import { useQueryClient } from "@tanstack/react-query";

const ITEMS_PER_PAGE = 6;

type AuditLogsApiResponse = {
  audits: LogEntry[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export const ClientLogs: React.FC = () => {
  const { clientId } = useParams();
  const queryClient = useQueryClient();
  const [filterBy, setFilterBy] = useState("all");
  const [sortBy, setSortBy] = useState("DESC");
  const [userFilter, setUserFilter] = useState("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const queryParams = useMemo(
    () => ({
      page: currentPage,
      limit: ITEMS_PER_PAGE,
      form_type: filterBy !== "all" ? filterBy : undefined,
      userId: userFilter !== "all" ? userFilter : undefined,
      from_date: from ? DateUtils.changetoISO(from) : undefined,
      to_date: to ? DateUtils.changetoISO(to) : undefined,
      sort_order: sortBy,
    }),
    [currentPage, filterBy, userFilter, from, to, sortBy]
  );

  const { data: auditLogsResponse, isFetching: isAuditLogsFetching } =
    useGetClientAuditLogs(clientId as string, queryParams);

  const userOptions = useMemo(() => {
    const client = queryClient.getQueryData(["client", clientId]) as Client;
    if (!client?.Users) return [{ label: "All", value: "all" }];

    const users = client.Users.map((user) => ({
      label: `${user.first_name} ${user.last_name}`,
      value: user.id as string,
    }));
    return [{ label: "All", value: "all" }, ...users];
  }, [clientId]);

  useEffect(() => {
    const resp = auditLogsResponse as AuditLogsApiResponse | undefined;
    setTotalPages(resp?.pagination?.totalPages ?? 1);
    setLogs(resp?.audits ?? []);
  }, [auditLogsResponse]);

  const handlePrevPage = () => setCurrentPage((p) => Math.max(1, p - 1));
  const handleNextPage = () =>
    setCurrentPage((p) => Math.min(totalPages, p + 1));

  useEffect(() => {
    setCurrentPage(1);
  }, [filterBy, userFilter, from, to, sortBy]);

  return (
    <div className="space-y-6">
      <SearchFilterBar
        filterBy={filterBy}
        setFilterBy={setFilterBy}
        sortBy={sortBy}
        setSortBy={setSortBy}
        filterData={FORM_TYPE_OPTIONS.map(({ label, value }) => ({
          label,
          value,
        }))}
        sortData={SORT_OPTIONS}
        filterLabel="Form"
        sortLabel="Sort by"
        showExtraFilter={true}
        extraFilterLabel="User"
        extraFilterData={userOptions}
        setExtraFilter={setUserFilter}
        extraFilter={userFilter}
        showDatePicker={true}
        firstDateValue={from}
        setFirstDateValue={setFrom}
        secondDateValue={to}
        setSecondDateValue={setTo}
        firstDateLabel="From"
        secondDateLabel="To"
        customFilterWidth="sm:!min-w-[210px] !min-w-full"
        moveToNextLine={false}
      />

      <div className="space-y-1">
        {isAuditLogsFetching ? (
          <div className="flex justify-center items-center h-screen">
            <CommonLoader />
          </div>
        ) : logs.length === 0 ? (
          <EmptyStateCard ICON={ICONS.fileAlt} label="Logs" showText={false} />
        ) : (
          logs.map((item) => <LogsCard key={item.id} {...item} />)
        )}
      </div>

      {logs.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPrevPage={handlePrevPage}
          onNextPage={handleNextPage}
        />
      )}
    </div>
  );
};

export default ClientLogs;
