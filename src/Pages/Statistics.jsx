
import { useMemo } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar, Doughnut } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
)

function Statistics({ transactions, currency }) {
  const monthlyData = useMemo(() => {
    const months = [
      'January', 'February', 'March', 'April',
      'May', 'June', 'July', 'August',
      'September', 'October', 'November', 'December'
    ]

    const income = Array(12).fill(0)
    const expenses = Array(12).fill(0)

    transactions.forEach((transaction) => {
      const month = Number(transaction.date.split('-')[1]) - 1

      if (month >= 0 && month < 12) {
        if (transaction.type === 'income') {
          income[month] += Number(transaction.amount)
        } else {
          expenses[month] += Number(transaction.amount)
        }
      }
    })

    return {
      labels: months,
      datasets: [
        {
          label: 'Income',
          data: income,
          backgroundColor: '#72b6a0',
          borderRadius: 6,
        },
        {
          label: 'Expenses',
          data: expenses,
          backgroundColor: '#8ec9dc',
          borderRadius: 6,
        },
      ],
    }
  }, [transactions])

  const categoryData = useMemo(() => {
    const totals = {}

    transactions
      .filter((transaction) => transaction.type === 'expense')
      .forEach((transaction) => {
        totals[transaction.category] =
          (totals[transaction.category] || 0) +
          Number(transaction.amount)
      })

    return {
      labels: Object.keys(totals),
      datasets: [
        {
          data: Object.values(totals),
          backgroundColor: [
            '#155b49',
            '#72b6a0',
            '#8ec9dc',
            '#b7d9c9',
            '#f0c987',
            '#d99a9a',
          ],
          borderWidth: 2,
          borderColor: '#ffffff',
        },
      ],
    }
  }, [transactions])

  const hasTransactions = transactions.length > 0
  const hasExpenses = categoryData.labels.length > 0


const totalIncome = transactions
  .filter((transaction) => transaction.type === 'income')
  .reduce((total, transaction) => total + Number(transaction.amount), 0)

const totalExpenses = transactions
  .filter((transaction) => transaction.type === 'expense')
  .reduce((total, transaction) => total + Number(transaction.amount), 0)

const totalBalance = totalIncome - totalExpenses

const highestExpenseIndex = categoryData.datasets[0].data.indexOf(
  Math.max(...categoryData.datasets[0].data)
)

const highestExpenseCategory = hasExpenses
  ? categoryData.labels[highestExpenseIndex]
  : 'No expenses yet'

const formatMoney = (value) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(value)


  return (
    <div className="statistics-page">
      <div className="section-header">
        <div>
          <h2>Statistics</h2>
          <p>Analyze your income and expenses.</p>
        </div>
      </div>


      <div className="summary-grid">
        <div className="summary-card balance-card">
  <p>Total Balance</p>
  <h2>{formatMoney(totalBalance)}</h2>
  <span>Available balance</span>
</div>
        <div className="summary-card">
          <p>Total Income</p>
          <h2>{formatMoney(totalIncome)}</h2>
          <span>Your total earnings</span>
        </div>

        <div className="summary-card">
          <p>Total Expenses</p>
          <h2>{formatMoney(totalExpenses)}</h2>
          <span>Your total spending</span>
        </div>

        <div className="summary-card">
          <p>Highest Expense Category</p>
          <h2>{highestExpenseCategory}</h2>
          <span>Category with the most spending</span>
        </div>
      </div>


      {!hasTransactions ? (
        <div className="empty-state">
          <h3>No statistics yet</h3>
          <p>Add transactions to see your financial charts.</p>
        </div>
      ) : (
        <>
          <div className="summary-card">
            <h3>Monthly Income & Expenses</h3>
            <Bar
              data={monthlyData}
              options={{
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                  legend: { position: 'top' },
                  tooltip: {
                    callbacks: {
                      label: (context) =>
                        `${context.dataset.label}: ${new Intl.NumberFormat(
                          'en-US',
                          { style: 'currency', currency }
                        ).format(context.raw)}`,
                    },
                  },
                },
              }}
            />
          </div>

          <div className="summary-card" style={{ marginTop: '25px' }}>
            <h3>Expenses by Category</h3>
            {hasExpenses ? (
              <div style={{ maxWidth: '420px', margin: '20px auto' }}>
                <Doughnut
                  data={categoryData}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: { position: 'bottom' },
                    },
                  }}
                />
              </div>
            ) : (
              <p>No expenses available for category analysis.</p>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default Statistics
