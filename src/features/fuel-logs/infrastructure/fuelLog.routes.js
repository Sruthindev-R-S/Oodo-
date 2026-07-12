const express = require('express');
const FuelLogController = require('./FuelLogController');
const protect = require('../../../shared/middlewares/protect');
const rbac = require('../../../shared/middlewares/rbac');

const router = express.Router();

router.use(protect);

router.post('/', rbac(['Admin', 'Dispatcher']), FuelLogController.create);
router.get('/', FuelLogController.list);

module.exports = router;
