var fs = require('fs');
module.exports = {
    base64_encode: function(path) {
        var bitmap = fs.readFileSync(path);
        return new Buffer(bitmap).toString('base64');
    }
};