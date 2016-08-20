/**
 * Created by liborange on 15/11/19.
 */
var mongo = require('./mongoDB');
var json = {
    author: "lbc",
    img_url: "https://liborage.cn/pic/1001",
    describe: "this is a 测试",
    otherImg: [{"img_url":"img's url"},{"img_url":"img's url"}],
    nice: 92,
}

var girl = new mongo({
    author: "fly",
    img_url: "https://liborage.cn/pic/1001",
    describe: "this is a 测试",
    otherImg: [{"img_url":"img's url"},{"img_url":"img's url"}],
    nice: 93,
});
girl.save(function (error) {
    if(error)
        console.log(error)
    else
        console.log(girl.toString());
})

//for(var i=0;i<10000;i++)
mongo.add(json);

mongo.find({nice: 92},function(error,data){
    if(error)
        console.log(error)
    else
        console.log(data.length)
})
mongo.find({nice: 93},function(error,data){
    if(error)
        console.log(error)
    else
        console.log(data.length)
})
console.log('end')