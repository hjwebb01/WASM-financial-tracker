import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { formatMoney } from '../utils/finance';

interface SpendingChartProps {
  timeView: 'month' | 'all';
}

export function SpendingChart({ timeView }: SpendingChartProps) {
  const monthData = [
    { day: 'Week 1', spent: 45000, income: 80000 },
    { day: 'Week 2', spent: 38000, income: 80000 },
    { day: 'Week 3', spent: 52000, income: 80000 },
    { day: 'Week 4', spent: 38450, income: 80000 },
  ];

  const allTimeData = [
    { month: 'Jan', spent: 320000, income: 640000 },
    { month: 'Feb', spent: 385000, income: 640000 },
    { month: 'Mar', spent: 310000, income: 640000 },
    { month: 'Apr', spent: 420000, income: 640000 },
    { month: 'May', spent: 390000, income: 640000 },
    { month: 'Jun', spent: 365000, income: 640000 },
    { month: 'Jul', spent: 415000, income: 640000 },
    { month: 'Aug', spent: 380000, income: 640000 },
    { month: 'Sep', spent: 405000, income: 640000 },
    { month: 'Oct', spent: 372000, income: 640000 },
    { month: 'Nov', spent: 350000, income: 640000 },
    { month: 'Dec', spent: 173450, income: 640000 },
  ];

  const data = timeView === 'month' ? monthData : allTimeData;
  const xKey = timeView === 'month' ? 'day' : 'month';

  return (
    <div className="card">
      <div className="p-6 space-y-4">
        <div>
          <h3 className="text-white">Spending Trends</h3>
          <p className="text-gray-400">Income vs. Expenses over time</p>
        </div>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey={xKey} stroke="#9CA3AF" style={{ fontSize: '12px' }} />
              <YAxis stroke="#9CA3AF" style={{ fontSize: '12px' }} tickFormatter={(value) => formatMoney(value)} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px', color: '#fff' }}
                formatter={(value: number) => [formatMoney(value), 'Amount']}
              />
              <Legend wrapperStyle={{ color: '#9CA3AF' }} />
              <Line type="monotone" dataKey="income" stroke="#10b981" strokeWidth={2} name="Income" dot={{ fill: '#10b981', r: 4 }} />
              <Line type="monotone" dataKey="spent" stroke="#f59e0b" strokeWidth={2} name="Spent" dot={{ fill: '#f59e0b', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}