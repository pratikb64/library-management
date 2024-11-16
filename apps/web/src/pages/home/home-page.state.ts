import { getStatsService } from "@/services/stats.service";
import { AsyncState, Stats } from "@/types";
import { createStore, useStore } from "zustand";

interface HomesPageState {
  stats?: Stats;
  asyncStates: {
    fetchStatsAsyncState: AsyncState;
  };
}

interface HomesPageActions {
  fetchStats: () => Promise<void>;
}

export type HomesPage = HomesPageState & HomesPageActions;

export const HomesPageState = createStore<HomesPage>((set) => ({
  asyncStates: {
    fetchStatsAsyncState: AsyncState.Idle,
  },
  fetchStats: async () => {
    set((state) => ({
      asyncStates: {
        ...state.asyncStates,
        fetchStatsAsyncState: AsyncState.Pending,
      },
    }));

    const stats = await getStatsService()
      .then((res) => res)
      .catch(() => null);

    if (!stats) {
      set((state) => ({
        asyncStates: {
          ...state.asyncStates,
          fetchStatsAsyncState: AsyncState.Error,
        },
      }));
      return Promise.reject();
    }

    set((state) => ({
      stats: stats.data,
      asyncStates: {
        ...state.asyncStates,
        fetchStatsAsyncState: AsyncState.Success,
      },
    }));
  },
}));

export const useHomesPageState = () => useStore(HomesPageState);
