# 启动带 ES6 的 Express 项目

2019年3月11日更新：

## 注意事项

1. 相关命令在 Windows 下的 Git Bash 中可正常执行。
2. 相关环境：Babel 7，Node.js 10.15.X LTS。

### 安装依赖

将后面要用到的 Babel 的四个 npm 模块用 Yarn 安装为项目的开发依赖。

```shell
$ yarn add @babel/cli @babel/core @babel/node @babel/preset --dev
```

### 配置环境

因为 Babel 这次是大版本升级，所以它的相关文件也变了，之前的 `.babelrc`，现在重命名为官方建议的 `babel.config.js`，内容也变成了下面这样：

```javascript
const presets = [
  [
    "@babel/env",
    {
      useBuiltIns: "usage",
    },
  ],
];

module.exports = { presets };
```

只有配置了这个文件，才能正常使用 Babel，这一点要注意。

### 测试执行

`@babel/node` 这个模块让 Node.js 可以正常解析最新的 JS 语法，执行下面的命令，在 Node.js 中运行最新的源码。由于没有把 Babel 的这几个模块安装为全局依赖，所以在执行的时候，就要用 `./node_modules/.bin/babel-node` 这样的方式。

```shell
$ ./node_modules/.bin/babel-node ./api/bin/www
```

不过也可以用 `npx` 这个指令，这是 npm 5.2.0 之后引入的新指令，让开发者可以直接调用非全局的、当前项目中的模块。

```shell
$ npx babel-node ./api/bin/www
```

### 即时更新

还可以让 nodemon 来监控源码的变更，随时运行最新的程序：

```shell
$ npx nodemon --exec npx babel-node ./api/bin/www
```

### 编译源码

代码没有问题之后，就可以用 Babel 把它编译成 Node.js 所支持的源码了。

这里要注意，部分 JS 文件 Babel 不会编译，猜测可能是没有用较新的语法。但是 Babel 也不会自动地把这些文件放到编译后的目录中，所以需要明确指定 `--copy-files` 参数，来将未编译的文件复制过去。

```shell
$ npx babel ./api/bin/www --out-dir ./dist --copy-files ./api
```

### 参考资料

- [Usage Guide · Babel](https://babeljs.io/docs/en/usage)：介绍了 Babel 7 安装、使用的基本流程。
- [babel/example-node-server](https://github.com/babel/example-node-server)：可以参考这个项目，对应用了 ES6 语法的 Node.js 项目进行更好地管理。

---

## 已废弃

由于 Express 项目中的代码用到了 ES6，为了让项目能够正常运行，就需要 `babel` 来打辅助。

```bash
# 开发环境
# Linux
$ DEBUG=rms:server nodemon ./api/bin/www --exec babel-node --presets es2015,stage-2
# Windows
$ nodemon .\api\bin\www --exec babel-node --presets es2015,stage-2

# 生产环境
# Linux
$ pm2 start ./api/bin/www --interpreter babel-node --watch
# Windows
# www 文件需先引入 babel-polyfill => require('babel-polyfill');
# "build": "npm run clean && mkdir dist && babel api -s -D -d dist"
$ pm2 start dist/bin/www --name="rms"

########
# Windows 下无效的指令们
########

# 可以成功启动项目，只在项目的日志中报错
$ pm2 start ./api/bin/www --node-args="--harmony"
# import express from 'express';
#        ^^^^^^^
#
# SyntaxError: Unexpected identifier
#     at new Script (vm.js:51:7)

# 直接就没法启动项目，报告 errored
$ pm2 start api/bin/www --interpreter babel-node --name="rms"
$ pm2 start api/bin/www --interpreter ./node_modules/.bin/babel-node --name="rms"

# 也是报错
# "start": "babel-node ./api/bin/www --presets es2015,stage-0"
$ pm2 start npm -- start
# C:\USERS\ADMINISTRATOR\APPDATA\ROAMING\NPM\NPM.CMD:1
# (function (exports, require, module, __filename, __dirname) { @IF EXIST "%~dp0\node.exe" (
#                                                               ^
#
# SyntaxError: Invalid or unexpected token
```

附上完整的 `package.json`。

```json
{
  "name": "rms",
  "version": "0.0.0",
  "private": true,
  "scripts": {
    "tryrun": "babel-node ./api/bin/www --presets es2015,stage-2",
    "dev": "nodemon ./api/bin/www --exec babel-node --presets es2015,stage-2",
    "clean": "rimraf dist",
    "build": "npm run clean && mkdir dist && babel api -s -D -d dist",
    "start": "npm run build && pm2 start pm2_config.json"
  },
  "dependencies": {
    "axios": "^0.18.0",
    "babel-cli": "^6.26.0",
    "babel-polyfill": "^6.26.0",
    "body-parser": "~1.18.2",
    "cookie-parser": "~1.4.3",
    "cors": "^2.8.4",
    "debug": "~2.6.9",
    "ejs": "~2.5.7",
    "express": "~4.15.5",
    "moment": "^2.21.0",
    "mongoose": "^5.0.10",
    "morgan": "~1.9.0",
    "nodemailer": "^4.6.3",
    "sha1": "^1.1.1"
  },
  "devDependencies": {
    "babel-preset-es2015": "^6.24.1",
    "babel-preset-stage-2": "^6.24.1",
    "dotenv": "^5.0.1",
    "rimraf": "^2.6.2"
  }
}
```
