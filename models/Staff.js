const mongoose = require('mongoose');

const StaffSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [ true, 'Please add a user id' ]
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: [ true, 'Please add a company id' ]
  },
});

StaffSchema.index({ userId: 1, companyId: 1 }, { unique: true });

module.exports = mongoose.model('Staff', StaffSchema);
