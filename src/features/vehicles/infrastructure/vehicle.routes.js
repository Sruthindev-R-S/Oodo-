const express = require('express');
const VehicleController = require('./VehicleController');
const protect = require('../../../shared/middlewares/protect');
const rbac = require('../../../shared/middlewares/rbac');

const router = express.Router();

router.use(protect);

router.post('/', rbac(['Admin', 'Dispatcher']), VehicleController.create);
router.get('/', VehicleController.list);
router.get('/:id', VehicleController.getById);

module.exports = router;
