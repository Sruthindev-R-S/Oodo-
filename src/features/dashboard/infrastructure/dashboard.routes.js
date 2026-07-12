const express = require('express');
const DashboardController = require('./DashboardController');
const protect = require('../../../shared/middlewares/protect');

const router = express.Router();

router.use(protect);
router.get('/stats', DashboardController.getStats);

module.exports = router;
