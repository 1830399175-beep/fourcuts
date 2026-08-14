// 本地 HTTPS 服务器 — 手机摄像头调试用
var https = require('https');
var fs = require('fs');
var path = require('path');

// 生成自签名证书
var { createCertificate } = require('pem');
createCertificate({ selfSigned: true, days: 365 }, function(err, keys) {
  if (err) { console.error(err); return; }
  var options = { key: keys.serviceKey, cert: keys.certificate };
  var mime = {
    '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css',
    '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml', '.ttf': 'font/ttf', '.otf': 'font/otf',
    '.gif': 'image/gif', '.webm': 'video/webm',
  };
  https.createServer(options, function(req, res) {
    var filePath = '.' + req.url.split('?')[0];
    if (filePath === './') filePath = './index.html';
    var ext = path.extname(filePath);
    fs.readFile(filePath, function(err, data) {
      if (err) { res.writeHead(404); res.end('Not found'); return; }
      res.writeHead(200, { 'Content-Type': mime[ext] || 'application/octet-stream' });
      res.end(data);
    });
  }).listen(8443, '0.0.0.0', function() {
    console.log('HTTPS 服务器已启动: https://0.0.0.0:8443');
  });
});
