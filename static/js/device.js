//*****************************************************
//获取浏览器或设备名称  以及版本号
//*****************************************************
//输出结果:
//---------------------------------------------------------
//DEVICE.isIpad             @return:Boolean    是否是：ipad
//DEVICE.isIphone           @return:Boolean    是否是：ipbone
//DEVICE.isAndroid          @return:Boolean    是否是：android
//DEVICE.isIe               @return:Boolean    是否是：ie
//DEVICE.isFirefox          @return:Boolean    是否是：firefox
//DEVICE.isChrome           @return:Boolean    是否是：chrome
//DEVICE.isOpera            @return:Boolean    是否是：opera
//DEVICE.isSafari           @return:Boolean    是否是：safari

//DEVICE.isPc               @return:Boolean	是否是：pc
//DEVICE.isMac              @return:Boolean	是否是：mac
//DEVICE.isLinux            @return:Boolean	是否是：linux
//DEVICE.isMobile           @return:Boolean	是否是：移动设备，非pc

//DEVICE.ver                @return:Number   浏览器版本或  ipad/iphone/android系统版本
//---------------------------------------------------------
(function() {
    var DEVICE = {};
    var Sys = {};
    var ua = navigator.userAgent.toLowerCase();
    var s;
    (s = ua.match(/ipad; cpu os ([\d_]+)/)) ? Sys.ipad = s[1].replace(/_/g, "."):
        (s = ua.match(/iphone os ([\d_]+)/)) ? Sys.iphone = s[1].replace(/_/g, ".") :
        (s = ua.match(/android[ \/]([\d.]+)/)) ? Sys.android = s[1] :
        (s = ua.match(/rv:([\d.]+)\) like gecko/)) ? Sys.ie = s[1] :
        (s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] :
        (s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] :
        (s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] :
        (s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1] :
        (s = ua.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : Sys._ = 0;

    DEVICE.isIpad = (Sys.hasOwnProperty("ipad"));
    DEVICE.isIphone = (Sys.hasOwnProperty("iphone"));
    DEVICE.isAndroid = (Sys.hasOwnProperty("android"));
    DEVICE.isIe = (Sys.hasOwnProperty("ie"));
    DEVICE.isFirefox = (Sys.hasOwnProperty("firefox"));
    DEVICE.isChrome = (Sys.hasOwnProperty("chrome"));
    DEVICE.isOpera = (Sys.hasOwnProperty("opera"));
    DEVICE.isSafari = (Sys.hasOwnProperty("safari"));

    DEVICE.ver = 0;
    var ver;
    for (var key in Sys) {
        if (Sys.hasOwnProperty(key)) {
            ver = Sys[key];
        }
    }
    ver = ver.split(".");
    var _ver = [];
    for (var i = 0, l = ver.length; i < l; i++) {
        if (i >= 2) {
            break;
        }
        _ver.push(ver[i]);
    }
    _ver = _ver.join(".");
    DEVICE.ver = _ver;

    DEVICE.isMobile = (DEVICE.isAndroid || DEVICE.isIpad || DEVICE.isIphone);

    var p = navigator.platform;
    var win = p.indexOf("Win") === 0;
    var mac = p.indexOf("Mac") === 0;
    var x11 = (p == "X11") || (p.indexOf("Linux") === 0);

    DEVICE.isPc = (win || mac || x11);
    DEVICE.isMobile = !(win || mac || x11);
    DEVICE.isMac = mac;
    DEVICE.isWin = win;
    DEVICE.isLinux = x11;

    window.DEVICE = DEVICE;
})();