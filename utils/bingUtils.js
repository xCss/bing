var request = require('superagent');
var objectAssign = require('object-assign');
var bingURL = 'http://www.bing.com/HPImageArchive.aspx';
var story = 'http://cn.bing.com/cnhp/coverstory/';
var cookie = { 'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.71 Safari/537.36' };
module.exports = {
    fetchPicInBing: function(options) {
        var defaultOptions = {
            ids: 0,
            n: 1,
            callback: null
        };
        // 合并对象
        defaultOptions = objectAssign(defaultOptions, options);
        // 获取Bing图片(默认当日)
        request
            .get(bingURL)
            .set(cookie)
            .query(defaultOptions)
            .end(function(err, res) {
                if (!err && res.status === 200) {
                    var body = null;
                    if (res && res.text) {
                        body = res.text
                    } else if (res && res.body) {
                        body = res.body
                    } else {
                        body = {};
                    }
                    if (typeof body === 'string') {
                        try {
                            body = JSON.parse(body);
                        } catch (error) {
                            // send mail coming soon
                            console.log(error);
                        }
                    }
                    body = body['images'][0];
                    request
                        .get(story)
                        .set(cookie)
                        .query(options)
                        .end(function(err, res) {
                            if (!err && res.status === 200) {
                                var text = null;
                                if (res && res.text) {
                                    text = res.text
                                } else if (res && res.body) {
                                    text = res.body
                                } else {
                                    text = {};
                                }
                                if (typeof text === 'string') {
                                    try {
                                        text = JSON.parse(text);
                                    } catch (error) {
                                        // send mail coming soon
                                        console.log(error);
                                    }
                                }
                            }
                        });
                }
            });
    }
};