const express = require('express');
const MaintenanceController = require('./MaintenanceController');
const protect = require('../../../shared/middlewares/protect');
const rbac = require('../../../shared/middlewares/rbac');

const router = express.Router();

router.use(protect);

router.post('/', rbac(['Admin', 'Dispatcher']), MaintenanceController.create);
router.put('/:id/close', rbac(['Admin', 'Dispatcher']), MaintenanceController.close);
router.get('/', MaintenanceController.list);

module.exports = router;
