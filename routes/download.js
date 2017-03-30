var express = require('express');
var router = express.Router();
var request = require('superagent');
var db = require('../utils/dbUtils');

/* GET users listing. */
router.get('/:photo', function(req, res, next) {
    //console.log(1);
    var photo = req.params.photo;
    db.commonQuery(`select (downloads+1) as ds from bing where qiniu_url='${photo}'`,function(rows){
        if(rows.length>0){
            db.commonQuery(`update bing set downloads=${rows[0]['ds']} where qiniu_url='${photo}'`,function(rows){
                console.log(rows);
                if(rows.length>0){
                    res.set({
                        'Content-Type': 'application/octet-stream',
                        'Content-Disposition': 'attachment; filename='+encodeURI(photo)
                    });
                    request.get(`https://static.ioliu.cn/bing/${photo}_1920x1080.jpg`).pipe(res);
                }
            });
        }else{
            console.log(1);
            console.log(rows);
        }
    });
    //res.send(photo);
});
/**
 * 如果没有参数，则跳转到首页
 */
router.get('/', function(req, res, next) {
    res.redirect('/');
});

module.exports = router;
