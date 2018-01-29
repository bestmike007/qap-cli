/**
 * 说明: webpack的配置请在该文件进行修改
 * webpack配置文档请查看:https://webpack.github.io/docs/configuration.html
 */

var path = require('path');
var _ = require('lodash');
var webpack = require('webpack');
var glob = require('glob');
var RxPlugin = require('weex-rx-webpack-plugin');
var LiveReloadPlugin = require('webpack-livereload-plugin');

var componentName = 'Rxfietest',
    srcPath = path.resolve(__dirname, './src'),
    // demoPath = path.resolve(__dirname, './demo'),
    outputPath = path.resolve(__dirname, './build');


var config = {

    //服务器开启的端口号
    port : '3050',

    context: srcPath,

    //webpack 编译的入口文件
    entry: getDevEntry(srcPath),

    //输出的文件配置
    output: {
        path: './build/',
        filename: '[name].js',
        publicPath: '/build/'
    },

    resolve: {
        root: srcPath,
        extensions: ['', '.js', '.jsx'],
        alias : {
        }
    },


    module: {
        loaders: [{
            test: /\.(js|jsx)$/,
            include: [
                path.resolve(__dirname, "src"),
                new RegExp(/node_modules\/.*nuke.*/),
                path.resolve(__dirname, "node_modules/weex-rx")
            ],
            loaders: ['babel']
            // query: {
            //     // cacheDirectory: true,
            //     presets: ['es2015', 'stage-0']
            //     // ,
            //     // plugins: ['add-module-exports']
            // }
        },
        // , {
        //     test: /\.css?$/,
        //     loaders: ['@ali/rx-radium-loader','css']
        // },
        {
            test: /\.rxscss$/,
            loader: 'rx-css-loader!fast-sass'
        }
        ]
    },

    plugins: [

        new RxPlugin(),

        
        ////Webpack gives IDs to identify your modules. With this plugin,
        //// Webpack will analyze and prioritize often used modules assigning them the smallest ids.
        new webpack.optimize.OccurenceOrderPlugin(),

        //进度插件
        new webpack.ProgressPlugin((percentage, msg) => {
            const stream = process.stderr;
            if (stream.isTTY && percentage < 0.71) {
                stream.cursorTo(0);
                stream.write(`📦   ${msg}`);
                stream.clearLine(1);
            }
        })
    ]
};


/**
 * 获取demo文件夹中的入口文件
 * @param cwd
 * @returns {{}}
 */
function getDevEntry(cwd){
    var entry = {};
    glob.sync('*.jsx', {cwd: cwd}).forEach(function (item, i) {
    // glob.sync('src/**/*.jsx', {cwd: cwd}).forEach(function (item, i) {
        var file = item.replace('.jsx','');
        entry[file] = [
            item
        ];
    });
    return entry;
}

/**
 * 开发环境及demo编译时的配置
 * @returns {*}
 */
function dev(){

    var _config = _.cloneDeep(config);

    _config.context = srcPath;
    _config.resolve.root = srcPath;
    _config.output = {
        path: outputPath,
        filename: '[name].js',
        publicPath: '/build/'
    };

    _config.plugins.push(
        new webpack.DefinePlugin({
            "process.env": { NODE_ENV: JSON.stringify('development') },
            "__DEV__": JSON.stringify(JSON.parse('true'))
        }),

        new LiveReloadPlugin()
    );

    //添加soure-map
    _config.devtool = 'source-map';
    //入口文件添加server 和 hrm
    // _config.entry = getDevEntry(srcPath);

    return _config;
}


/**
 * 编译到demo文件夹的配置
 * 与dev的区别是不需要调试相关的配置
 */
function demo(){
    var _config = _.cloneDeep(config);
    _config.context = srcPath;
    _config.resolve.root = srcPath;
    _config.output = {
        path: srcPath,
        filename: '[name].js',
        publicPath: '/src/'
    };

    _config.plugins.push(
        new webpack.DefinePlugin({
            "process.env": { NODE_ENV: JSON.stringify('production') },
            "__DEV__": JSON.stringify(JSON.parse('false'))
        })

    );

    _config.entry = getDevEntry(srcPath);

    return _config;
}


/**
 * 发布到cdn及tnpm时的配置
 * @returns {*}
 */
function prod(){

    var _config = _.cloneDeep(config);
    //build环境
    _config.plugins.push(
        new webpack.DefinePlugin({
            "process.env": { NODE_ENV: JSON.stringify('production') },
            "__DEV__": JSON.stringify(JSON.parse('false'))
        }),

        //查找相等或近似的模块，避免在最终生成的文件中出现重复的模块。
        new webpack.optimize.DedupePlugin(),

        //压缩代码
        new webpack.optimize.UglifyJsPlugin({
            minimize: true,
            compress: { warnings: false },
            output: { comments: false }
        })
    );


    return _config;
}

module.exports = {

    dev : dev,

    demo : demo,

    prod : prod

};
