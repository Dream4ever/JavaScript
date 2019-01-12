# 在 Docker 中部署 Nginx

## 前言

话说，为什么要在 Docker 中部署 Nginx？直接在系统中安装运行 Nginx 不是也可以？当然可以，是否要在 Docker 中部署 Nginx，结合自己的实际情况来决定就行。

就我们公司而言，向学校申请了几台服务器，安装的都是 CentOS 7.3，通过 yum 源安装 Nginx 的话，装上的是 1.12 Legacy 版本的 Nginx。看了看这个版本系列的 [Changelog](http://nginx.org/en/CHANGES-1.12)，最后一次更新是 2017 年 10 月，有点儿老。

新版的 Nginx，不仅有功能上的更新，也会有安全漏洞方面的修补，所以才决定在几台服务器上都通过 Docker 来部署 Nginx，这样安装到服务器上的 Nginx 版本更新，更安全。


## 安装

在 Docker 中安装 Nginx 非常简单，一条指令 `docker pull nginx`，就把 Nginx 的镜像下载到本机上了。

从下面的输出日志 `Using default tag: latest` 中可以看到，默认下载的是最新版（latest）的 Nginx。

```
bogon:~ samsara$ docker pull nginx
Using default tag: latest
latest: Pulling from library/nginx
177e7ef0df69: Pull complete
ea57c53235df: Pull complete
bbdb1fbd4a86: Pull complete
Digest: sha256:b543f6d0983fbc25b9874e22f4fe257a567111da96fd1d8f1b44315f1236398c
Status: Downloaded newer image for nginx:latest
```

## 启动

镜像下载过来之后，就可以执行指令启动 Nginx 容器了，在输入的命令上，有几点需要注意：

### 后台启动

Nginx 需要在“后台”执行，也就是需要加上 `-d` 指令。如果不加这个指令，直接执行 `docker run nginx`，那么 Nginx 就会占用当前终端，不够方便。如果按下快捷键 `Ctrl+C` 的话，就会停止 Nginx 容器。不只是 Nginx 如此，各种其它容器也是如此。

加了 `-d` 这个指令的话，执行完 `docker run -d nginx` 之后，Docker 会把 Nginx 运行在后台，然后就可以继续使用当前终端进行其它操作了，这样更方便一些。

参考资料：

- [后台运行](https://yeasy.gitbooks.io/docker_practice/content/container/daemon.html)

### 映射端口

启动 Nginx 容器时，默认只会开放容器中的 80 端口，并不会把容器中的端口映射到主机的端口上。比如执行 `docker run -d nginx` 之后，再执行 `docker ps` 查看当前正在运行的容器，就会看到如下的输出结果（精简了输出的部分列）。

```
bogon:~ samsara$ docker ps
CONTAINER ID        IMAGE        PORTS               NAMES
277778154ef1        nginx        80/tcp              romantic_bhaskara
```

`PORTS` 这一列显示的是容器的端口情况，这里显示的是 `80/tcp`，意味着只在容器内开放了 80 端口，在主机中没有映射对应的端口，所以无法在主机中访问容器里的 Nginx。这个时候在浏览器中访问 http://localhost/ 或者 http://127.0.0.1 的话，是看不到页面的。

如果改用 `docker run -p 8080:80 -d nginx` 来启动 Nginx 容器的话，这个时候在浏览器中再访问 http://localhost:8080/ 或者 http://127.0.0.1:8080/ ，就能看到 Nginx 默认的欢迎页面了。

这是因为 `-p 8080:80` 告诉 Docker，在 Nginx 容器中开放 80 端口，同时将其映射到主机的 8080 端口上。

再用 `docker ps` 查看容器的运行情况，就会看到如下的输出结果（精简了输出的部分列）。

```
bogon:~ samsara$ docker ps
CONTAINER ID        IMAGE        PORTS                  NAMES
432b734894a4        nginx        0.0.0.0:8080->80/tcp   frosty_villani
277778154ef1        nginx        80/tcp                 romantic_bhaskara
```

先不要管为什么有两个容器在运行着。先看 ID 为 432b734894a4 的容器，可以看到，Docker 将容器的 80 端口映射到了本机的 8080 端口上，IP 地址 0.0.0.0 可以简单地理解为主机所有可用的 IP 地址，比如 127.0.0.1。

而 localhost 这个域名默认会被解析为 127.0.0.1，所以通过这两个地址来访问 8080 端口的话，看到的是同一个页面。

参考资料：

- [外部访问容器](https://yeasy.gitbooks.io/docker_practice/content/network/port_mapping.html)
- [127.0.0.1和0.0.0.0地址的区别](https://blog.csdn.net/ythunder/article/details/61931080)

### 指定名称

从上面的终端输出结果可以看到，这个时候已经启动了两个 Nginx 容器了，为什么呢？

因为以某个镜像为基础启动容器的时候，如果不用 `--name` 参数为其指定名称，那么每执行一次 `docker run nginx` 这样的指令，就会启动一个新的 Nginx 容器。

一般来说，其实只需要一个 Nginx 容器，那么在启动它的时候，就需要为它设置一个名称：

```
bogon:~ samsara$ docker run --name webserver -p 8080:80 -d nginx
fcf470476af463de6fbd4644b9807b60c6b3d420d1afe0122348755dbc765f1e
docker: Error response from daemon: driver failed programming external connectivity on endpoint webserver (4fe74bbb92f029d33cfc2defbe0c466341ae5a7e7ed5813966d6bb8bafd962a9): Bind for 0.0.0.0:8080 failed: port is already allocated.
```

嗯？这里怎么还报错了呢？仔细查看报错信息的最后一句：port is already allocated。哦，明白了，前面启动容器的时候，已经将这个容器的 80 端口映射到主机的 8080 端口上了。而主机上的同一个端口，在同一时间只能被一个容器所占用。这样的话，我把新容器的端口映射到主机上别的端口就行了吧？好，换成 8888 端口再试试。

```
bogon:~ samsara$ docker run --name webserver -p 8888:80 -d nginx
docker: Error response from daemon: Conflict. The container name "/webserver" is already in use by container "fcf470476af463de6fbd4644b9807b60c6b3d420d1afe0122348755dbc765f1e". You have to remove (or rename) that container to be able to reuse that name.
See 'docker run --help'.
```

怎么又报错了？再看看报错信息：Conflict. The container name "/webserver" is already in use by container。意思是说，`webserver` 这个名称已经被别的容器用了，这次新建的容器就不能再用这个名字了。好吧，那就再给新容器换个名字。

```
bogon:~ samsara$ docker run --name web -p 8888:80 -d nginx
e287bd430c4d4ac2371be3835e25925d78ff6acd72373e7f2bb91bfe15f15d3c
```

啊哈，没有报错信息，这回应该是 OK 了。在浏览器里访问 http://localhost:8888/ 或者 http://127.0.0.1:8888/ ，棒，又能看到 Nginx 的欢迎页面了。

等等，刚才有个细节，可能有人注意到了：在第一次以指定名称 webserver 启动 Nginx 容器的时候失败了，是因为端口和之前已启动的容器相同，产生冲突了。但是我换个端口启动 webserver 容器的时候，又说容器名称冲突，这么说的话，就意味着虽然这两次启动容器虽然报错，但是容器还是存在的？嗯，那就看看现在机器上有哪些容器（精简了输出的部分列）。

```
bogon:~ samsara$ docker ps -a
CONTAINER ID     IMAGE     STATUS              PORTS                  NAMES
e287bd430c4d     nginx     Up 8 minutes        0.0.0.0:8888->80/tcp   web
fcf470476af4     nginx     Created                                    webserver
432b734894a4     nginx     Up 20 minutes       0.0.0.0:8080->80/tcp   frosty_villani
277778154ef1     nginx     Up 21 minutes       80/tcp                 romantic_bhaskara
```

我了个擦，怎么有四个容器？看来前面的猜测是真的：如果容器启动失败，那么容器依然会被新建，只是处于停止状态而已。

这里的命令 `docker ps -a` 相比之前的多了一个 `-a` 参数，意味着列出所有的容器。查看镜像的话也是如此，`docker image ls -a` 会列出所有镜像，包含中间层镜像（这个概念在这里先不深入探讨）。

对我们来说，其实只需要最后一次启动的、名称为 `web` 的这个容器就行，后面三个容器都可以删掉。但是这里有一点要注意：运行中的容器是不可以删除的，也就是 `STATUS` 那一列为 `UP` 状态的容器。

那就先把不需要的容器停止掉，这里有一个小技巧：由于每个容器或者镜像都有互相独立且唯一的 ID，因此在对容器或者镜像进行操作时，可以只取 ID 的前几位进行操作，这样会快很多（精简了输出的部分列）。

```
bogon:~ samsara$ docker stop 43 27
43
27

bogon:~ samsara$ docker ps -a
CONTAINER ID        IMAGE        STATUS                          PORTS                  NAMES
e287bd430c4d        nginx        Up 26 minutes                   0.0.0.0:8888->80/tcp   web
fcf470476af4        nginx        Created                                                webserver
432b734894a4        nginx        Exited (0) About a minute ago                          frosty_villani
277778154ef1        nginx        Exited (0) About a minute ago                          romantic_bhaskara
```

然后再把后面三个不需要的容器都删除，就可以了（这次没有精简输出结果）。

```
bogon:~ samsara$ docker rm fc 43 27
fc
43
27

bogon:~ samsara$ docker ps -a
CONTAINER ID        IMAGE        COMMAND                  CREATED             STATUS              PORTS                  NAMES
e287bd430c4d        nginx        "nginx -g 'daemon of…"   28 minutes ago      Up 28 minutes       0.0.0.0:8888->80/tcp   web
```

参考资料：

- [列出镜像](https://yeasy.gitbooks.io/docker_practice/content/image/list.html)

## 配置

### 导出配置

现在已经把 Docker 启动起来了，但是默认的配置肯定无法满足我们的使用需求，那就先把 Nginx 容器所使用的配置文件拷贝出来：

```
bogon:~ samsara$ mkdir ~/code/nginx.d/conf.d

bogon:~ samsara$ cd ~/code/nginx.d/conf.d

bogon:conf.d samsara$ docker cp web:/etc/nginx/nginx.conf .

bogon:conf.d samsara$ ls
nginx.conf
```

### 加载配置

拷贝完成后，在本机中编辑配置文件即可。那么编辑好了之后，该怎么让 Nginx 容器使用这个配置文件呢？用 `-v` 参数，把主机中的文件挂载到容器中就行。这样一来，Nginx 容器就可以使用主机上修改后的配置文件了。

```
bogon:conf.d samsara$ docker stop web
web

bogon:conf.d samsara$ docker start \
> -v nginx.conf:/etc/nginx/nginx.conf \
> web
unknown shorthand flag: 'v' in -v
See 'docker start --help'.
```

又报错了，看来在 `docker run` 命令中可以用的 `-v` 参数，到了 `docker start` 命令中就用不了了。

这个时候，忽然又有了新想法：有没有什么办法，让每次启动的容器，在停止之后就自动删除？这样测试起来就方便多了，上网查了查，哈哈，果然有这个参数：`--rm`，那就试试。

先把之前的容器停止并删除。

```
bogon:conf.d samsara$ docker stop web
web

bogon:conf.d samsara$ docker ps -a
CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS                     PORTS               NAMES
e287bd430c4d        nginx               "nginx -g 'daemon of…"   2 hours ago         Exited (0) 3 seconds ago                       web

bogon:conf.d samsara$ docker rm web
web

bogon:conf.d samsara$ docker ps -a
CONTAINER ID        IMAGE               COMMAND             CREATED             STATUS              PORTS               NAMES
```

然后启动一个新容器，并让它停止之后就自动删除。

```
bogon:conf.d samsara$ docker run \
  --rm \
  --name web \
  -p 8888:80 \
  -v ~/code/nginx.d/conf.d/nginx.conf:/etc/nginx/nginx.conf \
  -d nginx
```

上面的命令，是以 Nginx 镜像为基础，在后台启动了一个名为 `web` 的 Nginx 容器，容器中开放的 80 端口映射到了主机的 8888 端口，并且把主机上的配置文件 `~/code/nginx.d/conf.d/nginx.conf` 挂载为容器中的配置文件 `/etc/nginx/nginx.conf`。

前面五行命令，每行最后有一个斜杠 `\`，加这个斜杠，是为了将命令进行格式化，有换行，命令看着就没那么臃肿了。

用这种挂载的方式，将主机中的配置文件挂载到 Nginx 容器中，一个最大的好处就是：只要在主机中修改了配置文件，并且经 Nginx 容器测试配置文件无误之后，就可以让 Nginx 容器加载最新的配置文件了。

```
bogon:conf.d samsara$ docker exec -it web nginx -t
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful

bogon:conf.d samsara$ docker exec -it web nginx -s reload
2019/01/12 08:35:13 [notice] 15#15: signal process started

bogon:conf.d samsara$ docker ps -a
CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS                  NAMES
bfaed028399e        nginx               "nginx -g 'daemon of…"   6 minutes ago       Up 6 minutes        0.0.0.0:8888->80/tcp   web
```

上面执行的第一条命令 `docker exec -it web nginx -t`，是进入 Nginx 容器，并执行 `nginx -t` 这个命令，测试我主机上修改后的配置文件是否有格式错误，是否可用。

第二条命令 `docker exec -it web nginx -s reload`，则是进入 Nginx 容器，并执行 `nginx -s reload` 命令，让Nginx 重新加载配置文件。最后再用 `docker ps -a` 查看容器的状态，`STATUS` 那里依然是 `UP`，说明加载新的配置文件之后，容器依然在正常运行，这下就可以放心了。

Nginx 容器的配置文件可以用这种挂载的方式进行加载，Nginx 所需代理的网站自然也是如此，在主机上编写，然后挂载到 Nginx 容器中进行测试，这样一来，让程序（Nginx 容器）与配置和数据（网站相关文件）相分离，维护起来就方便多了。

---

> 后面再写点儿啥呢？