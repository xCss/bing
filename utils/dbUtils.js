// https://github.com/mysqljs/mysql#readme
var mysql = require('mysql');
// 获取数据库配置
var config = require('../configs/config').mysql_dev;
// 使用连接池
var pool = mysql.createPool(config);
// 公共连接设置
var commonFormat = function(callback) {
    pool.getConnection(function(err, connection) {
        callback && callback(err, connection);
    });
};

module.exports = {
    /**
     * 获取数据
     * @table   表名
     * @params  参数{k:v}
     * @callback
     */
    get: function(table, params, callback) {
        var defaultPage = {
            no: 1,
            size: 10
        }
        var condition = [];
        var body = params.body;
        var page = params.page;
        for (var i in params.body) {
            condition.push(i + '="' + body[i] + '"')
        }

        var sql = 'select * from ' + table + ' where ' + condition.join(' and ') + 'order by id limit ' + (page.no - 1) * page.size + ',' + page.size;
        pool.getConnection(function(err, connection) {
            connection.query(sql, function(err, rows) {
                console.log(rows);
                connection.release();
                callback && callback(rows);
            });
        });
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

        pool.getConnection(function(err, connection) {
            connection.query(sql, function(err, rows) {
                console.log(rows[0]);
                connection.release();
                callback && callback(rows);
            });
        });
    },
    /**
     * 修改数据
     * @table   表名
     * @params  参数{k:v}
     * @callback
     */
    update: function(table, params, callback) {

    },
    /**
     * 删除数据
     * @table   表名
     * @params  参数{k:v}
     * @callback
     */
    del: function(table, params, callback) {

    }
};