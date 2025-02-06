const router = require('express').Router();
const Controllers = require('../controllers/blogCategoryController');

const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken');

router.post('/', [verifyAccessToken, isAdmin], Controllers.createCategory);
router.get('/', Controllers.getCategory);
router.put('/:bcid', [verifyAccessToken, isAdmin], Controllers.updateCategory);
router.delete('/:bcid', [verifyAccessToken, isAdmin], Controllers.deleteCategory);

module.exports = router;
