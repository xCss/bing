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
            size: 10
        }
    };
    if (!!id && Number(id) > 0) {
        params['body'] = 'id<=' + id;
        dbUtils.get('bing', params, function(rows) {
            var page = {
                prev: 1,
                next: 2,
                curr: rows.length > 0 && rows[0]['title'] || '首页',
                desc: rows.length > 0 && rows[0]['description'] || ''
            };
            common(req, res, next, page, rows);
        });
    } else {
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
    }

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
                startdate: rows[i]['startdate'],
                enddate: rows[i]['enddate'],
                fullstartdate: rows[i]['fullstartdate'],
                url: rows[i]['url'],
                urlbase: rows[i]['urlbase'],
                copyright: rows[i]['copyright'],
                copyrightlink: rows[i]['copyrightlink'],
                hsh: rows[i]['hsh'],
                qiniu_url: rows[i]['qiniu_url'],
                longitude: rows[i]['longitude'],
                latitude: rows[i]['latitude'],
                city: rows[i]['city'],
                country: rows[i]['country'],
                continent: rows[i]['continent'],
                thumbnail: qiniuUtils.imageView(rows[i]['qiniu_url'], 30, 15),
                smallpic: qiniuUtils.imageView(rows[i]['qiniu_url'], 300, 150),
                //bmiddle_pic: rows[i]['bmiddle_pic'],
                //original_pic: rows[i]['original_pic'],
                //weibo: rows[i]['weibo'],
                date: full
            });
        }
        res.render('index', {
            data: data,
            title: '必应壁纸',
            description: 'Bing 每日壁纸',
            page: page
        });
    } else {
        var err = new Error('啊( ⊙ o ⊙ )，你发现了新大陆 ∑(っ °Д °;)っ');
        err.status = 404;
        next(err);
    }
}
module.exports = router;