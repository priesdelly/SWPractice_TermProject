const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: [ true, 'Please add a company id' ]
  },
  name: {
    type: String,
    unique: true,
    required: [ true, 'Please add a job name' ]
  },
  shortDesc: {
    type: String,
  },
  desc: {
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
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

JobSchema.virtual('companyDetail', {
  ref: 'Company',
  localField: '_id',
  foreignField: 'companyId',
  justOne: true,
});

JobSchema.index({ companyId: 1, name: 1 }, { unique: true });
module.exports = mongoose.model('Job', JobSchema);
