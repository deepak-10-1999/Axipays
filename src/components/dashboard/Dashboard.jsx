import { useCallback, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchTransactions, setLimit, setPage } from '../../store/dashboardSlice.js'
import {
  buildCurrencyTotals,
  buildStatusCounts,
  buildVolumeSeries,
  calculateSuccessVolume,
} from '../../utils/transactions.js'
import ChartGrid from './ChartGrid.jsx'
import DashboardHeader from './DashboardHeader.jsx'
import SummaryGrid from './SummaryGrid.jsx'
import TransactionTable from './TransactionTable.jsx'

const Dashboard = () => {
  const dispatch = useDispatch()
  const { transactions, page, limit, totalPages, loading, error } = useSelector(
    (state) => state.dashboard,
  )

  useEffect(() => {
    dispatch(fetchTransactions({ page, limit }))
  }, [dispatch, page, limit])

  const statusCounts = useMemo(() => buildStatusCounts(transactions), [transactions])
  const currencyTotals = useMemo(() => buildCurrencyTotals(transactions), [transactions])
  const volumeSeries = useMemo(() => buildVolumeSeries(transactions), [transactions])
  const successVolume = useMemo(() => calculateSuccessVolume(transactions), [transactions])

  const totalTransactions = transactions.length
  const successCount = statusCounts.success
  const failedAndPendingCount = statusCounts.failed + statusCounts.pending
  const totalVolumeCurrency = Object.keys(currencyTotals)[0] || 'USD'

  const handlePageChange = useCallback(
    (nextPage) => {
      dispatch(setPage(nextPage))
    },
    [dispatch],
  )

  const handleLimitChange = useCallback(
    (nextLimit) => {
      dispatch(setLimit(nextLimit))
    },
    [dispatch],
  )

  const handleRefresh = useCallback(() => {
    dispatch(fetchTransactions({ page, limit }))
  }, [dispatch, page, limit])

  return (
    <section className="panel">
      <DashboardHeader
        successVolume={successVolume}
        totalVolumeCurrency={totalVolumeCurrency}
        onRefresh={handleRefresh}
        loading={loading}
      />

      <SummaryGrid
        totalTransactions={totalTransactions}
        successVolume={successVolume}
        totalVolumeCurrency={totalVolumeCurrency}
        successCount={successCount}
        failedAndPending={failedAndPendingCount}
      />

      <ChartGrid
        statusCounts={statusCounts}
        totalTransactions={totalTransactions}
        volumeSeries={volumeSeries}
        currencyTotals={currencyTotals}
      />

      <TransactionTable
        transactions={transactions}
        loading={loading}
        error={error}
        page={page}
        totalPages={totalPages}
        limit={limit}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
      />
    </section>
  )
}

export default Dashboard
