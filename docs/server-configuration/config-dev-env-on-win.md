# Windows 系统下配置虚拟机中的开发环境

> 注意：自己配置开发环境的前提，是想配置出和自己买的阿里云服务器一样的配置和环境。所以 GitLab 什么的大型的项目，等以后再研究。

## 系统安装

下载 CentOS 7 的 DVD ISO 镜像，在 VMware Player 中安装。

安装时按照 [CentOS 7.3 安装指南](https://linux.cn/article-8048-1.html) 这篇文章中方法，设置时区及时间，开启以太网，然后直接使用最小安装（Minimal Install）即可，无需做教程中的其余操作。

在安装的过程中，为 `root` 账户设置密码，并且新建一个拥有管理员权限的账户 `www`，此处为方便记忆，两个账户设置了相同的密码。

系统安装完成后，在 VMWare Player 窗口下方，点击“已安装完成”，就会自动安装 VMWare Tools。

## 系统更新

以 `root` 账户登录。执行 `sudo yum update` 升级系统中的软件。在提示需要做出选择的地方，全部输入 `y` 然后回车即可。

升级完软件之后，再输入 `sudo init 6`，升级系统内核。

## 系统配置

参考 [How to Run ‘sudo’ Command Without Entering a Password in Linux](https://www.tecmint.com/run-sudo-command-without-password-linux/) 这篇文章，执行命令 `sudo visudo`，在打开的文件内插入下面这行，就可以让新建的 `www` 账户在执行 `sudo` 开头的命令时不再需要输入密码。

```bash
www ALL=(ALL) NOPASSWD: ALL
```

---

## 备用资料

- [Initial Server Setup with CentOS 7](https://www.digitalocean.com/community/tutorials/initial-server-setup-with-centos-7)
