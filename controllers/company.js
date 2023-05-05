const Company = require('../models/Company');
const User = require('../models/User');
const Staff = require('../models/Staff');

//@desc     Get company list
//@route    get /api/v1/company
//@access   Private
exports.list = async (req, res, next) => {

  const page = parseInt(req.query.page) > 0 ? parseInt(req.query.page) : 1;
  const limit = 5;
  const skip = (page - 1) * limit;

  try {
    const company = await Company.find({
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
      data: company,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false
    });
  }
};

//@desc     Register company
//@route    POST /api/v1/company/register
//@access   Private
exports.add = async (req, res, next) => {
  try {
    const { name, address, desc, website, tel } = req.body;
    const company = await Company.create({
      name,
      address,
      desc,
      website,
      tel,
    });

    res.status(201).json({
      success: true,
      data: company
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false
    });
  }
};

//@desc     Get company profile
//@route    GET /api/v1/company/:id
//@access   Public
exports.detail = async (req, res, next) => {
  try {
    const companyId = req.params.id;
    const company = await Company.find({
      "_id": companyId,
      "function": "A"
    });

    if (company.length === 0) {
      return res.status(404).json({
        success: false
      });
    }

    return res.status(200).json({
      success: true,
      data: company[0]
    });
  } catch (err) {
    console.log(err);
    res.status(500);
  }
};

//@desc     Update company profile
//@route    PUT /api/v1/company/:id
//@access   Private
exports.update = async (req, res, next) => {
  try {
    const company = await Company.findByIdAndUpdate(req.params.id, req.body);

    if (!company) {
      return res.status(400).json({
        success: false,
        msg: 'Invalid company identify'
      });
    }

    res.status(200).json({
      success: true,
    });

  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Can't update company profile"
    });
  }
};

//@desc     Delete company profile
//@route    Delete /api/v1/company/:id
//@access   Private
exports.del = async (req, res, next) => {
  try {
    const company = await Company.findByIdAndUpdate(req.params.id, {
      "function": "D"
    });
    if (!company) {
      return res.status(400).json({
        success: false,
        msg: 'Invalid company identify'
      });
    }

    //TODO
    // - change all job to D
    // - change all appointment to D

    res.status(200).json({
      success: true,
      data: {}
    });

  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Can't update company profile"
    });
  }
};

//@desc     Get list staff of company
//@route    Get /api/v1/company/:id/staff
//@access   Private
exports.getStaff = async (req, res, next) => {
  try {

    const staff = await Staff.find({
      "companyId": req.params.id
    });

    const userIds = staff.map(staff => staff.userId.toString());
    const users = await User.find({
      "_id": { $in: userIds }
    });

    return res.status(200).json({
      success: true,
      data: users
    });

  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Can't add staff"
    });
  }
};

//@desc     Register staff to company
//@route    POST /api/v1/company/:id/staff
//@access   Private
exports.addStaff = async (req, res, next) => {
  try {

    const companyId = req.params.id;
    const userId = req.body.userId;

    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(400).json({
        success: false,
        msg: 'Invalid company identify'
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({
        success: false,
        msg: 'Invalid user identify'
      });
    }

    const staff = await Staff.create({
      userId,
      companyId
    });

    return res.status(201).json({
      success: true,
    });

  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Can't add staff"
    });
  }
};

//@desc     Delete staff from company
//@route    DELETE /api/v1/company/:id/staff
//@access   Private
exports.deleteStaff = async (req, res, next) => {
  try {

    const companyId = req.params.id;
    const userId = req.body.userId;

    const staff = await Staff.findOneAndRemove({
      "userId": userId,
      "companyId": companyId
    });

    return res.status(200).json({
      success: true,
    });

  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Can't delete staff"
    });
  }
};
