const jwt = require('jsonwebtoken');

//Tạo access token khi đăng nhập
const generateAccessToken = (uid, role) =>
    jwt.sign({ _id: uid, role: role }, process.env.JWT_SECRET, { expiresIn: '7d' });

// tạo refresh token khi gửi yêu cầu token hết hạn
const generateRefreshToken = (uid) => jwt.sign({ _id: uid }, process.env.JWT_SECRET, { expiresIn: '30d' });

module.exports = {
    generateAccessToken,
    generateRefreshToken,
};
