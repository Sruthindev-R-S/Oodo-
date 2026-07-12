const express = require('express');
const ReportController = require('./ReportController');
const protect = require('../../../shared/middlewares/protect');
const rbac = require('../../../shared/middlewares/rbac');

const router = express.Router();

router.use(protect);
router.get('/vehicle-cost', rbac(['Admin', 'Dispatcher']), ReportController.getVehicleCostReport);

module.exports = router;
