# Parse-Server 配置笔记

## 先在 Docker 中安装 MongoDB

记得先配置 Docker 的加速镜像。

配置好之后，下载 MongoDB 的镜像至本地。

由于 macOS 自身的问题，需要用下面的命令，将 MongoDB 的数据文件映射至物理机：

```shell
$ docker run --name mongo-for-parse -v /User/XX/Code/mongodb:/data/db -p 27017:27017 -d mongo
```

执行上面的命令之后， `mongo-for-parse` 这个容器就在后台运行了。

`-v /User/XX/Code/mongodb:/data/db`，将物理机的 `/User/XX/Code/mongodb` 目录映射到容器的 `/data/db` 目录。

`-p 27017:27017`，将容器的 27017 端口映射至物理机的 27017 端口。

`-d`，让容器启动后在后台运行。

执行命令 `docker container ls -a` 查看所有容器的状态。

执行命令 `docker logs mongo-for-parse` 查看该容器的日志。

执行命令 `docker exec -it mongo-for-parse bash` 在该容器中启动一个 bash，来执行一些命令行程序。

## 参考资料

- [Docker 微服务教程 - 阮一峰的网络日志](http://www.ruanyifeng.com/blog/2018/02/docker-wordpress-tutorial.html): 介绍了 Docker 的常用命令
- [Setup a dockerized Parse Server in minutes](https://codeburst.io/setup-a-dockerized-parse-server-in-minutes-9e3001324c9c)
- [parse-community/parse-server](https://github.com/parse-community/parse-server)
- [mongo | Docker Documentation](https://docs.docker.com/samples/library/mongo/)
- [Connecting to mongo docker container from host](https://stackoverflow.com/questions/33336773/connecting-to-mongo-docker-container-from-host): 里面还提到了如何在其它的容器中连接在容器中的 MongoDB
