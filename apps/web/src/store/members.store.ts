import {
  createMemberService,
  deleteMemberService,
  GetMembersArgs,
  getMembersService,
  updateMemberService,
} from "@/services/members.services";
import { AsyncState, Member } from "@/types";
import { createStore, useStore } from "zustand";

interface MembersState {
  members: Member[];
  asyncStates: {
    fetchMembersAsyncState: AsyncState;
    createMemberAsyncState: AsyncState;
    deleteMemberAsyncState: AsyncState;
    updateMemberAsyncState: AsyncState;
  };
}

interface MembersActions {
  fetchMembers: (args?: GetMembersArgs) => Promise<void>;
  createMember: (member: Omit<Member, "id" | "joining_date">) => Promise<void>;
  deleteMember: (id: number) => Promise<void>;
  updateMember: (id: number, member: Partial<Member>) => Promise<void>;
}

export type MembersStore = MembersState & MembersActions;

export const membersStore = createStore<MembersStore>((set) => ({
  members: [],
  asyncStates: {
    fetchMembersAsyncState: AsyncState.Idle,
    createMemberAsyncState: AsyncState.Idle,
    deleteMemberAsyncState: AsyncState.Idle,
    updateMemberAsyncState: AsyncState.Idle,
  },
  fetchMembers: async (args) => {
    set((state) => ({
      asyncStates: {
        ...state.asyncStates,
        fetchMembersAsyncState: AsyncState.Pending,
      },
      members: [],
    }));

    const members = await getMembersService(args)
      .then((res) => res)
      .catch(() => null);

    if (!members) {
      set((state) => ({
        members: [],
        asyncStates: {
          ...state.asyncStates,
          fetchMembersAsyncState: AsyncState.Error,
        },
      }));
      return Promise.reject();
    }

    set({ members: members.data });

    set((state) => ({
      asyncStates: {
        ...state.asyncStates,
        fetchMembersAsyncState: AsyncState.Success,
      },
    }));
  },
  createMember: async (member) => {
    set((state) => ({
      asyncStates: {
        ...state.asyncStates,
        createMemberAsyncState: AsyncState.Pending,
      },
    }));

    // Create member
    const createdMember = await createMemberService(member)
      .then((res) => res)
      .catch(() => null);

    if (!createdMember) {
      set((state) => ({
        asyncStates: {
          ...state.asyncStates,
          createMemberAsyncState: AsyncState.Error,
        },
      }));
      return Promise.reject();
    }

    // Add created member to state
    set((state) => ({
      members: [...state.members, createdMember.data],
      asyncStates: {
        ...state.asyncStates,
        createMemberAsyncState: AsyncState.Success,
      },
    }));
  },
  deleteMember: async (id) => {
    set((state) => ({
      asyncStates: {
        ...state.asyncStates,
        deleteMemberAsyncState: AsyncState.Pending,
      },
    }));

    const isDeleted = await deleteMemberService(id)
      .then((res) => res)
      .catch(() => null);

    if (!isDeleted) {
      set((state) => ({
        asyncStates: {
          ...state.asyncStates,
          deleteMemberAsyncState: AsyncState.Error,
        },
      }));
      return Promise.reject();
    }

    set((state) => ({
      members: state.members.filter((member) => member.id !== id),
      asyncStates: {
        ...state.asyncStates,
        deleteMemberAsyncState: AsyncState.Success,
      },
    }));
  },
  updateMember: async (id, member) => {
    set((state) => ({
      asyncStates: {
        ...state.asyncStates,
        updateMemberAsyncState: AsyncState.Pending,
      },
    }));

    // Update member
    const updatedMember = await updateMemberService({ id, member: member })
      .then((res) => res)
      .catch(() => null);

    if (!updatedMember) {
      set((state) => ({
        asyncStates: {
          ...state.asyncStates,
          updateMemberAsyncState: AsyncState.Error,
        },
      }));
      return Promise.reject();
    }

    // Update member in state
    set((state) => ({
      members: state.members.map((b) => (b.id === id ? updatedMember.data : b)),
      asyncStates: {
        ...state.asyncStates,
        updateMemberAsyncState: AsyncState.Success,
      },
    }));
  },
}));

export const useMembersStore = () => useStore(membersStore);
