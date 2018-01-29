var request = require('request');
var open = require('open');
var path = require('path');

function a(android_url, ios_url) {
    var http = require('http'),
        fs = require('fs');


    fs.readFile('./index.html', function(err, html) {
        if (err) {
            throw err;
        }
        http.createServer(function(request, response) {
            response.writeHeader(200, { "Content-Type": "text/html" });
            response.write(html);
            response.end();
        }).listen(8000);
    });
}

function getAndroidDownloadUrl(body, tags) {
    var android_url_index = body.indexOf(tags[0]);
    var android_url = body.substring(android_url_index, body.indexOf(tags[1], android_url_index));
    return android_url.substring(android_url.indexOf(tags[2]), android_url.indexOf(tags[3]) + 4);
}

function getIOSDownloadUrl(body, tags) {
    var ios_url_index = body.indexOf(tags[0]);
    var ios_url = body.substring(ios_url_index, body.indexOf(tags[1], ios_url_index));
    return ios_url.substring(ios_url.indexOf(tags[2]) + 6,
        ios_url.indexOf('"', ios_url.indexOf(tags[3]) + 10));
}

function download_qrcode() {
    console.log('\n在线获取下载地址中...\n')
    request('http://open.taobao.com/docs/doc.htm?isPublish=0&docType=1&articleId=105523', function(error, response, body) {
        if (!error && response.statusCode == 200) {

            var qrcode = require('./qrcode-terminal/lib/main.js');

            var url_android = getAndroidDownloadUrl(body, ['qap_android_download', '_blank', 'http', '.apk"']);
            console.log('千牛-Android（稳定版）安装包：\n\n' + url_android + '\n');

            var url_android_dev = getAndroidDownloadUrl(body, ['qap_android_dev_download', '_blank', 'http', '.apk"']);
            console.log('千牛-Android(dev版本)安装包：\n\n' + url_android_dev + '\n');

            var url_android_x86 = getAndroidDownloadUrl(body, ['qap_android_x86_download', '_blank', 'http', '.apk"']);
            console.log('千牛-Android(x86版本)安装包：\n\n' + url_android_x86 + '\n');

            var url_iOS = getIOSDownloadUrl(body, ['qap_ios_download', '_blank', 'href="', 'href="'])
            console.log('\n\n千牛-iOS（稳定版）安装包：\n\n' + url_iOS + '\n');

            var url_iOS_dev = getIOSDownloadUrl(body, ['qap_ios_dev_download', '_blank', 'href="', 'href="'])
            console.log('\n\n千牛-iOS(dev版本)安装包：\n\n' + url_iOS_dev + '\n');

            var openUrl = 'http://127.0.0.1:8000/install_qrcode.html' + '?android=' +
                encodeURIComponent(url_android) + '&ios=' + encodeURIComponent(url_iOS) + 
                '&android_dev=' + encodeURIComponent(url_android_dev) +
                '&ios_dev=' + encodeURIComponent(url_iOS_dev) + 
                '&android_x86=' + encodeURIComponent(url_android_x86);
            //console.log(openUrl)
            //open(openUrl);

            var server = require('node-http-server');
            server.deploy({
                port: 8000,
                verbose: false,
                root: path.join(__dirname, 'front')
            });

            open(openUrl);

            setTimeout(function() {
                process.exit()
            }, 1000)

        } else {
            console.log('error:' + error);
        }
    })
}

exports.download_qrcode = download_qrcode;
