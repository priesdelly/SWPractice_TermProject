const Staff = require('../models/Staff');
const Company = require("../models/Company");
const User = require("../models/User");

exports.companyStaff = async (req, res, next) => {
  try {

    if (req.user.role === 'admin') {
      return next();
    }

    const companyId = req.params.id;
    const userId = req.user.id;

    const staff = await Staff.find({
      userId,
      companyId
    });

    if (staff.length === 0) {
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
}
