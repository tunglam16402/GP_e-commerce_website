const Product = require('../models/productModel');
const asyncHandler = require('express-async-handler');
const slugify = require('slugify');
const makeSKU = require('uniqid');

//API create product
// const createProduct = asyncHandler(async (req, res) => {
//     const { title, price, description, brand, category, color } = req.body;
//     const thumb = req?.files?.thumb[0]?.path;
//     const images = req?.files?.images?.map((element) => element.path);
//     if (!(title && price && description && brand && category && color)) {
//         throw new Error('Missing Inputs');
//     }
//     // chuyển chuỗi slug thành chuỗi -slug
//     req.body.slug = slugify(title);
//     if (thumb) {
//         req.body.thumb = thumb;
//     }
//     if (images) {
//         req.body.images = images;
//     }
//     const newProduct = await Product.create(req.body);
//     return res.status(200).json({
//         success: newProduct ? true : false,
//         message: newProduct ? 'Product has been created' : 'Can not create product',
//     });
// });

const createProduct = asyncHandler(async (req, res) => {
    const { title, price, description, detailDescription, brand, category, color, discount } = req.body;
    const thumb = req?.files?.thumb[0]?.path;
    const images = req?.files?.images?.map((element) => element.path);

    // Kiểm tra dữ liệu đầu vào
    if (!(title && price && description && detailDescription && brand && category && color)) {
        throw new Error('Missing Inputs');
    }

    // Nếu có discount, đảm bảo giá trị hợp lệ (từ 0 đến 100)
    if (discount && (discount < 0 || discount > 100)) {
        throw new Error('Discount must be between 0 and 100');
    }

    // Chuyển chuỗi slug thành chuỗi -slug
    req.body.slug = slugify(title);

    // Cập nhật đường dẫn thumb và images nếu có
    if (thumb) {
        req.body.thumb = thumb;
    }
    if (images) {
        req.body.images = images;
    }

    // Kiểm tra giá trị discount hợp lệ và tính toán discountPrice
    let discountPrice = parseFloat(price); // Đảm bảo giá trị là số
    if (discount && discount > 0) {
        // Tính toán giá giảm
        discountPrice = discountPrice - (discountPrice * discount) / 100;
    }

    // Làm tròn giá discountPrice (2 chữ số thập phân)
    req.body.discountPrice = discountPrice.toFixed(2);

    // Thêm discount vào req.body (dù discount có thể không có giá trị, mặc định là 0)
    req.body.discount = discount || 0;

    // Tạo mới sản phẩm với thông tin từ req.body
    const newProduct = await Product.create(req.body);

    // Trả về phản hồi cho người dùng
    return res.status(200).json({
        success: newProduct ? true : false,
        message: newProduct ? 'Product has been created' : 'Can not create product',
    });
});

//API get 1 product
const getProduct = asyncHandler(async (req, res) => {
    const { pid } = req.params;
    const product = await Product.findById(pid).populate({
        path: 'ratings',
        populate: {
            path: 'postedBy',
            select: 'firstname lastname avatar',
        },
    });
    return res.status(200).json({
        success: product ? true : false,
        productData: product ? product : 'Can not get product',
    });
});

// const getAllProduct = asyncHandler(async (req, res) => {
//     const queries = { ...req.query };

//     // Tách các trường đặc biệt ra khỏi query
//     const excludeFields = ['limit', 'sort', 'page', 'fields'];
//     excludeFields.forEach((element) => delete queries[element]);

//     // Format lại operators cho đúng cú pháp mongoose
//     let queryString = JSON.stringify(queries);
//     queryString = queryString.replace(/\b(gte|gt|lt|lte)\b/g, (matchedElement) => `$${matchedElement}`);
//     const formattedQueries = JSON.parse(queryString);

//     let colorQueryObject = {};

//     // Filtering theo các tham số khác nhau
//     if (queries?.title) {
//         formattedQueries.title = { $regex: queries.title, $options: 'i' };
//     }
//     if (queries?.category) {
//         formattedQueries.category = { $regex: queries.category, $options: 'i' };
//     }
//     if (queries?.brand) {
//         formattedQueries.brand = { $regex: queries.brand, $options: 'i' };
//     }
//     if (queries?.color) {
//         delete formattedQueries.color;
//         const colorArray = queries.color?.split(',');
//         const colorQuery = colorArray.map((element) => ({ color: { $regex: element, $options: 'i' } }));
//         colorQueryObject = { $or: colorQuery };
//     }

//     let queryObject = {};
//     if (queries?.q) {
//         delete formattedQueries.q;

//         // Tìm kiếm chung trên các trường title, category, brand, và color
//         queryObject = {
//             $or: [
//                 { title: { $regex: queries.q, $options: 'i' } },
//                 { category: { $regex: queries.q, $options: 'i' } },
//                 { brand: { $regex: queries.q, $options: 'i' } },
//                 { color: { $regex: queries.q, $options: 'i' } },
//             ],
//         };
//     }

//     // Kết hợp tất cả các filter lại
//     const qr = { ...colorQueryObject, ...formattedQueries, ...queryObject };

//     let queryCommand = Product.find(qr);

//     // Sorting (nếu có)
//     if (req.query.sort) {
//         const sortBy = req.query.sort.split(',').join(' ');
//         queryCommand = queryCommand.sort(sortBy);
//     }

//     // Fields limited (nếu có)
//     if (req.query.fields) {
//         const fields = req.query.fields.split(',').join(' ');
//         queryCommand = queryCommand.select(fields);
//     }

//     // Pagination
//     const page = +req.query.page || 1;
//     const limit = +req.query.limit || process.env.LIMIT_PRODUCTS;
//     const skip = (page - 1) * limit;
//     queryCommand = queryCommand.skip(skip).limit(limit);

//     // Execute query và lấy kết quả
//     const response = await queryCommand.exec();
//     const counts = await Product.countDocuments(qr);

//     res.status(200).json({
//         success: response ? true : false,
//         counts,
//         products: response.length ? response : 'Cannot get products',
//     });
// });

const getAllProduct = asyncHandler(async (req, res) => {
    const queries = { ...req.query };

    // Tách các trường đặc biệt ra khỏi query
    const excludeFields = ['limit', 'sort', 'page', 'fields'];
    excludeFields.forEach((element) => delete queries[element]);

    // Format lại operators cho đúng cú pháp mongoose
    let queryString = JSON.stringify(queries);
    queryString = queryString.replace(/\b(gte|gt|lt|lte)\b/g, (matchedElement) => `$${matchedElement}`);
    const formattedQueries = JSON.parse(queryString);

    let colorQueryObject = {};

    if (queries?.title) {
        formattedQueries.title = { $regex: queries.title, $options: 'i' };
    }
    if (queries?.category) {
        formattedQueries.category = { $regex: queries.category, $options: 'i' };
    }
    if (queries?.brand) {
        formattedQueries.brand = { $regex: queries.brand, $options: 'i' };
    }
    if (queries?.color) {
        delete formattedQueries.color;
        const colorArray = queries.color?.split(',');
        const colorQuery = colorArray.map((element) => ({ color: { $regex: element, $options: 'i' } }));
        colorQueryObject = { $or: colorQuery };
    }

    let queryObject = {};
    if (queries?.q) {
        delete formattedQueries.q;

        queryObject = {
            $or: [
                { title: { $regex: queries.q, $options: 'i' } },
                { category: { $regex: queries.q, $options: 'i' } },
                { brand: { $regex: queries.q, $options: 'i' } },
                { color: { $regex: queries.q, $options: 'i' } },
            ],
        };
    }

    const qr = { ...colorQueryObject, ...formattedQueries, ...queryObject };

    let queryCommand = Product.find(qr);

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
    queryCommand = queryCommand.skip(skip).limit(limit);

    const response = await queryCommand.exec();
    const counts = await Product.countDocuments(qr);

    const totalProducts = await Product.countDocuments();

    const totalRatingsResult = await Product.aggregate([
        { $project: { numRatings: { $size: '$ratings' } } },
        { $group: { _id: null, totalRatings: { $sum: '$numRatings' } } },
    ]);
    const totalRatings = totalRatingsResult[0]?.totalRatings || 0;

    res.status(200).json({
        success: response.length > 0,
        counts,
        totalProducts,
        totalRatings,
        products: response.length ? response : 'Cannot get products',
    });
});

//API update product
const updateProduct = asyncHandler(async (req, res) => {
    const { pid } = req.params;
    const files = req?.files;

    if (files?.thumb) {
        req.body.thumb = files?.thumb[0]?.path;
    }
    if (files?.images) {
        req.body.images = files?.images?.map((element) => element.path);
    }
    if (req.body && req.body.title) {
        req.body.slug = slugify(req.body.title);
    }
    // Kiểm tra nếu có discount, tính toán lại discountPrice
    if (req.body.discount && req.body.discount >= 0 && req.body.discount <= 100) {
        const price = parseFloat(req.body.price); // Đảm bảo giá trị price là số
        let discountPrice = price;

        if (req.body.discount > 0) {
            discountPrice = price - (price * req.body.discount) / 100;
        }

        // Làm tròn giá discountPrice (2 chữ số thập phân)
        req.body.discountPrice = discountPrice.toFixed(2);
    }
    const updatedProduct = await Product.findByIdAndUpdate(pid, req.body, { new: true });
    return res.status(200).json({
        success: updatedProduct ? true : false,
        message: updatedProduct ? 'Updated' : 'Can not update products',
    });
});

//API delete product
const deleteProduct = asyncHandler(async (req, res) => {
    const { pid } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(pid);
    return res.status(200).json({
        success: deletedProduct ? true : false,
        message: deletedProduct ? 'Product has been deleted' : 'Can not delete products',
    });
});

//API ratings
const ratings = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { star, comment, pid, updatedAt } = req.body;
    if (!star || !pid) {
        throw new Error('Missing input!');
    }
    const ratingProduct = await Product.findById(pid);
    const alreadyRating = ratingProduct?.ratings?.find((element) => {
        return element.postedBy.toString() === _id;
    });
    if (alreadyRating) {
        //update stars and comments
        await Product.updateOne(
            {
                ratings: { $elemMatch: alreadyRating },
            },
            {
                $set: {
                    'ratings.$.star': star,
                    'ratings.$.comment': comment,
                    'ratings.$.updatedAt': updatedAt,
                },
            },
            { new: true },
        );
    } else {
        //add star and cmt
        await Product.findByIdAndUpdate(
            pid,
            {
                //đẩy data vào mảng
                $push: { ratings: { star, comment, postedBy: _id, updatedAt } },
            },
            { new: true },
        );
    }

    //Sum ratings
    const updatedProduct = await Product.findById(pid);
    const ratingCount = updatedProduct.ratings.length;
    const sumRatings = updatedProduct.ratings.reduce((sum, element) => sum + +element.star, 0);
    updatedProduct.totalRatings = Math.round((sumRatings * 10) / ratingCount) / 10;

    await updatedProduct.save();

    return res.status(200).json({
        success: true,
        updatedProduct,
    });
});

//API upload product image
const uploadImageProduct = asyncHandler(async (req, res) => {
    const { pid } = req.params;
    if (!req.files) {
        throw new Error('Missing inputs');
    }
    const response = await Product.findByIdAndUpdate(
        pid,
        {
            $push: {
                images: {
                    $each: req.files.map((element) => {
                        return element.path;
                    }),
                },
            },
        },
        { new: true },
    );
    return res.status(200).json({
        success: response ? true : false,
        updatedProduct: response ? response : 'Cannot upload image for product',
    });
});

//API add variant for product
// const addVariant = asyncHandler(async (req, res) => {
//     const { pid } = req.params;
//     const { title, price, color, discount } = req.body;
//     const thumb = req?.files?.thumb[0]?.path;
//     const images = req?.files?.images?.map((element) => element.path);
//     if (!(title && price && color)) {
//         throw new Error('Missing Inputs');
//     }

//     // Nếu có discount, đảm bảo giá trị hợp lệ (từ 0 đến 100)
//     if (discount && (discount < 0 || discount > 100)) {
//         throw new Error('Discount must be between 0 and 100');
//     }
//     let discountPrice = parseFloat(price); // Đảm bảo giá trị là số
//     if (discount && discount > 0) {
//         // Tính toán giá giảm
//         discountPrice = discountPrice - (discountPrice * discount) / 100;
//     }

//     // Làm tròn giá discountPrice (2 chữ số thập phân)
//     req.body.discountPrice = parseFloat(discountPrice.toFixed(2));

//     // Thêm discount vào req.body (dù discount có thể không có giá trị, mặc định là 0)
//     req.body.discount = discount || 0;
//     const response = await Product.findByIdAndUpdate(
//         pid,
//         {
//             $push: {
//                 variants: {
//                     color,
//                     price,
//                     discount,
//                     discountPrice,
//                     title,
//                     thumb,
//                     images,
//                     sku: makeSKU().toUpperCase(),
//                 },
//             },
//         },
//         { new: true },
//     );
//     return res.status(200).json({
//         success: response ? true : false,
//         message: response ? 'New variant has been added ' : 'Cannot upload variant product',
//     });
// });
const addVariant = asyncHandler(async (req, res) => {
    const { pid } = req.params;
    const { title, price, color, discount } = req.body;
    const thumb = req?.files?.thumb?.[0]?.path;
    const images = req?.files?.images?.map((element) => element.path);

    if (!(title && price && color)) {
        throw new Error('Missing Inputs');
    }

    if (discount && (discount < 0 || discount > 100)) {
        throw new Error('Discount must be between 0 and 100');
    }

    let discountPrice = parseFloat(price);
    if (discount && discount > 0) {
        discountPrice = discountPrice - (discountPrice * discount) / 100;
    }
    req.body.discountPrice = parseFloat(discountPrice.toFixed(2));

    if (typeof discount !== 'number' || isNaN(discount)) {
        req.body.discount = 0;
    }

    // Kiểm tra sản phẩm có tồn tại không
    const product = await Product.findById(pid);
    if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const response = await Product.findByIdAndUpdate(
        pid,
        {
            $push: {
                variants: {
                    color,
                    price,
                    discount,
                    discountPrice,
                    title,
                    thumb,
                    images,
                    sku: makeSKU().toUpperCase(),
                },
            },
        },
        { new: true },
    );

    return res.status(200).json({
        success: !!response,
        message: response ? 'New variant has been added' : 'Cannot upload variant product',
    });
});

// const updateVariant = asyncHandler(async (req, res) => {
//     const { sku } = req.params; // Lấy sku từ URL params
//     const { title, price, discount, color } = req.body;
//     const files = req.files;

//     // Kiểm tra và cập nhật hình ảnh nếu có
//     let thumb = null;
//     let images = null;

//     if (files?.thumb) {
//         thumb = files?.thumb[0]?.path;
//     }
//     if (files?.images) {
//         images = files?.images?.map((element) => element.path);
//     }

//     // Nếu có discount, đảm bảo giá trị hợp lệ (từ 0 đến 100)
//     if (discount && (discount < 0 || discount > 100)) {
//         throw new Error('Discount must be between 0 and 100');
//     }
//     // Kiểm tra giá trị discount hợp lệ và tính toán discountPrice
//     let discountPrice = parseFloat(price); // Đảm bảo giá trị là số
//     if (discount && discount > 0) {
//         // Tính toán giá giảm
//         discountPrice = discountPrice - (discountPrice * discount) / 100;
//     }

//     // Làm tròn giá discountPrice (2 chữ số thập phân)
//     req.body.discountPrice = discountPrice.toFixed(2);

//     // Thêm discount vào req.body (dù discount có thể không có giá trị, mặc định là 0)
//     req.body.discount = discount || 0;

//     // Cập nhật variant trong sản phẩm
//     const updatedProduct = await Product.findOneAndUpdate(
//         { 'variants.sku': sku }, // Tìm variant có sku này
//         {
//             $set: {
//                 'variants.$.title': title,
//                 'variants.$.price': price,
//                 'variants.$.discount': discount,
//                 'variants.$.discountPrice': discountPrice,
//                 'variants.$.color': color,
//                 'variants.$.thumb': thumb || undefined,
//                 'variants.$.images': images || [],
//             },
//         },
//         { new: true },
//     );

//     if (updatedProduct) {
//         return res.status(200).json({
//             success: true,
//             message: 'Variant updated successfully!',
//         });
//     } else {
//         return res.status(400).json({
//             success: false,
//             message: 'Cannot update variant',
//         });
//     }
// });

// const deleteVariant = asyncHandler(async (req, res) => {
//     const { pid, variantId } = req.params; // variantId chính là sku
//     console.log(pid, variantId);

//     if (!pid || !variantId) {
//         return res.status(400).json({ success: false, message: 'Missing product ID or SKU' });
//     }

//     // Tìm sản phẩm và xóa variant theo SKU
//     const response = await Product.findByIdAndUpdate(
//         pid,
//         {
//             $pull: {
//                 variants: { sku: variantId }, // Xóa variant có sku khớp
//             },
//         },
//         { new: true },
//     );

//     if (!response) {
//         return res.status(404).json({ success: false, message: 'Product not found' });
//     }

//     return res.status(200).json({
//         success: true,
//         message: 'Variant has been deleted',
//     });
// });
const updateVariant = asyncHandler(async (req, res) => {
    const { sku } = req.params; // Lấy sku từ URL params
    const { title, price, discount, color } = req.body;
    const files = req.files;

    // Kiểm tra và cập nhật hình ảnh nếu có
    const thumb = files?.thumb ? files.thumb[0].path : undefined;
    const images = files?.images ? files.images.map((element) => element.path) : undefined;

    // Kiểm tra xem price có hợp lệ không
    if (!price || isNaN(price)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid price value',
        });
    }

    // Nếu có discount, đảm bảo giá trị hợp lệ (từ 0 đến 100)
    if (discount && (discount < 0 || discount > 100)) {
        return res.status(400).json({
            success: false,
            message: 'Discount must be between 0 and 100',
        });
    }

    // Tính toán discountPrice
    let discountPrice = parseFloat(price); // Mặc định discountPrice = price
    if (discount && discount > 0) {
        discountPrice = discountPrice - (discountPrice * discount) / 100;
    }
    discountPrice = parseFloat(discountPrice.toFixed(2)); // Làm tròn 2 chữ số

    // Tạo object chứa các trường cần cập nhật
    let updateFields = {
        'variants.$.title': title,
        'variants.$.price': price,
        'variants.$.discount': discount || 0,
        'variants.$.discountPrice': discountPrice,
        'variants.$.color': color,
    };

    if (thumb) updateFields['variants.$.thumb'] = thumb; // Chỉ cập nhật thumb nếu có file mới
    if (images) updateFields['variants.$.images'] = images; // Chỉ cập nhật images nếu có file mới

    // Cập nhật variant trong sản phẩm
    const updatedProduct = await Product.findOneAndUpdate(
        { 'variants.sku': sku }, // Tìm variant có sku này
        { $set: updateFields },
        { new: true },
    );

    if (updatedProduct) {
        return res.status(200).json({
            success: true,
            message: 'Variant updated successfully!',
            updatedVariant: updatedProduct.variants.find((v) => v.sku === sku),
        });
    } else {
        return res.status(400).json({
            success: false,
            message: 'Cannot update variant',
        });
    }
});

const deleteVariant = asyncHandler(async (req, res) => {
    const { sku } = req.params;

    if (!sku) {
        return res.status(400).json({ success: false, message: 'Missing SKU' });
    }

    const response = await Product.findOneAndUpdate(
        { 'variants.sku': sku }, // Tìm sản phẩm có variant có SKU này
        { $pull: { variants: { sku } } }, // Xóa variant dựa vào SKU
        { new: true },
    );

    if (!response) {
        return res.status(404).json({ success: false, message: 'Variant not found' });
    }

    return res.status(200).json({ success: true, message: 'Variant has been deleted' });
});

module.exports = {
    createProduct,
    getProduct,
    getAllProduct,
    updateProduct,
    deleteProduct,
    ratings,
    uploadImageProduct,
    addVariant,
    updateVariant,
    deleteVariant,
};
