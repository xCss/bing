// https://github.com/mysqljs/mysql#readme
var mysql = require('mysql');
// 获取数据库配置
var config = require('../configs/config').mysql_dev;
var objectAssign = require('object-assign');
// 使用连接池
var pool = mysql.createPool(config);

module.exports = {
    /**
     * 获取数据
     * @table   表名
     * @params  参数{k:v}
     * 
     * or       参数:{body:{k:v},page:{no:1,size:10}}
     *          body:参数键值(可以直接传条件字符串：'a>b or c>d')
     *          page:分页对象(no-页码，size-每页显示条数)
     * 
     * @callback
     */
    get: function(table, params, callback) {
        var defaultPage = {
            no: 1,
            size: 10
        }
        var condition = [];
        var body = params.body || params;
        var page = params.page || {};
        page = objectAssign(defaultPage, page);
        var sql = 'select * from ' + table;
        if (Object.prototype.toString.call(body) === '[object Object]') {
            for (var i in body) {
                condition.push(i + '="' + body[i] + '"')
            }
            if (condition.length > 0) {
                sql += ' where ' + condition.join(' and ');
            }
        } else if (Object.prototype.toString.call(body) === '[object String]') {
            sql += ' where ' + body;
        }
        sql += ' order by id desc limit ' + (page.no - 1) * page.size + ',' + page.size;
        //console.log(sql);
        module.exports.commonQuery(sql, callback);
    },
    /**
     * 获得总条数
     * @table   表名
     * @params  参数{k:v}
     *          或者直接是条件字符串： 'weibo=1 and id>2'
     * @callback
     */
    getCount: function(table, params, callback) {
        var sql = 'select count(id) as sum from ' + table;
        var _condition = [];
        if (Object.prototype.toString.call(params) === '[object Object]') {
            for (var i in params) {
                _condition.push(i + '="' + params[i] + '"');
            }
            if (_condition.length > 0) {
                sql += ' where ' + _condition.join(' and ');
            }
        } else if (Object.prototype.toString.call(params) === '[objcet String]') {
            sql += ' where ' + params;
        }
        module.exports.commonQuery(sql, callback);
    },
    /**
     * 插入数据
     * @table   表名
     * @params  参数{k:v}
     * @callback
     */
    set: function(table, params, callback) {
        var keys = [];
        var vals = [];
        for (var i in params) {
            keys.push(i);
            vals.push(params[i]);
        }
        var sql = 'insert into ' + table + '(' + keys.join(',') + ') values("' + vals.join('","') + '")';
        module.exports.commonQuery(sql, callback);
    },
    /**
     * 修改数据
     * @table   表名
     * @params  参数{body:{k:v},condition{k:v}}
     *          body:       修改键值对
     *          condition:  条件键值对
     * @callback
     */
    update: function(table, params, callback) {
        var body = params.body;
        var condition = params.condition;
        var body_temp = [];
        var condition_temp = [];
        for (var i in body) {
            body_temp.push(i + '="' + body[i] + '"');
        }
        for (var j in condition) {
            condition_temp.push(j + '="' + condition[j] + '"');
        }
        if (body_temp.length > 0 && condition_temp.length > 0) {
            var sql = 'update ' + table + ' set ' + body_temp.join(',') + ' where ' + condition_temp.join(' and ');
            module.exports.commonQuery(sql, callback);
        }
    },
    /**
     * 删除数据
     * @table   表名
     * @params  参数{k:v}
     *          注: 如果是or条件，请直接发送字符串参数 params = 'id=1 or id=2'
     *              或者： params = 'id in (1,2)'
     * @callback
     */
    del: function(table, params, callback) {
        var condition = [];
        var sql = 'delete from ' + table;
        if (Object.prototype.toString.call(params) === '[object Object]') {
            // 如果参数是对象 
            for (var i in params) {
                condition.push(i + '="' + params[i] + '"');
            }
            sql = sql + ' where ' + condition.join(' and ');
        } else if (Object.prototype.toString.call(params) === ['object String']) {
            // 如果参数是字符串
            sql = sql + ' where ' + params;
        }

        module.exports.commonQuery(sql, callback);
    },
    /**
     * 公共查询
     * @sql 
     * @callback
     */
    commonQuery: function(sql, callback) {
        //console.log(sql);
        try {
            pool.getConnection(function(err, connection) {
                connection.query(sql, function(err, rows) {
                    connection.release();
                    if (!err) {
                        callback && callback(rows);
                    } else {
                        // send mail
                        console.log(err);
                    }
                });
            });
        } catch (error) {
            console.log(error);
            console.log(sql);
            callback && callback([]);
        }
    }
};