var request = require('superagent');
var moment = require('moment');
var bingUtils = require('./bingUtils');
var commonUtils = require('./commonUtils');
var dbUtils = require('./dbUtils');
var fs = require('fs');
var weibo = require('../configs/config').weibo;
var mailUtils = require('./mailUtils');
var cookie = { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.71 Safari/537.36' };
var update_url_text = 'https://api.weibo.com/2/statuses/upload_url_text.json';
var share = 'https://api.weibo.com/2/statuses/share.json';
module.exports = {
    /**
     * 发送微博
     * @callback
     * @isAuto 是否自动发送(true,false)
     */
    update: function(callback, isAuto) {
        // 查询数据库中是否存在今天的新数据
        dbUtils.get('bing', {
            weibo: 0,
            enddate: moment().format('YYYYMMDD')
        }, function(rows) {
            if (rows.length === 0) {} else {
                // 如果存在，但没有发送微博
                var data = rows[0];
                module.exports.commonSend(data, callback, isAuto);
            }
        });




    },
    /**
     * 获取短链
     */
    shorten: function(url, callback) {
        module.exports.checkOauth(function(token) {
            request
                .post('https://api.weibo.com/2/short_url/shorten.json')
                .type('form')
                .set(cookie)
                .send({
                    access_token: token,
                    url_long: url
                })
                .end(function(err, res) {
                    commonUtils.convert(err, res, callback);
                });
        });
    },
    /**
     * 公共发送微博方法
     */
    commonSend: function(data, callback, isAuto) {
        module.exports.checkOauth(function(token) {
            var date = data.enddate;
            var y = date.substr(0, 4);
            var m = date.substr(4, 2);
            var d = date.substr(6, 2);
            var full = y + '-' + m + '-' + d;
            var post = {};
            if (data.title && data.description && data.mkt.indexOf('zh-cn') > -1) {
                var status = ('#必应壁纸# ' + full + ' / #' + data.title + '# ' + data.description).slice(0, 138) + `... http://bing.ioliu.cn/photo/${data.qiniu_url}?from=weibo`;
                post = {
                    access_token: token,
                    status: status,
                    //url: data.url,
                    lat: data.latitude,
                    long: data.longitude,
                    annotations: {
                        place: {
                            title: data.title,
                            url: data.copyrightlink,
                            locality: data.city,
                            country_name: data.country,
                            region: data.country,
                            latitude: data.latitude,
                            longitude: data.longitude
                        }
                    }
                };
            } else {
                var status = '#Bing Picture# ' + full + ' / ' + data.copyright + ` from ${data.mkt} http://bing.ioliu.cn/photo/${data.qiniu_url}?from=weibo`;
                post = {
                    access_token: token,
                    status: status,
                    //url: data.url,
                    annotations: {
                        place: {
                            title: data.copyright,
                        }
                    }
                };
            }
            request
                .post(share)
                .type('form')
                .set(cookie)
                .send(post)
                .end(function(err, response) {
                    if (err) {
                        console.log(err)
                        return;
                    }
                    commonUtils.convert(err, response, function(body) {
                        data['weibo'] = 1;
                        // data['thumbnail_pic'] = body.thumbnail_pic;
                        // data['bmiddle_pic'] = body.bmiddle_pic;
                        // data['original_pic'] = body.original_pic;
                        dbUtils.update('bing', {
                            body: {
                                weibo: 1,
                                // thumbnail_pic: data.thumbnail_pic,
                                // bmiddle_pic: data.bmiddle_pic,
                                // original_pic: data.original_pic
                            },
                            condition: {
                                id: data.id
                            }
                        }, function(rows) {
                            callback && callback(body);
                        });
                    });
                });
            // module.exports.fetchToLocal(data.url, function(bb) {
            //     //post['pic'] = bb.toString('base64');


            // })
        }, isAuto);

    },
    /**
     * 检查授权
     * @callback
     * @isAuto 是否自动发送(true/false)
     */
    checkOauth: function(callback, isAuto) {
        var uid = !!weibo.USER_UID ? weibo.USER_UID : weibo.MASTER_UID;
        if (isAuto) {
            uid = weibo.MASTER_UID;
        }
        dbUtils.get('bing_session', {
            body: {
                uid: uid
            }
        }, function(rows) {
            if (rows.length === 0) {
                callback && callback(-1);
            } else {
                callback && callback(rows[0].token);
            }
        })
    },

    fetchToLocal: function(url, callback) {
        let name = Math.random().toString(36).substr(2, 15);
        const stream = fs.createWriteStream('./' + name + '.jpg');
        request.get(url).set(cookie).end(function(err, response) {
            callback && callback(response.body);
        });
    }
}