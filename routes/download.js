var express = require('express');
var router = express.Router();
var request = require('superagent');
var db = require('../utils/dbUtils');

/* GET users listing. */
router.get('/:photo', function(req, res, next) {
    var isAjax = req.headers['x-requested-with'] ? true : false;
    if (!isAjax) {
        var photo = req.params.photo;
        var sql = `update bing as a join (select downloads,id from bing WHERE qiniu_url='${photo}') as b on a.id=b.id set a.downloads=(b.downloads+1)`;
        db.commonQuery(sql, function(rows) {
            res.set({
                'Content-Type': 'application/octet-stream',
                'Content-Disposition': 'attachment; filename=' + encodeURI(`${photo}_1920x1080.jpg`)
            });
            request.get(`https://static.ioliu.cn/bing/${photo}_1920x1080.jpg`)
                .set({
                    'User-Agent': req.get('User-Agent')
                })
                .pipe(res);
        });
    } else {
        res.json({
            code: 200,
            msg: 'bad request'
        })
    }
});
/**
 * 如果没有参数，则跳转到首页
 */
router.get('/', function(req, res, next) {
    res.redirect('/');
});

module.exports = router;