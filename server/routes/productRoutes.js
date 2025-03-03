const router = require('express').Router();
const Controllers = require('../controllers/productController');
const upload = require('../config/cloudinary.config');

const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken');

router.post(
    '/create-product',
    [verifyAccessToken, isAdmin],
    upload.fields([
        {
            name: 'images',
            maxCount: 10,
        },
        {
            name: 'thumb',
            maxCount: 1,
        },
    ]),
    Controllers.createProduct,
);
router.get('/', Controllers.getAllProduct);
// router.get('/', verifyAccessToken, Controllers.getAllProduct);

router.put('/ratings', verifyAccessToken, Controllers.ratings);

router.put(
    '/update-variant/:sku',
    [verifyAccessToken, isAdmin],
    upload.fields([
        {
            name: 'images',
            maxCount: 10,
        },
        {
            name: 'thumb',
            maxCount: 1,
        },
    ]),
    Controllers.updateVariant,
);

// router.delete('/variant/:pid/:sku', [verifyAccessToken, isAdmin], Controllers.deleteVariant);
router.delete('/variant/:sku', [verifyAccessToken, isAdmin], Controllers.deleteVariant);

router.put(
    '/uploadimage/:pid',
    [verifyAccessToken, isAdmin],
    upload.array('images', 10),
    Controllers.uploadImageProduct,
);

router.put(
    '/variant/:pid',
    [verifyAccessToken, isAdmin],
    upload.fields([
        {
            name: 'images',
            maxCount: 10,
        },
        {
            name: 'thumb',
            maxCount: 1,
        },
    ]),
    Controllers.addVariant,
);

router.put('/ban-product/:pid', [verifyAccessToken, isAdmin], Controllers.banProduct);
router.put('/update-quantity/:pid', [verifyAccessToken, isAdmin], Controllers.updateProductQuantity);

//xem sản phẩm thì không cần xác thực đăng nhập
router.get('/:pid', Controllers.getProduct);

router.put(
    '/:pid',
    [verifyAccessToken, isAdmin],
    upload.fields([
        {
            name: 'images',
            maxCount: 10,
        },
        {
            name: 'thumb',
            maxCount: 1,
        },
    ]),
    Controllers.updateProduct,
);

router.delete('/:pid', [verifyAccessToken, isAdmin], Controllers.deleteProduct);

module.exports = router;
