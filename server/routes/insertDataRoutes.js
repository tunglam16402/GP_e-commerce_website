const router = require('express').Router();
const Controllers = require('../controllers/insertDataController');

router.post('/', Controllers.insertProduct);
router.post('/category', Controllers.insertCategory);

module.exports = router;

