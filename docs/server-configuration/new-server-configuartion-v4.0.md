# 阿里云服务器配置笔记 4.0

> 2019年08月21日

## 安装系统

这次安装了阿里云上的官方 CentOS 镜像最新版 7.6，等待安装完毕，再继续下面的步骤。

## 配置 SSH

先按照 [使用SSH密钥对](https://help.aliyun.com/document_detail/51793.html) 一文中的方法，创建 SSH 密钥对，并与阿里云 ECS 实例绑定。

再按照 [使用SSH密钥对连接Linux实例](https://help.aliyun.com/document_detail/51798.html) 一文中的方法，使用 SSH 密钥对链接实例。在 macOS 环境下，建议 [设置 SSH 配置文件](https://help.aliyun.com/document_detail/51798.html#title-7je-5ba-sm2) 来简化 SSH 连接的操作。

注意：按照上面的教程配置，用 SSH 密钥对登录的话，默认是登录为 root 用户。如果想用其它用户登录，那么需要将服务器上 root 用户 `./.ssh/authorized_keys` 文件中的密钥复制出来，然后做如下操作，即可实现非 root 用户通过 SSH 密钥对登录。

```bash
# 服务端做如下操作
$ sudo su www
$ cd ~
$ mkdir .ssh
$ chmod 700 .ssh
$ vi .ssh/authorized_keys
# 按i键进入编辑模式，粘贴公钥内容，再按Esc键退出编辑模式，输入:x，即可保存并推出
$ chmod 600 .ssh/authorized_keys
$ exit
```

```bash
# 客户端做如下操作
$ vi ~/.ssh/config
# 将 User 字段后面的值改为需要登录的用户，如 www
```

## 更新软件

配置好 SSH 之后，连接至服务器，执行 `yum update -y`，更新系统所有已安装的软件包。

## 配置 Nginx 及 SSL

参考官方文档 [RHEL/CentOS | Nginx](http://nginx.org/en/linux_packages.html#RHEL-CentOS)，安装 Nginx。

安装完成后，参考 [Nginx/Tengine服务器安装SSL证书](https://help.aliyun.com/knowledge_detail/95491.html) 这篇文档将 SSL 证书部署至服务器上。但该文档更新时间为 2018-11-30，部分参数设置已经过时，正确的配置，以官方文档 [Configuring HTTPS servers](http://nginx.org/en/docs/http/configuring_https_servers.html) 为准。

配置完成之后，执行命令 `nginx -s reload` 加载最新的配置文件，如果不报错，说明设置成功。然后访问 https 协议的域名，如果显示 404 Not Found，说明 SSL 证书配置成功。

## 安装 Git

参考 [How to Install latest version of Git ( Git 2.x ) on CentOS 7](https://computingforgeeks.com/how-to-install-latest-version-of-git-git-2-x-on-centos-7/) 这篇文章，安装较新版本的 Git。

## 配置 Node 环境

按照 [nvm-sh/nvm](https://github.com/nvm-sh/nvm) 中的说明，安装 nvm，顺便装上最新版的 Node.js。

再按照 [Installation | Yarn](https://yarnpkg.com/en/docs/install#centos-stable) 中的说明，安装 Yarn。

## 部署博客

前面安装了 Git 和 Node 环境，现在把博客从 GitHub 上克隆到服务器上。

因为博客用的是 VuePress 这个框架，看到这个框架有了更新，就用 yarn 把旧的依赖包全删除了，安装了最新的 VuePress。

安装完成之后，按照 VuePress 的教程，将博客编译成静态文件，打包后的文件位于 /root/sites/blog/docs/.vuepress/dist 目录下。

这里还需要对 Nginx 进行配置。

首先需要 Nginx 的网站设置，编辑 /etc/nginx/conf.d/default.conf 文件，修改 SSL 所在 server 块中的 location 字段，将值设置成如下内容：

```
    location / {
        root /root/sites/blog/docs/.vuepress/dist;
        index index.html index.htm;
    }
```

然后再修改默认的 server 块，也就是 http 对应的 server，在 `listen 80` 后面增加一行：

```
    return 301 https://$host$request_uri;
```

这样就能将 http 的请求全部重定向到 https 上。

这样还不算完，还得修改 Nginx 的用户设置，编辑 /etc/nginx/nginx.conf 文件，将开头的 user nginx 改为 user root 之类的，确保执行 Nginx 的用户对博客所在目录有正常的读取权限。

这样全部配置完成之后，博客就可以正常访问了。折腾了一晚上，该好好休息一下了。
