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
    var d = req.query.d || req.body.d;
    var w = req.query.w || req.body.w;
    var h = req.query.h || req.body.h;
    var p = req.query.p || req.body.p;
    var num = req.query.size || req.body.size;
    var t = req.query.type || req.body.type;
    var size = w + 'x' + h;
    var enddate = 0;
    if (!isNaN(d)) {
        var date = new Date().getTime() - parseInt(d) * 1000 * 60 * 60 * 24;
        var newDate = new Date(date);
        enddate = newDate.getFullYear() + '' + ((newDate.getMonth() + 1) > 9 ? (newDate.getMonth() + 1) : '0' + (newDate.getMonth() + 1)) + '' + (newDate.getDate() > 9 ? newDate.getDate() : '0' + newDate.getDate());
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
    if (!!p && !isNaN(p)) {
        p = +p < 1 ? 1 : p;
        params.page = {
            no: p,
            size: 10
        }
        if (!!num && !isNaN(num)) {
            num = +num < 1 ? 1 : num;
            params.page.size = num;
        }
    }
    dbUtils.get('bing', params, function(rows) {
        if (rows.length > 0) {
            var data = rows[0];
            if (!!w || !!h) {
                if (resolutions.indexOf(size) > -1) {
                    data['url'] = 'http://static.ioliu.cn/bing/' + data.qiniu_url + '_' + size + '.jpg';
                }
                var qiniu_url = /static\.ioliu\.cn/.test(data.url) ? data.url : qiniuUtils.imageView(data.qiniu_url, w, h);
                request.get(qiniu_url)
                    .set(cookie)
                    .end(function(err, response) {
                        res.header('content-type', 'image/jpg');
                        res.send(response.body);
                    });
            } else {
                if (+num > 0) {
                    data = rows;
                }
                var output = {
                    data: data,
                    status: {
                        code: 200,
                        message: ''
                    }
                };
                if (req.method === 'GET' && req.query.callback) {
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
                    message: '好厉害啊，这么隐秘的地方都被你发现了n(*≧▽≦*)n，我已经通知主人咯♪(＾∀＾●)ﾉ，请您稍后再来试一下吧(❤´艸｀❤)!'
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
    var t = req.query.type || req.body.type;
    var w = req.query.w || req.body.w || '1920';
    var h = req.query.h || req.body.h || '1080';
    var size = w + 'x' + h;
    var callback = req.query.callback || req.body.callback;
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
                        data['url'] = 'https://static.ioliu.cn/bing/' + data.qiniu_url + '_' + size + '.jpg';
                    }
                    if (t === 'json' || !!callback) {
                        //console.log(callback);
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
                        var qiniu_url = /static\.ioliu\.cn/.test(data.url) ? data.url : qiniuUtils.imageView(data.qiniu_url, w, h);
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


/**
 * 获取高斯模糊图片
 */
router.get('/blur', function(req, res, next) {
    blur(req, res, next);
});
router.post('/blur', function(req, res, next) {
    blur(req, res, next);
});

var blur = function(req, res, next) {
    var d = req.query.d || req.body.d;
    var w = req.query.w || req.body.w;
    var h = req.query.h || req.body.h;
    var r = req.query.r || req.body.r;
    r = isNaN(r) ? 10 : parseInt(r) > 50 ? 50 : parseInt(r) <= 0 ? 1 : r;
    var size = w + 'x' + h;
    var enddate = 0;
    if (!isNaN(d)) {
        var date = new Date().getTime() - parseInt(d) * 1000 * 60 * 60 * 24;
        var newDate = new Date(date);
        enddate = newDate.getFullYear() + '' + ((newDate.getMonth() + 1) > 9 ? (newDate.getMonth() + 1) : '0' + (newDate.getMonth() + 1)) + '' + (newDate.getDate() > 9 ? newDate.getDate() : '0' + newDate.getDate());
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
    dbUtils.get('bing', params, function(rows) {
        if (rows.length > 0) {
            var data = rows[0];
            var base = 'https://static.ioliu.cn/bing/';
            if (resolutions.indexOf(size) > -1) {
                data['url'] = base + data.qiniu_url + '_' + size + '.jpg';
            }
            var qiniu_url = /static\.ioliu\.cn/.test(data.url) ? data.url : base + data.qiniu_url + '_1920x1080.jpg';
            qiniu_url += '?imageMogr2/blur/' + r + 'x50'
            request.get(qiniu_url)
                .set(cookie)
                .end(function(err, response) {
                    res.header('content-type', 'image/jpg');
                    res.send(response.body);
                });
        } else {
            res.json({
                data: {},
                status: {
                    code: -1,
                    message: '好厉害啊，这么隐秘的地方都被你发现了n(*≧▽≦*)n，我已经通知主人咯♪(＾∀＾●)ﾉ，请您稍后再来试一下吧(❤´艸｀❤)!'
                }
            });
        }
    });
}

module.exports = router;