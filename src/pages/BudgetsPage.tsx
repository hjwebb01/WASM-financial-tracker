import { useEffect, useMemo, useState } from "react";
import { useBudgets } from "../context/BudgetsContext";
import { useTransactions } from "../context/TransactionsContext";
import {
  sampleCategories,
  formatMoney,
  parseMoneyInput,
  getCategoryIndex,
  getCurrentMonthStart,
  getCurrentMonthEnd,
} from "../utils/finance";
import { sumByCategory } from "../wasm/financeWasm";
import type { Budget, Transaction } from "../types/finance";

type BudgetFormState = {
  categoryId: string;
  monthlyLimit: string;
  notes: string;
};

const defaultFormState: BudgetFormState = {
  categoryId: sampleCategories[0].id,
  monthlyLimit: "",
  notes: "",
};

const getCategoryName = (categoryId: string): string => {
  const category = sampleCategories.find((c) => c.id === categoryId);
  return category?.name ?? categoryId;
};

const getBudgetMetrics = (budget: Budget, spent: number) => {
  const remaining = budget.monthlyLimit - spent;
  const percentUsed =
    budget.monthlyLimit > 0 ? (spent / budget.monthlyLimit) * 100 : 0;
  return {
    spent,
    remaining,
    percentUsed,
    isOver: spent > budget.monthlyLimit,
  };
};

const computeBudgetTotals = (
  budgets: Budget[],
  spentMap: Map<string, number>
) => {
  const totalBudgeted = budgets.reduce(
    (sum, budget) => sum + budget.monthlyLimit,
    0
  );
  const totalSpent = budgets.reduce(
    (sum, budget) => sum + (spentMap.get(budget.id) ?? 0),
    0
  );
  const totalRemaining = totalBudgeted - totalSpent;
  const usagePercent =
    totalBudgeted > 0 ? (totalSpent / totalBudgeted) * 100 : 0;
  return { totalBudgeted, totalSpent, totalRemaining, usagePercent };
};

const useBudgetSpending = (transactions: Transaction[], budgets: Budget[]) => {
  const monthStart = useMemo(() => getCurrentMonthStart(), []);
  const monthEnd = useMemo(() => getCurrentMonthEnd(), []);
  const startTs = BigInt(monthStart.getTime());
  const endTs = BigInt(monthEnd.getTime());

  const { timestamps, amounts, categoryIndices } = useMemo(() => {
    const ts: bigint[] = [];
    const amts: number[] = [];
    const cats: number[] = [];
    transactions.forEach((tx) => {
      const date = new Date(tx.date);
      if (date >= monthStart && date <= monthEnd) {
        ts.push(BigInt(date.getTime()));
        amts.push(tx.amountCents);
        cats.push(getCategoryIndex(tx.categoryId));
      }
    });
    return {
      timestamps: new BigInt64Array(ts),
      amounts: new Int32Array(amts),
      categoryIndices: new Int32Array(cats),
    };
  }, [transactions, monthStart, monthEnd]);

  const currentMonthTxs = useMemo(
    () =>
      transactions.filter((tx) => {
        const date = new Date(tx.date);
        return date >= monthStart && date <= monthEnd;
      }),
    [transactions, monthStart, monthEnd]
  );

  const [spentMap, setSpentMap] = useState<Map<string, number>>(() =>
    new Map()
  );

  useEffect(() => {
    if (budgets.length === 0) {
      setSpentMap(new Map());
      return;
    }

    const computeSpent = async () => {
      const newSpentMap = new Map<string, number>();

      for (const budget of budgets) {
        const categoryIndex = getCategoryIndex(budget.categoryId);

        if (categoryIndex >= 0) {
          try {
            const spent = await sumByCategory(
              categoryIndex,
              startTs,
              endTs,
              timestamps,
              amounts,
              categoryIndices
            );
            newSpentMap.set(budget.id, Math.abs(spent));
          } catch (error) {
            console.error("WASM failed for budget", budget.id, error);
            const spent = currentMonthTxs
              .filter(
                (tx) =>
                  tx.categoryId === budget.categoryId && tx.amountCents < 0
              )
              .reduce((sum, tx) => sum + Math.abs(tx.amountCents), 0);
            newSpentMap.set(budget.id, spent);
          }
        } else {
          newSpentMap.set(budget.id, 0);
        }
      }

      setSpentMap(newSpentMap);
    };

    void computeSpent();
  }, [
    budgets,
    startTs,
    endTs,
    timestamps,
    amounts,
    categoryIndices,
    currentMonthTxs,
  ]);

  return { spentMap, monthStart, monthEnd };
};

function BudgetsPage() {
  const { budgets, addBudget, updateBudget, deleteBudget } = useBudgets();
  const { transactions } = useTransactions();

  const { spentMap, monthStart, monthEnd } = useBudgetSpending(
    transactions,
    budgets
  );

  const summaryTotals = useMemo(
    () => computeBudgetTotals(budgets, spentMap),
    [budgets, spentMap]
  );
  const { totalBudgeted, totalSpent, totalRemaining, usagePercent } =
    summaryTotals;

  const budgetWindowLabel = useMemo(
    () =>
      `${monthStart.toLocaleDateString(undefined, {
        month: "long",
        day: "numeric",
      })} – ${monthEnd.toLocaleDateString(undefined, {
        month: "long",
        day: "numeric",
      })}`,
    [monthStart, monthEnd]
  );

  const [createForm, setCreateForm] =
    useState<BudgetFormState>(defaultFormState);
  const [createError, setCreateError] = useState<string | null>(null);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [editForm, setEditForm] = useState<BudgetFormState>(defaultFormState);
  const [editError, setEditError] = useState<string | null>(null);

  const handleFormChange = (key: keyof BudgetFormState, value: string) => {
    setCreateForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleEditChange = (key: keyof BudgetFormState, value: string) => {
    setEditForm((prev) => ({ ...prev, [key]: value }));
  };

  const validateBudgetForm = (form: BudgetFormState): number | null => {
    const limit = parseMoneyInput(form.monthlyLimit);
    if (limit === null || limit <= 0) {
      return null;
    }
    return limit;
  };

  const handleCreate = (event: React.FormEvent) => {
    event.preventDefault();
    setCreateError(null);

    const limit = validateBudgetForm(createForm);
    if (limit === null) {
      setCreateError("Enter a positive limit (e.g., 500.00).");
      return;
    }

    if (budgets.some((b) => b.categoryId === createForm.categoryId)) {
      setCreateError("Budget already exists for this category.");
      return;
    }

    addBudget({
      categoryId: createForm.categoryId,
      monthlyLimit: limit,
      notes: createForm.notes.trim() || undefined,
    });
    setCreateForm(defaultFormState);
  };

  const openEdit = (budget: Budget) => {
    setEditingBudget(budget);
    setEditForm({
      categoryId: budget.categoryId,
      monthlyLimit: (budget.monthlyLimit / 100).toString(),
      notes: budget.notes || "",
    });
    setEditError(null);
  };

  const handleEditSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!editingBudget) return;
    setEditError(null);

    const limit = validateBudgetForm(editForm);
    if (limit === null) {
      setEditError("Enter a positive limit (e.g., 500.00).");
      return;
    }

    if (
      editForm.categoryId !== editingBudget.categoryId &&
      budgets.some(
        (b) => b.id !== editingBudget.id && b.categoryId === editForm.categoryId
      )
    ) {
      setEditError("Budget already exists for this category.");
      return;
    }

    updateBudget(editingBudget.id, {
      categoryId: editForm.categoryId,
      monthlyLimit: limit,
      notes: editForm.notes.trim() || undefined,
    });
    setEditingBudget(null);
  };

  const handleDelete = (budget: Budget) => {
    const confirmed = window.confirm(
      `Delete budget for ${getCategoryName(budget.categoryId)}?`
    );
    if (confirmed) {
      deleteBudget(budget.id);
    }
  };

  return (
    <div className="budgets-page">
      <header className="budgets-header">
        <div>
          <h2>Budgets</h2>
          <p>Set monthly spending limits and track progress.</p>
        </div>
      </header>

      <section className="budget-summary">
        <div className="budget-summary-header">
          <p className="stat-label">Budget window</p>
          <p className="stat-value">{budgetWindowLabel}</p>
        </div>
        <div className="budget-summary-grid">
          <article className="stat-card">
            <div className="stat-card-content">
              <div className="stat-info">
                <p className="stat-label">Total budgeted</p>
                <p className="stat-value">{formatMoney(totalBudgeted)}</p>
              </div>
            </div>
          </article>
          <article className="stat-card">
            <div className="stat-card-content">
              <div className="stat-info">
                <p className="stat-label">Total spent</p>
                <p className="stat-value">{formatMoney(totalSpent)}</p>
              </div>
            </div>
          </article>
          <article className="stat-card">
            <div className="stat-card-content">
              <div className="stat-info">
                <p className="stat-label">Remaining</p>
                <p
                  className={`stat-value ${
                    totalRemaining < 0 ? "amount-negative" : ""
                  }`}
                >
                  {formatMoney(totalRemaining)}
                </p>
              </div>
            </div>
          </article>
          <article className="stat-card">
            <div className="stat-card-content">
              <div className="stat-info">
                <p className="stat-label">Usage</p>
                <p className="stat-value">{usagePercent.toFixed(0)}%</p>
              </div>
              <div className="budget-summary-progress" role="progressbar" aria-valuenow={usagePercent} aria-valuemin={0} aria-valuemax={100}>
                <div
                  className="progress-bar"
                  style={{ width: `${Math.min(usagePercent, 100)}%` }}
                />
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className="budgets-form-card">
        <h3>Add new budget</h3>
        <form className="budgets-form" onSubmit={handleCreate}>
          <label>
            Category
            <select
              value={createForm.categoryId}
              onChange={(e) => handleFormChange("categoryId", e.target.value)}
            >
              {sampleCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Monthly Limit (USD)
            <input
              type="number"
              step="0.01"
              placeholder="e.g., 500.00"
              value={createForm.monthlyLimit}
              onChange={(e) => handleFormChange("monthlyLimit", e.target.value)}
              required
            />
          </label>
          <label>
            Notes (optional)
            <input
              type="text"
              placeholder="e.g., Groceries budget"
              value={createForm.notes}
              onChange={(e) => handleFormChange("notes", e.target.value)}
            />
          </label>
          {createError && <p className="form-error">{createError}</p>}
          <button type="submit">Add Budget</button>
        </form>
      </section>

      <section className="budgets-list">
        <h3>Your Budgets</h3>
        {budgets.length === 0 ? (
          <p className="empty-state">
            No budgets set yet. Add one above to get started!
          </p>
        ) : (
          <div className="budgets-cards">
            {budgets.map((budget) => {
              const metrics = getBudgetMetrics(
                budget,
                spentMap.get(budget.id) ?? 0
              );
              const { spent, remaining, percentUsed, isOver } = metrics;
              return (
                <div key={budget.id} className="budget-card">
                  <div className="budget-header">
                    <h4>{getCategoryName(budget.categoryId)}</h4>
                    <div className="budget-actions">
                      <button
                        className="text-button"
                        onClick={() => openEdit(budget)}
                      >
                        Edit
                      </button>
                      <button
                        className="text-button destructive"
                        onClick={() => handleDelete(budget)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <div className="budget-stats">
                    <div className="budget-stat">
                      <span className="label">Limit</span>
                      <span className="value">
                        {formatMoney(budget.monthlyLimit)}
                      </span>
                    </div>
                    <div className="budget-stat">
                      <span className="label">Spent</span>
                      <span className="value">{formatMoney(spent)}</span>
                    </div>
                    <div className="budget-stat">
                      <span className="label">Remaining</span>
                      <span
                        className={`value ${remaining < 0 ? "negative" : ""}`}
                      >
                        {formatMoney(remaining)}
                      </span>
                    </div>
                  </div>
                  <div className="budget-progress" role="progressbar" aria-valuenow={percentUsed} aria-valuemin={0} aria-valuemax={100}>
                    <div
                      className={`progress-bar ${isOver ? "over" : ""}`}
                      style={{ width: `${Math.min(percentUsed, 100)}%` }}
                    />
                  </div>
                  {budget.notes && (
                    <p className="budget-notes">{budget.notes}</p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {editingBudget && (
        <div
          className="budget-modal-backdrop"
          role="dialog"
          aria-modal="true"
          onClick={() => setEditingBudget(null)}
        >
          <div
            className="budget-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <header>
              <h3>Edit budget</h3>
              <button
                className="text-button"
                onClick={() => setEditingBudget(null)}
                aria-label="Close"
              >
                ✕
              </button>
            </header>
            <form className="budgets-form" onSubmit={handleEditSubmit}>
              <label>
                Category
                <select
                  value={editForm.categoryId}
                  onChange={(e) =>
                    handleEditChange("categoryId", e.target.value)
                  }
                >
                  {sampleCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Monthly Limit (USD)
                <input
                  type="number"
                  step="0.01"
                  value={editForm.monthlyLimit}
                  onChange={(e) =>
                    handleEditChange("monthlyLimit", e.target.value)
                  }
                  required
                />
              </label>
              <label>
                Notes (optional)
                <input
                  type="text"
                  value={editForm.notes}
                  onChange={(e) => handleEditChange("notes", e.target.value)}
                />
              </label>
              {editError && <p className="form-error">{editError}</p>}
              <div className="modal-actions">
                <button type="button" onClick={() => setEditingBudget(null)}>
                  Cancel
                </button>
                <button type="submit">Save changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default BudgetsPage;
