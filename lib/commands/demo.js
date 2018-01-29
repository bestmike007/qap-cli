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
var unzip = require('unzip');

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
function demo(options) {
    //options.NukeUIExplorer || options.OfficialTrade

    var projectNameName = '';
    ['NukeUIExplorer', 'Top'].forEach(function(item){
        if(item in options){
            projectNameName = item;
        }
    })

    console.log('输出Demo工程：' + projectNameName);
    if (fs.existsSync(projectNameName)) {
        console.log("目录 %s 已经存在，创建Demo工程失败。", projectNameName);
        return false;
    } else if(projectNameName===undefined || projectNameName.length===0){
        console.log('无法输出该Demo工程')
        return false;
    }else {
        var destDir = fs.emptydirSync(path.join(process.cwd(), projectNameName));
        var dir = path.join(__dirname, '/../../assets', 'demo', projectNameName + '.zip');
        //var dest = path.join(process.cwd());

        fs.createReadStream(dir).pipe(unzip.Extract({ path: destDir}));
    }

    return true;
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

exports.demo = demo;
