import { useTransactions } from '../context/TransactionsContext';
import { sampleCategories } from '../utils/finance';
import { Home, ShoppingCart, Car, Coffee, Film } from 'lucide-react';
import { formatMoney } from '../utils/finance';

const categoryIcons: Record<string, React.ElementType> = {
  rent: Home,
  food: ShoppingCart,
  transport: Car,
  entertainment: Film,
  // defaults
};

const categoryColors: Record<string, string> = {
  rent: 'text-purple-500 bg-purple-500/10',
  food: 'text-blue-500 bg-blue-500/10',
  transport: 'text-green-500 bg-green-500/10',
  entertainment: 'text-orange-500 bg-orange-500/10',
};

export function RecentTransactions() {
  const { transactions } = useTransactions();
  const recent = transactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 8);

  return (
    <div className="card p-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-white">Recent Transactions</h3>
          <p className="text-gray-400">Your latest spending activity</p>
        </div>
        <div className="space-y-3">
          {recent.map((transaction) => {
            const Icon = categoryIcons[transaction.categoryId] || Coffee;
            const colorClass = categoryColors[transaction.categoryId] || 'text-blue-500 bg-blue-500/10';
            const categoryName = sampleCategories.find(c => c.id === transaction.categoryId)?.name ?? transaction.categoryId;

            return (
              <div 
                key={transaction.id}
                className="flex items-center justify-between p-4 bg-[#1a1a1a] rounded-lg border border-gray-800 hover:border-gray-700 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`${colorClass.replace('text-', 'bg-').replace('bg-', '')} p-2 rounded-lg`}>
                    <Icon className={`${colorClass} h-5 w-5`} />
                  </div>
                  <div>
                    <p className="text-white">{transaction.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="badge">{categoryName}</span>
                      <span className="text-gray-500">{transaction.date}</span>
                    </div>
                  </div>
                </div>
                <p className={transaction.amountCents < 0 ? 'text-red-400' : 'text-green-400'}>
                  {formatMoney(Math.abs(transaction.amountCents))}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}