const Appointment = require('../models/Appointment');
const Job = require("../models/Job");

const CACHE_TIME = 60;

async function checkIsCompanyStaff(appointmentId, userId) {
  const appointment = await Appointment.findById(appointmentId).cache(CACHE_TIME);
  if (!appointment) {
    return false;
  }

  const jobId = appointment.jobId;
  const job = await Job.findById(jobId).cache(CACHE_TIME);
  if (!job) {
    return false;
  }

  const staff = await Staff.find({
    "companyId": job.companyId,
    "userId": userId,
  });

  if (staff.length === 0) {
    return false;
  }

  return true;
}

exports.appointmentOwner = async (req, res, next) => {
  try {

    if (req.user.role === 'admin') {
      return next();
    }

    const appointmentId = req.params.id || 0;
    const userId = req.user.id;
    const appointment = await Appointment.find({
      "_id": appointmentId,
      "userId": userId
    });

    if (appointment.length === 0) {
      return res.status(401).json({
        success: false,
        msg: 'Not authorize to access route'
      });
    }
    return next();
  } catch (err) {
    console.log(err);
    return res.status(401).json({
      success: false,
      message: 'Not authorize to access route'
    });
  }
};
