var request = require('superagent');
var objectAssign = require('object-assign');
var commonUtils = require('./commonUtils');
var bingURL = 'http://www.bing.com/HPImageArchive.aspx';
var story = 'http://cn.bing.com/cnhp/coverstory/';
var cookie = { 'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.71 Safari/537.36' };
module.exports = {
    /**
     * 获取 当日Bing图片
     */
    fetchPicture: function(options, callback) {
        var defaultOptions = {
            ids: 0,
            n: 1,
            format: 'js'
        };
        if (Object.prototype.toString.call(options) === '[object Object]') {
            // 合并对象
            defaultOptions = objectAssign(defaultOptions, options);
        } else {
            callback = options;
        }
        request
            .get(bingURL)
            .set(cookie)
            .query(defaultOptions)
            .end(function(err, res) {
                commonUtils.convert(err, res, function(data) {
                    for (var i in data['images']) {
                        images = data['images'][i];
                        module.exports.fetchStory({
                            d: images['enddate']
                        }, function(data) {
                            data = objectAssign(images, data);
                            var newData = {
                                startdate: data.startdate,
                                fullstartdate: data.fullstartdate,
                                enddate: data.enddate,
                                url: data.url,
                                urlbase: data.urlbase,
                                copyright: data.copyright,
                                copyrightlink: data.copyrightlink,
                                hsh: data.hsh,
                                title: data.title,
                                description: data.para1 || data.para2,
                                attribute: data.attribute,
                                country: data.Country,
                                city: data.City,
                                longitude: data.Longitude,
                                latitude: data.Latitude,
                                continent: data.Continent
                            }
                            callback && callback(newData);
                        });
                    }
                });
            });
    },
    /**
     * 获取 当前Bing返回的所有图片集合
     */
    fetchPictures: function(callback) {
        var options = {
            ids: 14,
            n: 100
        };
        module.exports.fetchPicture(options, callback);
    },
    /**
     * 获取 每日故事(默认当日)
     * 
     * 若需要查询指定日期：
     * options = {
     *      d:20161015
     * }
     */
    fetchStory: function(options, callback) {
        request
            .get(story)
            .set(cookie)
            .query(options)
            .end(function(err, res) {
                commonUtils.convert(err, res, function(data) {
                    callback && callback(data);
                });
            });
    }
};