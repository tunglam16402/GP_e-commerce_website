const Brand = require('../models/brandModel');
const asyncHandler = require('express-async-handler');

const createNewBrand = asyncHandler(async (req, res) => {
    const { title } = req.body;
    if (!title) {
        throw new Error('Missing Inputs');
    }
    const response = await Brand.create(req.body);
    return res.status(200).json({
        success: response ? true : false,
        message: response ? response : 'Can not create new Brand!',
    });
});

const getBrands = asyncHandler(async (req, res) => {
    // const response = await Brand.find();
    // return res.status(200).json({
    //     success: response ? true : false,
    //     message: response ? response : 'Can not get Brand!',
    // });
    const queries = { ...req.query };

    // Tách các trường đặc biệt ra khỏi query
    const excludeFields = ['limit', 'sort', 'page', 'fields'];
    excludeFields.forEach((element) => delete queries[element]);

    // Format lại operators cho đúng cú pháp mongoose
    let queryString = JSON.stringify(queries);
    queryString = queryString.replace(/\b(gte|gt|lt|lte)\b/g, (matchedElement) => {
        return `$${matchedElement}`;
    });
    const formattedQueries = JSON.parse(queryString);

    // Filtering
    if (queries?.name) {
        formattedQueries.name = { $regex: queries.name, $options: 'i' };
    }

    let queryCommand = Brand.find(formattedQueries);

    // Search admin Brand
    if (req.query.q) {
        delete formattedQueries.q;
        formattedQueries['$or'] = [{ title: { $regex: req.query.q, $options: 'i' } }];
        queryCommand = Brand.find(formattedQueries);
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
    // const page = +req.query.page || 1;
    // const limit = +req.query.limit || process.env.LIMIT_PRODUCTS || 10;
    // const skip = (page - 1) * limit;
    // queryCommand = queryCommand.skip(skip).limit(limit);
    const page = +req.query.page || 1;
    const limit = +req.query.limit || process.env.LIMIT_PRODUCTS;
    const skip = (page - 1) * limit;
    queryCommand.skip(skip).limit(limit);

    // Execute the query with error handling
    const response = await queryCommand.exec();
    const counts = await Brand.find(formattedQueries).countDocuments();
    res.status(200).json({
        success: response ? true : false,
        counts,
        brands: response || 'Cannot get brand',
    });
});

const updateBrand = asyncHandler(async (req, res) => {
    const { bid } = req.params;
    const response = await Brand.findByIdAndUpdate(bid, req.body, { new: true });
    return res.status(200).json({
        success: response ? true : false,
        message: response ? response : 'Can not update Brand!',
    });
});

const deleteBrand = asyncHandler(async (req, res) => {
    const { bid } = req.params;
    const response = await Brand.findByIdAndDelete(bid);
    return res.status(200).json({
        success: response ? true : false,
        message: response ? response : 'Can not delete Brand!',
    });
});

module.exports = {
    createNewBrand,
    getBrands,
    updateBrand,
    deleteBrand,
};
