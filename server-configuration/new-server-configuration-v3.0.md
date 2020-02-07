# 服务器配置笔记 v3.0

这篇文章介绍了如何在个人电脑上安装配置 CentOS

## 安装 CentOS

整体流程，参考[CentOS 7.3 安装指南](https://www.aliyun.com/jiaocheng/143753.html)这篇教程即可。

需要注意的是，如果安装 CentOS 的硬盘，之前已经装过系统，需要在 CentOS 的 GUI 安装界面，用快捷键 `Ctrl+Alt+F2` 调出一个新的终端窗口，用下面的命令格式化硬盘，然后才可安装。


```shell
# 列出所有磁盘，会包含 U 盘，注意磁盘名称不要看错
$ fdisk -l
# 用 fdisk 命令开始编辑本机硬盘
# 输入该命令后，会进入编辑界面
$ fdisk /dev/sda
# 用 d 指令删除磁盘上的分区，此处不详述
$ d
```

删除完分区之后，直接用快捷键 `Ctrl+Alt+Del` 重启系统，重新进入 CentOS 的 GUI 安装界面，继续安装。

默认安装语言可以选择中文，这样就会自动将时区设置为上海。

安装环境选择“带 GUI 的服务器”即可，附加组件这个时候先不选。

安装时尽量把网线插上，在网络那里，需要手动启用本机网络才行，因为默认是禁用的。

开始安装之后，还要给 root 账户设置密码。为安全起见，还要新建一个具有 root 权限的账户，也设置安全性较高的密码。

安装完成之后，按照提示重启系统，并按照上面教程链接里最后的更新部分，更新当前系统。

```shell
# 升级所有系统默认安装的软件包
$ sudo yum update
# 重启后再升级系统内核
$ sudo init 6
# 输入上面的命令后直接就自动重启了，怎么给人的感觉是没有升级内核呢？
```

## 配置 CentOS

### 查看手动安装的包

请看这里：[How to List Manually Installed Packages on CentOS/RHEL](https://www.webhostinghero.com/blog/how-to-list-manually-installed-packages-on-centosrhel/)。只尝试了直接查看数据库的方法，之后可以再尝试其它方法。

用下面的命令，可以查看所有安装/卸载的包。

```shell
sqlite3 /var/lib/yum/history/history-2018-12-10.sqlite "select tid, cmdline from trans_cmdline WHERE cmdline LIKE '%install%' OR '%remove%'"
```

### 更改主机名

执行命令 `hostnamectl set-hostname your-new-hostname`，然后再重启系统，就可以修改所要显示的主机名了。

注意，在文章 [How to Set or Change Hostname in CentOS 7](https://www.tecmint.com/set-change-hostname-in-centos-7/) 中，一开始就说明了主机名的命名规则：2~63 个字符，包含字母、数字、减号（-）、点号（.），必须以字母或数字开头，不区分大小写。

### 相关资料

- Windows 远程访问 CentOS 的方案：[Remote access to CentOS 7 from Windows 10](https://community.spiceworks.com/topic/2040456-remote-access-to-centos-7-from-windows-10)
- Linux 下格式化硬盘的方案：[Linux Hard Disk Format Command](https://www.cyberciti.biz/faq/linux-disk-format/)
- 更改 CentOS 7 主机名的几种方法：[How to Set or Change Hostname in CentOS 7](https://www.tecmint.com/set-change-hostname-in-centos-7/)

## 安装配置 docker

### 安装 docker

先卸载系统中可能的旧版 docker。

```shell
$ sudo yum remove docker \
                  docker-client \
                  docker-client-latest \
                  docker-common \
                  docker-latest \
                  docker-latest-logrotate \
                  docker-logrotate \
                  docker-selinux \
                  docker-engine-selinux \
                  docker-engine
```

然后配置安装及更新 docker 所需的 repository。

```shell
$ sudo yum install -y yum-utils \
  device-mapper-persistent-data \
  lvm2

$ sudo yum-config-manager \
    --add-repo \
    https://download.docker.com/linux/centos/docker-ce.repo
```

然后开始安装 docker。

```shell
$ sudo yum install docker-ce
```

安装过程中，需要确认一个 GPG key，值应该为 `060A 61C5 1B55 8A7F 742B 77AA C52F EB6B 621E 9F35`。如果不是这个值，则说明安装程序被篡改了。

安装完成之后，启动 docker，并运行一个镜像，验证 docker 是否可用。

```shell
$ sudo systemctl start docker
$ sudo docker run hello-world
```

### 配置用户组及用户

```shell
# 创建用户组 docker
$ sudo groupadd docker
# 将当前用户加入到 docker 这个组中
$ sudo usermod -aG docker $USER
# 在下面的文件中，能够看到所有的用户组及各组中的用户
$ cat /etc/group
```

创建完用户组并添加当前非 root 用户之后，注销当前用户并重新登录，然后执行下面的命令，测试用户权限是否已更新。

```shell
$ docker run hello-world
```

如果能看到相关的输出结果，就说明用户权限已成功更新。

### 配置开机启动

```shell
$ sudo systemctl enable docker
```

### 配置监听连接

为了安全起见，docker daemon（守护进程）默认只监听本机的 UNIX socket（UNIX 套接字，同一台主机内的进程间通信）。

> 待完成

### 配置镜像加速器

访问[容器镜像服务](https://cr.console.aliyun.com/)这个页面，登陆之后，点击左侧的“镜像加速器”，然后查看对应于 CentOS 的加速器配置方法，照着设置即可。

## 安装配置 GitLab

### 安装 GitLab

根据[gitlab/gitlab-ce](https://hub.docker.com/r/gitlab/gitlab-ce/)页面上所给出的指令，下载 GitLab CE 版本的镜像。

```shell
$ docker pull gitlab/gitlab-ce
```

在前面配置好阿里云的镜像加速器之后，镜像的下载速度应当是非常快的。

然后用下面的命令安装 GitLab。

```shell
sudo docker run --detach \
    --hostname gitlab.example.com \
    --publish 443:443 --publish 8080:80 --publish 2222:22 \
    --name gitlab \
    --restart always \
    --volume /srv/gitlab/config:/etc/gitlab \
    --volume /srv/gitlab/logs:/var/log/gitlab \
    --volume /srv/gitlab/data:/var/opt/gitlab \
    gitlab/gitlab-ce:latest
```

注意这里对外的 80 和 22 端口都改用 8080 和 2222 了，因为用默认端口的话，会报端口占用。

由于 GitLab 的安装比较耗时，在低配置机器，特别是在机械硬盘上安装的话，速度尤其慢。可以在命令行输入 `docker logs -f gitlab`，来查看 `gitlab` 这个容器的终端输出。

### 相关资料

- docker 安装流程：[Get Docker CE for CentOS](https://docs.docker.com/install/linux/docker-ce/centos/)
- 在 Linux 系列的系统中，安装完 docker 之后所需做的配置：[Post-installation steps for Linux](https://docs.docker.com/install/linux/linux-postinstall/)
- 介绍 docker daemon 所默认监听的连接：[Unix域套接字（Unix Domain Socket）介绍](https://blog.csdn.net/Roland_Sun/article/details/50266565)
- 在 docker 中安装 GitLab 的官方文档：[GitLab Docker images](https://docs.gitlab.com/omnibus/docker/)
- 用 docker 安装 GitLab 时 22 端口被占用的解决办法：[用docker安装gitlab ssh总是端口不能用](https://www.oschina.net/question/90201_2280758)
