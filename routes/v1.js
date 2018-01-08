var express = require('express');
var request = require('superagent');
var dbUtils = require('../utils/dbUtils');
var qiniuUtils = require('../utils/qiniuUtils');
var config = require('../configs/config');
var cookie = { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.71 Safari/537.36' };
var CDN = 'http://h1.ioliu.cn/bing/';
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
    var w = req.query.w || req.body.w || '1366';
    var h = req.query.h || req.body.h || '768';
    var t = req.query.type || req.body.type;
    var size = w + 'x' + h;
    var cb = req.query.callback;
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
        body: `mkt like '%zh-cn%'`
    };
    if (!!enddate) {
        params['body'] = `mkt like '%zh-cn%' and enddate='${enddate}'`
    }
    dbUtils.get('bing', params, function(rows) {
        if (rows.length > 0) {
            var data = rows[0];
            if (t === 'json' || !!cb) {
                var output = {
                    data: {
                        enddate: data.enddate,
                        url: data.url,
                        bmiddle_pic: data.bmiddle_pic,
                        original_pic: data.original_pic,
                        thumbnail_pic: data.thumbnail_pic,
                    },
                    status: {
                        code: 200,
                        message: ''
                    }
                };
                if (cb) {
                    res.jsonp(output);
                } else {
                    res.json(output);
                }
            } else {

                if (config.resolutions.indexOf(size) === -1) {
                    data['url'] = qiniuUtils.imageView(data.qiniu_url, w, h);
                } else {
                    data['url'] = CDN + data.qiniu_url + '_' + size + '.jpg';
                }
                request.get(data['url'])
                    .set({
                        'user-agent': req.headers['user-agent'],
                        'referer': req.headers['host']
                    })
                    .end(function(err, response) {
                        if (err) {
                            res.send({
                                data: {},
                                status: {
                                    code: err.status,
                                    message: err.status == 404 ? 'Did not find this picture, please try another resolution' : (response && response.text || '')
                                }
                            })
                        } else {
                            res.header('content-type', 'image/jpg');
                            res.send(response.body);
                        }
                    });
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
    var w = req.query.w || req.body.w || '1366';
    var h = req.query.h || req.body.h || '768';
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
                    if (t === 'json' || !!callback) {
                        var output = {
                            data: {
                                enddate: data.enddate,
                                url: data.url,
                                bmiddle_pic: data.bmiddle_pic,
                                original_pic: data.original_pic,
                                thumbnail_pic: data.thumbnail_pic,
                            },
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
                        var data = rs[0];
                        if (config.resolutions.indexOf(size) === -1) {
                            data['url'] = qiniuUtils.imageView(data.qiniu_url, w, h);
                        } else {
                            data['url'] =  CDN + data.qiniu_url + '_' + size + '.jpg';
                        }
                        request.get(data['url'])
                            .set({
                                'user-agent': req.headers['user-agent'],
                                'referer': req.headers['host']
                            })
                            .end(function(err, response) {
                                if (err) {
                                    res.send({
                                        data: {},
                                        status: {
                                            code: err.status,
                                            message: err.status == 404 ? 'Did not find this picture, please try another resolution' : (response && response.text || '')
                                        }
                                    })
                                } else {
                                    res.header('content-type', 'image/jpg');
                                    res.send(response.body);
                                }
                            });
                    }
                } else {
                    var parmas = '?';
                    params += !!t ? '&t=' + t : '';
                    params += !!w ? '&w=' + w : '';
                    params += !!h ? '&h=' + h : '';
                    params += !!callback ? '&callback=' + callback : '';
                    res.redirect('/v1/rand' + params);
                }
            });
        } else {
            var parmas = '?';
            params += !!t ? '&t=' + t : '';
            params += !!w ? '&w=' + w : '';
            params += !!h ? '&h=' + h : '';
            params += !!callback ? '&callback=' + callback : '';
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
    var w = req.query.w || req.body.w || 1366;
    var h = req.query.h || req.body.h || 768;
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
        body: `mkt like '%zh-cn%'`
    };
    if (!!enddate) {
        params['body'] = `mkt like '%zh-cn%' and enddate='${enddate}'`
    }
    dbUtils.get('bing', params, function(rows) {
        if (rows.length > 0) {
            var data = rows[0];
            if (config.resolutions.indexOf(size) > -1) {
                data['url'] = CDN + data.qiniu_url + '_' + size + '.jpg';
            }
            var qiniu_url = /^(http|https)/.test(data.url) ? data.url : CDN + data.qiniu_url + '_1920x1080.jpg';
            qiniu_url += '?imageMogr2/blur/' + r + 'x50'
            request.get(qiniu_url)
                .set({
                    'user-agent': req.headers['user-agent'],
                    'referer': req.headers['host']
                })
                .end(function(err, response) {
                    if (err) {
                        res.send({
                            data: {},
                            status: {
                                code: err.status,
                                message: err.status == 404 ? 'Did not find this picture, please try another resolution' : (response && response.text || '')
                            }
                        })
                    } else {
                        res.header('content-type', 'image/jpg');
                        res.send(response.body);
                    }
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