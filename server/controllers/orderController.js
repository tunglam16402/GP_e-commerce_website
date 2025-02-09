const Order = require('../models/orderModel');
const Product = require('../models/productModel');
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

// const createOrder = asyncHandler(async (req, res) => {
//     const { _id } = req.user;
//     const { products, total, address, status } = req.body;
//     if (address) {
//         await User.findByIdAndUpdate(_id, { address, cart: [] });
//     }
//     const data = { products, total, orderBy: _id };
//     if (status) {
//         data.status = status;
//     }
//     const response = await Order.create(data);
//     return res.status(200).json({
//         success: response ? true : false,
//         response: response ? response : 'Something went wrong',
//     });
// });

const createOrder = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { products, total, address, status, paymentMethod, transactionId } = req.body;

    // Cập nhật địa chỉ nếu có
    if (address) {
        await User.findByIdAndUpdate(_id, { address, cart: [] });
    }

    // Chuẩn bị dữ liệu đơn hàng
    // const data = { products, total, orderBy: _id, paymentMethod };
    const data = { products, total, orderBy: _id };

    if (status) {
        data.status = status;
    }

    // Nếu là thanh toán online (PayPal hoặc MoMo) thì lưu transactionId
    // if (paymentMethod === 'PayPal' || paymentMethod === 'MoMo') {
    //     if (!transactionId) {
    //         return res.status(400).json({ success: false, message: 'Missing transactionId' });
    //     }
    //     data.transactionId = transactionId;
    // }

    const response = await Order.create(data);

    if (response) {
        try {
            // Cập nhật số lượng `sold` cho từng sản phẩm đã mua
            for (const item of products) {
                await Product.findByIdAndUpdate(item.product, {
                    $inc: { sold: item.quantity },
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

// const getOrders = asyncHandler(async (req, res) => {
//     const queries = { ...req.query };
//     //Tách các trường đặc biệt ra khỏi query
//     const excludeFields = ['limit', 'sort', 'page', 'fields'];
//     excludeFields.forEach((element) => delete queries[element]);
//     //format lại operators cho đúng cú pháp mongoose
//     let queryString = JSON.stringify(queries);
//     queryString = queryString.replace(/\b(gte|gt|lt|lte)\b/g, (matchedElement) => {
//         return `$${matchedElement}`;
//     });
//     const formattedQueries = JSON.parse(queryString);

//     const qr = { ...formattedQueries };
//     if (queries?.name) {
//         qr.name = { $regex: queries.name, $options: 'i' };
//     }
//     let queryCommand = Order.find(qr);

//     if (req.query.q) {
//         delete qr.q;
//         qr['$or'] = [
//             { 'orderBy.firstname': { $regex: req.query.q.trim(), $options: 'i' } },
//             { 'orderBy.lastname': { $regex: req.query.q.trim(), $options: 'i' } },
//         ];
//         queryCommand = Order.find(qr);
//     }

//     //Sorting
//     if (req.query.sort) {
//         // chuyển chuỗi từ dấu phẩy sang dấu cách eg: abc,def => [abc, efg] => abc def
//         const sortBy = req.query.sort.split(',').join(' ');
//         queryCommand = queryCommand.sort(sortBy);
//     }

//     //Fields limtited
//     if (req.query.fields) {
//         const fields = req.query.fields.split(',').join(' ');
//         queryCommand = queryCommand.select(fields);
//     }
//     //Pagination
//     // dấu + để chuyển từ dạng chuỗi sang dạng số(string to number)
//     const page = +req.query.page || 1;
//     const limit = +req.query.limit || process.env.LIMIT_PRODUCTS;
//     const skip = (page - 1) * limit;
//     queryCommand.skip(skip).limit(limit);

//     queryCommand = queryCommand.populate('orderBy', 'firstname lastname mobile address email');

//     const response = await queryCommand.exec();
//     const counts = await Order.find(qr).countDocuments();
//     res.status(200).json({
//         success: response ? true : false,
//         counts,
//         orders: response || 'Cannot get products',
//     });
// });

// const getOrders = asyncHandler(async (req, res) => {
//     const queries = { ...req.query };
//     // Tách các trường đặc biệt ra khỏi query
//     const excludeFields = ['limit', 'sort', 'page', 'fields'];
//     excludeFields.forEach((element) => delete queries[element]);

//     // Format lại operators cho đúng cú pháp mongoose
//     let queryString = JSON.stringify(queries);
//     queryString = queryString.replace(/\b(gte|gt|lt|lte)\b/g, (matchedElement) => `$${matchedElement}`);
//     const formattedQueries = JSON.parse(queryString);

//     const qr = { ...formattedQueries };
//     if (queries?.name) {
//         qr.name = { $regex: queries.name, $options: 'i' };
//     }

//     let queryCommand = Order.find(qr);

//     if (req.query.q) {
//         delete qr.q;
//         qr['$or'] = [
//             { 'orderBy.firstname': { $regex: req.query.q.trim(), $options: 'i' } },
//             { 'orderBy.lastname': { $regex: req.query.q.trim(), $options: 'i' } },
//         ];
//         queryCommand = Order.find(qr);
//     }

//     // Sorting
//     if (req.query.sort) {
//         const sortBy = req.query.sort.split(',').join(' ');
//         queryCommand = queryCommand.sort(sortBy);
//     }

//     // Fields limtited
//     if (req.query.fields) {
//         const fields = req.query.fields.split(',').join(' ');
//         queryCommand = queryCommand.select(fields);
//     }

//     // Pagination
//     const page = +req.query.page || 1;
//     const limit = +req.query.limit || process.env.LIMIT_PRODUCTS;
//     const skip = (page - 1) * limit;
//     queryCommand.skip(skip).limit(limit);

//     queryCommand = queryCommand.populate('orderBy', 'firstname lastname mobile address email');

//     // Lấy danh sách đơn hàng
//     const response = await queryCommand.exec();
//     const counts = await Order.find(qr).countDocuments();

//     // Tính tổng doanh thu
//     const totalRevenueResult = await Order.aggregate([
//         { $match: qr }, // Lọc theo điều kiện tìm kiếm
//         { $group: { _id: null, total: { $sum: '$total' } } },
//     ]);
//     const totalRevenue = totalRevenueResult[0]?.total || 0;
//     console.log(totalRevenue)

//     res.status(200).json({
//         success: response ? true : false,
//         counts,
//         totalRevenue, // Tổng doanh thu
//         orders: response || 'Cannot get orders',
//     });
// });

// const getOrders = asyncHandler(async (req, res) => {
//     const queries = { ...req.query };

//     // Tách các trường đặc biệt ra khỏi query
//     const excludeFields = ['limit', 'sort', 'page', 'fields'];
//     excludeFields.forEach((element) => delete queries[element]);

//     // Format lại operators cho đúng cú pháp mongoose
//     let queryString = JSON.stringify(queries);
//     queryString = queryString.replace(/\b(gte|gt|lt|lte)\b/g, (matchedElement) => `$${matchedElement}`);
//     const formattedQueries = JSON.parse(queryString);

//     const qr = { ...formattedQueries };
//     if (queries?.name) {
//         qr.name = { $regex: queries.name, $options: 'i' };
//     }

//     let queryCommand = Order.find(qr);

//     if (req.query.q) {
//         delete qr.q;
//         qr['$or'] = [
//             { 'orderBy.firstname': { $regex: req.query.q.trim(), $options: 'i' } },
//             { 'orderBy.lastname': { $regex: req.query.q.trim(), $options: 'i' } },
//         ];
//         queryCommand = Order.find(qr);
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

//     // Pagination
//     const page = +req.query.page || 1;
//     const limit = +req.query.limit || process.env.LIMIT_PRODUCTS;
//     const skip = (page - 1) * limit;
//     queryCommand.skip(skip).limit(limit);

//     queryCommand = queryCommand.populate('orderBy', 'firstname lastname mobile address email');

//     // Lấy danh sách đơn hàng
//     const response = await queryCommand.exec();
//     const counts = await Order.countDocuments(qr);

//     // Lấy thời gian hiện tại
//     const now = new Date();
//     const startOfDay = new Date(now.setHours(0, 0, 0, 0));
//     const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
//     const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
//     const startOfYear = new Date(now.getFullYear(), 0, 1);

//     // Hàm tính tổng doanh thu theo khoảng thời gian
//     const getRevenue = async (startDate) => {
//         const result = await Order.aggregate([
//             { $match: { createdAt: { $gte: startDate } } },
//             { $group: { _id: null, total: { $sum: '$total' } } },
//         ]);
//         return result[0]?.total || 0;
//     };

//     // Tính doanh thu theo các khoảng thời gian
//     const [dailyRevenue, weeklyRevenue, monthlyRevenue, yearlyRevenue] = await Promise.all([
//         getRevenue(startOfDay),
//         getRevenue(startOfWeek),
//         getRevenue(startOfMonth),
//         getRevenue(startOfYear),
//     ]);

//     res.status(200).json({
//         success: response ? true : false,
//         counts,
//         orders: response || 'Cannot get orders',
//         dailyRevenue, // Doanh thu hôm nay
//         weeklyRevenue, // Doanh thu tuần
//         monthlyRevenue, // Doanh thu tháng
//         yearlyRevenue, // Doanh thu năm
//     });
// });

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

    // Lấy danh sách đơn hàng
    const response = await queryCommand.exec();
    const counts = await Order.countDocuments(qr);

    // Lấy thời gian hiện tại
    const now = new Date();
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    // Hàm tính tổng doanh thu theo khoảng thời gian
    const getRevenue = async (startDate) => {
        const result = await Order.aggregate([
            { $match: { createdAt: { $gte: startDate } } },
            { $group: { _id: null, total: { $sum: '$total' } } },
        ]);
        return result[0]?.total || 0;
    };

    // Tính doanh thu theo các khoảng thời gian
    const [dailyRevenue, weeklyRevenue, monthlyRevenue, yearlyRevenue] = await Promise.all([
        getRevenue(startOfDay),
        getRevenue(startOfWeek),
        getRevenue(startOfMonth),
        getRevenue(startOfYear),
    ]);

    // ✅ Tính doanh thu theo từng ngày trong tháng
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

    // ✅ Tính doanh thu từng tháng trong năm hiện tại
    const startOfThisYear = new Date(now.getFullYear(), 0, 1);
    const monthlyRevenues = await Order.aggregate([
        {
            $match: {
                createdAt: { $gte: startOfThisYear }, // Lọc đơn hàng trong năm hiện tại
            },
        },
        {
            $group: {
                _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } }, // Nhóm theo tháng
                revenue: { $sum: '$total' }, // Tính tổng doanh thu
            },
        },
        { $sort: { _id: 1 } }, // Sắp xếp theo thời gian
    ]);

    const orderStatusCounts = await Order.aggregate([
        {
            $group: {
                _id: '$status',
                count: { $sum: 1 },
            },
        },
    ]);

    // Chuyển dữ liệu trạng thái đơn hàng thành object { Processing: 10, Canceled: 5, Succeed: 20 }
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
        dailyRevenues, // ✅ Trả về danh sách doanh thu từng ngày
        monthlyRevenues,
        orderStatusCounts: statusSummary, // ✅ Trả về tổng trạng thái đơn hàng
    });
});

module.exports = {
    createOrder,
    updateStatus,
    getUserOrder,
    getOrders,
    getOrder,
};
