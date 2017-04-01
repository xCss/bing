$(function() {
    
    InstantClick.on('change', function(isInitialLoad) {
    if (isInitialLoad === false) {
        if (typeof _hmt !== 'undefined')  // support 百度统计
            _hmt.push(['_trackPageview', location.pathname + location.search]);
        if (typeof ga !== 'undefined')  // support google analytics
            ga('send', 'pageview', location.pathname + location.search);
    }
    });
    InstantClick.init();
});