# Windows 系统下配置虚拟机中的开发环境

> 注意：自己配置开发环境的前提，是想配置出和自己买的阿里云服务器一样的配置和环境。所以 GitLab 什么的大型的项目，等以后再研究。

## 系统安装

下载 CentOS 7 的 DVD ISO 镜像，在 VMware 中安装。

安装时按照 [CentOS 7.3 安装指南](https://linux.cn/article-8048-1.html) 这篇文章中方法，设置时区及时间，开启有线网，然后直接使用最小安装（Minimal Install）即可，无需做教程中的其余操作。

在安装的过程中，为 `root` 账户设置密码，并且新建一个拥有管理员权限的账户 `www`，此处为方便记忆，两个账户设置了相同的密码。

系统安装完成后，在 VMWare Player 窗口下方，点击“已安装完成”，就会自动安装 VMWare Tools。

## 系统配置

参考 [How to Run ‘sudo’ Command Without Entering a Password in Linux](https://www.tecmint.com/run-sudo-command-without-password-linux/) 这篇文章，执行命令 `sudo visudo`，在打开的文件内插入下面这行，就可以让新建的 `www` 账户在执行 `sudo` 开头的命令时不再需要输入密码。

```bash
www ALL=(ALL) NOPASSWD: ALL
```

为保证修改生效，最好是在修改后重启一下系统。

## 系统更新

以 `root` 账户登录。执行 `sudo yum update` 升级系统中的软件。在提示需要做出选择的地方，全部输入 `y` 然后回车即可。

升级完软件之后，再输入 `sudo init 6`，升级系统内核。

## 网络检查

系统的基本设置完成之后，再检查一下网络是否可用。

1. 在虚拟机中用 `ping www.baidu.com` 测试是否能访问外网。
2. 在物理机中用 `ipconfig` 查看 VMnet8 这个以太网适配器（虚拟的有线网卡）的 IP 地址，这个地址是物理机和虚拟机所属的局域网中，物理机的 IP，比如 `192.168.233.1`。
3. 在虚拟机中用 `ip addr` 查看 IP，`ens33` 中的 `inet` 字段的值就是虚拟机的 IP，比如 `192.168.233.128/24`。
4. 然后分别在物理机和虚拟机中，用 ping 命令测试对方机器的连通性，如果能 ping 通，说明两者之间的网络连通性也没问题。

## 网络设置

VMWare 默认会为虚拟机系统通过 DHCP 分配动态 IP，日常使用肯定不方便，总不能每次开机之后先查查 IP，再记下来吧，多麻烦。于是参考 [如何给VMware中的CentOS7设置静态IP地址](https://www.jianshu.com/p/2886d9b41d54) 这篇文章中的方法，给虚拟机中的 CentOS 设置了静态 IP。在自己的 CentOS 上，网卡名是 ens33，而不是文章里的，大家在配置自己的静态 IP 时，也要注意本机的网卡名称。

同时也要为物理机指定静态 IP，除了 IP 不同，其余的子网掩码、默认网关和 DNS 都和虚拟机中设置成一样的就行。

---

## 备用资料

- [Initial Server Setup with CentOS 7](https://www.digitalocean.com/community/tutorials/initial-server-setup-with-centos-7)
