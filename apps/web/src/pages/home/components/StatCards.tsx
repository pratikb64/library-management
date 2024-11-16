import { useHomesPageState } from "../home-page.state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AsyncState } from "@/types";
import { BookIcon, BookUser, IndianRupeeIcon, UsersIcon } from "lucide-react";

export const StatCards = () => {
  const { stats, asyncStates } = useHomesPageState();

  const statsCards = [
    {
      title: "Books",
      icon: <BookIcon className="size-4 text-muted-foreground" />,
      value: stats?.books_count,
    },
    {
      title: "Members",
      icon: <UsersIcon className="size-4 text-muted-foreground" />,
      value: stats?.members_count,
    },
    {
      title: "Issued Books",
      icon: <BookUser className="size-4 text-muted-foreground" />,
      value: stats?.issued_books_count,
    },
    {
      title: "Fee Collected in last 30 days",
      icon: <IndianRupeeIcon className="size-4 text-muted-foreground" />,
      value: `₹${stats?.fee_collected_last_30_days}`,
    },
  ];

  return (
    <div className="mt-4 flex w-full gap-4">
      {asyncStates.fetchStatsAsyncState === AsyncState.Pending && (
        <div className="flex w-full gap-4">
          {statsCards.map((_, i) => (
            <Card key={i} className="w-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {statsCards[i].title}
                </CardTitle>
                {statsCards[i].icon}
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-36 bg-gray-100" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      {asyncStates.fetchStatsAsyncState === AsyncState.Success &&
        statsCards.map((stat) => (
          <Card key={stat.title} className="w-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
    </div>
  );
};
