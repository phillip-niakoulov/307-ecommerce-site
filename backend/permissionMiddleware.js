const permissionMiddleware = (requiredPermission) => {
    return (req, res, next) => {
        if (!req.user || !req.user.permissions) {
            return res
                .status(403)
                .json({ message: 'Access denied. No permissions provided.' });
        }

        if (!req.user.permissions[requiredPermission]) {
            return res.status(403).json({
                message:
                    'Access denied. You do not have the required permission.',
            });
        }

        next(); // User has the required permission, proceed to the next middleware or route handler
    };
};

module.exports = permissionMiddleware;
