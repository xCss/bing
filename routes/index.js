var express = require('express');
var dbUtils = require('../utils/dbUtils');
var router = express.Router();
const moment = require('moment');
const CDN1 = 'http://h1.ioliu.cn/';
const ROOT = 'https://bing.ioliu.cn/';
/* GET home page. */
router.get('/', function(req, res, next) {
    var today = moment().format('YYYYMMDD');
    var pageNo = req.query.p;
    pageNo = !!pageNo && Number(pageNo) > 0 ? Number(pageNo) : 1;
    var pageSize = 12; // pageSize
    dbUtils.commonQuery(`select count(0) as sum from bing where (!ISNULL(qiniu_url) || qiniu_url<>"") and mkt like '%zh-cn%' and enddate<='${today}'`, function(rows) {
        var count = rows[0]['sum'] || 0;
        if (count > 0) {
            var page = {
                size: pageSize,
                count: count,
                pageCount: Math.ceil(count / pageSize),
                next: pageNo + 1 > Math.ceil(count / pageSize) ? Math.ceil(count / pageSize) : pageNo + 1,
                prev: pageNo - 1 > 0 ? pageNo - 1 : 1,
                curr: pageNo > Math.ceil(count / pageSize) ? Math.ceil(count / pageSize) : pageNo,
                currText: pageNo === 1 ? '' : '第' + pageNo + '页',
                currPage: 'home'
            }
            var sql = `select id,title,attribute,description,copyright,qiniu_url as photo,city,country,continent,DATE_FORMAT(enddate, '%Y-%m-%d') as dt,likes,views,downloads,thumbnail_pic,original_pic from bing 
                        where (!ISNULL(qiniu_url) || qiniu_url<>"") and mkt like '%zh-cn%' and enddate<='${today}'
                        order by id desc
                        limit ${(page.curr-1)*page.size},${page.size}`;
            dbUtils.commonQuery(sql, function(rs) {
                if (rs.length > 0) {
                    var data = convert(rs)
                    res.render('index', {
                        doc: data,
                        page: page
                    });
                }else{
                    res.redirect('/')
                }
            });
        }
    });
});


/* GET ranking listing. */
router.get('/ranking', function(req, res, next) {
    var isAjax = !!req.headers['x-requested-with'];
    var pageNo = req.query.p;
    pageNo = !!pageNo && Number(pageNo) > 0 ? Number(pageNo) : 1;
    var pageSize = 12; // pageSize
    dbUtils.commonQuery(`select count(0) as sum from bing where (!ISNULL(qiniu_url) || qiniu_url<>"")  and mkt like '%zh-cn%'`, function(rows) {
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
                        where (!ISNULL(qiniu_url) || qiniu_url<>"")  and mkt like '%zh-cn%'
                        order by downloads desc
                        limit ${(page.curr-1)*page.size},${page.size}`;
            dbUtils.commonQuery(sql, function(rs) {
                if (rs.length > 0) {
                    var data = convert(rs)
                    res.render('index', {
                        doc: data,
                        page: page
                    });
                }else{
                    res.redirect('/')
                }
            });
        }
    });
});

function convert(rs){
    var data = [];
    for (var i in rs) {
        var temp = rs[i];
        /**
         * 1024x576
         * 120x67
         */
        var middle = `${CDN1}bing/${temp['photo']}_800x480.jpg`;
        var small = `${CDN1}bing/${temp['photo']}_400x240.jpg`;
        var sharepic = `${CDN1}bing/${temp['photo']}_1366x768.jpg`;
        var desc = `#必应壁纸# ${temp['dt']} / #${temp['title']}# ${temp['description']}`;
        var share = `http://service.weibo.com/share/share.php?url=${ROOT}photo/${temp['photo']}&appkey=1833831541&pic=${sharepic}&ralateUid=5893653736&title=${encodeURIComponent(desc.substring(0,126)+'...')}`;
        
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
            middle: middle,
            small: small,
            dt: temp['dt'],
            likes: temp['likes'],
            views: temp['views'],
            downloads: temp['downloads'],
            share:share
        });
    }

    return data
}

module.exports = router;