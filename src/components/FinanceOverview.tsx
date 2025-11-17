import {
  TrendingDown,
  TrendingUp,
  Wallet,
  Tag,
} from "lucide-react";

interface FinanceOverviewProps {
  timeView: "month" | "all";
}

export function FinanceOverview({
  timeView,
}: FinanceOverviewProps) {
  const monthData = {
    totalSpent: 1734.5,
    totalIncome: 3200.0,
    netBalance: 1465.5,
    topCategory: "Rent",
    topCategoryAmount: 1350.0,
  };

  const allTimeData = {
    totalSpent: 42850.75,
    totalIncome: 76800.0,
    netBalance: 33949.25,
    topCategory: "Rent",
    topCategoryAmount: 32400.0,
  };

  const data = timeView === "month" ? monthData : allTimeData;

  const stats = [
    {
      label: "Total Spent",
      value: data.totalSpent,
      icon: TrendingDown,
      iconColor: "icon-orange",
      bgColor: "bg-orange",
    },
    {
      label: "Total Income",
      value: data.totalIncome,
      icon: TrendingUp,
      iconColor: "icon-green",
      bgColor: "bg-green",
    },
    {
      label: "Net Balance",
      value: data.netBalance,
      icon: Wallet,
      iconColor: "icon-blue",
      bgColor: "bg-blue",
    },
    {
      label: "Top Category",
      value: data.topCategoryAmount,
      category: data.topCategory,
      icon: Tag,
      iconColor: "icon-purple",
      bgColor: "bg-purple",
    },
  ];

  return (
    <div className="finance-overview-grid">
      {stats.map((stat) => (
        <div key={stat.label} className="stat-card">
          <div className="stat-card-content">
            <div className="stat-info">
              <p className="stat-label">{stat.label}</p>
              <div className="stat-values">
                <p className="stat-value">
                  $
                  {stat.value.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
                {stat.category && (
                  <p className="stat-category">
                    {stat.category}
                  </p>
                )}
              </div>
            </div>
            <div className={`stat-icon-wrapper ${stat.bgColor}`}>
              <stat.icon className={`stat-icon ${stat.iconColor}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
