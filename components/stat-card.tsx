import { IconTrendingUp, IconTrendingDown } from "@tabler/icons-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { StatCard as StatCardType } from "@/data";

export function StatCard({ stat }: { stat: StatCardType }) {
  const positive = stat.trend === "up";
  return (
    <Card className="rounded-xl border-0 ring-1 ring-foreground/10 bg-card p-4 shadow-none transition-shadow hover:ring-foreground/15">
      <CardContent className="p-0 space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-[14px] font-medium text-muted-foreground">{stat.label}</p>
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[12px] font-medium tabular-nums",
              positive
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
            )}
          >
            {positive ? (
              <IconTrendingUp className="size-3.5" />
            ) : (
              <IconTrendingDown className="size-3.5" />
            )}
            {stat.change}%
          </span>
        </div>
        <div>
          <span className="text-[30px] font-semibold tracking-tight tabular-nums leading-none text-foreground">
            {stat.value}
          </span>
        </div>
        <p className="text-[12px] font-normal text-muted-foreground">{stat.hint}</p>
      </CardContent>
    </Card>
  );
}
