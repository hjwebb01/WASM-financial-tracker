import { Budgets } from "../components/Budgets";

function BudgetsPage() {
  return (
    <div className="content-section budgets-page">
      <header className="dashboard-header">
        <div>
          <h2 className="dashboard-title">Budgets</h2>
          <p className="dashboard-subtitle">
            Plan your bills, income, and monthly cash flow.
          </p>
        </div>
      </header>

      <Budgets />
    </div>
  );
}

export default BudgetsPage;
