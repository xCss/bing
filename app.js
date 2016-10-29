var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var request = require('superagent');
var session = require('express-session');
var index = require('./routes/index');
var weibo = require('./routes/weibo');
// 设置与安全相关的HTTP头的中间件
var helmet = require('helmet');
// express的消息提示中间件
var flash = require('express-flash');

// 定时器
var schedule = require('node-schedule');

// 各种工具类
var dbUtils = require('./utils/dbUtils');
var bingUtils = require('./utils/bingUtils');
var mailUtils = require('./utils/mailUtils');
var qiniuUtils = require('./utils/qiniuUtils');
var weiboUtils = require('./utils/weiboUtils');

// 每天 0:30 从Bing抓取数据
schedule.scheduleJob('0 30 0 * * *', function() {
    bingUtils.fetchPicture({}, function(data) {
        dbUtils.set('bing', data, function(rows) {
            data.id = rows.insertId || 0;
            mailUtils.send({
                message: '从Bing抓取成功',
                title: '从Bing抓取成功',
                stack: JSON.stringify(data, '', 4)
            });
        })
    });
});
// 每天 6:30,12:30,18:30 发送微博
schedule.scheduleJob('0 30 6,12,18 * * *', function() {
    weiboUtils.update(function(data) {
        if (data && data.id) {
            mailUtils.send({
                message: '发送微博成功',
                title: '发送到博成功',
                stack: JSON.stringify(data, '', 4)
            });
        } else {
            mailUtils.send({
                message: '发送微博失败',
                title: '发送微博失败',
                stack: JSON.stringify(data, '', 4)
            });
        }
    }, true);
});

// 每隔十分钟检查数据库中是否存在未上传到骑牛的图片，如果存在则上传图片到骑牛
schedule.scheduleJob('0 0,10,20,30,40,50 * * * *', function() {
    dbUtils.get('bing', 'ISNULL(qiniu_url)', function(rows) {
        if (rows.length > 0) {
            var data = rows[0];
            var url = data.url;
            qiniuUtils.fetchToQiniu(url, function() {
                var _temp = url.substr(url.lastIndexOf('/') + 1, url.length);
                var qiniu_url = _temp.substr(0, _temp.lastIndexOf('_'));
                dbUtils.update('bing', {
                    body: {
                        qiniu_url: qiniu_url
                    },
                    condition: {
                        id: data.id
                    }
                }, function(rs) {
                    console.log(rs);
                });
            });
        }
    });
})
var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.enable('trust proxy');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cookieParser('bing.ioliu.cn'));
app.use(session({
    secret: 'bing app', //secret的值建议使用随机字符串
    cookie: {
        secure: true,
        maxAge: 60 * 30 * 1000 // 过期时间（毫秒）
    },
    resave: false,
    saveUninitiarlized: false
}));
// 设置日志
app.use(logger('combined', {
    skip: function(req, res) { return res.statusCode < 400 }
}));
// 启用 helmet 
app.use(helmet());
app.use(flash());
//sass
//app.use(sassMiddleware({
//    src: __dirname
//    , dest: __dirname
//    , sourceMap: false
//    , outputStyle: 'compressed'
//    , debug: true
//}));
app.use('/static', express.static(path.join(__dirname, 'static')));
app.use('/', index);
app.use('/weibo', weibo);
app.get('/test', function(req, res, next) {
    var images = [];
    bingUtils.fetchPicture(function(data) {
        dbUtils.get('bing', data, function(data) {
            res.send(data);
        });
    });
});
// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});
// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}
// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});
module.exports = app;