# 01. Nginx 核心知识100讲

## 组成部分

1. 二进制可执行文件：官方模块及其他模块编译后生成的可执行文件
2. Nginx.conf：控制 Nginx 的行为
3. access.log：记录所有 http 请求信息
4. error.log：记录所有错误，用于定位问题

## 版本选择

1. 开源版本：nginx.org
2. 阿里的 Tengine：核心被修改，无法与官方同步，不推荐
3. 章亦春的 OpenResty：openresty.org 开源版

## 编译 Nginx

现成的二进制文件会把模块直接编译进来，官方模块不会开启所有模块，所以结合自己的需求编译 Nginx 更合适。

先去 [Nginx 的官方下载页面](http://nginx.org/en/download.html) 找到 Nginx 源码的下载链接，建议下载 Stable 版本，比如 http://nginx.org/download/nginx-1.14.2.tar.gz。

然后用 `wget http://nginx.org/download/nginx-1.14.2.tar.gz` 把源码的压缩包下载过来。

用 `tar -xzf http://nginx.org/download/nginx-1.14.2.tar.gz` 解压到当前目录下。

进入源码所在目录 `cd nginx-1.14.2`，会看到里面有若干个目录。

```shell
[root@localhost nginx-1.14.2]# ll
total 732
drwxr-xr-x. 6 1001 1001   4096 Jan 10 23:27 auto
-rw-r--r--. 1 1001 1001 288742 Dec  4 22:52 CHANGES
-rw-r--r--. 1 1001 1001 440121 Dec  4 22:52 CHANGES.ru
drwxr-xr-x. 2 1001 1001    168 Jan 10 23:27 conf
-rwxr-xr-x. 1 1001 1001   2502 Dec  4 22:52 configure
drwxr-xr-x. 4 1001 1001     72 Jan 10 23:27 contrib
drwxr-xr-x. 2 1001 1001     40 Jan 10 23:27 html
-rw-r--r--. 1 1001 1001   1397 Dec  4 22:52 LICENSE
drwxr-xr-x. 2 1001 1001     21 Jan 10 23:27 man
-rw-r--r--. 1 1001 1001     49 Dec  4 22:52 README
drwxr-xr-x. 9 1001 1001     91 Jan 10 23:27 src
```

`auto` 目录里面，子目录 `cc` 是用于编译的，`lib` 和 `os` 是用来判断系统的，其他的都是用来辅助 config 脚本来判定当前操作系统支持哪些模块。

`conf` 目录是配置示例，方便运维安装好 Nginx 之后，把配置复制到合适的目录下来用。

`configure` 脚本是用来生成中间文件，执行编译前的必备动作。

`contrib` 提供了两个库脚本和 vim 的一个工具。没有使用 vim 工具时，打开配置文件，会发现 Nginx 语法没有在 vim 中高亮。这个时候，如果把 `contrib` 目录下的 vim 配置文件拷贝到 vim 的配置文件夹中，这个时候 vim 就可以高亮 Nginx 配置文件了。

`html` 目录提供了两个标准的 HTML 文件，这个不重要。

`man` 目录里放的是 Nginx 的帮助文件。

`src` 目录放的自然就是 Nginx 的源代码了。

接下来开始编译，先看看 `configure` 脚本支持哪些参数：`./configure --help | more`，加参数 `more` 是为了让输出结果一次只显示一屏。

输出结果分为几大块：第一块是确定编译时，它会去哪些目录下找相关的文件。

```text
  --prefix=PATH                      set installation prefix
  --sbin-path=PATH                   set nginx binary pathname
  --modules-path=PATH                set modules path
  --conf-path=PATH                   set nginx.conf pathname
  --error-log-path=PATH              set error log pathname
  --pid-path=PATH                    set nginx.pid pathname
  --lock-path=PATH                   set nginx.lock pathname
```

如果没什么自定义的需求的话，只需要设置 `--prefix` 这个参数就可以了，其它的文件会在指定的路径下建立相应的文件或文件夹。

第二块是确定要使用哪些模块、不使用哪些模块。

```text
  --with-http_ssl_module             enable ngx_http_ssl_module
  --with-http_v2_module              enable ngx_http_v2_module
  --with-http_realip_module          enable ngx_http_realip_module

  --without-http_charset_module      disable ngx_http_charset_module
  --without-http_gzip_module         disable ngx_http_gzip_module
  --without-http_ssi_module          disable ngx_http_ssi_module
```

前缀是 `--with` 的，说明默认是不会编译这个模块的，前缀是 `without` 的则刚好相反。

第三块则指定了编译时一些的特殊参数。

```text
  --with-cc=PATH                     set C compiler pathname
  --with-cpp=PATH                    set C preprocessor pathname

  --with-debug                       enable debug logging
```

