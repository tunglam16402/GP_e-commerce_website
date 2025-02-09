const router = require('express').Router();
const Controllers = require('../controllers/userController');
const upload = require('../config/cloudinary.config');

const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken');

router.post('/register', Controllers.register);
router.post('/mock', Controllers.createUser);
router.put('/finalRegister/:token', Controllers.finalRegister);
router.post('/login', Controllers.login);
router.post('/google-login', Controllers.googleLogin);
router.get('/current', verifyAccessToken, Controllers.getCurrent);
router.post('/refreshtoken', Controllers.refreshAccessToken);
router.get('/logout', Controllers.logout);
router.post('/forgotpassword', Controllers.forgotPassword);
router.put('/resetpassword', Controllers.resetPassword);
router.get('/', [verifyAccessToken, isAdmin], Controllers.getUsers);
router.put('/current', verifyAccessToken, upload.single('avatar'), Controllers.updateUser);
router.put('/address', [verifyAccessToken], Controllers.updateUserAddress);
router.put('/cart', [verifyAccessToken], Controllers.updateCart);
router.delete('/remove-cart/:pid/:color', [verifyAccessToken], Controllers.removeProductInCart);
router.delete('/:uid', [verifyAccessToken, isAdmin], Controllers.deleteUser);
router.put('/wishlist/:pid', [verifyAccessToken], Controllers.updateWishList);
router.put('/:uid', [verifyAccessToken, isAdmin], Controllers.updateUserByAdmin);

module.exports = router;
