import { useHomesPageState } from "../home-page.state";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AsyncState } from "@/types";

export const RecentMembers = () => {
  const { stats, asyncStates } = useHomesPageState();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-sm font-medium">
          Recently Joined Members
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {asyncStates.fetchStatsAsyncState === AsyncState.Pending &&
            [...Array(8)].map((_, i) => (
              <div className="flex justify-between">
                <div className="w-36 space-y-1 overflow-hidden text-ellipsis whitespace-nowrap text-sm font-medium">
                  <Skeleton className="h-4 w-full bg-gray-100" />
                  <Skeleton className="h-3 w-24 bg-gray-100" />
                </div>
                <div className="w-1/5 font-medium capitalize">
                  <Skeleton className="h-4 w-full bg-gray-100" />
                </div>
              </div>
            ))}

          {asyncStates.fetchStatsAsyncState === AsyncState.Success &&
            stats?.recently_joined_members.map((member) => {
              const memberName = `${member.first_name} ${member.last_name}`;
              return (
                <div className="flex items-center" key={member.id}>
                  <Avatar className="h-9 w-9">
                    <AvatarImage
                      src={`https://avatar.iran.liara.run/public?username=${memberName}`}
                      alt="Avatar"
                    />
                  </Avatar>
                  <div className="ml-4 space-y-1">
                    <p
                      className="text-sm font-medium leading-none"
                      title={memberName}
                    >
                      {memberName}
                    </p>
                    <p
                      className="text-sm text-muted-foreground"
                      title={member.email}
                    >
                      {member.email}
                    </p>
                  </div>
                  <div className="ml-auto text-sm font-medium">
                    {new Date(member.joining_date).toLocaleDateString()}
                  </div>
                </div>
              );
            })}
        </div>
      </CardContent>
    </Card>
  );
};
