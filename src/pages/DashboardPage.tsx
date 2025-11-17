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
    <div className="max-w-7xl mx-auto space-y-8 px-4 py-8">
      <div className="dashboard-header">
        <h2 className="dashboard-title">Dashboard</h2>
        <p className="dashboard-subtitle">Lifetime view of your finances.</p>
      </div>

      <div className="time-toggle">
        <button
          onClick={() => setTimeView("month")}
          className={`time-toggle-btn ${
            timeView === "month" ? "active" : "inactive"
          }`}
        >
          This Month
        </button>
        <button
          onClick={() => setTimeView("all")}
          className={`time-toggle-btn ${
            timeView === "all" ? "active" : "inactive"
          }`}
        >
          All Time
        </button>
      </div>

      <FinanceOverview timeView={timeView} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SpendingChart timeView={timeView} />
        <CategoryBreakdown timeView={timeView} />
      </div>

      <MonthlyComparison />

      <RecentTransactions />
    </div>
  );
}

export default DashboardPage;
