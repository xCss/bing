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
        database: process.env.mysql_database,
        user: process.env.mysql_user,
        password: process.env.mysql_password,
        port: '3306',
        connectionLimit: 10,
        supportBigNumbers: true,
        multipleStatements: true,
        insecureAuth: true
    },
    //disabled: [process.env.disabled.split(',')],
    /**
     * 已知分辨率
     */
    resolutions: [
        '1920x1200',
        '1920x1080',
        '1366x768',
        '1280x768',
        '1080x1920',
        '1024x768',
        '800x600',
        '800x480',
        '768x1366',
        '768x1280',
        '768x1024',
        '720x1280',
        '640x480',
        '640x360',
        '480x800',
        '400x240',
        '320x240',
        '320x180',
        '240x400',
        '240x320',
        '240x240',
        '200x200',
        '150x150'
    ],

    global_link: function() {
        return Math.random() > 0.5 ? 'https://static.ioliu.cn' : 'https://bing-images.bitmoe.cn';
    },
    global_http: function() {
        return Math.random() > 0.5 ? 'http://static.ioliu.cn' : 'http://bing-images.bitmoe.cn';
    }


}