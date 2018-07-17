# Windows 服务器 MongoDB 配置笔记

参考链接：[Install MongoDB Community Edition on Windows](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/)

## 安装 MongoDB

去官网的 [Download Center](https://www.mongodb.com/download-center#community) 下载社区版的 MongoDB，选择适用于 Windows 的版本即可。

> 注意：如果当前系统是 Windows Server 2008 R2 或者 Windows 7，需要先安装一个[系统补丁](http://support.microsoft.com/kb/2731284)，然后才能安装 MongoDB。

安装可以用默认设置，但是在最后确定安装之前，会在一个不起眼的地方（安装界面左下角）显示会同时安装“MongoDB Compass”，这个选项记得去掉，因为平时就用不着它。

## 试运行 MongoDB

在启动 MongoDB 之前，需要先为它创建一个用于存放数据的文件夹，比如在 E 盘根目录下新建一个 `mongodb` 文件夹，并在这个新建的文件夹内部再新建两个文件夹 `db` 和 `log`，`db` 用于保存数据库，`log` 则用于保存日志。

创建好文件夹之后，先试运行一下 MongoDB 的服务端。

下面的命令是在 PowerShell 中执行的，和官网并不完全一样。因为直接用 `"C:\Program Files\MongoDB\Server\3.6\bin\mongod.exe" --dbpath` 这种形式执行的话会报错。

```bash
> cd "C:\Program Files\MongoDB\Server\3.6\bin"
> .\mongod.exe --dbpath "E:\upcweb\mongodb\db"
```

执行命令之后，会看到输出了很多行内容，如果能看到类似下面 `waiting for connections on port 27017` 这样的内容的话，就说明 MongoDB 的服务端已经成功运行了。

```bash
2018-03-17T11:08:54.149+0800 I NETWORK  [initandlisten] waiting for connections on port 27017
```

服务端成功运行起来之后，还要通过客户端连接一下，测试是否能够正常访问服务端。新建一个 PowerShell 窗口，依次执行以下命令：

```bash
> cd "C:\Program Files\MongoDB\Server\3.6\bin"
> .\mongo.exe
```

如果连接成功的话，会看到窗口中输出了很多行内容，并且最后一行是 `> _`，光标不断闪烁，等待用户输入，这就说明客户端已经成功连接到了服务端。

在客户端的窗口中，输入 `exit`，关闭和服务端的连接。然后在服务端的窗口中，按下快捷键 `Ctrl+C` 停止服务端。

## 配置 MongoDB 服务

每次都手动执行这一大堆命令来启动 MongoDB 实在是太不专业了，官网也给出了方法，写一个配置文件之后，就可以让 MongoDB 以服务的方式启动了。

在 MongoDB 的安装目录下 `C:\Program Files\MongoDB\Server\3.6` 新建一个配置文件 `mongod.cfg`。配置文件中写上如下内容，就是上面新建的数据库文件夹，和日志文件的路径。

```ini
systemLog:
    destination: file
    path: e:\upcweb\mongodb\log\mongod.log
storage:
    dbPath: e:\upcweb\mongodb\db
```

然后再执行下面的命令，安装 MongoDB 服务。

```bash
> cd "C:\Program Files\MongoDB\Server\3.6\bin"
> .\mongod.exe --config "C:\Program Files\MongoDB\Server\3.6\mongod.cfg" --install
```

安装完成之后，就可以用下面的命令启动 MongoDB 服务了。当然也可以在 GUI 中启动服务。启动服务之后，根据上面设置的路径（`e:\upcweb\mongodb\log\mongod.log`）查看 log 文件的内容，如果能看到 `[initandlisten] waiting for connections on port 27017` 这样的内容的话，就说明服务已经成功启动了。

然后在终端里面再运行 `mongo.exe`，来检查是否能成功连接到服务端。

```bash
> cd "C:\Program Files\MongoDB\Server\3.6\bin"
> .\mongo.exe
```

这样一来，MongoDB 基本的配置就搞定了。
