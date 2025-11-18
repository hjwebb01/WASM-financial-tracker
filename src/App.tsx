import { useState } from 'react';
import './App.css';
import DashboardPage from './pages/DashboardPage';
import TransactionsPage from './pages/TransactionsPage';
import BudgetsPage from './pages/BudgetsPage';

function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'transactions' | 'budgets'>('dashboard');

  const tabs = [
    { id: 'dashboard' as const, label: 'Dashboard' },
    { id: 'transactions' as const, label: 'Transactions' },
    { id: 'budgets' as const, label: 'Budgets' },
  ];

  const renderActivePage = () => {
    if (activeTab === 'dashboard') {
      return <DashboardPage />;
    }

    if (activeTab === 'transactions') {
      return <TransactionsPage />;
    }

    if (activeTab === 'budgets') {
      return <BudgetsPage />;
    }

    return null;
  };

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
          {renderActivePage()}
        </div>
      </main>
    </div>
  );
}

export default App;
