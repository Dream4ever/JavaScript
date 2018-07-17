# mpvue 笔记

## 安装 & 启动

全局安装 `vue-cli` 之后，在指定目录下创建一个基于 mpvue-quickstart 模板的新项目，安装依赖，然后启动项目。

```bash
$ yarn global add vue-cli
$ vue init mpvue/mpvue-quickstart homework
$ cd homework && yarn
$ npm run dev
```

## 文件说明

因为是初次接触小程序，没有用原生的微信开发方式而是直接用 mpvue 开发，所以把这两方面的东西就一起说了。

但是之前用 Vue 做过组件化开发，所以只讲相比 Vue 新增的东西。

```
.
|--- project.config.json   # 小程序项目配置文件，包含代码设置、路径、AppID 等
+--- src
     |-- main.js    # config 字段的内容会被编译到小程序的全局配置文件 app.json 中，定义小程序的页面路径和基础样式
     |-- App.vue    # 中只定义了小程序启动时执行的函数和基础样式，页面全都在 pages 中的组件里定义
     |-- pages      # 定义小程序的页面，各页面结构相同，每个页面还可以调用 components 中的各个组件
     |   |-- index
     |   |   |-- index.vue # 就是正常的 Vue 组件，只不过还可以调用微信 API，具体资料见文档 http://mpvue.com/mpvue/
     |   |   +-- main.js   # 用于导出当前组件，config 字段还可以进一步设置页面内容，如标题、背景色等等
     |   +-- logs # 同上
     |-- components # 各页面中要用到的组件
     +-- utils      # 工具函数
```

## 调用 axios

由于小程序的 JavaScript 运行环境不同于浏览器或者 Node.js，因此无法直接在小程序中使用 axios。

除了要用标准的语法引入之外，还需要编辑 `./build/webpack.base.conf.js` 这个文件：

```js
resolve: {
   alias: {
     'vue': 'mpvue',
     'axios':'axios/dist/axios', // 新增这一行
     '@': resolve('src')
   }
}
```

这样只是会让小程序加载之后不报错，但是要让 axios 完全可以正常使用，还需要配置 axios 的 `adapter`：

## 参考资料

- [小程序官方文档](https://developers.weixin.qq.com/miniprogram/dev/index.html?t=201842)
- [mpvue 官方文档](http://mpvue.com/mpvue/)
- [美团小程序框架mpvue蹲坑指南](https://segmentfault.com/a/1190000014200668)
- [使用mpvue开发小程序——axios发送ajax请求](http://www.poorren.com/mpvue-mini-program-ajax-axios)
- [在小程序/mpvue中使用flyio发起网络请求](https://segmentfault.com/a/1190000014039585)
