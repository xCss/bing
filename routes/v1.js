var express = require('express');
var request = require('superagent');
var dbUtils = require('../utils/dbUtils');
var qiniuUtils = require('../utils/qiniuUtils');
var resolutions = require('../configs/config').resolutions;
var cookie = { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.71 Safari/537.36' };

var router = express.Router();

/**
 * v1 默认返回最新的bing壁纸信息
 */
router.get('/', function(req, res, next) {
    v1(req, res, next);
});
router.post('/', function(req, res, next) {
    v1(req, res, next);
});

var v1 = function(req, res, next) {
    var d = req.params.d;
    var w = req.params.w;
    var h = req.params.h;
    var size = w + 'x' + h;
    var enddate = 0;
    if (!isNaN(d)) {
        var date = +Date.now / 1000 / 60 / 24 - +d;
        var newDate = new Date(date * 24 * 60 * 1000);
        enddate = newDate.getFullYear() + '' + (newDate.getMonth() + 1) > 10 ? (newDate.getMonth() + 1) : '0' + (newDate.getMonth() + 1) + '' + newDate.getDay() > 10 ? newDate.getDay() : '0' + newDate.getDay();
    }
    var params = {
        page: {
            no: 1,
            size: 1
        },
        body: {}
    };
    if (!!enddate) {
        params.body = {
            enddate: enddate
        }
    }
    console.log(params);
    dbUtils.get('bing', params, function(rows) {
        if (rows.length > 0) {
            var data = rows[0];
            if (!!w || !!h) {
                if (resolutions.indexOf(size) > -1) {
                    data['url'] = 'http://images.ioliu.cn/bing/' + data.qiniu_url + '_' + size + '.jpg';
                }
                var qiniu_url = /images\.ioliu\.cn/.test(data.url) ? data.url : qiniuUtils.imageView(data.qiniu_url, w, h);
                request.get(qiniu_url)
                    .set(cookie)
                    .end(function(err, response) {
                        res.header('content-type', 'image/jpg');
                        res.send(response.body);
                    });
            } else {
                var output = {
                    data: data,
                    status: {
                        code: 200,
                        message: ''
                    }
                };
                if (req.method === 'GET' && req.params.callback) {
                    res.jsonp(output);
                } else {
                    res.json(output);
                }
            }
        } else {
            res.json({
                data: {},
                status: {
                    code: -1,
                    message: '很抱歉，由于未知原因，暂时无法提供服务，请稍后重试!'
                }
            });
        }
    });
}

/**
 * 获得随机图片
 */
router.get('/rand', function(req, res, next) {
    random(req, res, next);
});
router.post('/rand', function(req, res, next) {
    random(req, res, next);
});

var random = function(req, res, next) {
    var t = req.params.type;
    var w = req.params.w || '1920';
    var h = req.params.h || '1080';
    var size = w + 'x' + h;
    var callback = req.params.callback;
    dbUtils.getCount('bing', {}, function(rows) {
        if (rows.length > 0) {
            var sum = Number(rows[0].sum);
            var rand = Math.floor(Math.random() * (sum - 1) + 1);
            dbUtils.get('bing', {
                id: rand
            }, function(rs) {
                if (rs.length > 0) {
                    var data = rs[0];
                    if (resolutions.indexOf(size) > -1) {
                        data['url'] = 'http://images.ioliu.cn/bing/' + data.qiniu_url + '_' + size + '.jpg';
                    }
                    if (t === 'json' || !!callback) {
                        console.log(callback);
                        var output = {
                            data: data,
                            status: {
                                code: 200,
                                message: ''
                            }
                        };
                        if (callback) {
                            res.jsonp(output);
                        } else {
                            res.json(output);
                        }
                    } else {
                        var qiniu_url = /images\.ioliu\.cn/.test(data.url) ? data.url : qiniuUtils.imageView(data.qiniu_url, w, h);
                        request.get(qiniu_url)
                            .set(cookie)
                            .end(function(err, response) {
                                res.header('content-type', 'image/jpg');
                                res.send(response.body);
                            });
                    }
                } else {
                    var parmas = '?';
                    params += !!t ? '&t=' + t : '';
                    params += !!w ? '&w=' + w : '';
                    params += !!h ? '&h=' + h : '';
                    params += !!callback ? '&&callback=' + callback : '';
                    res.redirect('/v1/rand' + params);
                }
            });
        } else {
            var parmas = '?';
            params += !!t ? '&t=' + t : '';
            params += !!w ? '&w=' + w : '';
            params += !!h ? '&h=' + h : '';
            params += !!callback ? '&&callback=' + callback : '';
            res.redirect('/v1/rand' + params);
        }
    });
}

module.exports = router;