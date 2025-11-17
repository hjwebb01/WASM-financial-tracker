import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export function MonthlyComparison() {
  const data = [
    { month: 'Aug', rent: 1350, food: 280, transport: 95, entertainment: 65, other: 180 },
    { month: 'Sep', rent: 1350, food: 310, transport: 105, entertainment: 45, other: 150 },
    { month: 'Oct', rent: 1350, food: 260, transport: 88, entertainment: 72, other: 200 },
    { month: 'Nov', rent: 1350, food: 290, transport: 92, entertainment: 58, other: 175 },
    { month: 'Dec', rent: 1350, food: 245, transport: 89.50, entertainment: 50, other: 100 },
  ];

  return (
    <div className="chart-card content-section">
      <div className="chart-header">
        <h3 className="chart-title">Monthly Comparison</h3>
        <p className="chart-subtitle">Spending breakdown by category over recent months</p>
      </div>
      <div className="chart-container-large">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="month" 
              stroke="#9CA3AF"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="#9CA3AF"
              style={{ fontSize: '12px' }}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1f2937', 
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#fff'
              }}
              formatter={(value: number) => `$${value.toFixed(2)}`}
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
  );
}