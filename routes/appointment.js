const express = require('express');
const { Validator } = require("express-json-validator-middleware");
const { booking, list, detail, update, del, updateStatus } = require('../controllers/appointment');
const router = express.Router();

const { protect, authorize } = require('../middleware/auth');
const { appointmentOwner, appointmentStaff } = require("../middleware/appointment");

const appointmentBookingSchemaRequest = {
  type: 'object',
  required: [ 'jobId', 'time' ],
  properties: {
    jobId: {
      type: 'string'
    },
    time: {
      type: 'string'
    }
  }
}

const appointmentUpdateSchemaRequest = {
  type: 'object',
  required: [ 'time' ],
  properties: {
    time: {
      type: 'string'
    }
  }
}

const appointmentUpdateStatusSchemaRequest = {
  type: 'object',
  required: [ 'applyStatus' ],
  properties: {
    applyStatus: {
      type: 'string',
      enum: [ 'in progress', 'rejected', 'accepted' ]
    }
  }
}

const { validate } = new Validator();

router.post('/booking', validate({ body: appointmentBookingSchemaRequest }), protect, authorize('user'), booking);
router.get('/', protect, list);
router.route("/:id")
  .get(protect, appointmentOwner, detail)
  .put(validate({ body: appointmentUpdateSchemaRequest }), protect, appointmentOwner, update)
  .delete(protect, appointmentOwner, del)

router.put("/:id/status", validate({ body: appointmentUpdateStatusSchemaRequest }), protect, authorize('admin'), updateStatus);

module.exports = router;
