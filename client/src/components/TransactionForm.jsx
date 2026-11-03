import { useState } from 'react';
import toast from 'react-hot-toast';
import api, { errMsg } from '../api/axios.js';
import { CATEGORIES, todayISO } from '../utils/format.js';

const initial = { type: 'expense', category: 'Food', amount: '', note: '', date: todayISO() };

export default function TransactionForm({ onAdded }) {
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const setType = (type) => setForm((f) => ({ ...f, type, category: CATEGORIES[type][0] }));

  const submit = async (e) => {
    e.preventDefault();
    const amount = Number(form.amount);
    if (!amount || amount <= 0) return toast.error('Enter a valid amount greater than 0');
    if (!form.date) return toast.error('Please select a date');

    setSaving(true);
    try {
      const { data } = await api.post('/transactions', { ...form, amount });
      toast.success('Transaction added');
      setForm({ ...initial, type: form.type, category: CATEGORIES[form.type][0] });
      onAdded(data);
    } catch (err) {
      toast.error(errMsg(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="card space-y-4">
      <h2 className="text-base font-semibold text-slate-900 dark:text-white">Add transaction</h2>

      <div className="grid grid-cols-2 gap-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-700">
        {['expense', 'income'].map((t) => (
          <button
            type="button"
            key={t}
            onClick={() => setType(t)}
            className={`rounded-md py-1.5 text-sm font-medium capitalize transition ${
              form.type === t
                ? 'bg-white text-slate-900 shadow dark:bg-slate-900 dark:text-white'
                : 'text-slate-500 dark:text-slate-300'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div>
        <label className="label" htmlFor="category">Category</label>
        <select id="category" className="input" value={form.category} onChange={set('category')}>
          {CATEGORIES[form.type].map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label" htmlFor="amount">Amount (₹)</label>
          <input id="amount" type="number" min="0" step="0.01" className="input" placeholder="0.00" value={form.amount} onChange={set('amount')} />
        </div>
        <div>
          <label className="label" htmlFor="date">Date</label>
          <input id="date" type="date" className="input" value={form.date} onChange={set('date')} />
        </div>
      </div>

      <div>
        <label className="label" htmlFor="note">Note (optional)</label>
        <input id="note" maxLength={200} className="input" placeholder="e.g. Groceries" value={form.note} onChange={set('note')} />
      </div>

      <button className="btn w-full" disabled={saving}>{saving ? 'Saving…' : 'Add transaction'}</button>
    </form>
  );
}
