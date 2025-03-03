const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const User = require('../models/userModel');
const Coupon = require('../models/couponModel');
const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose'); // Erase if already required

const createOrder = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { products, total, address, status } = req.body;

    // Cập nhật địa chỉ nếu có
    if (address) {
        await User.findByIdAndUpdate(_id, { address, cart: [] });
    }
    const data = { products, total, orderBy: _id };

    if (status) {
        data.status = status;
    }

    const response = await Order.create(data);

    if (response) {
        try {
            for (const item of products) {
                await Product.findByIdAndUpdate(item.product, {
                    $inc: { sold: item.quantity, quantity: -item.quantity },
                });
            }
        } catch (error) {
            console.error('Error updating sold quantity:', error);
        }
    }

    return res.status(200).json({
        success: !!response,
        response: response || 'Something went wrong',
    });
});

// const createOrder = asyncHandler(async (req, res) => {
//     const session = await mongoose.startSession();
//     session.startTransaction();

//     try {
//         const { _id } = req.user;
//         const { products, total, address, status } = req.body;

//         if (address) {
//             await User.findByIdAndUpdate(_id, { address, cart: [] }, { session });
//         }

//         const data = { products, total, orderBy: _id };
//         if (status) {
//             data.status = status;
//         }
//         const order = await Order.create([data], { session });

//         for (const item of products) {
//             const product = await Product.findById(item.product).session(session);
//             if (!product || product.quantity < item.quantity) {
//                 throw new Error(`Sản phẩm ${product?.name || 'không tồn tại'} không đủ hàng`);
//             }
//             await Product.findByIdAndUpdate(
//                 item.product,
//                 {
//                     $inc: { sold: item.quantity, quantity: -item.quantity },
//                 },
//                 { session },
//             );
//         }

//         // Commit transaction nếu không có lỗi
//         await session.commitTransaction();
//         session.endSession();

//         res.status(200).json({ success: true, response: order });
//     } catch (error) {
//         await session.abortTransaction();
//         session.endSession();
//         res.status(400).json({ success: false, message: error.message });
//     }
// });

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

    queryCommand = queryCommand.populate('orderBy', 'firstname lastname mobile address email');

    const response = await queryCommand.exec();
    const counts = await Order.find(qr).countDocuments();
    res.status(200).json({
        success: response ? true : false,
        counts,
        orders: response || 'Cannot get orders',
    });
});

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
    // Tách các trường đặc biệt ra khỏi query
    const excludeFields = ['limit', 'sort', 'page', 'fields'];
    excludeFields.forEach((element) => delete queries[element]);
    // Format lại operators cho đúng cú pháp mongoose
    let queryString = JSON.stringify(queries);
    queryString = queryString.replace(/\b(gte|gt|lt|lte)\b/g, (matchedElement) => `$${matchedElement}`);
    const formattedQueries = JSON.parse(queryString);

    const qr = { ...formattedQueries };
    if (queries?.name) {
        qr.name = { $regex: queries.name, $options: 'i' };
    }

    let queryCommand = Order.find(qr);

    if (req.query.q) {
        delete qr.q;
        qr['$or'] = [
            { 'orderBy.firstname': { $regex: req.query.q.trim(), $options: 'i' } },
            { 'orderBy.lastname': { $regex: req.query.q.trim(), $options: 'i' } },
        ];
        queryCommand = Order.find(qr);
    }

    // Sorting
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        queryCommand = queryCommand.sort(sortBy);
    }
    // Fields limited
    if (req.query.fields) {
        const fields = req.query.fields.split(',').join(' ');
        queryCommand = queryCommand.select(fields);
    }
    // Pagination
    const page = +req.query.page || 1;
    const limit = +req.query.limit || process.env.LIMIT_PRODUCTS;
    const skip = (page - 1) * limit;
    queryCommand.skip(skip).limit(limit);

    queryCommand = queryCommand.populate('orderBy', 'firstname lastname mobile address email');

    const response = await queryCommand.exec();
    const counts = await Order.countDocuments(qr);

    //  get current time
    const now = new Date();
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    const getRevenue = async (startDate) => {
        const result = await Order.aggregate([
            { $match: { createdAt: { $gte: startDate } } },
            { $group: { _id: null, total: { $sum: '$total' } } },
        ]);
        return result[0]?.total || 0;
    };

    const [dailyRevenue, weeklyRevenue, monthlyRevenue, yearlyRevenue] = await Promise.all([
        getRevenue(startOfDay),
        getRevenue(startOfWeek),
        getRevenue(startOfMonth),
        getRevenue(startOfYear),
    ]);

    const dailyRevenues = await Order.aggregate([
        {
            $match: {
                createdAt: { $gte: startOfMonth },
            },
        },
        {
            $group: {
                _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                revenue: { $sum: '$total' },
            },
        },
        { $sort: { _id: 1 } },
    ]);

    const startOfThisYear = new Date(now.getFullYear(), 0, 1);
    const monthlyRevenues = await Order.aggregate([
        {
            $match: {
                createdAt: { $gte: startOfThisYear },
            },
        },
        {
            $group: {
                _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
                revenue: { $sum: '$total' },
            },
        },
        { $sort: { _id: 1 } },
    ]);

    const orderStatusCounts = await Order.aggregate([
        {
            $group: {
                _id: '$status',
                count: { $sum: 1 },
            },
        },
    ]);

    const statusSummary = orderStatusCounts.reduce(
        (acc, item) => {
            acc[item._id] = item.count;
            return acc;
        },
        { Processing: 0, Canceled: 0, Succeed: 0 },
    );

    res.status(200).json({
        success: response ? true : false,
        counts,
        orders: response || 'Cannot get orders',
        dailyRevenue,
        weeklyRevenue,
        monthlyRevenue,
        yearlyRevenue,
        dailyRevenues,
        monthlyRevenues,
        orderStatusCounts: statusSummary,
    });
});

const boughtTogether = asyncHandler(async (req, res) => {
    const { pid } = req.params;
    // console.log(' Received PID:', pid);

    if (!pid) {
        return res.status(400).json({ success: false, message: 'Product ID is required' });
    }

    // Find all orders containing this product
    const orders = await Order.find({ 'products.product': pid });
    // console.log(' Orders found:', orders.length);

    if (orders.length === 0) {
        return res.status(200).json({ success: true, recommendedProducts: [] });
    }

    // Count occurrences of other products in these orders
    const productCount = {};

    orders.forEach((order) => {
        const uniqueProducts = new Set(order.products.map((p) => p.product.toString())); // Ensure each product is counted only once per order
        // console.log(`Order ${order._id} contains products:`, [...uniqueProducts]);

        uniqueProducts.forEach((productId) => {
            if (productId !== pid) {
                productCount[productId] = (productCount[productId] || 0) + 1;
            }
        });
    });

    // console.log('Product Count:', productCount);

    // Sort products by frequency and get the top 10 most frequently bought together
    const sortedProducts = Object.entries(productCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10) // Keep only the top 10 most frequently bought together products
        .map(([productId]) => productId);

    // console.log('Sorted Products:', sortedProducts);

    if (sortedProducts.length === 0) {
        return res.status(200).json({ success: true, recommendedProducts: [] });
    }

    // Fetch product details
    const recommendedProducts = await Product.find({ _id: { $in: sortedProducts } }).select(
        'title price thumb discount discountPrice',
    );

    res.status(200).json({ success: true, recommendedProducts });
});

module.exports = {
    createOrder,
    updateStatus,
    getUserOrder,
    getOrders,
    getOrder,
    boughtTogether,
};
