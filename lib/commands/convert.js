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
var IP = require('ip');
var createJs = require('./create.js');
var create = createJs.create;
var copyFiles = createJs.copyFiles;

var work_path = process.cwd();

function convert(h5ProjectPath, projectName, needOverWrite) {
    //projectName有个能是个相对路径，如./name
    var templateVars = {
        name: path.relative(process.cwd(), path.join(process.cwd(), projectName)),
        first_page: 'http://' + IP.address() + ':8080/h5/index.html'
    };
    if (create(projectName, false, needOverWrite, templateVars)) {

        var dest = path.join(work_path, projectName, 'h5');
        fs.ensureDirSync(dest);
        fs.emptydirSync(dest);

        copyFiles(h5ProjectPath, dest, {});

        setTimeout(function() {
            fs.emptydir(path.join(work_path, projectName, 'src'), function(err) {
                if (err) console.log(err);
            });
        }, 300);
    }
}

exports.convert = convert;
