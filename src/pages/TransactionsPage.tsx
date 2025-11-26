import Transactions from "../components/Transactions";

function TransactionsPage() {
  return (
    <div className="mb-8">
      <header className="text-center mb-4">
        <div>
          <h2 className="text-gray-300 mb-2 text-2xl font-semibold">
            Transactions
          </h2>
          <p className="text-gray-400">
            Track, edit, and persist your ledger locally.
          </p>
        </div>
      </header>
      <Transactions />
    </div>
  );
}

export default TransactionsPage;
