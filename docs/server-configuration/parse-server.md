# Parse-Server 配置笔记

> 注：不管是在物理机中部署 Parse-Server，还是在 Docker 中部署 Parse-Server，都可以调用 Docker 中的 MongoDB，所以该笔记的第一步，就是在 Docker 中安装 MongoDB。

## Docker 中安装 MongoDB

记得先配置 Docker 的加速镜像。

配置好之后，下载 MongoDB 的镜像至本地。

由于 macOS 自身的问题，需要用下面的命令，将 MongoDB 的数据文件映射至物理机：

```shell
$ docker run --name mongo -v /User/XX/Code/mongodb:/data/db -p 27017:27017 -d mongo
```

执行上面的命令之后， `mongo` 这个容器就在后台运行了。

`-v /User/XX/Code/mongodb:/data/db`，将物理机的 `/User/XX/Code/mongodb` 目录映射到容器的 `/data/db` 目录。

`-p 27017:27017`，将容器的 27017 端口映射至物理机的 27017 端口。用命令 `docker container ls -a` 查看的话，会看到 mongo 这个容器的端口信息为 `0.0.0.0:27017->27017/tcp`，就说明容器的端口成功映射至物理机的端口了。后面在 Docker 中部署 Parse-Server 也要注意这一点，官方的 GitHub 页面上，并没有 `-p` 指令，所以测试的时候才会失败。

`-d`，让容器启动后在后台运行。

执行命令 `docker container ls -a` 查看所有容器的状态。

执行命令 `docker logs mongo` 查看该容器的日志。

执行命令 `docker exec -it mongo bash` 在该容器中启动一个 bash，来执行一些命令行程序。

## 物理机中部署 Parse-Server

试了各种方法，最后发现在官方的文档网站上的方法才是通用性最强的：

```shell
$ sh <(curl -fsSL https://raw.githubusercontent.com/parse-community/parse-server/master/bootstrap.sh)
$ npm start
```

前面在 Docker 中安装好 MongoDB 之后，用上面的脚本即可快速将 Parse-Server 部署至物理机中，然后就可以用了！

但是！部署在物理机中的话，迁移、复用都无法保证，那么还是得研究一下如何在 Docker 中部署 Parse-Server。

## Docker 中部署 Parse-Server

先将该项目克隆至本地，git 会自动克隆至当前目录下的 parse-server 文件夹中。

```shell
$ git clone https://github.com/parse-community/parse-server.git
```

然后进入该文件夹，让 Docker 编译镜像。

```shell
$ docker build --tag parse-server .
```

因为之前已经把 MongoDB 运行起来了，所以 Parse-Server 的镜像编译完成之后，直接在容器中运行即可。

```shell
$ docker run --name parse \
  --link mongo:mongo \
 -p 1337:1337 \
 -d parse-server \
 --appId "parse" --masterKey "the_key" --databaseURI mongodb://mongo/parse
```

在上面的命令中，要注意的一点是，`-d parse-server` 后面的内容，都会被作为参数传入容器中，所以不要传入容器所需参数以外的内容。

自己最开始执行这个命令的时候，把 `-p 1337:1337` 这条映射端口的指令放到了后面，结果容器一启动就报错，然后就自动停止了。当时不知道原因出在这里，于是怎么都解决不了问题。

## 参考资料

- [Connecting to mongo docker container from host](https://stackoverflow.com/questions/33336773/connecting-to-mongo-docker-container-from-host): 里面还提到了如何在其它的容器中连接在容器中的 MongoDB
- [Parse Server Guide | Parse](https://docs.parseplatform.org/parse-server/guide/)
- [Setup a dockerized Parse Server in minutes](https://codeburst.io/setup-a-dockerized-parse-server-in-minutes-9e3001324c9c)
