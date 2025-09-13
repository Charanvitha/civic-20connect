import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Issue } from "@shared/api";

export default function AdminDashboard() {
  const qc = useQueryClient();
  const issuesQ = useQuery({
    queryKey: ["admin-issues"],
    queryFn: async () => {
      const res = await fetch("/api/issues");
      return (await res.json()) as { issues: Issue[] };
    },
  });

  const updateMut = useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: Issue["status"];
    }) => {
      const res = await fetch(`/api/issues/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-issues"] }),
  });

  const issues = issuesQ.data?.issues ?? [];
  const counts = {
    reported: issues.filter((i) => i.status === "reported").length,
    in_progress: issues.filter((i) => i.status === "in_progress").length,
    resolved: issues.filter((i) => i.status === "resolved").length,
  };

  return (
    <section className="py-6">
      <h2 className="text-2xl font-bold">Admin Dashboard</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <Stat label="Reported" value={counts.reported} color="bg-red-500" />
        <Stat
          label="In-progress"
          value={counts.in_progress}
          color="bg-yellow-500"
        />
        <Stat label="Resolved" value={counts.resolved} color="bg-green-500" />
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="divide-y">
            {issues.length === 0 && (
              <div className="py-6 text-muted-foreground">No reports yet.</div>
            )}
            {issues.map((i) => (
              <div
                key={i.id}
                className="py-3 flex flex-wrap items-center gap-3"
              >
                <div className="min-w-40 font-medium capitalize">
                  {i.category}
                </div>
                <div className="text-xs text-muted-foreground flex-1">
                  {new Date(i.createdAt).toLocaleString()}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant={i.status === "reported" ? "default" : "outline"}
                    onClick={() =>
                      updateMut.mutate({ id: i.id, status: "reported" })
                    }
                  >
                    Reported
                  </Button>
                  <Button
                    variant={i.status === "in_progress" ? "default" : "outline"}
                    onClick={() =>
                      updateMut.mutate({ id: i.id, status: "in_progress" })
                    }
                  >
                    In-progress
                  </Button>
                  <Button
                    variant={i.status === "resolved" ? "default" : "outline"}
                    onClick={() =>
                      updateMut.mutate({ id: i.id, status: "resolved" })
                    }
                  >
                    Resolved
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

function Stat({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="mt-1 flex items-center gap-2 text-2xl font-semibold">
          <span>{value}</span>
          <span className={`h-2 w-2 rounded-full ${color}`} />
        </div>
      </CardContent>
    </Card>
  );
}
