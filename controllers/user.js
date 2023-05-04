const User = require('../models/User');


//@desc     Get user profile
//@route    GET /api/v1/user/:id
//@access   Private
exports.profile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

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

//@desc     update user role
//@route    PUT /api/v1/user/:id
//@access   Private
exports.updateRole = async (req, res, next) => {
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
      message: "Can't update user role"
    });
  }
};

