const express = require('express');
const { Validator } = require("express-json-validator-middleware");
const { register, getProfile, addStaff, deleteStaff } = require('../controllers/company');
const router = express.Router();

const { protect, authorize } = require('../middleware/auth');
const { companyStaff } = require("../middleware/company");

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

const staffSchemaRequest = {
  type: 'object',
  required: [ 'userId' ],
  properties: {
    userId: {
      type: 'string'
    }
  }
}

const { validate } = new Validator();

router.post("/register", validate({ body: companyRegisterSchemaRequest }), protect, authorize('admin'), register)
router.route("/:id")
  .get(getProfile)
  .put(validate({ body: companyRegisterSchemaRequest }), protect, companyStaff, register);

router.route("/:id/staff")
  .post(validate({ body: staffSchemaRequest }), protect, authorize('admin'), addStaff)
  .delete(validate({ body: staffSchemaRequest }), protect, authorize('admin'), deleteStaff);

module.exports = router;
