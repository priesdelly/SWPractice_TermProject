const express = require('express');
const { Validator } = require("express-json-validator-middleware");
const { profile, updateRole, addStaff } = require('../controllers/user');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

const userRoleSchemaRequest = {
  type: 'object',
  required: [ 'role' ],
  properties: {
    role: {
      type: 'string',
      enum: [ 'user', 'admin' ]
    }
  }
}

const { validate } = new Validator();

router.route("/:id")
  .get(protect, authorize('admin'), profile)
  .put(validate({ body: userRoleSchemaRequest }), protect, authorize('admin'), updateRole);

module.exports = router;
