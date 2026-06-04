import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import type { RightAIChart } from "@/lib/rightai";

const PIE_COLORS = ["#F24C21", "#FF7A45", "#FFB38E", "#FFE1D2", "#F97316", "#FB923C"];

type Props = {
  chart: RightAIChart;
};

export function RightAIChartCard({ chart }: Props) {
  if (!chart.shouldRender || !chart.data.length) {
    return null;
  }

  const config = {
    value: {
      label: chart.yAxisLabel || "Value",
      color: "#F24C21",
    },
  };

  return (
    <div className="mt-4 rounded-3xl border border-white/10 bg-white/5 p-4">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">{chart.title}</h3>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">{chart.description}</p>
        </div>
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-primary">
          AI chart
        </span>
      </div>

      <ChartContainer config={config} className="h-[260px] w-full">
        {chart.chartType === "bar" ? (
          <BarChart data={chart.data}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="label" tickLine={false} axisLine={false} minTickGap={16} />
            <YAxis tickLine={false} axisLine={false} width={40} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="value" fill="var(--color-value)" radius={[10, 10, 0, 0]} />
          </BarChart>
        ) : chart.chartType === "line" ? (
          <LineChart data={chart.data}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="label" tickLine={false} axisLine={false} minTickGap={16} />
            <YAxis tickLine={false} axisLine={false} width={40} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line
              type="monotone"
              dataKey="value"
              stroke="var(--color-value)"
              strokeWidth={3}
              dot={{ fill: "var(--color-value)", r: 4 }}
            />
          </LineChart>
        ) : chart.chartType === "pie" ? (
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent nameKey="label" />} />
            <Pie
              data={chart.data}
              dataKey="value"
              nameKey="label"
              innerRadius={52}
              outerRadius={88}
              paddingAngle={3}
            >
              {chart.data.map((entry, index) => (
                <Cell key={entry.label} fill={PIE_COLORS[index % PIE_COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        ) : (
          <AreaChart data={chart.data}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="label" tickLine={false} axisLine={false} minTickGap={16} />
            <YAxis tickLine={false} axisLine={false} width={40} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="var(--color-value)"
              fill="var(--color-value)"
              fillOpacity={0.22}
              strokeWidth={3}
            />
          </AreaChart>
        )}
      </ChartContainer>

      <p className="mt-3 text-[11px] leading-5 text-muted-foreground">
        AI-generated visual summary based on the current conversation. Treat it as guidance until
        confirmed with live property data.
      </p>
    </div>
  );
}
