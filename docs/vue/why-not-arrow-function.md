# Vue.js 中为什么不应该用箭头函数？

在 Vue.js 的官方文档中，[实例生命周期钩子](https://cn.vuejs.org/v2/guide/instance.html#%E5%AE%9E%E4%BE%8B%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F%E9%92%A9%E5%AD%90)这一小节中强调了一个概念：

> 不要在选项属性或回调上使用[箭头函数](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions/Arrow_functions)，比如 `created: () => console.log(this.a)` 或 `vm.$watch('a', newValue => this.myMethod())`。因为箭头函数是和父级上下文绑定在一起的，`this` 不会是如你所预期的 Vue 实例，经常导致 `Uncaught TypeError: Cannot read property of undefined` 或 `Uncaught TypeError: this.myMethod is not a function` 之类的错误。

注：上文中的“选项属性”，指的是 Vue 选项对象中的内容：方法（methods）、计算属性（computed）、组件的数据对象函数（data function），以及生命周期钩子（lifecycle hooks）。

那么为什么不应该使用箭头函数呢？文档中说“箭头函数是和父级上下文绑定在一起的”，这句话具体该如何理解呢？

用 `vue lifecycle hook arrow function` 作为关键字在 Google 上搜索，在 [ES6 arrow function 'this' puzzle in vue.js official github example](https://stackoverflow.com/questions/44915753/es6-arrow-function-this-puzzle-in-vue-js-official-github-example) 这篇文章中对这个概念进行了解释。

> 箭头函数并不会创建自己的 `this` 变量，它会直接用闭合执行上下文的 `this`。
> An arrow function does not create its own this, the this value of the enclosing execution context is used.
> 这也就是说，在 Vue 实例的方法（methods）中定义了箭头函数的话，`this` 指向的是全局变量，或者是浏览器中的 `window` 这个变量。
> 实例化 Vue 的时候，Vue 会将方法中定义的函数绑定到 Vue 对象上，但是箭头函数就没法绑定，所以箭头函数里的 `this` 指向的还是原来的位置。
> 这样的话，**在编写 Vue 中的方法的时候，就不要用箭头函数了**。
> 不只是写方法的时候应该这样，计算属性（computed）、组件的数据对象函数（data function），以及生命周期钩子（lifecycle hooks）都应该遵循这个规范。不过在这些位置上所写的函数内部，还是可以用箭头函数的。
> 理论上来讲，上面所说的规范，只有一种例外情况：Vue 实例中完全没有用到 `this` 变量，这个时候可以在选项属性和回调中使用箭头函数。不过前面也说了，这并不符合实际，实际开发中 Vue 实例里面怎么可能用不到 `this` 变量呢？所以还是要遵循上面的规范，在 Vue 实例中不要用箭头函数。

```javascript
methods: {
  fetchData() {
    let a = 10;
    let plusOne = a => a + 1;
  }
}
```

## 延伸阅读

- [Arrow function vs function declaration / expressions: Are they equivalent / exchangeable?](https://stackoverflow.com/questions/34361379/arrow-function-vs-function-declaration-expressions-are-they-equivalent-exch)
- [VueJS: why is “this” undefined?](https://stackoverflow.com/questions/43929650/vuejs-why-is-this-undefined)
- [Arrow functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)
