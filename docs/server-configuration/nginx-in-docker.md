# 配置 Docker 中的 Nginx

这几天为了把自己买的阿里云服务器配置成比较顺手的生产环境，又把服务器重新配置了一遍。

在配置 Nginx 的过程中，忽然觉得可以把这些软件部署在 Docker 中嘛，这样一份配置文件就可以到处使用了，岂不是方便很多？折腾了两天，把自己研究的过程和大家分享一下。

## 安装 Docker

我买的服务器是 CentOS 系统，安装 Docker 时参考的是官方文档。阅读英语比较困难的同学，也可以看另一份中文的安装教程：

- 英文官方文档：[Get Docker CE for CentOS | Docker Documentation](https://docs.docker.com/install/linux/docker-ce/centos/)
- 中文教程：[CentOS 安装 Docker CE · Docker -- 从入门到实践](https://docker_practice.gitee.io/install/centos.html)

## 配置 Docker 加速器

这里用的是道云的加速器，配置方式参考[配置 Docker 加速器](https://www.daocloud.io/mirror#accelerator-doc)这个页面，使用的是用于 Linux 系列服务器的脚本。

## 安装 Nginx

配置完加速器之后，在服务器上就可以安装 Nginx 了。

```bash
$ docker pull nginx
Using default tag: latest
latest: Pulling from library/nginx
8176e34d5d92: Pull complete
5b19c1bdd74b: Pull complete
4e9f6296fa34: Pull complete
Digest: sha256:c8db985772160427261dc443e62cab3e07212f7d52a18093d29f561b767bccb2
Status: Downloaded newer image for nginx:latest
```

一般没什么问题的话，就是安装成功了。

## 配置 SSL 证书

### 复制证书文件到服务器

因为给自己的域名申请了 SSL 证书，而 Nginx 运行在 Docker 中，因此就需要将服务器上的证书挂载到 Docker 中。

而证书得先从自己的电脑上下载，下载完成并将证书文件解压到 `cert` 文件夹之后，通过 `scp` 这个命令将文件夹复制到服务器上（macOS 下可以直接在终端中执行 `scp`，Windows 的话则需要在 Git Bash 中执行，需要先安装 Git）。为了避免权限不足导致复制失败，可以将文件夹复制到服务器上指定用户的用户目录下，比如我平时就是通过 `www` 这个用户管理服务器，那么就可以执行下面的命令，把证书复制到服务器上：

```bash
$ mkdir ~/ssl
# 参考：scp 跨机远程拷贝
# http://linuxtools-rst.readthedocs.io/zh_CN/latest/tool/scp.html
$ scp -r e:\Downloads\cert www@1.2.3.4:/home/www/ssl
```

上面命令中的参数 `-r` 表示复制整个文件夹，`1.2.3.4` 是服务器的实际 IP 地址。

复制成功之后，SSL 证书就位于服务器的 `/home/www/ssl/cert` 目录下了。

### 配置 nginx.conf

Nginx 的配置文件 nginx.conf 也是挂载到 Docker 中让 Nginx 容器使用，这样既能避免修改镜像，又能够保证配置文件的通用性。

为了编写符合自己需求的配置文件，先启动 Docker 容器，把容器中的默认配置文件复制一份出来。

```bash
# 启动一个名为 webserver 的 nginx 容器
# 参考：利用 commit 理解镜像构成
# https://docker_practice.gitee.io/image/commit.html
$ docker run --name webserver -d -p 80:80 nginx
$ mkdir ~/nginx.d
# 将容器中的默认配置文件复制到用户目录下，e7d5 是容器的 ID 开头几位字母
# 参考：Copying files from Docker container to host - Stack Overflow
# https://stackoverflow.com/questions/22049212/
$ docker cp e7d5:/etc/nginx/nginx.conf /home/www/nginx.d
```

因为自己用的 SSL 证书也是从阿里云上申请的，所以 Nginx 中配置证书的方法参考的就是阿里云给出的流程。

> 以下属性中ssl开头的属性与证书配置有直接关系，其它属性请结合自己的实际情况复制或调整。默认的配置文件中，这一段是注释掉的，删掉就行。
> 注意配置文件中的 SSL 证书位于 `/etc/ssl/certs` 目录下，因为 Nginx 容器中有这个目录，所以要把服务器的实际目录映射到这里。

```
server {
    listen 443;
    server_name localhost;
    ssl on;
    root html;
    index index.html index.htm;
    ssl_certificate   /etc/ssl/certs/1234567890.pem;
    ssl_certificate_key  /etc/ssl/certs/1234567890.key;
    ssl_session_timeout 5m;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:!aNULL:!MD5:!ADH:!RC4;
    ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
    ssl_prefer_server_ciphers on;
    location / {
        root html;
        index index.html index.htm;
    }
}
```

由于服务器上的文本编辑只能用 vi/vim，如果不太会操作的话，其实可以再次借助 `scp` 命令，把配置文件从服务器再复制到本机上进行编辑，编辑完成之后再复制到服务器上，岂不爽歪歪？

### 测试 Nginx 启动方式

```bash
$ docker run --name webserver -d -p 80:80 nginx
```

用上面的代码启动之后，可以正常访问网站。

### 编写 Dockerfile（已坑）

现在 SSL 证书放到服务器上了，配置文件也写好了，接下来就编写 Dockerfile，这样只需要一个 Dockerfile，就可以很方便地构建符合自己需求的镜像了。

在服务器的用户目录下为 Nginx 镜像的 Dockerfile 新建对应目录：

```bash
$ mkdir ~/dockerfile.d/nginx.d && cd ~/dockerfile.d/nginx.d
```

在该目录下新建一个名为 `Dockerfile` 的文件，内容如下：

```bash
# 以 nginx 这个镜像作为基础镜像，本机不存在的话则从上面配置的源下载
FROM nginx
COPY nginx.conf /etc/nginx/nginx.conf
```

上面的命令会将服务器当前目录下的配置文件复制到容器中，以供容器中的 Nginx 使用。虽然各个网站上的教程都是这么写的，但是到了自己这里就怎么都不对了……

---

另一种直接通过命令行挂载服务器物理文件的方法，也不行：

```bash
$ docker run -d \
    --rm \
    --name webserver \
    -v /home/www/nginx.d/nginx.conf:/etc/nginx/nginx.conf:ro \
    -v /home/www/ssl/cert:/etc/ssl/certs:ro \
    nginx
```
