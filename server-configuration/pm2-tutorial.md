# 用 PM2 管理 Node.js 后端项目

PM2 不仅可以实现 Node.js 项目的持久化，还能实现代码的自动发布，在本机更改代码并推送到 GitHub 上之后，通过一行命令，就可以让服务端自动下载最新的代码并编译执行，以下是具体流程。

## 注意事项

每次升级 PM2 或者 Node.js 版本后，都要按文档 [Updating PM2](https://pm2.keymetrics.io/docs/usage/update-pm2/) 给出的标准流程来操作，保证不影响 PM2 所管理的项目。

### 升级 PM2

```shell
# 保存 PM2 项目列表及配置
pm2 save

# 用 npm 或 yarn 升级全局安装的 PM2

# 更新到新版的 PM2
pm2 update
```

### 升级 Node.js

```shell
$ pm2 unstartup
$ pm2 startup
```

## 参考文档

- [Windows 下 Node.js 程序保活 - PM2 方案](https://github.com/Dream4ever/Knowledge-Base/issues/59)
- [Quick Start](https://pm2.keymetrics.io/docs/usage/quick-start/)
- [Deployment](https://pm2.keymetrics.io/docs/usage/deployment/)

## PM2 项目配置文件

PM2 所需的配置文件 `ecosystem.config.js` 内容格式如下，该文件随便放到什么地方都可以，但是不要修改文件名。

执行 `pm2 start ecosystem.config.js` 之后，记得再执行 `pm2 save`，保存项目配置。

```js
module.exports = {
  apps : [
    {
      name: "API-Center",
      // Node 项目编译后的路径
      cwd: "c:\\Project\\apicenter\\dist",
      // （上面 cwd 路径下的）项目入口文件
      script: 'index.js',
      // 监控 cwd 路径下所有文件更改，更改后自动重启项目
      watch: '.',
      // 每个 CPU 内核启动一个 Node 实例，非必须，服务器上的 Node.js 目前未开启
      instances: "max",
      // 配合上面的 instances 指令
      exec_mode: "cluster",
      // 正常日志的路径
      out_file: 'c:\\Users\\HeWei.DESKTOP-4HDDQUK\\.pm2\\logs\\API-Center-out.log',
      // 错误日志的路径
      error_file: 'c:\\Users\\HeWei.DESKTOP-4HDDQUK\\.pm2\\logs\\API-Center-error.log',
      // 每条日志都带时间戳
      time: true
    }
  ]
};
```

## PM2 日志管理

安装 [keymetrics / pm2-logrotate](https://github.com/keymetrics/pm2-logrotate) 这个模块，并使用如下参数对 PM2 所管理的各项目的日志进行配置：

```shell
# 不删除历史日志
$ pm2 set pm2-logrotate:retain all

# 切割后的旧日志使用 gzip 压缩
$ pm2 set pm2-logrotate:compress true

# 每 1 小时（3600 秒）检查一次日志文件体积
$ pm2 set pm2-logrotate:workerInterval 3600

# 每天于 03:20 这个时刻强制检查日志文件体积
$ pm2 set pm2-logrotate:rotateInterval 0 20 3 * * *
```

---

↓↓↓ 旧版内容 ↓↓↓

## 先期准备

PM2 的代码自动发布依赖 GitHub 或类似功能的网站，所以需要先在 GitHub 上添加个人电脑和远程服务器的 SSH 秘钥。

大体流程如下（ Mac 和 Linux 系列的系统直接在终端中执行指令，Windows 需要先安装 Git 客户端）：

1. [检查本机是否有现成的 SSH 秘钥](https://help.github.com/articles/checking-for-existing-ssh-keys/#platform-windows)。
2. 没有秘钥的话，[生成一个新的秘钥并添加到本机的 ssh-agent 中](https://help.github.com/articles/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent/)。如果已经有秘钥了，则[直接添加到本机的 ssh-agent 中](https://help.github.com/articles/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent/#adding-your-ssh-key-to-the-ssh-agent)。
3. [将 SSH 秘钥添加到 GitHub 账号中](https://help.github.com/articles/adding-a-new-ssh-key-to-your-github-account/)。
4. [测试 SSH 连接](https://help.github.com/articles/testing-your-ssh-connection/)，这里一定要测试成功才行。连接成功的，能看到下面这段文字：

```bash
Hi XXX! You've successfully authenticated, but GitHub does not provide shell access.
```

要注意，自己的个人电脑和远程服务器都要做这一整套操作，这样才能够在本机发布代码到 GitHub 上之后，再让远程服务器把最新的代码更新过去。

## 安装 PM2

在本机和服务器都全局安装 PM2，用 `npm` 或 `yarn` 均可，如果下载速度慢，记得先[切换成淘宝的 npm 源](http://xugaoyang.com/post/5aa238c3b1745b11c007ffd1)。

注意，如果两边电脑上的 Git 不是最新版，务必更新到最新版。不然可能有代码无法及时同步的问题，服务器始终无法 pull 到最新版本的代码，很闹心。当前的最新版是 2.16.3 版本，2018 年 3 月 22 号发布。

## 本机配置 PM2

在本机的终端环境中，用 `pm2 ecosystem` 命令生成一份原始的 PM2 配置文件 `ecosystem.config.js`。注意，官网文档和实际操作的结果不一致，文档上说执行这个命令会生成 `ecosystem.json` 这个文件，但自己操作的时候并不是这样，大家也要注意一下。

为了方便大家参考，把自己修改后的配置文件内容贴了上来，只贴了重要的部分，别的地方根据自己的需要修改。

```javascript
module.exports = {
  apps : [
    // 目前只用 PM2 管理一个项目，所以这里删除了多余的内容
    {
      name      : 'RMS',
      // 这里是项目的启动文件，不过自己没用上
      script    : './dist/bin/www',
      env: {
        COMMON_VARIABLE: 'true'
      },
      env_production : {
        NODE_ENV: 'dev'
      }
    }
  ],

  // 部署环境的设置，自己只用到了开发环境，需要修改完代码之后立刻看到结果，所以就没有生产环境的配置
  deploy : {
    dev : {
      // 服务器上进行日常操作的用户
      user : 'www',
      // 服务器的 IP
      host : '1.2.3.4',
      ref  : 'origin/master',
      repo : 'git@github.com:Dream4ever/rms.git',
      // 项目要部署到服务器上的位置，PM2 默认会部署到该路径的 source 子文件夹下
      path : '/home/www/websites/rms',
      // 服务器下载到最新的代码之后要执行的命令，把 npm 命令改成了 yarn
      'post-deploy' : 'yarn && pm2 reload ecosystem.config.js --env dev',
      env  : {
        NODE_ENV: 'dev'
      }
    }
  }
};
```

## 部署项目

配置完成之后，就要开始把项目通过 PM2 自动部署到服务器上了。

这里有一点要注意：需要先把本机项目的最新版，也就是保存并提交了所有修改的版本发布到 GitHub 上去，然后再进行后面的部署操作。

如果之前没有通过 SSH 连接过服务器，就需要先在本机执行 `ssh-copy-id www@1.2.3.4` 这个命令（`www` 是前面配置的服务器的用户，`@` 后面是 IP），把本机的 SSH 秘钥信息添加到服务器上，这个配置成功之后，以后就不需要再执行这条 SSH 命令了。

然后在本机初始化远程服务器上的项目：`pm2 deploy ecosystem.config.js dev setup`。命令中的 `dev` 指的是在上面配置文件中写的部署环境的名称，对于同时需要设置开发和生产环境的情况，就根据自己需要初始化两次吧，没这个需求的就不用管了。

接着就是部署项目，通俗地说，也就是通知服务器把前面从本机 push 到 GitHub 上的最新代码下载下来：`pm2 deploy ecosystem.config.js dev`。

在这两个过程中，都可以看到服务器上的操作指令和结果都显示到本机的终端上了。

一般没什么问题的话，经过这几步操作，就能部署成功了。

如果部署的是 Node.js 服务，当然还需要把它启动起来才行。一种方式就是通过 PM2 的 `exec` 指令让远程服务器执行指定的命令，另一种方式则是直接 SSH 登录到服务器上执命令，各取所好吧。

如果在本机执行，就用这种方式：`pm2 deploy production exec "pm2 start ./api/bin/www"`。如果登录到服务器上执行的话，就直接执行 `pm2 start ./api/bin/www` 就好了。
