# Vue 中的计算属性在生命周期中的什么阶段执行？

上午尝试着写老师在上周末讲的抽奖的示例，自己的代码中用到了计算属性 `computed` 来初始化数据。最开始的时候，计算属性的 `getter` 方法中，`for` 循环的迭代次数是直接写在循环判断中的：

```js
for (let index = 0; index < 100; index++) {
  names[index + 1] = makeid();
}
```

后来改变了思路，打算把这个循环次数定义在 Vue 的 `data` 属性中，然后让计算属性的 `getter` 方法来调用。

```js
for (let index = 0; index < this.count; index++) {
  names[index + 1] = makeid();
}
```

但是改成上面的代码之后，原本能正常输出的计算属性变成空的了。看了两遍代码也没检查出来问题，又看了 Vue 官网的示例代码，里面也用到了 Vue 的数据属性（`data` 属性中的值），这说明自己的写法应该是没问题的。但是代码结果不对，那就用 `console.log()` 大法看看这个计算属性是在 Vue 生命周期的什么位置上开始执行的。

```js
computed: {
  guests() {
    console.log('computed');
  }
},
beforeCreate: function () {
  console.log('beforeCreate');
  console.log('this.count: ' + this.count);
},
created: function () {
  console.log('created');
  console.log('this.count: ' + this.count);
},
beforeMount: function () {
  console.log('beforeMount');
  console.log('this.count: ' + this.count);
},
mounted: function () {
  console.log('mounted');
  console.log('this.count: ' + this.count);
}
```

执行了上面的代码之后，发现计算属性的位置如下图所示，在 `beforeMount` 和 `mounted` 之间；而数据属性则是在 `created` 和 `beforeMount` 之间。这就说明 Vue 的内部机制保证了执行到计算属性的 `getter` 方法时，所用到的数据属性肯定是已经计算出来了的。

![vue-lifecycle](http://owve9bvtw.bkt.clouddn.com/Fjkq7I9SELxKZDeQ8C7-VdrfP3sj)

不过这个时候又意外地发现计算属性的执行结果又完全正常了……看来是之前某处不起眼的错误被无意间修复了。

借着这次调试 bug 的机会，知道了数据属性和计算属性是在 Vue 生命周期的什么阶段执行，老师推荐的 `console.log()` 大法真是好用，哈哈。
