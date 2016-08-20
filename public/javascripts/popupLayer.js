/**
 * Created by liborange on 15/11/26.
 * 网页弹出层动画js
 */
$(function(){
    if($.browser.msie && $.browser.version<=6)
    {
        $(".PopupLayer").css("position","absolute");
    }
    //$(".PopupLayer").css({"top":$(".PopupLayer").outerHeight()*-1+"px",opacity:0.1});//载入页面时将元素置于页面可见区域的顶部达到自上而下显示效果（PS：还有隐藏效果）
    function notice_show()//显示
    {
        $('#main').css('opacity','0.6').attr('class','blur10 main');
        var browser_visible_region_height=document.documentElement.clientHeight;//获取浏览器可见区域高度
        var element_height=$(".PopupLayer").outerHeight();//获取元素高度:height+paelement_heighting+margin
        //计算元素显示时的top值
        var element_show_top=(browser_visible_region_height-element_height)/2;
        $(".PopupLayer").stop(true).animate({top:element_show_top,opacity:1},1000);
        //显示功能定义在cloud-zoom.js里面
    }
    function notice_hidden()//隐藏
    {
        var element_height=$(".PopupLayer").outerHeight();//获取元素高度:height+paelement_heighting+margin
        var ee=-element_height;//元素隐藏时的top值
        $(".PopupLayer").stop(true).animate({top:ee,opacity:0},100);
    }

    $('#open').click(function () {
        notice_show();
    })
    $("a.close,a#close").click(function(){

        var element_height=$(".PopupLayer").outerHeight();//获取元素高度:height+paelement_heighting+margin
        var ee=-element_height;//元素隐藏时的top值
        $(".PopupLayer").animate({top:ee,opacity:0},800);
        $('#main').css('opacity','1').attr('class','main');

    })//点击关闭按钮隐藏

    $("a.btn").click(function(){
        $(".PopupLayer").animate({top:$(document).height(),opacity:0},1000)
    })

    function check()
    {
        var kk=$(".PopupLayer").outerHeight()*-1;//获取元素高度:height+paelement_heighting+margin
        var ww=$(document).height();
        var qq=parseInt($(".PopupLayer").css("top"));//获取元素当前的top值，String类型转换为number类型

        if(qq == kk || qq == ww)
        {
            return;
        }
        else//弹出层自适应浏览器窗口大小。
        {
            var browser_visible_region_height=document.documentElement.clientHeight;//获取浏览器可见区域高度
            var element_height=$(".PopupLayer").outerHeight();//获取元素高度:height+paelement_heighting+margin
            //计算元素显示时的top值
            var element_show_top=(browser_visible_region_height-element_height)/2;
            $(".PopupLayer").stop(true).animate({top:element_show_top},1500);
        }
    }

    $(window).resize(function(){
        check();
    })//自适应浏览器窗口大小
})