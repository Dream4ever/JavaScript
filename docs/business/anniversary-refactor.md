# 公司周年庆网站重构笔记

## 明确思想

- 纯粹的组件化开发，要把页面想象成一个树状的结构。
- 所有页面，都共用这个树的根部。
- 主干分支就是各个页面。
- 小分支就是页面中的各个组件。
- HTML 页面的 `head` 出自树根，这样才能达到公用的效果。
- 参考：[vue-hackernews-2.0/src/index.template.html](https://github.com/vuejs/vue-hackernews-2.0/blob/master/src/index.template.html)。
- 注意：上面这个示例，`index.template.html` 文件只负责公用的 `head` 部分，具体页面的构建，查看项目根目录的 `server.js`。

## 技术选型

采用 vue-cli 这个脚手架进行开发。

```bash
yarn global add vue-cli
vue init webpack-simple anniversary2
cd anniversary2
yarn
```

执行完上面的几行命令之后，基本环境便已配置完成。

## 构建公共内容

### 配置页面模板

这个功能要借助 [HTML Webpack Plugin](https://github.com/jantimon/html-webpack-plugin) 这款 Webpack 插件来完成。

首先安装插件。

```bash
yarn add html-webpack-plugin -D
```

然后在 Webpack 的配置文件中进行设置。

```js
// webpack.config.js
module.exports = {
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: '/dist/',
    filename: 'build.js'
  },
  // some config,
  plugins: [
    new HtmlWebpackPlugin({
      title: '30周年庆',
      filename: 'index.html',
      template: 'src/template.html',
      hash: true,
      cache: true
    })
  ],
  // more config
}
```

上面的配置示例，入口 `entry` 中只有一个文件，`HtmlWebpackPlugin` 实例也只 `new` 了一次，就相当于是一个单页应用。因此不需要配置最终生成的 `index.html` 要如何引入 JS 文件，Webpack 会帮我们自动完成这项工作。但是后面要应用到多页面上的话，这里就需要修改了，不过等到了后面再说。

接着编写模板文件 `src/template.html`：

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="user-scalable=yes">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>
    <%= htmlWebpackPlugin.options.title %>
  </title>
</head>

<body>
  <div id="app"></div>
</body>

</html>
```

然后在终端中执行 `webpack`，就可以看到编译后的项目已经在 `dist` 文件夹里了。运行其中的 `index.html`，查看所引用的 JS 文件的链接为：`/dist/build.js?19d6274c94ed839aeb88`，说明在 `HtmlWebpackPlugin` 实例中配置的 `hash` 属性是有效的。

### 引入公共样式

#### normalize.css

在 `template.html` 中引入 `normalize.css`，用于统一样式。在 HTML 文件中所引入的样式，在编译后的页面中位于最前面的位置。

**注意**：引入 CDN 提供的文件之后，要在浏览器中查看一下文件是否正常显示，比如之前引用了 [staticfile](https://www.staticfile.org/) 上面的 `normalize.css`，发现样式未生效，点击文件链接，才发现都是乱码。所以还是得使用靠谱的大厂商提供的 CDN 服务。

#### common.css

新建 `/src/static/css` 文件夹，在其中创建 `common.css`，用于保存多个页面通用的样式。

然后在 HTML 所依赖的 JS 文件中，用 `import` 命令引入该 CSS 文件：`import './static/css/common.css'`，这样 Webpack 便可自动编译该 CSS 文件并添加 hash 标签。

- [前端框架Vue（9）—— Vue 中如何对公共 CSS、JS 方法进行单文件统一管理，全局调用](https://segmentfault.com/a/1190000011275595)：参考了文章中所说的使用公共样式的方法。

#### 样式的先后顺序

在 `main.js` 中，虽然用下面的顺序引入的各个文件，但是组件中的样式，在编译后的页面中，位置是排在 `common.css` 中的内容之后的。

```js
import App from './App.vue'
import './static/css/common.css'
```

#### 样式设置

**注意**：用 Vue.js 进行组件化开发，如果元素的宽高用百分比作为单位，那么其各级父元素也必须明确设置单位为百分比的宽度或者高度！

### 添加 favicon

这个功能需要 [Favicons Webpack Plugin](https://github.com/jantimon/favicons-webpack-plugin) 这款插件结合 HTML Webpack Plugin 来实现。

首先安装插件。

```bash
yarn add favicons-webpack-plugin -D
```

但是在安装插件这一步总是过不去……先放放吧。

## 优化项目编译

### 每次编译前清空 `dist` 目录

要实现这个需求，得先安装一个插件：

```bash
yarn add clean-webpack-plugin -D
```

然后在 Webpack 配置文件中增加下面的内容：

```js
// webpack.config.js
+ const CleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = {
  plugins: [
+    new CleanWebpackPlugin(['dist']),
    // more plugins
  ]
}
```

这样以后每次执行 `webpack` 时，就会先清空 `dist` 文件夹，然后再进行编译。

参考：

- [Cleaning up the `/dist` folder](https://webpack.js.org/guides/output-management/#cleaning-up-the-dist-folder)

## 重构项目目录结构

vue-cli 这个脚手架所创建的默认的目录结构，自己并不太满意，于是参考网上的文章，对整个项目的目录结构进行了重构。

```bash
.src
├─assets # 仅用于存放公共的静态资源，如各页面通用的背景图片，各页面共用的CSS等
│  ├─css
│  └─images
├─components # 存放通用的组件
├─static # 存放第三方插件，可选。毕竟常用的插件，CDN都有收录
├─util # 存放开发者自行编写的方法
└─views # 存放各页面所需的组件、静态资源等
```

参考：

- [用vue+webpack搭建的前端项目结构](https://div.io/topic/1834)
- [Complex Vue.js App Structure](http://pksunkara.com/posts/complex-vuejs-app-structure/)

## 构建多页面脚手架

参考：

更新：既然有 [vue-hackernews-2.0](https://github.com/vuejs/vue-hackernews-2.0) 这样极为优秀的项目，为什么要先去看别的小项目呢？

- [vue2-cli-vux2-multe-page](https://github.com/bluefox1688/vue-cli-multi-page)
- [vue-cli + webpack 多页面实例配置方法](http://blog.lanchenglv.com/article/cli_webpack_multi.html)：上面这个项目的对应文章
- [vue-cli多页面](https://github.com/yaoyao1987/vue-cli-multipage)：README 中详细介绍了 Webpack 如何应用于 vue-cli + 多页面
- [基于vue-cli的多页面开发](https://github.com/luchanan/vue2.0-multi-page)：详细介绍了所参考的各个项目，并且在持续更新中
- [Multiple entry points -> multiple html outputs? · Issue #218 · jantimon/html-webpack-plugin](https://github.com/jantimon/html-webpack-plugin/issues/218)：在 `html-webpack-plugin` 这个组件的讨论区，大家在交流如何实现多入口文件。现在想想，用单入口就行，然后搭配 vue-router 应该就能实现多页面了

## To Do

- [Vue.js Component Style Guide](https://github.com/pablohpsilva/vuejs-component-style-guide)：Vue.js 的组件化开发规范
- [Webpack中hash的用法](http://acgtofe.com/posts/2017/07/webpack-hash-names)
