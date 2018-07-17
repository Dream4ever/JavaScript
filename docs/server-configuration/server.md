# 阿里云轻量应用服务器教程

## 一、服务器购买及开通

这个步骤很简单，选好配置，下单，付款，等几分钟服务器就自动运行起来了。

我购买的服务器配置：

- CPU：1核
- 内存：1G
- 硬盘：20G SSD云盘
- 区域：北京（离自己所在城市最近）
- 操作系统：CentOS 7
- 应用镜像：Node.js 4.8.4

## 二、远程登录服务器

### 设置密钥

服务器运行起来之后，有两种方式可以登录服务器，一种是在浏览器中登录，便捷，但功能不够强大。

另一种就是在 Windows 或者 Mac 中通过专门的软件来登录。

为了保证远程登录的安全，阿里云会要求生成密钥并下载 pem 文件至本地，登录时需要用到这个文件。下面就分别说一下在 Windows 和 Mac 下如何建立 SSH 安全连接。

### Windows 连接至服务器

Windows 下的操作流程，按照官方文档来就可以了，每一步都列出来了，照着操作就行。

具体操作步骤请查看[通过本地 SSH 客户端连接服务器](https://help.aliyun.com/document_detail/59083.html?spm=5176.10173289.0.0.378f90fd0Orgcq)一文中，“本地为 Windows 环境”这一小节。

### Mac 连接至服务器

Mac 自带的终端或者 iTerm2 就可以很好地完成这件事，无需另外安装软件。

#### 步骤一：准备 pem 密钥文件

本机存放 SSH 相关文件的目录位于 `~/.ssh` ，所以把前面下载到本地的 pem 文件复制到这里就行。

```bash
> cd ~/.ssh
> sudo cp ~/Downloads/swas.pem swas.pem
```

然后设置 pem 文件的权限。

```bash
> chmod 400 swas.pem
```

#### 步骤二：SSH 连接至服务器

```bash
// 10.10.10.10仅作说明用，请将这个IP改成服务器的实际IP
> ssh root@10.10.10.10 -i ~/.ssh/swas.pem
```

输入上面的命令之后，如果成功登录，则会显示类似下面的信息，说明登录成功。

```bash
Last login: Wed Sep 27 10:18:43 2017 from 22.22.22.22

Welcome to Alibaba Cloud Elastic Compute Service !

[root@XXXX ~]#
```

然后我们再输入 `exit` 关闭 SSH 连接，进行下面的操作。

#### 步骤三：保存 SSH 会话

在 Mac 下，自然要用 iTerm2 这款强大的终端软件。通过在软件中设置 Profile，就能方便地一键连接至服务器。

1. 运行 iTerm2，按下快捷键 `⌘+,`，打开 iTerm2 的选项设置对话框。
1. 点击 Profiles 这个标签，我们来新建一个 Profile（配置文件），用于实现一键连接服务器的功能。
1. 参照下图，点击界面左下角的加号 +，新建一个 Profile。Name 为这个 Profile 的名称，Tag 可以当做注释，Shortcut key 是快速启动这个 Profile 的快捷键，由于在 Mac 下，微信占用了 ^⌘A 这个快捷键用作截图，所以在这里我把快捷键设置为 ^⌘1。Command 那里，就填第二步中的一长串命令。
1. 设置完成，关闭选项设置对话框，然后在 iTerm2 中按下快捷键 ^⌘1，开始玩服务器吧！

![iTerm2 Profile - Save SSH Session](https://gitee.com/samsara9527/Pics/raw/master/server/iterm2-ssh-session.png)

参考资料：

- [通过本地 SSH 客户端连接服务器 - 本地为 Linux 或支持 SSH 命令的环境](https://help.aliyun.com/document_detail/59083.html?spm=5176.10173289.0.0.2d2fedd63Boph1)：按照教程“本地为 Linux 或支持 SSH 命令的环境”这一小节里的说明，用 `chmod` 命令设置 pem 文件的权限。
- [connecting to amazon aws linux server by ssh on mac](https://stackoverflow.com/a/14230817)：参考这个回答，将 pem 文件放到 `~/.ssh` 目录下。
- [Fast SSH Windows With iTerm 2](https://hiltmon.com/blog/2013/07/18/fast-ssh-windows-with-iterm-2/)：参考这个回答，在 iTerm2 中保存 SSH 会话，通过快捷键可立即连接至服务器。

#### 步骤四：启用密码登录（可选）

可以正常登录的，不用看这一步。

由于启用 SSH 登录方式之后，服务器默认会将 root 帐号密码登录的方式禁用掉。而自己不知道做了什么修改，使得在 Mac 下无法通过密钥登录，只好再次开启密码登录的方式。

在 Windows 上登录服务器，然后做如下操作。

```bash
sudo vi /etc/ssh/sshd_config
// 在 vim 中将 PasswordAuthentication no 改为 PasswordAuthentication yes，然后保存退出
sudo systemctl restart sshd
// 上面的命令重启了 sshd，这样在 Mac 中就可以用密码登录 root 帐号了
```

参考资料：

- [启用密钥后恢复账号密码登录](https://help.aliyun.com/document_detail/59083.html?spm=5176.10173289.0.0.244123376jXRwl#activeroot)
- [ssh : Permission denied (publickey,gssapi-with-mic)](https://stackoverflow.com/questions/36300446/ssh-permission-denied-publickey-gssapi-with-mic)

#### 解决 macOS SSH 登录时的警告

在 macOS 下通过终端登录时，会给出下面的提示：

```bash
-bash: warning: setlocale: LC_CTYPE: cannot change locale (UTF-8): No such file or directory
```

上网查了一下，原来是终端试图将本机的环境变量传入到服务器中，这肯定是不需要的。

解决方法：在前面设置好的 iTerm2 的 Profile 中，将 Terminal 标签下的 `Set locale variables automaticlly` 取消选择。

![Disable automaticlly set locale variables](https://gitee.com/samsara9527/Pics/raw/master/server/iterm2-ssh-bash-warning.png)

参考资料：

- [OS X Terminal: -bash: warning: setlocale: LC_CTYPE: cannot change locale (UTF-8): No such file or directory Fix](https://www.cyberciti.biz/faq/os-x-terminal-bash-warning-setlocale-lc_ctype-cannot-change-locale/)

## 三、更新服务器系统所有程序包（package）

装好了系统，先把所有程序都更新到最新版。

```bash
> yum update
```

执行了上面的命令之后，会提示有许多 packages 需要更新，可能还有附带的 packages 需要安装，按下 `y` 键并回车，开始更新即可。

## 四、服务器安全设置（可选）

### 服务器建立普通权限用户

由于用 root 用户登录服务器可能带来安全问题，比如误删文件等等，所以需要建立一个普通权限的用户进行日常操作。

```bash
> adduser www
> passwd www
// 输入第二条命令之后，会提示输入两次密码，输入密码的过程中不会显示任何内容，盲打即可
```

### 赋予 root 权限

有时候需要用 root 权限的用户进行操作，但是注销当前普通权限的用户，再用 root 用户登录实在太麻烦了，直接给普通用户赋予 root 权限就好了，这样以后就可以在这个用户下直接用 `sudo` 执行命令了。

```bash
> gpasswd -a www wheel
```

上面的命令将前面新建的 www 用户加入了 `wheel` 这个用户组，而这个用户组是有权限执行 `sudo` 命令的。

### 添加公钥验证

通过在用户的电脑上生成 SSH 密钥对，并将公钥放到服务器上，可以增强服务器安全。

#### 本机生成密钥对

执行下面的命令（Windows 下在 Git Bash 中，Mac 下在终端里），一路回车即可。

```bash
> ssh-keygen
```

上面的命令，会在本机当前用户的 `.ssh` 目录下，生成 `id_rsa` 和 `id_rsa.pub` 两个文件。前面的一个文件是用户的私钥，后面的一个文件是用户的公钥。

#### 复制公钥至服务器

首先在本机的终端里显示公钥的内容。

```bash
> cat ~/.ssh/id_rsa.pub
```

然后完整复制显示出来的一长串文字。

接着在服务器上切换至用户 www。

```bash
> su - www
```

然后新建 `.ssh` 目录并设置权限。

```bash
> mkdir .ssh
> chmod 700 .ssh
```

接着新建 `authorized_keys` 文件。

```bash
> vi .ssh/authorized_keys
```

按下 `i` 键进入编辑模式，然后按下 `Shift+Insert` 键将刚才在本机上复制的公钥粘贴进去。按下 `Esc` 键退出编辑模式，输入 `:x` 保存修改并关闭文件。

然后再设置 `authorized_keys` 文件的权限。

```bash
> chmod 600 .ssh/authorized_keys
```

最后执行 `exit` 便可退出 www 用户，切换回 root 用户。

这个时候，用户在本机就可以通过 `ssh www@10.10.10.10 -i ~/.ssh/id_rsa` 这样的命令，以 www 用户的身份登录至服务器了。

### 配置 SSH 守护进程

配置好了普通用户之后，还可以禁止 root 用户的 SSH 登录，以进一步提升安全性。

执行下面的命令，将会进入 vim，编辑 SSH 配置文件。

```bash
> vi /etc/ssh/sshd_config
```

需要修改的这一行为 `#PermitRootLogin yes`。输入 `/PermitRoot` 并回车，会定位至 `#PermitRoot` 所在的行，并且定位在字母 P 上。

按下快捷键 `Shift+x`，删除字母 P 前面的井号 `#`。

按下快捷键 `Ctrl+→`，光标跳到下一个单词的 yes 首字母上。

按下快捷键 `cw`，删除 yes 整个单词；再输入 no，然后按下 `Esc` 退出编辑模式，输入 `:x` 保存修改并关闭文件。

执行完上面这些操作之后，重启 SSH 服务，使其生效。如果重启 SSH 服务还不能禁止 root 用户的登录，那就执行 `reboot` 命令重启一下服务器吧。

```bash
> systemctl reload sshd
```

注意！前面的操作禁止了 root 用户的 SSH 登录，为了安全起见，需要先测试一下 www 用户是否真的能够成功 SSH 登录，确保 www 用户的登录没问题之后，才可以注销当前的 root 用户。

参考资料：

- [Initial Server Setup with CentOS 7](https://www.digitalocean.com/community/tutorials/initial-server-setup-with-centos-7)

## 五、配置 node 环境

建立 www 用户之后，就可以用这个用户登录了。

~~首次登录时，提示 `-bash: /root/nvm/nvm.sh: Permission denied`。可以看出来，因为用非 root 用户登录，默认是没有权限使用 root 用户安装的 nvm的，那该怎么办呢？跟我来。~~（按照下面的设置依然无法解决每次登录时显示该提示的问题。）

### 为普通权限用户安装 nvm

先根据官网的教程，安装最新版的 nvm。

```bash
> curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.4/install.sh | bash
```

然后执行下面的命令，完成 nvm 的设置。

```bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
```

### 安装最新版 node.js

所购买的服务器，自带的 node.js 版本为 4.8.4，实在是有点儿老，果断给它升级一下。

```bash
> nvm install node
// 如果 nvm 不识别 node 参数，就得明确指定 node 的版本了
> nvm install 8.6.0
```

上面的命令，会安装最新版 8.6.0。安装完成后，我们再看看系统中有哪些版本的 node.js。

```bash
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

- [creationix/nvm](https://github.com/creationix/nvm)：nvm的官网，参考上面的安装流程。
- [ubuntu中npm安装全局插件提示没有root管理员权限](https://zhouyuexie.github.io/ubuntu%E4%B8%ADnpm%E5%AE%89%E8%A3%85%E5%85%A8%E5%B1%80%E6%8F%92%E4%BB%B6%E6%8F%90%E7%A4%BA%E6%B2%A1%E6%9C%89root%E7%AE%A1%E7%90%86%E5%91%98%E6%9D%83%E9%99%90/)
- [线上node服务的配置和维护，使用非root账户运行和sudo管理](https://cnodejs.org/topic/57216ea1fa48138c41110ec8)

## 六、配置 Express 框架

### 安装 Express

基本的 node.js 环境建立起来了，那就先用 Express 搭建一个简单的网页框架，首先把 Express 框架安装好。

```bash
> npm install -g express
> npm install -g express-generator
```

### 创建项目

然后再用 Express 框架创建项目 blog。

```bash
> express -v ejs blog
> cd blog && npm install
```

### 启动项目

项目建立起来之后，当然要运行一下看看啦。好，那就执行 `npm start`，然后在网页中访问 [http://10.10.10.10:3000](http://10.10.10.10:3000)，嗯？为什么打不开呢？想起来购买的这个服务器还装了 Nginx 这个反向代理，是不是和它有关？

Google 一番，发现原来需要在服务器控制台的“防火墙”中开放 3000 这个端口，于是新建一个应用类型为“自定义”的端口，协议选择“TCP”，端口号设置为“3000”。

然后再重启刚才新建的 Express 项目，并访问上面的那个网址，啊哈，可以访问了！

参考资料：

- [阿里云ubuntu nginx无法访问，求解答](https://segmentfault.com/q/1010000009437407)

## 七、配置 Nginx 映射项目

由于 Express 默认用的是 3000 端口号，每次访问服务器的时候还要加上端口号实在是麻烦，那就在 Nginx 中将来自 80 端口的请求都指向本机的 3000 端口。

注意，以下 Nginx 相关的操作，都要在 root 用户中执行，为什么非 root 用户不能操作呢？请看这篇文章：[Why does nginx starts process as root?](https://unix.stackexchange.com/questions/134301/why-does-nginx-starts-process-as-root)。

### 安装 Nginx

```bash
> sudo yum install epel-release
> sudo yum install nginx
```

然后启动 Nginx，并使其开机自动启动。

```bash
> reboot
> sudo systemctl start nginx
> sudo systemctl enable nginx
```

参考资料：

- [How To Install Nginx on CentOS 7](https://www.digitalocean.com/community/tutorials/how-to-install-nginx-on-centos-7)

### 转发至 Express 程序

首先，查找 Nginx 所在的路径。

```bash
> whereis nginx
nginx: /usr/sbin/nginx /usr/lib64/nginx /etc/nginx /usr/share/nginx /usr/share/man/man8/nginx.8.gz /usr/share/man/man3/nginx.3pm.gz
```

依次查看上面几个路径可知，/etc/nginx 文件夹里包含了 nginx.conf 这个配置文件。

```bash
> sudo vi /etc/nginx/nginx.conf
```

在 location 字段中增加下面这段代码，记得先将 10.10.10.10 改成服务器的外网 IP。

```bash
location / {
    proxy_pass http://10.10.10.10:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
}
```

然后重启 Nginx，设置完成。

```bash
> sudo systemctl restart nginx
```

参考资料：

- [How To Set Up a Node.js Application for Production on CentOS 7](https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-centos-7)：参考其中的“Set Up Reverse Proxy Server”这一小节。

### 重定向 www 域名至非 www 域名

待完成。

## 八、配置域名

### 购买域名

买了服务器，不能只是用 IP 来访问，当然要买个域名了。上网查了一番，决定购买 GoDaddy 家的域名，比了比后缀和价格，最后买下了 [hewei.in](http://hewei.in) 这个域名。

### 设置 GoDaddy 域名解析

买了域名之后，还要设置 DNS 用于域名的解析。有两种方式：

第一种方式是用 GoDaddy 自家的域名解析服务，参照下图中设置 GoDaddy 的域名解析。红圈标注的地方设置为服务器的 IP，其它选项全用默认值。

![GoDaddy DNS Setting](https://gitee.com/samsara9527/Pics/raw/master/server/godaddy-dns-setting.png)

然后还要在阿里云的云解析中，添加域名的 A 记录和 CNAME 记录。

![AliYun DNS Setting](https://gitee.com/samsara9527/Pics/raw/master/server/aliyun-dns-setting.png)

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

## 九、设置 Git 仓库

**本节内容有问题，待修改**。

### 安装最新版 Git

参考这篇文章进行：[How to Install Git 2.0.5 on CentOS/RHEL 7/6/5 and Fedora 22/21](https://tecadmin.net/install-git-2-0-on-centos-rhel-fedora/)。

### 服务器开启 RSA 认证

在文件 `/etc/ssh/sshd_config` 中添加下列三行内容（如果已经有则不必重复添加）:

```bash
RSAAuthentication yes
PubkeyAuthentication yes
AuthorizedKeysFile  .ssh/authorized_keys
```

### 初始化仓库

在当前用户的根目录下（`/home/www`），专门新建一个 repo 文件夹，用于接收本地的推送并自动更新至前面建立的项目目录。

```bash
> cd ~
> mkdir repo && cd repo
> mkdir blog.git && cd blog.git
> git init --bare
```

上面最后一步的命令会新建 branches、hooks、info、objects、refs 这几个文件夹，和 HEAD、config、description 这几个文件。

### 关联仓库和项目

```bash
> cd hooks
> cat > post-receive
```

执行完这两行指令之后，输入下面的文字，并按 Ctrl+d 键保存。

```bash
#!/bin/sh
git --work-tree=/home/www/blog --git-dir=/home/www/repo/blog.git checkout -f
```

上面的两行文字中，`/home/www/blog` 为前面新建的网站项目所在的目录，由于已经申请了域名，所以用域名为名称重新建立了网站项目；`home/www/repo/blog.git` 则是刚才新建的仓库文件夹。这两个目录的实际路径要结合自己的实际情况来确定，不要照搬。

然后再执行下面的命令，设置刚才新建文件的权限，以保证它能够正常运行。

```bash
> chmod +x post-receive
```

### 本机建立对应项目

在本机上也建立同名的项目，便于管理。下面的命令行代码以 Mac 为例，Windows 类似。

```bash
> cd ~/Code
> mkdir blog && cd blog
> mkdir .git && cd .git
> git init
> git remote add blog www@10.10.10.10:/home/www/repo/blog.git
```

上面命令中的最后一行代码，将远程服务器上刚才新建的仓库，命名为 blog，并与本地仓库关联。

### 更改本地项目并推送

建立了关联之后，测试一下在本地的修改是否能成功推送到服务器上。将之前做的一个简单的网页内容复制到了 `/views/index.ejs` 中，然后执行下面的命令，开始上传。

```bash
git add .
git commit -m "init"
git push --set-upstream blog master
```

由于是首次往服务器通过 git 上传文件，所以需要用最后一条命令，在远程服务器建立 master 分支，并将本地当前 master 分支的内容推送上去。

之后需要推送的话，只用执行 `git push` 命令就可以了。

参考资料：

- [How To Set Up Automatic Deployment with Git with a VPS](https://www.digitalocean.com/community/tutorials/how-to-set-up-automatic-deployment-with-git-with-a-vps)：大体思路参考这篇文章，但是在此基础上有所修改。

## 十、配置守护进程

待完成。

---

# 服务器配置笔记 v2.0

仅重置系统镜像，未选择应用镜像，重置完成后用 `yum list installed` 查看已安装的 packages，发现PHP、Node什么的都没装，是一个干净的新系统，可以从头开始配置了。

## 更新系统 packages

通过轻量应用服务器控制台的 Web 端，远程连接至主机，执行 `sudo su root` 切换至 root 账户，再执行 `yum update`，将所有 packages 更新至最新版，然后执行 `reboot` 重启服务器。

## 配置专用用户

根据这篇文章 [Initial Server Setup with CentOS 7](https://www.digitalocean.com/community/tutorials/initial-server-setup-with-centos-7) 里的建议，新建用户 www 并设置密码，然后赋予执行 `sudo` 命令的权限。

```bash
$ adduser www
$ passwd www
$ gpasswd -a www wheel
$ sudo su www # 切换至新建的用户
```

在本机生成密钥并复制公钥内容（最新的一次重置服务器的过程当中，因为已经先为 GitHub 生成过密钥，所以直接把 GitHub 的复制过来了，用同一份，省心）。

```bash
$ ssh-keygen
$ cat ~/.ssh/id_rsa.pub
```

第一条命令在默认情况下，会在当前用户的 `.ssh` 目录下生成私钥文件 `id_rsa` 和公钥文件 `id_rsa.pub`。

将公钥添加到服务器的 www 用户下。

```bash
$ mkdir .ssh
$ chmod 700 .ssh
vi .ssh/authorized_keys
# 按下i进入编辑模式，粘贴公钥内容，按下Esc退出编辑模式，输入:x保存并退出
$ chmod 600 .ssh/authorized_keys
$ exit
```

Mac 下也要按照上面这样设置，就是把本机生成的公钥复制到 `~/.ssh/authorized_keys` 文件中，这样就可以直接通过 `ssh www@1.2.3.4` 这个命令登录服务器了。

最后再禁止 root 用户的 SSH 登录，以提升服务器安全性。

```bash
$ vi /etc/ssh/sshd_config
# 输入/PermitRoot然后按下回车，编辑器就会定位至PermitRoot所在行的行首。如果行首有注释符号#，则按下Shift+x删除。然后光标移至后面的单词yes的首字母y上，输入cw删除该单词，再输入no，然后按下Esc结束编辑，最后输入:x保存并退出。
$ systemctl reload sshd
```

先别关闭窗口。为了确保不会因为误操作导致 root 和 www 用户都无法登录服务器，先在本机测试一下：

> 最新情况：
>
> 按照上面的设置之后，要在本机通过 www 用户登录的话，在 XShell 中配置连接属性的界面，在“用户身份验证”选项卡中，“方法”选择“Public Key”，然后在用户密钥那里，选择前面为 GitHub 生成的 id_rsa 文件，这样就可以用下面的命令直接登录了。

```bash
$ ssh www@1.2.3.4
$ sudo yum update
```

如果一切 OK，说明配置成功，可以放心使用 www 用户登录了。

## 配置防火墙

然后再按照这篇文章 [Additional Recommended Steps for New CentOS 7 Servers](https://www.digitalocean.com/community/tutorials/additional-recommended-steps-for-new-centos-7-servers) 进行一些建议的设置。

首先配置好防火墙。

```bash
# 先开启防火墙
$ sudo systemctl start firewalld
# 防火墙中允许 SSH 服务，可以从输出结果看到默认已经允许了
$ sudo firewall-cmd --permanent --add-service=ssh
Warning: ALREADY_ENABLED: ssh
success
# 如果更改了服务器上的SSH端口，可以通过下面的命令在防火墙中添加对应规则，我是没有执行的
$ sudo firewall-cmd --permanent --remove-service=ssh
$ sudo firewall-cmd --permanent --add-port=4444/tcp
# 分别允许HTTP、HTTPS和SMTP服务
$ sudo firewall-cmd --permanent --add-service=http
success
$ sudo firewall-cmd --permanent --add-service=https
success
$ sudo firewall-cmd --permanent --add-service=smtp
success
# 下面的命令列出能够通过名称在防火墙中启用的服务
$ sudo firewall-cmd --get-services
# 下面的命令列出了防火墙当前的规则设置
$ sudo firewall-cmd --permanent --list-all
public
  target: default
  icmp-block-inversion: no
  interfaces:
  sources:
  services: dhcpv6-client ssh http https smtp
  ports:
  protocols:
  masquerade: no
  forward-ports:
  source-ports:
  icmp-blocks:
  rich rules:
# 要使设置生效，还需要重启防火墙
$ sudo firewall-cmd --reload
success
# 最后再让防火墙开机启动
$ sudo systemctl enable firewalld
Created symlink from /etc/systemd/system/dbus-org.fedoraproject.FirewallD1.service to /usr/lib/systemd/system/firewalld.service.
Created symlink from /etc/systemd/system/multi-user.target.wants/firewalld.service to /usr/lib/systemd/system/firewalld.service.
```

## 配置时间

然后再配置服务器的时间。

```bash
# 列出所有可用的时区
$ sudo timedatectl list-timezones
# 然后设置服务器要使用的时区/区域
$ sudo timedatectl set-timezone Asia/Shanghai
# 最后查看时区的设置结果
$ sudo timedatectl
      Local time: Fri 2017-10-27 21:56:31 CST
  Universal time: Fri 2017-10-27 13:56:31 UTC
        RTC time: Fri 2017-10-27 21:56:30
       Time zone: Asia/Shanghai (CST, +0800)
     NTP enabled: no
NTP synchronized: yes
 RTC in local TZ: yes
      DST active: n/a

# 接着配置 NTP 同步
$ sudo yum install ntp
$ sudo systemctl start ntpd
$ sudo systemctl enable ntpd
```

## 配置 Swap 文件

还要配置 Swap 文件。

```bash
# 小主机内存只有1G，所以创建2G的交换文件
$ sudo fallocate -l 2G /swapfile
# 限制其它用户或进程对该交换文件的权限
$ sudo chmod 600 /swapfile
# 让系统格式化该文件
$ sudo mkswap /swapfile
# 启用交换文件
$ sudo swapon /swapfile
# 每次启动时自动启用交换文件
$ sudo sh -c 'echo "/swapfile none swap sw 0 0" >> /etc/fstab'
```

## 配置 Node 相关环境

安装 Node 环境。

```bash
$ curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.6/install.sh | bash
$ export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
$ nvm list-remote
$ nvm install node
```

## 配置 Nginx

```bash
$ sudo yum install epel-release
$ sudo yum install nginx
$ sudo systemctl start nginx
# 上面这一步执行完之后，有时会提示下面的错误，即使重启也不行
# Job for nginx.service failed because the control process exited with error code. See "systemctl status nginx.service" and "journalctl -xe" for details.
$ sudo systemctl enable nginx
# 也可以用下面这个命令启动nginx，会输出详细的错误信息
$ sudo nginx -t
```

然后在浏览器中访问服务器的IP或者域名，如果显示 Nginx 相关的提示信息，说明运行成功。

### 解决启动问题

初次安装 Nginx 之后，在执行上面的指令启动 Nginx 时总是失败，根据[解决nginx: [emerg] bind() to [::]:80 failed (98: Address already in use)](http://www.hankcs.com/appos/linux/fix-nginx-bind-err.html)这篇文章中的方法，修改了 Nginx 的全局配置文件 `/etc/nginx/nginx.conf` 并重启服务器，果然 OK 了。

### Nginx 重要路径

- 默认的服务器根目录：`/usr/share/nginx/html`，这个路径要去 `/etc/nginx/conf.d/default.conf` 这个配置文件中修改。
- Server Block 配置文件（类似于Apache中的虚拟主机）：在 `/etc/nginx/default.d` 这个目录中新建扩展名为 `.conf` 的文件，下次 Nginx 启动的时候就会自动加载这些文件。
- Nginx 的全局配置文件：该文件路径为 `/etc/nginx/nginx.conf`。

### 映射网站目录

配置 Nginx 映射网站目录。

```bash
$ sudo vi /etc/nginx/nginx.conf
# 然后将 location / 字段修改为如下内容
        location / {
                proxy_pass http://localhost:3000;
                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection 'upgrade';
                proxy_set_header Host $host;
                proxy_cache_bypass $http_upgrade;
        }
```

### 403 Forbidden

在配置Nginx代理静态资源的时候，发现访问网站时提示 403 Forbidden，上网查了查，试了各种方法，最后发现需要修改执行Nginx的用户。

```bash
$ sudo vi /etc/nginx/nginx.conf
# 然后将配置文件中的 use nginx 改为 use www 重启 Nginx 之后就可以正常访问了
# 猜测是因为之前配置过系统权限，所以才导致此问题
```

## 配置 GitHub SSH Key

在参考着[使用pm2部署你的项目防止过劳死](http://xugaoyang.com/post/5aa3a4d0b1745b11c007ffd6)这篇文章，配置服务器到 GitHub 的 SSH 密钥时，发现 `ssh -T git@github.com` 这个命令会失败，本机其实也会失败。搜索了一番之后发现，需要先执行 `ssh-keyscan -t rsa github.com >> ~/.ssh/known_hosts` 这个命令，然后再执行 `ssh -T` 这个，才能成功访问 GitHub。

## 备注

为了了解 CentOS 的内存占用，看了这篇文章：[Linux Used内存到底哪里去了？](http://blog.yufeng.info/archives/2456)。

里面还提到了 `nmon` 这个工具非常好用，于是按照 [Install NMON](https://gist.github.com/sebkouba/f2a982ea1c2b658574dcc3da8de09de6) 中的方法，安装到了 CentOS 上。

```bash
# Get Root
sudo su

# Download NMON archive
cd /tmp
wget http://sourceforge.net/projects/nmon/files/nmon16e_mpginc.tar.gz

# Untar archive
tar -xzvf nmon16e_mpginc.tar.gz

# Copy nmon file
cp nmon_x86_64_centos7 /usr/local/bin/
chmod a+x /usr/local/bin/nmon_x86_64_centos7

# Create symbolic link
ln -s /usr/local/bin/nmon_x86_64_centos7 /usr/local/bin/nmon

# tidy up tmp
rm -f nmon_*
```
