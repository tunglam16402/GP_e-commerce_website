const Order = require('../models/orderModel');
const User = require('../models/userModel');
const Coupon = require('../models/couponModel');
const asyncHandler = require('express-async-handler');

// const createOrder = asyncHandler(async (req, res) => {
//     const { _id } = req.user;
//     const { coupon } = req.body;
//     const userCart = await User.findById(_id).select('cart').populate('cart.product', 'title price');
//     console.log(userCart);
//     const products = userCart?.cart?.map((element) => ({
//         product: element.product._id,
//         count: element.quantity,
//         color: element.color,
//     }));

//     let total = userCart?.cart?.reduce((sum, element) => element.product.price * element.quantity + sum, 0);
//     const createData = { products, total, orderBy: _id };
//     if (coupon) {
//         const selectedCoupon = await Coupon.findById(coupon);
//         total = Math.round((total * (1 - +selectedCoupon.discount / 100)) / 1000) * 1000 || total;
//         createData.total = total;
//         createData.coupon = coupon;
//         console.log(selectedCoupon);
//     }

//     const response = await Order.create(createData);
//     return res.status(200).json({
//         success: response ? true : false,
//         response: response ? response : 'Something went wrong',
//     });
// });

const createOrder = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { products, total, address, status } = req.body;
    if (address) {
        await User.findByIdAndUpdate(_id, { address, cart: [] });
    }
    const data = { products, total, orderBy: _id };
    if (status) {
        data.status = status;
    }
    const response = await Order.create(data);
    return res.status(200).json({
        success: response ? true : false,
        response: response ? response : 'Something went wrong',
    });
});

const updateStatus = asyncHandler(async (req, res) => {
    const { oid } = req.params;
    const { status } = req.body;
    if (!status) {
        throw new Error('Missing status');
    }
    // Kiểm tra xem trạng thái có hợp lệ không
    const validStatuses = ['Canceled', 'Processing', 'Succeed'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid status value',
        });
    }
    const response = await Order.findByIdAndUpdate(oid, { status }, { new: true });
    if (!response) {
        return res.status(404).json({
            success: false,
            message: 'Order not found',
        });
    }

    return res.status(200).json({
        success: true,
        response: response,
    });
});

const getUserOrder = asyncHandler(async (req, res) => {
    const queries = { ...req.query };
    const { _id } = req.user;
    //Tách các trường đặc biệt ra khỏi query
    const excludeFields = ['limit', 'sort', 'page', 'fields'];
    excludeFields.forEach((element) => delete queries[element]);
    //format lại operators cho đúng cú pháp mongoose
    let queryString = JSON.stringify(queries);
    queryString = queryString.replace(/\b(gte|gt|lt|lte)\b/g, (matchedElement) => {
        return `$${matchedElement}`;
    });
    const formattedQueries = JSON.parse(queryString);

    const qr = { ...formattedQueries, orderBy: _id };
    if (queries?.name) {
        qr.name = { $regex: queries.name, $options: 'i' };
    }
    let queryCommand = Order.find(qr);

    if (req.query.q) {
        delete qr.q;
        qr['products'] = {
            $elemMatch: { title: { $regex: req.query.q, $options: 'i' } }, // Tìm trong products.title
        };
        queryCommand = Order.find(qr);
    }

    //Sorting
    if (req.query.sort) {
        // chuyển chuỗi từ dấu phẩy sang dấu cách eg: abc,def => [abc, efg] => abc def
        const sortBy = req.query.sort.split(',').join(' ');
        queryCommand = queryCommand.sort(sortBy);
    }

    //Fields limtited
    if (req.query.fields) {
        const fields = req.query.fields.split(',').join(' ');
        queryCommand = queryCommand.select(fields);
    }
    //Pagination
    // dấu + để chuyển từ dạng chuỗi sang dạng số(string to number)
    const page = +req.query.page || 1;
    const limit = +req.query.limit || process.env.LIMIT_PRODUCTS;
    const skip = (page - 1) * limit;
    queryCommand.skip(skip).limit(limit);

    const response = await queryCommand.exec();
    const counts = await Order.find(qr).countDocuments();
    res.status(200).json({
        success: response ? true : false,
        counts,
        orders: response || 'Cannot get orders',
    });
});

// const getUserOrder = asyncHandler(async (req, res) => {
//     const queries = { ...req.query };
//     const { _id } = req.user;

//     // Loại bỏ các trường đặc biệt khỏi query
//     const excludeFields = ['limit', 'sort', 'page', 'fields', 'q'];
//     excludeFields.forEach((field) => delete queries[field]);

//     // Chuyển đổi cú pháp so sánh trong Mongoose
//     let queryString = JSON.stringify(queries);
//     queryString = queryString.replace(/\b(gte|gt|lt|lte)\b/g, (matched) => `$${matched}`);
//     const formattedQueries = JSON.parse(queryString);

//     // Query mặc định: lấy tất cả đơn hàng của user
//     let qr = { ...formattedQueries, orderBy: _id };

//     // Nếu có truy vấn theo tên sản phẩm
//     if (req.query.q) {
//         const searchRegex = { $regex: req.query.q, $options: 'i' };
//         qr['products'] = { $elemMatch: { title: searchRegex } };
//     }

//     let queryCommand = Order.find(qr);

//     // Sorting
//     if (req.query.sort) {
//         const sortBy = req.query.sort.split(',').join(' ');
//         queryCommand = queryCommand.sort(sortBy);
//     }

//     // Giới hạn fields trả về
//     if (req.query.fields) {
//         const fields = req.query.fields.split(',').join(' ');
//         queryCommand = queryCommand.select(fields);
//     }

//     // Pagination
//     const page = +req.query.page || 1;
//     const limit = +req.query.limit || +process.env.LIMIT_PRODUCTS || 10;
//     const skip = (page - 1) * limit;
//     queryCommand = queryCommand.skip(skip).limit(limit);

//     // Thực thi truy vấn
//     const response = await queryCommand.exec();
//     const counts = await Order.countDocuments(qr);

//     res.status(200).json({
//         success: !!response.length,
//         counts,
//         orders: response.length ? response : 'No orders found',
//     });
// });

const getOrder = asyncHandler(async (req, res) => {
    const { oid } = req.params;
    const order = await Order.findById(oid).populate('orderBy', 'firstname lastname email mobile address').populate({
        path: 'products.product',
        select: 'title price thumb',
    });
    // .populate('coupon', 'discount');

    return res.status(200).json({
        success: order ? true : false,
        orderData: order ? order : 'Can not get order',
    });
});

const getOrders = asyncHandler(async (req, res) => {
    const queries = { ...req.query };
    //Tách các trường đặc biệt ra khỏi query
    const excludeFields = ['limit', 'sort', 'page', 'fields'];
    excludeFields.forEach((element) => delete queries[element]);
    //format lại operators cho đúng cú pháp mongoose
    let queryString = JSON.stringify(queries);
    queryString = queryString.replace(/\b(gte|gt|lt|lte)\b/g, (matchedElement) => {
        return `$${matchedElement}`;
    });
    const formattedQueries = JSON.parse(queryString);

    const qr = { ...formattedQueries };
    if (queries?.name) {
        qr.name = { $regex: queries.name, $options: 'i' };
    }
    let queryCommand = Order.find(qr);

    // if (req.query.q) {
    //     delete qr.q;
    //     qr['$or'] = [{ status: { $regex: req.query.q.trim(), $options: 'i' } }];
    //     // qr['orderBy'] = {
    //     //     $elemMatch: { firstname: { $regex: req.query.q, $options: 'i' } },
    //     // };
    //     queryCommand = Order.find(qr);
    // }

    if (req.query.q) {
        delete qr.q;
        qr['$or'] = [
            { 'orderBy.firstname': { $regex: req.query.q.trim(), $options: 'i' } },
            { 'orderBy.lastname': { $regex: req.query.q.trim(), $options: 'i' } },
        ];
        queryCommand = Order.find(qr);
    }

    //Sorting
    if (req.query.sort) {
        // chuyển chuỗi từ dấu phẩy sang dấu cách eg: abc,def => [abc, efg] => abc def
        const sortBy = req.query.sort.split(',').join(' ');
        queryCommand = queryCommand.sort(sortBy);
    }

    //Fields limtited
    if (req.query.fields) {
        const fields = req.query.fields.split(',').join(' ');
        queryCommand = queryCommand.select(fields);
    }
    //Pagination
    // dấu + để chuyển từ dạng chuỗi sang dạng số(string to number)
    const page = +req.query.page || 1;
    const limit = +req.query.limit || process.env.LIMIT_PRODUCTS;
    const skip = (page - 1) * limit;
    queryCommand.skip(skip).limit(limit);

    queryCommand = queryCommand.populate('orderBy', 'firstname lastname mobile address email');

    const response = await queryCommand.exec();
    const counts = await Order.find(qr).countDocuments();
    res.status(200).json({
        success: response ? true : false,
        counts,
        orders: response || 'Cannot get products',
    });
});

module.exports = {
    createOrder,
    updateStatus,
    getUserOrder,
    getOrders,
    getOrder,
};
