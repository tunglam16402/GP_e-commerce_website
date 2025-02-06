const Coupon = require('../models/couponModel');
const asyncHandler = require('express-async-handler');

const createNewCoupon = asyncHandler(async (req, res) => {
    const { name, discount, expiry } = req.body;
    if (!name || !discount || !expiry) {
        throw new Error('Missing Input!');
    }
    const response = await Coupon.create({
        ...req.body,
        expiry: Date.now() + +expiry * 24 * 60 * 60 * 1000,
    });
    return res.status(200).json({
        success: response ? true : false,
        createdCoupon: response ? response : 'Can not create new Coupon!',
    });
});

const getCoupons = asyncHandler(async (req, res) => {
    const response = await Coupon.find().select('-createdAt -updatedAt');
    return res.status(200).json({
        success: response ? true : false,
        blogCategories: response ? response : 'Can not get Coupon!',
    });
});

const updateCoupon = asyncHandler(async (req, res) => {
    const { cid } = req.params;
    if (Object.keys(req.body).length === 0) {
        throw new Error('Missing input!');
    }
    if (req.body.expiry) {
        req.body.expiry = Date.now() + +req.body.expiry * 24 * 60 * 60 * 1000;
    }
    const response = await Coupon.findByIdAndUpdate(cid, req.body, { new: true });
    return res.status(200).json({
        success: response ? true : false,
        updatedCoupon: response ? response : 'Can not update Coupon!',
    });
});

const deleteCoupon = asyncHandler(async (req, res) => {
    const { cid } = req.params;
    const response = await Coupon.findByIdAndDelete(cid);
    return res.status(200).json({
        success: response ? true : false,
        deletedCoupon: response ? response : 'Can not delete Coupon!',
    });
});

module.exports = {
    createNewCoupon,
    getCoupons,
    updateCoupon,
    deleteCoupon,
};
