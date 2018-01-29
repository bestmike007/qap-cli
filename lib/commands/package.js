/**
 * 插件的发布打包功能
 * @author mingming.cmm
 */
'use strict';

var fs = require('fs-extra');
var archiver = require('archiver');
var path = require('path');
var child_process = require('child_process');
var util = require('util');
var walk = require('walk');
var fetch = require('node-fetch');
const url = require('url');

var utils = require('./utils');
var xsdSchema = require('./manifet.xsd').schema;

var degrade = require('./degrade.js');
var collector = require('nuke-collector');
var colors = require('colors');
var work_path = process.cwd();
var hasH5 = false;
var hasImage = false;

function genarateH5Url() {
    try {
        var needChange = false;
        var qapJson = require(process.cwd() + '/qap.json');
        qapJson.pages.forEach(function(item) {
            if(item.url && item.url.indexOf('qap://') > -1 && item.url.indexOf('qap:///')<0){
                console.log('\n打包提示：👇'.yellow);
                console.log('   为了更好地兼容性，请使用qap:///而不是qap://\n'.yellow);
            }
            if (item.capability && (item.h5Url == undefined)) {
                needChange = true;

                if (item.url && item.url.startsWith('http')) {
                    item.h5Url = item.url;
                } else {
                    var pageUrl = url.parse(item.url);
                    var fileName = pageUrl.pathname.endsWith('.js') ? pageUrl.pathname.substr(0, pageUrl.pathname.length - 3) + '.html' : pageUrl.pathname;
                    var relativePath = pageUrl.search ? fileName + pageUrl.search : fileName;
                    var h5Url = qapJson.WebRootPath.endsWith('/') ? qapJson.WebRootPath.substr(0, qapJson.WebRootPath.length - 1) + relativePath : qapJson.WebRootPath + relativePath; //new URL(relativePath, qapJson.WebRootPath);
                    item.h5Url = h5Url.toString();
                }

            }
        })

        if (needChange) {
            fs.writeFileSync(path.join(process.cwd(), 'qap.json'), JSON.stringify(qapJson, null, 2), 'utf-8');
        }
    } catch (ex) {
        //console.log(ex);
        //console.log('hello'.green); // outputs green text 
        console.log('\n打包提示：👇'.yellow);
        console.log('   1.qap.json中WebRootPath不是有效的http路径'.yellow);
        console.log('   2.qap.json中WebRootPath的文档: http://open.taobao.com/docs/doc.htm?treeId=260&articleId=106553&docType=1'.yellow);
        console.log('   3.不关心降级或者降级不适用QAP代码生成的H5网页可以忽略该提示！\n'.yellow);
    }

}

function package_single_jsbundle(jsBundles) {
    var _outputDir = path.join(work_path, '_output');
    fs.emptydirSync(_outputDir);
    fs.ensureDir(path.join(_outputDir, '.package'));
    fs.ensureDir(path.join(_outputDir, '.package', 'qap'));

    if (fs.existsSync(path.join(work_path, 'qap.json'))) {
        //fs.copySync(path.join(work_path, 'qap.json'), path.join(_outputDir, '.package', 'qap.json'), { clobber: true });
    } else {
        console.log(`请在项目根目录新建qap.json，详情：http://open.taobao.com/docs/doc.htm?treeId=260&articleId=106504&docType=1`);
        return;
    }

    if (jsBundles == undefined) {
        console.log('没有传递js bundle地址，qap package --online http://xxx.js,/home/xxx.js');
        return;
    }

    var qapJson = require(path.join(work_path, 'qap.json'));
    let countDown = jsBundles.length;
    jsBundles.forEach(function(item, index) {
        var bundleUrl = jsBundles[index];
        let fileName = Math.random().toString(36).substring(5, 10) + '.js';
        console.log('[' + index + '/' + jsBundles.length + ']获取' + bundleUrl);
        myfetch(bundleUrl).then(function(body) {
            //console.log('收到文件:' + bundleUrl);
            fs.writeFileSync(path.join(_outputDir, '.package', 'qap', fileName), body);

            if (qapJson.pages[index] == undefined) qapJson.pages[index] = {}

            if (index == 0) {
                qapJson.pages[index].default = true;
            }

            qapJson.pages[index].url = 'qap:///' + fileName;

            countDown = countDown - 1;
            if (countDown == 0) {
                fs.writeFileSync(path.join(_outputDir, '.package', 'qap.json'), JSON.stringify(qapJson, null, 2));

                singleZip(path.join(_outputDir, '.package'), path.join(_outputDir, 'package.zip'));
            }
        });
    })
}

function myfetch(url) {
    if (url && url.startsWith('http')) {
        return fetch(url).then(function(res) {
            return res.text(); })
    }

    return new Promise(function(resolve, reject) {
        fs.readFile(url, (err, data) => {
            if (err) {
                reject(err)
            } else {
                resolve(data)
            }
        });
    });
}

function singleZip(zipPath, destZipFile) {
    if (fs.existsSync(destZipFile)) {
        fs.removeSync(destZipFile);
    }

    var zip_output = fs.createWriteStream(destZipFile);
    var archive = archiver('zip', {
        level: 9
    });

    zip_output.on('close', function() {
        console.log(destZipFile + ":" + archive.pointer() + ' total bytes');
    });

    archive.on('error', function(err) {
        console.log(err);
    });

    archive.pipe(zip_output);
    if (fs.existsSync(path.join(zipPath, 'qap.json'))) {
        archive.file(path.join(zipPath, 'qap.json'), { name: 'qap.json' });
    }

    archive.directory(path.join(zipPath, 'qap'), 'qap');
    archive.finalize();
}
/**
 * 打包入口
 * 1.校验xml格式
 * 2.打包Manifest.xml、h5目录和bundle js目录
 */
function package_qn_platform() {
    //更改qap.json，产生h5Url
    genarateH5Url();

    collector.retcodeUpload({
        rootDir: process.cwd(),
        isIntranet: 'ISV'
    })

    var packageJson = require(process.cwd() + '/package.json');
    //var webpackConfig = require(process.cwd() + '/webpack.config');
    var prodWebpackConfig = utils.getWebpackConfig().prod;
    if(!prodWebpackConfig.externals){
        console.log('\n打包提示：👇'.yellow);
        console.warn('   1.该项目没有内置Nuke、QAP-SDK等组件，可能导致编译出的JS Bundle体积较大\n'.yellow);
    }


    //console.log("校验Manifest.xml格式...")
    // var manifestPath = path.join(work_path, 'Manifest.xml');
    // var validationErrors = valifyManifest(xsdSchema, manifestPath);
    // if (validationErrors) {
    //     console.error(util.inspect(validationErrors));
    //     return;
    // }

    var _outputDir = path.join(work_path, '_output');
    fs.emptydirSync(_outputDir);
    fs.ensureDir(path.join(_outputDir, '.package'));

    //h5、image、Manifest.xml、public、lifecycle、we
    if (fs.existsSync(path.join(work_path, 'h5'))) {
        hasH5 = true;
        fs.copySync(path.join(work_path, 'h5'), path.join(_outputDir, '.package', 'h5'), { clobber: true });
    }

    var imageSrc = packageJson.imageSrc || './image';
    if (imageSrc) {
        var imagePath = path.isAbsolute(imageSrc) ?
            imageSrc : path.join(work_path, imageSrc);
        if (fs.existsSync(imagePath)) {
            hasImage = true;
            fs.copySync(imagePath, path.join(_outputDir, '.package', 'image'), { clobber: true });
        }
    }

    if (fs.existsSync(path.join(work_path, 'Manifest.xml'))) {
        fs.copySync(path.join(work_path, 'Manifest.xml'), path.join(_outputDir, '.package', 'Manifest.xml'), { clobber: true });
    }
    if (fs.existsSync(path.join(work_path, 'qap.json'))) {
        fs.copySync(path.join(work_path, 'qap.json'), path.join(_outputDir, '.package', 'qap.json'), { clobber: true });
    }

    //fs.copySync(path.join(work_path, 'Manifest.xml'), path.join(_outputDir, '.package', 'Manifest.xml'), { clobber: true });
    //fs.copySync(path.join(work_path, 'public'), path.join(_outputDir, '.package', 'public'), { clobber: true });
    if (fs.existsSync(path.join(work_path, 'lifecycle'))) fs.copySync(path.join(work_path, 'lifecycle'), path.join(_outputDir, '.package', 'lifecycle'), { clobber: true });
    fs.copySync(path.join(work_path, prodWebpackConfig.output.publicPath), path.join(_outputDir, '.package', 'qap'), { clobber: true });

    if (fs.existsSync(path.join(work_path, 'iconfont'))) fs.copySync(path.join(work_path, 'iconfont'), path.join(_outputDir, '.package', 'iconfont'), { clobber: true });

    //console.log("---->"+require(path.join(work_path, 'package.json')).name);
    var packageName = require(path.join(work_path, 'package.json')).name;
    if (packageName === undefined) packageName = 'index';
    if (packageName.indexOf('/') > -1 || packageName.indexOf('\\') > -1) {
        packageName = 'index';
    }
    zip(path.join(_outputDir, '.package'),
        path.join(_outputDir, packageName + '.zip'));

    //产生we目录
    degrade.outputWe(path.join(_outputDir, packageJson.h5PublishFolder || 'qap'));
}
/**
 * 打包成zip
 * @param zipPath zip目录
 * @param destZipFile 目标文件
 */
function zip(zipPath, destZipFile) {
    console.log("packageName:" + destZipFile);
    if (fs.existsSync(destZipFile)) {
        fs.removeSync(destZipFile);
    }

    var zip_output = fs.createWriteStream(destZipFile);
    var archive = archiver('zip', {
        level: 9
    });

    zip_output.on('close', function() {
        console.log(destZipFile + ":" + archive.pointer() + ' total bytes');
    });

    archive.on('error', function(err) {
        console.log(err);
    });

    archive.pipe(zip_output);
    if (hasH5) archive.directory(path.join(zipPath, 'h5'), 'h5');
    if (hasImage) archive.directory(path.join(zipPath, 'image'), 'image');

    if (fs.existsSync(path.join(work_path, 'Manifest.xml'))) {
        archive.file('Manifest.xml');
    }
    if (fs.existsSync(path.join(work_path, 'qap.json'))) {
        archive.file('qap.json');
    }

    archive.directory(path.join(zipPath, 'qap'), 'qap');
    if (fs.existsSync(path.join(work_path, 'iconfont'))) {
        archive.directory(path.join(zipPath, 'iconfont'), 'iconfont');
    }
    //archive.directory(path.join(zipPath, 'public'), 'public');
    //archive.directory(path.join(zipPath, 'lifecycle'), 'lifecycle');
    archive.finalize();
}

/**
 * xml-xsd的库需要编译，后期考虑使用prebuild技术
 */
function valifyManifest(schemaString, documentFilePath) {
    // var documentString = fs.readFileSync(documentFilePath, "utf8");
    // var schema = xsd.parse(schemaString);
    // return schema.validate(documentString);
}

exports.packageQap = package_qn_platform;
exports.qapckageJsBundle = package_single_jsbundle;
