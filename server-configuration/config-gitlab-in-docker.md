# Docker 中部署 GitLab

## 下载 GitLab 镜像

```shell
docker pull gitlab/gitlab-ce
```

镜像链接：[https://hub.docker.com/r/gitlab/gitlab-ce/](https://hub.docker.com/r/gitlab/gitlab-ce/)

## 安装 Docker Compose

官方教程：[Install Docker Compose](https://docs.docker.com/compose/install/)

## 创建 docker-compose 配置文件

在主机的 `/etc/gitlab` 目录下创建 GitLab 容器的配置文件 `docker-compose.yml`。

```shell
web:
  image: 'gitlab/gitlab-ce:latest'
  container_name: gitlab
  restart: always
  hostname: 'code.upp.com'
  environment:
    GITLAB_OMNIBUS_CONFIG: |
      external_url 'http://code.upp.com'
      gitlab_rails['gitlab_email_from'] = 'username@mail.domain.com'
      gitlab_rails['smtp_enable'] = true
      gitlab_rails['smtp_address'] = "smtpdm.aliyun.com"
      gitlab_rails['smtp_port'] = 80
      gitlab_rails['smtp_user_name'] = "username@mail.domain.com"
      gitlab_rails['smtp_password'] = "smtp_password"
      gitlab_rails['smtp_domain'] = "mail.domain.com"
      gitlab_rails['smtp_authentication'] = "login"
  ports:
    - '80:80'
    - '443:443'
  volumes:
    - '$GITLAB_HOME/config:/etc/gitlab'
    - '$GITLAB_HOME/logs:/var/log/gitlab'
    - '$GITLAB_HOME/data:/var/opt/gitlab'
```

同时修改电脑上的 DNS，设置 `code.upp.com` 为运行 GitLab 服务器所对应的 IP。

### 配置文件说明

`container_name` 参数用于指定容器名称。

`hostname` 参数用于指定主机名称，如果是自定义的域名，并且不是在公网上注册的，那么就需要修改 DNS，使其生效。

`GITLAB_OMNIBUS_CONFIG` 中的参数为启动容器时加载的环境变量，并不会写入容器里的配置文件中。

`external_url` 参数用于指定容器对外暴露的 URL，可以是 IP，也可以是域名，另外也可以指定是 http 协议还是 https 协议。

`gitlab_rails['gitlab_email_from']` 和 `gitlab_rails['smtp` 开头的参数，用于实现 GitLab 的邮件功能。

因为想要让 GitLab 上的每个 commit 所对应的用户和 GitHub 一样的话，就需要配置 GitLab 中所用账号的主邮箱。

在阿里云的“邮件推送”业务中，按照指引配置发信邮箱 `username@mail.domain.com`，其中的 `domain` 是一级域名，`mail` 是二级域名，`username` 是账号名。新建好邮箱之后，记得还要设置 SMTP 密码，下面会用到。

然后按照 GitLab 官方文档，配置邮件推送功能的各个参数。

```shell
      external_url 'http://code.upp.com'
      gitlab_rails['gitlab_email_from'] = 'username@mail.domain.com'
      gitlab_rails['smtp_enable'] = true
      gitlab_rails['smtp_address'] = "smtpdm.aliyun.com"
      gitlab_rails['smtp_port'] = 80
      gitlab_rails['smtp_user_name'] = "username@mail.domain.com"
      gitlab_rails['smtp_password'] = "smtp_password"
      gitlab_rails['smtp_domain'] = "mail.domain.com"
      gitlab_rails['smtp_authentication'] = "login"
```

参考链接：[SMTP settings | GitLab](https://docs.gitlab.com/omnibus/settings/smtp.html)

## 修改 DNS

在 Windows 下，修改 `c:\Windows\System32\drivers\etc\hosts` 文件，添加 `code.upp.com` 域名与对应服务器 IP 之间的映射关系，这样在本机才能够正常访问到服务器上的 GitLab。

记得修改完 DNS 设置之后，在命令行中执行 `ipconfig /flushdns`，以使新的设置生效。

## 启动容器并查看进度

```shell
# 设置 GitLab 环境变量
export GITLAB_HOME=/srv/gitlab
# 进入 docker-compose.yml 文件所在目录
cd /etc/gitlab
# 启动 GitLab 容器
docker-compose up -d
# 查看启动进度
docker logs -f gitlab
```

Docker 运行起来之后（状态为 healthy，而不是 Starting），如果报 422 错误，可能是浏览器缓存问题，清空缓存试试，或者用隐私模式访问，或者等会儿再访问。

如果用上面配置的 `code.upp.com` 域名能够成功访问 GitLab，就说明容器启动成功。

## 启用主邮箱

前面已经配置好了 GitLab 的邮件功能，接下来再配置具体的主邮箱，打开 `http://code.upp.com/profile/emails`，填入自己在 GitHub 上的邮箱，然后根据指引，完成该邮箱的认证。

接着在 `http://code.upp.com/profile` 路径中，选中认证成功的主邮箱，并设置对应的用户名，OK，大功告成！

## 启用 HTTPS（Git-lfs 需要）

### 创建并验证 SSL 证书

在容器中创建存放证书的文件夹并设置所需权限：

```shell
docker exec -it gitlab bash
mkdir -p /etc/gitlab/ssl
chmod 755 /etc/gitlab/ssl
```

按照 [Getting Chrome to accept self-signed localhost certificate](https://stackoverflow.com/a/60516812/2667665) 链接中的方法，创建自己的 CA 根证书，并用其签发 SSL 证书。

```shell
######################
# Become a Certificate Authority
######################

# Generate private key and set passphrase for it
openssl genrsa -des3 -out ca.key 2048
# Generate root certificate
openssl req -x509 -new -nodes -key ca.key -sha256 -days 365 -out ca.pem

######################
# Create CA-signed certs
######################

# Use your own domain name
NAME=code.upp.com
# Generate a private key
openssl genrsa -out $NAME.key 2048
# Create a certificate-signing request
openssl req -new -key $NAME.key -out $NAME.csr
# Create a config file for the extensions
# For DNS.1: Be sure to include the domain name here because Common Name is not so commonly honoured by itself
# For IP.1: Optionally, add an IP address (if the connection which you have planned requires it)
>$NAME.ext cat <<-EOF
authorityKeyIdentifier=keyid,issuer
basicConstraints=CA:FALSE
keyUsage = digitalSignature, nonRepudiation, keyEncipherment, dataEncipherment
subjectAltName = @alt_names
[alt_names]
DNS.1 = $NAME
IP.1 = 1.2.3.4
EOF
# Create the signed certificate
openssl x509 -req -in $NAME.csr -CA ca.pem -CAkey ca.key -CAcreateserial \
-out $NAME.crt -days 365 -sha256 -extfile $NAME.ext
```

创建完证书之后，再用下面的命令验证所创建的证书是否有效：

```shell
openssl verify -CAfile ca.pem -verify_hostname code.upp.com code.upp.com.crt
```

### 应用 SSL 证书

编辑 GitLab 容器中的配置文件 `/etc/gitlab/gitlab.rb`：

```shell
# 将 http 协议改为 https 协议
external_url 'https://code.upp.com'

# 强制从 http 跳转至 https
nginx['enable'] = true
nginx['redirect_http_to_https'] = true
nginx['redirect_http_to_https_port'] = 80

# 明确设置 CA 根证书的路径
nginx['ssl_client_certificate'] = "/etc/gitlab/ssl/ca.crt"

# 禁用 Let's Encrypt，以免在应用新的配置文件时 GitLab 再用其申请 SSL 证书
letsencrypt['enable'] = false
```

然后在容器中执行 `gitlab-ctl reconfigure`，应用修改后的配置。

参考链接：[NGINX settings | GitLab](https://docs.gitlab.com/omnibus/settings/nginx.html)

### 在浏览器中导入 CA 证书

因为自定义域名的 SSL 证书是用 CA 证书签发的，所以需要在本机浏览器中导入 CA 证书，这样才能够让自定义域名的 SSL 证书被浏览器视为可信证书。

先在主机中将容器中的 CA 证书复制出来：

```shell
cd /etc/gitlab && docker cp gitlab:/etc/gitlab/ssl/ca.pem .
```

然后再用 XFTP 之类的工具将 CA 证书 `ca.pem` 从 CentOS 服务器上复制到本机。

> 注意，这个 pem 格式的 CA 证书如果直接导入到 Windows 上的 Chrome 中的话，并不会被浏览器信任，还需要将其转换为 p7b 格式的证书才行。
> 另外，在将证书导入到 “受信任的根证书颁发机构” 时，虽然导入对话框中默认显示的是 “受信任的根证书颁发机构”，但默认导入的路径实际上并不是它。所以在每次导入时，一定要手动选择具体的导入路径，才能够保证没有被导入到别的地方。

先在 Chrome 的 “设置 → 隐私设置和安全性 → 安全 → 高级安全设置 → 管理证书” 中，将 pem 格式的证书导入到 “受信任的根证书颁发机构”，然后再将该证书从浏览器中导出，格式选择 “加密消息语法标准 - PKCS #7 证书(.P7B)”。

然后将已经导入的 pem 格式的证书从 “受信任的根证书颁发机构” 中删除，因为它不会被 Chrome 信任。再将新导出的 p7b 格式的证书导入至 “受信任的根证书颁发机构” 中。

接着再重启浏览器，这一步必须做，这样才能够让浏览器加载新的证书。如果标志着 SSL 证书有效的小锁显示在网址的左边，就说明证书配置成功。

### 禁用 Git 对 SSL 证书的检查

输入下面这条命令，就可以在 git push/pull 的时候，不去检查 SSL 证书，这样刚才创建的证书就可以通行无阻了。

```shell
git config --global http.sslVerify false
```

参考链接：[Trusted SSL throwing SSL certificate problem: unable to get local issuer certificate](https://forum.gitlab.com/t/trusted-ssl-throwing-ssl-certificate-problem-unable-to-get-local-issuer-certificate/26209)

## 使用 Git-lfs

具体流程见下面的命令示例：


```shell
# 在当前项目中启用 lfs
git lfs install
# 用 git-lfs 追踪指定目录下所有文件，注意这里是两个星号
git lfs track "answers/**"
# 在 git 中添加 .gitattributes 文件，这样其它用户克隆项目时，才能将 git-lfs 管理的文件也拷贝下来
git add .gitattributes
# 然后在 git 中添加资源文件即可
git add .
```

参考链接：

- GitLab 上关于 Git-LFS 的文档：[GitLab Docs > Topics > Git > Git Large File Storage (LFS)](https://docs.gitlab.com/ee/topics/git/lfs/index.html)
- 指定 Git-LFS 追踪某个文件夹下所有文件的正确命令：[Git LFS refused to track my large files properly, until I did the following](https://stackoverflow.com/a/44428097/2667665)

## 更新 GitLab 镜像

```shell
# 设置 GitLab 环境变量
export GITLAB_HOME=/srv/gitlab
# 进入 docker-compose.yml 文件所在目录
cd /etc/gitlab
# 更新镜像
docker-compose pull
# 重新启动 GitLab 容器
docker-compose up -d
# 查看启动进度
docker logs -f gitlab
```
