var express = require('express');
var router = express.Router();
var request = require('superagent');
var dbUtils = require('../utils/dbUtils');

/* GET ranking listing. */
router.get('/', function(req, res, next) {
    var isAjax = !!req.headers['x-requested-with'];
    var pageNo = req.query.p;
    pageNo = !!pageNo && Number(pageNo) > 0 ? Number(pageNo) : 1;
    var pageSize = 12; // pageSize
    dbUtils.commonQuery(`select count(0) as sum from bing where !ISNULL(qiniu_url) || qiniu_url<>""`, function(rows) {
        var count = rows[0]['sum'] || 0;
        if (count > 0) {
            var page = {
                size: pageSize,
                count: count,
                pageCount: Math.ceil(count / pageSize),
                next: pageNo + 1 > Math.ceil(count / pageSize) ? Math.ceil(count / pageSize) : pageNo + 1,
                prev: pageNo - 1 > 0 ? pageNo - 1 : 1,
                curr: pageNo > Math.ceil(count / pageSize) ? Math.ceil(count / pageSize) : pageNo,
                currText: pageNo === 1 ? '下载榜' : '第' + pageNo + '页',
                currPage: 'ranking'
            }
            if (pageNo > page.curr && !isAjax) {
                res.redirect(`/?p=${page.curr}`);
            }
            var sql = `select id,title,attribute,description,copyright,qiniu_url as photo,city,country,continent,DATE_FORMAT(enddate, '%Y-%m-%d') as dt,likes,views,downloads,thumbnail_pic,original_pic from bing 
                        where !ISNULL(qiniu_url) || qiniu_url<>""
                        order by downloads desc
                        limit ${(page.curr-1)*page.size},${page.size}`;
            dbUtils.commonQuery(sql, function(rs) {
                if (rs.length > 0) {
                    var data = [];
                    for (var i in rs) {
                        var temp = rs[i];
                        var link = Math.random() < 0.5 ? 'https://static.ioliu.cn' : 'https://bing-images.bitmoe.cn';
                        /**
                         * 1024x576
                         * 120x67
                         */
                        var thumbnail = temp['original_pic'] ? temp['original_pic'].replace('http', 'https') : `${link}/bing/${temp['photo']}_1920x1080.jpg?imageView2/1/w/1024/h/576/q/100`;
                        var smallpic = temp['thumbnail_pic'] ? temp['thumbnail_pic'].replace('http', 'https') : `${link}/bing/${temp['photo']}_1920x1080.jpg?imageView2/1/w/120/h/67/q/100`;
                        data.push({
                            id: temp['id'],
                            title: temp['title'],
                            attribute: temp['attribute'],
                            description: temp['description'],
                            copyright: temp['copyright'],
                            photo: temp['photo'],
                            city: temp['city'],
                            country: temp['country'],
                            continent: temp['continent'],
                            thumbnail: thumbnail,
                            smallpic: smallpic,
                            dt: temp['dt'],
                            likes: temp['likes'],
                            views: temp['views'],
                            downloads: temp['downloads']
                        });
                    }
                    if (isAjax) {
                        res.json({
                            doc: data,
                            page: page
                        });
                    } else {
                        res.render('index', {
                            doc: data,
                            page: page
                        });
                    }
                }
            });
        }
    });
});
/**
 * 如果没有参数，则跳转到首页
 */
router.get('/', function(req, res, next) {
    res.redirect('/');
});

module.exports = router;