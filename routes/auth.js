const express = require('express');
const { Validator } = require("express-json-validator-middleware");
const { register, login, getMe, logout, deleteMe } = require('../controllers/auth');
const router = express.Router();

const { protect } = require('../middleware/auth');

const userRegisterSchemaRequest = {
  type: 'object',
  required: [ 'email', 'password', 'name', 'tel' ],
  properties: {
    email: {
      type: 'string'
    },
    password: {
      type: 'string'
    },
    name: {
      type: 'string'
    },
    tel: {
      type: 'string'
    }
  }
}

const userLoginSchemaRequest = {
  type: 'object',
  required: [ 'email', 'password' ],
  properties: {
    email: {
      type: 'string',
    },
    password: {
      type: 'string',
    }
  }
}

const { validate } = new Validator();

router.post('/register', validate({ body: userRegisterSchemaRequest }), register);
router.post('/login', validate({ body: userLoginSchemaRequest }), login);
router.get('/me', protect, getMe);
router.get('/logout', logout);
router.delete('/me', protect, deleteMe);

module.exports = router;
