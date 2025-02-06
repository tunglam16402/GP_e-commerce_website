const router = require('express').Router();
const Controllers = require('../controllers/productCategoryController');
const upload = require('../config/cloudinary.config');

const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken');

router.post(
    '/create-category',
    upload.fields([
        {
            name: 'image',
            maxCount: 1,
        },
    ]),
    [verifyAccessToken, isAdmin],
    Controllers.createCategory,
);

router.get('/', Controllers.getCategory);
// router.get('/manage-category', [verifyAccessToken, isAdmin], Controllers.getAllCategories);
router.put(
    '/:pcid',
    upload.fields([
        {
            name: 'image',
            maxCount: 1,
        },
    ]),
    [verifyAccessToken, isAdmin],
    Controllers.updateCategory,
);

router.put('/:pcid', [verifyAccessToken, isAdmin], Controllers.updateCategory);
router.delete('/:pcid', [verifyAccessToken, isAdmin], Controllers.deleteCategory);

module.exports = router;
