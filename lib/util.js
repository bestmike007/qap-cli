'use strict'
// 检测是内外网环境
var request = require('request');
var path = require('path');
var fs = require('fs-extra');
var userHome = process.env.HOME || process.env.USERPROFILE || process.env.HOMEPATH; //兼容windows
var cachePath = path.join(userHome,'.qap/cache.json');

module.exports.setCache = function(name,value){
    var cache = {};
    try{
        cache = fs.readJSONSync(cachePath);
    }catch(error){
        console.log('init qap-cli cache');
    }
    cache[name] = value;
    fs.ensureFileSync(cachePath);
    fs.writeJsonSync(cachePath,cache,{spaces:4});
}

module.exports.getCache = function(name){
    var cache = {}
    try{
        cache = fs.readJsonSync(cachePath);
    }catch(error){

    }
    return cache[name];
}

module.exports.removeCache = function(){
    fs.removeSync(cachePath);
}