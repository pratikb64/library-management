import { useHomesPageState } from "../home-page.state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AsyncState } from "@/types";

export const RecentTransactions = () => {
  const { stats, asyncStates } = useHomesPageState();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-sm font-medium">
          Recent Transactions
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {asyncStates.fetchStatsAsyncState === AsyncState.Pending &&
          [...Array(8)].map((_, i) => (
            <div key={i} className="flex justify-between">
              <div className="w-36 space-y-1 overflow-hidden text-ellipsis whitespace-nowrap text-sm font-medium">
                <Skeleton className="h-4 w-full bg-gray-100" />
                <Skeleton className="h-3 w-24 bg-gray-100" />
              </div>
              <div className="w-48 space-y-1 overflow-hidden text-ellipsis whitespace-nowrap text-sm font-medium">
                <Skeleton className="h-4 w-full bg-gray-100" />
              </div>
              <div className="w-1/5 font-medium capitalize">
                <Skeleton className="h-4 w-full bg-gray-100" />
              </div>
            </div>
          ))}
        {asyncStates.fetchStatsAsyncState === AsyncState.Success &&
          stats?.recent_transactions.map((transaction) => (
            <div className="flex justify-between" key={transaction.id}>
              <div
                className="w-36 space-y-1 overflow-hidden text-ellipsis whitespace-nowrap text-sm font-medium"
                title={transaction.member.name}
              >
                {transaction.member.name}
                <p
                  className="text-sm text-muted-foreground"
                  title={transaction.member.email}
                >
                  {transaction.member.email}
                </p>
              </div>
              <div
                className="w-48 space-y-1 overflow-hidden text-ellipsis whitespace-nowrap text-sm font-medium"
                title={transaction.book}
              >
                {transaction.book}
              </div>
              <div className="w-1/5 font-medium capitalize">
                {transaction.status}
              </div>
            </div>
          ))}
      </CardContent>
    </Card>
  );
};
