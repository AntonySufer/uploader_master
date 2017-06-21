1.8.0更新说明:
1.ejs模板增加子目录功能。
2.ejs模板增加重定向功能。
3.增加sqlite本地数据库功能。
4.ejs增加不使用渲染功能。


1.7.0更新说明:
1.增加ejs模板功能，.ejs模板文件请放在www目录内(不要加子目录，暂时不支付子目录),功能文件请放在routes目录(不要加子目录，暂时不支付子目录，),功能文件与ejs模板文必须相同名字才可以使用。
2.增加新的防并发限制方法(具体使用方法请参考禅道系统内相应文档)。
3.优化redisdb.js相应方法(具体使用方法请参考禅道系统内相应文档)。
4.config/app.js文件增加相应说明。





1.6.0更新说明:
1-增加XML解析模块(xml2map);
2-优化api.js和ajax.js文件;



1.5.0更新说明:
2-增加pm2部署配置文件start.json，服务器启动可以使用pm2 start start.json命令。
3-start.json文件有内存超限重启和api,ajsx,config目录内文件变动重启功能。
4-增加redisdb模块(王治提供)。
5-增加公共头部share模块(钟宝森提供)。
6-修改api.js主模块(增加手动释放对象及纤程代码)。
7-config/app.json配置文件增加servername参数(mong日志将以此参数区分老版本请参照加入)。
8-加入https模块。config/app.json配置文件中修改https监听端口(参数=0不启动)，config/https.key和config/https.pem是证书文件。



1.4.0更新说明:
1-将各种服务端口号写入config配置文件。
2-加入内存级缓存模块memory-cache。
3-增加request.server函数,服务器间访问功能。
4-加入mongodb数据库，mongodb可以与pg同时或替换使用。



1.3.0更新说明:
1-将pgdb数据库事务放到接口外自动加载，不需要编写接口人员处理。
2-写了扫码购买积分jifenchongzhi_getuser和jifenchongzhi_xiadan两个范例(ajax接口)。


1.2.0更新说明:
1-增加ajax.post*异步调用接口
2-增加session模块(ajax接口中调用为body.session)


1.1.0版本更新说明:
1.增加静态目录功能(可以存放html文件及资源文件,test.html测试页面也在其中)。
2.增加common常用功能模块。




更新说明:
1.除config目录外，其它目录文件全部覆盖就好。






安装说明:
1.将整个文件夹解压
2.删除node_modules目录
3.运行npm install命令
4.修改app.js参数(重点修改postgreqsl参数和mongodb参数)





1.目录结构:
apimain.js//启动文件
package.json//工程配置文件
_logs//日志目录
api//接口目录
    api/api.js//主接口必须存在
config//配置目录
    app.js//主配置文件必须存在(包括数据库配置)
func//功能目录
node_modules//第三方模块目录




//测试网地址
http://127.0.0.1:8080/test.html







2.api开发使用范例(具体使用方法请参考禅道系统内相应文档,以下仅供参考)

//XML解析模块

//XML解析模块引用
var xml2map = require('xml2map');
//XML解析
var xml = "<to>George</to>";
var s = xml2map.tojson(xml);


---redisdb  Redis数据库同步函数(王治)---

//引用
var redisdb = require('../func/redisdb.js');

open 打开redis连接

close 关闭redis连接

select 选择存储的redis数据库

rpush key value 在列表中添加一个或多个值

blpop key timeout  移出并获取列表的第一个元素， 如果列表没有元素会阻塞列表直到等待超时或发现可弹出元素为止

brpop key timeout  移出并获取列表的最后一个元素， 如果列表没有元素会阻塞列表直到等待超时或发现可弹出元素为止

hset key field value  将哈希表 key 中的字段 field 的值设为 value 

hget key field 获取存储在哈希表中指定字段的值

expire key timeout 给指定的key设置过期时间

hmset key field1 value1 [field2 value2 ]  同时将多个 field-value (域-值)对设置到哈希表 key 中

hgetall key 获取在哈希表中指定 key 的所有字段和值

hexists key field 查看哈希表key中指定的字段是否存在 

hdel key field2 [field2] 删除一个或多个哈希表字段

set key value  给指定key赋value值

get key value  获取指定key的值

del key 删除key

---redisdb  Redis数据库同步函数(王治)---



---share  API模块头部公用(钟宝森)---

//引用
var share = require('./public/share.js');


/*
公用头部
@method
@param {string} accout是前台传入的账号
@param {string} random是前台传入的随机码
@param {object} pg是从run传入的参数
*/
var top = share.top(accout,random,pg);


/*
防并发头部处理
@method
@param {string} accout是前台传入的账号
@param {string} func是前台传入的func号
@param {string} uuid是生成的uuid,在body中传入
@param {object} pg是从run传入的参数
*/

var con = share.con_start("15817319768","get_info",body.uuid,pg);


/*
防并发尾部处理
@method
@param {string} id为con_start里成功后的并发id,处理完业务逻辑后传入可删除
@param {object} pg是从run传入的参数
*/
share.con_end(con.并发id,pg);


加入mongo模块（mongoDB）

var logs = mongo.save(mongodb,'logs',data);

data.logs = mongo.find(mo,'aaa',{"a":"b"});


//memory-cache内存缓存模块
var cache = require('memory-cache');

cache.put('foo', 'bar');

cache.get('foo');

//设置缓存时间
cache.put('houdini', 'disappear', 100);




//不重复uuid
var uuid = require('uuid');

//RFC4122 V1 版本
var id = uuid.v1();
//RFC4122 V4 版本
var id = uuid.v4();


//日期时间 moment 第三方模块(详细方法请参考http://momentjs.cn/docs/)
var moment = require("moment");

//当前时间
var date = moment().format('YYYY-MM-DD HH:mm:ss');

//今天周几
var weekday = moment().weekday();


//音译(transliteration)模块，支持中文转拼音或生成 slug(详细方法请参考https://github.com/andyhu/node-transliteration)


var tr = require('transliteration');

tr.transliterate('你好, world!'); // Ni Hao , world!
tr.slugify('你好, world!'); // ni-hao-world




cipher加密模块
//引用
var cipher = require('../func/cipher.js');	
//aes加密
var str = cipher.aesencode('1234567890','12345678901234567890123456789012');
console.log(str);

//aes解密
var str1 = cipher.aesdecode(str,'12345678901234567890123456789012');
console.log(str1);

//md5加密
var str2 = cipher.md5('123456');
console.log(str2);

//sha1加密
var str3 = cipher.sha1('123456');
console.log(str3);




txsms 腾讯短信模块
//引用
var txsms = require('../func/txsms.js');

//语音验证码
var msg = txsms.yy_yzm('13602567887','1234');
console.log(msg);

//发送短信
var msg = txsms.sendsms('13602583377','您的本次验证码为1234请您妥善保管!谢谢使用!');
console.log(msg);



pgdb pg数据库模块
//引用
var pgdb = require('../func/pgdb.js');

//语句执行
var data = pgdb.query(client,insertsql);




logs 日志写入模块

var logs = require('../func/logs.js');

logs.write('sql','错误语句:'+sql+'错误信息:'+err.stack);


request 请求模块
var request = require('../func/request.js');

//GET请求
request.get('http://www.baidu.com');




var body = {};
body.func = 'login';
body.words = '12345678901234567890123456789012'+str;
//post 请求
var re = request.post('http://121.43.176.35:8080/api.post',body);




var url = 'http://121.43.176.35:8080/api.post';

var func = 'login';
var data = '11111';
var re = request.server(url,func,data);


融云模块

var rin = rongcloud.init();

// var d = rongcloud.user.getToken('13602567887','LVFM','http://yilianyun.10ss.net/img/iconfont-weibiaoti2.png');
// var d = rongcloud.user.refresh('13602567887','LVFM','http://yilianyun.10ss.net/img/iconfont-weibiaoti2.png');
// var d = rongcloud.user.checkOnline('13602567887');
// var d = rongcloud.user.block('13602567887',1);
// var d = rongcloud.user.unblock('13602567887');
// var d = rongcloud.user.block.query();
// var d = rongcloud.user.blacklist.add('13602567887','13602533317');
// var d = rongcloud.user.blacklist.remove('13602567887','13602533317');
// var d = rongcloud.user.blacklist.query('13602567887');


var content = {"content":"hello","extra":"helloExtra"};

// var d = rongcloud.message.private.publish('13602567887','13602533317','RC:TxtMsg',JSON.stringify(content),'pushContent','pushData');
// var d = rongcloud.message.system.publish('13602567887','13602533317','RC:TxtMsg',JSON.stringify(content),'pushContent','pushData');
// var d = rongcloud.message.group.publish('13602567887','100011','RC:TxtMsg',JSON.stringify(content),'pushContent','pushData');
// var d = rongcloud.message.chatroom.publish('13602567887','1111','RC:TxtMsg',JSON.stringify(content),'pushContent','pushData');

// var d  = rongcloud.message.broadcast('System','RC:TxtMsg',JSON.stringify(content),'pushContent','pushData');



var group = {
"10001":"testGroup1",
"10002":"testGroup2",
"10003":"testGroup3"
};

// var d = rongcloud.group.sync('13602533317',group);
// var d = rongcloud.group.create('13602533317','100005','NewGroup');
// var d = rongcloud.group.join('13602533317','100005','NewGroup');
// var d = rongcloud.group.quit('13602533317','100005');
// var d = rongcloud.group.dismiss('13602533317','100005');
// var d = rongcloud.group.refresh('13602533317','100005');




common 常用功能

//去除数据中含有null的
// var a = common.removenull("{"账号":null,"手机号码":null}");
// var b = {"账号":null,"手机号码":null};
// var a = common.removenull(b);


//取当前时间的几天后或几月后
// var a = common.afterDM("2015-02-01 00:00:00","day",1);
// var a = common.afterDM("2015-02-01 00:00:00","month",1);


//获取范围内的随机数
// var a = common.sjs("1000","9999");

//获取两个时间的差
var d = common.timeSecond(time1,time2);


//截取中间字符串
// var str = "hello world"
// var a = common.getsub(str,"h","o");
// console.log(a);  //ell


