const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token || token === 'null') {
        return res.status(401).json({success: false, message: 'Not authorize to access route'});
    }

    try {
        //verify
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        console.log(decoded);

        req.user = await User.findById(decoded.id);

        next();
    } catch (error) {
        console.log(error.stack);
        return res.status(401).json({success: false, message: 'Not authorize to access route'});
    }
}

exports.authorize = (...roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
            return res.status(403).json({success:false, message:`User role ${req.user.role} is not authorized to access this route`});
        }
        next();
    }
}