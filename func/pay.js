/*

创建人:钟宝森
创建时间:2017-02-07 16:03:36

更新时间:2017-03-18 17:00:44
更新内容：把业务型函数封装成通用型函数

更新时间:22017-04-20 10:54:31
更新内容：更新说明
*/

var WXPay = require('weixin-pay');
var Fiber = require('fibers');

var config = require('../func/config.js');
var request = require('../func/request.js');

var url = require("url");            //解析GET请求  
var query = require("querystring");    //解析POST请求
var parseString = require('xml2js').parseString;
var moment = require('moment');
var cipher = require('../func/cipher.js');

var pay = {};

/* [支付宝下单 */

    var request = require('request');
	var fs = require('fs');
	var crypto = require('crypto');

	
	
	/*对待签名参数进行签名方法*/
	function signer(algorithm,key,data){
    var sign = crypto.createSign(algorithm);
    sign.update(data, 'utf-8');
    sig = sign.sign(key,'base64','utf-8');
    return sig;
	}

/*
封装的方法：Alireturn
subject = 商品名称
body = 商品描述
total_fee = 总金额
notify_url = 回调网址
out_trade_no = 订单编号
*/

/*
支付宝下单支付
privatePem 支付宝私钥证书{string} (必传)
publicPem 支付宝公钥证书 {string} (必传)
data 传入的数据 {object} (必传)
格式:
var privatePem = './config/rsa_private_key.pem';
var publicPem = './config/rsa_public_key.pem';
var data = {};
data.partner = "2088521599218220";
data.seller_id = "link@abcaaa.top";
data.notify_url = "http://zyktest.zyk-hlk.com:9090/pay/";
data.show_url = "http://baidu.com";
data.id = "15817319768_20170318160436";
data.商品 = "XXXXX";
data.金额 = 0.01;
var ali = pay.Alireturn(data);
console.log(ali);
*/

pay.Alireturn = function (privatePem,publicPem,data){

	var jsons = {};

	if(typeof(data) != "object" || data == ""){
		jsons.状态 = "传入参数不完整或有误";
		return jsons;
	}

	if(data.partner == null || data.partner == ""){
		jsons.状态 = "支付宝合作者身份ID不能为空";
		return jsons;
	}

	if(data.seller_id == null || data.seller_id == ""){
		jsons.状态 = "卖家支付宝账号不能为空";
		return jsons;
	}

	if(data.notify_url == null || data.notify_url == ""){
		jsons.状态 = "回调地址不能为空";
		return jsons;
	}

	if(data.show_url == null || data.show_url == ""){
		jsons.状态 = "展示地址不能为空";
		return jsons;
	}

	

	var info = data;
	
	var subject = info.商品;
	var total_fee = (Number(info.金额)).toFixed(2);
	var body = cipher.aesencode(info.账号+'|'+total_fee,cipher.md5(info.id));
	var algorithm = 'RSA-SHA1';    //加密算法类型
	var out_trade_no = info.id;    //生成以时间开头后10位随机数的订单号
	var notify_url = encodeURIComponent(info.notify_url);   //回调网址
	var show_url = encodeURIComponent(info.show_url);   //展示网址
	var privatePem = fs.readFileSync(privatePem);
	if(!privatePem){
		jsons.状态 = "私钥读取失败";
		return jsons;
	}
	var publicPem = fs.readFileSync(publicPem);
	if(!publicPem){
		jsons.状态 = "公钥读取失败";
		return jsons;
	}
	
	var ldata = 'service="mobile.securitypay.pay"&partner="'+partner+'"&_input_charset="UTF-8"&body="'+body+'"&out_trade_no="'+out_trade_no+'"&payment_type="1"&seller_id="'+seller_id+'"&subject="'+subject+'"&total_fee="'+total_fee+'"&it_b_pay="1d"&notify_url="'+notify_url+'"&show_url="'+show_url+'"';   //传输的数据
	var key = privatePem.toString();
	var sig = signer(algorithm,key,ldata); //对订单进行签名
	
	var pubkey = publicPem.toString();
	var yanzheng = crypto.createVerify('RSA-SHA1').update(ldata, 'utf-8').verify(pubkey, sig, 'base64');//验证数据，通过公钥、数字签名 =》是原始数据
	
	var encodesig = encodeURIComponent(sig);   //把签完名作为URI 组件进行编码
	
	if(yanzheng == true){
		//console.log("------------公钥签名匹配------------");
		jsons.状态 = "成功";
		var 内容 = ldata+'&sign="'+encodesig+'"&sign_type="RSA"';

		var logs = require('./logs.js');

        //下单日志
        logs.write('pay/alipay','\n\n【'+data.类别+'_支付宝】\n'+moment().format('YYYY-MM-DD HH:mm:ss')+'\n'+内容);
		jsons.支付返回 = encodeURIComponent(内容);
	}else{
		//console.log("------------公钥签名不匹配------------");
		jsons.状态 = "下单失败";
		jsons.支付返回 = "";
	}

	 return 返回值;
}

/* ]支付宝下单 */





/* [微信订单查询 */
pay.wx_look = function(id){
	    var pay = config.get('pay');
		var 时间戳 = Date.now();
		时间戳 = ((String)(时间戳)).slice(0,10);	
		var wxpay = WXPay({
			appid: pay.微信支付.appid,
			mch_id: pay.微信支付.mch_id,
			partner_key: pay.微信支付.partner_key //微信商户平台API密钥
			//pfx: fs.readFileSync('./wxpay_cert.p12') //微信商户平台证书
		});
		var result = {};
	    var fiber = Fiber.current;

	wxpay.queryOrder({
		transaction_id: id
	}, function(err, data){
		result = data;
		fiber.run();
		
	});	

	Fiber.yield();
	return result;
}
/* ]微信订单查询 */




/*[微信支付下单*/
/*
appid 应用ID {string} (必传)
mch_id 微信支付商户号 {string} (必传)
partner_key 微信商户平台API密钥 {string} (必传)
html 服务器异步通知页面路径 {string} (必传)
data 传入的数据 {object} (必传)
格式:
var appid = "wxb4b9aebf38287f88";
var mch_id = "1369941002";
var partner_key = "5f09850e702fd461a106802b24a31605";
var html = "http://zyktest.zyk-hlk.com:9090/pay/";
var data = {};
data.id = "15817319768_20170318160436";
data.商品 = "XXXXX";
data.金额 = 0.01;

其中appid是应用ID
其中mch_id是微信支付商户号
其中partner_key是微信商户平台API密钥
其中html服务器异步通知页面路径
其中id是订单id
商品是商品名称
金额是下单金额
*/
pay.Winxinorder = function(appid,mch_id,partner_key,html,data){

	var jsons = {};

    if(typeof(data) != "object" || data == ""){
		jsons.状态 = "传入参数不完整或有误";
		return jsons;
	}

	if(data.appid == null || data.appid == ""){
		jsons.状态 = "支付宝合作者身份ID不能为空";
		return jsons;
	}

	if(data.mch_id == null || data.mch_id == ""){
		jsons.状态 = "卖家支付宝账号不能为空";
		return jsons;
	}

	if(data.partner_key == null || data.partner_key == ""){
		jsons.状态 = "回调地址不能为空";
		return jsons;
	}

	if(data.html == null || data.html == ""){
		jsons.状态 = "展示地址不能为空";
		return jsons;
	}
	   
       
	    var info = data;

		var 时间戳 = Date.now();
		时间戳 = ((String)(时间戳)).slice(0,10);	
		var wxpay = WXPay({
			appid: data.appid,
			mch_id: data.mch_id,
			partner_key: data.partner_key //微信商户平台API密钥
			//pfx: fs.readFileSync('./wxpay_cert.p12') //微信商户平台证书
		});
		info.金额 = Number(info.金额) * 100;
		info.金额 = (info.金额).toFixed(0);
		var result = {};
	    var fiber = Fiber.current;
		wxpay.createUnifiedOrder({
			body: info.商品,
			out_trade_no: info.id,
			total_fee: info.金额,
			spbill_create_ip: '0.0.0.0',
			notify_url: info.html,
			trade_type: 'APP',
			product_id: '1234567890'
		}, function(err, data){

			if(err){
				result = err;
			}else{
				result = data;				
			}

            fiber.run();
						
		});	

			Fiber.yield();


			var ret = {
				appid: result.appid,
				partnerid: mch_id,
				prepayid: result.prepay_id,
				noncestr: result.nonce_str,
				timestamp: 时间戳,
				package: 'Sign=WXPay',
		
			};
		
			ret.sign = wxpay.sign(ret);

			var logs = require('./logs.js');

			//下单日志
			logs.write('pay/wx/','\n\n【'+info.商品+'_微信支付】\n'+moment().format('YYYY-MM-DD HH:mm:ss')+'\n'+JSON.stringify(ret));
			
			if( result.result_code == 'SUCCESS')
				ret.状态 = '成功';
			else
				ret.状态 = result.err_code_des;
			return ret;
}
/*]微信支付下单*/





module.exports = pay;