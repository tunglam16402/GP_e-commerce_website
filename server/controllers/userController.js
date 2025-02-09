const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const { generateAccessToken, generateRefreshToken } = require('../middlewares/jwt');
const { json, response } = require('express');
const sendMail = require('../utils/sendMail');
const crypto = require('crypto');
const makeToken = require('uniqid');
const { users } = require('../utils/constants');
const { OAuth2Client } = require('google-auth-library');

// Sử dụng biến môi trường để tránh hardcode
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(CLIENT_ID);

// const googleLogin = asyncHandler(async (req, res) => {
//     let { token } = req.body;

//     if (!token) {
//         return res.status(400).json({ success: false, message: 'Thiếu Google token' });
//     }

//     try {
//         console.log('Token nhận được:', token);

//         const ticket = await client.verifyIdToken({
//             idToken: token.trim(),
//             audience: CLIENT_ID,
//         });

//         const payload = ticket.getPayload();
//         console.log('Google User Payload:', payload);

//         const { email, picture, sub: googleId, given_name, family_name } = payload;

//         if (!email) {
//             return res.status(400).json({ success: false, message: 'Không lấy được email từ Google' });
//         }

//         let user = await User.findOne({ email });

//         if (!user) {
//             console.log('Tạo người dùng mới');
//             user = await User.create({
//                 email,
//                 firstname: given_name,
//                 lastname: family_name,
//                 avatar: picture,
//                 googleId,
//                 password: null,
//                 role: 2006,
//             });
//         } else {
//             console.log('Người dùng đã tồn tại');
//         }

//         const accessToken = generateAccessToken(user._id, user.role);
//         const refreshToken = generateRefreshToken(user._id);

//         user.refreshToken = refreshToken;
//         await user.save();

//         res.cookie('refreshToken', refreshToken, {
//             httpOnly: true,
//             secure: process.env.NODE_ENV === 'production',
//             sameSite: 'Strict',
//             maxAge: 7 * 24 * 60 * 60 * 1000,
//         });

//         return res.status(200).json({
//             success: true,
//             accessToken,
//             userData: {
//                 _id: user._id,
//                 name: user.firstname + ' ' + user.lastname,
//                 email: user.email,
//                 avatar: user.avatar,
//                 role: user.role,
//             },
//         });
//     } catch (error) {
//         console.error('Lỗi xác thực Google:', error);
//         return res.status(401).json({ success: false, message: 'Token Google không hợp lệ' });
//     }
// });

const googleLogin = asyncHandler(async (req, res) => {
    let { token } = req.body;

    if (!token) {
        return res.status(400).json({ success: false, message: 'Thiếu Google token' });
    }

    try {
        console.log('Token nhận được:', token);

        const ticket = await client.verifyIdToken({
            idToken: token.trim(),
            audience: CLIENT_ID,
        });

        const payload = ticket.getPayload();
        console.log('Google User Payload:', payload);

        const { email, picture, sub: googleId, given_name, family_name } = payload;

        if (!email) {
            return res.status(400).json({ success: false, message: 'Không lấy được email từ Google' });
        }

        let user = await User.findOne({ email });

        if (!user) {
            console.log('Tạo người dùng mới');
            user = new User({
                email,
                firstname: given_name,
                lastname: family_name,
                avatar: picture,
                googleId,
                password: null,
                role: 2006,
            });

            await user.save();
            console.log('Người dùng mới đã được lưu:', user);
        } else {
            console.log('Người dùng đã tồn tại:', user);
        }

        const accessToken = generateAccessToken(user._id, user.role);
        const refreshToken = generateRefreshToken(user._id);

        console.log('Access Token:', accessToken);
        console.log('Refresh Token:', refreshToken);

        user.refreshToken = refreshToken;
        await user.save();
        console.log('Refresh token đã lưu vào DB');

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({
            success: true,
            accessToken,
            userData: {
                _id: user._id,
                name: user.firstname + ' ' + user.lastname,
                email: user.email,
                avatar: user.avatar,
                role: user.role,
            },
        });
    } catch (error) {
        console.error('Lỗi xác thực Google:', error);
        return res.status(401).json({ success: false, message: 'Token Google không hợp lệ' });
    }
});

const register = asyncHandler(async (req, res) => {
    const { email, password, firstname, lastname, mobile } = req.body;
    if (!email || !password || !firstname || !lastname || !mobile) {
        return res.status(400).json({
            success: false,
            message: 'Missing input',
        });
    }
    const user = await User.findOne({ email: email });
    if (user) {
        throw new Error('User already exists');
    } else {
        const token = makeToken();
        //lưu token trong cookies
        //     res.cookie('dataRegister', { ...req.body, token }, { httpOnly: true, maxAge: 15 * 60 * 1000 });
        //     const html = `Please click on the link below to complete your account registration. This link will expire in 15 minutes from now.
        // <a href=${process.env.URL_SERVER}/api/user/finalRegister/${token}>Click here !</a>`;
        //     await sendMail({ email, html, subject: 'Complete your account registration ' });
        //     return res.json({
        //         success: true,
        //         message: 'Please check your email to active account',
        //     });

        //lưu vào db
        const emailEdited = btoa(email) + '@' + token;
        const newUser = await User.create({
            email: emailEdited,
            password,
            firstname,
            lastname,
            mobile,
        });
        if (newUser) {
            const html = `<h2>Register code: </h2><br/><blockquote>${token}</blockquote>`;
            await sendMail({ email, html, subject: 'Complete your account registration ' });
        }
        setTimeout(async () => {
            await User.deleteOne({ email: emailEdited });
        }, [300000]);
        return res.json({
            success: newUser ? true : false,
            message: newUser
                ? 'Please check your email to active account'
                : 'Something went wrong. Please try again later.',
        });
    }
});

//Api complete registration
const finalRegister = asyncHandler(async (req, res) => {
    // const cookie = req.cookies;
    const { token } = req.params;
    const notActivedEmail = await User.findOne({ email: new RegExp(`${token}`) });
    if (notActivedEmail) {
        notActivedEmail.email = atob(notActivedEmail?.email?.split('@')[0]);
        notActivedEmail.save();
    }
    return res.json({
        success: notActivedEmail ? true : false,
        message: notActivedEmail
            ? 'Register successfully. Please go login'
            : 'Something went wrong. Please try again later.',
    });
    // if (!cookie || cookie?.dataRegister?.token !== token) {
    //     console.log('Cookie or token mismatch');
    //     res.clearCookie('dataRegister');
    //     return res.redirect(`${process.env.URL_CLIENT}/finalRegister/failed`);
    // }
    // const newUser = await User.create({
    //     email: cookie?.dataRegister?.email,
    //     password: cookie?.dataRegister?.password,
    //     mobile: cookie?.dataRegister?.mobile,
    //     firstname: cookie?.dataRegister?.firstname,
    //     lastname: cookie?.dataRegister?.lastname,
    // });
    // res.clearCookie('dataRegister');
    // if (newUser) {
    //     console.log('User created successfully');
    //     return res.redirect(`${process.env.URL_CLIENT}/finalRegister/success`);
    // } else {
    //     console.log('Failed to create user');
    //     return res.redirect(`${process.env.URL_CLIENT}/finalRegister/failed`);
    // }
});

//API Login
// Refresh token => cấp mới access token
// Access token => xác thực và phân quyền người dùng
const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    // nếu không có required : true thì không cần thiết phải chọc về db
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Missing input',
        });
    }

    const response = await User.findOne({ email });
    //nếu có email và pw đc trả về là đúng
    if (response && (await response.isCorrectPassword(password))) {
        //tách pw ,role, và rtoken cũ ra khỏi response
        const { password, role, refreshToken, ...userData } = response.toObject();
        //tạo access/refresh token
        const accessToken = generateAccessToken(response._id, role);
        const newRefreshToken = generateRefreshToken(response._id);
        //lưu refresh token trg db
        await User.findByIdAndUpdate(response._id, { refreshToken: newRefreshToken }, { new: true });
        //Lưu refreshtoken vào cookie
        res.cookie('refreshToken', newRefreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
        return res.status(200).json({
            success: true,
            accessToken,
            userData,
        });
    } else {
        throw new Error('Invalid credentials!');
    }
});

//API get info current user login
const getCurrent = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const user = await User.findById(_id)
        .select('-refreshToken -password')
        .populate({
            path: 'cart',
            populate: {
                path: 'product',
                select: 'title thumb color price',
            },
        })
        .populate('wishlist', 'title thumb price color');
    return res.status(200).json({
        success: !!user,
        response: user ? user : 'User not found',
    });
});

//APi Reissue access token while refresh token is still valid
const refreshAccessToken = asyncHandler(async (req, res) => {
    //Lấy token từ cookie
    const cookie = req.cookies;
    if (!cookie && !cookie.refreshToken) {
        throw new Error('No refresh token in Cookies!');
    }
    // check xem token có hợp lệ
    const result = await jwt.verify(cookie.refreshToken, process.env.JWT_SECRET);
    const response = await User.findOne({ _id: result._id, refreshToken: cookie.refreshToken });
    return res.status(200).json({
        success: response ? true : false,
        newAccessToken: response ? generateAccessToken(response._id, response.role) : 'Refresh token not matched',
    });
});

//API logout
const logout = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    if (!cookie || !cookie.refreshToken) {
        throw new Error('No refresh token in cookie');
    }
    //Tìm refresh token và xóa khỏi db
    await User.findOneAndUpdate({ refreshToken: cookie.refreshToken }, { refreshToken: '' }, { new: true });
    //Xóa refresh token ở cookie trình duyệt
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true,
    });
    return res.status(200).json({
        success: true,
        message: 'Logout is done',
    });
});

//API change password
const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;
    if (!email) {
        throw new Error('Missing email');
    }
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error('User not found');
    }
    const resetToken = user.createPasswordChangeToken();
    // lưu token vừa hứng đc vào db
    await user.save();

    const html = `Please click on the link below to change your password. This link will expire in 5 minutes from now. 
                <a href=${process.env.URL_CLIENT}/resetpassword/${resetToken}>Click here !</a>`;

    const data = {
        email: email,
        html,
        subject: 'Forgot password',
    };
    const response = await sendMail(data);
    return res.status(200).json({
        success: response.response?.includes('OK') ? true : false,
        message: response.response?.includes('OK')
            ? 'Please check your email to proceed with password recovery.'
            : 'Somethings wrong happened. Please try again later',
    });
});

//API reset password
const resetPassword = asyncHandler(async (req, res) => {
    const { token, password } = req.body;
    if (!password || !token) {
        throw new Error('Missing input!');
    }
    const passwordResetToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({ passwordResetToken, passwordResetExpires: { $gt: Date.now() } });
    if (!user) {
        throw new Error('Invalid Reset Token');
    }
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordChangedAt = Date.now();
    user.passwordResetExpires = undefined;
    await user.save();
    return res.status(200).json({
        success: user ? true : false,
        message: user ? 'Updated password' : 'something went wrong!',
    });
});

//API get info all user login (Admin)
// const getUsers = asyncHandler(async (req, res) => {
//     const queries = { ...req.query };

//     // Tách các trường đặc biệt ra khỏi query
//     const excludeFields = ['limit', 'sort', 'page', 'fields'];
//     excludeFields.forEach((element) => delete queries[element]);

//     // Format lại operators cho đúng cú pháp mongoose
//     let queryString = JSON.stringify(queries);
//     queryString = queryString.replace(/\b(gte|gt|lt|lte)\b/g, (matchedElement) => {
//         return `$${matchedElement}`;
//     });
//     const formattedQueries = JSON.parse(queryString);

//     // Filtering
//     if (queries?.name) {
//         formattedQueries.name = { $regex: queries.name, $options: 'i' };
//     }

//     let queryCommand = User.find(formattedQueries);

//     // Search admin user
//     if (req.query.q) {
//         delete formattedQueries.q;
//         formattedQueries['$or'] = [
//             { firstname: { $regex: req.query.q, $options: 'i' } },
//             { lastname: { $regex: req.query.q, $options: 'i' } },
//             { email: { $regex: req.query.q, $options: 'i' } },
//         ];
//         queryCommand = User.find(formattedQueries);
//     }

//     // Sorting
//     if (req.query.sort) {
//         const sortBy = req.query.sort.split(',').join(' ');
//         queryCommand = queryCommand.sort(sortBy);
//     }

//     // Fields limited
//     if (req.query.fields) {
//         const fields = req.query.fields.split(',').join(' ');
//         queryCommand = queryCommand.select(fields);
//     }

//     const page = +req.query.page || 1;
//     const limit = +req.query.limit || process.env.LIMIT_PRODUCTS;
//     const skip = (page - 1) * limit;
//     queryCommand.skip(skip).limit(limit);

//     // Execute the query with error handling
//     try {
//         const response = await queryCommand.exec();
//         const counts = await User.find(formattedQueries).countDocuments();

//         res.status(200).json({
//             success: response ? true : false,
//             counts,
//             users: response ? response : 'Cannot get users',
//         });
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: error.message,
//         });
//     }
// });

const getUsers = asyncHandler(async (req, res) => {
    const queries = { ...req.query };

    // Tách các trường đặc biệt khỏi query
    const excludeFields = ['limit', 'sort', 'page', 'fields'];
    excludeFields.forEach((element) => delete queries[element]);

    // Format lại operators cho đúng cú pháp Mongoose
    let queryString = JSON.stringify(queries);
    queryString = queryString.replace(/\b(gte|gt|lt|lte)\b/g, (matched) => `$${matched}`);
    const formattedQueries = JSON.parse(queryString);

    // Filtering
    if (queries?.name) {
        formattedQueries.name = { $regex: queries.name, $options: 'i' };
    }

    // Xây dựng query tìm kiếm
    let queryCommand = User.find(formattedQueries);

    if (req.query.q) {
        formattedQueries['$or'] = [
            { firstname: { $regex: req.query.q.trim(), $options: 'i' } },
            { lastname: { $regex: req.query.q.trim(), $options: 'i' } },
            { email: { $regex: req.query.q.trim(), $options: 'i' } },
        ];
    }

    // Sorting
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        queryCommand = queryCommand.sort(sortBy);
    }

    // Fields limit
    if (req.query.fields) {
        const fields = req.query.fields.split(',').join(' ');
        queryCommand = queryCommand.select(fields);
    }

    // Pagination
    const page = +req.query.page || 1;
    const limit = +req.query.limit || process.env.LIMIT_PRODUCTS;
    const skip = (page - 1) * limit;
    queryCommand = queryCommand.skip(skip).limit(limit);

    try {
        // Lấy danh sách user theo query
        const response = await queryCommand.exec();

        // Tổng số user sau khi lọc
        const counts = await User.countDocuments(formattedQueries);

        // Tổng số user không có điều kiện lọc
        const totalUsers = await User.estimatedDocumentCount();

        res.status(200).json({
            success: true,
            totalUsers, // Tổng số user trong hệ thống
            counts, // Tổng số user sau khi lọc
            users: response,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

//API delete user(Admin)
const deleteUser = asyncHandler(async (req, res) => {
    const { uid } = req.params;
    const response = await User.findByIdAndDelete(uid);
    return res.status(200).json({
        success: response ? true : false,
        message: response ? `User with email ${response.email} deleted` : 'No user delete',
    });
});

//API update user
const updateUser = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { firstname, lastname, email, mobile, address } = req.body;
    const data = { firstname, lastname, email, mobile, address };
    if (req.file) data.avatar = req.file.path;
    if (!_id || Object.keys(req.body).length === 0) {
        throw new Error('Missing inputs');
    }
    const response = await User.findByIdAndUpdate(_id, data, { new: true }).select('-password -role -refreshToken');
    return res.status(200).json({
        success: response ? true : false,
        message: response ? "User's Information has been updated" : 'Something went wrong',
    });
});

//API update user by admin
const updateUserByAdmin = asyncHandler(async (req, res) => {
    const { uid } = req.params;
    if (!uid || Object.keys(req.body).length === 0) {
        throw new Error('Missing inputs');
    }
    const response = await User.findByIdAndUpdate(uid, req.body, { new: true }).select('-password -role -refreshToken');
    return res.status(200).json({
        success: response ? true : false,
        message: response ? 'Updated' : 'Something went wrong',
    });
});

const updateUserAddress = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    if (!req.body.address) {
        throw new Error('Missing inputs');
    }
    const response = await User.findByIdAndUpdate(_id, { $push: { address: req.body.address } }, { new: true }).select(
        '-password -role -refreshToken',
    );
    return res.status(200).json({
        success: response ? true : false,
        message: response ? response : 'Something went wrong',
    });
});

// const updateCart = asyncHandler(async (req, res) => {
//     const { _id } = req.user;
//     const { pid, quantity = 1, color, price, thumb, title } = req.body;
//     if (!pid || !color) {
//         throw new Error('Missing inputs');
//     }
//     const user = await User.findById(_id).select('cart');
//     //check xem sp đã có trong giỏ hàng chưa
//     const alreadyProduct = user?.cart?.find((element) => element.product.toString() === pid && element.color === color);

//     if (alreadyProduct) {
//         const response = await User.updateOne(
//             { cart: { $elemMatch: alreadyProduct } },
//             {
//                 $set: {
//                     'cart.$.quantity': quantity,
//                     'cart.$.price': price,
//                     'cart.$.thumb': thumb,
//                     'cart.$.title': title,
//                 },
//             },
//             { new: true },
//         );
//         return res.status(200).json({
//             success: response ? true : false,
//             message: response ? 'Product has been added to cart' : 'Something went wrong',
//         });
//     } else {
//         const response = await User.findByIdAndUpdate(
//             _id,
//             { $push: { cart: { product: pid, quantity, color, price, thumb, title } } },
//             { new: true },
//         );
//         return res.status(200).json({
//             success: response ? true : false,
//             message: response ? 'Product has been added to cart' : 'Something went wrong',
//         });
//     }
// });

const updateCart = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { pid, quantity = 1, color, price, discountPrice, thumb, title } = req.body;

    if (!pid || !color) {
        throw new Error('Missing inputs');
    }

    const finalPrice = discountPrice && discountPrice > 0 ? discountPrice : price;

    const user = await User.findById(_id).select('cart');

    // Kiểm tra sản phẩm đã có trong giỏ hàng chưa
    const alreadyProduct = user?.cart?.find((element) => element.product.toString() === pid && element.color === color);

    if (alreadyProduct) {
        const response = await User.updateOne(
            { cart: { $elemMatch: alreadyProduct } },
            {
                $set: {
                    'cart.$.quantity': quantity,
                    'cart.$.price': finalPrice, // Cập nhật giá dựa vào discount
                    'cart.$.thumb': thumb,
                    'cart.$.title': title,
                },
            },
            { new: true },
        );

        return res.status(200).json({
            success: response ? true : false,
            message: response ? 'Product has been updated in cart' : 'Something went wrong',
        });
    } else {
        const response = await User.findByIdAndUpdate(
            _id,
            {
                $push: {
                    cart: { product: pid, quantity, color, price: finalPrice, thumb, title },
                },
            },
            { new: true },
        );

        return res.status(200).json({
            success: response ? true : false,
            message: response ? 'Product has been added to cart' : 'Something went wrong',
        });
    }
});

const removeProductInCart = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { pid, color } = req.params;
    const user = await User.findById(_id).select('cart');
    //check xem sp đã có trong giỏ hàng chưa
    const alreadyProduct = user?.cart?.find((element) => element.product.toString() === pid && element.color === color);
    if (!alreadyProduct) {
        return res.status(200).json({
            success: true,
            message: 'Cart updated',
        });
    }
    const response = await User.findByIdAndUpdate(_id, { $pull: { cart: { product: pid, color } } }, { new: true });
    return res.status(200).json({
        success: response ? true : false,
        message: response ? 'Product has been removed' : 'Something went wrong',
    });
});

//API create user
const createUser = asyncHandler(async (req, res) => {
    const response = await User.create(users);
    return res.status(200).json({
        success: response ? true : false,
        updateUser: response ? response : 'Something went wrong',
    });
});

//API update wishlist user
const updateWishList = asyncHandler(async (req, res) => {
    const { pid } = req.params;
    const { _id } = req.user;
    const user = await User.findById(_id);
    const alreadyInWishList = user.wishlist?.find((element) => element.toString() === pid);
    if (alreadyInWishList) {
        const response = await User.findByIdAndUpdate(_id, { $pull: { wishlist: pid } }, { new: true });
        return res.status(200).json({
            success: response ? true : false,
            message: response ? 'Product has been add to your Wishlist' : 'failed to update wishlist',
        });
    } else {
        const response = await User.findByIdAndUpdate(_id, { $push: { wishlist: pid } }, { new: true });
        return res.status(200).json({
            success: response ? true : false,
            message: response ? 'Product has been add to your Wishlist' : 'failed to update wishlist',
        });
    }
});

module.exports = {
    register,
    finalRegister,
    login,
    googleLogin,
    getCurrent,
    refreshAccessToken,
    logout,
    forgotPassword,
    resetPassword,
    getUsers,
    deleteUser,
    updateUser,
    updateUserByAdmin,
    updateUserAddress,
    updateCart,
    createUser,
    removeProductInCart,
    updateWishList,
};
