/**
 * Created by liborange on 15/11/21.
 */
var fs = require('fs');
var path = require('path');
var request = require('request')
var async = require('async')
var flag = true;
var i_author=0;

async.series([
        function(callback){
            //setTimeout(function(){
            console.log(10000000000)
                callback(null, 'helloworld');
            //}, 200);
        },
        function(callback){
            console.log(20000000000)
            setTimeout(function(){
                callback(null, 'ok,that is runing');
            }, 100);
        }
    ],
    function(err, results) {
        console.log(results)
        // results is now equal to: {one: 1, two: 2}
    });

    setTimeout(function () {
        //for(var j=0;j<10000-100*v;j++);
        console.log(i);
        request("https://pic1.zhimg.com/3e6a5fc573935bf93410b0037aba8eb4_b.jpg").pipe(fs.createWriteStream(i_author + ".jpg"));
    }, i_author++ * 1000 + Math.floor(Math.random() * 100) * 10 * Math.floor(Math.random() * 10));


for(var i=0;i<10;i++){
    (function (v) {
        setTimeout(function () {
            for(var j=0;j<10000-100*v;j++);
            console.log('for 2 :'+v);
        }, 0);
    })(i)
}
console.log('end');

function isTrue(){
    setTimeout(function () {
        flag = false;
    },100)
}

//⬇️  这个例子说明，出现异步之后会马上返回，继续执行下面的代码，所以在if里面使用异步代码返回布尔值仍然有效，无非是整个被作为异步执行。
if(isTrue()){
    console.log('true')
}else
    console.log('false');
console.log('flag\t'+flag)

console.log(path.extname('https://pic3.zhimg.com/059eeee3ce8a1d9c406d787a261fd142_xld.jpg'))
