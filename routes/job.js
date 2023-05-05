const express = require('express');
const { Validator } = require("express-json-validator-middleware");
const { list, detail, add, update, del } = require('../controllers/job');
const router = express.Router();

const { protect, authorize } = require('../middleware/auth');
const { companyStaff } = require("../middleware/company");

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
  .post(validate({ body: jobRegisterSchemaRequest }), protect, companyStaff, add);

router.route('/:id')
  .get(detail)
  .put(validate({ body: jobUpdateSchemaRequest }), protect, companyStaff, update)
  .delete(protect, companyStaff, del);

module.exports = router;
