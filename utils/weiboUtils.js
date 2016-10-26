var request = require('superagent');
var bingUtils = require('./bingUtils');
var commonUtils = require('./commonUtils');
var dbUtils = require('./dbUtils');
var weibo = require('../configs/config').weibo;
var cookie = { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.71 Safari/537.36' };
var update_url_text = 'https://api.weibo.com/2/statuses/upload_url_text.json';
module.exports = {
    /**
     * 发送微博
     * @state   状态:0-自动,1-手动
     * @callback
     */
    update: function(state, callback) {
        //检查授权
        module.exports.checkOauth(state, function(token) {
            var date = new Date();
            var y = date.getFullYear();
            var m = Number(date.getMonth()) + 1 < 10 ? '0' + (Number(date.getMonth()) + 1) : Number(date.getMonth()) + 1;
            var d = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
            var full = y + '-' + m + '-' + d;
            // 查询数据库中是否存在今天的新数据
            dbUtils.get('bing', {
                enddate: full.replace(/\-/g, '')
            }, function(rows) {
                // 如果不存在则抓取
                if (rows.length === 0) {
                    bingUtils.fetchPicture({}, function(data) {
                        module.exports.commonSend(token, data, callback);
                    });
                } else {
                    // 如果存在，但没有发送微博
                    var data = rows[0];
                    if (data.weibo == 0) {
                        // 如果少了某个字段
                        if (!data.title || !data.attribute || !data.description) {
                            bingUtils.fetchStory({
                                enddate: full.replace(/\-/, '')
                            }, function(body) {
                                data['title'] = body.title;
                                data['attribute'] = body.attribute;
                                data['description'] = body.description;
                                data['country'] = body.country;
                                data['city'] = body.city;
                                data['longitude'] = body.longitude;
                                data['latitude'] = body.latitude;
                                data['continent'] = body.continent;\
                                module.exports.commonSend(data, callback);
                            });
                        } else {
                            module.exports.commonSend(token, data, callback);
                        }

                    }
                }
            });
        });




    },
    /**
     * 获取短链
     */
    shorten: function(url, callback) {
        request
            .post('https://api.weibo.com/2/short_url/shorten.json')
            .type('form')
            .set(cookie)
            .send({
                access_token: weibo.ACCESS_TOKEN,
                url_long: url
            })
            .end(function(err, res) {
                commonUtils.convert(err, res, callback);
            });
    },
    /**
     * 公共发送微博方法
     */
    commonSend: function(token, data, callback) {
        var date = new Date();
        var y = date.getFullYear();
        var m = Number(date.getMonth()) + 1 < 10 ? '0' + (Number(date.getMonth()) + 1) : Number(date.getMonth()) + 1;
        var d = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
        var full = y + '-' + m + '-' + d;
        var status = ('#必应壁纸# ' + full + ' / #' + data.title + '# ' + data.description).slice(0, 138) + '... http://t.cn/RVYI2dT';
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
                    callback && callback(data);
                });
            });
    },
    /**
     * 检查授权
     * @state   状态:0-自动,1-手动
     * @callback
     */
    checkOauth: function(state, callback) {
        var uid = state == 0 ? weibo.MASTER_UID : weibo.USER_UID;
        dbUtils.get('bing_session', {
            body: {
                uid: uid
            }
        }, function(rows) {
            if (rows.length === 0) {
                console.log('请先登录或者授权！');
            } else {
                callback && callback(rows[0].token);
            }
        })
    }
}