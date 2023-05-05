const Appointment = require('../models/Appointment');

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
