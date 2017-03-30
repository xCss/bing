var express = require('express');
var dbUtils = require('../utils/dbUtils');
var qiniuUtils = require('../utils/qiniuUtils');
var router = express.Router();
/* GET home page. */
router.get('/', function(req, res, next) {
    var no = req.query.p;
    var id = req.query.id;
    no = !!no && Number(no) > 0 ? Number(no) : 1;
    var params = {
        body: '!ISNULL(qiniu_url) || qiniu_url<>""',
        page: {
            no: no,
            size: 18
        }
    };
    dbUtils.getCount('bing', params.body, function(r) {
        var sum = r[0]['sum'] || 0;
        var size = params.page.size;
        if (sum > 0) {
            var page = {
                size: size,
                no: no > Math.ceil(sum / size) ? Math.ceil(sum / size) : no,
                sum: sum,
                next: no + 1 > Math.ceil(sum / size) ? Math.ceil(sum / size) : no + 1,
                prev: no - 1 >= 0 ? ((no - 1) > Math.ceil(sum / size) ? Math.ceil(sum / size) - 1 : no - 1) : 1,
                curr: no <= 1 ? '首页' : '第 ' + no + ' 页'
            };
            params['page'] = page;
            dbUtils.get('bing', params, function(rows) {
                common(req, res, next, page, rows);
            });
        } else {
            var err = new Error('啊( ⊙ o ⊙ )，你发现了新大陆 ∑(っ °Д °;)っ');
            err.status = 404;
            next(err);
        }
    });
});

var common = function(req, res, next, page, rows) {
    if (rows.length > 0) {
        var data = [];
        for (var i in rows) {
            var date = rows[i]['enddate'];
            var y = date.substr(0, 4);
            var m = date.substr(4, 2);
            var d = date.substr(6, 2);
            var full = y + '-' + m + '-' + d;
            data.push({
                id: rows[i]['id'],
                title: rows[i]['title'],
                attribute: rows[i]['attribute'],
                description: rows[i]['description'],
                copyright: rows[i]['copyright'],
                photo: rows[i]['qiniu_url'],
                longitude: rows[i]['longitude'],
                latitude: rows[i]['latitude'],
                city: rows[i]['city'],
                country: rows[i]['country'],
                continent: rows[i]['continent'],
                thumbnail: `https://static.ioliu.cn/bing/${rows[i]['qiniu_url']}_800x600.jpg`,
                smallpic: `https://bing.ioliu.cn/small/${rows[i]['qiniu_url']}_800x600`,
                date: full,
                likes:rows[i]['likes'],
                views:rows[i]['views'],
                downloads:rows[i]['downloads']
            });
        }
        res.render('index', {
            data: data,
            page: page
        });
    } else {
        var err = new Error('啊( ⊙ o ⊙ )，你发现了新大陆 ∑(っ °Д °;)っ');
        err.status = 404;
        next(err);
    }
}
module.exports = router;