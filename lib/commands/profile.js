/**
 * 关于代码规范
 * 所有模块、类库 引入后使用首字母大写的驼峰形式，
 * 本地变量与函数使用首字母小写的驼峰形式
 * module内的闭包变量（相当于module 作用域内的全局变量）如果用于储存信息，由于容易产生泄露，所以必须使用_开头的驼峰形式用于区分
 * 像下面代码中的packageInfo由于是只读的所以不需要加_
 */
'use strict';

function profile(portArray) {

    //var 
    //var webpackPath = Path.join(process.cwd(), 'node_modules', 'webpack', 'bin', 'webpack');

    var webpackPath = Path.join(process.cwd(), 'node_modules', 'webpack', 'bin', 'webpack');
    const ls = fork(webpackPath, ['start',
        '--cwd', process.cwd()
    ], {
        stdio: [0, 1, 2, 'ipc'],
        cwd: process.cwd(),
        env: process.env,
        execArgv: ['--max-old-space-size=4096']
    });

    ls.on('exit', function(code, signal) {
        console.log('debug thread exit: {signal:' + signal + '}')
    });

    ls.on('error', (err) => {
        console.error(`error: ${err}`.red);
        myEmitter.emit('error', data);
    });
}
