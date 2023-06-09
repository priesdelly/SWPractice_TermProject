const Company = require('../models/Company');
const Job = require('../models/Job');
const Appointment = require('../models/Appointment');

//@desc     Get company list
//@route    get /api/v1/company
//@access   Private
exports.list = async (req, res, next) => {

  const page = parseInt(req.query.page) > 0 ? parseInt(req.query.page) : 1;
  const limit = 10;
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
    const companyId = req.params.id;
    const company = await Company.findByIdAndUpdate(companyId, {
      "function": "D"
    });
    if (!company) {
      return res.status(400).json({
        success: false,
        msg: 'Invalid company identify'
      });
    }

    const jobs = await Job.find({ companyId: companyId });
    await Job.updateMany({ companyId: req.params.id }, { "function": "D" });

    for (let i = 0; i < jobs.length; i++) {
      let jobId = jobs[i].jobId;
      await Appointment.updateMany({ jobId: jobId }, { "function": "D" });
    }

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
