export const formatCurrency = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(n || 0);

export const formatDate = (d) =>
  new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(d));

export const formatMonth = (key) => {
  const [y, m] = key.split('-');
  return new Intl.DateTimeFormat('en-IN', { month: 'short', year: '2-digit' }).format(new Date(y, m - 1, 1));
};

export const todayISO = () => new Date().toISOString().slice(0, 10);

export const CATEGORIES = {
  expense: ['Food', 'Rent', 'Transport', 'Shopping', 'Bills', 'Health', 'Entertainment', 'Education', 'Other'],
  income: ['Salary', 'Freelance', 'Business', 'Investments', 'Gift', 'Other'],
};
