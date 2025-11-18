import { useState } from "react";
import { type TimelineFilter } from "../hooks/useAggregates";
import { FinanceOverview } from "../components/FinanceOverview";
import { SpendingChart } from "../components/SpendingChart";
import { CategoryBreakdown } from "../components/CategoryBreakdown";
import { MonthlyComparison } from "../components/MonthlyComparison";
import { RecentTransactions } from "../components/RecentTransactions";

function DashboardPage() {
  const [timeView, setTimeView] = useState<TimelineFilter>("month");

  return (
    <div className="app-container">
      {/* Main Content */}
      <main className="app-main">
        <div className="content-wrapper">
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
        </div>
      </main>
    </div>
  );
}

export default DashboardPage;
