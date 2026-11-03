const router = require('express').Router();
const c = require('../controllers/transactionController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/summary', c.getSummary);
router.get('/export', c.exportCSV);
router.route('/').get(c.getTransactions).post(c.addTransaction);
router.delete('/:id', c.deleteTransaction);

module.exports = router;
