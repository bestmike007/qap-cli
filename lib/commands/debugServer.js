/**
 * 关于代码规范
 * 所有模块、类库 引入后使用首字母大写的驼峰形式，
 * 本地变量与函数使用首字母小写的驼峰形式
 * module内的闭包变量（相当于module 作用域内的全局变量）如果用于储存信息，由于容易产生泄露，所以必须使用_开头的驼峰形式用于区分
 * 像下面代码中的packageInfo由于是只读的所以不需要加_
 */
'use strict';

var os = require('os');
var ifaces = os.networkInterfaces();

var Path = require('path');
var DebugServer = require('./weex_server/lib/DebugServer.js');
var Config = require('./weex_server/lib/components/Config.js');
var Fs = require('fs-extra');
var IP = require('ip');
var child_process = require('child_process');
var degrade = require('./degrade.js');
var utils = require('./utils');
var prompt = require('prompt');
var fork = require('child_process').fork;
var Promise = require('promise');
var colors = require('colors');
var open = require('open');

/**
 * 在工程根目录下启动weex debug的服务器
 *
 * 使得可以使用weex的debug工具调试
 * 监听8088端口，该端口也会在生成的二维码中体现
 *
 * @returns  void
 *
 * @date     2016-08-02
 * @author   mingming.cmm
 */
function startServerAndLaunchDevtool(userInputIp) {
    var LaunchDevTool = require('./weex_server/lib/util/LaunchDevTool.js');
    var port = 8088; //方便调试，暂时使用weex debug tool的默认端口
    var ip = userInputIp || IP.address();
    Config.ip = ip;
    console.info('start debugger server at http://' + ip + ':' + port);

    startStaticFileServer(ip, 8080);

    if (Config.entryBundleUrl) {
        Config.entryBundleUrlForTaobao = 'http://' + ip + ':' + port + '/devtool_fake.html?_wx_tpl=' + encodeURIComponent(Config.entryBundleUrl);
    }
    if (Config.root) {
        console.log('\nDirectory[' + Program.file + '] has been mapped to http://' + ip + ':' + port + '/' + Config.bundleDir);
    }

    console.info('\nThe websocket address for native is ws://' + ip + ':' + port + '/debugProxy/native');
    DebugServer.start(port);
    LaunchDevTool(ip, port);
}

exports.debug = startServerAndLaunchDevtool;

