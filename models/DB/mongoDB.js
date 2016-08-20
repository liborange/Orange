/**
 * Created by liborange on 15/11/19.
 */
var mongoose = require('mongoose');
var fs=  require('fs')
var path = require('path')

var schema = new mongoose.Schema({
    author: String,
    title: String,
    img_url: String,
    describe: String,
    images: [],
    richText: String,
    nice: Number,
    index: Number,
    identify: String
});
function Mongo(){
    var self = this;
}
mongoose.connect('mongodb://localhost/zhihuGirls');
var mongo = mongoose.model('mongo', schema);


Mongo.prototype.add = function Create(json){
    var self = this;
    self.createConn();
    mongo.create(json,function(error){
        if(error)
        console.log(error);
        //else
        console.log('create successful on '+new Date()+"\t")
        self.closeConn();
    })

}

Mongo.prototype.select = function Read(json){
    mongo.find(json,function(error,data){
        if(error)
            console.log(error);
        else
            return data;
    })
}

Mongo.prototype.generateJSON = function (query, condition, file) {
    var self = this;
    self.createConn();
    mongo.find(query,condition,function (error, data) {
        if(error)
            console.log(error)
        else{
            var jsonstr = JSON.stringify(data);
            console.log('查询到'+jsonstr.length+'条记录，正在写入文件')
            fs.open(file,'w+', function (error, fd) {
                fs.write(fd,jsonstr,0,jsonstr.length, function (error, num) {
                    if(error){
                        console.log(error)
                    }else{
                        console.log('写入：'+num+' 字节');
                        self.closeConn();
                    }
                })
            })
        }
    })

};
 Mongo.prototype.clear = function () {
     var self = this;
     this.createConn();
     mongo.remove({}, function (error,num) {
         console.log('removed '+num);
         self.closeConn();
     })
 };

Mongo.prototype.notExist = function (str,callback) {
    var self = this;
    self.createConn();
    mongo.find({identify:str}, function (error, data) {
        if(error)
            return false;
        else if(data.length === 0)
            callback();
        else {
            console.log('已经存在，无需再爬');
            self.closeConn();
        }
    })
}
Mongo.prototype.createConn = function () {
    //if(mongo===null)
    //    mongoose.connect('mongodb://localhost/zhihuGirls');
    //mongo = mongoose.model('mongo', schema);
}
Mongo.prototype.closeConn = function () {
    //mongo = null;
    //mongoose.connection.close(function () {
    //
    //});
}
module.exports = Mongo;