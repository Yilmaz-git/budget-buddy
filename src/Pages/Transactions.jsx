import { useState } from 'react'

function Transactions({ transactions, setTransactions, currency }) {
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)

  const [type, setType] = useState('expense')
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('Food')
  const [date, setDate] = useState(
    new Date().toLocaleDateString('en-CA')
  )

  const formatMoney = (value) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(value)

  const resetForm = () => {
    setTitle('')
    setAmount('')
    setCategory('Food')
    setType('expense')
    setDate(new Date().toLocaleDateString('en-CA'))
    setEditingId(null)
    setShowForm(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!title.trim() || !amount || Number(amount) <= 0) {
      alert('Please enter a valid title and amount.')
      return
    }

    const transactionData = {
      id: editingId ?? Date.now(),
      title: title.trim(),
      amount: Number(amount),
      category,
      type,
      date,
    }

    if (editingId !== null) {
      setTransactions((prev) =>
        prev.map((item) =>
          item.id === editingId ? transactionData : item
        )
      )
    } else {
      setTransactions((prev) => [transactionData, ...prev])
    }

    resetForm()
  }

  const handleEdit = (item) => {
    setEditingId(item.id)
    setTitle(item.title)
    setAmount(String(item.amount))
    setCategory(item.category)
    setType(item.type)
    setDate(item.date)
    setShowForm(true)
  }

  const handleDelete = (id) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this transaction?'
    )

    if (confirmed) {
      setTransactions((prev) =>
        prev.filter((item) => item.id !== id)
      )
    }
  }

  return (
    <div className="transactions-page">
      <header className="topbar">
        <div>
          <p className="welcome-text">MANAGE YOUR MONEY</p>
          <h1>Transactions</h1>
          <p className="subtitle">
            View and manage all your transactions.
          </p>
        </div>
      </header>

      <section className="transactions-section">
        <div className="section-header">
          <div>
            <h2>All Transactions</h2>
            <p>Keep track of your income and expenses.</p>
          </div>

          <button
            className="add-button"
            onClick={() => {
              resetForm()
              setShowForm(true)
            }}
          >
            + Add Transaction
          </button>
        </div>

        {showForm && (
          <form className="transaction-form" onSubmit={handleSubmit}>
            <h3>
              {editingId !== null
                ? 'Edit Transaction'
                : 'Add New Transaction'}
            </h3>

            <label>Transaction Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>

            <label>Transaction Name</label>
            <input
              type="text"
              placeholder="e.g. Grocery Shopping"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <label>Amount</label>
            <input
              type="number"
              placeholder="Enter amount"
              min="0.01"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />

            <label>Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="Food">Food</option>
              <option value="Shopping">Shopping</option>
              <option value="Transport">Transport</option>
              <option value="Education">Education</option>
              <option value="Bills">Bills</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Salary">Salary</option>
              <option value="Scholarship">Scholarship</option>
              <option value="Other">Other</option>
            </select>

            <label>Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />

            <div className="form-buttons">
              <button type="submit" className="add-button">
                {editingId !== null ? 'Update' : 'Save Transaction'}
              </button>

              <button
                type="button"
                className="cancel-button"
                onClick={resetForm}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className="transaction-list">
          {transactions.length === 0 ? (
            <div className="empty-state">
              <h3>No transactions yet</h3>
              <p>Add your first income or expense to get started.</p>
            </div>
          ) : (
            transactions.map((item) => (
              <div className="transaction-item" key={item.id}>
                <div className="transaction-icon">
                  {item.type === 'income' ? '💰' : '💳'}
                </div>

                <div className="transaction-info">
                  <h3>{item.title}</h3>
                  <p>{item.date} · {item.category}</p>
                </div>

                <strong
                  className={
                    item.type === 'income'
                      ? 'income-amount'
                      : 'expense-amount'
                  }
                >
                  {item.type === 'income' ? '+' : '-'}
                  {formatMoney(item.amount)}
                </strong>

                <button
                  className="edit-button"
                  onClick={() => handleEdit(item)}
                >
                  Edit
                </button>

                <button
                  className="delete-button"
                  onClick={() => handleDelete(item.id)}
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  )
}

export default Transactions