import { RecentMembers } from "./components/RecentMembers";
import { RecentTransactions } from "./components/RecentTransactions";
import { StatCards } from "./components/StatCards";
import { useHomesPageState } from "./home-page.state";
import { AppLayout } from "@/components/app-layout";
import { useEffect } from "react";
import { toast } from "sonner";

export const HomePage = () => {
  const { fetchStats } = useHomesPageState();

  useEffect(() => {
    fetchStats().catch(() => {
      toast.error("Something went wrong, try again later!");
    });
  }, []);

  return (
    <AppLayout title={"Home"}>
      <div>
        <div className="text-xl font-semibold">Dashboard</div>
        <StatCards />
        <div className="mt-4 flex w-full gap-4">
          <RecentMembers />
          <RecentTransactions />
        </div>
      </div>
    </AppLayout>
  );
};
