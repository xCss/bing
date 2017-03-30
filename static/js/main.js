$(function(){
    progressively.init();
    var click = 'ontouchstart' in window ? 'touchstart' : 'click';
    if (DEVICE.isMobile) {
        $(document.body).addClass('mobile');
    }
    $(document).on(click, '.menu-btn', function(e) {
        $('.menu,.menu-btn').toggleClass('active');
        if ($(this).hasClass('active')) {
            $('.mask').fadeIn(300);
            $(document.body).addClass('over');
        } else {
            $('.mask').fadeOut(300);
            $(document.body).removeClass('over');
        }
    }).on(click, '.mask', function() {
        $('.menu,.menu-btn').removeClass('active');
        $(document.body).removeClass('over');
        $(this).fadeOut(300);
    });
});