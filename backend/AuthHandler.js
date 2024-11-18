const jwt = require('jsonwebtoken');
const User = require('./models/User');
require('dotenv').config();

async function handleAuth(token, action, options) {
    if (!token) {
        return [401, 'No token provided'];
    }
    let user;
    try {
        user = jwt.verify(token, process.env.JWT_KEY);
    } catch (err) {
        console.log(err);
        return [401, 'Error validating token'];
    }
    if (user === undefined || user === null) {
        return [401, 'Error validating token'];
    }
    if (Date.now() > user.exp * 1000) {
        return [401, 'Token Expired'];
    }
    if (!(await checkPermission(user.userId, action, options))) {
        return [401, 'Permission Denied'];
    }
    return [0, user.userId];
}

async function checkPermission(user, action, option) {
    console.log(action, option);
    const userobj = await User.findById(user);
    if (!userobj) return false;
    if (userobj['role'] === 'admin') return true;
    return false;
}

module.exports = handleAuth;
