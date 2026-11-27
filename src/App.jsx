
import { useState, useEffect } from 'react'
import './App.css'
import Statistics from './Pages/Statistics'
import Transactions from './Pages/Transactions'

function App() {

  // Currency
const [currency, setCurrency] = useState(() => {
  return localStorage.getItem('budgetBuddyCurrency') || 'TRY'
})

const [activePage, setActivePage] = useState('dashboard')

  // Load operations from LocalStorage
  const [transactions, setTransactions] = useState(() => {
    try {
      const saved = localStorage.getItem('budgetBuddyTransactions')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

    // Save transactions
  useEffect(() => {
    localStorage.setItem(
      'budgetBuddyTransactions',
      JSON.stringify(transactions)
    )
  }, [transactions])

  // Save currency
  useEffect(() => {
    localStorage.setItem('budgetBuddyCurrency', currency)
  }, [currency])

  // Currency format
  const formatMoney = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(value)
  }

  // Total income
  const totalIncome = transactions
    .filter(item => item.type === 'income')
    .reduce((total, item) => total + Number(item.amount), 0)

  // Total expenses
  const totalExpenses = transactions
    .filter(item => item.type === 'expense')
    .reduce((total, item) => total + Number(item.amount), 0)

  // Balance
  const balance = totalIncome - totalExpenses


  
  return (
    <div className="app-container">

      {/* SIDEBAR */}
      <aside className="sidebar">

        <div className="brand">
          <span className="brand-icon">✦</span>
          <h2>Budget Buddy</h2>
        </div>

        <p className="menu-title">MENU</p>

        <nav className="navigation">
        <button
          className={`nav-item ${activePage === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActivePage('dashboard')}
>
          ▦ Dashboard
        </button>
          <button
  className={`nav-item ${activePage === 'transactions' ? 'active' : ''}`}
  onClick={() => setActivePage('transactions')}
>
  ↔ Transactions
</button>
          <button
          className={`nav-item ${activePage === 'statistics' ? 'active' : ''}`}
          onClick={() => setActivePage('statistics')}
          >
          ▥ Statistics
          </button>
        </nav>

        <div className="sidebar-bottom">
          <a href="#settings" className="nav-item">
            ⚙ Settings
          </a>
          <p>Manage your money wisely.</p>
        </div>

      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content" id="dashboard">
      
        {activePage === 'statistics' ? (
  <Statistics
    transactions={transactions}
    currency={currency}
  />
) : activePage === 'transactions' ? (
  <Transactions
    transactions={transactions}
    setTransactions={setTransactions}
    currency={currency}
  />
) : (
  <>
        <header className="topbar">

          <div>
            <p className="welcome-text">WELCOME BACK!</p>
            <h1>Dashboard</h1>
            <p className="subtitle">
              Here's what's happening with your money today.
            </p>
          </div>

  <div className="profile">

  <select
    className="currency-select"
    value={currency}
    onChange={(e) => setCurrency(e.target.value)}
  >
    <option value="TRY">TRY (₺)</option>
    <option value="USD">USD ($)</option>
    <option value="EUR">EUR (€)</option>
    <option value="GBP">GBP (£)</option>
  </select>

  <div className="profile-avatar">B</div>
  <span>My Account</span>

</div>

        </header>

        {/* SUMMARY CARDS */}
        <section className="summary-grid">

          <div className="summary-card balance-card">
            <p>Total Balance</p>
            <h2>{formatMoney(balance)}</h2>
            <span>Available balance</span>
          </div>

          <div className="summary-card">

            <div className="card-icon income-icon">↗</div>

            <p>Total Income</p>
            <h2>{formatMoney(totalIncome)}</h2>
            <span>All transactions</span>

          </div>

          <div className="summary-card">

            <div className="card-icon expense-icon">↘</div>

            <p>Total Expenses</p>
            <h2>{formatMoney(totalExpenses)}</h2>
            <span>All transactions</span>

          </div>

        </section>

        <footer className="footer">
          © 2026 Budget Buddy. Your money, your control.
        </footer>
  </>
  )}
      </main>

    </div>
  )
}

export default App
