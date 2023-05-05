const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
  jobId: {
    type: String,
    required: [ true, 'Please add a job id' ],
  },
  userId: {
    type: String,
    required: [ true, 'Please add a user id' ],
  },
  time: {
    type: Date,
  },
  applyStatus: {
    type: String,
  },
  googleMeetLink: {
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

AppointmentSchema.virtual('userDetail', {
  ref: 'User',
  localField: '_id',
  foreignField: 'userId',
  justOne: true,
});

AppointmentSchema.virtual('jobDetail', {
  ref: 'Job',
  localField: '_id',
  foreignField: 'jobId',
  justOne: true,
});

AppointmentSchema.index({ jobId: 1, userId: 1 }, { unique: true });
module.exports = mongoose.model('Appointment', AppointmentSchema);
