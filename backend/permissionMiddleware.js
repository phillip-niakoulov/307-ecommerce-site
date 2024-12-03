const User = require('./models/User');

const permissionMiddleware = (requiredPermission) => {
    return async (req, res, next) => {
        if (!req.id) {
            return res
                .status(403)
                .json({ message: 'Access denied. No user id logged.' });
        }
        const foundUser = await User.findById(req.id);

        if (!foundUser) {
            return res.status(403).json({
                message: "Can't find user.",
            });
        }

        const user = await foundUser.select('-password');

        if (!user.permissions[requiredPermission]) {
            return res.status(403).json({
                message:
                    'Access denied. You do not have the required permission.',
            });
        }
        next(); // User has the required permission, proceed to the next middleware or route handler
    };
};

module.exports = permissionMiddleware;
