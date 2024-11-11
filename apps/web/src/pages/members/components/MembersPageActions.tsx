import { useMembersPageState } from "../members-page.state";
import { Button } from "@/components/ui/button";

export const MembersPageActions = () => {
  const { setIsAddMemberModalOpen } = useMembersPageState();

  return (
    <div className="flex gap-2">
      <Button onClick={() => setIsAddMemberModalOpen(true)} size={"sm"}>
        Add member
      </Button>
    </div>
  );
};
