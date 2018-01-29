
var spawn = require('child_process').spawn;
var fork = require('child_process').fork;
var gulp = require('gulp');
var path = require('path');
var work_path = process.cwd();

function startBuild(cb) {
    var gulpPath = path.join(process.cwd(), 'node_modules', 'gulp', 'bin', 'gulp.js');
    //console.log(path.join(__dirname, 'commands', 'gulp', 'gulpfile.js'));
    const ls = fork(gulpPath, ['build',
        '--cwd', work_path
    ], {
        stdio: ['pipe', 1, 2, 'ipc'],
        cwd: work_path,
        env: process.env,
        execArgv: ['--max-old-space-size=4096']
    });
    ls.on('error', (err) => {
        console.error(`error: ${err}`);
    });
    ls.on('message', function(m) {
        if(m !== undefined && m.build && cb!== 'undefined' && typeof cb === "function"){
            console.log(m);
            cb();
        }
        // var package = require('./package.js');
        // package.packageQap();
    });
}

exports.startBuild = startBuild;
