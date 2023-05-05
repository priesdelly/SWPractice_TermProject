const Appointment = require("../models/Appointment");
const Job = require("../models/Job");
const Company = require("../models/Company");
const User = require("../models/User");

const moment = require('moment');
const CACHE_TIME = 60;

//@desc     Booking job interview
//@route    get /api/v1/appointment/booking
//@access   Private
exports.booking = async (req, res, next) => {
  try {
    const { jobId, time } = req.body;
    const userId = req.user.id;
    const applyStatus = "pending";

    //Check is valid time format
    if (!moment(time, moment.ISO_8601, true).isValid()) {
      return res.status(400).json({
        success: false,
        msg: 'Invalid booking date time value or format (ISO 8601)'
      });
    }

    //Check is valid booking time
    const startDate = moment('2022-05-10');
    const endDate = moment('2022-05-13').endOf('day');
    if (!moment(time).isBetween(startDate, endDate)) {
      return res.status(400).json({
        success: false,
        msg: 'Invalid booking date time (during May 10th - 13th, 2022)'
      });
    }

    //Check user have already book 3 appointments
    const count = await Appointment.countDocuments({
      "userId": userId,
      "function": "A"
    });

    if (count >= 3) {
      return res.status(400).json({
        success: false,
        msg: 'You can only book 3 appointments'
      });
    }

    const booking = await Appointment.countDocuments({
      "userId": userId,
      "jobId": jobId,
      "function": "A"
    });

    if (booking > 0) {
      return res.status(400).json({
        success: false,
        msg: 'You have already booked this job'
      });
    }

    //TODO generate google meet link
    // let googleMeetLink = "";

    const appointment = await Appointment.create({
      jobId,
      userId,
      applyStatus,
      // googleMeetLink,
      time
    });

    return res.status(201).json({
      success: true,
      data: appointment
    });

  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false
    });
  }
};

//@desc     Booking job list
//@route    GET /api/v1/appointment/
//@access   Private
exports.list = async (req, res, next) => {
  const page = parseInt(req.query.page) > 0 ? parseInt(req.query.page) : 1;
  const limit = 10;
  const skip = (page - 1) * limit;
  try {

    //Default filter for current user
    const userId = req.user.id;
    let filter = {
      "userId": userId,
      "function": "A"
    };

    //Allow admin to see all appointments
    if (req.user.role === "admin") {
      filter = {
        "function": "A"
      };
    }
    const appointments = await Appointment.find(filter)
      .skip(skip)
      .limit(limit)
      .exec();

    for (let i = 0; i < appointments.length; i++) {
      appointments[i].jobDetail = await Job.findById(appointments[i].jobId).cache(CACHE_TIME);
      if (req.user.role === "admin") {
        appointments[i].userDetail = await User.findById(appointments[i].userId).cache(CACHE_TIME);
      }
      appointments[i].jobDetail.companyDetail = await Company.findById(appointments[i].jobDetail.companyId).cache(CACHE_TIME);
    }

    const count = await Appointment.countDocuments(filter);

    return res.status(200).json({
      success: true,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(count / limit),
        totalItems: count,
        itemsPerPage: limit
      },
      data: appointments
    });

  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false
    });
  }
};


//@desc     Booking job detail
//@route    GET /api/v1/appointment/:id
//@access   Private
exports.detail = async (req, res, next) => {
  try {
    const appointmentId = req.params.id;
    const appointments = await Appointment.find({
      "_id": appointmentId,
      "function": "A"
    });

    if (appointments.length === 0) {
      return res.status(404).json({
        success: false
      });
    }

    const appointment = appointments[0];
    appointment.jobDetail = await Job.findById(appointment.jobId).cache(CACHE_TIME);
    appointment.userDetail = await User.findById(appointment.userId).cache(CACHE_TIME);
    appointment.jobDetail.companyDetail = await Company.findById(appointment.jobDetail.companyId).cache(CACHE_TIME);

    return res.status(200).json({
      success: true,
      data: appointment
    });
  } catch (err) {
    console.log(err);
    res.status(500);
  }
};

//@desc     Update booking job detail
//@route    PUT /api/v1/appointment/:id
//@access   Private
exports.update = async (req, res, next) => {
  try {
    const { time } = req.body;

    //Check is valid time format
    if (!moment(time, moment.ISO_8601, true).isValid()) {
      return res.status(400).json({
        success: false,
        msg: 'Invalid booking date time value or format (ISO 8601)'
      });
    }

    //Check is valid booking time
    const startDate = moment('2022-05-10');
    const endDate = moment('2022-05-13').endOf('day');
    if (!moment(time).isBetween(startDate, endDate)) {
      return res.status(400).json({
        success: false,
        msg: 'Invalid booking date time (during May 10th - 13th, 2022)'
      });
    }

    const appointment = await Appointment.findByIdAndUpdate(req.params.id, {
      "time": time
    });

    if (!appointment) {
      return res.status(400).json({
        success: false,
        msg: 'Invalid appointment identify'
      });
    }

    res.status(200).json({
      success: true,
      msg: 'Appointment time updated'
    });

  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Can't update appointment detail"
    });
  }
};


//@desc     Delete booking job detail
//@route    DELETE /api/v1/appointment/:id
//@access   Private
exports.del = async (req, res, next) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(req.params.id, {
      "function": "D"
    });
    if (!appointment) {
      return res.status(400).json({
        success: false,
        msg: 'Invalid appointment identify'
      });
    }
    res.status(200).json({
      success: true,
      data: {}
    });

  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Can't update appointment profile"
    });
  }
};

//@desc     Update booking job apply status
//@route    PUT /api/v1/appointment/:id
//@access   Private
exports.updateStatus = async (req, res, next) => {
  try {
    const { applyStatus } = req.body;
    const appointment = await Appointment.findByIdAndUpdate(req.params.id, {
      "applyStatus": applyStatus
    });
    if (!appointment) {
      return res.status(400).json({
        success: false,
        msg: 'Invalid appointment identify'
      });
    }
    res.status(200).json({
      success: true,
      data: {}
    });

  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Can't update appointment status"
    });
  }
};
