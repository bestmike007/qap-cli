//var localServerPort = process.argv[2];
var fs = require('fs-extra');
const util = require('util');
const utils = require('./utils.js');
var path = require('path');
var child_process = require('child_process');
var crypto = require('crypto');
var querystring = require('querystring');
const http = require('http');
var Promise = require('promise');
//var http_server = require('node-http-server');
var http_server = require(path.join(__dirname, 'mynode-http-server', 'http.js'));
var portMapping = require(path.join(__dirname, 'port_mapping', 'mapping.js')).mapping;
var work_path = process.cwd();
var Config = require('./weex_devtool/lib/components/Config.js');

const TEMPLATE_QEBROOT = '\n<script type="text/javascript">\n'+
    'window.__QAP__ = window.__QAP__ || {};\n'+
    '__QAP__.package = {\n'+
        'config: <%- qap_json %>\n'+
    '};\n'+
    '__QAP__.package.config.WebRootPath = "<%= debugWebRootPath %>";\n'+
'</script>\n';

function start(ip, localServerPort) {
    try {
        //var webpackconfig = require(path.join(work_path, 'webpack.config.js'));
        var devWebpackConfig = utils.getWebpackConfig().dev;

        //var stats = fs.lstatSync(path.join(work_path, 'h5'));
        var portList = [];
        var domains = {};
        var rootPath = work_path;
        if (fs.existsSync(path.join(work_path, 'h5'))) {
            var dirList = fs.readdirSync(path.join(work_path, 'h5'));
            rootPath = path.join(work_path, 'h5');
            dirList.forEach(function(item) {
                //console.error("item:" + item);
                if (fs.statSync(path.join(work_path, 'h5', item)).isDirectory()) {
                    var isContainPort = true;
                    var item_port;
                    var item_domainOrIp;
                    var index = item.length;
                    for (; index >= 0; index--) {
                        if (item[index] == '_') {
                            break;
                        } else {
                            var c = item[index];
                            if (c < '0' || c > '9') {
                                isContainPort = false;
                            }
                        }
                    }
                    if (isContainPort && index != 0) {
                        item_port = item.substring(index + 1);
                        item_domainOrIp = item.substring(0, index);
                    } else {
                        item_domainOrIp = item;
                        item_port = 80;
                    }
                    domains[item_domainOrIp] = path.join(work_path, 'h5', item);
                    portList.push(item_port);
                }
                //domains['qianniu-cli'] = work_path;
                //domains['qrcode'] = path.join(__dirname,"/../../assets/html/");
            });
        }

        var jssdkJson = utils.getJSSDKJsonSync();

        console.log('cmm--->', domains);
        var config = new http_server.Config;
        config.verbose = false;
        config.port = localServerPort;
        config.root = rootPath;
        config.domain = 'myapp.com';
        config.domains = domains;
        config.contentType.xml = 'text/xml';
        config.contentType.jsp = 'text/html';
        config.contentType.zip = 'application/zip';

        http_server.beforeServe = function(request, response, body, encoding) {

            return new Promise(function(resolve) {

                // console.log('请求:' + request.url);
                if (request.url == undefined) {
                    resolve('');
                } else if (request.url.indexOf('Manifest.xml') >= 0) {
                    //console.log('Manifest.xml')
                    response.statusCode = 200;
                    response._headers = { 'content-type': 'text/xml' };
                    body.value = fs.readFileSync(path.join(work_path, 'Manifest.xml'), 'utf8');
                    //console.log('value:' + body.value);
                    resolve('');
                } else if (request.url.indexOf('qap.json') >= 0) {
                    //console.log('Manifest.xml')
                    response.statusCode = 200;
                    response._headers = { 'content-type': 'text/json' };
                    body.value = fs.readFileSync(path.join(work_path, 'qap.json'), 'utf8');
                    //console.log('value:' + body.value);
                    resolve('');
                }else if (request.url.indexOf('__qap=js') >= 0 || request.url.indexOf('/build/') >= 0) {
                    var jsUrl = 'http://' + Config.ip + ':' + devWebpackConfig.port + request.url.replace('html', 'js');
                    
                    var qapJsonPath = {};
                    try{
                        qapJsonPath = require(path.join(process.cwd(), 'qap.json'));
                    }catch(ex){
                        console.log(ex);
                    }
                    //var qapJsonPath = require(path.join(process.cwd(), 'qap.json'));

                    qapJsonPath.appKey = "";
                    var debugWebrootUrl = 'http://' + Config.ip + ':8080' + devWebpackConfig.output.publicPath;
                    var qapStr = "JSON.parse(decodeURIComponent('" + encodeURIComponent(JSON.stringify(qapJsonPath)) + "'))";
                    //jsUrl = jsUrl.replace('__qap=js', '');
                    //console.log('jsUrl:' + jsUrl);
                    response.statusCode = 200;
                    response._headers = { 'content-type': 'text/html' };

                    var TEMPLATE_WEEX_HTML_PATH = path.join(process.cwd(), "template.html"); //初始项目路
                    //console.log(TEMPLATE_WEEX_HTML_PATH)
                    var templateExist = true;
                    var html_templ = undefined;
                    try {
                        fs.accessSync(TEMPLATE_WEEX_HTML_PATH, fs.F_OK);
                    } catch (e) {
                        // It isn't accessible
                        TEMPLATE_WEEX_HTML_PATH = path.join(__dirname, "/../../assets/weex_template/weex_index_debug.html"); //初始项目路
                        html_templ = fs.readFileSync(TEMPLATE_WEEX_HTML_PATH, 'utf8');
                        templateExist = false;
                    }

                    if(templateExist){
                        html_templ = fs.readFileSync(TEMPLATE_WEEX_HTML_PATH, 'utf8');
                        //hh.slice(0, hh.indexOf('<scritp')).concat('<aaa></bbb>').concat(hh.slice(hh.indexOf('<scritp')))
                        html_templ = html_templ.slice(0, html_templ.indexOf('<script')).concat(TEMPLATE_QEBROOT).concat(html_templ.slice(html_templ.indexOf('<script')));
                    }
                    var htmlResult = html_templ.replace('<%= bundleJs %>', jsUrl).replace('<%= debugWebRootPath %>', debugWebrootUrl).replace('<%- qap_json %>', qapStr);
                    //console.log('--->' + jssdkJson.webURL);
                    body.value = htmlResult.replace('https://a.alipayobjects.com/g/qap/jssdk/1.0.3/index.js', jssdkJson.webURL).replace('<%= jssdk %>', jssdkJson.webURL).replace('https://os.alipayobjects.com/qapprod/f59c4f98-a8e7-47a3-abd8-aafb48920cef/index.js', jssdkJson.webURL);
                    resolve('');
                } else {
                    resolve('');
                }
            });
        }

        http_server.deploy(config);

        //console.log("local server start successfully! { ip : 127.0.0.1, port : " + localServerPort + "}");

    } catch (e) {
        console.log(":" + e);
    }
}


exports.start = start;
//change to origin uid
//if (originUid) process.setuid(originUid);
