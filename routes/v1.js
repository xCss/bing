var express = require('express');
var request = require('superagent');
var dbUtils = require('../utils/dbUtils');
var qiniuUtils = require('../utils/qiniuUtils');
var cookie = { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.71 Safari/537.36' };

var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

router.get('/rand', function(req, res, next) {
    dbUtils.getCount('bing', {}, function(rows) {
        if (rows.length > 0) {
            var sum = Number(rows[0].sum);
            var rand = Math.floor(Math.random() * (sum - 1) + 1);
            dbUtils.get('bing', {
                id: rand
            }, function(rs) {
                console.log(rs);
                console.log('rand:' + rand);
                if (rs.length > 0) {
                    var data = rs[0];
                    var qiniu_url = data.qiniu_url;
                    var fullURL = qiniuUtils.imageView(qiniu_url);
                    console.log(fullURL);
                    request.get(fullURL)
                        .set(cookie)
                        .end(function(err, response) {
                            res.header('content-type', 'image/jpg');
                            res.send(response.body);
                        });
                } else {
                    res.redirect('/');
                }

            });
        } else {
            res.redirect('/')
        }
    });
})

module.exports = router;