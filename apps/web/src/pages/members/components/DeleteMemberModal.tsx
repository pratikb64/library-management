import { useMembersPageState } from "../members-page.state";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useMembersStore } from "@/store/members.store";
import { AsyncState } from "@/types";
import { toast } from "sonner";

export const DeleteMemberModal = () => {
  const { deleteMemberData, setDeleteMemberModalData } = useMembersPageState();
  const { deleteMember, asyncStates } = useMembersStore();

  const onDeleteMember = async () => {
    if (!deleteMemberData?.member?.id) return;

    const loadingToastId = toast.loading("Deleting member...");

    try {
      await deleteMember(deleteMemberData.member.id);
      setDeleteMemberModalData({
        isDeleteMemberModalOpen: false,
        member: undefined,
      });

      toast.success("Member deleted successfully", { id: loadingToastId });
    } catch (error) {
      toast.error("Something went wrong", { id: loadingToastId });
    }
  };

  const onOpenChange = (isOpen: boolean) => {
    if (asyncStates.deleteMemberAsyncState === AsyncState.Pending) return;
    setDeleteMemberModalData({
      isDeleteMemberModalOpen: isOpen,
      member: deleteMemberData?.member,
    });
  };

  return (
    <Dialog
      open={deleteMemberData?.isDeleteMemberModalOpen}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete member</DialogTitle>
          <Separator />
        </DialogHeader>
        <div className="text-sm">
          Are you sure you want to delete
          <b>
            {` ${deleteMemberData?.member?.first_name} ${deleteMemberData?.member?.last_name} `}
          </b>
          ?
        </div>
        <DialogFooter>
          <Button
            variant={"destructive"}
            onClick={onDeleteMember}
            disabled={asyncStates.deleteMemberAsyncState === AsyncState.Pending}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
