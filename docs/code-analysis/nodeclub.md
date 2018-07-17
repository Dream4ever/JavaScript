# Nodeclub 项目学习笔记

项目链接：[cnodejs/nodeclub](https://github.com/cnodejs/nodeclub)

---

# 安装部署

## 安装 Node.js

```bash
> nvm install 4.4.0
```

## 安装 MongoDB

```bash
> brew update # 先更新 brew
> brew install mongodb --with-openssl # 安装支持 TLS/SSL 的 MongoDB
> brew services start mongodb # 启动 MongoDB，并设置为开机启动
```

但是查看安装日志的时候，发现按照上面的命令安装的 MongoDB 并不支持 TLS/SSL，好吧，那就先这样。

![Brew install MongoDB](https://gitee.com/samsara9527/Pics/raw/master/nodeclub/brew-install-mongodb.png)

### 运行 MongoDB

```bash
> sudo mkdir -p /data/db # 新建 MongoDB 默认使用的数据文件夹
> sudo chmod 777 /data/db # 设置数据文件夹的权限
> mongod # 启动 MongoDB
```

如果一切正常，MongoDB 运行起来后的状态如下图。

![MongoDB Running Status](https://gitee.com/samsara9527/Pics/raw/master/nodeclub/mongodb-running-status.png)

按下 `Ctrl+C` 停止 MongoDB，然后遵照下图的要求，配置它的安全设置。

![MongoDB Security Issue](https://gitee.com/samsara9527/Pics/raw/master/nodeclub/mongodb-security-issue.png)

通过 [How to Create a configuration File For MongoDB](https://stackoverflow.com/a/14567161/2667665) 这里的回答可以看到，MongoDB 默认的配置文件位于 `/usr/local/etc/mongod.conf`，查看该配置文件，有下面的内容，说明已经默认限制 MongoDB 仅允许本机 IP 访问，那就暂时不用再额外设置了。

```bash
net:
  bindIp: 127.0.0.1
```

参考资料：

[Install MongoDB Community Edition on OS X](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/)

## 安装 Redis

```bash
> brew install redis # 通过 HomeBrew 安装 Redis
> brew services start redis # 启动 Redis，并设置为开机启动
> redis-cli ping # 如果显示 PONG，说明 Redis 已成功启动
```

参考资料：

[Install and config Redis on Mac OS X via Homebrew](https://medium.com/@petehouston/install-and-config-redis-on-mac-os-x-via-homebrew-eb8df9a4f298)

## 安装依赖

```bash
> make install # 安装 Nodeclub 项目的依赖包，会安装很多包，耐心等待即可
```

## 复制配置文件

```bash
> cp config.default.js config.js
```

## 执行测试

```bash
> make test
```

跑完测试后的结果如下。

![Nodeclub Make Test Result](https://gitee.com/samsara9527/Pics/raw/master/nodeclub/nodeclub-make-test.png)

## 运行网站

```bash
> node app.js
```

执行上面的代码之后，网站就运行起来了！在终端能够看到下面这样的代码。

![Nodeclub Running Status](https://gitee.com/samsara9527/Pics/raw/master/nodeclub/nodeclub-running-status.png)

访问 [http://localhost:3000/](http://localhost:3000/)，能够看到网页内容了~

![Nodeclub Main Page](https://gitee.com/samsara9527/Pics/raw/master/nodeclub/nodeclub-mainpage.png)
