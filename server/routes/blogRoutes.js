const router = require('express').Router();
const upload = require('../config/cloudinary.config');
const Controllers = require('../controllers/blogController');

const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken');

router.post(
    '/create-blog',
    [verifyAccessToken, isAdmin],
    upload.fields([
        {
            name: 'images',
            maxCount: 10,
        },
    ]),
    Controllers.createNewBlog,
);
router.get('/', Controllers.getBlogs);

router.put('/like/:bid', verifyAccessToken, Controllers.likeBlog);
router.put('/dislike/:bid', verifyAccessToken, Controllers.disLikeBlog);
router.get('/:bid/:title', Controllers.getBlog);
router.put(
    '/:bid',
    [verifyAccessToken, isAdmin],
    upload.fields([
        {
            name: 'images',
            maxCount: 10,
        },
    ]),
    Controllers.updateBlog,
);
router.delete('/:bid', [verifyAccessToken, isAdmin], Controllers.deleteBlog);
// router.put('/image/:bid', [verifyAccessToken, isAdmin], upload.single('file'), Controllers.uploadBlogProduct);

module.exports = router;
