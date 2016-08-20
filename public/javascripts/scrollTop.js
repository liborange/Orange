/**
 * Created by liborange on 15/11/18.
 */

$(document).ready(function() {
    $('#scroll').click( toTop);
    $(window).scroll( function () {
        checkPosition($(window).height());
    });
    checkPosition($(window).height());


    function toTop(){
        $('html,body').animate({
            scrollTop:0
        },400);
    }

    function checkPosition(pos){
        if($(window).scrollTop()>pos)
            $('#scroll').fadeIn();
        else
            $('#scroll').fadeOut();
    }
});