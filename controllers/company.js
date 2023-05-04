const Company = require('../models/Company');
const User = require('../models/User');
const Staff = require('../models/Staff');

//@desc     Register company
//@route    POST /api/v1/company/register
//@access   private
exports.register = async (req, res, next) => {
  try {
    const { name, address, desc, website, tel } = req.body;
    const company = await Company.create({
      name,
      address,
      desc,
      website,
      tel,
    });

    res.status(201).json({ success: true, data: company });
  } catch (error) {
    console.log(error.stack);
    res.status(400).json({ success: false });
  }
};

//@desc     Get company profile
//@route    GET /api/v1/company/:id
//@access   public
exports.getProfile = async (req, res, next) => {
  try {
    const companyId = req.params.id;
    const company = await Company.find({
      "_id": companyId,
      "function": "A"
    });

    if (company.length === 0) {
      return res.status(404);
    }

    delete company[0].function;

    return res.status(200).json({
      success: true,
      data: company[0]
    });
  } catch (error) {
    console.log(error.stack);
    res.status(500);
  }
};

//@desc     Register staff to company
//@route    POST /api/v1/company/:id/staff
//@access   private
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
//@access   private
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
