const express = require('express');
const TripController = require('./TripController');
const protect = require('../../../shared/middlewares/protect');
const rbac = require('../../../shared/middlewares/rbac');

const router = express.Router();

router.use(protect);

router.post('/', rbac(['Admin', 'Dispatcher']), TripController.create);
router.get('/', TripController.list);
router.get('/:id', TripController.getById);

router.post('/:id/dispatch', rbac(['Admin', 'Dispatcher']), TripController.dispatch);
router.post('/:id/complete', rbac(['Admin', 'Dispatcher']), TripController.complete);
router.post('/:id/cancel', rbac(['Admin', 'Dispatcher']), TripController.cancel);

module.exports = router;
