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
var weiboUtils = require('./utils/weiboUtils');
var bingUtils = require('./utils/bingUtils');
var dbUtils = require('./utils/dbUtils');
var mailUtils = require('./utils/mailUtils');

// 每天0点59抓取
schedule.scheduleJob('0 59 0 * * *', function() {
    bingUtils.fetchPicture({}, function(data) {
        dbUtils.set('bing', data, function(rows) {
            data.id = rows.insertId || 0;
            mailUtils.send({
                message: 'success!',
                stack: JSON.stringify(data, '', 4)
            });
        })
    });
});
// 每天6:59,10:59,14:59,18:59 发送微博
schedule.scheduleJob('0 20 6,11,14,18 * * *', function() {
    weiboUtils.update(function(data) {
        if (data && data.id) {
            mailUtils.send({
                message: 'success!',
                stack: JSON.stringify(data, '', 4)
            });
        } else {
            mailUtils.send({
                message: 'some error!',
                stack: JSON.stringify(data, '', 4)
            });
        }
    }, true);
});
var counter = 1;
var t = schedule.scheduleJob('* * * * * *', function() {
    console.log(new Date().toLocaleString() + ' 调用 ' + counter++)
});
setTimeout(function() {
    t.cancel();
}, 3000);
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