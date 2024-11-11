import { AddMemberModal } from "./components/AddMemberModal";
import { DeleteMemberModal } from "./components/DeleteMemberModal";
import { EditMemberModal } from "./components/EditMemberModal";
import { MembersPageActions } from "./components/MembersPageActions";
import { MembersTable } from "./components/MembersTable";
import { AppLayout } from "@/components/app-layout";
import { useMembersStore } from "@/store/members.store";
import { useEffect } from "react";
import { toast } from "sonner";

export const MembersPage = () => {
  const { fetchMembers } = useMembersStore();

  useEffect(() => {
    fetchMembers().catch(() => {
      toast.error("Something went wrong, try again later!");
    });
  }, []);

  return (
    <AppLayout title={"Members"} actions={<MembersPageActions />}>
      <MembersTable />
      <AddMemberModal />
      <DeleteMemberModal />
      <EditMemberModal />
    </AppLayout>
  );
};
