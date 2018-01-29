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

var path = require('path');

var DebugServer = require('./weex_devtool/lib/DebugServer.js');

var Config = require('./weex_devtool/lib/components/Config.js');
var fs = require('fs-extra');
var IP = require('ip');
var child_process = require('child_process');
var degrade = require('./degrade.js');
var utils = require('./utils');
var prompt = require('prompt');
var fork = require('child_process').fork;
var Promise = require('promise');

var open = require('open');
var fetch = require('node-fetch');
function checkPortElectron(options) {

}

function startUsbPortRevert(portArray) {
    portArray.map((item) => {
        //adb reverse tcp:8080 tcp:8080
        console.log('adb reverse tcp:' + item + ' tcp:' + item);
        child_process.exec('adb reverse tcp:' + item + ' tcp:' + item,
            (error, stdout, stderr) => {
                if (error) {
                    console.error(`exec error: ${error}`);
                    return;
                }
            });
    })
}

function getJSSDKUrl(options) {
    return new Promise(function (resolve, reject) {
        let version = 'release'
        if (typeof options === 'string') {
            version = options;
        }
        var jssdkJson = 'https://unpkg.cnpmjs.org/qap-sdk-pack@' + version + '/package.json';
        resolve(jssdkJson);
    });
}

function checkUpdateJSSDK(options, cb) {
    getJSSDKUrl(options).then(function (jssdkUrl) {
        try {
            console.log('jssdkUrl:' + jssdkUrl);
            utils.getWebpackConfig().dev;

            var sdkJsonPath = path.join(process.cwd(), '.jssdk.json');
            fs.ensureFileSync(sdkJsonPath);

            var sdkJson = undefined;
            try {
                sdkJson = require(sdkJsonPath);
            } catch (ex) {
                console.log('获取内嵌版本信息...');
            };

            var date = new Date();
            var dateNow = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
            if (!options.forceUpdate && sdkJson && sdkJson.update_time && sdkJson.update_time == dateNow) {
                cb()
            } else {
                //需要更新jssdk
                jssdkUrl && fetch(jssdkUrl)
                    .then(function (res) {
                        return res.json();
                    }, function (reject) { }).then(function (json) {
                        sdkJson = json;
                        sdkJson.update_time = dateNow;
                        sdkJson.publishTag = options.beta ? "beta" : "latest";
                        //存储至本地，并更新qap.json
                        fs.writeFile(sdkJsonPath, JSON.stringify(sdkJson, null, 2), 'utf-8', function (err) {
                            updateQapJson(sdkJson).then(function(onUpdate) {
                                cb();
                            })
                        });
                    }, function (reject) { });
            }
        } catch (e) {
            console.log(e);
        }
    }, function (reject) {
        console.log('reject:' + reject);
    });


    //var jssdkUrl = options.beta ? "https://unpkg.cnpmjs.org/qap-sdk-pack@beta/package.json" : "https://unpkg.cnpmjs.org/qap-sdk-pack@latest/package.json";
    //var jssdkUrl = options.beta ? "https://unpkg.cnpmjs.org/qap-sdk-pack@beta/package.json" : "https://unpkg.cnpmjs.org/qap-sdk-pack@latest/package.json";

}

function updateQapJson(sdkJson) {
    return new Promise(function (resolve, reject) {
        try {
            var qapJsonPath = path.join(process.cwd(), 'qap.json');
            var qapJson = require(qapJsonPath);
            // console.log('qapJson:' + JSON.stringify(qapJson));

            // qapJson.min_qn_android = sdkJson.compatibility.qn.android;
            // qapJson.min_qn_ios = sdkJson.compatibility.qn.ios;
            // qapJson.jssdk = sdkJson.version;

            if (fs.existsSync(path.join(process.cwd(), "template.html"))) {
                var templateContent = fs.readFileSync(path.join(process.cwd(), "template.html"), 'utf8');
                templateContent = templateContent.replace('https://a.alipayobjects.com/g/qap/jssdk/1.0.3/index.js', sdkJson.webURL);
                templateContent = templateContent.replace(/https\:\/\/gw\.alipayobjects\.com\/os\/qapprod\/.*\/index.js/, sdkJson.webURL);
                templateContent = templateContent.replace('<%= jssdk %>', sdkJson.webURL);
                fs.writeFileSync(path.join(process.cwd(), "template.html"), templateContent);
            }

            //不再对qap.json进行读写
            // fs.writeFile(qapJsonPath, JSON.stringify(qapJson, null, 2), 'utf-8', function(err) {
            //     resolve("");
            // });
        } catch (ex) {
            reject(ex);
            console.log(ex);
        }
    });

}

function checkPort(options) {
    if (options.log) {
        Config.verbose = true;
    }
    utils.checkPortIsFreeSync().then(function (value) {
        if (value.length > 0) {
            prompt.start();
            var property = {
                name: 'yesno',
                message: '端口被占用，是否释放相关端口（可能会关闭你的浏览器）? (y/n)'.red,
                validator: /y[es]*|n[o]?/,
                warning: 'Must respond yes or no',
                default: 'yes'
            };
            prompt.get(property, function (err, result) {
                if (result.yesno === 'yes' || result.yesno === 'y') {
                    console.dir(value)
                    value.map(function (item) {
                        //kill $(lsof -t -i:3000)
                        if (process.platform === 'darwin') {
                            console.log('kill -9 $(lsof -t -i:' + item + ')');
                            child_process.exec('kill -9 $(lsof -t -i:' + item + ')',
                                (error, stdout, stderr) => {
                                    if (error) {
                                        console.error(`exec error: ${error}`);
                                        return;
                                    }
                                });
                        }
                    });

                    setTimeout(function () {
                        start(options);
                    }, 1500);
                }
            });
        } else {
            start(options);
        }
    });
}

function start(options) {
    try {
        if (options.usb) {
            var devWebpackConfig = utils.getWebpackConfig().dev;
            var needChecked = [parseInt(devWebpackConfig.port), 8080, 8088];
            // utils.checkAndroidDevices().then(function(onFulfilled, onRejected){

            // })
            startUsbPortRevert(needChecked);
            startGulpDeV('127.0.0.1');
        } else {
            startCheckHosts(options).then(function (onFulfilled, onRejected) {
                if (!onRejected) { //如果未发生错误
                    //console.log('onFulfilled:' + onFulfilled)
                    startGulpDeV(onFulfilled);
                }
            });
        }
    } catch (ex) {
        console.log(ex);
    }

}

function startCheckHosts(options) {

    var localHosts = [];

    Object.keys(ifaces).forEach(function (ifname) {
        var alias = 0;

        ifaces[ifname].forEach(function (iface) {
            if ('IPv4' !== iface.family || iface.internal !== false) {
                // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
                return;
            }

            if (iface.address) localHosts.push(iface.address);
            if (alias >= 1) {
                // this single interface has multiple ipv4 addresses
                //console.log('aa' + ifname + ':' + alias, iface.address);
            } else {
                // this interface has only one ipv4 adress
                //console.log('bb' + ifname, iface.address);
            }
            ++alias;
        });
    });

    if (localHosts.length == 0) {
        console.error('无法获取本机IP，请确定当前PC已经联网！'.red);
    }

    var itemPromise = new Promise(function (resolve) {
        if (options.host) { //用户输入了ip，则判断该ip是否正确
            if (localHosts == undefined || localHosts.indexOf(options.host) < 0) {
                console.error(('请确认' + options.host + '是当前PC的IP').magenta);
                console.error(('可选IP：' + JSON.stringify(localHosts)).magenta);
            }
            console.log(('使用IP:' + options.host).green);
            resolve(options.host);
        } else {

            if (localHosts.length >= 2) {
                console.log(('检测到您有多个IP地址，请使用--host 指定正确的IP，如：qap debug --host ' + localHosts[0]).magenta);
                var valuePair = [];

                require('./itemSelecter').select(localHosts, resolve);

                //reject('multiple ip address');
            } else {
                resolve(IP.address());
            }


        }
    });

    return itemPromise;
}


function startGulpDeV(userInputIp, needOutput) {
    //const myEmitter = new MyEmitter();
    var firstRunDebug = true;
    var gulpPath = path.join(process.cwd(), 'node_modules', 'gulp', 'bin', 'gulp');
    const ls = fork(gulpPath, ['start',
        '--cwd', process.cwd()
    ], {
            stdio: [0, 1, 2, 'ipc'],
            cwd: process.cwd(),
            env: process.env,
            execArgv: ['--max-old-space-size=4096']
        });

    ls.on('exit', function (code, signal) {
        console.log('debug thread exit: {signal:' + signal + '}')
    });

    ls.on('error', (err) => {
        console.error(`error: ${err}`.red);
        myEmitter.emit('error', data);
    });
    ls.on('message', function (m) {
        if (firstRunDebug) {
            //var webpackconfig = require(Path.join(process.cwd(), 'webpack.config.js'));
            var devWebpackConfig = utils.getWebpackConfig().dev;

            if (Object.keys(devWebpackConfig.entry).length !== 0) {

                var devHost = "http://" + userInputIp + ":" + devWebpackConfig.port;
                //http://30.5.80.191:8080/build/index.html
                //open('http://' + userInputIp + ':8080' + devWebpackConfig.output.publicPath + 'index.html');
                var avalibleJs = [];
                for (var k in devWebpackConfig.entry) {
                    avalibleJs.push(k);
                }

                var qapDebugContnt = "{" + "\"ip\" : \"" + userInputIp + "\"," + "\"weexDebugPort\" : \"8088\"," + "\"qapFileServer\" : " + "\"http://" + userInputIp + ":8080/\"," +
                    // "\"serverUrl\" : \"http://" + location.hostname + ":8080"  + jsBundleFolder + "\"\n" +
                    "\"devServer\" : \"http://" + userInputIp + ":" + devWebpackConfig.port + devWebpackConfig.output.publicPath + "\"" + "}";
                var qapInfo = {
                    page: avalibleJs,
                    qrcode: encodeURIComponent(qapDebugContnt),
                    jsPath: devWebpackConfig.output.publicPath,
                    webpackPort: devWebpackConfig.port
                };
                //open(devHost + '/run.html?dist=' + devWebpackConfig.output.publicPath + '&we=index.js&avalible=' + avalibleJs.toString());

                startServerAndLaunchDevtool(userInputIp, qapInfo);
            }




            firstRunDebug = false;
        }
    });


    return ls;
}
/**
 * 在工程根目录下启动文件服务器
 *
 * 可以访问该工程下的任何文件，方便客户端读取Manifest.xml和bundle js文件
 * 监听8080端口，该端口也会在生成的二维码中体现
 *
 * @returns  void
 *
 * @date     2016-08-02
 * @author   mingming.cmm
 */
function startStaticFileServer(ip, port) {
    // var script = Path.join(__dirname, "./localH5Server.js");
    // var cmd = 'node';
    // if (process.platform === 'win32') {
    //     cmd = 'node.exe';
    // }
    // var child = child_process.spawn(cmd /*command*/ , [script, 8080] /*args*/ , { cwd: work_path, stdio: [0, 1, 2] } /*options, [optional]*/ );
    // child.on('error', function(err) {
    //     console.error("error on start local server on port 8800:" + err);
    //     return;
    // });

    require('./localH5Server.js').start(ip, port);

    // var _outputDir = Path.join(work_path, '.we');
    // Fs.emptydirSync(_outputDir);
    // //产生we目录
    // degrade.outputWe(_outputDir);
}

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
function startServerAndLaunchDevtool(userInputIp, qapInfo) {

    var LaunchDevTool = require('./weex_devtool/lib/util/LaunchDevTool.js');
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

    const WebSocket = require('ws');
    const wss = new WebSocket.Server({ port: 5667 });
    wss.on('connection', function connection(ws) {
        const clientIP = ws.upgradeReq.connection.remoteAddress;
        //console.log('连接设备', clientIP);
        ws.on('message', function incoming(message) {
            //console.log('received: %s', message);
        });

        //console.log('qapInfo.toString()', JSON.stringify(qapInfo));
        ws.send(JSON.stringify(qapInfo));
    });

    DebugServer.start(port);
    LaunchDevTool(ip, port);

}

exports.debug = startServerAndLaunchDevtool;
exports.checkPort = checkPort;
exports.startGulpDeV = startGulpDeV;
exports.checkUpdateJSSDK = checkUpdateJSSDK;
