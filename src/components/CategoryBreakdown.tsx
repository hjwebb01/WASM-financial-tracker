import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import type { LegendPayload } from "recharts";

interface CategoryBreakdownProps {
  timeView: "month" | "all";
}

interface CategoryData {
  name: string;
  value: number;
  color: string;
  [key: string]: string | number;
}

export function CategoryBreakdown({ timeView }: CategoryBreakdownProps) {
  const monthData: CategoryData[] = [
    { name: "Rent", value: 1350, color: "#8b5cf6" },
    { name: "Food", value: 245, color: "#3b82f6" },
    { name: "Transport", value: 89.5, color: "#10b981" },
    { name: "Entertainment", value: 50, color: "#f59e0b" },
  ];

  const allTimeData: CategoryData[] = [
    { name: "Rent", value: 32400, color: "#8b5cf6" },
    { name: "Food", value: 5880, color: "#3b82f6" },
    { name: "Transport", value: 2148, color: "#10b981" },
    { name: "Entertainment", value: 1200, color: "#f59e0b" },
    { name: "Shopping", value: 822.75, color: "#ec4899" },
    { name: "Healthcare", value: 400, color: "#14b8a6" },
  ];

  const data = timeView === "month" ? monthData : allTimeData;
  const total = data.reduce((sum, item) => sum + item.value, 0);

  const COLORS = data.map((item) => item.color);

  const renderCustomizedLabel = (entry: { value: number }) => {
    const percent = ((entry.value / total) * 100).toFixed(0);
    return `${percent}%`;
  };

  const formatLegendLabel = (value: string | number, entry: LegendPayload) => {
    const payloadValue =
      entry?.payload &&
      typeof entry.payload === "object" &&
      "value" in entry.payload
        ? Number((entry.payload as { value: number }).value)
        : 0;

    return `${value} ($${payloadValue.toFixed(2)})`;
  };

  return (
    <div className="chart-card">
      <div className="chart-header">
        <h3 className="chart-title">Spending by Category</h3>
        <p className="chart-subtitle">Distribution of expenses</p>
      </div>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#1f2937",
                border: "1px solid #374151",
                borderRadius: "8px",
                color: "#fff",
              }}
              formatter={(value: number) => `$${value.toFixed(2)}`}
            />
            <Legend
              wrapperStyle={{ color: "#9CA3AF" }}
              formatter={formatLegendLabel}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
