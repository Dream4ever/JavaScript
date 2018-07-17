# RMS 资源管理系统配置笔记

## 搭建基本环境

注意：所有的 npm 包都通过 yarn 安装。

```bash
$ yarn global add express-generator
$ express --view=ejs rms
$ cd rms && npm i
$ supervisor node ./bin/www # 开发环境用supervisor，上线之后用pm2
```

## 增加留言功能

### 获取用户 IP

```javascript
// routes/index.js
router.get('/', function(req, res, next) {
  console.log('\nRequest IP: ' + req.ip);
  res.render('index', { title: 'Express' });
});
```

- 本机直接访问：`::1`
- 通过本机其它端口服务来访问：`::1.2.3.4` （即本机 IP）
- 外网 IP：`::ffff:111.111.111.111`

### 返回 JSON 数据

要允许跨域请求，需要先在 express 中安装并配置 `cors` 这个库。

```bash
$ yarn add cors
```

```javascript
// app.js
var cors = require('cors');
app.use(cors());
```

这样就可以正常接收跨域请求了。

```javascript
// routes/index.js
router.get('/', function(req, res, next) {
  console.log('\nRequest IP: ' + req.ip);
  res.json({ code: 1 });
});
```

### 设置 API

```javascript
// routes/api.js
var express = require('express');
var router = express.Router();

router.post('/messages', function(req, res, next) {
  console.log('\nRequest IP: ' + req.ip);
  console.log('\n\nRequest body: ' + JSON.stringify(req.body));
  res.json({ code: 1 });
});

module.exports = router;
```

```javascript
// app.js
var api = require('./routes/api');

app.use('/api/v1', api);
```

然后在其它地方向 `http://abc.com/api/v1/message` 这个地址发送 POST 请求即可。

### 配置字段

要完整记录访客的留言信息，需要有下面几个字段：

| 字段名 | 中文含义 | 备注 | 具体方式 |
| - | - | - | - |
| id | 数据的 UUID | 后台代码生成，有唯一性 | nanaoid() |
| name | 姓名 | 访客填写 | req.body.name |
| phone | 电话 | 访客填写 | req.body.phone |
| content | 内容 | 访客填写 | req.body.content |
| to | 留言给谁 | 前台代码生成 | fillMsg() |
| ip | IP | 后台代码记录 | req.ip |
| time | 留言时间 | 前台代码生成 | moment()._d |
| origin | 留言来源 | 前台代码生成 | fillMsg() |
| part | 留言分类 | 前台代码生成 | fillMsg() |
| ua | 浏览器信息 | 后台代码记录 | req.header('User-Agent') |

### 前端发送数据

先说一下前端页面要做的工作：

1. 检查发出 HTTP 请求的地址是否来自本机：`window.location.hostname.match('localhost')`，是的话说明只是测试信息，不用处理；否则就继续处理。
2. 由访客填写的字段，用 `v-model` 绑定到 Vue 实例中对应的变量即可，提交表单前需检查这几个字段是否为空，只要有一个为空，就提示填写完整；全部非空才进行下一步。
3. 接下来检查用户所填写的电话号码是否正确，用正则表达式 `/^([+]?(\d+))|((\d+)[-]?(\d+))$/` 来检查，即首个字符可以是加号 `+`，然后跟至少一个数字，中间可以有减号 `-`，剩下的也全是数字，这样就包含了座机和手机两种情况。当然了，这段正则并不完善，不过对于这个需求来说够用了。
4. 各项信息检查完毕，数据正确，则在前端浏览器中补充其余信息（`fillMsg()`），包括发出请求的页面所属的网站（`origin`）、对应的版块（`part`）、留言给谁（`to`），以及提交表单的时间（`time`）。

前端页面的所负责的部分，到这里就完成了，接下来就该后端完成剩下的工作了。

### 后端接收数据

后端要做的工作：

1. 将前端的请求和后端生成的几个数据：id（`nanoid()`）、ip（`req.ib`）、ua（`req.header('User-Agent')`）一起打包到一个 message 对象中。
2. 检查对象各属性的值是否为空，用 `code` 这个变量标记对象是否属性全部非空。
3. 如果对象属性全部非空，则将对象通过 `lowdb` 写入 json 文件中。
4. 将 `code` 的值包装成 json 返回给前端页面，以便进行后续处理。

相关代码如下：

```javascript
for (const key in message) {
  if (!message[key]) {
    code = 0;
    break;
  }
}

if (code) {
  const adapter = new FileSync('db.json');
  const db = low(adapter);

  db.defaults({ messages: [] })
    .get('messages')
    .push(message)
    .write();
}

res.json({ code: code });
```

后端代码在电脑上测试了几遍，没有问题。然后用自己的 iPhone 进行测试，这个时候出问题了：

iPhone 真机测试时，跨域请求一直是 pending 状态。手机通过 PC 的网络作为代理联网的话，这个问题就又消失了。安卓真机测试了几台，也都没有这个问题。

临时的解决方案：先将服务端放到和客户端相同的域名下，还真 OK 了！注意，这种情况下， Node.js 服务端是参考下面的方式配置的。后来解决了跨域问题之后（看[另一篇文章](https://github.com/Dream4ever/JavaScript/blob/master/company-business/cross-origin.md)），就不需要用 IISNode 管理 Node.js 服务了，又可以一门心思写 JS 不用管 IIS 了，哈哈。

### IISNode 管理 Node.js 服务

IIS 提供了虚拟目录的功能，可以将网站物理路径之外的目录映射到网站下。为了把上面所做的后端服务映射到公司现有网站下，依次做了以下几项设置，也是踩了一晚上的坑才爬出来的：

1. 添加进来的虚拟目录，要增加 `IUSR` 这个用户的完全访问权限，和 `IIS_IUSRS` 这个用户组的完全访问权限。
2. 映射过来的目录，在其实际的物理目录中要放一个 `Web.config` 文件，用于 IIS 读取网站的配置，以便启动 Node.js 服务。
3. 用于启动 Node.js 服务的文件，应当放在根目录下。因为是用 express-generator 生成的，所以最初的启动文件路径为：`./bin/www`，那么把这个文件复制一份放到根目录，并重命名为 `launch.js` 就好了。当然了，里面的相对路径也要对应修改。
4. 接下来还要修改路由：假设虚拟目录的名称为 `rms`，API 的注册代码为 `app.use('/api/v1', api)`，具体的 API 路由原本为 `router.get('/', () => {})`；那么服务映射到 IIS 中之后，具体的 API 路由就应当改成 `router.get('/rms/api/v1', () => {})`，也就是访问该 API 的完整路径：虚拟目录的名称 + API 注册的路径。另外，还有很重要的一点：根路径也必须注册，而且也必须注册到 API 所用的路由页面上，即 `app.use('/', api)`，否则 API 就无法访问。
5. 好了，照着上面几步设置之后，Node.js 服务就可以成功地通过网站访问了。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <system.webServer>
      <!-- indicates that the hello.js file is a node.js application 
      to be handled by the iisnode module -->
      <handlers>
        <add name="iisnode" path="launch.js" verb="*" modules="iisnode" />
      </handlers>

      <rewrite>
          <rules>
              <clear />
              <rule name="Redirect to API">
                <match url="/*" />
                <action type="Rewrite" url="launch.js" />
              </rule>
          </rules>
      </rewrite>

     <!-- exclude node_modules directory and subdirectories from serving
     by IIS since these are implementation details of node.js applications -->
     <security>
       <requestFiltering>
         <hiddenSegments>
           <add segment="node_modules" />
         </hiddenSegments>
       </requestFiltering>
     </security>

    </system.webServer>
</configuration>
```

### 解决跨域问题（上面的修改就可以撤回了）

见文章：[解决跨域问题](https://github.com/Dream4ever/JavaScript/blob/master/company-business/cross-origin.md)。

### 申请免费 SSL 证书

参考链接：[201712月如何买到阿里云免费SSL证书（0元SSL证书）](https://juejin.im/post/5a3c837151882511793e6297)，方法亲测可用（2018年3月12日依然有效）。

存在问题：uppbook 这个域名目前在“北京光速连通科贸有限公司”这家公司名下，并不在阿里名下，因此在阿里云控制台的域名列表中看不到该域名。

而配置 SSL 证书，还需要修改域名托管商的 DNS，要把 `66.cn` 这个系列的 DNS 改成阿里云的 `alidns.com` 这个系列的 DNS。这个就需要问同事要上面那家公司管理系统的帐号密码了。

速查：

- [云盾证书管理页面](https://yundun.console.aliyun.com/?spm=5176.2020520001.0.0.y1YBTO&p=cas)
- [域名解析列表](https://dc.console.aliyun.com/dns/domain/list?spm=a2c1d.8251892.layout.ddomainList.584952f2MN8WKP)
