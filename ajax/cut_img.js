//
//                                  _oo8oo_
//                                 o8888888o
//                                 88" . "88
//                                 (| -_- |)
//                                 0\  =  /0
//                               ___/'==='\___
//                             .' \\|     |// '.
//                            / \\|||  :  |||// \
//                           / _||||| -:- |||||_ \
//                          |   | \\\  -  /// |   |
//                          | \_|  ''\---/''  |_/ |
//                          \  .-\__  '-'  __/-.  /
//                        ___'. .'  /--.--\  '. .'___
//                     ."" '<  '.___\_<|>_/___.'  >' "".
//                    | | :  `- \`.:`\ _ /`:.`/ -`  : | |
//                    \  \ `-.   \_ __\ /__ _/   .-` /  /
//                =====`-.____`.___ \_____/ ___.`____.-`=====
//                                  `=---=`
//                  ~~~~~~~ 佛祖保佑         永无bug~~~~~~~
/*
创建内容：剪切图片
时间 ：2017.05.25

*/

var cipher = require('../func/cipher.js');
var config = require('../func/config.js');
var pgdb = require('../func/pgdb.js');
var path = require("path");
var fs = require('fs');
var moment = require("moment");
var images = require("images");
module.exports.run = function(body, pg,mo) {
    var f = body;
    var p= {};
    if (!f.img_list){
        p.状态='图片入参为空';
        return p;
    }
    if (!f.widths){
        f.widths =400;
    }
    if (!f.heights){
        f.heights=400;
    }
    var type = f.img_list.split('.')[1];
    type ="png";
    var dates = moment().format("YYYYMMDDHHmmss");
    var ran = parseInt(Math.random() * 89999 + 10000);
    var newName =dates+ran;
     f.saveurl ='./temp/'+newName+"."+type;
     console.log(f.saveurl);

    var address =__dirname.replace(/ajax/,"/temp/");
    var saveAddrs = path.normalize(address + newName +"."+type);
    console.log(saveAddrs);
    //压缩
    console.log();
    if (f.type =="resize"){
        images(f.img_list)                     //加载图像文件
                .resize(f.widths)                        //等比缩放图像到400像素宽
                .save( f.saveurl, {               //保存图片到文件,图片质量为50
                    quality : 50
                });

        fs.unlink(f.img_list, function() {	//fs.unlink 删除用户上传的文件

        });

    }else if(f.type =="drop"){
        console.log("dropddddddddddddddddddddd");
        console.log(f.widths+"///"+f.heights+"/..."+f.x+"///"+f.y);
        images(images(f.img_list),Number(f.x),Number(f.y),Number(f.widths),Number(f.heights))   //复制图片 x，y。w h
                /*.resize(Number(f.widths))*/
                .save(f.saveurl, {               //保存图片到文件,图片质量为50
                    quality : 50
                });

        fs.unlink(f.img_list, function() {	//fs.unlink 删除用户上传的文件

        });
        console.log("stopdropddddddddddddddddddddd");
    }

    p.name =saveAddrs;
    p.状态 ="成功";
    return p;

};


