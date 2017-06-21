var config = require('../func/config.js');
var pgdb = require('../func/pgdb.js');
var md5 = require('MD5');
var alioss = require('../func/alioss.js');


module.exports.run = function (body, pg, mo) {

      console.log(body);

      return body;

}