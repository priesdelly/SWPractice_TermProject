const express = require('express');
const { Validator } = require("express-json-validator-middleware");
const { list, detail, update, del } = require('../controllers/user');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

const userRoleSchemaRequest = {
  type: 'object',
  properties: {
    name: {
      type: 'string'
    },
    role: {
      type: 'string',
      enum: [ 'user', 'admin' ]
    },
    function: {
      type: 'string',
      enum: [ 'A', 'D' ]
    }
  }
}

const { validate } = new Validator();

router.get("/", protect, authorize('admin'), list);

router.route("/:id")
  .get(protect, authorize('admin'), detail)
  .put(validate({ body: userRoleSchemaRequest }), protect, authorize('admin'), update)
  .delete(protect, authorize('admin'), del);

module.exports = router;
