const userRouter = require('./userRoutes');
const productRouter = require('./productRoutes');
const productCategoryRouter = require('./productCategoryRoutes');
const blogCategoryRouter = require('./blogCategoryRoutes');
const blogRouter = require('./blogRoutes');
const brandRouter = require('./brandRoutes');
const couponRouter = require('./couponRoutes');
const orderRouter = require('./orderRoutes');
const insertDataRouter = require('./insertDataRoutes');
const { notFound, errHandler } = require('../middlewares/errorHandler');
const dialogflowRouter = require('./dialogflow');

const initRoutes = (app) => {
    app.use('/api/user', userRouter);
    app.use('/api/product', productRouter);
    app.use('/api/productCategory', productCategoryRouter);
    app.use('/api/blogCategory', blogCategoryRouter);
    app.use('/api/blog', blogRouter);
    app.use('/api/brand', brandRouter);
    app.use('/api/coupon', couponRouter);
    app.use('/api/order', orderRouter);
    app.use('/api/insertData', insertDataRouter);

    app.use('/api/dialogflow', dialogflowRouter);

    // nếu không trùng với api nào phía trên thì chạy hàm dưới lỗi 404
    // app.use(notFound);
    // app.use(errHandler);
};

module.exports = initRoutes;
