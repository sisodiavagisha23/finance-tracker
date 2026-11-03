import { formatCurrency } from '../utils/format.js';

const initials = (name = '') =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('') || '?';

export default function ProfileCard({ user, count, balance, onLogout }) {
  return (
    <div className="card text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-brand-600 text-2xl font-semibold text-white">
        {initials(user?.name)}
      </div>
      <h2 className="mt-3 text-lg font-semibold text-slate-900 dark:text-white">{user?.name}</h2>
      <p className="break-all text-sm text-slate-500 dark:text-slate-400">{user?.email}</p>

      <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4 dark:border-slate-700">
        <div>
          <p className="label !mb-1">Transactions</p>
          <p className="text-base font-semibold text-slate-900 dark:text-white">{count}</p>
        </div>
        <div>
          <p className="label !mb-1">Balance</p>
          <p className="text-base font-semibold text-brand-600 dark:text-brand-500">{formatCurrency(balance)}</p>
        </div>
      </div>

      <button onClick={onLogout} className="btn-ghost mt-4 w-full border border-slate-200 dark:border-slate-600">
        Logout
      </button>
    </div>
  );
}