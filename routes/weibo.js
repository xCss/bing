var router = require('express').Router(),
    passport = require('passport'),
    WeiboStrategy = require('passport-weibo').Strategy,
    request = require('superagent'),
    weibo = require('../configs/config').weibo;

// passport 组件所需要实现的接口
passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    //console.log(done);
    done(null, obj);
});

// passport 的 WeiboStrategy 所必须设置的参数
passport.use(new WeiboStrategy({
    clientID: weibo.CLIENT_ID,
    clientSecret: weibo.CLIENT_SECRET,
    forcelogin: true,
    callbackURL: 'http://127.0.0.1:3000/weibo/callback'
}, function(accessToken, refreshToken, profile, done) {
    process.nextTick(function() {
        // 此处在服务端存储 ACCESSTOKEN 是为了后续发送微博所需要的必要参数
        weibo.USER_UID = profile.id;
        profile.id === weibo.MASTER_UID ? weibo.MASTER_ACCESS_TOKEN = accessToken : '';
        weibo.ACCESS_TOKEN = accessToken;
        //console.log(done.cookie());
        return done(null, profile);
    });
}));


router.get('/', passport.authenticate('weibo'), function(req, res) {
    console.log(res.cookie());
});

router.get('/callback', passport.authenticate('weibo', {
    failureRedirect: '/'
}), function(req, res, next) {
    //console.log(res.cookie());
    var at = req.signedCookies.at;
    if (!!at) {
        var uid = at.split('_')[0];
        var accessToken = at.split('_')[1];
        (!weibo.MASTER_ACCESS_TOKEN && uid === weibo.MASTER_UID) ? weibo.MASTER_ACCESS_TOKEN = accessToken: '';
        res.redirect('/');
    } else {
        // request.post('https://api.weibo.com/oauth2/get_token_info', {
        //     form: {
        //         access_token: weibo.ACCESS_TOKEN
        //     }
        // }, function(err, response, body) {
        //     if (!err) {
        //         body = JSON.parse(body);
        //         body.uid === weibo.MASTER_UID ? weibo.MASTER_ACCESS_TOKEN = weibo.ACCESS_TOKEN : '';
        //         res.cookie('at', body.uid + '_' + weibo.ACCESS_TOKEN, { signed: true, maxAge: body.expire_in });
        //         res.redirect('/');
        //     }
        // });
        request
            .post('https://api.weibo.com/oauth2/get_token_info')
            .send({ access_token: weibo.ACCESS_TOKEN })
            .end(function(err, response) {
                if (!err) {
                    res.send(response.body);
                }
            });
    }
});

router.get('/upload', function(req, res) {
    var url = req.query.url;
    request.get(url)
        .end(function(err, response) {
            if (!err) {
                var base64 = new Buffer(response.body, 'binary').toString('base64');
                request
                    .post('http://picupload.service.weibo.com/interface/pic_upload.php?mime=image%2Fjpeg&data=base64&url=0&markpos=1&logo=&nick=0&marks=1&app=miniblog&s=json')
                    .set({
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.71 Safari/537.36',
                        'cookie': weibo.MASTER_COOKIES
                    })
                    .type('form')
                    .send({ b64_data: base64 })
                    .end(function(error, resp) {
                        //res.send(resp)
                        if (!error && resp.status === 200) {
                            var text = resp.text.substring(resp.text.indexOf('{'));
                            res.send(text);
                        } else {
                            console.log(error);
                        }
                    });
            } else {
                console.log(err);
            }
        });

});


router.get('/send', function(req, res) {
    var url = 'https://api.weibo.com/2/statuses/upload_url_text.json';
    var post = {
        access_token: weibo.MASTER_ACCESS_TOKEN || weibo.ACCESS_TOKEN,
        status: encodeURIComponent('#必应壁纸# 2016-10-22 / #“受伤”的圣山# 这个有着巨大红色“伤疤”的山，是塔拉韦拉火山。它原是19世纪一个有传奇色彩的旅游胜地，世界各地的游客都来此一睹著名的粉红与白矽土台阶地。可这一切都毁在了1886年的那次火山爆发。现在您可以散步、徒步、搭直升机或乘坐四轮驱动'),
        url: 'http://s.cn.bing.net/az/hprichbg/rb/MountTarawera_ZH-CN9325208378_1920x1080.jpg'
    };
    request.post({ url: url, formData: post }, function(err, response, body) {
        console.log(body);
        res.send(body);
    });
});

module.exports = router;