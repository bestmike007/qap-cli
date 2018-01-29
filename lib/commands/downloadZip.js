var work_path = process.cwd();
var path = require('path');
var fs = require('fs-extra');
var colors = require('colors');
var IP = require('ip');
var fork = require('child_process').fork;

function getZipUrl(options) {
    try {
        var work_path = process.cwd();

        // console.log(options.output);
        // console.log(path.join(work_path, options.output));
        if(options.output && fs.existsSync(path.join(work_path, options.output))){
            startFileServer();
            var relativePath = options.output;
            return ('http://' + IP.address() + ':5500/' + relativePath + '?_qap_package=true&_app_id='+getZipName() + "&t=" + (new Date().getTime())).replace('\\', '/')
        }

        var packageJson = require(process.cwd() + '/package.json');
        var startBuild = require('./start-gulp-buld.js').startBuild;

        var _outputDir = path.join(work_path, '_output');
        var zipUrl = path.join(_outputDir, getZipName()+ '.zip');
        if (!fs.existsSync(zipUrl)) {
            console.log('请先打包再重试');
            // startBuild(function() {
            //     if (fs.existsSync(zipUrl)) {
            //     	startFileServer();
            //         return local2NetUrl(zipUrl);
            //     } else {
            //         //编译后还是找不到路径
            //         console.log('请运行package命令后重试'.red);
            //     }
            // })
        } else {
        	startFileServer();
            return local2NetUrl(zipUrl);
        }
    } catch (e) {
    	console.log(e);
        console.log('请在qap工程目录下运行该命令'.red);
    }
}

function startFileServer() {
	//var http_server_path = require('http-server');
    //console.log('__dirname:' + __dirname);
    var http_server_path = path.join(__dirname, '../', '../', 'node_modules', 'http-server', 'bin', 'http-server');
    console.log('\http_server_path:' + http_server_path);
    const ls = fork(http_server_path, [work_path, '-p', '5500'], {
        stdio: ['pipe', 1, 2, 'ipc'],
        cwd: work_path,
        env: process.env
    });
    ls.on('error', (err) => {
        console.error(`error: ${err}`.red);
    });
}

function local2NetUrl(localZip) {
    var relativePath = path.relative(work_path, localZip);
    return ('http://' + IP.address() + ':5500/' + relativePath + '?_qap_package=true&_app_id='+getZipName() + "&t=" + (new Date().getTime())).replace('\\', '/')
}

function getZipName() {
    try {
        var packageName = require(path.join(work_path, 'package.json')).name;
        if (packageName === undefined) packageName = 'index';
        if (packageName.indexOf('/') > -1 || packageName.indexOf('\\') > -1) {
            packageName = 'index';
        }

        return packageName;
    } catch (e) {
        console.log('请在qap工程目录下运行该命令'.red);
    }
}

exports.getZipUrl = getZipUrl;
