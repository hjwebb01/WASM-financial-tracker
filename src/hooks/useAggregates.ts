import { useMemo } from "react";
import { useTransactions } from "../context/TransactionsContext";
import { useBudgets } from "../context/BudgetsContext";
import { getCurrentMonthStart, getCurrentMonthEnd } from "../utils/finance";

export type TimelineFilter = "month" | "all";

export function useMonthlyAggregates(timeline: TimelineFilter = "month") {
  const { transactions } = useTransactions();
  const { budgets } = useBudgets();

  const monthStart = useMemo(() => getCurrentMonthStart(), []);
  const monthEnd = useMemo(() => getCurrentMonthEnd(), []);

  const filteredTransactions = useMemo(
    () =>
      timeline === "all"
        ? transactions
        : transactions.filter((tx) => {
            const date = new Date(tx.date);
            return date >= monthStart && date <= monthEnd;
          }),
    [transactions, timeline, monthStart, monthEnd]
  );

  const totalSpent = useMemo(
    () =>
      filteredTransactions
        .filter((tx) => tx.amountCents < 0)
        .reduce((sum, tx) => sum + tx.amountCents, 0),
    [filteredTransactions]
  );

  const totalIncome = useMemo(
    () =>
      filteredTransactions
        .filter((tx) => tx.amountCents > 0)
        .reduce((sum, tx) => sum + tx.amountCents, 0),
    [filteredTransactions]
  );

  const netBalance = totalIncome + totalSpent; // spent is negative

  const categorySpendMap = useMemo(() => {
    const map = new Map<string, number>();
    filteredTransactions.forEach((tx) => {
      if (tx.amountCents < 0) {
        const current = map.get(tx.categoryId) || 0;
        map.set(tx.categoryId, current + Math.abs(tx.amountCents));
      }
    });
    return map;
  }, [filteredTransactions]);

  const topCategory = useMemo(() => {
    let maxSpent = 0;
    let topCat = "";
    categorySpendMap.forEach((spent, catId) => {
      if (spent > maxSpent) {
        maxSpent = spent;
        topCat = catId;
      }
    });
    return { categoryId: topCat, spent: maxSpent };
  }, [categorySpendMap]);

  // For budgets, remaining and percent used
  const budgetStats = useMemo(() => {
    return budgets.map((budget) => {
      const spent = categorySpendMap.get(budget.categoryId) || 0;
      const remaining = budget.monthlyLimit - spent;
      const percentUsed =
        budget.monthlyLimit > 0 ? (spent / budget.monthlyLimit) * 100 : 0;
      return {
        ...budget,
        spent,
        remaining,
        percentUsed,
        isOver: spent > budget.monthlyLimit,
      };
    });
  }, [budgets, categorySpendMap]);

  return {
    totalSpent: Math.abs(totalSpent),
    totalIncome,
    netBalance,
    categorySpendMap,
    topCategory,
    budgetStats,
  };
}
