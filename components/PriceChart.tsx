"use client";

import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

interface Point {
  dealDate: string;
  amount: number;
}

export default function PriceChart({
  data,
  color,
  unitLabel,
}: {
  data: Point[];
  color: string;
  unitLabel: string;
}) {
  if (data.length < 2) {
    return <p className="muted">추이를 그리기엔 거래 데이터가 부족합니다.</p>;
  }

  const formatted = data.map((d) => ({ ...d, 억: Math.round((d.amount / 10000) * 100) / 100 }));

  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={formatted} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid stroke="var(--gridline)" vertical={false} />
        <XAxis
          dataKey="dealDate"
          tick={{ fill: "var(--text-muted)", fontSize: 12 }}
          axisLine={{ stroke: "var(--gridline)" }}
          tickLine={false}
          minTickGap={30}
        />
        <YAxis
          tick={{ fill: "var(--text-muted)", fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          width={48}
        />
        <Tooltip
          formatter={(value: number) => [`${value.toLocaleString()}${unitLabel}`, undefined]}
          labelFormatter={(label) => label}
          contentStyle={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            fontSize: 13,
          }}
        />
        <Line
          type="monotone"
          dataKey="억"
          name={`가격(${unitLabel})`}
          stroke={color}
          strokeWidth={2}
          dot={{ r: 3, fill: color, strokeWidth: 0 }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
