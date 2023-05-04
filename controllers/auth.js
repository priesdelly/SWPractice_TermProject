const User = require('../models/User');
const crypto = require('crypto');

//@desc     Register user
//@route    GET /api/v1/auth/register
//@access   Public
exports.register = async (req, res, next) => {
    try {
      const { name, email, password, tel } = req.body;
        //Create User
        const user = await User.create({
            name,
            email,
            password,
            tel,
        });

        sendTokenResponse(user, 200, res)

    } catch (error) {
      res.status(400).json({ success: false });
      console.log(error.stack);
    }
};

//@desc     Login user
//@route    GET /api/v1/auth/login
//@access   Public
exports.login = async (req, res, next) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ success: false, msg: 'Please provide an email and password' });
      }

      //Check for user
      const user = await User.find({
        "email": email,
        "function": "A"
      }).select('+password');

      if (user.length === 0) {
        return res.status(400).json({ success: false, msg: 'Invalid credentials' });
      }

      //Check if password matches
      const isMatch = await user[0].matchPassword(password);

      if (!isMatch) {
        return res.status(401).json({ success: false, msg: 'Invalid credentials' });
      }

      sendTokenResponse(user[0], 200, res);

    } catch (err) {
      return res.status(401).json({ success: false, msg: 'Cannot convert email or password to string' });
    }
}

const sendTokenResponse = (user, statusCode, res) => {
    const token = user.getSignedJwtToken();
    const options = {
        expire: new Date(Date.now + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true
    }
    if (process.env.NODE_ENV === 'production') {
        options.secure = true;
    }

    res.status(statusCode).cookie('token', token, options).json({
        success: true,
        _id: user._id,
        name: user.name,
        email: user.email,
        token
    });
}

//@desc     Get current user profile
//@route    GET /api/v1/auth/me
//@access   Private
exports.getMe = async (req, res, next) => {
    const user = await User.findById(req.user.id);
  res.status(200).json({ success: true, data: user });
}

//@desc     Log user out / clear cookie
//@route    GET /api/v1/auth/logout
//@access   Private
exports.logout = async (req, res, next) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  res.status(200).json({
    success: true,
    data: {}
  });
};

//@desc     Delete use
//@route    DELETE /api/v1/auth/me
//@access   Private
exports.deleteMe = async (req, res, next) => {
  try {
    let uuid = crypto.randomUUID();
    const user = await User.findByIdAndUpdate(req.user.id, {
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

    res.cookie('token', 'none', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true
    });

    //TODO
    //Delete all user's appointment data

    res.status(200).json({
      success: true,
      data: {}
    });

  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false });
  }
}
