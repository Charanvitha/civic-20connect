import { cn } from "@/lib/utils";
import { Trash2, TrafficCone, Lightbulb, Bug, Waves, AlertCircle, MapPin, Wrench } from "lucide-react";

const CATEGORIES = [
  { key: "pothole", label: "Pothole", icon: TrafficCone },
  { key: "garbage", label: "Garbage", icon: Trash2 },
  { key: "streetlight", label: "Streetlight", icon: Lightbulb },
  { key: "drainage", label: "Drainage", icon: Waves },
  { key: "electricity", label: "Electricity", icon: AlertCircle },
  { key: "pest", label: "Pest", icon: Bug },
  { key: "maintenance", label: "Maintenance", icon: Wrench },
  { key: "other", label: "Other", icon: MapPin },
] as const;

export type CategoryKey = typeof CATEGORIES[number]["key"];

interface Props {
  value: CategoryKey;
  onChange: (v: CategoryKey) => void;
}

export default function CategoryPicker({ value, onChange }: Props) {
  return (
    <div className="grid grid-cols-4 gap-3">
      {CATEGORIES.map((c) => {
        const Icon = c.icon;
        const active = value === c.key;
        return (
          <button
            key={c.key}
            onClick={() => onChange(c.key)}
            className={cn(
              "flex flex-col items-center justify-center rounded-xl border p-3 text-xs hover:bg-accent transition",
              active ? "bg-primary text-primary-foreground border-primary" : "bg-card/50",
            )}
          >
            <Icon className="mb-1 h-5 w-5" />
            {c.label}
          </button>
        );
      })}
    </div>
  );
}
