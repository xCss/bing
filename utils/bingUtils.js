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
                        var images = data['images'][i];
                        module.exports.fetchStory({
                            d: images['enddate']
                        }, function(data) {
                            data = objectAssign(images, data);
                            var newData = {
                                startdate: data.startdate,
                                fullstartdate: data.fullstartdate,
                                enddate: data.enddate,
                                url: /(http|https)\:\/\//gi.test(data.url) ? data.url : 'http://s.cn.bing.net' + data.url,
                                urlbase: data.urlbase,
                                copyright: data.copyright,
                                copyrightlink: data.copyrightlink,
                                hsh: data.hsh,
                                title: data.title,
                                description: data.description,
                                attribute: data.attribute,
                                country: data.country,
                                city: data.city,
                                longitude: data.longitude,
                                latitude: data.latitude,
                                continent: data.continent
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
        if (Object.prototype.toString.call(options) === '[object Function]') {
            callback = options;
            options = {};
        }
        request
            .get(story)
            .set(cookie)
            .query(options)
            .end(function(err, res) {
                commonUtils.convert(err, res, function(data) {
                    data['description'] = data.para1 || data.para2 || '';
                    data['country'] = data.Country || '';
                    data['city'] = data.City || '';
                    data['longitude'] = data.Longitude || '';
                    data['latitude'] = data.Latitude || '';
                    data['continent'] = data.Continent || '';
                    callback && callback(data);
                });
            });
    }
};