/**
 * Created by liborange on 15/11/18.
 */

var initCount = 20;
var perScroll = 15;
var currentIndex = 0;
var dataArray = [];
var totalLen = 0;

imgPre = 'http://7xnlj6.com1.z0.glb.clouddn.com/HD_';
$(document).ready(function () {
    jsonLoad(imgPre+"1001girls.json");

    $(window).load( function () {
        isImgLoad(waterfull);
    });
    $(window).scroll(function(){
        totalLen = dataArray.length;
        if(checkScrollSlide()){
            console.log('waitting to load new pic');
            if(currentIndex<totalLen){
                for(var i=0;i<perScroll;i++){
                    insertCard(dataArray[currentIndex]);
                    currentIndex++;
                    if(currentIndex>totalLen)
                        break;
                }
                isImgLoad(waterfull);
            }else{

                console.log('共'+currentIndex+'人加载完毕。')
            }
        }

    });

})
function jsonLoad(jsonFile) {

    $.getJSON(jsonFile, function(data) {
        dataArray = data;
        totalLen = dataArray.length;
        $.each(data, function(index, value) { // initialization
            //console.log(value)
            if (index < initCount) {
                insertCard(value);
                //$('.pic img').css('width',Math.floor($(window).width()*0.8/4)+'px');
                currentIndex += 1;
            }
        })
        isImgLoad(waterfull);
    })
}
function waterfull() {
    var $boxes = $('#main>div');    //取id=main下的一级div标签，存储在boxes中。
    var w = $boxes.eq(0).outerWidth();  //一个box的宽
    var cols = Math.floor($(window).width() / w);   //有多少列
    $('#main').width(w * cols).css('margin', '0 auto'); //jquery连式操作和隐式迭代的特性，使得链上的所有操作都作用在匹配元素上
    var hArr = [];  //这个数组很重要，用来存储cols列每列当前的高度，用来选择下一个box需要放在哪列（高度最小的列）.
    $boxes.each(function(index, value) { // start water fall calculation, append next card to the shortest column
        var h = $boxes.eq(index).outerHeight();
        if(index < cols) {
            hArr[index] = h;
        } else {
            var minH = Math.min.apply(null, hArr);
            var minHIndex = $.inArray(minH, hArr);
            $(value).css({  //⬇️定位新的box所在的位置。
                'position': 'absolute',
                'top': minH + 'px',
                'left': minHIndex * w + 'px'
            })
            hArr[minHIndex] += h;
        }
    })

    $('body').css('height', (Math.max.apply(null, hArr) + 50) + 'px'); // if the height not set, background color change may fail
    $('#main').css('height',(Math.max.apply(null, hArr) + 50) + 'px');
    $('.cloud-zoom').CloudZoom();
}

function insertCard(data){
    var oBox = $('<div>').addClass('box').addClass('zoom-section').appendTo($('#main'));
    var oPic = $('<div>').addClass('pic').addClass('zoom-small-image').appendTo($(oBox));
    var oImgUp = $('<a>').addClass('cloud-zoom').attr('href', imgPre + data.images[0].img_url).attr('rel', 'position:\'inside\',adjustY:0,adjustX:0').appendTo($(oPic))
    var more = $('<a>').attr('style','position:relative;z-index:20000;').attr('id','open').appendTo($(oImgUp));
    var oImg = $('<img>').addClass('picture').attr('images',JSON.stringify(data.images)).attr('title', data.author).attr('src', imgPre + data.img_url).appendTo($(more));

    $(oImg).error(function () {
    $(this).attr('alt','..:%>_<%:.. 客官，图片加载失败了');
    })

}
function checkScrollSlide() {   //查看最后一个box是否已经被显示在网页中，可以看到就返回true，表示需要加载后续的box了。
    var $lastBox = $('#main>div').last();
    var lastBoxDis = $lastBox.offset().top;
    var scrollTop = $(window).scrollTop();
    var documentH = $(window).height();
    return (lastBoxDis < scrollTop + documentH) ? true : false;
}

var t_img; // 定时器
var isLoad = true; // 控制变量


// 判断图片加载的函数
function isImgLoad(callback){
    // 注意我的图片类名都是cover，因为我只需要处理cover。其它图片可以不管。
    // 查找所有封面图，迭代处理
    $('.pic img').each(function(){
        // 找到为0就将isLoad设为false，并退出each

        if(this.height === 0){
            isLoad = false;
            return false;
        }
    });
    // 为true，没有发现为0的。加载完毕
    if(isLoad){
        clearTimeout(t_img); // 清除定时器
        // 回调函数
        callback();
        // 为false，因为找到了没有加载完成的图，将调用定时器递归
    }else{
        isLoad = true;
        t_img = setTimeout(function(){
            isImgLoad(callback); // 递归扫描
        },500); // 我这里设置的是500毫秒就扫描一次，可以自己调整
    }
}