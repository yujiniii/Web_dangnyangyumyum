var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('sale/user');
});

router.get('/main', function(req, res, next) {
  res.render('sale/main');
});

module.exports = router;
