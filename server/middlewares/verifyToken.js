const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

const verifyAccessToken = asyncHandler(async function (req, res, next) {
    //access token thường bắt đầu bằng chữ Bearer
    //headers: { authorization: Bearer token}
    if (req?.headers?.authorization?.startsWith('Bearer')) {
        // tách để lấy phần tử 2 là token
        const token = req.headers.authorization.split(' ')[1];
        jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
            if (err) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid access token',
                });
            }
            req.user = decode;
            // console.log('Decoded Token:', decode); // Kiểm tra kết quả
            decode.role = Number(decode.role); // Ép kiểu role thành số
            next();
        });
    } else {
        return res.status(401).json({
            success: false,
            message: 'Require Authentication!!',
        });
    }
});

//Admin authentication
const isAdmin = asyncHandler((req, res, next) => {
    const { role } = req.user;
    if (+role !== 2002) {
        return res.status(401).json({
            success: false,
            message: 'REQUIRE ADMIN ROLE',
        });
    }
    next();
});

module.exports = {
    verifyAccessToken,
    isAdmin,
};
