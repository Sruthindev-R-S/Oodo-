const express = require('express');
const ExpenseController = require('./ExpenseController');
const protect = require('../../../shared/middlewares/protect');
const rbac = require('../../../shared/middlewares/rbac');

const router = express.Router();

router.use(protect);

router.post('/', rbac(['Admin', 'Dispatcher']), ExpenseController.create);
router.get('/', ExpenseController.list);

module.exports = router;
