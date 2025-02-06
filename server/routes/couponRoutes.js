const router = require('express').Router();
const Controllers = require('../controllers/couponController');

const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken');

router.post('/', [verifyAccessToken, isAdmin], Controllers.createNewCoupon);
router.get('/', Controllers.getCoupons);
router.put('/:cid', [verifyAccessToken, isAdmin], Controllers.updateCoupon);
router.delete('/:cid', [verifyAccessToken, isAdmin], Controllers.deleteCoupon);
module.exports = router;
