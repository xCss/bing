var router = require('express').Router(),
    passport = require('passport'),
    WeiboStrategy = require('passport-weibo').Strategy,
    request = require('superagent'),
    weibo = require('../configs/config').weibo,
    weiboUtils = require('../utils/weiboUtils');
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
        return done(null, profile);
    });
}));
router.get('/', passport.authenticate('weibo'), function(req, res) {});
router.get('/callback', passport.authenticate('weibo', {
    failureRedirect: '/'
}), function(req, res, next) {
    req.session.weibo = weibo;
    //console.log(req.cookies);
    res.redirect('/weibo/send');
});
router.get('/upload', function(req, res) {
    var url = req.query.url;
    request.get(url).end(function(err, response) {
        if (!err) {
            var base64 = new Buffer(response.body, 'binary').toString('base64');
            request
                .post('http://picupload.service.weibo.com/interface/pic_upload.php?mime=image%2Fjpeg&data=base64&url=0&markpos=1&logo=&nick=0&marks=1&app=miniblog&s=json')
                .set({
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.71 Safari/537.36',
                    'cookie': weibo.MASTER_COOKIES
                }).type('form').send({
                    b64_data: base64
                }).end(function(error, resp) {
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
        access_token: req.session['weibo'].ACCESS_TOKEN,
        status: '#必应壁纸# 2016-10-24 / #“蛇行”的国王河# 从上空俯瞰澳大利亚温德姆，这里有一条像蛇一样弯曲着的河流——国王河。“蛇的身体”还伸出许多“触角”，那些是国王河数不清的支流，又仿佛河流的穿行让大地都龟裂了一般。河道两侧都被郁郁葱葱的植物包裹...',
        url: 'http://s.cn.bing.net/az/hprichbg/rb/KingRiver_ZH-CN12008036815_1920x1080.jpg'
    };
    request.post(url).type('form').set({
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.71 Safari/537.36'
    }).send(post).end(function(err, response) {
        res.json(response);
    });
});
router.get('/login', function(req, res) {
    weiboUtils.login();
});
module.exports = router;