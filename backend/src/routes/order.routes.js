const express = require('express');
const router  = express.Router();
const { purchase } = require('../controllers/order.controller');
const auth = require('../middlewares/auth.middleware');

router.use(auth);
router.post('/purchase', purchase);

module.exports = router;