/**
 * Created by liborange on 15/11/24.
 */
var qiniu = require('qiniu');
var path = require('path');
var fs = require('fs');
qiniu.conf.ACCESS_KEY = 'V7CVs-e_z0_7PgFepeVaBYH1_NaWhaQUurPWHQ2i'
qiniu.conf.SECRET_KEY = 'NywsUnjk9YFrtnRzD8tGaTVhCGTlH87i75C__eBS'

var uptoken = uptoken('liborange');
var dir = path.resolve(__dirname,'../../public/zhihu');
function upload(dir){
    var fileList = fs.readdirSync(dir);
    fileList.forEach(function (item) {
        if(fs.statSync(dir+'/'+item).isFile()){
            upload(dir+'/'+item,item,uptoken);
        }
    })

}



function uploadFile(localFile, key, uptoken) {
    var extra = new qiniu.io.PutExtra();
    //extra.params = params;
    //extra.mimeType = mimeType;
    //extra.crc32 = crc32;
    //extra.checkCrc = checkCrc;

    qiniu.io.putFile(uptoken, key, localFile, extra, function(err, ret) {
        if(!err) {
            // 上传成功， 处理返回值
            console.log(ret.key, ret.hash);
            // ret.key & ret.hash
        } else {
            // 上传失败， 处理返回代码
            console.log(err);
            // http://developer.qiniu.com/docs/v6/api/reference/codes.html
        }
    });
}

function uptoken(bucketname) {
    var putPolicy = new qiniu.rs.PutPolicy(bucketname);
    //putPolicy.callbackUrl = callbackUrl;
    //putPolicy.callbackBody = callbackBody;
    //putPolicy.returnUrl = returnUrl;
    //putPolicy.returnBody = returnBody;
    //putPolicy.asyncOps = asyncOps;
    //putPolicy.expires = expires;

    return putPolicy.token();
}
console.log('helloworld')  ;
function hello(){
    console.log('ok')
}
hello();