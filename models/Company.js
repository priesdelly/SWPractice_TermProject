const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [ true, 'Please add a name' ],
    unique: true,
  },
  address: {
    type: String,
  },
  desc: {
    type: String,
  },
  website: {
    type: String,
  },
  tel: {
    type: String,
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
  function: {
    type: String,
    default: 'A',
    select: false,
  },
});

module.exports = mongoose.model('Company', CompanySchema);
