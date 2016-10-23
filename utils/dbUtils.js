//https://github.com/mysqljs/mysql#readme
var mysql = require('mysql');
//获取数据库配置
var config = require('../configs/config').mysql_dev;
//使用连接池
var pool = mysql.createPool(config);
//公共连接设置
var commonFormat = function(callback) {
    pool.getConnection(function(err, connection) {
        //console.log(callback);
        //自定义参数匹配设置
        connection.config.queryFormat = function(query, values) {
            if (!values) return query;
            return query.replace(/\:(\w+)/g, function(txt, key) {
                if (values.hasOwnProperty(key)) {
                    return this.escape(values[key]);
                }
                return txt;
            }.bind(this));
        };
        callback && callback(err, connection);
    });
};