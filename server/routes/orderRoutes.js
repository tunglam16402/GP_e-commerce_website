const router = require('express').Router();
const upload = require('../config/cloudinary.config');
const Controllers = require('../controllers/orderController');

const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken');

router.post('/', [verifyAccessToken], Controllers.createOrder);
router.put('/status/:oid', [verifyAccessToken, isAdmin], Controllers.updateStatus);

router.get('/admin', [verifyAccessToken, isAdmin], Controllers.getOrders);

router.get('/', [verifyAccessToken], Controllers.getUserOrder);

router.get('/bought-together/:pid', verifyAccessToken, Controllers.boughtTogether);

router.get('/:oid', [verifyAccessToken], Controllers.getOrder);

module.exports = router;
