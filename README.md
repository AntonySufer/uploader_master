###  文件上传 app.js 设置

...
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
...
...
###  图片上传

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

...







