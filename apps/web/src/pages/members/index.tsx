import { AddMemberModal } from "./components/AddMemberModal";
import { DeleteMemberModal } from "./components/DeleteMemberModal";
import { EditMemberModal } from "./components/EditMemberModal";
import { MembersPageActions } from "./components/MembersPageActions";
import { MembersTable } from "./components/MembersTable";
import { AppLayout } from "@/components/app-layout";

export const MembersPage = () => {
  return (
    <AppLayout title={"Members"} actions={<MembersPageActions />}>
      <MembersTable
        columnVisibility={{
          selectRow: false,
        }}
        showPagination={true}
      />
      <AddMemberModal />
      <DeleteMemberModal />
      <EditMemberModal />
    </AppLayout>
  );
};
