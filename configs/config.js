module.exports = {
    weibo: {
        CLIENT_ID: '1833831541',
        CLIENT_SECRET: '204239c8f3e37e59f2d3eb95de2811a9',
        ACCESS_TOKEN: '',
        MASTER_ACCESS_TOKEN: '',
        MASTER_UID: '5893653736',
        USER_UID: ''
    },
    mysql_dev: {
        host: process.env.mysql_host,
        user: process.env.mysql_user,
        password: process.env.mysql_password,
        port: '3306',
        database: process.env.mysql_database,
        connectionLimit: 10,
        supportBigNumbers: true,
        multipleStatements: true,
        insecureAuth: true
    }


}