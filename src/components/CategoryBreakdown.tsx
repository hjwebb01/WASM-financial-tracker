import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useMonthlyAggregates, type TimelineFilter } from '../hooks/useAggregates';
import { sampleCategories } from '../utils/finance';

interface CategoryBreakdownProps {
  timeView: TimelineFilter;
}

const categoryColors: Record<string, string> = {
  rent: '#8b5cf6',
  food: '#3b82f6',
  transport: '#10b981',
  entertainment: '#f59e0b',
  other: '#6b7280',
  // add more as needed
};

export function CategoryBreakdown({ timeView }: CategoryBreakdownProps) {
  const { categorySpendMap } = useMonthlyAggregates(timeView);

  const data = Array.from(categorySpendMap.entries())
    .map(([categoryId, value]) => ({
      name: sampleCategories.find(c => c.id === categoryId)?.name ?? categoryId,
      value,
      color: categoryColors[categoryId as keyof typeof categoryColors] ?? '#8884d8',
    }))
    .filter(item => item.value > 0)
    .slice(0, 6); // top 6

  const total = data.reduce((sum, item) => sum + item.value, 0);

  const COLORS = data.map(item => item.color);

  const renderCustomizedLabel = (entry: { value: number }) => {
    const percent = ((entry.value / total) * 100).toFixed(0);
    return `${percent}%`;
  };

  return (
    <div className="card p-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-white">Spending by Category</h3>
          <p className="text-gray-400">Distribution of expenses</p>
        </div>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={80}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
              <Legend wrapperStyle={{ color: '#9CA3AF' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}