# 云服务器配置笔记 v5.0

> 2020年02月01日 10:08:19

## 系统安装

在控制台将阿里云服务器 ECS 实例停止，以便更换操作系统。

找到并点击“更换操作系统”菜单，选择“公共镜像”中“CentOS 7.X”的最新版。

“安全设置”中选择“设置密钥”，选上之前为该服务器生成并使用的密钥对。

- 配置密钥对登录之后，阿里云会自动禁止密码登录，这样安全性更高
- 猜测应当是在 `/etc/ssh/sshd_config` 文件中添加 `PasswordAuthentication no` 这么一行禁止密码登录的
- 如果没有现成的密钥对，就先去新建密钥对，并将密钥绑定到该 ECS 实例，再进行后续操作

在弹出的“MFA验证”对话框中，输入手机 APP “Authenticator” 中该 ECS 实例所属阿里云账号的验证码。点击右下角的按钮，稍候片刻，ECS 实例就装上最新版的 CentOS 了。

## SSH 密钥对连接 ECS 实例

### 本机全新连接

如果本机之前未通过 SSH 密钥对连接过 ECS 实例，则按照教程 [使用SSH密钥对连接Linux实例](https://help.aliyun.com/document_detail/51798.html) 进行配置即可。

其中如果用的是 [在支持SSH命令的环境中使用密钥对](https://help.aliyun.com/document_detail/51798.html#title-7je-5ba-sm2) 这种方式，即使按照 [通过config文件配置](https://help.aliyun.com/document_detail/51798.html#title-ii4-zmw-zxi) 的流程来操作，也要把前一小节 [通过命令配置](https://help.aliyun.com/document_detail/51798.html#title-7je-5ba-sm2) 的流程做一遍，这样才能够确保私钥文件的权限符合密钥登录的要求，否则将无法登录。

### 本机非全新连接

如果本机之前用密钥连接过 ECS 实例，那么本机的 `~/.ssh/known_hosts` 文件中保存的是旧的 host key。重装 ECS 实例的系统后，需要将本机该文件中旧的 host key 删除，才能够用密钥成功登录 ECS 实例。

### 修改 root 用户的密码

因为不知道 root 用户的默认密码是什么，所以在首次通过 SSH 密钥对连接到 ECS 实例之后，就把 root 用户的密码改了，免得之后还需要密码。

```bash
$ passwd root # 不需要输入旧密码，直接输入两遍新密码即可
```

## 服务器安全加固

### 新建普通权限用户

在 ECS 实例上执行以下命令。

```bash
$ adduser www # 新建用户
$ passwd www # 设置密码
$ usermod -aG wheel www # 将用户 www 加入 wheel 用户组，可执行 sudo 命令
$ su - www # 切换至用户 www
$ sudo ls -la /root # 测试用户 www 是否能执行 sudo 命令，首次执行需要输入用户 www 的密码
```

### 配置新用户的 SSH 公钥

在 ECS 实例上执行以下命令。

```bash
$ cd ~ # 切换至当前用户的用户目录
$ mkdir .ssh && chmod 700 .ssh && cd .ssh # 新建 .ssh 文件夹并设置文件夹权限
$ sudo cat /root/.ssh/authorized_keys > ./authorized_keys # 将 root 用户的公钥复制过来
$ chmod 400 authorized_keys # 设置文件为只读权限
```

### 测试普通权限用户的 SSH 连接

在本机执行以下命令。

```bash
$ vi ~/.ssh/config # 将 User 字段后面的值由 root 改为 www
$ ssh ecs # 正常情况下，严格按照前面的流程操作，这里就能够以 www 用户的身份连接至服务器
```

### 禁止 root 用户 SSH 连接至服务器

在 ECS 实例上执行以下命令。

```bash
# 备份 sshd 配置文件，并将 PermitRootLogin 字段的值由 yes 改为 no
$ sudo cp sshd_config sshd_config~ && sudo sed -i 's/^PermitRootLogin yes$/PermitRootLogin no/g' sshd_config
$ sudo systemctl restart sshd # 重启 sshd 服务，使设置生效
```

### 更新软件并重启

在 ECS 实例上执行以下命令。

```bash
$ yum update -y # 更新所有已安装软件至最新版本
$ reboot # 重启系统
```

## 配置网站环境

### 安装配置 Nginx

按照 [Nginx 官方文档](http://nginx.org/en/linux_packages.html#RHEL-CentOS) 的流程，安装 Nginx。

执行 `sudo systemctl enable nginx`，让 Nginx 在系统重启后自动运行。

执行 `sudo service nginx start`，启动 Nginx，然后访问域名 http://hewei.in ，一般来说，应该是可以正常访问的。

修改 `/etc/nginx/conf.d/default.conf`，将 `server` 中的 `server_name` 修改为自己网站的域名，这样后面可以方便 Certbot 进行自动配置。

### 安装配置 Certbot

根据 [Certbot 官方文档](https://certbot.eff.org/lets-encrypt/centosrhel7-nginx) 的流程，安装 Certbot。

注意：如果严格按照官方文档安装，那么在执行命令 `sudo certbot --nginx` 配置 Nginx SSL 证书时，会遇到 Python 报错的情况。这种情况下，可以按照 [ImportError: cannot import name UnrewindableBodyError](https://github.com/certbot/certbot/issues/7645#issuecomment-569013707) 给出的方法操作，然后重新安装 Certbot 即可。

```bash
$ sudo pip uninstall requests
$ sudo pip uninstall urllib3
$ sudo yum remove python-urllib3
$ sudo yum remove python-requests
$ sudo yum install python-urllib3
$ sudo yum install python-requests
$ sudo yum remove certbot python2-certbot-nginx
$ sudo yum install certbot python2-certbot-nginx
```

Certbot 安装完成后，执行 `sudo certbot --nginx`，开始配置 Nginx SSL 证书。

- 首先会提示用户输入邮箱，用于接收相关邮件
- 然后需要用户同意服务协议
- 接着需要用户选择是否将邮箱地址告知 EFF
- 然后选择需要启用 HTTPS 的域名，前面在 `/etc/nginx/conf.d/default.conf` 中设置了 `server_name`，这里就会显示出来
- 最后选择是否将 HTTP 请求重定向至 HTTPS

完成上面的操作之后，Nginx 会自动重启，这时候访问域名 https://hewei.in ，如果能正常访问，说明 Certbot 配置成功。

最后再执行下面的命令，实现 SSL 证书的定时更新。

```bash
$ echo "0 0,12 * * * root python -c 'import random; import time; time.sleep(random.random() * 3600)' && certbot renew" | sudo tee -a /etc/crontab > /dev/null
```

### 安装配置 Git

CentOS 的 yum 源安装的 Git 版本太旧，所以需要进行额外配置，才能安装新的 Git，参考 [How to Install Git on CentOS 7](https://linuxize.com/post/how-to-install-git-on-centos-7/) 这篇文章做即可。

安装完成 Git 之后，再配置提交代码时要用的 git 用户名和邮箱。

```bash
$ git config --global user.name "Your Name"
$ git config --global user.email "youremail@yourdomain.com"
```

### 安装配置 Node 环境

按照 [nvm-sh/nvm](https://github.com/nvm-sh/nvm) 中的说明，安装 nvm，顺便装上 LTS 版本的 Node.js。

```bash
# 以下命令仅供参考，以官网最新文档为准
$ curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.2/install.sh | bash
# 安装完成后退出 SSH 连接再重新连接，以便 nvm 安装生效
$ nvm install --lts # 安装 LTS 版本的 Node.js
```

再按照 [Installation | Yarn](https://legacy.yarnpkg.com/en/docs/install#centos-stable) 中的说明，安装 Yarn。

```bash
# 以下命令仅供参考，以官网最新文档为准
$ curl --silent --location https://dl.yarnpkg.com/rpm/yarn.repo | sudo tee /etc/yum.repos.d/yarn.repo
```
