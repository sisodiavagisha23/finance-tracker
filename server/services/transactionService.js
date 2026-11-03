const mongoose = require('mongoose');
const Transaction = require('../models/Transaction');

const buildFilter = (userId, query) => {
  const filter = { user: userId };
  if (query.type && ['income', 'expense'].includes(query.type)) filter.type = query.type;
  if (query.category) filter.category = query.category;
  if (query.startDate || query.endDate) {
    filter.date = {};
    if (query.startDate) filter.date.$gte = new Date(query.startDate);
    if (query.endDate) {
      const end = new Date(query.endDate);
      end.setHours(23, 59, 59, 999);
      filter.date.$lte = end;
    }
  }
  return filter;
};

const list = async (userId, query) => {
  const page = Math.max(parseInt(query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(query.limit, 10) || 100, 1), 500);
  const filter = buildFilter(userId, query);
  const [items, total] = await Promise.all([
    Transaction.find(filter).sort({ date: -1, createdAt: -1 }).skip((page - 1) * limit).limit(limit),
    Transaction.countDocuments(filter),
  ]);
  return { items, total, page, pages: Math.ceil(total / limit) };
};

const create = (userId, data) =>
  Transaction.create({
    user: userId,
    type: data.type,
    category: data.category,
    amount: data.amount,
    note: data.note,
    date: data.date || Date.now(),
  });

const remove = (userId, id) => Transaction.findOneAndDelete({ _id: id, user: userId });

const summary = async (userId, query) => {
  const filter = buildFilter(userId, query);
  filter.user = new mongoose.Types.ObjectId(userId);

  const [totals, byCategory, byMonth] = await Promise.all([
    Transaction.aggregate([{ $match: filter }, { $group: { _id: '$type', total: { $sum: '$amount' } } }]),
    Transaction.aggregate([
      { $match: { ...filter, type: 'expense' } },
      { $group: { _id: '$category', total: { $sum: '$amount' } } },
      { $sort: { total: -1 } },
    ]),
    Transaction.aggregate([
      { $match: filter },
      {
        $group: {
          _id: { y: { $year: '$date' }, m: { $month: '$date' }, type: '$type' },
          total: { $sum: '$amount' },
        },
      },
      { $sort: { '_id.y': 1, '_id.m': 1 } },
    ]),
  ]);

  const income = totals.find((t) => t._id === 'income')?.total || 0;
  const expense = totals.find((t) => t._id === 'expense')?.total || 0;

  const monthMap = {};
  byMonth.forEach(({ _id, total }) => {
    const key = `${_id.y}-${String(_id.m).padStart(2, '0')}`;
    monthMap[key] = monthMap[key] || { month: key, income: 0, expense: 0 };
    monthMap[key][_id.type] = total;
  });

  return {
    income,
    expense,
    balance: income - expense,
    categories: byCategory.map((c) => ({ name: c._id, value: c.total })),
    monthly: Object.values(monthMap),
  };
};

const toCSV = (items) => {
  const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const header = ['Date', 'Type', 'Category', 'Amount', 'Note'].join(',');
  const rows = items.map((t) =>
    [esc(t.date.toISOString().slice(0, 10)), esc(t.type), esc(t.category), t.amount, esc(t.note)].join(',')
  );
  return [header, ...rows].join('\n');
};

module.exports = { list, create, remove, summary, toCSV, buildFilter };
