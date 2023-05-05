const User = require('../models/User');
const Company = require("../models/Company");
const Appointment = require("../models/Appointment");
const crypto = require("crypto");

//@desc     Get list user
//@route    GET /api/v1/user/
//@access   Private
exports.list = async (req, res, next) => {

  const page = parseInt(req.query.page) > 0 ? parseInt(req.query.page) : 1;
  const limit = 10;
  const skip = (page - 1) * limit;

  try {
    const user = await User.find({
      "function": "A"
    }).skip(skip)
      .limit(limit)
      .exec();

    const count = await Company.countDocuments({
      "function": "A"
    });

    return res.status(200).json({
      success: true,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(count / limit),
        totalItems: count,
        itemsPerPage: limit
      },
      data: user,
    });

  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Can't get user profile"
    });
  }
};


//@desc     Get user profile
//@route    GET /api/v1/user/:id
//@access   Private
exports.detail = async (req, res, next) => {
  try {
    const user = await User.find({
      "_id": req.params.id,
      "function": "A"
    });

    if (user.length === 0) {
      return res.status(404).json({
        success: false
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });

  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Can't get user profile"
    });
  }
};

//@desc     Update user
//@route    PUT /api/v1/user/:id
//@access   Private
exports.update = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body);
    if (!user) {
      return res.status(400).json({
        success: false,
        msg: 'Invalid user identify'
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
      message: "Can't update user"
    });
  }
};

//@desc     Delete user
//@route    DELETE /api/v1/user/:id
//@access   Private
exports.del = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const uuid = crypto.randomUUID();
    const user = await User.findByIdAndUpdate(userId, {
      "name": uuid,
      "email": `${ uuid }@gmail.com`,
      "tel": "0000000000",
      "function": "D"
    }, {
      new: true,
      runValidators: false,
    });

    if (!user) {
      return res.status(400).json({ success: false });
    }

    await Appointment.updateMany({ userId: userId }, { "function": "D" });

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Can't delete user"
    });
  }
};
