# 启动带 ES6 的 Express 项目

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
