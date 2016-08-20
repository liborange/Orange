var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/main', function (req, res, next) {
  res.render('mainpage',{ content: 'hello',coverimg: 'http://upload.jianshu.io/daily_images/images/UevpbWNMJXzWoxcZLhmZ.jpg' });
});
router.get('/waterfall',function(req,res,next){
  res.render('waterfull');
})
router.get('/slidmove',function(req,res,next){
  res.render('fancymove');
});
router.get('/picwall',function(req,res,next){
  res.render('imgThumbWall');
})


module.exports = router;
