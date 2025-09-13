import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  MapPin,
  CheckCircle2,
  Clock,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { useMemo, useState } from "react";
import type { Issue } from "@shared/api";
import { cn } from "@/lib/utils";

export default function Feed() {
  const [status, setStatus] = useState<string>("all");
  const [category, setCategory] = useState<string>("all");
  const { data, refetch, isLoading } = useQuery({
    queryKey: ["issues", status, category],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (status !== "all") params.set("status", status);
      if (category !== "all") params.set("category", category);
      const res = await fetch(`/api/issues?${params.toString()}`);
      return (await res.json()) as { issues: Issue[] };
    },
  });

  const counts = useMemo(() => {
    const all = data?.issues ?? [];
    return {
      reported: all.filter((i) => i.status === "reported").length,
      in_progress: all.filter((i) => i.status === "in_progress").length,
      resolved: all.filter((i) => i.status === "resolved").length,
    };
  }, [data]);

  return (
    <Card className="mt-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Explore & Transparency</CardTitle>
          <button
            onClick={() => refetch()}
            className="text-sm text-primary underline"
          >
            Refresh
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-3 md:col-span-2">
            <div className="flex flex-wrap items-center gap-2">
              <FilterPill
                label="All"
                value="all"
                active={status === "all"}
                onClick={() => setStatus("all")}
              />
              <FilterPill
                label="Reported"
                value="reported"
                active={status === "reported"}
                onClick={() => setStatus("reported")}
              />
              <FilterPill
                label="In-progress"
                value="in_progress"
                active={status === "in_progress"}
                onClick={() => setStatus("in_progress")}
              />
              <FilterPill
                label="Resolved"
                value="resolved"
                active={status === "resolved"}
                onClick={() => setStatus("resolved")}
              />
              <span className="mx-2 h-4 w-px bg-border" />
              <FilterPill
                label="All Categories"
                value="all"
                active={category === "all"}
                onClick={() => setCategory("all")}
              />
              <FilterPill
                label="Pothole"
                value="pothole"
                active={category === "pothole"}
                onClick={() => setCategory("pothole")}
              />
              <FilterPill
                label="Garbage"
                value="garbage"
                active={category === "garbage"}
                onClick={() => setCategory("garbage")}
              />
              <FilterPill
                label="Streetlight"
                value="streetlight"
                active={category === "streetlight"}
                onClick={() => setCategory("streetlight")}
              />
            </div>
            <div className="divide-y">
              {isLoading && (
                <div className="py-6 text-muted-foreground">Loading…</div>
              )}
              {!isLoading && (data?.issues ?? []).length === 0 && (
                <div className="py-6 text-muted-foreground">
                  No issues yet. Be the first to report!
                </div>
              )}
              {(data?.issues ?? []).map((i) => (
                <div key={i.id} className="py-4 flex items-start gap-3">
                  <StatusDot status={i.status} />
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-medium capitalize">{i.category}</h4>
                      <Badge variant="secondary">
                        {new Date(i.createdAt).toLocaleString()}
                      </Badge>
                      {i.pointsAwarded ? (
                        <Badge>+{i.pointsAwarded} pts</Badge>
                      ) : null}
                    </div>
                    {i.description && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {i.description}
                      </p>
                    )}
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>
                        {i.location.lat.toFixed(4)}, {i.location.lng.toFixed(4)}
                      </span>
                      <a
                        className="inline-flex items-center gap-1 text-primary underline"
                        href={`https://www.openstreetmap.org/?mlat=${i.location.lat}&mlon=${i.location.lng}#map=17/${i.location.lat}/${i.location.lng}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Open Map <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                    {i.imageDataUrl && (
                      <img
                        src={i.imageDataUrl}
                        alt="Issue"
                        className="mt-3 max-h-48 rounded-md border object-cover"
                      />
                    )}
                    {i.afterImage && (
                      <div className="mt-2 text-xs text-green-600">
                        After fix proof attached.
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <MiniStatusMap counts={counts} />
            <Legend />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function FilterPill({
  label,
  value,
  active,
  onClick,
}: {
  label: string;
  value: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1 text-xs",
        active
          ? "bg-primary text-primary-foreground border-primary"
          : "hover:bg-accent",
      )}
    >
      {label}
    </button>
  );
}

function StatusDot({ status }: { status: Issue["status"] }) {
  const color =
    status === "resolved"
      ? "bg-green-500"
      : status === "in_progress"
        ? "bg-yellow-500"
        : "bg-red-500";
  const Icon =
    status === "resolved"
      ? CheckCircle2
      : status === "in_progress"
        ? Clock
        : AlertCircle;
  return (
    <div className="mt-1">
      <Icon className={cn("h-5 w-5", color.replace("bg-", "text-"))} />
    </div>
  );
}

function MiniStatusMap({
  counts,
}: {
  counts: { reported: number; in_progress: number; resolved: number };
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Status Map</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative h-40 w-full overflow-hidden rounded-md bg-gradient-to-br from-blue-50 to-green-50 border">
          {/* Simulated pins */}
          {Array.from({ length: counts.reported }).map((_, idx) => (
            <div
              key={"r" + idx}
              className="absolute h-2 w-2 rounded-full bg-red-500"
              style={{
                left: `${10 + ((idx * 17) % 90)}%`,
                top: `${10 + ((idx * 23) % 80)}%`,
              }}
            />
          ))}
          {Array.from({ length: counts.in_progress }).map((_, idx) => (
            <div
              key={"y" + idx}
              className="absolute h-2 w-2 rounded-full bg-yellow-500"
              style={{
                left: `${20 + ((idx * 13) % 90)}%`,
                top: `${20 + ((idx * 29) % 80)}%`,
              }}
            />
          ))}
          {Array.from({ length: counts.resolved }).map((_, idx) => (
            <div
              key={"g" + idx}
              className="absolute h-2 w-2 rounded-full bg-green-500"
              style={{
                left: `${15 + ((idx * 19) % 90)}%`,
                top: `${15 + ((idx * 17) % 80)}%`,
              }}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function Legend() {
  return (
    <div className="flex items-center gap-3 text-xs text-muted-foreground">
      <span className="inline-flex items-center gap-1">
        <span className="h-2 w-2 rounded-full bg-red-500" /> Reported
      </span>
      <span className="inline-flex items-center gap-1">
        <span className="h-2 w-2 rounded-full bg-yellow-500" /> In-progress
      </span>
      <span className="inline-flex items-center gap-1">
        <span className="h-2 w-2 rounded-full bg-green-500" /> Resolved
      </span>
    </div>
  );
}
