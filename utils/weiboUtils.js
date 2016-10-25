var request = require('superagent');
var bingUtils = require('./bingUtils');
var weibo = require('../configs/config').weibo;
var cookie = { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.71 Safari/537.36' };
module.exports = {
    update: function(req, res, next, weibo) {
        bingUtils.fetchPicture({}, function(data) {
            var date = new Date();
            var y = date.getFullYear();
            var m = Number(date.getMonth()) + 1 < 10 ? '0' + (Number(date.getMonth()) + 1) : Number(date.getMonth()) + 1;
            var d = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
            var full = y + '-' + m + '-' + d;
            if (Object.prototype.toString.call(weibo) === '[object Object]') {
                var url = 'https://api.weibo.com/2/statuses/upload_url_text.json';
                var status = ('#必应壁纸# ' + full + ' / #' + data.title + '# ' + data.para1).slice(0, 138) + '... http://t.cn/RVYI2dT';

                var post = {
                    access_token: weibo.MASTER_ACCESS_TOKEN,
                    status: status,
                    url: data.url,
                    lat: data.Latitude,
                    long: data.Longitude,
                    annotations: {
                        place: {
                            title: data.attribute,
                            url: data.copyright,
                            locality: data.City,
                            country_name: data.Country,
                            region: data.Country,
                            latitude: data.Latitude,
                            longitude: data.Longitude
                        }
                    }
                };
                request
                    .post(url)
                    .type('form')
                    .set(cookie)
                    .send(post)
                    .end(function(err, response) {
                        res.json(response.text || response.body);
                    });
            }
            //res.send(data);
        });


    },
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
                bingUtils.convert(err, res, callback);
            });
    }
}