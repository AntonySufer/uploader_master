/***
 *  阿里云图片上传
 *  创建时间：2017.04.25
 *
 *  func =aliupload
 *  {
 *    "img_list":"a,b,c"
 *  }
 *
 */
var config = require('../func/config.js');
var pgdb = require('../func/pgdb.js');
var md5 = require('MD5');
var alioss = require('../func/alioss.js');
var moment = require("moment");


module.exports.run = function(body,pg,mo){
	var f = body;
    var p = {};
    if (!f.img_list){
      p.状态='图片入参为空';
      return p;
    }
     console.log(f);
    var conf = config.get("alicloud").阿里云参数;
    var client = alioss.init(conf.region,conf.accessKeyId,conf.accessKeySecret);
    var imgList = f.img_list.split(","); //获取图片数组
    var success_num = 0;
    var fail_num = 0;

    console.log("---------开始上传----------");
    var dataList =[];
     if (imgList && imgList.length>0){
         for(i=0;i<imgList.length;i++){
             var oldname =imgList[i];
             oldname = oldname.split('temp\\')[1]; //截取"E:\develop\workspaces\develop1.9.1\temp\2017050816232142150.png" ==》2017050816232142150.png
             var ttt = moment().format("YYYYMMDDHHmmss");
             var ran = parseInt(Math.random() * 89999 + 10000);
             var newName = ttt + ran;
             console.log(imgList[i]+"////////////////////////");
             var data = alioss.put(client,'zyk-club',newName,'./temp/'+oldname);
             console.log(data);
             if(data.状态 !="成功"){
                 console.log("第"+(i+1)+"条上传失败");
                 fail_num = fail_num + 1;
             }
             else{
                 console.log("第"+(i+1)+"条上传成功");
                 console.log("上传的url地址:"+data.url);
                 success_num = success_num + 1;
                 dataList.push(data.url);
             }

            if(imgList.length == 1){
                 break;
            }

         }
     }else{
         p.成功条数 = 0;
         p.失败条数 = 0;
         p.图片列表 ="";
         p.状态 = "图片入参为空";
         return;
     }
    p.成功条数 = success_num;
    p.失败条数 = fail_num;
    p.图片列表 =dataList;
    p.状态 = "成功";
    p.内容 = "上传成功"+success_num+"个,"+"上传失败"+fail_num+"个";
    return p;
        
}
