var config = require('../func/config.js');
var pgdb = require('../func/pgdb.js');
var md5 = require('MD5');
var alioss = require('../func/alioss.js');

module.exports.run = function (body, pg, mo) {
    var f =body;
    var p = {};

    var conf = config.get("alicloud").阿里云参数;

    var client = alioss.init(conf.region, conf.accessKeyId, conf.accessKeySecret);

    var data = alioss.listBucket(client);


    var data1 = alioss.list(client, 'zyk-club', { 'max-keys': 100 });

    if (data1.状态 != "成功") {
        p.状态 = data1.状态;
    }

    var name = [];

    for (i = 0; i < data1.数据.length; i++) {
        name.push(data1.数据[i].name);
    }

    console.log(name);

    var success_num = 0;
    var fail_num = 0;

    //var data1 = alioss.put(client,'zyk-club','dragen.jpg','./tempup/VA.jpg');

    console.log("---------data1----------");
    console.log(data1);
    console.log("---------data1----------");

    for (i = 0; i < name.length; i++) {
        var data = alioss.get(client, 'zyk-club', name[i], './temp/lalala' + i + '.jpg');
        if (data.状态 != "成功") {
            console.log("第" + (i + 1) + "条获取失败");
            fail_num = fail_num + 1;
        }
        else {
            console.log("第" + (i + 1) + "条获取成功");
            success_num = success_num + 1;
        }

    }

    p.状态 = "成功";
    p.内容 = "下载成功" + success_num + "个," + "下载失败" + fail_num + "个";
    return p;

}