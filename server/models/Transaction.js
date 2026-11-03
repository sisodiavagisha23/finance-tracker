const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: { type: String, enum: ['income', 'expense'], required: [true, 'Type is required'] },
    category: { type: String, required: [true, 'Category is required'], trim: true },
    amount: { type: Number, required: [true, 'Amount is required'], min: [0.01, 'Amount must be positive'] },
    note: { type: String, trim: true, maxlength: 200, default: '' },
    date: { type: Date, required: true, default: Date.now },
  },
  { timestamps: true }
);

transactionSchema.index({ user: 1, date: -1 });

module.exports = mongoose.model('Transaction', transactionSchema);
