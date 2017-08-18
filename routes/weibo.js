var router = require('express').Router(),
    request = require('superagent'),
    weibo = require('../configs/config').weibo,
    weiboUtils = require('../utils/weiboUtils');
var dbUtils = require('../utils/dbUtils');
var cookie = { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.71 Safari/537.36' };
var redirect_uri = 'http://bing.ioliu.cn/weibo/callback';
/**
 * 微博认证
 */
router.get('/', function(req, res) {
    res.redirect('https://api.weibo.com/oauth2/authorize?client_id=' + weibo.CLIENT_ID + '&redirect_uri=' + redirect_uri);
});

/**
 * 认证回调
 */
router.get('/callback', function(req, res, next) {
    var code = req.query.code;
    request
        .post('https://api.weibo.com/oauth2/access_token')
        .set(cookie)
        .type('form')
        .send({
            client_id: weibo.CLIENT_ID,
            client_secret: weibo.CLIENT_SECRET,
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: redirect_uri
        })
        .end(function(err, response) {
            if (!err && response.status === 200) {
                var text = JSON.parse(response.text);
                dbUtils.get('bing_session', {
                    uid: text.uid
                }, function(rows) {
                    if (rows.length === 0) {
                        dbUtils.set('bing_session', {
                            token: text.access_token,
                            expires_in: text.expires_in,
                            insertdate: Date.now(),
                            uid: text.uid
                        }, function(rows) {
                            if (rows.length > 0) {
                                var data = rows[0];
                                if (data.uid === weibo.MASTER_UID && !weibo.MASTER_ACCESS_TOKEN) {
                                    weibo.MASTER_ACCESS_TOKEN = data.access_token;
                                } else {
                                    weibo.ACCESS_TOKEN = data.access_token;
                                    weibo.USER_UID = data.uid;
                                }
                                req.session['weibo'] = weibo;
                                res.redirect('/');
                            }
                        });
                    } else {
                        var data = rows[0];
                        dbUtils.update('bing_session', {
                            body: {
                                token: text.access_token,
                                expires_in: text.expires_in,
                            },
                            condition: {
                                uid: text.uid
                            }
                        }, function(r) {
                            if (text.uid === weibo.MASTER_UID && !weibo.MASTER_ACCESS_TOKEN) {
                                weibo.MASTER_ACCESS_TOKEN = text.access_token;
                                weibo.ACCESS_TOKEN = text.access_token;
                            } else {
                                weibo.ACCESS_TOKEN = text.access_token;
                                weibo.USER_UID = text.uid;
                            }
                            req.session['weibo'] = weibo;
                            res.redirect('/');
                        });
                    }
                });
            }
        });
});
/**
 * 发送微博
 */
router.get('/send', function(req, res, next) {
    if (req.session && req.session['weibo']) {
        weibo = req.session['weibo'];
    }
    if (weibo.ACCESS_TOKEN === '') {
        res.redirect('/weibo');
    } else {
        weiboUtils.update(function() {
            res.redirect('/');
        });
    }
});
/**
 * 获取短链
 */
router.get('/shorten', function(req, res, next) {
    if (req.session && req.session['weibo']) {
        weibo = req.session['weibo'];
    }
    if (weibo.ACCESS_TOKEN === '') {
        res.redirect('/weibo');
    } else {
        var url = req.query.url;
        weiboUtils.shorten(url, function(data) {
            res.send(data);
        });
    }
});
module.exports = router;