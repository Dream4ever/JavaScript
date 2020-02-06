# 通过 Nginx 实现多机负载均衡

现有三台同一网络中的 CentOS 服务器，需要对这三台服务器进行合理的负载均衡配置，使各服务器的硬件及带宽资源均得到有效利用。整体来说很简单，只有一点需要注意，就是三台服务器上的 Nginx 都运行在 Docker 中，需要区分清楚主机 IP 和 Docker 内的 IP 这两个不同的 IP。

## 功能规划

三台服务器分别用 A、B、C 指代。A 服务器 80 端口上的负载均衡服务，负责将用户的请求分流至三个 Web 应用服务，这三个 Web 应用服务分别运行在本机的 8080 端口及 B、C 服务器的 80 端口。

| 服务器   | 用途   | 端口   | 
|:----|:----|:----|
| A   | 负载均衡   | 80   | 
| A   | Web应用   | 8080   | 
| B   | Web应用   | 80   | 
| C   | Web应用   | 80   | 

## 路径规划

负载均衡服务及 Web 应用服务均通过 Nginx 实现，为了方便开发，这里采用 Docker 来部署三台服务器上的四个 Nginx。

Nginx 配置及 Dockerfile 部署路径见下表。

| -   | 负载均衡   | Web应用   | 
|:----|:----|:----|
| 根路径   | /var/nginx/load-balancer   | /var/nginx/web-server   | 
| 网站配置   | ./conf.d/load-balancer.conf   | ./conf.d/web-server.conf   | 
| Dockerfile   | ./Dockerfile   | ./Dockerfile   | 

## 服务配置

两类服务的基础配置 ，也就是 nginx.conf 文件是相同的。不同之处只是具体的功能设置，在 conf.d 目录下的 conf 文件中体现。

### 负载均衡

用于负载均衡服务的 Nginx 镜像，其配置文件及 Dockerfile 如下所示。

这里有一个关键点要注意，由于 A 服务器上将会运行两个 Nginx 容器，要想将负载均衡服务的请求导向同一服务器上的 Web 应用服务，就需要把请求发给 Web 应用服务用于 Docker 容器间通信的 IP，而不是 A 服务器的外网 IP 或者局域网 IP，因此这里 upstream 中为 A 服务器上的 Web 应用服务所设置的 IP 为 172.17.0.3。

```
# 负载均衡服务的配置文件
# load-balancer.conf
upstream servers {
    server 172.17.0.3:8080; # Docker 容器间通信，需用此 IP
    server B;
    server C;
}

server {
    listen       80;
    server_name  localhost;


    location / {
        proxy_pass http://servers;
    }
}
```

```
# 负载均衡服务的 Dockerfile
FROM nginx:latest

RUN rm /etc/nginx/nginx.conf
RUN rm /etc/nginx/conf.d/default.conf

COPY ./nginx.conf /etc/nginx/nginx.conf
COPY ./conf.d/load-balancer.conf /etc/nginx/conf.d/load-balancer.conf
```

### Web 应用

用于 Web 应用服务的 Nginx 镜像，其配置文件及 Dockerfile 如下所示。

```
# Web应用的配置文件
# load-balancer.conf
server {
    listen       80; # 对于 A 服务器，这里需要改成 8080
                     # 因为默认的 80 端口已被负载均衡服务占用了
    server_name  localhost;

    location / {
        root   /usr/share/nginx/html;
        index  index.html index.htm;
    }

    # 公用静态资源
    location /vendor {
        alias /var/www/vendor;
    }

    # 网站路径
    location /website {
        alias /var/www/website;
    }
}
```

```
# Web 应用服务的 Dockerfile

FROM nginx:latest

RUN rm /etc/nginx/nginx.conf
RUN rm /etc/nginx/conf.d/default.conf

COPY ./nginx.conf /etc/nginx/nginx.conf
COPY ./conf.d/web-server.conf /etc/nginx/conf.d/web-server.conf
```

## 镜像编译

完成两类服务的 Nginx 配置文件和 Dockerfile 的编辑之后，就需要编译生成镜像了。

分别进入负载均衡服务和 Web 应用服务所在的目录，确保 Dockerfile 就在所进入的路径下，然后执行下面的命令，即可编译镜像：

```
# 负载均衡服务
$ docker build -t load-balancer:1.0.0 .

# Web 应用服务
$ docker build -t web-server:1.0.0 .
```

## 容器启动

编译好两个 Docker 镜像之后，就需要把它们运行起来了。

由于 A 服务器上会运行两个 Nginx 镜像，为了方便调试，各自的日志文件需设置不同的路径。

| 服务   | 日志文件路径（需手动创建目录）   | 
|:----|:----|
| 负载均衡   | /var/log/nginx/load-balancer   | 
| Web 应用   | /var/log/nginx/web-server   | 

另外 Web 应用需要访问宿主的 /var/www/website 和 /var/www/vendor 这两个路径，所以对于负载均衡服务和 Web 应用服务而言，分别需要挂载 1 个、3 个目录。

这两个服务的容器启动命令如下：

```
# 负载均衡服务的启动命令
$ docker run --name load-balancer \
-v /var/log/nginx/load-balancer:/var/log/nginx \
-p 80:80 -d load-balancer:1.0.0

# Web 应用服务的启动命令
$ docker run --name web-server \
-v /var/log/nginx/web-server:/var/log/nginx \
-v /var/www/tspt:/var/www/tspt \
-v /var/www/vendor:/var/www/vendor \
-p 8080:8080 -d web-server:1.0.0
```

## 效果验证

三台服务器上的四个服务启动成功之后，还需要查看各自的 Nginx 日志，确保负载均衡服务配置成功。在各台服务器上，执行下面的命令，查看 Nginx 日志。

```
# 查看负载均衡服务的日志
$ tail /var/log/nginx/load-balancer/access.log -f

# 查看 Web 应用服务的日志
$ tail /var/log/nginx/web-server/access.log -f
```

如果在本机访问页面，同时看到三台服务器上的 Web 应用服务日志都有新的请求，就说明负载均衡服务配置成功了，OK，大功告成！
