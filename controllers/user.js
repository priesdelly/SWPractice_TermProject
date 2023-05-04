const User = require('../models/User');

//@desc     Get user profile
//@route    GET /api/v1/user/:id
//@access   Private
exports.profile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: "Can't get user profile" });
  }
};

exports.updateRole = async (req, res, next) => {
  try {

    var reqBody = req.body;
    var role = reqBody.role;
    var validRoles = [ 'user', 'admin' ];

    if (!validRoles.includes(role)) {
      return res.status(400).json({ success: false, msg: 'Invalid role' });
    }

    const user = await User.findByIdAndUpdate(req.params.id, {
      "role": role
    });

    res.status(200).json({
      success: true,
      data: {}
    });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: "Can't update user role" });
  }
};
