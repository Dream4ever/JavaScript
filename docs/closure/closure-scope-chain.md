# [翻译] 实例剖析 JavaScript 闭包及作用域链

原文链接：[Explaining JavaScript Closure & Scope Chain with Examples](https://community.risingstack.com/explaining-javascript-closure-scope-chain-examples/)

---

JavaScript 这门语言中的 **继承** 和 **作用域** 与大多数编程语言都不一样，只有对这些概念有了清晰的理解，在写代码的时候才能充分利用它们的特性，同时避开那些 **坑**。

该系列文章的第一篇解释了[《JavaScript 原型链和继承》](https://community.risingstack.com/javascript-prototype-chain-inheritance/)。

## 前言

在开发 JavaScript 程序的时候，有一类 bug 总是与不恰当地使用闭包（closure）有关（主要是在写异步代码的时候）。虽然可以换别的方式写代码来避开这些坑，但是弄清楚了 **闭包** 和 **作用域链** 这两个“坑”，我们便能扬其长避其短，充分发挥其特性。

## 匿名函数与状态

问题的根源，在于函数的 **状态**。在 JavaScript 中，这个状态叫做函数的作用域（scope）。在创建函数时（TODO: 这个创建指的是定义，还是调用？）会顺带声明函数体内的所有局部变量，作用域中所保存的，就是所有这些局部变量的 **引用**。对于命名函数（非匿名函数）来说，定义函数的代码不管是在文件中的什么位置，都会由于声明提前/作用域提升（hoisting），导致它在代码顶部就有作用域了（TODO: 顶部，是指最外层代码，还是代码物理位置的顶部？）。匿名函数则不同，作用域只存在于函数定义所在的地方（TODO: 再往后就没有了？用完就销毁？闭包除外？）。

## JavaScript 闭包实例

闭包：捕捉一个对象，将其与原本的作用域分离开来，在捕捉这个对象的函数中永远可以访问这个对象，这种行为，就叫闭包（TODO: 比如使局部变量脱离原本的作用域，在全局或者其它地方始终可用？）。

下面的代码就演示了在不希望使用闭包的时候，却意外触发了闭包特性的情况。

```javascript
var helloStr = 'world';

var sayHello = function(name) {
    return function() {
        console.log('Hello ' + name + '!');
    }
};

var sayGreeting = sayHello(helloStr);

helloStr = 'Bob';
sayGreeting(); // => Hello world!
```

上面这段代码，本意是想用函数引用字符串 `helloStr`。但是！这个函数实际上将它首次执行时，`helloStr` 的 **值** 永远地保存在函数里了。

我们再来看看这个异步版本的计数器。

```javascript
for (var i = 0; i < 4; i++) {
    setTimeout(function() {
        console.log(i);
    }, 1000);
}
```

是不是以为会依次输出 1 到 3？啊哈。

```javascript
4
4
4
4
```

怎么样？惊不惊喜？意不意外？在这段代码里，我们本来是想利用闭包的特性，在每次循环执行完的 1 秒钟之后，输出当前的 `i` 的值。但是！实际上，在四次循环执行完的 1 秒钟之后，代码引用的是 `i` 当前的值：4。要理解函数什么时候会永远地保存一个变量的值，我们就要先了解一下作用域。

## 什么是作用域？

如果把 JavaScript 中的每个函数都看成是一部状态机的话，作用域就是其 **状态**。（状态机的相关知识，可查看阮一峰的 [《JavaScript与有限状态》](http://www.ruanyifeng.com/blog/2013/09/finite-state_machine_for_javascript.html) 这篇文章，可以有一个基础的了解。）不管 JavaScript 程序的指针走到什么地方，都会有一个作用域。如果指针在函数内，则这个作用域就是该函数的作用域。如果没有作用域，其实就是位于全局作用域中。可以把作用域看作具有下面这种结构的对象：

```javascript
{
    _scope,
    variables
}
```

`_scope` 变量指向的作用域就是程序的指针所在的位置：创建函数的时候，指向的就是函数的作用域；如果指向的是全局作用域，这个变量的值就是 `null`。这样一来（TODO: 怎么就创建作用域链了？说来就来？），就会创建一个作用域链（scope chain）。`variables` 则是对所有函数实参及函数内声明的局部变量的映射：一旦这些映射中的某个变量变化了，它在 `variables` 这个映射里的入口（entry）也会对应变化。

## 闭包和作用域是怎么走到一起的？

使用变量的时候，程序会遍历整个作用域链，直到找到这个变量的入口为止。（TODO: 对于全局变量，程序直接在全局对象中查找，函数内的变量呢？通过闭包？）

重新声明（按下面的代码来看，就是赋值）一个变量，或者将其作为参数传给函数（从下面的代码来看，并不是简单地作为参数传递给函数），都会将其从原本在作用域链中的位置抽离出来。

```javascript
var str1 = 'hello';
// 重新声明变量 => 重新声明的是 str1？
var str2 = str1;
str1 = 'goodbye';
// 重新声明变量，会将其与原本的引用隔离开来
console.log('str2: ' + str2); // => str2: hello
console.log('str1: ' + str1); // => str1: goodbye
```

```javascript
var str1 = 'hello';
var printVar = function(v) {
    return function() {
        console.log(v);
    }
};
// 将变量作为函数参数传入函数中
var printHello = printVar(str1);
str1 = 'goodbye';
// 作为参数传入函数的变量，会将其传入函数时的值保存在函数的作用域中
printHello(); // => hello
```

在文中的第一个示例代码段里，由于字符串作为参数被传入了函数，并继续存在于函数的作用域中，因此其原本的值被保留下来了。即使之后在函数外部又更改了该字符串的值，但是在这个函数里依然保存的是该字符串之前的值。

对于第一个示例代码段，当程序执行到最后：指针位于 `console.log()` 语句的时候，作用域链是下面这样的。

- scope(return 语句中的函数的作用域？)
- scope.scope(sayGreeting 函数的作用域？)
    - name: 'world'
- scope.scope.scope(全局对象)
    - sayHello: 函数
    - helloStr: 'Bob'
    - sayGreeting: 函数

对于异步版本计数器的示例代码，在程序执行 1 秒钟之后，指针位于 `console.log()` 语句的时候，每次执行循环时的作用域链是下面这样的。

- scope(setTimeout 中的匿名函数的作用域？)
- scope.scope(全局对象)
    i: 4

如果想要把这个异步版本的计数器，写成能够输出我们期望的值的版本，就可以像下面这样写，获取每次循环时 `i` 的值，而不是它的最终值。

```javascript
var logI = function (i) {
    return function () {
        console.log(i);
    };
};

for (var i = 0; i < 4; i++) {
    setTimeout(logI(i), 1000);
}
```

虽然代码看起来和前面的差不多，但是在这段代码里，`logI` 中的 `i` 的值在 `return` 语句中的匿名函数的作用域之外是无法存取的。这是 JavaScript 中设置私有变量的一种方法。

## 进阶：立即调用函数表达式（Immediately Invoked Functional Expression）

立即调用函数表达式（IIFE）：在 JavaScript 中，将变量和方法声明在作用域内，可以将它们变成私有的（private）。jQuery 这样的库就是如此构建的。将 `window` 对象作为参数传入 IIFE 中，就可以将 IIFE 里的部分内容导出至全局命名空间中。

```javascript
(function(global) {
    var privateVariable = 'No one can ever see me or change me outside of this scope';
    var publicVariable = 'No one can change me, but some can see me';

    global.getPublicVariable = function() {
        return publicVariable;
    };
})(window);
```

这样一来，`window` 对象就有 `getPublicVariable` 这个方法了。

---

好吧，翻译完了这篇文章，对于闭包和作用域链还是没弄清楚……得再看看别的文章……
