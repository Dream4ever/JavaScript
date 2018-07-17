# CentOS 上 GitBook 的安装配置笔记

最开始是参照着简书上的 [Centos 7 下 GitBook 的安装与使用](http://cdn2.jianshu.io/p/a78e3dda4d87) 这篇文章，执行了 `sudo yum install gcc-c++` 命令，但是后来又想到应该去官方看最新的安装教程，所以简书这篇教程里的内容没有再看，不知道后面会不会用到 `gcc-c++`。

## 安装 GitBook 脚手架工具 GitBook-Cli

然后按照官网的教程：[gitbook-cli](https://github.com/GitbookIO/gitbook-cli)，依次执行以下操作：

```bash
# 全局安装 gitbook-cli 脚手架
$ npm install -g gitbook-cli
# 安装完提示npm有新版本，就按照提示给出的命令升级，这一步不必照搬
$ npm i -g npm
# 安装过程中又觉得自带的源下载速度有些慢，就顺便装一个nrm，可以很方便地对下载源进行测速和切换
$ npm install -g nrm
# nrm安装完成后的使用方法看文档即可 https://github.com/Pana/nrm
# 本来是想先看看gitbook有什么命令，可执行了这个命令之后，它开始安装gitbook了，什么鬼？
$ gitbook help
# 好吧，看看给我装了什么版本
$ gitbook ls
GitBook Versions Installed:

    * 3.2.3

Run "gitbook update" to update to the latest version.
# 注意，这里有个坑：即使已经装上了最新版，执行gitbook update的话，还是会再装一遍最新版……
$ gitbook update

GitBook has been updated to 3.2.3 # Are you serious?
```

## 配置 GitBook

最基本的安装完成了，接下来……得去看看官方的文档 [Setup and Installation of GitBook](https://github.com/GitbookIO/gitbook/blob/master/docs/setup.md)，弄清楚这个 GitBook 该怎么用。

```bash
# 新建一个目录，在这个目录里初始化gitbook
$ cd ~ && mkdir gitbook && gitbook init ~/gitbook
warn: no summary file in this book
info: create README.md
info: create SUMMARY.md
info: initialization is finished
# 然后编译出静态版本
$ cd gitbook && gitbook build
info: 7 plugins are installed
info: 6 explicitly listed
info: loading plugin "highlight"... OK
info: loading plugin "search"... OK
info: loading plugin "lunr"... OK
info: loading plugin "sharing"... OK
info: loading plugin "fontsettings"... OK
info: loading plugin "theme-default"... OK
info: found 1 pages
info: found 0 asset files
info: >> generation finished with success in 0.4s !
# 再运行GitBook服务
$ gitbook serve
Live reload server started on port: 35729
Press CTRL+C to quit ...

info: 7 plugins are installed
info: loading plugin "livereload"... OK
info: loading plugin "highlight"... OK
info: loading plugin "search"... OK
info: loading plugin "lunr"... OK
info: loading plugin "sharing"... OK
info: loading plugin "fontsettings"... OK
info: loading plugin "theme-default"... OK
info: found 1 pages
info: found 0 asset files
info: >> generation finished with success in 0.4s !

Starting server ...
Serving book on http://localhost:4000
```

## 配置 Nginx

由于服务器上安装了 Nginx，所以需要配置 Nginx，使其将本地的 4000 端口映射至域名的指定路径下，这样外网才能访问服务器上运行的 GitBook。配置方法用的是 [GitBook 使用 Nginx 做為 Proxy](https://cowmanchiang.me/gitbook/gitbook/contents/proxy.html) 这篇文章中所展示的代码。

```bash
$ sudo vi /etc/nginx/nginx.conf
# 然后将 location / 字段下面增加如下内容
        location /gitbook {
                rewrite ^/gitbook(/.*)$ $1 break;
                proxy_pass http://localhost:4000/gitbook;
                proxy_set_header Host $host;
                proxy_buffering off;
        }
# 按下Esc退出编辑模式，再输入 :x 并回车，保存更改并关闭文件
# 重启nginx，使配置生效
$ sudo systemctl restart nginx
# 查看nginx服务是否成功重启
$ systemctl status nginx.service
Nov 02 18:12:09 iz2zea3zhcnw9obutgqr57z systemd[1]: Started The nginx HTTP an...
# 只要在最后能够看到 Started 字样，就说明重启成功
```

好了，大功告成，访问 [http://hewei.in/gitbook/](http://hewei.in/gitbook/) 看看效果吧！

## 如何将写好的 Markdown 文档作为文章放到服务器上？

初步查看了一下 `gitbook` 这个文件夹的结构，在根目录下是两个 md 文件，那么自己的文章照着这个目录结构放上来应该就行。

服务器上的是 `README.md` 和 `SUMMARY.md` 两个文件，自己还可以试试只放其中一个文件是否能正常显示。
