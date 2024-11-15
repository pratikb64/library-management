import { MemberSearch } from "../MemberSearch";
import { membersTableColumns } from "./columns";
import { AppTable } from "@/components/AppTable";
import { useMembersStore } from "@/store/members.store";
import { AsyncState } from "@/types";
import { Table } from "@tanstack/react-table";
import { useEffect } from "react";
import { toast } from "sonner";

interface Props {
  pageSize?: number;
  columnVisibility?: Record<string, boolean>;
  showPagination?: boolean;
  setTableInstance?: (table: Table<any> | undefined) => void;
}

export const MembersTable = (props: Props) => {
  const { fetchMembers, members, asyncStates } = useMembersStore();

  useEffect(() => {
    fetchMembers().catch(() => {
      toast.error("Something went wrong, try again later!");
    });
  }, []);

  return (
    <AppTable
      columns={membersTableColumns}
      data={members}
      pageSize={props.pageSize || 12}
      isDataFetching={asyncStates.fetchMembersAsyncState !== AsyncState.Success}
      isDataFetchingFailed={
        asyncStates.fetchMembersAsyncState === AsyncState.Error
      }
      tableSearch={<MemberSearch />}
      columnVisibility={props.columnVisibility}
      showPagination={props.showPagination}
      setTableInstance={props.setTableInstance}
    />
  );
};
