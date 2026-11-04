"use client";

import * as React from "react";
import { Label, Pie, PieChart } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { newsByCategory } from "@/data";

const config = {
  value: { label: "الأخبار" },
  "سياسة": { label: "سياسة", color: "var(--chart-1)" },
  "محلي": { label: "محلي", color: "var(--chart-2)" },
  "اقتصاد": { label: "اقتصاد", color: "var(--chart-3)" },
  "رياضة": { label: "رياضة", color: "var(--chart-4)" },
  "مجتمع": { label: "مجتمع", color: "var(--chart-5)" },
} satisfies ChartConfig;

export function TrafficDonutChart() {
  const total = React.useMemo(
    () => newsByCategory.reduce((a, b) => a + b.value, 0),
    []
  );

  return (
    <ChartContainer config={config} className="mx-auto aspect-square h-[240px]">
      <PieChart>
        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
        <Pie
          data={newsByCategory}
          dataKey="value"
          nameKey="category"
          innerRadius={60}
          strokeWidth={4}
        >
          <Label
            content={({ viewBox }) => {
              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                return (
                  <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy}
                      className="fill-foreground text-2xl font-semibold tabular-nums"
                    >
                      {total.toLocaleString()}
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 20}
                      className="fill-muted-foreground text-xs"
                    >
                      إجمالي الأخبار
                    </tspan>
                  </text>
                );
              }
            }}
          />
        </Pie>
      </PieChart>
    </ChartContainer>
  );
}
