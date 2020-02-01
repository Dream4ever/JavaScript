# 云服务器配置笔记 v5.0

> 2020年02月01日10:08:19

## 系统安装

在控制台将阿里云服务器 ECS 实例停止，以便更换操作系统。

找到并点击“更换操作系统”菜单，选择“公共镜像”中“CentOS 7.X”的最新版。

“安全设置”中选择“设置密钥”，选上之前为该服务器生成并使用的密钥对。

- 配置密钥对登录之后，阿里云会自动禁止密码登录，这样安全性更高
- 猜测应当是在 `/etc/ssh/sshd_config` 文件中添加 `PasswordAuthentication no` 这么一行禁止密码登录的
- 如果没有现成的密钥对，就先去新建密钥对，并将密钥绑定到该 ECS 实例，再进行后续操作

在弹出的“MFA验证”对话框中，输入手机 APP “Authenticator” 中该 ECS 实例所属阿里云账号的验证码。点击右下角的按钮，稍候片刻，ECS 实例就装上最新版的 CentOS 了。

## SSH 密钥对连接 ECS Linux 实例

### 本机全新连接

如果本机之前未通过 SSH 密钥对连接过 ECS 实例，则按照教程 [使用SSH密钥对连接Linux实例](https://help.aliyun.com/document_detail/51798.html) 进行配置即可。

其中如果用的是“在支持SSH命令的环境中使用密钥对”这种方式，即使按照“通过config文件配置”的流程来操作，也要把前一小节“通过命令配置”的流程做一遍，这样才能够确保私钥文件的权限符合密钥登录的要求，否则将无法登录。

### 本机非全新连接

如果本机之前用密钥连接过 ECS 实例，那么本机的 `~/.ssh/known_hosts` 文件中保存的是旧的 host key。重装 ECS 实例的系统后，需要将本机该文件中旧的 host key 删除，才能够用密钥成功登录 ECS 实例。

### 导出 SSH 公钥

由于后面打算用非 root 用户通过 SSH 密钥对连接 ECS Linux 实例，这里就需要先将保存在 root 用户目录下的公钥复制出来。

```bash
$ cd ~/.ssh
$ cat authorized_keys # 复制公钥
```

## 提升 SSH 连接安全性

### 新建普通权限用户

在 ECS 实例上执行以下命令。

```bash
$ adduser www # 新建用户
$ passwd www # 设置密码
$ su www # 切换至用户 www
```

### 配置新用户的 SSH 公钥

在 ECS 实例上执行以下命令。

```bash
$ cd ~ # 切换至当前用户的用户目录
$ mkdir .ssh && chmod 700 .ssh # 新建 .ssh 文件夹并设置文件夹权限
$ touch authorized_keys # 新建公钥文件并设置权限
$ vi authorized_keys # 将 root 用户那里得到的公钥复制过来
$ chmod 400 authorized_keys # 设置文件为只读权限
```

### 测试普通权限用户的 SSH 连接

在本机执行以下命令。

```bash
$ vi ~/.ssh/config # 将 User 字段后面的值由 root 改为 www
```
