var request = require('superagent');
var bingUtils = require('./bingUtils');
var commonUtils = require('./commonUtils');
var dbUtils = require('./dbUtils');
var weibo = require('../configs/config').weibo;
var mailUtils = require('./mailUtils');
var cookie = { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.71 Safari/537.36' };
var update_url_text = 'https://api.weibo.com/2/statuses/upload_url_text.json';
module.exports = {
    /**
     * 发送微博
     * @callback
     * @isAuto 是否自动发送(true,false)
     */
    update: function(callback, isAuto) {
        var date = new Date();
        var y = date.getFullYear();
        var m = Number(date.getMonth()) + 1 < 10 ? '0' + (Number(date.getMonth()) + 1) : Number(date.getMonth()) + 1;
        var d = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
        var full = y + '-' + m + '-' + d;
        // 查询数据库中是否存在今天的新数据
        dbUtils.get('bing', {
            enddate: full.replace(/\-/g, '')
        }, function(rows) {
            if (rows.length === 0) {
                // 如果不存在则抓取
                bingUtils.fetchPicture({}, function(data) {
                    dbUtils.set('bing', data, function(rows) {
                        data.id = rows.insertId || 0;
                        module.exports.commonSend(data, callback, isAuto);
                    })
                });
            } else {
                // 如果存在，但没有发送微博
                var data = rows[0];
                if (data.weibo == 0) {
                    // 如果少了某个字段
                    if (!data.title || !data.attribute || !data.description || !data.thumbnail_pic) {
                        bingUtils.fetchStory({
                            enddate: data.enddate
                        }, function(body) {
                            data['title'] = body.title;
                            data['attribute'] = body.attribute;
                            data['description'] = body.description;
                            data['country'] = body.country;
                            data['city'] = body.city;
                            data['longitude'] = body.longitude;
                            data['latitude'] = body.latitude;
                            data['continent'] = body.continent;
                            module.exports.commonSend(data, callback, isAuto);
                        });
                    } else {
                        module.exports.commonSend(data, callback, isAuto);
                    }
                } else {
                    // 如果已发送则查询上一条是否已发送
                    dbUtils.get('bing', {
                        weibo: 0
                    }, function(rs) {
                        var d = rs[0];
                        // 如果少了某个字段
                        if (!d.title || !d.attribute || !d.description || !d.thumbnail_pic) {
                            bingUtils.fetchStory({
                                d: d.enddate
                            }, function(body) {
                                d['url'] = body.url || 'http://7xilig.com1.z0.glb.clouddn.com/bing/' + body.qiniu_url + '_1920x1080.jpg',
                                    d['title'] = body.title;
                                d['attribute'] = body.attribute;
                                d['description'] = body.description;
                                d['country'] = body.country;
                                d['city'] = body.city;
                                d['longitude'] = body.longitude;
                                d['latitude'] = body.latitude;
                                d['continent'] = body.continent;
                                module.exports.commonSend(d, callback, isAuto);
                            });
                        } else {
                            module.exports.commonSend(d, callback, isAuto);
                        }
                    })

                }
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
    commonSend: function(data, callback) {
        module.exports.checkOauth(function(token) {
            var date = data.enddate;
            var y = date.substr(0, 4);
            var m = date.substr(4, 2);
            var d = date.substr(6, 2);
            var full = y + '-' + m + '-' + d;
            var status = ('#必应壁纸# ' + full + ' / #' + data.title + '# ' + data.description).slice(0, 138) + '... http://bing.ioliu.cn?id=' + data.id;
            var post = {
                access_token: token,
                status: status,
                url: data.url,
                lat: data.Latitude,
                long: data.Longitude,
                annotations: {
                    place: {
                        title: data.attribute,
                        url: data.copyright,
                        locality: data.city,
                        country_name: data.country,
                        region: data.country,
                        latitude: data.catitude,
                        longitude: data.congitude
                    }
                }
            };
            request
                .post(update_url_text)
                .type('form')
                .set(cookie)
                .send(post)
                .end(function(err, response) {
                    commonUtils.convert(err, response, function(body) {
                        data['weibo'] = 1;
                        data['thumbnail_pic'] = body.thumbnail_pic;
                        data['bmiddle_pic'] = body.bmiddle_pic;
                        data['original_pic'] = body.original_pic;
                        dbUtils.update('bing', {
                            body: {
                                title: data.title,
                                description: data.description,
                                attribute: data.attribute,
                                country: data.country,
                                city: data.city,
                                longitude: data.longitude,
                                latitude: data.latitude,
                                continent: data.continent,
                                weibo: 1,
                                thumbnail_pic: data.thumbnail_pic,
                                bmiddle_pic: data.bmiddle_pic,
                                original_pic: data.original_pic
                            },
                            condition: {
                                id: data.id
                            }
                        }, function(rows) {
                            callback && callback(body);
                        });
                    });
                });
        });

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
    }
}