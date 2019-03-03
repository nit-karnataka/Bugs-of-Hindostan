var http = require('http');
var fs = require('fs');

function getFile (){

  var file = fs.createWriteStream("./user3.pdf");
  var options = {
    host: 'localhost',
    port: 3000,
    path:   "https://www.clinicalkey.com/service/content/pdf/watermarked/3-s2.0-B9780323612722000149.pdf?locale=en_US",
    headers: {
     'Proxy-Authorization': 'Basic ' + new Buffer('library@hindujahospital.com:rkmlib123#').toString('base64')
   }         
  }
  var req = http.get(options, function(res) {
    res.pipe(file);
    });
}

getFile();