'use strict';

require('events').EventEmitter.prototype._maxListeners = 0;

var program = require('commander');
var initQap = require('./commands/create.js');
var startBuild = require('./commands/start-gulp-buld.js').startBuild;
var spawn = require('child_process').spawn;
var fork = require('child_process').fork;
var gulp = require('gulp');
var path = require('path');
var work_path = process.cwd();
var packageJson = require('../package.json');
var colors = require('colors');
var shell = require('shelljs');
var util = require('./util.js');
process.env.FIE_CONFIG_FILE = 'qap.config.js';
var fieEnv = require('fie-env');
/**
 * 初始化设置为外网环境
 */
if (util.getCache('isIntranet') === true) {
} else {
  util.setCache('isIntranet', false);
  fieEnv.setExtranetEnv();
}
var fieApi = require('fie-api');
var fie = require('fie');
var fie_repo = fieApi.config.exist(work_path); //是否存在fie.config.js判断是否是新项目

program
  .version(packageJson.version)
  .command('convert [path_to_h5_project] [projectName]')
  .option('-o, --overwrite', '覆盖')
  .description('迁移H5工程为QAP工程\n示例：$qap convert new_qap_project\n\n')
  .action(function(path_to_h5_project, projectName, options) {
    var convert = require('./commands/convert.js').convert;
    console.log('迁移工程： ' + path_to_h5_project + ' --> ' + projectName);
    convert(path_to_h5_project, projectName, options.overwrite);
  });

program
  .command('create [projectName]')
  .version(packageJson.version)
  .option('-o, --overwrite', '覆盖')
  .option('-i, --install', '安装依赖')
  .option('-a, --appkey [value]', 'appkey')
  .description(
    '创建QAP工程\n示例：$qap create awesome_project --appkey 23093073\n\n'
  )
  .action(function(projectName, options) {
    if (projectName === undefined) return;
    console.log('创建工程： ' + projectName);
    shell.mkdir(path.join(work_path, projectName));
    shell.cd(projectName);
    return fie.run('init', ['nuke']);
    // options.projectName = projectName;
    // initQap.create(path.join(work_path, projectName), options, undefined);
  });

program
  .command('init [projectName]')
  .version(packageJson.version)
  .option('-o, --overwrite', '覆盖')
  .option('-i, --install', '安装依赖')
  .option('-a, --appkey [value]', 'appkey')
  .description(
    '创建QAP工程，功能和create一样\n示例：$qap init awesome_project --appkey 23093073\n\n'
  )
  .action(function(projectName, options) {
    if (projectName === undefined) return;
    shell.mkdir(path.join(work_path, projectName));
    shell.cd(projectName);
    return fie.run('init', ['nuke']);
    // console.log("创建工程： " + projectName);
    // initQap.create(path.join(work_path, projectName), options, undefined);
  });

function list(val) {
  return val.split(',');
}
program
  .command('package')
  .version(packageJson.version)
  .option('-o, --online <items>', '在线打包', list)
  .description('打包该QAP工程，输出zip包\n示例：$qap package\n\n')
  .action(function(options) {
    if (fie_repo) {
      let args = typeof options == 'string' ? options : '';
      return fie.run('build', args);
    }
    try {
      //在线打包的方式
      //console.log(options.online)
      if (options.online) {
        var packageClass = require('./commands/package.js');
        packageClass.qapckageJsBundle(options.online);
        return;
      }
      var utils = require('./commands/utils');
      utils.checkIsRootPath().then(
        function(val) {
          var debug = require('./commands/debug.js');

          debug.checkUpdateJSSDK({}, function() {
            startBuild(function() {
              var packageClass = require('./commands/package.js');
              packageClass.packageQap();
            });
          });
        },
        function(err) {
          console.log(err);
        }
      );
    } catch (ex) {
      console.log(ex);
    }

    // var utils = require('./commands/utils');
    // utils.checkIsRootPath().then(function(val) {
    //     startBuild(function() {
    //         var packageClass = require('./commands/package.js');
    //         packageClass.packageQap();
    //     });
    // }, function(error) {
    //     console.log(error)
    // });
  });

program
  .command('debug')
  .version(packageJson.version)
  .description('调试代码\n示例：$qap debug\n\n')
  .option('-h, --host [value]', '指定IP')
  .option('-u, --usb', '使用USB调试')
  .option('-b, --beta', '使用开发版本的JSSDK')
  .option('-l, --log', '打印日志')
  .action(function(options) {
    if (fie_repo) {
      let args = typeof options == 'string' ? options : '';
      return fie.run('start', args);
    }
    try {
      var utils = require('./commands/utils');
      utils.checkIsRootPath().then(
        function(val) {
          if (!options.usb) {
          }
          //var checkUpdate = require('./commands/upgradeNotice.js');
          //checkUpdate.run(); //每次debug都会检查新版本
          process.chdir(val);
          var debug = require('./commands/debug.js');
          debug.checkUpdateJSSDK(options, function() {
            debug.checkPort(options);
          });
        },
        function(err) {
          console.log(err);
        }
      );
    } catch (ex) {
      console.log(ex);
    }
  });

program
  .command('updatesdk')
  .version(packageJson.version)
  .description('调试代码\n示例：$qap debug\n\n')
  .option('-b, --beta', '使用开发版本的JSSDK')
  .action(function(options) {
    try {
      var utils = require('./commands/utils');
      utils.checkIsRootPath().then(function(val) {
        process.chdir(val);
        var debug = require('./commands/debug.js');
        options.forceUpdate = true;
        debug.checkUpdateJSSDK(options, function() {
          console.log('更新成功!');
          console.log(utils.getJSSDKJsonSync());
        });
      });
    } catch (ex) {
      console.log(ex);
    }
  });

program
  .command('server')
  .version(packageJson.version)
  .description('调试代码\n示例：$qap debug\n\n')
  .option('-i, --pluginid [value]', '需要调试的插件的plugin id(非appkey)')
  .action(function(options) {
    if (fie_repo) {
      let args = typeof options == 'string' ? options : '';
      return fie.run('start', args);
    }
    var utils = require('./commands/utils');
    utils.checkIsRootPath().then(
      function(val) {
        if (!options.usb) {
        }
        //var checkUpdate = require('./commands/upgradeNotice.js');
        //checkUpdate.run(); //每次debug都会检查新版本
        console.log(val);
        process.chdir(val);
        var debug = require('./commands/debug.js');
        debug.checkPort(options);
      },
      function(err) {
        console.log(err);
      }
    );
  });

program
  .version(packageJson.version)
  .command('demo')
  .option('-n, --NukeUIExplorer', 'Nuke UI Explorer Demo')
  .option('-T, --Top', 'Top使用Demo')
  .description('输出demo工程\n示例：$qap demo --NukeUIExplorer\n\n')
  .action(function(options) {
    var demo = require('./commands/demo.js').demo;
    demo(options);
  });

program
  .command('qianniu')
  .version(packageJson.version)
  .description('显示千牛安装二维码\n示例：$qap qianniu\n\n')
  .action(function() {
    var downloadQianniu = require('./commands/download_qianniu_url.js');
    downloadQianniu.download_qrcode();
  });

program
  .command('test wait')
  .version(packageJson.version)
  .action(function() {
    require('./commands/testWaitfor.js').run();
  });

program
  .command('update')
  .version(packageJson.version)
  .action(function() {
    if (fie_repo) {
      return fie.run('update', 'toolkit-nuke');
    }
  });

program
  .command('qrzip')
  .version(packageJson.version)
  .option('-o, --output [value]', '本地预览')
  .description('显示本地离线包文件二维码\n示例：$qap qrzip zip\n\n')
  .action(function(options) {
    if (fie_repo) {
      return fie.run('qrzip', '');
    }
    var qrcode = require('qrcode-terminal');
    var getZipUrl = require('./commands/downloadZip.js').getZipUrl(options);
    if (getZipUrl !== undefined) {
      console.log('本地离线包二维码：\n');
      qrcode.generate(getZipUrl);
      console.log('\n%s\n', getZipUrl);
    }
  });

program
  .command('profile')
  .version(packageJson.version)
  .description('生成工程的profile文件\n示例：$qap profile\n\n')
  .action(function() {
    if (fie_repo) {
      return fie.run('profile');
    }
    require('./commands/profile_webpack.js').start();
    //require('./commands/profile_webpack.js').start();
  });

program
  .command('switch')
  .version(packageJson.version)
  .description('切换运行环境')
  .action(function() {
    if (fieEnv.isIntranet()) {
      fieEnv.setExtranetEnv();
      util.setCache('isIntranet', false);
      console.log('[Info]:已切换到外网环境');
    } else {
      fieEnv.setIntranetEnv();
      util.setCache('isIntranet', true);
      console.log('[Info]:已切换到内网环境');
    }
  });

program
  .command('clear')
  .version(packageJson.version)
  .description('清除qap-cli缓存')
  .action(function() {
    util.removeCache();
    return fie.run('clear');
  });

program
  .command('add')
  .version(packageJson.version)
  .description('打开场景市场')
  .action(function(args) {
    if (typeof args === 'string') {
      args = [args];
    }
    if (fie_repo) {
      return fie.run('add', args);
    }
  });

program
  .command('air-set')
  .version(packageJson.version)
  .description('自动生成air字段')
  .action(function() {
    if (fie_repo) {
      return fie.run('air-set', '');
    }
  });

program
  .command('cdn')
  .version(packageJson.version)
  .description('自动填写js的cdn地址')
  .action(function(env) {
    if (fie_repo) {
      return fie.run('cdn', [env]);
    }
  });

program
  .command('air')
  .version(packageJson.version)
  .description('发布到air平台')
  .allowUnknownOption()
  .action(function(args) {
    if (typeof args === 'string') {
      args = [args];
    }
    if (fie_repo) {
      return fie.run('air', args);
    }
  });

program
  .command('v')
  .version(packageJson.version)
  .description('查看底层调试库版本')
  .action(function(args) {
    if (fie_repo) {
      return fie.run('v', '');
    } else {
      console.log('当前为旧版项目');
    }
  });

program.on('--help', function() {});

var vPos = process.argv.indexOf('-v');
if (vPos > -1) {
  process.argv[vPos] = '-V';
}

program.parse(process.argv);
