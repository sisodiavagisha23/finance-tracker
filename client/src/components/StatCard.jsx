import { formatCurrency } from '../utils/format.js';

const TONES = {
  income: 'text-emerald-600 dark:text-emerald-400',
  expense: 'text-rose-600 dark:text-rose-400',
  balance: 'text-brand-600 dark:text-brand-500',
};

export default function StatCard({ label, value, tone = 'balance', icon }) {
  return (
    <div className="card flex items-center justify-between">
      <div>
        <p className="label !mb-2">{label}</p>
        <p className={`text-2xl font-semibold ${TONES[tone]}`}>{formatCurrency(value)}</p>
      </div>
      <span className="text-3xl" aria-hidden="true">{icon}</span>
    </div>
  );
}
