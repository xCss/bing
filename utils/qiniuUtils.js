var qiniu = require('qiniu');
// access_key and secret_key
qiniu.config.ACCESS_KEY = process.env.qiniu_access_key;
qiniu.config.SECRET_KEY = process.env.qiniu_secret_key;

// 上传的空间
var bucket = 'ioliu';

// 目前已知的分辨率
var resolutions = [
    '1920x1200',
    '1920x1080',
    '1366x768',
    '1280x768',
    '1024x768',
    '800x600',
    '800x480',
    '768x1280',
    '720x1280',
    '640x480',
    '480x800',
    '400x240',
    '320x240',
    '240x320'
];

module.exports = {
    /**
     * 上传到骑牛
     * @param imgUrl 远程图片地址
     * @param callback
     */
    fetchToQiniu: function(imgURL, callback) {
        var client = new qiniu.rs.Client();
        for (var i = 0, len = resolutions.length; i < len; i++) {
            var _temp = resolutions[i];
            var remoteURL = imgURL.replace('1920x1080', _temp);
            var imgName = 'bing/' + imgURL.substr(imgURL.lastIndexOf('/') + 1, imgURL.length);
            client.fetch(remoteURL, bucket, imgName, function(err, ret) {
                if (!err) {
                    console.log(ret);
                } else {
                    console.log(err);
                }
            });
        }
        callback && callback();
    }
};