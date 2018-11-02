# Docker 常用命令

## 镜像操作

### 下载镜像

```shell
$ docker pull parseplatform/parse-server
```

### 列出镜像

```shell
# 列出所安装的镜像
$ docker iamge ls
# 列出所有镜像，含隐藏的中间镜像，一般用不上
$ docker image ls -a
```

### 删除镜像

```shell
# 如果有容器是根据该镜像运行的，则需先停止并删除容器
# 才可删除镜像，因为容器依赖于该镜像
$ docker image rm xxxx
```

## 容器操作

### 运行容器

```shell
$ docker run \
  --rm \
  -it \
  --name my-mongo \
  -v /my/custom:/etc/mongo \
  -p 127.0.0.1:27027:27017 \
  -d mongo \
  --config /etc/mongo/mongod.conf
```

- `--rm`：容器停止后自动删除该容器，常用于测试容器功能
- `-it`：运行容器后启动命令行界面
- `--name`：指定容器的名称
- `-v /my/custom:/etc/mongo`：将物理机的 /my/custom 目录映射到容器的 /etc/mongo 目录
- `-p 127.0.0.1:27027:27017`：将容器的 27017 端口映射至本机 127.0.0.1 的 27027 端口
- `-d`：在后台运行容器（不会显示容器的输出）
- `--config /etc/mongo/mongod.conf`：需要传入容器的命令、参数，必须放到容器名称之后，否则将被视为启动容器时的参数设置。本条命令的含义就是为该容器指定配置文件，又因为在前面将物理路径映射到容器中，所以使用的其实是物理机中的配置文件

```shell
$ docker run --name parse \
  --link my-mongo:mongo \
 -d parse-server \
```

- `--link mongo:mongo`：将容器 parse 链接至基于镜像 mongo 运行的容器 my-mongo

### 列出容器

```shell
# 列出运行中的容器
$ docker container ls
$ docker ps
# 列出所有容器
$ docker container ls -a
$ docker ps -a
```

### 查看容器

```shell
# 列出该容器的所有配置信息
$ docker container inspect parse
```

### 删除容器

```shell
# 删除指定的容器，记得先停止容器
$ docker stop my-mongo # 与下面命令相同
$ docker container stop my-mongo
$ docker rm my-mongo
$ docker container rm my-mongo
```

### 执行命令

```shell
# 在容器中进入 bash
$ docker exec -it my-mongo bash
```

### 输出日志

```shell
# 查看容器本次启动之后所生成的日志
$ docker logs my-mongo
# 查看容器的所有日志
$ docker container logs my-mongo
```

## 参考资料

- [Docker 参考手册](https://docs.docker.com/reference/)
- [Docker 微服务教程 - 阮一峰的网络日志](http://www.ruanyifeng.com/blog/2018/02/docker-wordpress-tutorial.html): 介绍了 Docker 的常用命令
- [mongo | Docker Documentation](https://docs.docker.com/samples/library/mongo/)
