var express = require('express');
var router = express.Router();
var qiniuUtils = require('../utils/qiniuUtils');
var request = require('superagent');
var db = require('../utils/dbUtils');
var config = require('../configs/config');
const CDN1 = 'http://h1.ioliu.cn/';

/* GET photo listing. */
router.get('/:photo', function(req, res, next) {
    var force = req.query.force || '';
    var photo = req.params.photo;
    var isAjax = !!req.headers['x-requested-with'];
    switch (force) {
        case 'like':
            if (isAjax) {
                var ck = req.cookies['likes'] || '';
                ck = ck.split('_');
                if (ck.indexOf(photo) > -1) {
                    res.json({
                        msg: '',
                        code: 200
                    });
                    return;
                }
                var sql = `update bing as a join (select likes,id from bing WHERE id='${photo}') as b on a.id=b.id set a.likes=(b.likes+1)`;
                db.commonQuery(sql, function(rows) {
                    var ret = {
                        msg: '',
                        code: 200
                    };
                    if (rows.affectedRows == 0) {
                        ret.msg = 'something happend.'
                    }
                    res.json(ret);
                });
            } else {}
            return;
            break;
        case 'download':
            var ua = req.get('User-Agent');
            if (!isAjax && !/(spider|bot)/ig.test(ua)) {
                var sql = `update bing as a join (select downloads,id from bing WHERE qiniu_url='${photo}') as b on a.id=b.id set a.downloads=(b.downloads+1)`;
                db.commonQuery(sql, function(rows) {});
                res.set({
                    'Content-Type': 'application/octet-stream',
                    'Content-Disposition': 'attachment; filename=' + encodeURI(`${photo}_1920x1080.jpg`)
                });
                request.get(`${CDN1}bing/${photo}_1920x1080.jpg`)
                .set({
                    'User-Agent': ua,
                    referer: 'https://bing.ioliu.cn'
                })
                .pipe(res);
                //console.log(`${CDN}bing/${photo}_1920x1080.jpg`)
            } else {
                res.json({
                    code: 200,
                    msg: 'bad request'
                })
            }
            return;
            break;
    }

    var sql = `select id,title,attribute,description,copyright,qiniu_url as photo,city,country,continent,DATE_FORMAT(enddate, '%Y-%m-%d') as dt,likes,views,downloads,thumbnail_pic from bing 
            where qiniu_url='${photo}'`;
    if (isAjax) {
        res.send({
            code: 200,
            msg: 'bad request'
        });
    } else {
        // 修改展示量
        db.commonQuery(`update bing as a join (select views,id from bing WHERE qiniu_url='${photo}') as b on a.id=b.id set a.views=(b.views+1)`, function(rows) {});
        // 返回数据
        db.commonQuery(sql, function(rows) {
            if (rows.length > 0) {
                var doc = rows[0];
                doc['large'] = `${CDN1}/bing/${photo}_1920x1080.jpg`;
                doc['small'] = `${CDN1}/bing/${photo}_640x360.jpg`;
                if (force.indexOf('_') > -1) {
                    var rt = force.split('_');
                    doc['back_url'] = rt[0] === 'ranking' ? '/ranking?p=' + rt[1] : '/?p=' + rt[1];
                } else {
                    doc['back_url'] = '/';
                }
                res.render('detail', { doc: doc });
            } else {
                res.redirect(`/`);
            }
        });
    }
});
/**
 * 如果没有参数，则跳转到首页
 */
router.get('/', function(req, res, next) {
    res.redirect('/');
});

module.exports = router;