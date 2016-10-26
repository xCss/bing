var mailUtils = require('./mailUtils');
module.exports = {
    /**
     * 公共转换函数
     * @err         错误信息
     * @res         响应信息
     * @callback    回调函数
     */
    convert: function(err, res, callback) {
        try {
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
                if (body.result && body.error_code && body.error) {
                    throw new Error(body);
                } else {
                    callback && callback(body);
                }
            }
        } catch (error) {
            // send mail
            console.log(error);
        }
    }
}