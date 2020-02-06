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
$ sudo yum install -y nginx # 所有的提问都自动回答 yes
$ sudo service nginx start
# 上面这一步执行完之后，有时会提示下面的错误，即使重启也不行
# Job for nginx.service failed because the control process exited with error code. See "systemctl status nginx.service" and "journalctl -xe" for details.
$ sudo service enable nginx
# 也可以用下面这个命令启动nginx，会输出详细的错误信息
$ sudo /usr/sbin/nginx -t
```

然后在浏览器中访问服务器的IP或者域名，如果显示 Nginx 相关的提示信息，说明运行成功。

### 解决启动问题

初次安装 Nginx 之后，在执行上面的指令启动 Nginx 时总是失败，根据[解决nginx: [emerg] bind() to [::]:80 failed (98: Address already in use)](http://www.hankcs.com/appos/linux/fix-nginx-bind-err.html)这篇文章中的方法，修改了 Nginx 的全局配置文件 `/etc/nginx/nginx.conf` 并重启服务器，果然 OK 了。

### Nginx 重要路径

- 默认的服务器根目录：`/usr/share/nginx/html`，这个路径要去 `/etc/nginx/conf.d/default.conf` 这个配置文件中修改。
- Server Block 配置文件（类似于Apache中的虚拟主机）：在 `/etc/nginx/conf.d` 这个目录中新建扩展名为 `.conf` 的文件，下次 Nginx 启动的时候就会自动加载这些文件。
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

在配置 Nginx 代理静态资源的时候，发现访问网站时提示 403 Forbidden，上网查了查，试了各种方法，最后发现需要修改执行 Nginx 的用户。

```bash
$ sudo vi /etc/nginx/nginx.conf
# 然后将配置文件中的 use nginx 改为 use www 重启 Nginx 之后就可以正常访问了
# 猜测是因为没有 nginx 这个用户，所以才导致此问题
```

### 开启 HTTPS

在阿里云控制台的“SSL 证书”业务中，在“我的订单”界面中，点击“下载”，就会转到证书的下载及配置教程页面。捣鼓了半天，把 http 自动重定向到 https 的功能也完成了，配置文件如下。

注：用的 vue-press 搭建的博客，所以 `location /` 那里的 `root` 指令写成了一大串，并且覆盖了外部 `server` 的 `root` 指令的内容。

```bash
server {
    listen       80 default_server;
    listen       [::]:80 default_server;
    return  301  https://$host$request_uri;
}

server {
    listen       443;
    listen       [::]:443 ipv6only=on;
    server_name  localhost;
    root /home/www/projects;

    ssl on;
    ssl_certificate "/etc/nginx/cert/214542304470487.pem";
    ssl_certificate_key "/etc/nginx/cert/214542304470487.key";
    ssl_session_timeout 5m;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:!aNULL:!MD5:!ADH:!RC4;
    ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
    ssl_prefer_server_ciphers on;

    location / {
        root /home/www/projects/javascript/docs/.vuepress/dist/;
        index index.html;
    }

    error_page 404 /404.html;
        location = /40x.html {
    }

    error_page 500 502 503 504 /50x.html;
        location = /50x.html {
    }
}
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
