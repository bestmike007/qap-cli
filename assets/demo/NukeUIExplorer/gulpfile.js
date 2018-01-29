var path = require('path'),
    gulp = require('gulp'),
    gutil = require('gulp-util'),
    webpack = require('webpack'),
    babel = require('gulp-babel'),
    os = require('os'),
    _ = require("underscore"),
    del = require('del'),
    open = require('open'),
    webpackDevServer = require('webpack-dev-server'),
    config = require('./webpack.config');


function getPublicIP() {
    var publicIP = "127.0.0.1"; //fallbck ip
    var ifaces = os.networkInterfaces();
    var address = _.flatten(_.values(ifaces));
    address = _.filter(address, function (ifObj) {
        return ifObj.family == "IPv4" && ifObj.address != "127.0.0.1";
    });
    if (address.length > 0) {
        publicIP = address[0].address;
    }
    return publicIP;
}

var host = getPublicIP();

gulp.task('clean', function (cb) {
    del(['build','lib']).then(function(){
        cb();
    })
});

gulp.task('start', function (cb) {
    var buildFirstTime = true;
    var webpackConfig = config.dev();
    var compiler = webpack(webpackConfig);
    var devHost = "http://"+ host +":" + webpackConfig.port;
    compiler.plugin('done', stats => {
        if (stats.hasErrors()) {
            console.log(stats.toString({ colors: true }));
        }
        //只有第一次启动start的时候才执行
        if(buildFirstTime){
            buildFirstTime = false;
            cb && cb();
            // listening
            gutil.log("[webpack-dev-server]", gutil.colors.magenta(devHost));
            gutil.log("[webpack-dev-server]", "To stop service, press [Ctrl + C] ..");
            //open(devHost + '/index.html?dist='+webpackConfig.output.publicPath+'&we=index.js');
            //open(devHost + '/readme.html?_wx_tpl='+devHost+webpackConfig.output.publicPath+'index.js');
            var avalibleJs = [];
            for(var k in config.dev().entry){
                avalibleJs.push(k);
            }
            //open(devHost + '/readme.html?dist='+webpackConfig.output.publicPath+'&we=index.js&avalible=' + avalibleJs.toString());
            // open(devHost + '/demo/readme.html?_wx_tpl='+ devHost +'/demo/index.js');
        }
        if (typeof process.send === 'function') {
            process.send({ start: 'done' });
        }
    });

    var server = new webpackDevServer(compiler, {
        hot: false,
        inline: true,
        quiet: true,
        publicPath: webpackConfig.output.publicPath,
        headers: { 'Access-Control-Allow-Origin': '*' },
        contentBase: path.resolve(__dirname, './')
    }).listen(webpackConfig.port, '0.0.0.0', function (err) {
        if (err) {
            throw new gutil.PluginError("webpack-dev-server", err)
        }

    });
});

gulp.task('build:dist',['clean'], function (cb) {

    var webpackConfig = config.prod();
    var compiler = webpack(webpackConfig, function (err, stats) {
        if (err) {
            gutil.log(err);
        }

        gutil.log(stats.toString({
            colors: true,
            chunks: false
        }));
    });
    compiler.plugin('done', stats => {
        if (stats.hasErrors()) {
            console.log(stats.toString({ colors: true }));
        }
        cb && cb();
        if (typeof process.send === 'function') {
            process.send({ build: 'done' });
        }
    });

});


gulp.task('build:demo',['clean'], function (cb) {

    var webpackConfig = config.demo();

    var compiler = webpack(webpackConfig, function (err, stats) {
        if (err) {
            gutil.log(err);
        }

        gutil.log(stats.toString({
            colors: true,
            chunks: false
        }));
    });
    compiler.plugin('done', stats => {
        if (stats.hasErrors()) {
            console.log(stats.toString({ colors: true }));
        }
        cb && cb();
    });

});

gulp.task('build:lib',['clean'], function () {

    gulp.src(['src/**/*.less','src/**/*.scss'])
        .pipe(gulp.dest('lib'));

    return gulp.src('src/**/*.js?(x)')
        .pipe(babel())
        .pipe(gulp.dest('lib'));

});

gulp.task('default', ['start']);
gulp.task('build', ['build:dist']);