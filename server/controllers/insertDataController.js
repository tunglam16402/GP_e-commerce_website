const Product = require('../models/productModel');
const ProductCategory = require('../models/productCategoryModel');
const asyncHandler = require('express-async-handler');
const data = require('../../data/data2.json');
const slugify = require('slugify');
const categoryData = require('../../data/categoryBrand');

//tạo data 1 sp
const insertFunction = async (product) => {
    await Product.create({
        title: product?.name,
        slug: slugify(product?.name) + Math.round(Math.random() * 100) + '',
        description: product?.description,
        brand: product?.brand,
        //chia data về dạng Number và cắt dấu thập phân
        price: Math.round(Number(product?.price?.match(/\d/g).join('')) / 100),
        category: product?.category[1],
        quantity: Math.round(Math.random() * 1000),
        sold: Math.round(Math.random() * 100),
        images: product?.images,
        color: product?.variants?.find((element) => element.label === 'Color')?.variants[0] || 'DEFAULT',
        thumb: product?.thumb,
        totalRatings: 0,
    });
};

//tạo data nhiều sp
const insertProduct = asyncHandler(async (req, res) => {
    const promises = [];
    for (let product of data) promises.push(insertFunction(product));
    await Promise.all(promises);
    return res.status(200).json('Done');
});

//lấy data category
const categoryFunction = async (category) => {
    await ProductCategory.create({
        title: category?.category,
        brand: category?.brand,
        image: category?.image,
    });
};

//tạo data category
const insertCategory = asyncHandler(async (req, res) => {
    const promises = [];
    console.log(categoryData);
    for (let category of categoryData) promises.push(categoryFunction(category));
    await Promise.all(promises);
    return res.status(200).json('Done');
});

module.exports = {
    insertProduct,
    insertCategory,
};
