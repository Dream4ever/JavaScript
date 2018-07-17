# Vue.js 官方文档学习笔记

## 实时更新为当前时间

下面的代码，在鼠标悬停上去时，如果不刷新页面的话，显示的总是一个固定的值，如何能够显示当前时间？

```html
<div id="app-2">
  <span v-bind:title="message">
    鼠标悬停几秒钟查看此处动态绑定的提示信息！
  </span>
</div>
```

```javascript
var app2 = new Vue({
  el: '#app-2',
  data: {
    message: '页面加载于 ' + new Date().toLocaleString()
  }
})
```

用下面的代码测试过，还是显示的固定值。

```html
<div>{{ currentTime }}</div>
```

```javascript
var app = new Vue({
  el: '#app',
  data: {
    d: {},
    currentTime: ''
  },
  methods: {
    showTime: function () {
      this.d = new Date();
      this.currentTime = `${this.d.getHours()}:${this.d.getMinutes()}:${this.d.getSeconds()}`;
    }
  }
});

window.setInterval(app.showTime(), 500);
```

## 选项对象

- 传入 Vue 实例的选项对象，内容都在 `app.$options` 中。
- 而数据对象 `data` 中的值，则在 `app.$options.data()` 中。

## 实例生命周期钩子

为什么官方文档把实例生命周期钩子也叫做选项属性（`options property`）？

出处：[Vue 实例 — Vue.js](https://cn.vuejs.org/v2/guide/instance.html)。

> 不要在选项属性或回调上使用箭头函数（Don’t use arrow functions on an options property or callback）。

## 原始 HTML

在使用 `v-html` 这个指令时，指令必须放在标准 HTML 元素的开始标签中：

```html
<!-- 正确用法 -->
<div v-html="rawHTML"></div>
```

如果这个 `div` 标签只是用于在其内部渲染所需的 DOM 节点的话，那么这个标签在渲染出来的 HTML 页面其实是多余的。

但是我们还不能把这个标签替换成 `template`，否则这个标签和其中的内容就都会被忽略掉。

```html
<!-- 错误用法 -->
<template v-html="rawHTML"></template>
```

## HTML 属性设置

用 `v-bind` 指令设置 HTML 元素的属性时，所关联的数据对象属性如果为假值（`null`、`undefined` 或 `false`），那么就不会添加所设置的属性。

```html
<!--  模板代码 -->
<button v-bind:disabled="isButtonDisabled">Button</button>
<!-- isButtonDisabled 为假值时，渲染出来的 HTML 代码 -->
<button>Button</button>
<!-- isButtonDisabled 为真值时，渲染出来的 HTML 代码 -->
<button disabled="disabled">Button</button>
```

## 计算属性 `getter` 函数的 `return`

如果只设置计算属性的 `getter` 函数的话，这个函数的返回值就是计算属性的值，所以不要忘了 `return`：

```javascript
computed: {
  // 计算属性的 getter
  reversedMessage: function () {
    return this.message.split('').reverse().join('');
  }
}
```

## 计算属性的 `get/set` 语法

显式设置计算属性的 `getter/setter` 时，要注意 Vue 的语法和原生 JS 的语法不太一样，Vue 的 `get/set` 关键字后面跟着的先是一个冒号，然后是匿名函数；原生 JS的 `get/set` 关键字后面则是直接跟了一个完整的非匿名函数。

```javascript
//  原生 JS
var obj = {
  get value() {
    console.log('get');
  },
  set value(val) {
    console.log('set');
  }
}

// Vue
computed: {
  fullName: {
    get: function () {
      return this.firstName + ' ' + this.lastName;
    },
    set: function (newValue) {
      var names = newValue.split(' ');
    }
  }
}
```

## 绑定 HTML Class

用 `v-bind` 指令，可以将类名动态地绑定到 HTML 元素上（因为如果只是静态绑定，那就根本用不着 `v-bind` 嘛，直接把类名写上就好了）。

绑定到 HTML Class 上的，既可以是对象，也可以是数组。不管是哪种，Vue 都会计算所绑定内容的每个值（对象就是每个属性的值，数组就是每个元素的值）。

```html
<!-- 模板代码 -->
<div v-bind:class="{ active: isActive, 'text-danger': hasError }"></div>
<!-- 渲染生成的 HTML -->
<div class="active"></div>
```

```javascript
data: {
  isActive: true,
  hasError: false
}
```

传入对象时，Vue 会计算各属性的值是否为真值。以上面的代码为例，`isActive` 是真值，因此把 `active` 这个类绑定到 `div` 上了；而 `hasError` 是假值，就没有绑定`text-danger` 这个类。

上面所绑定的数据对象，也可以不内联定义在模板里，而是定义在 Vue 实例中，结果是一样的：

```html
<div v-bind:class="classObject"></div>
```

```javascript
data: {
  classObject: {
    active: true,
    'text-danger': false
  }
}
```

对于复杂的业务，甚至还可以绑定一个计算属性——当然了，这个计算属性返回的也是对象：

```html
<div v-bind:class="classObject"></div>
```

```javascript
data: {
  isActive: true,
  error: null
},
computed: {
  classObject: function () {
    return {
      active: this.isActive && !this.error,
      'text-danger': this.error && this.error.type === 'fatal'
    }
  }
}
```

数组本质上也是对象，所以也可以绑定到 HTML Class 上：

```html
<div v-bind:class="[activeClass, errorClass]"></div>
```

```javascript
data: {
  activeClass: 'active',
  errorClass: 'text-danger'
}
```

而数组中的元素也可以是对象（这么说来，对象中的元素也可以是数组么？）：

```html
<div v-bind:class="[{ active: isActive }, errorClass]"></div>
```

## 绑定多个内联样式

所绑定的多个内联样式如果有相同的属性，后面的样式对象中同名属性的优先级更高。

```html
<!-- 模板代码 -->
<div v-bind:style="[baseStyles, overridingStyles]"></div>
<!-- 渲染后的 HTML -->
<div style="color: blue; font-size: 13px; font-weight: bolder;"></div>
```

```javascript
data： {
  baseStyles: {
    color: 'red',
    fontSize: '13px'
  },
  overridingStyles: {
    color: 'blue',
    fontWeight: 'bolder'
  }
}
```

## HTML 元素的复用

用 `v-if` 系列语句分组的元素，如果元素类型相同，且没有设置 `key`，或者设置了相同的 `key`，各组间相同类型的元素就都是可以复用的：也就是不会重新渲染元素，而是直接使用现有的元素。现有元素如果是 `input` 之类可编辑内容的元素的话，所输入的内容也会保留。

以下面的代码为例，`label` 元素和 `input` 元素都会被复用，因为它们都没有设置 `key`，或者没有设置相同的 `key`。

```html
<template v-if="loginType">
  <label>Username</label>
  <input type="text" placeholder="Enter your username">
  <input type="password" key="password">
</template>
<template v-else>
  <label>Email</label>
  <input type="text" placeholder="Enter your email">
  <input type="password" key="password">
</template>
<button @click="switchy">Switch</button>
```

```javascript
data: {
  loginType: 'username'
},
methods: {
  switchy() {
    this.loginType = this.loginType ? '' : 'username'
  }
}
```

## `v-if` vs `v-show`

| `v-if` | `v-show` |
| - | - |
| 直到渲染条件为真时才开始渲染元素 | 元素总会渲染 |
| 元素可能会被销毁 | 元素只是通过 CSS 的方式被隐藏起来 |
| 切换开销更高，适用于运行条件很少变化的情况 | 渲染开销更高，适用于需要频繁切换的场景 |

## 全局组件和根实例的顺序

需要在根实例之前注册全局组件，否则就会报错：

```javascript
// 创建根实例
new Vue({
  el: '#example'
});

// 注册
Vue.component('my-component', {
  template: '<div>A custom component!</div>'
});

/* 报错：
[Vue warn]: Unknown custom element: <my-component> - did you register the component correctly? For recursive components, make sure to provide the "name" option.
(found in <Root>)
*/
```

## DOM 模板解析注意事项

结合老师的视频进行学习。

参考文章：[Why You Should Avoid Vue.js DOM Templates](https://vuejsdevelopers.com/2017/09/17/vue-js-avoid-dom-templates/)

## 组件复用同一个对象变量

在 [data 必须是函数](https://cn.vuejs.org/v2/guide/components.html#data-%E5%BF%85%E9%A1%BB%E6%98%AF%E5%87%BD%E6%95%B0) 这个示例中，最初版本的计数器共用了同一个全局对象，导致点击任一按钮都会修改这个对象。示例中给出的解决方式是在数据对象中返回该对象的内容，其实也可以用深拷贝的方式解决这个问题，而且深拷贝的方式也更实用，因为如果对象比较复杂的话，直接修改全局对象还是更方便一些，毕竟要在层层代码中去修改的话就更麻烦。

```javascript
var data = {
  counter: 0
}

Vue.component('simple-counter', {
  template: '<button v-on:click="counter += 1">{{ counter }}</button>',
  data: function () {
    return {...data};
    // return Object.assign({}, data);
    // return JSON.parse(JSON.stringify(data));
  }
});
```

## 非字符串模板的驼峰式 props

编写组件时，如果用的是**非字符串模板方式**，那么在 JS 中以驼峰式命名的 `props`，在 HTML 中使用时，要改成短横线分隔式命名。

```html
<!-- 在 HTML 中使用 kebab-case -->
<child my-message="hello!"></child>
```

```javascript
Vue.component('child', {
  // 在 JavaScript 中使用 camelCase
  props: ['myMessage'],
  template: '<span>{{ myMessage }}</span>'
})
```

## 父组件的数据动态绑定到子组件的 props

下面的 `parentMsg` 是 Vue 实例中的数据对象属性，用 `v-bind` 指令将其绑定到了组件 `child` 的 `props` 上。为什么文档中说的是将父组件的数据动态绑定到了子组件的 `props` 上？

父组件指的是 Vue 实例？子组件指的就是全局注册的组件？

```html
<div>
  <input v-model="parentMsg">
  <br>
  <child v-bind:my-message="parentMsg"></child>
</div>
```

## 传入子组件的数据只能来自父组件

向子组件中通过 `props` 传入数据时，该数据必须是在父组件中已经定义的数据对象属性。如果传入的是全局变量，而该全局变量未在父组件中定义为数据对象属性，那么数据是无法传入子组件的。

以下面的代码为例，变量 `namea` 只在全局作用域内定义，并不存在于父组件 Vue 实例中，那么该变量是无法传入子组件的。

```html
<cmp :name="namea"></cmp>
```

```javascript
var namea = 'xugaoyang';

Vue.component('cmp', {
  props: ['name'],
  template: '<div>{{ name }}</div>'
});

var app = new Vue({
  el: '#app'
});
```

其实官方文档中也明确说了，还是自己阅读得不够仔细。

> 我们可以用 `v-bind` 来动态地将 props 绑定到父组件的数据上。

## 将对象的所有属性作为 `props` 进行传递

下面的代码仅为示范功能，并不是最佳的代码风格。有几点需要注意：

1. `<script type="text/x-template" id="todo-item">` 这种字符串模板，使得开发者可以用直观的方式书写模板内容，不用考虑 DOM 模板的各种限制，也不需要在各行之间加上换行标记 `\` 。
2. 全局注册的组件 `todo-item` 中，定义父组件传入的数据/props 为 `text` 和 `isComplete`，在字符串模板中，也是用 `:checked="isComplete"` 和 `{{ text }}` 来绑定数据的。这里要注意，在 HTML 中，用的是 `v-bind="todo"` 来传入一个对象 `todo`，其实最终传入的是 `todo` 对象中的 `text` 和 `isComplete`。这里用到的知识点就是将对象作为 `props` 进行传递。

```html
<div id="app">
  <!-- 用 v-for 遍历时，不绑定 key 会有警告 ⚠️ -->
  <!-- 注意这里的组件绑定 todo 和 JS 中定义 props 的方式 -->
  <todo-item
    v-for="todo in todos"
    :key="todo.id"
    v-bind="todo">
  </todo-item>
</div>
```

```javascript
<script type="text/x-template" id="todo-item">
  <div>
    <input type="checkbox"
    :checked="isComplete">
    <span>{{ text }}</span>
  </div>
</script>

<script>
  'use strict';

  Vue.config.productionTip = false;

  Vue.component('todo-item', {
    props: [
      'text',
      'isComplete'
      ],
    template: '#todo-item'
  });

  var app = new Vue({
    el: '#app',
    data: {
      todos: [
        {
          text: 'Learn JavaScript',
          isComplete: true
        },
        {
          text: 'Learn Vue',
          isComplete: false
        },
        {
          text: 'Make a project',
          isComplete: false
        }
      ]
    }
  });
</script>
```

## 字面量语法 vs 动态语法

要向组件中传入数值的话就要用 `v-bind`，这样传入的数值就会被当做**表达式**来计算，否则就会被当做字符串来使用。

```html
<!-- 最终显示的是 string -->
<cmp a="1"></cmp>
<!-- 最终显示的是 number -->
<cmp :a="1"></cmp>
<!-- 最终显示的是 string -->
<cmp :a="'1'"></cmp>
```

```javascript
Vue.component('cmp', {
  props: ['a'],
  template: '<div>{{ typea }}</div>',
  computed: {
    typea: function () {
      return typeof this.a;
    }
  }
})
```

## 单向数据流的正确用法

传入子组件的数据如果是对象或数组这样的引用类型，直接在子组件中修改的话，修改的是原始数据，但我们往往并不想发生这样的事。

拿下面的代码来说，父组件中的数据对象属性 `namea` 从父组件传入了子组件。当用户点击页面上的按钮时，该对象中属性 `value` 的值会不断增加。

```html
<cmp :name="namea"></cmp>
```

```javascript
Vue.component('cmp', {
  props: ['name'],
  template: '<div>\
      <span>{{ name }}</span>\
      <button @click="plus">Plus</button>\
    </div>',
  methods: {
    plus: function () {
      ++this.name.value;
    }
  }
});
```

如果不想让子组件中的操作影响到父组件中的数据对象属性，那么有两种方法可以实现这个需求：

1. 在子组件的数据对象 `data` 中定义局部变量，用父组件传入的值初始化它：

```javascript
props: ['value'],
data: function () {
  return {
    newValue: this.value
  };
}
```

2. 在子组件中定义计算属性，用于处理父组件传入的值：

```javascript
props: ['size'],
computed: function () {
  return this.size.trim().toLowerCase();
}
```

**注意**：上面的两种方式，只是**建议**，并不是说用了上面的方式就不会影响父组件传入的值了。

就拿第一种方式来说，如果 `return` 语句写成下面的形式，一样会修改父组件中的值。写成上面那种形式，是为了先在子组件的数据对象 `data` 中定义局部变量，然后在其它地方再使用这个局部变量，就不会影响父组件中的值了。

```javascript
return {
  newValue: ++this.value
};
```

疑问：用第二种方式计算属性的话，依然还会影响父组件中的值啊……

## mint-ui 备忘

JS 组件不仅要在 `main.js` 中 `import` 一次，还要在组件中再次 `import`，这样才能正常使用。
