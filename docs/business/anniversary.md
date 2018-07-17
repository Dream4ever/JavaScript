# 公司30周年庆网页制作总结

## 开发环境

- 开发工具
    - Visual Studio Code: 编写代码
    - VSCode Browser Sync: VSCode 插件，本地代码变更后，浏览器自动刷新
    - Path Intellisense: VSCode 插件，路径智能补全
    - Photoshop CC 2015.5: 机器性能足够的话，还是建议装新版，有很多改进，能够显著提升工作效率
- 测试环境: Chrome（+360/QQ/搜狗） + Window Resizer 扩展 + IE8/11，测试各种分辨率下页面的表现
- 所用库 & 框架
    - Vue.js: 前端 JS 框架
    - jQuery: 前端 JS 库
    - Glide.js: JS 轮播图插件
    - Magnific Popup: JS 灯箱插件
    - normalize: 前端 CSS 样式一致化插件
    - anu.js：待测试，兼容 IE6+，用于替换 Vue.js，以实现跨浏览器的兼容性
- 版本管理
    - Git + VSCode 自带的源代码管理工具

## 开发规范

### 代码管理

- 每增加一个小功能就 commit 一次。
- 代码在本机和 GitHub 上各保存一份。

### 目录结构

```bash
├─ie
│  ├─page
│  │  └─book
│  └─static
│      └─css
├─page
│  └─book
└─static
    ├─css
    ├─ebook
    ├─img
    └─js
```

由于主题是公司的30周年庆，以展示几大部分内容为主，因此 HTML 页面较少，5 个主页面的 HTML 文件就放在了项目的根目录，其余子页面放在 `/page/book` 目录中。

静态资源分类存放在 `static` 目录中：JS、CSS、图片以及电子书各自放在对应的目录中。由于每个页面都会用到一些图片资源，因此将图片资源进一步分类，公用的图片资源保存在 `static/img/common` 中，其余的各自保存在对应的目录中。

每个 HTML 页面都与一个 JS 文件及至少一个 CSS 文件对应，内容、样式与表现分离。不过在开发的最后阶段，为了快速开发一个页面，将 JS 脚本及 CSS 样式都写在了 HTML 文件中，省去了在多个文件中来回编辑的麻烦。所以还是要随机应变，不必拘泥于规范。

### 页面调试

采用了 Chrome 扩展 Window Resizer，测试了网页在 `1366x768`、`1440x900`、`1600x900`、`1680x1050` 及 `1920x1080` 这几大主流分辨率下的表现。

主流分辨率数据来源：[分辨率使用情况 - 百度流量研究院](http://tongji.baidu.com/data/screen)。

## 开发流程

- 确定整组页面的整体风格。
- 参考优秀的网页设计，与同事共同交流，确定各个页面的整体框架。
- 开始编写代码、用 PS 制作素材，并在讨论中不断改进，直到最终完成每个页面。

逐个页面进行开发，完成一个页面后再做下一个页面。

## 通用部分

### 整页背景

参考链接：[Perfect Full Page Background Image](https://css-tricks.com/perfect-full-page-background-image/)

关键代码：

```css
body {
    background: url(images/bg.jpg) no-repeat center center fixed;
    -webkit-background-size: cover;
    -moz-background-size: cover;
    -o-background-size: cover;
    background-size: cover;
}
```

代码解读：

- `background` 属性中的 `no-repeat` 让背景图片在水平和垂直方向上不重复显示，因为不设置这个属性的话，背景图片默认是会在两个方向上重复显示的，直到填满浏览器窗口为止。
- `background` 属性中的两个 `center` 让背景图片在水平和垂直方向上均居中。
- `background` 属性中的 `fixed` 属性让背景图固定，不随页面滚动。
- `background-size` 属性的 `cover` 值，让背景图片在保持自身宽高比的同时，占满整个屏幕的高度。

### “伪”响应式页面

由于各个页面的主要元素均为图片，为了适配各种主流分辨率，结合下面两种方式实现了该需求：

- `body`、`div` 及图片元素的尺寸均采用百分比。
- 对于有文字的页面，为根元素 `html` 设置一个基本的 `font-size` 值，页面内的文字均使用 `em` 作为单位，以保证在各种分辨率下均能以合理的字号呈现。由于页面 DOM 树的层级不深，并且文字很少，所以 `em` 的表现和 `rem` 相同。否则应该用 `rem`，因为 `rem` 最终的 `font-size` 是相对于根元素 `html` 来计算的，`em` 则是相对于父元素来计算。

第二条的参考链接：[从网易与淘宝的font-size思考前端设计稿与工作流](http://www.cnblogs.com/lyzg/p/4877277.html)

### 元素对齐

在不考虑各种古董级浏览器的前提下，可以放心地用 `flex` 来对齐元素，实在是太方便了！比如对于需要在水平和垂直两个方向上均居中对齐的一组元素，按照如下代码设置其父元素属性即可。

```css
display: flex; /* 或者 inline-flex */
flex-direction: row; /* 设置子元素在主轴上的排列方向，默认是 row */
justify-content: center; /* 设置子元素在主轴上的对齐方式 */
align-items: center; /* 设置元素在副轴上的对齐方式 */
```

### 脚本执行

为了在加载完自定义的 JS 文件之后就执行里面的代码，采用了立即执行函数表达式（IIFE）的形式。

```javascript
(function () {
    // code
})();
```

### 浏览器窗口尺寸变化后自动刷新

参考链接：[How can I refresh the screen on browser resize?](https://stackoverflow.com/a/18321223)

关键代码：

```javascript
window.addEventListener('resize', function () {
    "use strict";
    window.location.reload();
});
```

代码解读：

监听浏览器的 `resize` 事件，将刷新页面这个函数绑定至该事件上。

### 跨浏览器的后退功能

由于在服务器的 IIS 控制台中开启了 URL 重定向，Chrome 下无法正常使用浏览器的后退功能，所以需要自己写代码实现这个功能。

在浏览器标签中，用户以各种方式从一个页面前往另一个新页面，URL 发生变化时，前一个页面都会触发 `beforeunload` 事件。所以可以通过监听该事件，实现自定义的后退功能。

但是在 Chrome 中测试时，发现测试代码无效，搜索一番之后，发现新的 HTML5 规范中，在 `onbeforeunload` 事件中，`window.alert` 等几个方法会被忽略。所以需要改成 `console.log()` 方法进行测试，这次测试之后，Chrome 和 IE 中都正常，good。

```javascript
window.onbeforeunload = function () {
  if (testSessionCookie()) {
    var name = 'prevUrl';
    var value = window.location.href;
    writeSessionCookie(name, value);
    console.log('before unload: \n' + value);
  }
}

$('#back').click(function () {
  var prevUrl = getCookieValue('prevUrl');
  window.location.href = prevUrl;
});
```

另外，cookie 相关的操作，引用了网上的一个库，在参考链接最后附上了。话说，之前就用上了这个库，但是已经忘了是怎么搜索到的了，还是得及时做笔记啊……

---

在移动端测试时，发现后退功能又不管用了，那就一步步排查吧。

- 用 `spy-debugger` 这个项目进行真机调试，发现浏览器控制台会报错 `can't find variable $`。可以看出来这是 jQuery 文件未成功加载的问题。代码中虽然先把 jQuery 引入了，但还是会报这个错误，放到 `head` 标签里面也不行。于是下载到本机，作为相对路径里的文件引入，这下没问题了，折腾。
- 然后发现页面中的图片文件都没加载出来，于是又照葫芦画瓢，把 Vue 也下载到本地进行引用。然后再测试后退功能，嘿，好了！但是！只是在 Chrome 中好了，在 Safari 里面还是不能用！
- 然后在 Safari 中专门测试，用 `(testSessionCookie()` 这个函数测试，确认 cookie 功能是可用的，但是在点击“返回”按钮时，发现找不到名为 `prevUrl` 的这个 cookie……于是把返回功能改成了下面这个样子：

```javascript
$('#back').click(function () {
  var prevUrl = getCookieValue('prevUrl');
  if (prevUrl) {
    window.location.href = prevUrl;
  } else {
    history.go(-1);
  }
});
```

可是 Safari 中依然无法使用后退功能！划克啊。用关键字 `js safari history.go not working` 搜索，看到有人说如果把“返回”事件绑定到了 `a` 标签上，那就还需要在函数里面加上 `event.preventDefault()` 这么一句才行。照着试了一下，终于好了！阿西巴。

但是！为什么移动端无法加载 CDN 上的 JS 文件呢？只要下载到本地，不管是放在 `head` 标签中，还是放在 `body` 标签中，都可以正常使用。更新：后来用今日头条的 CDN 测试了一下，发现是 BootCDN 独有的问题，好吧，那就先把这些依赖都放到本地吧……

参考链接：

- Google 关键字：`js 监听 url`
- [如何监听 location.href 这个值发生了变化？](https://www.v2ex.com/t/248868)
- Google 关键字：`onbeforeunload not work`
- [window.onbeforeunload not working](https://stackoverflow.com/a/7256224/2667665)：H5 规范中，在 `onbeforeunload` 几个事件中，忽略了 `console.log()` 等几种方法。
- [Cookie Handling Routines in JavaScript](https://www.braemoor.co.uk/software/cookies.shtml)：将几种常用的 cookie 操作封装成了实用的函数。
- [spy-debugger](https://github.com/wuchangming/spy-debugger)：真机调试，可调试各种浏览器、微信、WebView，电脑和手机在同一网络下即可，非常方便！

## 首页

### 页面设计

页面如下图所示：

![Anniversary - Index](https://gitee.com/samsara9527/Pics/raw/master/anniversary/anniversary-index.png)

因为是以“周年庆”为主题，所以让领导的领导专门写了几个字，然后在昵图网上下载了一个 PSD 格式的素材，把里面的金色素材拿出来，作为剪贴蒙板放在几个大字上。

同时将公司的 Logo 放在大字上方，不然页面会显得有点儿单调。

各个版块则是用 PS 做成了一本本的书，放在页面下方，与公司的业务及文化相契合。

### 资源引用

页面中所有图片的路径，都是以数据的形式保存的。这样一旦所引用的资源发生了变化，直接修改 JS 代码即可，不会影响 HTML 页面。

```javascript
var data = {
    img: {
        'anniversary': 'static/img/index/anniversary.png',
        'logo': 'static/img/index/logo.png'
    },
    idx_img: {
        'history': 'static/img/index/01-history.png',
        'honor': 'static/img/index/02-honor.png',
        'toast': 'static/img/index/03-toast.png',
        'book': 'static/img/index/04-book.png',
        'department': 'static/img/index/05-department.png'
    }
};

var app = new Vue({
    el: '#app',
    data: {
        img: data.img,
        idx_img: data.idx_img
    }
});
```

代表各个版块的图片需要用 `v-for` 循环来遍历，因此与其它图片资源作为两个对象分开保存。

### 动画效果

静态网页看着还是有点儿单调，加上了动画效果看着就好一些了。

![Index - Animation](https://gitee.com/samsara9527/Pics/raw/master/anniversary/anniversary-index-animation.gif)

动画效果的原理：鼠标没放上去的时候是一张图，鼠标放上去之后切换为另一张图，并增加一个缓慢放大的动画。

代码剖析：

- 结合下面的 HTML 代码和 JS 代码可知，分别将 `light()` 和 `fade()` 这两个函数绑定到了 `mouseenter` 和 `mouseleave` 这两个事件上，这样就能实现鼠标放到图片上时，显示动画效果，鼠标离开图片之后，图片恢复原状的功能。
- 最开始是想着将 Vue 中的函数绑定到 `hover` 相关的事件上，查了很久，才发现只能绑定到 `mouseenter` 事件上，因为并没有 `hover` 相关的事件。
- 鼠标放到图片上时，`light()` 函数修改了 `img` 元素的 `src` 属性，因此鼠标离开之后，还需要恢复 `img` 元素的 `src` 属性，对应于 `light()` 函数，又补充了 `fade()` 函数。
- Vue.js 函数的 `event` 这个参数，其属性 `event.target` 指向的就是该函数所绑定事件所属的元素。
- 通过原生 JS 的 `getAttribute()` 和 `setAttribute()` 来查询及设置 HTML 页面中的节点，实现更换 `img` 标签中图片文件的目的。
- 图片的放大效果，是通过为 `:hover` 这个伪类添加 `transform` 属性实现的，并设置了 `transition-duration` 属性，减慢动画速度，用户体验更佳。

```html
<!-- HTML -->
<div class="img-link">
    <a v-for="(img, path) in idx_img" :href="path + '.html'" @mouseenter="light" @mouseleave="fade">
        <img :src="img" alt="">
    </a>
</div>
```

```javascript
// JS
methods: {
    light: function (event) {
        var imgNode = event.target.childNodes[0];
        var imgPath = imgNode.getAttribute("src").split(".")[0];
        imgNode.setAttribute("src", imgNode.getAttribute("src").split(".")[0] + "-2.png");
    },
    fade: function (event) {
        var imgNode = event.target.childNodes[0];
        var imgPath = imgNode.getAttribute("src").split(".")[0];
        imgNode.setAttribute("src", imgNode.getAttribute("src").split(".")[0].slice(0, -2) + ".png");
    }
}
```

```css
/* CSS */
.img-link > a:hover {
    -webkit-transform: scale(1.3);
    -ms-transform: scale(1.3);
    -o-transform: scale(1.3);
    transform: scale(1.3);
    transition-duration: 1000ms;
}
```

## 发展历程

### 页面设计

最终页面如下图所示：

![Anniversary - History](https://gitee.com/samsara9527/Pics/raw/master/anniversary/anniversary-history.png)

页面设计的关键：`v-for="(element, index) in array"`，在这个 `v-for` 循环中，能够获取到数组元素的索引值，这样就可以实现上图中左右对称排列的效果了。对于索引为偶数的元素，照片在左边，文字在右边；索引为奇数的元素则刚好相反。

页面中轴上，表示年份的金色文字，是采用了“大字号 + `text-shadow`”属性实现的，这样就不需要去 PS 中制作图片了。

### 分隔线

页面中轴上连续的黄色圆点，原图是单个的黄色圆点，将其设置为背景图片并添加了 `repeat-y` 属性值，并且这个素材图片也是在 PS 中经过精心设计的，让圆点位于图片中间，上下均留白，多次测试了不同的留白高度之后，最终才确定了一个合适的尺寸。

### 隐藏滚动栏

为了呈现出更好的浏览效果，特意隐藏了页面的滚动栏。

参考链接：[Hiding the scrollbar on an HTML page](https://stackoverflow.com/a/13184693/2667665)

```css
::-webkit-scrollbar {
    display: none;
}
```

## 执行对应网页版本的 JS 代码

最开始用的是 `if (avalon) { ... } else if (Vue) { ... }`，但是这样一来，在 IE 中能执行里面的代码，在 Chrome 等非 IE 浏览器中就会报错，说 `avalon 未定义`。

然后想着检查 `useragent`，用的下面的形式，但是在非 IE 浏览器中依然不执行对应的代码。

```javascript
var isIE = navagitor.useragent.toLowerCase().indexOf('ie') !== -1 || navagitor.useragent.toLowerCase().indexOf('trident') !== -1;
if (isIE) {
    // some code
} else {
  var app = new Vue({
    // some code
  });
}
```

这样虽然不报错了，但还是不会执行 else 循环里面的代码。

最后用 `typeof` 命令解决了：

```javascript
if (typeof avalon !== 'undefined') {
  // IE 版本的代码
} else if (typeof Vue !== 'undefined') {
  // Chrome 版本的代码
}
```

## IIS Redirect 模块应用笔记

由于公司周年庆预期会有相当一部分的用户是使用 IE 浏览器来查看的，为了保证网站的兼容性，就需要将这一部分用户重定向至指定的页面。

### 目前规则

（待更新）

- 匹配 URL：`^30th(?!/ie)(.*)$`，即匹配以 `30th` 开头，并且后面紧邻的字符串不是 `/ie` 的路径。规则为“与模式匹配”。
- 条件：条件输入为 `{HTTP_USER_AGENT}`，模式为 `^(.*)ie(.*)$` 以及 `^(.*)trident(.*)$`，即匹配所有 IE 浏览器的 User Agent。类型为“与模式匹配”。
- 操作：重定向至 URL `{R:1}/ie{R:2}`，重定向类型选择“永久（301）”。

这样一来，只要是从 IE 浏览器中访问周年庆网站的话，就会自动重定向至专门为 IE 浏览器单独开发的页面上。

### 规则优先级

排在上面的规则优先级更高。

### 参考资料

- [详解IIS中URL重写工具的匹配URL-规则模式(rule patterns)](http://shiyousan.com/post/635659901987610088)
- [详解IIS中URL重写工具的规则条件(Rule conditions)](http://shiyousan.com/post/635654920639643421)
- [详解IIS中的重写工具下关于操作重定向URL中的{R:N}与{C:N}](http://shiyousan.com/post/635648886502897428)
- [URL Rewrite Module Configuration Reference](https://docs.microsoft.com/en-us/iis/extensions/url-rewrite-module/url-rewrite-module-configuration-reference#Rule_Pattern)
- [正则表达式 - JavaScript | MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Regular_Expressions)
- [UserAgentString.com - List of Internet Explorer User Agent Strings](http://www.useragentstring.com/pages/useragentstring.php?name=Internet+Explorer)
- [IIS redirect rule priority](https://stackoverflow.com/a/18927975)

## 框架迁移

### 从 Vue + Avalon 迁移至 Anu

#### 环境配置

为了更高效的管理 Node.js 安装包，在 Windows 和 Mac 上都安装了 Yarn。但是！在原生的 cmd 中能够使用 Yarn，在 Cmder 启动的 cmd 中却无法使用，Cmder 启动的 PowerShell 中则没有问题。

先检查一下用 npm 全局安装了哪些包：

```bash
> npm list -g --depth=0
C:\Program Files\nodejs
+-- express-generator@4.15.5
+-- npm@5.4.2
+-- nrm@1.0.2
`-- spy-debugger@3.6.7
```

然后用 Yarn 全局安装一下 anu-cli 这个脚手架：

```bash
> yarn global add anu-cli
```

接着进入专门存放代码的目录，初始化项目并安装依赖：

```bash
> anu anni --ie # 兼容 IE
> cd anni
> yarn # 安装依赖
> npm start # 启动网站

> anu-demo@1.0.0 start E:\Code\Project\anni
> webpack && node devServer.js

Hash: 69f1995460ff57583859
Version: webpack 1.15.0
Time: 2607ms
                         Asset       Size  Chunks             Chunk Names
                      index.js     161 kB       0  [emitted]  index
                    index.html  444 bytes          [emitted]
\js\html5shiv-printshiv.min.js    4.37 kB          [emitted]
          \js\html5shiv.min.js    2.74 kB          [emitted]
               \js\polyfill.js    9.43 kB          [emitted]
   [0] multi index 52 bytes {0} [built]
    + 14 hidden modules
Child html-webpack-plugin for "index.html":
        + 3 hidden modules
Listening at http://localhost:3002
webpack built 69f1995460ff57583859 in 2535ms
```

从最后的输出结果可以看到，网站已经成功运行了。

But! 第二天看一篇关于 React 同构的文章：《[【第1145期】打造高可靠与高性能的React同构解决方案](https://mp.weixin.qq.com/s?__biz=MjM5MTA1MjAxMQ==&mid=2651227479&idx=1&sn=3eb1501b3c3041fd9c7afdda0d180ead&chksm=bd495cd38a3ed5c5f9c9448ad912e2f6cc2439b8e2fdb5653dbbf00475084afb45714e557d79&mpshare=1&scene=23&srcid=1221f3dQpMrsPlhbrw0ztzGJ#rd)》时，忽然想到，其实可以做服务端渲染，并且用 Babel 编译，这样不就能解决 IE 端兼容的问题了？嗯，那就先把 anu-cli 删除了。

```bash
> yarn global remove anu-cli
```

参考资料:

- [react+webpack+webstorm开发环境搭建](http://www.jianshu.com/p/bf6ca7cb7f8a)

### 再次迁移 - 迁移至 Express + Vue

接上文：删除了 anu-cli，决定采用 Express + Vue + IISNode 的方式，后端渲染完整的页面并返回前端，为保证 JS 代码能够在 IE 上成功执行，可能还需要用 Babel + Webpack 编译一下。

#### IISNode

为了保证 Node.js 程序在 Windows Server 上能平稳运行，首先需要把基础环境：IISNode 配置好。

下载 Windows Server 对应的 64 位 Windows 版本安装包，复制到服务器上，安装，然后在管理员权限的命令行中执行安装程序目录下的 `setupsample.bat` 启动 Node.js 服务，然后在浏览器中访问 `http://localhost/node` 即可，因为这个测试页面是放在 Default Web Site 目录下的，所以要记得在 IIS 管理器中启动这个默认网站。

这个时候忽然想到，如果一套页面能同时正常运行在 Chrome 和 IE 浏览器上，那就不需要 URL ReWrite 了吧？

参考资料：

- [Hosting node.js applications in IIS on Windows](https://tomasz.janczuk.org/2011/08/hosting-nodejs-applications-in-iis-on.html)
- [Using URL rewriting with node.js applications hosted in IIS using iisnode](https://tomasz.janczuk.org/2011/08/using-url-rewriting-with-nodejs.html)
- [Hosting express node.js applications in IIS using iisnode](https://tomasz.janczuk.org/2011/08/hosting-express-nodejs-applications-in.html)
- [YAML configuration support in iisnode](https://tomasz.janczuk.org/2012/05/yaml-configuration-support-in-iisnode.html)
- [tjanczuk/iisnode](https://github.com/tjanczuk/iisnode)

#### 重新配置开发环境

在命令行下安装包，发现之前安装了 scoop，打算还是换回 chocolatey，于是把 scoop 卸载了，在本机和服务器全新安装 chocolatey，不过 chocolatey 的安装源在国外，用它来安装实在太慢了，最后还是自己手动下载了 Node.js 和 Yarn 安装上了。

Node.js 的安装包没什么问题，下载过来安装之后就能直接用了。

但是 Yarn 在安装成功之后还需要配置一下环境变量，不然用 Yarn 全局安装的包是无法使用的。自己是 Windows 10 的系统，查看了一下系统变量中的 `Path` 变量以及用户变量中的同名变量，两个变量中都有 `Yarn` 对应的路径，查看两个路径中所包含的内容，确认了用户变量可以存放全局安装的包，于是执行了类似下面的命令，更新了保存全局安装包的路径，这样就可以正常使用 Yarn 全局安装的包了。

```bash
> yarn config set prefix c:\Users\HeWei\AppData\Local\Yarn\
> yarn global bin
c:\Users\HeWei\AppData\Local\Yarn\
```

参考资料：

- [使用yarn安装全局包](http://zju.date/install-global-packages-using-yarn/)

#### Webpack + Babel

具体配置流程待研究。

初步思路：将 Vue.js 编译成 es3 版本，然后测试在 IE8 下的表现。

然后换了个关键字去Google：`webpack 编译 vue IE`，就有更准确的结果了！请看：[ie-webpack-start: webpack2编译打包支持到低版本IE。坑有多少？水有多深？自行体会！](https://github.com/sayll/ie-webpack-start)。

参考资料：

- 搜索关键字：webpack + IE8；搜索网站：Google + GitHub
- [ie-webpack-start: webpack2编译打包支持到低版本IE。坑有多少？水有多深？自行体会！](https://github.com/sayll/ie-webpack-start)
- [使用express+webpack搭建一个小项目](https://segmentfault.com/a/1190000007765577)
- [一小时包教会 —— webpack 入门指南](https://www.cnblogs.com/vajoy/p/4650467.html)
- [高性能迷你React框架anu在低版本IE的实践](http://geek.csdn.net/news/detail/202520)
- [煦涵说Webpack-IE低版本兼容指南](https://github.com/zuojj/fedlab/issues/5)
- [react 项目的一个ie8兼容性问题](http://www.aliued.com/?p=3240)
- [如何让webpack模块化代码兼容到ie8](http://www.jianshu.com/p/52fb48dd7a9b)
- [webpack入门指南](https://segmentfault.com/a/1190000011999487)
- [Caveats·Babel](https://babeljs.io/docs/usage/caveats/)
