# 慕课网入门视频

## 第二章

### 组件替换页面

09m 04s

```html
<div id="app"></div>
```

```javascript
new Vue ({
  el: '#app',
  template: '<p>hello</p>'
})
```

上面的代码，最终渲染出来的页面，发现 `template` 属性中的内容替换了所锚定的标签，而不是显示在标签内部。

```html
<p id="app"></p>
```

上面的替换，只是替换标签，标签的属性保持不变。

### 全局注册组件

```javascript
Vue.component('my-header', {
  // 组件选项，等同于 Vue 实例的选项
});

Vue.component('my-header', new Vue{
  // 和上面的代码等价
});
```

### 非全局注册组件

```javascript
var myHeader = {
  template: '<my-header-child></my-header-child>',
  // 组件中也可引入组件
  components: {
    'my-header-child': myHeaderChild
  }
}

new Vue ({
  el: '#app',
  components: {
    'my-header': myHeader
  }
})
```

### 实际项目

在实际项目中，往往利用单文件组件功能，每个组件都放到一个独立的文件中，然后通过 `App.vue` 进行整体的引用，各组件根据实际需要再引用别的组件。

### 避免引用赋值

在定义组件的数据属性 `data` 中的属性时，如果用的是引用赋值的方式，那么同一个组件的多个实例中，有一个实例修改了数据属性，其它实例都会受影响。

```javascript
data: {
  f: 1,
  g: 2
}
```

如果改为通过函数返回对象的话，就不会有这个问题了。这样在每次实例化组件的时候，数据属性都是全新的，与其它组件互不干扰。

```javascript
data: function () {
  return {
    f: 1,
    g: 2
  }
}
```

在 vue-cli 这个脚手架工具中，就是这样给属性赋值的。TODO: 下面的代码和上面的有什么区别么？下面的 `data` 似乎是一个函数？

```javascript
export default {
  data () {
    return {
      username: 'admin',
      password: '****'
    }
  }
}
```

### 缓存路由

`router-view` 是 vue-router 提供的组件，而 `keep-alive` 可以将 `router-view` 中被访问过的内容缓存起来。

```javascript
var myHeader = {
  template: '\
    <keep-alive>\
      <router-view>\
      </router-view>\
    <keep-alive>'
}
```

### trasition

实现一个过渡的动态效果的**内置组件**。
