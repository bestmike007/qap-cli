# QAP简介

QAP（Qianniu Application Platform）是一个可以让开发者使用Rx和H5协同开发千牛移动插件的平台。

该平台致力于解决目前开发千牛插件应用时遇到的一些问题，比如没有多页面管理、缺少缓存支持、内存占用高、加载速度慢等。

在QAP出现之前，H5类型的千牛插件不支持多页面，插件需要通过其他库实现虚拟的页面切换来模拟多页面的效果。
QAP针对这一问题引入页面栈概念，开发者可以随意定制多个H5或者RN页面，并且H5和Rx页面拥有一套统一的API支持。

QAP支持H5和Rx混合开发，开发者可以先将部分功能或者页面升级成Rx，以减少开发者的迁移成本。QAP的H5支持离线包功能，之前版本的H5离线包以很低成本就可以快速迁移到QAP发挥加速作用。

QAP SDK是一个集成了丰富API、开放给前端开发者使用的开发者套件。前端开发者使用该SDK即可调用丰富的API，并在RN/H5页面中实现统一的的调用。

QAP Sample包含了从简单的Hello QAP到复杂的交易插件的示例代码，方便开发者查看和运行该代码，降低开发者的学习成本。

此外，QAP还提供了命令行工具qap-cli用来方便开发者创建、调试、打包和发布。该工具支持Mac OS、Windows和Linux多个平台。有了该工具，开发者可以大大提高开发效率，同时在一个开发平台上的产出，可以应用到不同的目标平台上。

**QAP目标平台**：iOS, Android 
**QAP开发平台**：Mac OS, Windows, Linux


# 快速开始


## 安装qap-ci依赖

### 1. 安装Node.js

> Node.js是一个开放源代码、跨平台的、可用于服务端和网络应用的运行环境。
> qap-cli使用了Node.js开发，因此需要需要开发者安装Node.js。

##### Windows平台

- 下载MSI( [v4.4.6 LTS-x86](https://nodejs.org/download/release/latest-v4.x/node-v4.4.6-x86.msi), [v4.4.6 LTS-x64](https://nodejs.org/download/release/latest-v4.x/node-v4.4.6-x64.msi))，双击运行即可。

- 访问[Nodejs](https://nodejs.org/en/)官方网站。

##### Mac OS平台

1. 直接下载程序[Node.js](https://nodejs.org/en/#download)进行安装；
2. 通过[Homebrew](http://brew.sh/)进行安装：`brew install node`；

### 2. 设置淘宝镜像

```bash
npm config set registry https://registry.npm.taobao.org
```

## 3.安装 qap-cli

```bash
npm install qap-cli -g
```

检查qap-cli版本，确定大于0.2.1

```bash
qap version
0.2.3
```

##  ~~创建QAP工程~~

语法: qap create [projec name]：

```bash
qap create AwesomeProject
```

该命令会在当前目录下创建最简单的示例工程，该工程目录结构如下：

```bash
AwesomeProject/
    ├── h5
    │   └── www.test.com
    │          └── index.html
    ├── rn
    │    ├── index.js
    │    ├── package.json
    │    ├── script
    │          └── lifecycle.js
    │    └── components
    └── Manifest.xml
```

该工程的h5目录和以前的离线包方案类似：文件夹名称和域名一致，默认包含了index.html文件。QAP插件会优先在该目录下匹配文件，而不是通过直接请求http，来提高H5页面的打开速度。

rn目录则放置了React Native相关的代码，如index.js是React Native的入口文件。一般来说，开发者会在入口文件中注册React Native的入口模块：

```javascript
import React, { Component } from 'react';
import {AppRegistry,Text,View} from 'react-native';

class helloQap extends Component {
  render() {
    return (
      <View>
        <Text>
        Hello QAP!
        </Text>
      </View>
    );
  }
}
//注册helloQap模块
AppRegistry.registerComponent('helloQap', () => helloQap);
```

最后，Manifest.xml是QAP的配置文件，该文件最重要的部分是H5或者RN页面的声明，示例如下：

```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest appKey="1323324720" version="1.0">
	<pages>
		<page default="true" launchMode="singleTask">rn://helloQap</page>
		<page capability="h5LocalPage">http://www.test.com/index.html</page>
	</pages>
</manifest>
```

该文件声明了两个page，并指定第一个页面是默认页面，以单任务的方式启动，中间描述了该page的uri。由于uri是以`rn://`开头的，所以这是一个基于rn编写的页面。
第二个页面h5LocalPage拥有一个capability属性进行能力声明。通过QAP的页面相关API，可以基于页面的uri或者capability来实现多页面。

#### ~~运行程序~~

创建完一个QAP应用，我们可以在手机千牛上运行查看效果。

**启动开发服务器**

在QAP应用的根目录（Manifest.xml所在目录）下运行如下命令：
语法：qap debug [-\-options]

```bash
qap debug
```

该命令会在本机启动一个服务，让手机客户端可以连接调试QAP应用。为了查看运行效果，开发者需要安装移动端千牛：Android千牛或iOS千牛。

**iOS千牛**

1. 通过旺旺联系`千牛ios值班`账号获取Debug版本的iPhone千牛进行安装；
2. 打开Debug版本的iPhone千牛，点击顶部状态栏的`Debugger`进入千牛调试界面；
3. 依次点击`测试其它功能` - `[New]QAP应用调试`，进入QAP应用调试界面；
4. 在输入框填入Dev Server的IP地址后，点击按钮即可运行QAP应用；

**Android千牛**

打开千牛，打开我的-设置-关于千牛，连续点击头像，打开调试模式。选中第二项“QAP调试”，摄像头会被呼起，扫描二维码即可运行该QAP插件。
插件调试：
1.调试H5页面：待手机打开QAP插件后，打开需要调试的H5页面后在PC上打开chrome，输入[chrome://inspect/#devices](chrome://inspect/#devices)，会出现如下界面：   
	![chrome://inspect/#devices](docs/imgs/android-h5-inspect.png)
点击蓝色字体的*inspect*即可调试。

2.如何调试React Native代码：手机打开QAP插件后，打开需要调试的RN页面后，在PC的chrome浏览器打开http://localhost:8081/debugger-ui网页：  
![](docs/imgs/android_rn_debug.png)
即可使用熟悉的Chrome开发者工具调试React Native代码，可以打断点，捕获异常。为了更好的体检，推荐设置:
![](docs/imgs/chome_execption_on_pause.png)  

***TODO***


#### ~~打包QAP工程~~

完成代码编写和调试后，需要将其打包成一个Zip文件，用来正式发布。<br/>
通过在QAP的根目录下运行：

打包语法：`qap package projectName [options]`，projectName只对Zip包的名字有影响。

*options*<br/>
-\-ios：打包iOS平台的zip包，输出到./_output/projectName-ios.zip。<br/>
-\-android：打包Android平台的zip包，输出到./_output/projectName-android.zip。<br/>

```bash
qap package AwesomeProject
```

如：

```bash
qap package --ios AwesomeProject
```

只会生成iOS目标平台的Zip包。

#### ~~上传到千牛服务端~~

该QAP工程打包后需要上传到服务器，才能发布到千牛用户手机上运行。打开[上传]()网址，上传即可。


