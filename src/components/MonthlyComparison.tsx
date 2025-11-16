import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { formatMoney } from '../utils/finance';

const data = [
  { month: 'Aug', rent: 135000, food: 28000, transport: 9500, entertainment: 6500, other: 18000 },
  { month: 'Sep', rent: 135000, food: 31000, transport: 10500, entertainment: 4500, other: 15000 },
  { month: 'Oct', rent: 135000, food: 26000, transport: 8800, entertainment: 7200, other: 20000 },
  { month: 'Nov', rent: 135000, food: 29000, transport: 9200, entertainment: 5800, other: 17500 },
  { month: 'Dec', rent: 135000, food: 24500, transport: 8950, entertainment: 5000, other: 10000 },
];

export function MonthlyComparison() {
  return (
    <div className="card p-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-white">Monthly Comparison</h3>
          <p className="text-gray-400">Spending breakdown by category over recent months</p>
        </div>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9CA3AF" style={{ fontSize: '12px' }} />
              <YAxis stroke="#9CA3AF" style={{ fontSize: '12px' }} tickFormatter={(value) => formatMoney(value)} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px', color: '#fff' }}
                formatter={(value: number) => [formatMoney(value), 'Spent']}
              />
              <Legend wrapperStyle={{ color: '#9CA3AF' }} />
              <Bar dataKey="rent" stackId="a" fill="#8b5cf6" name="Rent" />
              <Bar dataKey="food" stackId="a" fill="#3b82f6" name="Food" />
              <Bar dataKey="transport" stackId="a" fill="#10b981" name="Transport" />
              <Bar dataKey="entertainment" stackId="a" fill="#f59e0b" name="Entertainment" />
              <Bar dataKey="other" stackId="a" fill="#6b7280" name="Other" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}