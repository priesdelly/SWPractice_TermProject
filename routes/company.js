const express = require('express');
const { Validator } = require("express-json-validator-middleware");
const {
  list,
  detail,
  add,
  update,
  del,
  getStaff,
  addStaff,
  deleteStaff
} = require('../controllers/company');
const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

const companyRegisterSchemaRequest = {
  type: 'object',
  required: [ 'name', 'address', 'desc', 'website', 'tel' ],
  properties: {
    name: {
      type: 'string'
    },
    address: {
      type: 'string'
    },
    desc: {
      type: 'string'
    },
    website: {
      type: 'string'
    },
    tel: {
      type: 'string'
    }
  }
}

const companyUpdateSchemaRequest = {
  type: 'object',
  properties: {
    name: {
      type: 'string'
    },
    address: {
      type: 'string'
    },
    desc: {
      type: 'string'
    },
    website: {
      type: 'string'
    },
    tel: {
      type: 'string'
    },
    function: {
      type: 'string',
      enum: [ 'A', 'D' ]
    }
  }
}

const { validate } = new Validator();

router.route("/")
  .get(list)
  .post(validate({ body: companyRegisterSchemaRequest }), protect, authorize('admin'), add)

router.route("/:id")
  .get(detail)
  .put(validate({ body: companyUpdateSchemaRequest }), protect, authorize('admin'), update)
  .delete(protect, authorize('admin'), del);

module.exports = router;
