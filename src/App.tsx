import { useState } from 'react';
import './App.css';
import { FinanceOverview } from './components/FinanceOverview';
import { SpendingChart } from './components/SpendingChart';
import { CategoryBreakdown } from './components/CategoryBreakdown';
import { RecentTransactions } from './components/RecentTransactions';
import { MonthlyComparison } from './components/MonthlyComparison';

function App() {
  const [timeView, setTimeView] = useState<'month' | 'all'>('month');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'transactions' | 'budgets'>('dashboard');

  const tabs = [
    { id: 'dashboard' as const, label: 'Dashboard' },
    { id: 'transactions' as const, label: 'Transactions' },
    { id: 'budgets' as const, label: 'Budgets' },
  ];

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="app-header-content">
          <h1 className="app-title">BudgetWise</h1>
          
          <nav className="tabs-container">
            <div className="tabs-list">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`tabs-trigger ${activeTab === tab.id ? 'tabs-trigger-active' : ''}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="app-main">
        <div className="content-wrapper">
          {activeTab === 'dashboard' && (
            <>
              {/* Title and Description */}
              <div className="dashboard-header">
                <h2 className="dashboard-title">Dashboard</h2>
                <p className="dashboard-subtitle">Lifetime view of your finances.</p>
              </div>

              {/* Time Toggle */}
              <div className="time-toggle">
                <button
                  onClick={() => setTimeView('month')}
                  className={`time-toggle-btn ${timeView === 'month' ? 'active' : 'inactive'}`}
                >
                  This Month
                </button>
                <button
                  onClick={() => setTimeView('all')}
                  className={`time-toggle-btn ${timeView === 'all' ? 'active' : 'inactive'}`}
                >
                  All Time
                </button>
              </div>

              {/* Finance Overview Cards */}
              <FinanceOverview timeView={timeView} />

              {/* Charts Grid */}
              <div className="charts-grid">
                <SpendingChart timeView={timeView} />
                <CategoryBreakdown timeView={timeView} />
              </div>

              {/* Monthly Comparison */}
              <MonthlyComparison />

              {/* Recent Transactions */}
              <RecentTransactions />
            </>
          )}

          {activeTab === 'transactions' && (
            <div className="content-section">
              <div className="dashboard-header">
                <h2 className="dashboard-title">Transactions</h2>
                <p className="dashboard-subtitle">View and manage all your transactions.</p>
              </div>
              <div className="chart-card">
                <p className="text-gray-400">Transactions page content coming soon...</p>
              </div>
            </div>
          )}

          {activeTab === 'budgets' && (
            <div className="content-section">
              <div className="dashboard-header">
                <h2 className="dashboard-title">Budgets</h2>
                <p className="dashboard-subtitle">Set and track your spending budgets.</p>
              </div>
              <div className="chart-card">
                <p className="text-gray-400">Budgets page content coming soon...</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
