if (!/^http:\/\/localhost/.test(location.href)) {
    var _hmt = _hmt || [];
    var hm = document.createElement("script");
    hm.src = "//hm.baidu.com/hm.js?667639aad0d4654c92786a241a486361";
    var s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(hm, s);

    var bp = document.createElement('script');
    var curProtocol = window.location.protocol.split(':')[0];
    if (curProtocol === 'https') {
        bp.src = 'https://zz.bdstatic.com/linksubmit/push.js';        
    }
    else {
        bp.src = 'http://push.zhanzhang.baidu.com/push.js';
    }
    var s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(bp, s);
}
