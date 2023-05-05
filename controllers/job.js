const Job = require("../models/Job");
const Company = require("../models/Company");

//@desc     Get job list
//@route    GET /api/v1/job/
//@access   Public
exports.list = async (req, res, next) => {
  const page = parseInt(req.query.page) > 0 ? parseInt(req.query.page) : 1;
  const limit = 5;
  const skip = (page - 1) * limit;

  try {
    const jobs = await Job.find({
      "function": "A"
    }).skip(skip)
      .limit(limit)
      .exec();

    for (let i = 0; i < jobs.length; i++) {
      jobs[i].companyDetail = await Company.findById(jobs[i].companyId).cache(60 * 5);
    }

    const count = await Job.countDocuments({
      "function": "A"
    });

    return res.json({
      success: true,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(count / limit),
        totalItems: count,
        itemsPerPage: limit
      },
      data: jobs,
    });
  } catch (err) {
    console.log(err);
    res.status(500);
  }
};

//@desc     Get job detail
//@route    GET /api/v1/job/:id
//@access   Public
exports.detail = async (req, res, next) => {
  try {
    const jobId = req.params.id;
    const jobs = await Job.find({
      "_id": jobId,
      "function": "A"
    });

    if (jobs.length === 0) {
      return res.status(404).json({
        success: false
      });
    }

    jobs[0].companyDetail = await Company.findById(jobs[0].companyId);

    return res.status(200).json({
      success: true,
      data: jobs[0]
    });
  } catch (err) {
    console.log(err);
    res.status(500);
  }
};

//@desc     Add job detail
//@route    POST /api/v1/job/
//@access   Private
exports.add = async (req, res, next) => {
  try {
    const { companyId, name, shortDesc, desc } = req.body;
    const job = await Job.create({
      companyId,
      name,
      shortDesc,
      desc
    });

    res.status(201).json({
      success: true,
      data: job
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false
    });
  }
};

//@desc     Update job detail
//@route    PUT /api/v1/job/:id
//@access   Private
exports.update = async (req, res, next) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body);
    if (!job) {
      return res.status(400).json({
        success: false,
        msg: 'Invalid job identify'
      });
    }

    res.status(200).json({
      success: true,
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false
    });
  }
};

//@desc     Delete job detail
//@route    DELETE /api/v1/job/:id
//@access   Private
exports.del = async (req, res, next) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, {
      "function": "D"
    });
    if (!job) {
      return res.status(400).json({
        success: false,
        msg: 'Invalid job identify'
      });
    }

    res.status(200).json({
      success: true,
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false
    });
  }
};
