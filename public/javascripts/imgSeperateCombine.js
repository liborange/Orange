/**
 * Created by liborange on 15/11/21.
 */
console.log('----------start to execut imgSeperateCombine.js----------')
var ie 	= false;
if ($.browser.msie)
    ie = true;

//标记点击事件
var flg_click	= true;
//控制层
var $im_wrapper	= $('#im_wrapper');

//缩略图
var $thumbs		= $im_wrapper.children('div');

//所有的图片对象
var $thumb_imgs = $thumbs.find('img');

//图片的数量
var nmb_thumbs	= $thumbs.length;

//图片加载状态
var $im_loading	= $('#im_loading');

//下一张和上一张点击按钮
var $im_next	= $('#im_next');
var $im_prev	= $('#im_prev');

//每行缩略图的数量
var per_line	= Math.ceil(Math.sqrt(nmb_thumbs));

//缩略图每列的数量
var per_col		= Math.ceil(nmb_thumbs/per_line)

//当前缩略图的索引值
var current		= -1;
//mode = grid | single
var mode		= 'grid';

//缩略图位置的数组
//我们将用它来在单一模式上导航
var positionsArray = [];
for(var i = 0; i < nmb_thumbs; ++i)
    positionsArray[i]=i;


//预加载所有图片
$im_loading.show();
var loaded		= 0;
$thumb_imgs.each(function(){
    var $this = $(this);
    $('<img/>').load(function(){
        ++loaded;
        if(loaded == nmb_thumbs*2)
            start();
    }).attr('src',$this.attr('src'));
    $('<img/>').load(function(){
        ++loaded;
        if(loaded == nmb_thumbs*2)
            start();
    }).attr('src',$this.attr('src').replace('thumbs_',''));
});


//开始动画
function start(){
    $im_loading.hide();

    //分散缩略图在一个表格上
    disperse();
}


//基于当前屏幕的尺寸散落缩略图在网格上
function disperse(){
    if(!flg_click) return;
    setflag();
    mode			= 'grid';

    //首张缩略图沿着屏幕的宽度的中心点
    var spaces_w 	= $(window).width()/(per_line + 1);
    //center point for first thumb along the height of the window
    //首张缩略图沿着屏幕的高度的中心点
    var spaces_h 	= $(window).height()/(per_col + 1);

    var img_width = spaces_w*0.8;
    var img_height = spaces_h*0.8;

    //把全部缩略图平均的分布在页面上
    $thumbs.each(function(i){
        var $thumb 	= $(this);

        //计算每张缩略图的左方和上方的距离
        //预测每行能放多少张图片
        var left	= spaces_w*((i%per_line)+1) - $thumb.width()/2;
        var top		= spaces_h*(Math.ceil((i+1)/per_line)) - $thumb.height()/2;

        //给每张缩略图一个随机的角度
        var r 		= Math.floor(Math.random()*41)-20;
        /*

         现在我们动态的将缩略图置于它的最终位置；
         我们显示它的图片，动态置于115x115，
         当它们从单一模式改变到模式的时候，
         移除所有缩略图的背景图片-这个跟我们第一时间调用disperse函数没有关系，

         */
        if(ie)
            var param = {
                'left'		: left + 'px',
                'top'		: top + 'px',
                'rotate'	: r + 'deg'
            };
        else
            var param = {
                'left'		: left + 'px',
                'top'		: top + 'px',
                'rotate'	: r + 'deg'
            };
        $thumb.stop()
            .animate(param,700,function(){
                if(i==nmb_thumbs-1)
                    setflag();
            })
            .find('img')
            .fadeIn(700,function(){
                $thumb.css({
                    'background-image'	: 'none',
                    //'width' : Math.min(img_width,img_height)+'px',
                    //'height': '100%'
                });
                $(this).animate({
                    //'width'		: img_height-5+'px',
                    //'height'	: img_height-5+'px',
                    'marginTop'	: '5px',
                    'marginLeft': '5px'
                },150);
            });
    });
}


//这个适用于判断用户是否点击了，
//如果点击了，我们不希望在动画的过程中继续出现重复点击的情况
function setflag(){
    flg_click = !flg_click
}

/*

 当我们点击一张缩略图的时候，我们想去把所有缩略图融合并且展示被点击了的缩略图的大图。
 我们需要动态地使缩略图移移动以便大图显示于中心。
 这张大图本身就是每张缩略图的背景图片。

 */
$thumbs.bind('click',function(){
    if(!flg_click) return;
    setflag();

    var $this 		= $(this);
    current 		= $this.index();

    if(mode	== 'grid'){
        mode			= 'single';

        //大图的图片源
        var image_src	= $this.find('img').attr('src');
        console.log(image_src)

        $thumbs.each(function(i){
            var $thumb 	= $(this);
            var $image 	= $thumb.find('img');

            //首先我们将缩略图充满整张的尺寸
            $image.stop().animate({
                'width'		: '100%',
                'height'	: '100%',
                'marginTop'	: '0px',
                'marginLeft': '0px'
            },150,function(){

                //计算大图的尺寸
                var f_w	= per_line * 125;
                var f_h	= per_col * 125;
                var f_l = $(window).width()/2 - f_w/2
                var f_t = $(window).height()/2 - f_h/2

                /*

                 设置缩略图的背景图片和布置缩略图的位置和旋转角度
                 */
                if(ie)
                    var param = {
                        'left'	: f_l + (i%per_line)*125 + 'px',
                        'top'	: f_t + Math.floor(i/per_line)*125 + 'px'
                    };
                else
                    var param = {
                        'rotate': '0deg',
                        'left'	: f_l + (i%per_line)*125 + 'px',
                        'top'	: f_t + Math.floor(i/per_line)*125 + 'px',


                    };
                $thumb.css({
                    'background-image'	: 'url('+image_src+')',
                    'background-size'   :  f_w+'px '+f_h+'px'

                }).stop()
                    .animate(param,1200,function(){

                        //插入单一模式的导航(就是左右按钮)
                        if(i==nmb_thumbs-1){
                            addNavigation();
                            setflag();
                        }
                    });

                //隐藏缩略图
                $image.fadeOut(700);
            });
        });
    }
    else{
        setflag();

        //移除左右按钮
        removeNavigation();

        //如果处于单一图片模式就清楚散落的缩略图
        disperse();
    }
});


//移除导航的按钮
function removeNavigation(){
    $im_next.stop().animate({'right':'-50px'},300);
    $im_prev.stop().animate({'left':'-50px'},300);
}


//添加导航的按钮
function addNavigation(){
    $im_next.stop().animate({'right':'0px'},300);
    $im_prev.stop().animate({'left':'0px'},300);
}


//使用导航按钮
$im_next.bind('click',function(){
    if(!flg_click) return;
    setflag();

    ++current;
    var $next_thumb	= $im_wrapper.children('div:nth-child('+(current+1)+')');
    if($next_thumb.length>0){
        var image_src	= $next_thumb.find('img').attr('src').replace('thumbs_','');
        var arr 		= Array.shuffle(positionsArray.slice(0));
        $thumbs.each(function(i){

            //我们想去改变背景图片的divs
            var t = $(this);
            setTimeout(function(){
                t.css({
                    'background-image'	: 'url('+image_src+')'
                });
                if(i == nmb_thumbs-1)
                    setflag();
            },arr.shift()*20);
        });
    }
    else{
        setflag();
        --current;
        return;
    }
});


//上一张图片
$im_prev.bind('click',function(){
    if(!flg_click) return;
    setflag();
    --current;
    var $prev_thumb	= $im_wrapper.children('div:nth-child('+(current+1)+')');
    if($prev_thumb.length>0){
        var image_src	= $prev_thumb.find('img').attr('src').replace('thumbs_','');
        var arr 		= Array.shuffle(positionsArray.slice(0));
        $thumbs.each(function(i){
            var t = $(this);
            setTimeout(function(){
                t.css({
                    'background-image'	: 'url('+image_src+')'
                });
                if(i == nmb_thumbs-1)
                    setflag();
            },arr.shift()*20);
        });
    }
    else{
        setflag();
        ++current;
        return;
    }
});

//自适应操作
$(window).smartresize(function(){
    removeNavigation()
    disperse();
});


Array.shuffle = function( array ){
    for(
        var j, x, i = array.length; i;
        j = parseInt(Math.random() * i),
            x = array[--i], array[i] = array[j], array[j] = x
    );
    return array;
};