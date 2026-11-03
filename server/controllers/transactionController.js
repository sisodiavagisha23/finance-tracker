const service = require('../services/transactionService');

exports.getTransactions = async (req, res, next) => {
  try {
    res.json(await service.list(req.user._id, req.query));
  } catch (err) {
    next(err);
  }
};

exports.addTransaction = async (req, res, next) => {
  try {
    const { type, category, amount } = req.body;
    if (!type || !category || amount === undefined) {
      return res.status(400).json({ message: 'Type, category and amount are required' });
    }
    const tx = await service.create(req.user._id, req.body);
    res.status(201).json(tx);
  } catch (err) {
    next(err);
  }
};

exports.deleteTransaction = async (req, res, next) => {
  try {
    const tx = await service.remove(req.user._id, req.params.id);
    if (!tx) return res.status(404).json({ message: 'Transaction not found' });
    res.json({ message: 'Transaction deleted', id: req.params.id });
  } catch (err) {
    next(err);
  }
};

exports.getSummary = async (req, res, next) => {
  try {
    res.json(await service.summary(req.user._id, req.query));
  } catch (err) {
    next(err);
  }
};

exports.exportCSV = async (req, res, next) => {
  try {
    const { items } = await service.list(req.user._id, { ...req.query, limit: 500 });
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="transactions.csv"');
    res.send(service.toCSV(items));
  } catch (err) {
    next(err);
  }
};
