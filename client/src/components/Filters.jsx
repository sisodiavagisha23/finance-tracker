import { CATEGORIES } from '../utils/format.js';

const ALL_CATEGORIES = [...new Set([...CATEGORIES.expense, ...CATEGORIES.income])];

export default function Filters({ filters, onChange, onExport }) {
  const set = (k) => (e) => onChange({ ...filters, [k]: e.target.value });

  return (
    <div className="card grid grid-cols-2 gap-3 md:grid-cols-5">
      <div>
        <label className="label" htmlFor="f-type">Type</label>
        <select id="f-type" className="input" value={filters.type} onChange={set('type')}>
          <option value="">All</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
      </div>
      <div>
        <label className="label" htmlFor="f-cat">Category</label>
        <select id="f-cat" className="input" value={filters.category} onChange={set('category')}>
          <option value="">All</option>
          {ALL_CATEGORIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="label" htmlFor="f-from">From</label>
        <input id="f-from" type="date" className="input" value={filters.startDate} onChange={set('startDate')} />
      </div>
      <div>
        <label className="label" htmlFor="f-to">To</label>
        <input id="f-to" type="date" className="input" value={filters.endDate} onChange={set('endDate')} />
      </div>
      <div className="col-span-2 flex items-end gap-2 md:col-span-1">
        <button className="btn-ghost flex-1" onClick={() => onChange({ type: '', category: '', startDate: '', endDate: '' })}>
          Reset
        </button>
        <button className="btn flex-1" onClick={onExport}>CSV</button>
      </div>
    </div>
  );
}
