const ProductCategory = require('../models/productCategoryModel');
const asyncHandler = require('express-async-handler');
const slugify = require('slugify');

const createCategory = asyncHandler(async (req, res) => {
    const { title, brand } = req.body;
    const image = req?.files?.image[0]?.path;

    if (!title || !brand) {
        return res.status(400).json({
            success: false,
            message: 'Missing Inputs',
        });
    }
    if (typeof brand === 'string') {
        req.body.brand = brand.split(' ').map((item) => item.trim());
    }
    req.body.slug = slugify(title);
    if (image) {
        req.body.image = image;
    }
    const response = await ProductCategory.create(req.body);
    return res.status(200).json({
        success: response ? true : false,
        message: response ? 'New product category has been create' : 'Can not create new product category!',
    });
});

const getCategory = asyncHandler(async (req, res) => {
    const response = await ProductCategory.find();
    const counts = await ProductCategory.find().countDocuments();

    return res.status(200).json({
        success: response ? true : false,
        counts,
        productCategories: response ? response : 'Can not get product category!',
    });
});


const updateCategory = asyncHandler(async (req, res) => {
    const { pcid } = req.params;
    const files = req?.files;

    if (files?.image) {
        req.body.image = files?.image[0]?.path;
    }

    // if (files?.image) {
    //     req.body.image = files?.image?.map((element) => element.path);
    // }
    // Tạo slug từ title
    if (req.body && req.body.title) {
        req.body.slug = slugify(req.body.title);
    }

    // Kiểm tra và chuyển brand thành mảng nếu là chuỗi
    if (req.body.brand && typeof req.body.brand === 'string') {
        req.body.brand = req.body.brand
            .split(/[\s,;]+/) // Tách bằng khoảng trắng, dấu phẩy hoặc dấu chấm phẩy
            .map((item) => item.trim())
            .filter(Boolean); // Loại bỏ các giá trị rỗng
    }

    // Cập nhật danh mục sản phẩm
    const updatedProductCategory = await ProductCategory.findByIdAndUpdate(pcid, req.body, { new: true });
    return res.status(200).json({
        success: updatedProductCategory ? true : false,
        message: updatedProductCategory ? 'Updated' : 'Can not update product category',
    });
});

const deleteCategory = asyncHandler(async (req, res) => {
    const { pcid } = req.params;
    const response = await ProductCategory.findByIdAndDelete(pcid);
    return res.status(200).json({
        success: response ? true : false,
        message: response ? response : 'Can not delete product category!',
    });
});

module.exports = {
    createCategory,
    getCategory,
    // getAllCategories,
    updateCategory,
    deleteCategory,
};
