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
      <div className="text-center space-y-2">
        <h2 className="text-gray-300">Dashboard</h2>
        <p className="text-gray-400">Lifetime view of your finances.</p>
      </div>

      <div className="flex justify-center gap-2">
        <button
          onClick={() => setTimeView("month")}
          className={`px-6 py-2 rounded-md transition-colors ${
            timeView === "month"
              ? "bg-gray-700 text-white"
              : "bg-transparent text-gray-400 hover:text-gray-300"
          }`}
        >
          This Month
        </button>
        <button
          onClick={() => setTimeView("all")}
          className={`px-6 py-2 rounded-md transition-colors ${
            timeView === "all"
              ? "bg-gray-700 text-white"
              : "bg-transparent text-gray-400 hover:text-gray-300"
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
