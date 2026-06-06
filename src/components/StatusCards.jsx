import { Users, Star, CheckCircle, XCircle } from "lucide-react";

const cards = [
  {
    key: "total",
    label: "Total Leads",
    icon: Users,
    color: "text-[var(--chart-1)]",
    bar: "bg-[var(--chart-1)]",
    iconBg: "bg-[var(--chart-1)]/10",
    sub: "All time",
  },
  {
    key: "qualified",
    label: "Qualified",
    icon: Star,
    color: "text-[var(--chart-4)]",
    bar: "bg-[var(--chart-4)]",
    iconBg: "bg-[var(--chart-4)]/10",
    sub: "of total",
  },
  {
    key: "converted",
    label: "Converted",
    icon: CheckCircle,
    color: "text-[var(--chart-2)]",
    bar: "bg-[var(--chart-2)]",
    iconBg: "bg-[var(--chart-2)]/10",
    sub: "rate",
  },
  {
    key: "lost",
    label: "Lost",
    icon: XCircle,
    color: "text-[var(--chart-3)]",
    bar: "bg-[var(--chart-3)]",
    iconBg: "bg-[var(--chart-3)]/10",
    sub: "lost rate",
  },
];

export default function StatsCard({ stats }) {
  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map(({ key, label, icon: Icon, bar, iconBg, sub, color }) => {
        const val = stats[key] ?? 0;

        const pct =
          stats.total > 0
            ? Math.round((val / stats.total) * 100)
            : 0;

        const fillPct = key === "total" ? 100 : pct;

        return (
          <div
            key={key}
            className="bg-card border border-border rounded-lg p-5 shadow-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {label}
              </span>

              <div className={`p-1.5 rounded-md ${iconBg}`}>
                <Icon className={`w-4 h-4 ${color}`} />
              </div>
            </div>

            <div className={`text-3xl font-semibold ${color} mb-1`}>
              {val}
            </div>

            <div className="text-xs text-muted-foreground mb-3">
              {key === "total" ? sub : `${fillPct}% ${sub}`}
            </div>

            <div className="h-0.5 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full ${bar} rounded-full transition-all`}
                style={{ width: `${fillPct}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}