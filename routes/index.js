var router = require('express').Router();

router.use('/auth', require('./auth.routes'));
router.use('/api', require('./api'));

module.exports = router;
