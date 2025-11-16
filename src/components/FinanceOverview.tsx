import {
  useMonthlyAggregates,
  type TimelineFilter,
} from "../hooks/useAggregates";
import { sampleCategories, formatMoney } from "../utils/finance";
import { TrendingDown, TrendingUp, Wallet, Tag } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface FinanceOverviewProps {
  timeView: TimelineFilter;
}

export function FinanceOverview({ timeView }: FinanceOverviewProps) {
  const data = useMonthlyAggregates(timeView);
  const topCategoryName =
    sampleCategories.find((c) => c.id === data.topCategory.categoryId)?.name ??
    "";

  const stats: StatDefinition[] = [
    {
      label: "Total Spent",
      value: data.totalSpent,
      icon: TrendingDown,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
      helper: "Expenses for selected period",
    },
    {
      label: "Total Income",
      value: data.totalIncome,
      icon: TrendingUp,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      helper: "Deposits & paychecks",
    },
    {
      label: "Net Balance",
      value: data.netBalance,
      icon: Wallet,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      helper: "Income minus expenses",
    },
    {
      label: "Top Category",
      value: data.topCategory.spent,
      category: topCategoryName,
      icon: Tag,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      helper: "Highest spend category",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </div>
  );
}

type StatDefinition = {
  label: string;
  value: number;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  category?: string;
  helper?: string;
};

const StatCard = ({
  label,
  value,
  icon: Icon,
  color,
  bgColor,
  category,
  helper,
}: StatDefinition) => {
  return (
    <article className="card flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-400">{label}</p>
          <div className="space-y-1">
            <p className="text-2xl font-semibold text-white">
              {formatMoney(value)}
            </p>
            {category && (
              <p className="text-sm font-medium text-blue-400">{category}</p>
            )}
          </div>
        </div>
        <span className={`${bgColor} ${color} rounded-xl p-3`}>
          <Icon className="h-5 w-5" />
        </span>
      </div>
      {helper && <p className="text-xs text-gray-500">{helper}</p>}
    </article>
  );
};
