import { useCallback, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import api, { errMsg } from '../api/axios.js';
import { useAuth } from '../context/AuthContext.jsx';
import Navbar from '../components/Navbar.jsx';
import StatCard from '../components/StatCard.jsx';
import TransactionForm from '../components/TransactionForm.jsx';
import ProfileCard from '../components/ProfileCard.jsx';
import TransactionList from '../components/TransactionList.jsx';
import Filters from '../components/Filters.jsx';
import { CategoryPie, MonthlyBar } from '../components/Charts.jsx';
import Spinner from '../components/Spinner.jsx';

const emptyFilters = { type: '', category: '', startDate: '', endDate: '' };
const emptySummary = { income: 0, expense: 0, balance: 0, categories: [], monthly: [] };

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [filters, setFilters] = useState(emptyFilters);
  const [items, setItems] = useState([]);
  const [summary, setSummary] = useState(emptySummary);
  const [loading, setLoading] = useState(true);

  const params = useMemo(() => Object.fromEntries(Object.entries(filters).filter(([, v]) => v)), [filters]);

  const load = useCallback(async () => {
    try {
      const [tx, sum] = await Promise.all([
        api.get('/transactions', { params }),
        api.get('/transactions/summary', { params }),
      ]);
      setItems(tx.data.items);
      setSummary(sum.data);
    } catch (err) {
      toast.error(errMsg(err));
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    load();
  }, [load]);

  const handleDelete = async (id) => {
    const previous = items;
    setItems((list) => list.filter((t) => t._id !== id)); // optimistic update
    try {
      await api.delete(`/transactions/${id}`);
      toast.success('Transaction deleted');
      load();
    } catch (err) {
      setItems(previous);
      toast.error(errMsg(err));
    }
  };

  const handleExport = async () => {
    try {
      const res = await api.get('/transactions/export', { params, responseType: 'blob' });
      const url = URL.createObjectURL(res.data);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'transactions.csv';
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      toast.error(errMsg(err));
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-6xl space-y-6 px-4 py-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Hello, {user?.name?.split(' ')[0]} 👋</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Here's your financial overview.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard label="Income" value={summary.income} tone="income" icon="💰" />
          <StatCard label="Expenses" value={summary.expense} tone="expense" icon="💸" />
          <StatCard label="Balance" value={summary.balance} tone="balance" icon="🏦" />
        </div>

        {loading ? (
          <Spinner />
        ) : (
          <>
            <div className="grid gap-6 lg:grid-cols-2">
              <CategoryPie data={summary.categories} />
              <MonthlyBar data={summary.monthly} />
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              <div className="space-y-6 lg:col-span-1">
                <ProfileCard user={user} count={items.length} balance={summary.balance} onLogout={logout} />
                <TransactionForm onAdded={load} />
              </div>
              <div className="space-y-4 lg:col-span-2">
                <Filters filters={filters} onChange={setFilters} onExport={handleExport} />
                <TransactionList items={items} onDelete={handleDelete} />
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}