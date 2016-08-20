var Crawler = require('crawler');
var url = require('url');
var fs = require('fs');
var path = require('path')
var request = require('request')
var cheerio = require('cheerio')
var mongo = require('../DB/mongoDB.js')
var async = require('async')
var gone = [];  //存储已经爬过的url
var passName=[];
var authorIndex = 0;    //计数，每爬一个人的数据，加1
var rootPath = path.resolve(__dirname,'../../public/zhihu');    //文件或者图片出处位置（文件夹）
var rootURL = "http://www.zhihu.com/collection/26348030";    //爬虫的起始URL
var crawImages = true;
//
var Mongo = new mongo();
//async.series([
//    function (callback) {
//        console.log('mongoDB Clear')
//        Mongo.clear();
//        callback(null,'mongoDB has cleared.')
//    },
//    function (callback) {
//        console.log('crawl 26348030')
//        zhihuCrawl("http://www.zhihu.com/collection/26348030");
//        callback(null,'第一个爬虫结束')
//    },
//    function (callback) {
//        console.log('crawl 38624707')
//        zhihuCrawl('http://www.zhihu.com/collection/38624707');
//        callback(null,'第二个爬虫结束')
//    },
//    function (callback) {
//        console.log('crawl 26815754')
//        zhihuCrawl('http://www.zhihu.com/collection/26815754');
//        callback(null,'第三个爬虫结束')
//    },
//    function (callback) {
//        console.log('mongoDB generate JSON')
//        Mongo.generateJSON({},{richText:false,_id:false},rootPath+'/1001girls.json')
//        callback(null,'mongoDB JSON 生成完成')
//    }], function (error, data) {
//        if(error)
//            console.log(error)
//        console.log(data)
//    }
//);

function zhihuCrawl(rootURL) {
    var c = new Crawler({
        maxConnections: 10,
        // This will be called for each crawled page
        callback: function (error, result, $) {
            // $ is Cheerio by default
            //a lean implementation of core jQuery designed specifically for the server
            if (typeof $ === 'function') {
                $('.zm-item').each(function (index, content) {
                    parseContent(content);
                });

                $('a').each(function (index, a) {
                    var toQueueUrl = $(a).attr('href');
                    //console.log("toQueueUrl\t"+typeof toQueueUrl === 'string'+"\t"+toQueueUrl);
                    if (typeof toQueueUrl === 'string' && isNeededCraw(rootURL.substr(31,9)+toQueueUrl)) {
                        console.log(new Date() + "\turl:" + rootURL+toQueueUrl);
                        c.queue(rootURL + toQueueUrl);
                    }
                });
            } else if (typeof $ === 'string') {
            }
        },
        debug: false
    });
    c.queue(rootURL)
}
Mongo.clear();
zhihuCrawl("http://www.zhihu.com/collection/26348030");
zhihuCrawl('http://www.zhihu.com/collection/38624707');
zhihuCrawl('http://www.zhihu.com/collection/26815754');
Mongo.generateJSON({},{richText:false,_id:false},rootPath+'/001.json')




function parseContent(content) {
    var defaultCheerioOptions = {
        normalizeWhitespace: false,
        xmlMode: true,
        decodeEntities: true
    };
    var $ = cheerio.load(content, defaultCheerioOptions);

    var i_title = $('.zm-item-title').children('a').text();
    var i_author = $('.zm-item-rich-text').attr('data-author-name');
    var i_richText = $('textarea').text();
    var i_images = [];
    var i_img_url='';
    var i_index;
    var i_identify;
    var autherImage = 100;

    authorIndex++;

    $('img').each(function (index, img) {
        var imgurl = $(img).attr('src');    //图片原始url
        var imgName =  1000 + i_author + (1000 + authorIndex) + path.extname(imgurl);   //图片重命名
        if(crawImages) {
            setTimeout(function () {
                request(imgurl).pipe(fs.createWriteStream(rootPath + '/' + imgName));
            }, authorIndex * 1000);
        }
        i_img_url = imgName;    //存入数据库中的img_url字段
        i_identify = imgurl.substr(imgurl.length-20,16);
    });
console.log(i_img_url)
    if(isNeededParse(i_identify)) {
       //数据库中存在，那就不要爬喽
        $ = cheerio.load(i_richText, defaultCheerioOptions);    //解析rich_text中的文本，获得更多大图

        $('img').each(function (index, img) {
            var imgurl = $(img).attr('src');
            var imgName = (1000 + authorIndex) + i_author + autherImage++ + path.extname(imgurl);
            var timeout = authorIndex * 5000 + Math.floor(Math.random() * 100) * autherImage + Math.floor(Math.random() * 10);

            if (crawImages) {
                setTimeout(function () {
                    console.log(new Date().toTimeString() + ' start downloading:\t' + imgName);
                    request(imgurl).pipe(fs.createWriteStream(rootPath + '/' + imgName));
                }, timeout);
            }
            i_images = i_images.concat({"img_url": imgName});
            i_index = 1000 + authorIndex;
        });
        console.log(i_index)
        var girl = {
            title: i_title,
            author: i_author,
            img_url: i_img_url,
            richText: i_richText,
            images: i_images,
            index: i_index,
            identify: i_identify
        };

        if (i_img_url.length != 0) {    //没有图片的不存。
            Mongo.add(girl);
        }
    };
}


function isNeededCraw(url){
    if(gone.indexOf(url)>=0)
        return false;
    gone = gone.concat(url);
    if(url.length<5)
        return false;
    var sub = url.substr(9,5);
    if(url === '?page=1')
        return false;
    else if(sub === "?page")
        return true;
    else if(sub ==="/ques")
        return false;
    else
        return false;
}

function isNeededParse(identity){
    if(passName.indexOf(identity)>=0)
        return false;
    passName = passName.concat(identity);
    return true;
}
