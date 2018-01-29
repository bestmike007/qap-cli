// var path = require('path');
// var gulp = require('gulp');
// var gutil = require('gulp-util');
// var webpack = require('webpack');
// var babel = require('gulp-babel');
// var os = require('os');
// var _ = require("underscore");
// var del = require('del');
// var open = require('open');
// var webpackDevServer = require('webpack-dev-server');

// var work_path = process.cwd();
// var config = require(path.join(work_path, 'webpack.config.js'));
// var qapDebug = require('../debug.js');


// function getPublicIP() {
//     var publicIP = "127.0.0.1"; //fallbck ip
//     var ifaces = os.networkInterfaces();
//     var address = _.flatten(_.values(ifaces));
//     address = _.filter(address, function (ifObj) {
//         return ifObj.family == "IPv4" && ifObj.address != "127.0.0.1";
//     });
//     if (address.length > 0) {
//         publicIP = address[0].address;
//     }
//     return publicIP;
// }

// var host = getPublicIP();

// gulp.task('clean', function (cb) {
//     del(['build','lib']).then(function(){
//         cb();
//     })
// });

// gulp.task('start', function (cb) {
//     var buildFirstTime = true;
//     var webpackConfig = config.dev();
//     var compiler = webpack(webpackConfig);
//     var devHost = "http://"+ host +":" + webpackConfig.port;
//     compiler.plugin('done', stats => {
//         if (stats.hasErrors()) {
//             console.log(stats.toString({ colors: true }));
//         }
//         //只有第一次启动start的时候才执行
//         if(buildFirstTime){
//             buildFirstTime = false;
//             cb && cb();
//             // listening
//             gutil.log("[webpack-dev-server]", gutil.colors.magenta(devHost));
//             gutil.log("[webpack-dev-server]", "To stop service, press [Ctrl + C] ..");
//             //open(devHost + '/src/index.html');
//             open(devHost + '/src/tips.html?_wx_tpl='+ devHost +'/build/index.js');
//         }

//         qapDebug.debug();
//     });

//     var server = new webpackDevServer(compiler, {
//         hot: false,
//         inline: true,
//         quiet: true,
//         publicPath: webpackConfig.output.publicPath,
//         headers: { 'Access-Control-Allow-Origin': '*' },
//         contentBase: path.resolve(__dirname, './')
//     }).listen(webpackConfig.port, '0.0.0.0', function (err) {
//         if (err) {
//             throw new gutil.PluginError("webpack-dev-server", err)
//         }

//     });
// });


// gulp.task('build:dist',['clean'], function (cb) {

//     var webpackConfig = config.prod();

//     var compiler = webpack(webpackConfig, function (err, stats) {
//         if (err) {
//             gutil.log(err);
//         }

//         gutil.log(stats.toString({
//             colors: true,
//             chunks: false
//         }));
//     });
//     compiler.plugin('done', stats => {
//         if (stats.hasErrors()) {
//             console.log(stats.toString({ colors: true }));
//         }
//         cb && cb();
//     });

// });

// gulp.task('build:lib',['clean'], function () {

//     return gulp.src('src/**/*.js?(x)')
//         .pipe(babel())
//         .pipe(gulp.dest('lib'));

// });

// gulp.task('default', ['start']);
// gulp.task('build', ['build:lib','build:dist']);