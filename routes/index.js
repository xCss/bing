var express = require('express');
var router = express.Router();
/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {
        title: '必应壁纸'
        , description: 'Bing 每日壁纸'
    });
});
module.exports = router;