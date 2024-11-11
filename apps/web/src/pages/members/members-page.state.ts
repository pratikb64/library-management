import { Member } from "@/types";
import { createStore, useStore } from "zustand";

interface MembersPageState {
  isAddMemberModalOpen: boolean;
  deleteMemberData?: DeleteMemberObj;
  editMemberData?: EditMemberObj;
}

interface MembersPageActions {
  setIsAddMemberModalOpen: (isAddMemberModalOpen: boolean) => void;
  setDeleteMemberModalData: (args: DeleteMemberObj) => void;
  setEditMemberModalData: (args: EditMemberObj) => void;
}

export type MembersPage = MembersPageState & MembersPageActions;

export const membersPageState = createStore<MembersPage>((set) => ({
  isAddMemberModalOpen: false,
  setIsAddMemberModalOpen: (isAddMemberModalOpen) =>
    set({ isAddMemberModalOpen: isAddMemberModalOpen }),
  setDeleteMemberModalData: (args) => {
    set({ deleteMemberData: args });
  },
  setEditMemberModalData: (args) =>
    set({
      editMemberData: args,
    }),
}));

export const useMembersPageState = () => useStore(membersPageState);

interface DeleteMemberObj {
  isDeleteMemberModalOpen: boolean;
  member?: Member;
}

interface EditMemberObj {
  isEditMemberModalOpen: boolean;
  member?: Member;
}
