const express = require('express');
const DriverController = require('./DriverController');
const protect = require('../../../shared/middlewares/protect');
const rbac = require('../../../shared/middlewares/rbac');

const router = express.Router();

router.use(protect);

router.post('/', rbac(['Admin', 'Dispatcher']), DriverController.create);
router.get('/', DriverController.list);
router.get('/:id', DriverController.getById);

module.exports = router;
