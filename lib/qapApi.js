"use strict";

require('events').EventEmitter.prototype._maxListeners = 0;

var initQap = require('./commands/create.js');
var startBuild = require('./commands/start-gulp-buld.js').startBuild;
var spawn = require('child_process').spawn;
var fork = require('child_process').fork;
var gulp = require('gulp');
var path = require('path');
var work_path = process.cwd();
var packageJson = require('../package.json');
var colors = require('colors');
var debugJS = require('./commands/debug.js');

//创建工程
exports.create = initQap.create
//检查端口
exports.checkPortIsFreeSync = require('./commands/utils').checkPortIsFreeSync
//开始启动gulp任务
exports.startGulpDeV = debugJS.startGulpDeV
exports.debug = debugJS.debug;
exports.checkPort = debugJS.checkPort;
//打包
exports.package = require('./commands/package.js').packageQap
//输出demo
exports.demo = require('./commands/demo.js').demo
