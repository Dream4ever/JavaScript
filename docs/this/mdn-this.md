# this - JavaScript | MDN

原文链接：[this - JavaScript | MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

---

## 全局上下文

在全局执行上下文（在所有函数外部）之中，不管是否开启了严格模式，`this` 都代表全局对象。

```javascript
// 在浏览器中，window 就是全局对象
console.log(this === window); // true

a = 37;
console.log(window.a); // 37

this.b = 'MDN';
console.log(window.b); // 'MDN'
console.log(b); // 'MDN'
```

## 函数上下文

在函数中，`this` 的值与该函数的调用方式有关。

### 简单调用

在**非严格模式**中，以普通方式调用的函数，在函数内，`this` 的值默认就是全局对象。在浏览器中，全局对象是 `window`，在 Node 中则是 `global`。

```javascript
function f1() { return this; }

// 在浏览器中
f1() === window // true
// 在 Node 中
f1() === global // true
```

在**严格模式**中，进入函数执行上下文时，为 `this` 设置的是什么值，就是什么值；如果没有设置，默认是 `undefined`。

```javascript
function f2() {
    'use strict';
    return this;
}

f2() === undefined; // true
// 在浏览器中
window.f2() === window; // true
// 在 Node 中
global.f2() === global; // true
```

如果要把 `this` 的值从一个上下文传递到另一个上下文中，就要用到 `call` 或者 `apply` 了（TODO: `call` 和 `apply` 又是一个知识点，先放放）：

```javascript
// 对象可以作为参数传入到 call 或者 apply 方法中，并且 this 会与之绑定
var obj = { a: 'Custom' };
// 为全局对象添加了一个属性
var a = 'Global';

function whatsThis(arg) {
    return this.a;
}

//不带参数调用函数，则 this 代表全局对象
whatsThis(); // "Global"
// 以对象 obj 作为参数调用函数 whatsThis 的方法 call 或者 apply，函数内的 this 代表的就是对象 obj 而不是全局对象了
whatsThis.call(obj); // "Custom"
whatsThis.apply(obj); // "Custom"
```

如果在一个函数中使用了 `this`，函数调用了 `call` 或者 `apply`，并传入一个对象作为**第一个**参数的话，`this` 的值就会绑定到这个独特的对象上。（所有函数都会从 `Function.prototype` 这个原型中继承 `call` 和 `apply` 这两个方法。）

```javascript
function add(c, d) {
    return this.a + this.b + c + d;
}

var o = { a: 1, b: 3 };

// 第一个参数就是函数中的 this，后续的参数则作为函数的实参被传入
add.call(o, 5, 7); // 16

// 第一个参数就是函数中的 this，第二个参数数组则作为函数的实参列表被传入
add.apply(o, [10, 20]); // 34
```

> 自己补充的示例：

```javascript
var o = { a: 1, b: 2 };

var a = 3, b = 4;

function add(c, d) {
    return this.a + this.b + c + d;
}

// 在这里，add 函数体内的 this 为全局对象的属性 o，所以计算的是 1 + 2 + 5 + 6
console.log(add.call(this.o, 5, 6)); // 14
// 在这里，add 函数体内的 this 为全局对象，所以计算的是 3 + 4 + 5 + 6
console.log(add.call(this, 5, 6)); // 18
```

（作为 `this`）被传入 `call` 和 `apply` 的第一个参数如果不是对象的话，就会使用内部的 `ToObject` 操作将其转换为对象。比如传入了原始值的时候，就会使用对应的构造函数转换为 `Object`。数字原始值用 `new Number(1)` 进行转换，字符串原始值用 `new String('foo')` 进行转换。

```javascript
function bar() {
    // 该函数会调用参数所属的原型的 toString() 方法
    console.log(Object.prototype.toString.call(this));
}

bar.call(7); // [object Number]
bar.call('foo'); // [object String]
```

### `bind` 方法

ES5中引入了 `Function.prototype.bind`，以 `f.bind(someObject)` 这种形式调用，会创建一个与原函数 `f` 的函数体及作用域相同的新函数。但是对于新函数而言，不管是以什么样的方式调用该函数，它的 `this` 的值，永远都是传入 `bind` 方法中的第一个参数。

```javascript
function f() {
    return this.a;
}

// 创建一个与f相似的函数g，只不过g中this.a的值始终为azerty
var g = f.bind({ a: 'azerty'});
console.log(g()); // azerty

// bind只在第一次生效！TODO: 这里没太看懂……是因为g已经是bind创建出的函数了？
var h = g.bind({ a: 'yoo'});
console.log(h()); // azerty

var o = { a: 37, f: f, g: g, h: h };
console.log(o.f(), o.g(), o.h()); // 37 "azerty" "azerty"
```

> 自己补充的示例：

```javascript
var a = 1;

var o = { a: 2, f: f };
console.log(o.f());
```

### 箭头函数

箭头函数中的 `this` 的值，就是闭合词法上下文中 `this` 的值（TODO: 没看懂……）。在全局代码中，就是全局对象：

```javascript
var globalObject = this;
var foo = (() => this);
console.log(foo() === globalObject); // true
```

如果箭头函数调用了 `call`、`bind` 或者 `apply` 方法，则传入的第一个参数会被忽略。如果要在这种情况下传入参数的话，要把第一个参数设置为 null。

```javascript
// 作为对象的方法进行调用
var obj = { foo: foo };
console.log(obj.foo() === globalObject); // true

// 尝试用 call 方法设置 this 的值 => 第一个参数被忽略
console.log(foo.call(obj) === globalObject); // true

// 尝试用 bind 设置 this 的值 => 第一个参数被忽略
foo = foo.bind(obj);
console.log(foo() === globalObject); // true

// TODO: 给后两条输出语句中的 call 和 bind 方法增加第二个参数似乎无效，看来得把 call 和 bind 方法先弄清楚，才能明白这里为什么无效。
```

总而言之，箭头函数内的 `this` 的值，在函数创建时就已经确定了（比如上面代码中的全局对象）。对于在其它函数内部创建的箭头函数也是如此，`this` 的值也是闭合词法上下文中的值。

```javascript

```
