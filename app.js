var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var sassMiddleware = require('node-sass-middleware');
var request = require('superagent');
var session = require('express-session');
var index = require('./routes/index');
var weibo = require('./routes/weibo');
// 设置与安全相关的HTTP头的中间件
var helmet = require('helmet');
// passport
var passport = require('passport');
// 定时器
var schedule = require('node-schedule');
// express的消息提示中间件
var flash = require('express-flash');
console.log(new Date().toLocaleString());

function scheduleCancel() {
    var counter = 1;
    var t = schedule.scheduleJob('* * * * * *', function() {
        console.log('定时器触发次数：' + counter);
        counter++;
    });
    setTimeout(function() {
        console.log('定时器取消！');
        t.cancel();
    }, 3000);
}
scheduleCancel();
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
app.use(logger('dev'));
// 启用 passport 组件
app.use(passport.initialize());
app.use(passport.session());
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
    var bingUtils = require('./utils/bingUtils');
    var dbUtils = require('./utils/dbUtils');
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