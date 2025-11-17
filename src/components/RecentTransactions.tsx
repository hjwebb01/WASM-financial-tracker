import { Home, ShoppingCart, Car, Coffee, Utensils, Film } from 'lucide-react';

export function RecentTransactions() {
  const transactions = [
    { 
      id: 1, 
      description: 'Monthly Rent Payment', 
      category: 'Rent', 
      amount: -1350.00, 
      date: 'Dec 1, 2025',
      icon: Home,
      iconColor: 'icon-purple',
      bgColor: 'bg-purple'
    },
    { 
      id: 2, 
      description: 'Grocery Shopping', 
      category: 'Food', 
      amount: -124.50, 
      date: 'Dec 3, 2025',
      icon: ShoppingCart,
      iconColor: 'icon-blue',
      bgColor: 'bg-blue'
    },
    { 
      id: 3, 
      description: 'Gas Station', 
      category: 'Transport', 
      amount: -45.00, 
      date: 'Dec 5, 2025',
      icon: Car,
      iconColor: 'icon-green',
      bgColor: 'bg-green'
    },
    { 
      id: 4, 
      description: 'Coffee Shop', 
      category: 'Food', 
      amount: -5.50, 
      date: 'Dec 7, 2025',
      icon: Coffee,
      iconColor: 'icon-blue',
      bgColor: 'bg-blue'
    },
    { 
      id: 5, 
      description: 'Restaurant Dinner', 
      category: 'Food', 
      amount: -65.00, 
      date: 'Dec 8, 2025',
      icon: Utensils,
      iconColor: 'icon-blue',
      bgColor: 'bg-blue'
    },
    { 
      id: 6, 
      description: 'Movie Tickets', 
      category: 'Entertainment', 
      amount: -28.00, 
      date: 'Dec 10, 2025',
      icon: Film,
      iconColor: 'icon-orange',
      bgColor: 'bg-orange'
    },
    { 
      id: 7, 
      description: 'Uber Ride', 
      category: 'Transport', 
      amount: -22.50, 
      date: 'Dec 12, 2025',
      icon: Car,
      iconColor: 'icon-green',
      bgColor: 'bg-green'
    },
    { 
      id: 8, 
      description: 'Grocery Shopping', 
      category: 'Food', 
      amount: -50.00, 
      date: 'Dec 14, 2025',
      icon: ShoppingCart,
      iconColor: 'icon-blue',
      bgColor: 'bg-blue'
    },
  ];

  return (
    <div className="chart-card content-section">
      <div className="chart-header">
        <h3 className="chart-title">Recent Transactions</h3>
        <p className="chart-subtitle">Your latest spending activity</p>
      </div>
      <div className="transactions-list">
        {transactions.map((transaction) => (
          <div 
            key={transaction.id}
            className="transaction-item"
          >
            <div className="transaction-left">
              <div className={`transaction-icon-wrapper ${transaction.bgColor}`}>
                <transaction.icon className={`transaction-icon ${transaction.iconColor}`} />
              </div>
              <div className="transaction-details">
                <p className="transaction-description">{transaction.description}</p>
                <div className="transaction-meta">
                  <span className="transaction-badge">
                    {transaction.category}
                  </span>
                  <span className="transaction-date">{transaction.date}</span>
                </div>
              </div>
            </div>
            <p className={`transaction-amount ${transaction.amount < 0 ? 'amount-negative' : 'amount-positive'}`}>
              {transaction.amount < 0 ? '-' : '+'}${Math.abs(transaction.amount).toFixed(2)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}