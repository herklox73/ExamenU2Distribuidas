const express = require('express');
const router  = express.Router();
const c = require('../controllers/product.controller');
const auth = require('../middlewares/auth.middleware');

router.use(auth);
router.get('/',        c.getAll);
router.get('/search',  c.search);
router.get('/:id',     c.getById);
router.post('/',       c.create);
router.put('/:id',     c.update);
router.delete('/:id',  c.remove);

module.exports = router;