import {
  Bar, BarChart, CartesianGrid, Cell, Line, LineChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis, Legend,
} from "recharts";
import { trustCapacity, queueTrend } from "@/data/mockData";
import { TrendingDown } from "lucide-react";

export function CapacityChart() {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-5">
        <h3 className="text-sm font-semibold text-foreground">Trust Capacity vs Backlog</h3>
        <p className="mt-0.5 text-[11px] text-muted-foreground">Predicted wait across nearby NHS trusts</p>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={trustCapacity} layout="vertical" margin={{ left: 8, right: 36, top: 4, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
          <XAxis
            type="number"
            stroke="var(--muted-foreground)"
            fontSize={11}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            dataKey="trust"
            type="category"
            stroke="var(--muted-foreground)"
            fontSize={10}
            width={128}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              background: "var(--popover)",
              border: "1px solid var(--border)",
              borderRadius: "10px",
              fontSize: 12,
              boxShadow: "0 10px 25px -5px oklch(0.2 0.05 260 / 0.12)",
            }}
            cursor={{ fill: "var(--muted)", opacity: 0.5 }}
          />
          <Bar dataKey="capacity" radius={[0, 6, 6, 0]} animationDuration={900} name="Capacity %">
            {trustCapacity.map((entry, i) => (
              <Cell
                key={i}
                fill={entry.capacity > 85 ? "var(--warning)" : "var(--primary)"}
                fillOpacity={0.85}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function TrendChart() {
  const latest = queueTrend[queueTrend.length - 1];
  const first  = queueTrend[0];
  const delta  = latest.waiting - first.waiting;

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-5 flex items-start justify-between">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Waiting List Trend</h3>
          <p className="mt-0.5 text-[11px] text-muted-foreground">Last 7 days</p>
        </div>
        <div className="flex items-center gap-1.5 rounded-lg bg-success/10 px-2.5 py-1 text-xs font-semibold text-success">
          <TrendingDown className="h-3.5 w-3.5" />
          {Math.abs(delta)} fewer
        </div>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={queueTrend} margin={{ left: -12, right: 8, top: 4, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis
            dataKey="day"
            stroke="var(--muted-foreground)"
            fontSize={11}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="var(--muted-foreground)"
            fontSize={11}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              background: "var(--popover)",
              border: "1px solid var(--border)",
              borderRadius: "10px",
              fontSize: 12,
              boxShadow: "0 10px 25px -5px oklch(0.2 0.05 260 / 0.12)",
            }}
          />
          <Legend
            iconType="circle"
            iconSize={8}
            formatter={(value) => (
              <span style={{ color: "var(--muted-foreground)", fontSize: 11 }}>
                {value === "waiting" ? "Waiting" : "Recovered"}
              </span>
            )}
          />
          <Line
            type="monotone"
            dataKey="waiting"
            stroke="var(--primary)"
            strokeWidth={2.5}
            dot={{ r: 3, fill: "var(--primary)", strokeWidth: 0 }}
            activeDot={{ r: 5 }}
            animationDuration={900}
          />
          <Line
            type="monotone"
            dataKey="recovered"
            stroke="var(--success)"
            strokeWidth={2.5}
            dot={{ r: 3, fill: "var(--success)", strokeWidth: 0 }}
            activeDot={{ r: 5 }}
            animationDuration={900}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
