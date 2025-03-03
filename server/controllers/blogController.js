const Blog = require('../models/blogModel');
const asyncHandler = require('express-async-handler');
const slugify = require('slugify');



const createNewBlog = asyncHandler(async (req, res) => {
    // const { title, description } = req.body;
    // const images = req?.files?.images?.map((element) => element.path);
    // if (!(title && description)) {
    //     throw new Error('Missing Inputs');
    // }
    // // chuyển chuỗi slug thành chuỗi -slug
    // req.body.slug = slugify(title);
    // if (images) {
    //     req.body.images = images;
    // }
    const { title, description } = req.body;
    const images = req?.files?.images?.map((element) => element.path);
    if (!title || !description) {
        return res.status(400).json({
            success: false,
            message: 'Title and description are required',
        });
    }

    // Tạo slug từ tiêu đề
    const slug = slugify(title, { lower: true, strict: true });

    // Kiểm tra slug trùng lặp
    const existingBlog = await Blog.findOne({ slug });
    if (existingBlog) {
        return res.status(400).json({
            success: false,
            message: 'A blog with this title already exists. Please choose another title.',
        });
    }

    // Gán hình ảnh nếu có, hoặc gán giá trị mặc định
    req.body.images = images?.length
        ? images
        : ['https://tse3.mm.bing.net/th?id=OIP.jeIZbiXiDT0YeHnsFCDUEgHaDl&pid=Api&P=0&h=220'];
    req.body.slug = slug;

    const newBlog = await Blog.create(req.body);
    return res.status(200).json({
        success: newBlog ? true : false,
        message: newBlog ? 'Blog has been created' : 'Can not create Blog',
    });
});

const updateBlog = asyncHandler(async (req, res) => {
    // const { bid } = req.params;
    // if (Object.keys(req.body).length === 0) {
    //     throw new Error('Missing input!');
    // }
    // const response = await Blog.findByIdAndUpdate(bid, req.body, { new: true });
    // return res.status(200).json({
    //     success: response ? true : false,
    //     updatedBlog: response ? response : 'Can not update blog !',
    // });
    const { bid } = req.params;
    const files = req?.files;

    if (files?.images) {
        req.body.images = files?.images?.map((element) => element.path);
    }
    if (req.body && req.body.title) {
        req.body.slug = slugify(req.body.title);
    }
    const updatedBlog = await Blog.findByIdAndUpdate(bid, req.body, { new: true });
    return res.status(200).json({
        success: updatedBlog ? true : false,
        message: updatedBlog ? 'Updated' : 'Can not update blog',
    });
});

const getBlogs = asyncHandler(async (req, res) => {
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

    let queryCommand = Blog.find(formattedQueries);

    // Search admin Blog
    if (req.query.q) {
        delete formattedQueries.q;
        formattedQueries['$or'] = [{ title: { $regex: req.query.q, $options: 'i' } }];
        queryCommand = Blog.find(formattedQueries);
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

    // Execute the query with error handling
    const response = await queryCommand.exec();
    const counts = await Blog.find(formattedQueries).countDocuments();
    res.status(200).json({
        success: response ? true : false,
        counts,
        blogs: response || 'Cannot get Blog',
    });
});

const likeBlog = asyncHandler(async (req, res) => {
    const { _id } = req.user; // Lấy id từ user
    const { bid } = req.params; // Lấy id bài blog từ params

    if (!bid) {
        return res.status(400).json({ success: false, message: 'Missing input!' });
    }

    const blog = await Blog.findById(bid); // Tìm blog theo id

    if (!blog) {
        return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    // Kiểm tra nếu user đã dislike bài blog
    const alreadyDisliked = blog?.dislikes?.includes(_id);
    if (alreadyDisliked) {
        // Nếu đã dislike, bỏ dislike
        const response = await Blog.findByIdAndUpdate(bid, { $pull: { dislikes: _id } }, { new: true });
        return res.status(200).json({
            success: true,
            message: 'Removed dislike',
            response,
        });
    }

    // Kiểm tra nếu user đã like bài blog
    const alreadyLiked = blog?.likes?.includes(_id);
    if (alreadyLiked) {
        // Nếu đã like, bỏ like
        const response = await Blog.findByIdAndUpdate(bid, { $pull: { likes: _id } }, { new: true });
        return res.status(200).json({
            success: true,
            message: 'Removed like',
            response,
        });
    }

    // Nếu chưa like hoặc dislike, thêm like
    const response = await Blog.findByIdAndUpdate(bid, { $push: { likes: _id } }, { new: true });
    return res.status(200).json({
        success: true,
        message: 'Liked successfully',
        response,
    });
});

const disLikeBlog = asyncHandler(async (req, res) => {
    const { _id } = req.user; // Lấy id từ user
    const { bid } = req.params; // Lấy id bài blog từ params

    if (!bid) {
        return res.status(400).json({ success: false, message: 'Missing input!' });
    }

    const blog = await Blog.findById(bid); // Tìm blog theo id

    if (!blog) {
        return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    // Kiểm tra nếu user đã like bài blog
    const alreadyLiked = blog?.likes?.includes(_id);
    if (alreadyLiked) {
        // Nếu đã like, bỏ like
        const response = await Blog.findByIdAndUpdate(bid, { $pull: { likes: _id } }, { new: true });
        return res.status(200).json({
            success: true,
            message: 'Removed like',
            response,
        });
    }

    // Kiểm tra nếu user đã dislike bài blog
    const alreadyDisliked = blog?.dislikes?.includes(_id);
    if (alreadyDisliked) {
        // Nếu đã dislike, bỏ dislike
        const response = await Blog.findByIdAndUpdate(bid, { $pull: { dislikes: _id } }, { new: true });
        return res.status(200).json({
            success: true,
            message: 'Removed dislike',
            response,
        });
    }

    // Nếu chưa like hoặc dislike, thêm dislike
    const response = await Blog.findByIdAndUpdate(bid, { $push: { dislikes: _id } }, { new: true });
    return res.status(200).json({
        success: true,
        message: 'Disliked successfully',
        response,
    });
});

const getBlog = asyncHandler(async (req, res) => {
    const { bid } = req.params;
    const blog = await Blog.findByIdAndUpdate(bid, { $inc: { numberViews: 1 } }, { new: true })
        .populate('likes', 'firstname lastname')
        .populate('dislikes', 'firstname lastname');
    return res.status(200).json({
        success: blog ? true : false,
        response: blog,
    });
});

const deleteBlog = asyncHandler(async (req, res) => {
    const { bid } = req.params;
    const blog = await Blog.findByIdAndDelete(bid);
    return res.status(200).json({
        success: blog ? true : false,
        message: blog ? 'Blog has been deleted' : 'Can not delete blog',
    });
});

//API upload image blog
const uploadBlogProduct = asyncHandler(async (req, res) => {
    const { bid } = req.params;
    if (!req.file) {
        throw new Error('Missing inputs');
    }
    const response = await Blog.findByIdAndUpdate(bid, { image: req.file.path }, { new: true });
    return res.status(200).json({
        status: response ? true : false,
        updatedBlog: response ? response : 'Cannot upload image for blog',
    });
});
module.exports = {
    createNewBlog,
    updateBlog,
    getBlogs,
    likeBlog,
    disLikeBlog,
    getBlog,
    deleteBlog,
    uploadBlogProduct,
};
