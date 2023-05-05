const express = require('express');
const { Validator } = require("express-json-validator-middleware");
const { list, detail, add, update, del } = require('../controllers/job');
const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

const jobRegisterSchemaRequest = {
  type: 'object',
  required: [ 'companyId', 'name', 'shortDesc', 'desc' ],
  properties: {
    name: {
      type: 'string'
    },
    companyId: {
      type: 'string'
    },
    desc: {
      type: 'string'
    },
    shortDesc: {
      type: 'string'
    }
  }
}

const jobUpdateSchemaRequest = {
  type: 'object',
  required: [ 'name', 'shortDesc', 'desc' ],
  properties: {
    name: {
      type: 'string'
    },
    desc: {
      type: 'string'
    },
    shortDesc: {
      type: 'string'
    }
  }
}

const { validate } = new Validator();

router.route("/")
  .get(list)
  .post(validate({ body: jobRegisterSchemaRequest }), protect, authorize('admin'), add);

router.route('/:id')
  .get(detail)
  .put(validate({ body: jobUpdateSchemaRequest }), protect, authorize('admin'), update)
  .delete(protect, authorize('admin'), del);

module.exports = router;
