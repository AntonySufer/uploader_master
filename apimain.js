var express = require('express');
var Fiber = require('fibers');
var http = require('http');
var https = require('https');
var url = require('url');
var fs = require('fs');
var path = require("path");
var querystring = require('querystring');
var uuid = require('uuid');
var session = require('express-session');
var moment = require("moment");
var config = require('./func/config.js');//引用config目录内的config.js文件//执行读取缓存文件配置方法(必须在使用之前调用,缓存具体使用方法请参考config.js注释)

var cipher = require('./func/cipher.js');
var logs = require('./func/logs.js');

var version ='1.9.0';

console.log('version:'+version);

config.readfile();

/**进程错误监控*/

process.on('uncaughtException', function (err) {
    console.log(err.stack);
    logs.write('err',err.stack);
});


process.on('SyntaxError', function (err) {
    console.log(err.stack);
    logs.write('err',err.stack);
});

/**进程错误监控*/

/**http服务及https服务*/

var app = express();

//redis存储session
if(config.get('app').redis.使用 == '是'){

    var RedisStrore = require('connect-redis')(session);
    var cf = {
        "cookie" : {
            "maxAge" : 360000
        },
        "sessionStore" : {
            "host" : config.get('app').redis.host,
            "port" : config.get('app').redis.port,
            "pass" : config.get('app').redis.password,
            "db" : config.get('app').redis.sessionDB,
            "ttl" : 1800,
            "logErrors" : true
        }
    };

    app.use(session({
        name : "hy-go",
        secret : 'Asecret123-',
        resave : true,
        rolling:true,
        saveUninitialized : false,
        cookie : cf.cookie,
        store : new RedisStrore(cf.sessionStore)
    }));



}else{

    app.use(session({
        resave:true,
        secret: uuid.v4(), //secret的值建议使用随机字符串
        saveUninitialized: true,
        cookie: {maxAge: 360000} // 过期时间（毫秒）
    }));


}







var server = http.createServer(app);

server.listen(config.get('app').main.httpPort, function() {
    console.log("HTTP SERVER 启动成功! 监听端口:"+ config.get('app').main.httpPort);
});


if(config.get('app').main.httpsPort != 0 || config.get('app').main.httpsPort != '0'){

    //https证书配置
    var options = {
        key : fs.readFileSync('./config/https.key'),
        cert :fs.readFileSync('./config/https.pem')
    }

    //https监听启动
    https.createServer(options, app).listen(config.get('app').main.httpsPort, function () {
        console.log('Https server  启动成功! 监听端口:' + config.get('app').main.httpsPort);
    });


}


app.use(express.static('www'));


app.post('/api.post',function(req,res){

    var body = '';
    req.on('data', function(chunk){
        body += chunk;
    });

    req.on('end', function(){
        try{
            console.log('-----------------接收参数-----------------');
            console.log(body);
            console.log('-----------------接收参数-----------------');
            body = querystring.parse(body);
            //调用开始时间毫秒数
            body.startTime = new Date().getTime();
            body.date = moment().format('YYYY-MM-DD HH:mm:ss');
            body.ip = req.ip;
            body.uuid = uuid.v4();
            if(body.func == undefined || body.words == undefined){
                res.send('{"code":"-2","msg":"func or words undefined "}').end();
            }else{
                //截取数据解密
                var key = body.words.substr(0, 32);
                var data = cipher.aesdecode(body.words.substr(32, body.words.length),key);
                if(data == null){
                    res.send('{"code":"-3","msg":"words decode error"}').end();
                }else{

                    body.receive = JSON.parse(data);
                    var api = require('./api/api.js');
                    var bool = api.searchfile(body.func);
                    if(bool){
                        api.index(req,res,body);
                    }else{
                        res.send('{"code":"-4","msg":"not find func or words "}').end();
                    }
                }

            }

        }catch(e){
            console.log(e);
            res.send('{"code":"-1","msg":"body error"}').end();
        }


    });


});


app.post('/ajax.post*',function(req,res){

    var body = '';
    req.on('data',function(chunk){
        body += chunk;
    }).on('end',function(){
        try{
            console.log('-----------------接收参数-----------------');
            console.log(req.url+body);
            console.log('-----------------接收参数-----------------');
            var path = url.parse(req.url,true).query;
            body = querystring.parse(body);
            if(path.func != undefined){
                body.func = path.func;
            }else if(body.func == undefined){
                res.send('{"code":"-45","msg":" not find func "}').end();
                return;
            }
            body.session = req.session;
            body.path = req.path;
            body.arg = url.parse(req.url, true).query;
            body.startTime = new Date().getTime();
            body.date = moment().format('YYYY-MM-DD HH:mm:ss');
            body.ip = req.ip;
            body.uuid = uuid.v4();
            var ajax = require('./ajax/ajax.js');
            var bool = ajax.searchfile(body.func);
            if(bool){
                ajax.index(req,res,body);
            }else{
                res.send('{"code":"-4","msg":" not find func "}').end();
            }

        }catch(e){
            console.log(e);
            res.send('{"code":"-1","msg":"body error"}').end();
        }
    });

});
app.set('views', path.join(__dirname, 'www'));
// app.use(express.static(path.join(__dirname, 'views')));
app.set("view engine",'ejs');
// app.engine('ejs', require('ejs').renderFile);
// app.set('view engine', 'html');


app.get('/*.xhtml',function(req,res){
    var data = {};
    data.method = "GET";
    data.path = req.path;
    data.arg = url.parse(req.url, true).query;
    data.startTime = new Date().getTime();
    data.session = req.session;
    data.date = moment().format('YYYY-MM-DD HH:mm:ss');
    data.ip = req.ip;
    data.uuid = uuid.v4();
    var main = require('./routes/app_routes_main.js');
    main.index(req,res,data);
});

app.post('/*.xhtml',function(req,res){

    var body = '';
    req.on('data', function(chunk){
        body += chunk;
    }).on('end',function(){
        var data = {};
        data.method = "POST";
        data.path = req.path;
        data.arg = url.parse(req.url, true).query;
        data.data = querystring.parse(body);
        data.startTime = new Date().getTime();
        data.session = req.session;
        data.date = moment().format('YYYY-MM-DD HH:mm:ss');
        data.ip = req.ip;
        data.uuid = uuid.v4();
        var main = require('./routes/app_routes_main.js');
        main.index(req,res,data);
    });
});


//404处理
// app.use(function(req, res, next) {
//   res.status(404).send('Sorry cant find that!');
// });

/**http服务及https服务*/


var schedule = require('node-schedule');

/**定时任务--每分钟执行一次*/
var rule = new schedule.RecurrenceRule();
var times = [0,30];
rule.second = times;
var timeStart = schedule.scheduleJob(rule, function(){


    if(config.get('app').postgresql.使用 == '是'){
        var pgdb = require('./func/pgdb.js');
        console.log("postgresql当前连接数"+pgdb.pool._count);
        console.log("postgresql可用连接数"+pgdb.pool._availableObjects.length);
    }

    if(config.get('app').mongodb.使用 == '是'){
        var mongo = require('./func/mongo.js');
        console.log("mongodb当前连接数"+mongo.pool._count);
        console.log("mongodb可用连接数"+mongo.pool._availableObjects.length);
    }

    if(config.get('app').redis.使用 == '是'){
        var redisdb = require('./func/redisdb.js');
        console.log("redis当前连接数"+redisdb.pool._count);
        console.log("redis可用连接数"+redisdb.pool._availableObjects.length);
    }

    if(config.get('app').postgresql_two.使用 == '是'){
        var pgdb = require('./func/pgdb.js');
        console.log("postgresql_two当前连接数"+pgdb.pool_two._count);
        console.log("postgresql_two可用连接数"+pgdb.pool_two._availableObjects.length);
    }


});



//form表单需要的中间件。
var mutipart= require('connect-multiparty'); //表单中间件
var ffmpeg = require('fluent-ffmpeg');//转码插件

var mutipartMiddeware = mutipart();
app.use(mutipart({uploadDir:__dirname + "/temp/"})); //设置文件存储位置

//这里就是接受form表单请求的接口路径，请求方式为post。
app.post('/upload_movie',mutipartMiddeware,function (req,res) {
    var data = {};
    //成功接受到浏览器传来的文件。我们可以在这里写对文件的一系列操作。例如重命名，修改文件储存路径 。等等。
    var files = req.files.files[0];
    console.log(files);
    //压缩视频
    var file_path =files.path;
    var file_name =files.originalFilename;//名称
    var name_temp =new Date().valueOf();
    var newpath = path.normalize(__dirname + '/temp/'+name_temp+'.mp4');
     //判断是不是mp4
        var bitrate =files.size;
        //size 大于5M 压缩
        if(bitrate >5242880) {
            var trans = new ffmpeg({source: file_path})
                    .setFfmpegPath(__dirname + '/temp/ffmepg/bin/ffmpeg.exe') //转码执行文件
                    .videoBitrate('2000k', true)
                    .format('mp4')  //转码格式
                    .save(newpath)
                    .on('end', function () { //转码完成
                        console.log('转码完成!');
                        //删除源文件
                        fs.unlink(file_path);	//fs.unlink 删除用户上传的文件
                        data.newpath = newpath;
                        data.状态 = '成功';
                        res.send(data).end();
                    })
                    .on('progress', function (progress) {
                        //进度条
                        console.log('上传中。。。');
                    })
                    /* .screenshots({ //截图
                     //  timestamps: [30.5, '50%', '01:10.123'],
                     count: 1,
                     filename: name_temp+'.png',
                     folder: __dirname + '/temp/'
                     });*/
        }else{
            //小于直接上传
            console.log(file_path);
            data.newpath = file_path;
            data.状态 = '成功';
            res.send(data).end();
        }
});






//文件上传
var formidable = require('formidable');
app.post("/temp",function(req,res){
    var data = {};
    var form = new formidable.IncomingForm();//实例化formidable对象
    var dir = path.normalize(__dirname + "/temp/");//路径
    form.uploadDir = dir;//更改上传地址
    if(fs.existsSync(dir) == false) {
        fs.mkdirSync(dir);
    }
    form.parse(req, function(err, fields, files) {//图片传入及解析
        if(err) {
            data.状态 = '文件保存失败';
            res.send(data).end();
        }else{
            var length = 0;
            for (item in files) {
                length++;
            }
            if (length === 0) {
                data.状态 = '文件保存失败';
                res.send(data).end();
                return;
            }
            for (item in files) {
                var file = files[item];
                var type = file.name.split('.')[1];
                var ttt = moment().format("YYYYMMDDHHmmss");
                var ran = parseInt(Math.random() * 89999 + 10000);
                var oldpath = file.path;
                var newName = ttt + ran;
                var newpath = path.normalize(__dirname + "/temp/" + newName + "." + type);
                fs.rename(oldpath, newpath, function(err) {
                    if(err) {
                        data.状态 = '文件改名失败';
                        res.send(data).end();
                    } else {
                        data.状态 = '成功';
                        data.newpath = newpath;
                        res.send(data).end();
                    }
                });
            }
        }
    });
});




