import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import { formatCurrency, formatMonth } from '../utils/format.js';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#8b5cf6', '#ec4899', '#84cc16', '#64748b'];

const Empty = ({ text }) => (
  <div className="flex h-64 items-center justify-center text-sm text-slate-500 dark:text-slate-400">{text}</div>
);

export function CategoryPie({ data }) {
  return (
    <div className="card">
      <h2 className="mb-3 text-base font-semibold text-slate-900 dark:text-white">Spending by category</h2>
      {data.length === 0 ? (
        <Empty text="Add an expense to see the breakdown." />
      ) : (
        <div className="h-72">
          <ResponsiveContainer>
            <PieChart>
              <Pie data={data} dataKey="value" nameKey="name" innerRadius={55} outerRadius={95} paddingAngle={2}>
                {data.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => formatCurrency(v)} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export function MonthlyBar({ data }) {
  const chartData = data.map((d) => ({ ...d, label: formatMonth(d.month) }));
  return (
    <div className="card">
      <h2 className="mb-3 text-base font-semibold text-slate-900 dark:text-white">Monthly income vs expense</h2>
      {chartData.length === 0 ? (
        <Empty text="No data yet." />
      ) : (
        <div className="h-72">
          <ResponsiveContainer>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#94a3b833" />
              <XAxis dataKey="label" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} width={55} />
              <Tooltip formatter={(v) => formatCurrency(v)} />
              <Legend />
              <Bar dataKey="income" name="Income" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expense" name="Expense" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
