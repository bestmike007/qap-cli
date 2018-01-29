/**
 *
 * 具备rn能力的工程，类似于create命令
 * @author mingming.cmm
 *
 */
var fs = require('fs-extra'); //fs-extra 包含所有fs接口的功能并扩展了copy等功能
var path = require('path');
var child_process = require('child_process');
var ejs = require('ejs')
var mkdirp = require('mkdirp');
var getDirName = require('path').dirname;
var prompt = require('prompt');
var Promise = require('promise');
var myutils = require('./utils');

//readdir(path[, options], callback)
var TEMPLATE_RN_PROJECT_PATH = path.join(__dirname, "/../../assets/template_create"); //初始项目路
var npm_install_delay = 2000; //ms
var work_path = process.cwd();
/**
 * 创建项目目录,目录结构：
 * root
 *  +html
 *  +css
 *  +js
 *  +image
 * @param  {String} name 项目名称
 * @return {Boolean}     是否成功
 */
function create(projectPath, options, pTemplateVars, cb) {
    //console.log('projectPath:' + projectPath)
    if (fs.existsSync(projectPath)) {
        if (options && options.overwrite) {
            fs.emptydirSync(projectPath);
        } else {
            console.log("目录 %s 已经存在，创建工程失败。需要覆盖请使用选项--overwrite后重试。", projectPath);
            return cb && cb(false, "工程" + projectPath + "已经存在！");
        }
    }

    //获取appkey
    //没有输入appkey则提示用户输入
    getAppkey(options).then(function(onFulfilled, onRejected) {

        if (!onRejected) {
            var isWin = /^win/.test(process.platform);

            downloadHelloWorld(process.cwd(), projectPath, options.projectName, onFulfilled, function() {
                if (options.install) {
                    setInterval(function() {
                        require('./utils.js').npmInstallIfNeeded(projectPath);
                        console.log('创建完毕:' + projectPath);
                        cb && cb(true);
                    }, 1500);
                } else {
                    console.log('创建完毕:' + projectPath);
                    cb && cb(true);
                }
            });
        }
    });

    return;
}

function downloadHelloWorld(projeParent, projPath, projeName, appkeyStr, cb) {
    myutils.downloadZip('http://qn-ide.oss-cn-shanghai.aliyuncs.com/example/qap_hello_wrold-master.zip',
        projeParent, 'qap_hello_wrold-master', projPath).then(function(onFullFilled) {

        console.log('下载：http://qn-ide.oss-cn-shanghai.aliyuncs.com/example/qap_hello_wrold-master.zip');
        try {
            //更改packagejson
            var packageJson = require(path.join(projPath, 'package.json'));
            packageJson.name = projeName;
            fs.writeFile(path.join(projPath, 'package.json'), JSON.stringify(packageJson, null, 2), function(err1) {
                err1 && console.log(err1);
            });

            //更改qap.json
            var qapJson = require(path.join(projPath, 'qap.json'));
            qapJson.appKey = appkeyStr;
            fs.writeFile(path.join(projPath, 'qap.json'), JSON.stringify(qapJson, null, 2), function(err2) {
                err2 && console.log(err2);
            });
            cb();
        } catch (execp) {
            console.log(execp);
        }

    }, function(onError) {
        console.log(onError);
    })
}

function getAppkey(options) {

    var itemPromise = new Promise(function(resolve) {

        if (options.appkey) {
            return resolve(options.appkey);
        } else {
            var schema = {
                properties: {
                    appkey: {
                        description: '请输入插件的appkey(存储在package.json的appkey字段中)',
                        pattern: /^[0-9\s\-]+$/,
                        message: 'appkey必须为数字',
                        required: true
                    }
                }
            };

            // prompt.start();
            // // 
            // // Get two properties from the user: email, password 
            // // 
            // prompt.get(schema, function(err, result) {
            //     // 
            //     // Log the results. 
            //     // 
            //     if (err) {
            //         reject(err);
            //     } else {
            //         resolve(result.appkey);
            //     }
            // });

            //TODO 去掉提示用户更改appkey
            resolve('1323324720');
        }

    });

    return itemPromise;
}

function copyFiles(src, des, templates) {
    walk(src, function(err, results) {
        if (err) throw err;
        results.forEach(function(file) {
            //console.log(path.join(des, path.relative(src, file)));
            copySingleFile(file, path.join(des, path.relative(src, file)), templates);
        })
    });
}

function copySingleFile(src, des, templates) {
    //var deferred = Q.defer();
    ejs.renderFile(src, templates, function(err, str) {
        //console.log(src);
        writeFile(des, str, function(err) {
            if (err) {
                //deferred.reject(err);
            }
            //console.log(des);
            //deferred.resolve();
        });
    });
}

function writeFile(path, contents, cb) {
    mkdirp(getDirName(path), function(err) {
        if (err) return cb(err);

        fs.writeFileSync(path, contents);
    });
}
//遍历文件夹下所有文件
function walk(dir, done) {
    var results = [];
    fs.readdir(dir, function(err, list) {
        if (err) return done(err);
        var i = 0;
        (function next() {
            var file = list[i++];
            if (!file) return done(null, results);
            file = dir + '/' + file;
            fs.stat(file, function(err, stat) {
                if (stat && stat.isDirectory()) {
                    walk(file, function(err, res) {
                        results = results.concat(res);
                        next();
                    });
                } else {
                    if (!file.endsWith(".DS_Store")) {
                        results.push(file);
                    }
                    next();
                }
            });
        })();
    });
}

exports.create = create;
exports.copyFiles = copyFiles;
