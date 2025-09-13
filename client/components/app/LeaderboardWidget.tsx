import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LeaderboardWidget() {
  const { data } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: async () => {
      const res = await fetch("/api/leaderboard");
      return (await res.json()) as {
        leaderboard: { user: string; points: number; rank: number }[];
      };
    },
  });

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Leaderboard</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {(data?.leaderboard ?? []).slice(0, 5).map((e) => (
            <div
              key={e.user}
              className="flex items-center justify-between rounded-md border p-2"
            >
              <div className="flex items-center gap-2">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                  {e.rank}
                </span>
                <span className="font-medium">{e.user}</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {e.points} pts
              </span>
            </div>
          ))}
          {(data?.leaderboard ?? []).length === 0 && (
            <div className="text-sm text-muted-foreground">
              No entries yet. Report issues to earn points!
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
