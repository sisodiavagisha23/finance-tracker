const notFound = (req, res, next) => {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let status = err.statusCode || (res.statusCode !== 200 ? res.statusCode : 500);
  let message = err.message || 'Server error';

  if (err.name === 'ValidationError') {
    status = 400;
    message = Object.values(err.errors).map((e) => e.message).join(', ');
  }
  if (err.code === 11000) {
    status = 409;
    message = 'An account with this email already exists';
  }
  if (err.name === 'CastError') {
    status = 400;
    message = 'Invalid ID format';
  }

  if (process.env.NODE_ENV !== 'production') console.error(err);
  res.status(status).json({ message });
};

module.exports = { notFound, errorHandler };
