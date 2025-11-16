import "./App.css";
import { NavLink, Routes, Route, Navigate } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import TransactionsPage from "./pages/TransactionsPage";
import BudgetsPage from "./pages/BudgetsPage";

function App() {
  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      <header className="border-b border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-center mb-6 text-3xl font-bold">BudgetWise</h1>
          
          <nav className="w-full max-w-md mx-auto">
            <div className="grid w-full grid-cols-3 bg-white/10 backdrop-blur-sm rounded-lg p-1">
              <NavLink 
                to="/dashboard" 
                className={({ isActive }) => 
                  `text-blue-600 py-2 px-3 rounded-md text-center font-medium transition-all ${
                    isActive ? 'bg-white shadow-md' : 'hover:bg-white/20'
                  }`
                }
              >
                Dashboard
              </NavLink>
              <NavLink 
                to="/transactions" 
                className={({ isActive }) => 
                  `text-blue-600 py-2 px-3 rounded-md text-center font-medium transition-all ${
                    isActive ? 'bg-white shadow-md' : 'hover:bg-white/20'
                  }`
                }
              >
                Transactions
              </NavLink>
              <NavLink 
                to="/budgets" 
                className={({ isActive }) => 
                  `text-blue-600 py-2 px-3 rounded-md text-center font-medium transition-all ${
                    isActive ? 'bg-white shadow-md' : 'hover:bg-white/20'
                  }`
                }
              >
                Budgets
              </NavLink>
            </div>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/budgets" element={<BudgetsPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
