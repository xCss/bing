var request = require('superagent');
var objectAssign = require('object-assign');
var bingURL = 'http://www.bing.com/HPImageArchive.aspx';
var story = 'http://cn.bing.com/cnhp/coverstory/';
var cookie = { 'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.71 Safari/537.36' };
module.exports = {
    fetchPicture: function(options, callback) {
        var defaultOptions = {
            ids: 0,
            n: 1,
            format: 'js'
        };
        // 合并对象
        defaultOptions = objectAssign(defaultOptions, options);
        // 获取Bing图片(默认当日)
        request
            .get(bingURL)
            .set(cookie)
            .query(defaultOptions)
            .end(function(err, res) {
                module.exports.convert(err, res, function(data) {
                    var images = data['images'][0];
                    module.exports.fetchStory({}, function(data) {
                        data = objectAssign(images, data);
                        callback && callback(data);
                    });
                });
            });
    },
    // 获取每日故事(默认当日)
    fetchStory: function(options, callback) {
        request
            .get(story)
            .set(cookie)
            .query(options)
            .end(function(err, res) {
                module.exports.convert(err, res, function(data) {
                    callback && callback(data);
                });
            });
    },
    convert: function(err, res, callback) {
        if (!err && res.status === 200) {
            var body = null;
            if (res && res.text) {
                body = res.text;
            } else if (res && res.body) {
                body = res.body;
            } else {
                body = {}
            }
            if (typeof body === 'string') {
                try {
                    body = JSON.parse(body);
                } catch (error) {
                    console.log(error);
                }
            }
            callback && callback(body);
        }
    }
};