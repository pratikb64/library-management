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
import { toast } from "sonner";

export const DeleteMemberModal = () => {
  const { deleteMemberData, setDeleteMemberModalData } = useMembersPageState();
  const { deleteMember } = useMembersStore();

  const onDeleteMember = () => {
    if (!deleteMemberData?.member?.id) return;

    const loadingToastId = toast.loading("Deleting member...");

    try {
      deleteMember(deleteMemberData.member.id);
      setDeleteMemberModalData({
        isDeleteMemberModalOpen: false,
        member: undefined,
      });

      toast.success("Member deleted successfully", { id: loadingToastId });
    } catch (error) {
      toast.error("Something went wrong", { id: loadingToastId });
    }
  };

  return (
    <Dialog
      open={deleteMemberData?.isDeleteMemberModalOpen}
      onOpenChange={(open) =>
        setDeleteMemberModalData({
          isDeleteMemberModalOpen: open,
          member: deleteMemberData?.member,
        })
      }
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
          <Button variant={"destructive"} onClick={onDeleteMember}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
