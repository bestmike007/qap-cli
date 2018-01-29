'use strict';

/**
 * Created by godsong on 16/8/8.
 */
var spawn = require('child_process').spawn;
var colors = require('colors');

exports.run = function () {
    var version = require('../../package.json').version;

    var isWin = /^win/.test(process.platform);
    var npm_cmd = 'npm';
    if(isWin){
        npm_cmd = 'npm.cmd';
    }
    var npm = spawn(npm_cmd, ['show', 'qap-cli', 'version']);
    npm.stdout.on('data', function (data) {
        var latestVersion = data.toString();
        if (getVersionValue(version) < getVersionValue(latestVersion)) {
            console.log('\n\nNew version of qap-cli detected! Please update qap-cli.(npm install -g qap-cli)\n\n'.red);
        }
    });
};
function getVersionValue(version) {
    var sum = 0;
    version.split('.').forEach(function (n, i, arr) {
        sum += Math.pow(10, (arr.length - i - 1) * 4) * n;
    });
    return sum;
}