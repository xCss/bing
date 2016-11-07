var express = require('express');
var request = require('superagent');
var dbUtils = require('../utils/dbUtils');
var qiniuUtils = require('../utils/qiniuUtils');
var cookie = { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.71 Safari/537.36' };

var router = express.Router();

/**
 * v1 默认返回最新的bing壁纸信息
 */
router.get('/', function(req, res, next) {
    commonV1(req, res, next);
});
router.post('/', function(req, res, next) {
    commonV1(req, res, next);
});

var commonV1 = function(req, res, next) {
    dbUtils.get('bing', {
        page: {
            no: 1,
            size: 1
        },
        body: {}
    }, function(rows) {
        if (rows.length > 0) {
            if (req.method === 'GET' && req.query.callback) {
                res.jsonp(rows[0]);
            } else {
                res.json(rows[0]);
            }
        } else {
            res.json({
                status: -1,
                message: '很抱歉，由于未知原因，暂时无法提供服务，请稍后重试!'
            });
        }
    });
}

router.get('/rand', function(req, res, next) {
    dbUtils.getCount('bing', {}, function(rows) {
        if (rows.length > 0) {
            var sum = Number(rows[0].sum);
            var rand = Math.floor(Math.random() * (sum - 1) + 1);
            dbUtils.get('bing', {
                id: rand
            }, function(rs) {
                if (rs.length > 0) {
                    var data = rs[0];
                    var qiniu_url = data.qiniu_url;
                    var fullURL = qiniuUtils.imageView(qiniu_url);
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