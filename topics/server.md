# 阿里云轻量应用服务器教程

- [阿里云轻量应用服务器教程](#%E9%98%BF%E9%87%8C%E4%BA%91%E8%BD%BB%E9%87%8F%E5%BA%94%E7%94%A8%E6%9C%8D%E5%8A%A1%E5%99%A8%E6%95%99%E7%A8%8B)
    - [服务器购买及开通](#%E6%9C%8D%E5%8A%A1%E5%99%A8%E8%B4%AD%E4%B9%B0%E5%8F%8A%E5%BC%80%E9%80%9A)
    - [远程登录服务器](#%E8%BF%9C%E7%A8%8B%E7%99%BB%E5%BD%95%E6%9C%8D%E5%8A%A1%E5%99%A8)
        - [设置密钥](#%E8%AE%BE%E7%BD%AE%E5%AF%86%E9%92%A5)
        - [Windows 连接至服务器](#windows-%E8%BF%9E%E6%8E%A5%E8%87%B3%E6%9C%8D%E5%8A%A1%E5%99%A8)
        - [Mac 连接至服务器](#mac-%E8%BF%9E%E6%8E%A5%E8%87%B3%E6%9C%8D%E5%8A%A1%E5%99%A8)
            - [步骤一：准备 pem 密钥文件](#%E6%AD%A5%E9%AA%A4%E4%B8%80%EF%BC%9A%E5%87%86%E5%A4%87-pem-%E5%AF%86%E9%92%A5%E6%96%87%E4%BB%B6)
            - [步骤二：SSH 连接至服务器](#%E6%AD%A5%E9%AA%A4%E4%BA%8C%EF%BC%9Assh-%E8%BF%9E%E6%8E%A5%E8%87%B3%E6%9C%8D%E5%8A%A1%E5%99%A8)
            - [步骤三：保存 SSH 会话](#%E6%AD%A5%E9%AA%A4%E4%B8%89%EF%BC%9A%E4%BF%9D%E5%AD%98-ssh-%E4%BC%9A%E8%AF%9D)
            - [步骤四：启用密码登录](#%E6%AD%A5%E9%AA%A4%E5%9B%9B%EF%BC%9A%E5%90%AF%E7%94%A8%E5%AF%86%E7%A0%81%E7%99%BB%E5%BD%95)
    - [更新系统中所有程序包（package）](#%E6%9B%B4%E6%96%B0%E7%B3%BB%E7%BB%9F%E4%B8%AD%E6%89%80%E6%9C%89%E7%A8%8B%E5%BA%8F%E5%8C%85%EF%BC%88package%EF%BC%89)
    - [用户配置](#%E7%94%A8%E6%88%B7%E9%85%8D%E7%BD%AE)
        - [建立普通权限用户](#%E5%BB%BA%E7%AB%8B%E6%99%AE%E9%80%9A%E6%9D%83%E9%99%90%E7%94%A8%E6%88%B7)
    - [配置 node 环境](#%E9%85%8D%E7%BD%AE-node-%E7%8E%AF%E5%A2%83)
        - [为普通权限用户安装 nvm](#%E4%B8%BA%E6%99%AE%E9%80%9A%E6%9D%83%E9%99%90%E7%94%A8%E6%88%B7%E5%AE%89%E8%A3%85-nvm)
        - [安装最新版 node.js](#%E5%AE%89%E8%A3%85%E6%9C%80%E6%96%B0%E7%89%88-nodejs)
    - [配置 Express 框架](#%E9%85%8D%E7%BD%AE-express-%E6%A1%86%E6%9E%B6)
        - [安装 Express](#%E5%AE%89%E8%A3%85-express)
        - [创建项目](#%E5%88%9B%E5%BB%BA%E9%A1%B9%E7%9B%AE)
        - [启动项目](#%E5%90%AF%E5%8A%A8%E9%A1%B9%E7%9B%AE)
    - [配置 nginx 映射项目](#%E9%85%8D%E7%BD%AE-nginx-%E6%98%A0%E5%B0%84%E9%A1%B9%E7%9B%AE)
        - [安装 nginx](#%E5%AE%89%E8%A3%85-nginx)
        - [转发至 Express 程序](#%E8%BD%AC%E5%8F%91%E8%87%B3-express-%E7%A8%8B%E5%BA%8F)
        - [重定向 www 域名至非 www 域名](#%E9%87%8D%E5%AE%9A%E5%90%91-www-%E5%9F%9F%E5%90%8D%E8%87%B3%E9%9D%9E-www-%E5%9F%9F%E5%90%8D)
    - [配置域名](#%E9%85%8D%E7%BD%AE%E5%9F%9F%E5%90%8D)
        - [购买域名](#%E8%B4%AD%E4%B9%B0%E5%9F%9F%E5%90%8D)
        - [设置 GoDaddy 域名解析](#%E8%AE%BE%E7%BD%AE-godaddy-%E5%9F%9F%E5%90%8D%E8%A7%A3%E6%9E%90)
        - [设置阿里云云解析](#%E8%AE%BE%E7%BD%AE%E9%98%BF%E9%87%8C%E4%BA%91%E4%BA%91%E8%A7%A3%E6%9E%90)
        - [服务器/域名备案](#%E6%9C%8D%E5%8A%A1%E5%99%A8%E5%9F%9F%E5%90%8D%E5%A4%87%E6%A1%88)
    - [设置 Git 仓库](#%E8%AE%BE%E7%BD%AE-git-%E4%BB%93%E5%BA%93)
        - [初始化仓库](#%E5%88%9D%E5%A7%8B%E5%8C%96%E4%BB%93%E5%BA%93)
        - [关联仓库和项目](#%E5%85%B3%E8%81%94%E4%BB%93%E5%BA%93%E5%92%8C%E9%A1%B9%E7%9B%AE)
        - [本机建立对应项目](#%E6%9C%AC%E6%9C%BA%E5%BB%BA%E7%AB%8B%E5%AF%B9%E5%BA%94%E9%A1%B9%E7%9B%AE)
        - [更改本地项目并推送](#%E6%9B%B4%E6%94%B9%E6%9C%AC%E5%9C%B0%E9%A1%B9%E7%9B%AE%E5%B9%B6%E6%8E%A8%E9%80%81)
    - [配置守护进程](#%E9%85%8D%E7%BD%AE%E5%AE%88%E6%8A%A4%E8%BF%9B%E7%A8%8B)

## 服务器购买及开通

这个步骤很简单，选好配置，下单，付款，等几分钟服务器就自动运行起来了。

我购买的服务器配置：

- CPU：1核
- 内存：1G
- 硬盘：20G SSD云盘
- 区域：北京（离自己所在城市最近）
- 操作系统：CentOS 7
- 应用镜像：Node.js 4.8.4

## 远程登录服务器

### 设置密钥

服务器运行起来之后，有两种方式可以登录服务器，一种是在浏览器中登录，便捷，但功能不够强大。

另一种就是在 Windows 或者 Mac 中通过专门的软件来登录。

为了保证远程登录的安全，阿里云会要求生成密钥并下载 pem 文件至本地，登录时需要用到这个文件。下面就分别说一下在 Windows 和 Mac 下如何建立 SSH 安全连接。

### Windows 连接至服务器

Windows 下的操作流程，按照官方文档来就可以了，每一步都列出来了，照着操作就行。

具体操作步骤请查看[通过本地 SSH 客户端连接服务器](https://help.aliyun.com/document_detail/59083.html?spm=5176.10173289.0.0.378f90fd0Orgcq)一文中，“本地为 Windows 环境”的这一小节。

### Mac 连接至服务器

Mac 自带的终端或者 iTerm 就可以很好地完成这件事，无需另外安装软件。

#### 步骤一：准备 pem 密钥文件

本机存放 SSH 相关文件的目录位于 `~/.ssh` ，所以把前面下载到本地的 pem 文件复制到这里就行。

```shell
> cd ~/.ssh
> sudo cp ~/Downloads/swas.pem swas.pem
```

然后设置 pem 文件的权限。

```shell
> chmod 400 swas.pem
```

#### 步骤二：SSH 连接至服务器

```shell
// 10.10.10.10仅作说明用，请将这个IP改成服务器的实际IP
> ssh root@10.10.10.10 -i ~/.ssh/swas.pem
```

输入上面的命令之后，如果成功登录，则会显示类似下面的信息，说明登录成功。

```shell
Last login: Wed Sep 27 10:18:43 2017 from 22.22.22.22

Welcome to Alibaba Cloud Elastic Compute Service !

-bash: warning: setlocale: LC_CTYPE: cannot change locale (UTF-8): No such file or directory
manpath: can't set the locale; make sure $LC_* and $LANG are correct
[root@XXXX ~]#
```

然后我们再输入 `exit` 关闭 SSH 连接，进行下面的操作。

#### 步骤三：保存 SSH 会话

在 Mac 下，自然要用 iTerm2 这款强大的终端软件。通过在软件中设置 Profile，就能方便地一键连接至服务器。

1. 运行 iTerm2，按下快捷键 `⌘+,`，打开 iTerm2 的选项设置对话框。
1. 点击 Profiles 这个标签，我们来新建一个 Profile（配置文件），用于实现一键连接服务器的功能。
1. 参照下图，点击界面左下角的加号 +，新建一个 Profile。Name 为这个 Profile 的名称，Tag 可以当做注释，Shortcut key 是快速启动这个 Profile 的快捷键，由于在 Mac 下，微信占用了 ^⌘A 这个快捷键用作截图，所以在这里我把快捷键设置为 ^⌘1。Command 那里，就填第二步中的一长串命令。
1. 设置完成，关闭选项设置对话框，然后在 iTerm2 中按下快捷键 ^⌘1，开始玩服务器吧！

![iTerm2 Profile - Save SSH Session](https://raw.githubusercontent.com/Dream4ever/Pics/master/iterm2-ssh-session.png)

参考资料：

- [通过本地 SSH 客户端连接服务器 - 本地为 Linux 或支持 SSH 命令的环境](https://help.aliyun.com/document_detail/59083.html?spm=5176.10173289.0.0.2d2fedd63Boph1)：按照教程“本地为 Linux 或支持 SSH 命令的环境”这一小节里的说明，用 `chmod` 命令设置 pem 文件的权限。
- [connecting to amazon aws linux server by ssh on mac](https://stackoverflow.com/a/14230817)：参考这个回答，将 pem 文件放到 `~/.ssh` 目录下。
- [Fast SSH Windows With iTerm 2](https://hiltmon.com/blog/2013/07/18/fast-ssh-windows-with-iterm-2/)：参考这个回答，在 iTerm2 中保存 SSH 会话，通过快捷键可立即连接至服务器。

#### 步骤四：启用密码登录

由于启用 SSH 登录方式之后，服务器默认会将 root 帐号密码登录的方式禁用掉。而自己不知道做了什么修改，使得在 Mac 下无法通过密钥登录，只好再次开启密码登录的方式。

在 Windows 上登录服务器，然后做如下操作。

```shell
sudo vi /etc/ssh/sshd_config
// 在 vim 中将 PasswordAuthentication no 改为 PasswordAuthentication yes，然后保存退出
sudo systemctl restart sshd
// 上面的命令重启了 sshd，这样在 Mac 中就可以用密码登录 root 帐号了
```

参考资料：

- [启用密钥后恢复账号密码登录](https://help.aliyun.com/document_detail/59083.html?spm=5176.10173289.0.0.244123376jXRwl#activeroot)
- [ssh : Permission denied (publickey,gssapi-with-mic)](https://stackoverflow.com/questions/36300446/ssh-permission-denied-publickey-gssapi-with-mic)

## 更新系统中所有程序包（package）

装好了系统，先把所有程序都更新到最新版。

```shell
> yum update
```

执行了上面的命令之后，会提示有许多 packages 需要更新，可能还有附带的 packages 需要安装，按下 `y` 键并回车，开始更新即可。

## 用户配置

### 建立普通权限用户

由于用 root 用户登录服务器可能带来安全问题，比如误删文件等等，所以需要建立一个普通权限的用户进行日常操作。

```shell
> adduser www
> passwd www
// 输入第二条命令之后，会提示输入两次密码，输入密码的过程中不会显示任何内容，盲打即可
```

参考资料：

-[How To Add and Delete Users on a CentOS 7 Server](https://www.digitalocean.com/community/tutorials/how-to-add-and-delete-users-on-a-centos-7-server)

## 配置 node 环境

建立 www 用户之后，就可以用这个用户登录了。

首次登录时，提示 `-bash: /root/nvm/nvm.sh: Permission denied`。可以看出来，因为用非 root 用户登录，默认是没有权限使用 root 用户安装的 nvm的，那该怎么办呢？跟我来。

### 为普通权限用户安装 nvm

先根据官网的教程，安装最新版的 nvm。

```shell
> curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.4/install.sh | bash
```

然后执行下面的命令，完成 nvm 的设置。

```shell
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
```

### 安装最新版 node.js

所购买的服务器，自带的 node.js 版本为 4.8.4，实在是有点儿老，果断给它升级一下。

```shell
> nvm install node
// 如果 nvm 不识别 node 参数，就得明确指定 node 的版本了
> nvm install 8.6.0
```

上面的命令，会安装最新版 8.6.0。安装完成后，我们再看看系统中有哪些版本的 node.js。

```shell
> nvm ls
->       v8.6.0
default -> 8.6.0 (-> v8.6.0)
node -> stable (-> v8.6.0) (default)
stable -> 8.6 (-> v8.6.0) (default)
iojs -> N/A (default)
lts/* -> lts/boron (-> N/A)
lts/argon -> v4.8.4 (-> N/A)
lts/boron -> v6.11.3 (-> N/A)
```

从上面的输出结果可以看到，普通使用的话，有最新的 8.6.0 就够了。这样基础的 node 环境就配置好了。

参考资料：

- [creationix/nvm](https://github.com/creationix/nvm):nvm的官网，参考上面的安装流程。
- [ubuntu中npm安装全局插件提示没有root管理员权限](https://zhouyuexie.github.io/ubuntu%E4%B8%ADnpm%E5%AE%89%E8%A3%85%E5%85%A8%E5%B1%80%E6%8F%92%E4%BB%B6%E6%8F%90%E7%A4%BA%E6%B2%A1%E6%9C%89root%E7%AE%A1%E7%90%86%E5%91%98%E6%9D%83%E9%99%90/)
- [线上node服务的配置和维护，使用非root账户运行和sudo管理](https://cnodejs.org/topic/57216ea1fa48138c41110ec8)

## 配置 Express 框架

### 安装 Express

基本的 node.js 环境建立起来了，那就先用 Express 搭建一个简单的网页框架，首先把 Express 框架安装好。

```shell
> npm install -g express
> npm install -g express-generator
```

### 创建项目

然后再用 Express 框架创建项目 blog。

```shell
> express -v ejs blog
> cd blog && npm install
```

### 启动项目

项目建立起来之后，当然要运行一下看看啦。好，那就执行 `npm start`，然后在网页中访问 [http://10.10.10.10:3000](http://10.10.10.10:3000)，嗯？为什么打不开呢？想起来购买的这个服务器还装了 nginx 这个反向代理，是不是和它有关？

Google 一番，发现原来需要在服务器控制台的“防火墙”中开放 3000 这个端口，于是新建一个应用类型为“自定义”的端口，协议选择“TCP”，端口号设置为“3000”。

然后再重启刚才新建的 Express 项目，并访问上面的那个网址，啊哈，可以访问了！

参考资料：

- [阿里云ubuntu nginx无法访问，求解答](https://segmentfault.com/q/1010000009437407)

## 配置 nginx 映射项目

由于 Express 默认用的是 3000 端口号，每次访问服务器的时候还要加上端口号实在是麻烦，那就在 nginx 中将来自 80 端口的请求都指向本机的 3000 端口。

注意，以下 nginx 相关的操作，都要在 root 用户中执行，为什么非 root 用户不能操作呢？请看这篇文章：[Why does nginx starts process as root?](https://unix.stackexchange.com/questions/134301/why-does-nginx-starts-process-as-root)。

### 安装 nginx

```shell
> sudo yum install epel-release
> sudo yum install nginx
```

然后启动 nginx，并使其开机自动启动。

```shell
> reboot
> sudo systemctl start nginx
> sudo systemctl enable nginx
```

参考资料：

- [How To Install Nginx on CentOS 7](https://www.digitalocean.com/community/tutorials/how-to-install-nginx-on-centos-7)

### 转发至 Express 程序

首先，查找 nginx 所在的路径。

```shell
> whereis nginx
nginx: /usr/sbin/nginx /usr/lib64/nginx /etc/nginx /usr/share/nginx /usr/share/man/man8/nginx.8.gz /usr/share/man/man3/nginx.3pm.gz
```

依次查看上面几个路径可知，/etc/nginx 文件夹里包含了 nginx.conf 这个配置文件。

```shell
> sudo vi /etc/nginx/nginx.conf
```

在 location 字段中增加下面这段代码，记得先将 10.10.10.10 改成服务器的外网 IP。

```shell
location / {
    proxy_pass http://10.10.10.10:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
}
```

然后重启 nginx，设置完成。

```shell
> sudo systemctl restart nginx
```

参考资料：

- [How To Set Up a Node.js Application for Production on CentOS 7](https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-centos-7)：参考其中的“Set Up Reverse Proxy Server”这一小节。

### 重定向 www 域名至非 www 域名

待完成。

## 配置域名

### 购买域名

买了服务器，不能只是用 IP 来访问，当然要买个域名了。上网查了一番，决定购买 GoDaddy 家的域名，比了比后缀和价格，最后买下了 [hewei.in](http://hewei.in) 这个域名。

### 设置 GoDaddy 域名解析

买了域名之后，还要设置 DNS 用于域名的解析。有两种方式：

第一种方式是用 GoDaddy 自家的域名解析服务，参照下图中设置 GoDaddy 的域名解析。红圈标注的地方设置为服务器的 IP，其它选项全用默认值。

![GoDaddy DNS Setting](https://raw.githubusercontent.com/Dream4ever/Pics/master/godaddy-dns-setting.png)

然后还要在阿里云的云解析中，添加域名的 A 记录和 CNAME 记录。

![AliYun DNS Setting](https://raw.githubusercontent.com/Dream4ever/Pics/master/aliyun-dns-setting.png)

然后等待十分钟左右，域名解析生效了，就可以访问啦~

小知识：什么是 A 记录？什么又是 CNAME 记录？

A 记录，就是将前面购买的域名，指向自己的服务器 IP，这样域名才能真正生效。设置 A 记录之前，只能通过 IP 访问服务器；添加了 A 记录之后，就可以通过域名访问服务器了。

而 CNAME 记录，则是将其它域名重定向到自己购买的域名，最常见的，就是将带了 `www.` 前缀的域名，指向自己购买的域名。像上图中那样，添加了主机记录为 www 的 CNAME 记录之后，访问 www.hewei.in，就会自动重定向到 hewei.in 了。

### 设置阿里云云解析

第二种设置域名解析的方式，是完全由阿里云来解析域名。这个就留给大家来自行探索吧！哈哈~

参考资料：

- [GoDaddy 域名修改 DNS 方法](https://help.aliyun.com/knowledge_detail/39851.html)

### 服务器/域名备案

待完成。

## 设置 Git 仓库

### 初始化仓库

在当前用户的根目录下（`/home/www`），专门新建一个 repo 文件夹，用于接收本地的推送并自动更新至前面建立的项目目录。

```shell
> cd ~
> mkdir repo && cd repo
> mkdir site.git && cd site.git
> git init --bare
```

上面最后一步的命令会新建 branches、hooks、info、objects、refs 这几个文件夹，和 HEAD、config、description 这几个文件。

### 关联仓库和项目

```shell
> cd hooks
> cat > post-receive
```

执行完这两行指令之后，输入下面的文字，并按 Ctrl+d 键保存。

```shell
#!/bin/sh
git --work-tree=/home/www/hewei.in --git-dir=/home/www/repo/site.git checkout -f
```

上面的两行文字中，`/home/www/hewei.in` 为前面新建的网站项目所在的目录，由于已经申请了域名，所以用域名为名称重新建立了网站项目；`home/www/repo/site.git` 则是刚才新建的仓库文件夹。这两个目录的实际路径要结合自己的实际情况来确定，不要照搬。

然后再执行下面的命令，设置刚才新建文件的权限，以保证它能够正常运行。

```shell
> chmod +x post-receive
```

### 本机建立对应项目

在本机上也建立同名的项目，便于管理。下面的命令行代码以 Mac 为例，Windows 类似。

```shell
> cd ~/Code
> mkdir hewei.in && cd hewei.in
> mkdir .git && cd .git
> git init
> git remote add live ssh://www@10.10.10.10/home/www/repo/site.git
```

上面命令中的最后一行代码，将远程服务器上刚才新建的仓库，命名为 live，并与本地仓库关联。

### 更改本地项目并推送

建立了关联之后，测试一下在本地的修改是否能成功推送到服务器上。将之前做的一个简单的网页内容复制到了 `/views/index.ejs` 中，然后执行下面的命令，开始上传。

```shell
git add .
git commit -m "init"
git push --set-upstream live master
```

由于是首次往服务器通过 git 上传文件，所以需要用最后一条命令，在远程服务器建立 master 分支，并将本地当前 master 分支的内容推送上去。

之后需要推送的话，只用执行 `git push` 命令就可以了。

参考资料：

- [How To Set Up Automatic Deployment with Git with a VPS](https://www.digitalocean.com/community/tutorials/how-to-set-up-automatic-deployment-with-git-with-a-vps)：大体思路参考这篇文章，但是在此基础上有所修改。

## 配置守护进程

待完成。