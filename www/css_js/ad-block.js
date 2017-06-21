// append ad block into doms
/*
  How to use it ?
  var ads = [
    [text, url, vip, date],
    [text, url, vip, date]
  ];
  var dom = document.getElementById('ads');
  appendAdBlock(dom, ads)
*/
function appendAdBlock(dom, ads) {
  var html = '';
  html += '<div class="ad-block"><ul>';
  for (var i = 0; i < ads.length; i++) {
    // 超时
    if (new Date(ads[i][3]) >= new Date()) {
      html += '<li><a href="' + ads[i][1] + '" target="_blank" class="' + (ads[i][2] ? 'red': '') + '">' + ads[i][0] + '</a></li>';  
    }
  }
  html += '</ul></div>';
  dom.innerHTML = html;
};

var ads = [
  ['极简网页即时聊天系统', 'http://layim.layui.com/?from=atool', 1, '2017-05-31'],
  ['2017年最牛逼的伪原创工具', 'http://www.zhipaiwu.com/', 0, '2017-05-31'],
  ['个人社保代缴(自助缴社保)', 'http://www.shebao520.com/?code=atool', 0, '2017-03-29'],
  ['在线高级epub阅读器', 'http://neat-reader.com/', 1, '2017-02-10'],
  ['激情美女直播秀', 'http://www.shouzhiba.com/', 0, '2017-02-15'],
  ['小程序开发/源码下载', 'http://www.makexcx.com/#atool', 1, '2017-02-27'],
  ['萝莉控福利', 'http://www.luolik.pw/?=atool', 1, '2017-02-25'],
  ['【b3qude】阿里云 vps 推荐码', 'http://www.atool.org/', 0, '2020-02-01'],
  ['笑话数据库30元含代码', 'https://item.taobao.com/item.htm?_u=hnglqm17b03&id=43742195779', 0, '2020-02-01'],
  ['短信验证码，十分钟接入', 'https://www.mysubmail.com/sms?s=atool', 1, '2017-05-25'],
  ['动态指纹二维码识别制作', 'http://ewm.videaba.com/', 0, '2017-04-07'],
  ['banner 免费 logo 制作', 'http://www.zhaoxi.net/', 1, '2017-04-25'],
  ['梦达网贷工作室代办贷款信用卡', 'http://www.mengda918.com/', 0, '2017-04-07'],
  ['加群：优惠广告位(150/月)', 'http://www.atool.org/', 1, '2020-02-01'],
];
var dom = document.getElementById('ad-blocks');
appendAdBlock(dom, ads);
