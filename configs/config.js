module.exports = {
    weibo: {
        CLIENT_ID: '1833831541',
        CLIENT_SECRET: '204239c8f3e37e59f2d3eb95de2811a9',
        ACCESS_TOKEN: '',
        MASTER_ACCESS_TOKEN: '',
        MASTER_UID: '5893653736',
        USER_UID: ''
    },
    // mysql_dev: {
    //     host: process.env.mysql_host,
    //     user: process.env.mysql_user,
    //     password: process.env.mysql_password,
    //     port: '3306',
    //     database: process.env.mysql_database,
    //     connectionLimit: 10,
    //     supportBigNumbers: true,
    //     multipleStatements: true,
    //     insecureAuth: true
    // },
    mysql_dev: {
        host: 'qdm16395144.my3w.com',
        user: 'qdm16395144',
        password: 'simple123',
        port: '3306',
        database: 'qdm16395144_db',
        connectionLimit: 10,
        supportBigNumbers: true,
        multipleStatements: true,
        insecureAuth: true
    },
    /**
     * 已知分辨率
     */
    resolutions: [
        '1920x1200',
        '1920x1080',
        '1366x768',
        '1280x768',
        '1024x768',
        '800x600',
        '800x480',
        '768x1280',
        '720x1280',
        '640x480',
        '480x800',
        '400x240',
        '320x240',
        '240x320'
    ]


}