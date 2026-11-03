import { formatCurrency, formatDate } from '../utils/format.js';

export default function TransactionList({ items, onDelete, title = 'Transactions' }) {
  return (
    <div className="card">
      <h2 className="mb-3 text-base font-semibold text-slate-900 dark:text-white">{title}</h2>
      {items.length === 0 ? (
        <p className="py-8 text-center text-sm text-slate-500 dark:text-slate-400">No transactions found.</p>
      ) : (
        <ul className="divide-y divide-slate-100 dark:divide-slate-700">
          {items.map((t) => (
            <li key={t._id} className="flex items-center justify-between gap-3 py-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">{t.category}</p>
                <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                  {formatDate(t.date)}
                  {t.note ? ` · ${t.note}` : ''}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`whitespace-nowrap text-sm font-semibold ${
                    t.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                  }`}
                >
                  {t.type === 'income' ? '+' : '−'}
                  {formatCurrency(t.amount)}
                </span>
                {onDelete && (
                  <button
                    onClick={() => onDelete(t._id)}
                    className="rounded p-1 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-slate-700"
                    aria-label={`Delete ${t.category} transaction`}
                  >
                    🗑
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
