const router = require('express').Router();
const Controllers = require('../controllers/brandController');

const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken');

router.post('/create-brand', [verifyAccessToken, isAdmin], Controllers.createNewBrand);
router.get('/', Controllers.getBrands);
router.put('/:bid', [verifyAccessToken, isAdmin], Controllers.updateBrand);
router.delete('/:bid', [verifyAccessToken, isAdmin], Controllers.deleteBrand);

module.exports = router;
