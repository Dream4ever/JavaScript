# [翻译] Promises 入门 - 从菜鸡到吃鸡

原文链接：[JavaScript Promises for Dummies](https://scotch.io/tutorials/javascript-promises-for-dummies)

译者注：对于刚接触 JavaScript Promises 这个概念的人来说，要真正理解它还是有些困难的，比如我就找了好几篇文章，看来看去也没弄明白。还好在网上看到了上面的这篇文章，全方位、多角度、接地气地为我们把 Promises 的方方面面讲得清清楚楚，妈妈再也不怕我不会用 Promises 啦。

好，下面开始上课。

---

## 理解 Promises

想象这么一个场景：

> 你是一个小孩子，妈妈答应你（promises）下周会给你买一部新手机。

好了，问题来了，在此时此刻，你并不知道下周妈妈到底会不会给你买一部新手机，对不对？她开心的话，也许会给你买一部；但你要是把妈妈惹生气了——新手机？别想了。

嗯，这就是一个 **promise**（承诺）。一个 promise（承诺）有三种状态：

1. 等待（**pending**）承诺的结果：你不知道下周会不会有新手机。
1. 实现了（**resolved**）承诺：妈妈真的给你买了一部新手机诶！
1. 违背了（**rejected**）承诺：你太闹腾了，妈妈不给你买手机了，别想了。

## Creating a Promise（许下承诺）

让我们来把上面的场景转换为实际的 JavaScript 代码：

```javascript
/* ES5 */

// 妈妈的心情是个随机数，得看你作不作
// 就算你不作，妈妈也不一定高兴哦
var isMomHappy = Math.random() > 0.5;

// Promise
var willIGetNewPhone = new Promise(
    function (resolve, reject) {
        if (isMomHappy) {
            var phone = {
                '品牌': '苹果',
                '颜色': '亮黑'
            };
            resolve(phone); // 嗯，妈妈心情不错，给你买手机了，实现承诺了
        } else {
            var reason = new Error('妈妈不高兴');
            reject(reason); // 妈妈不高兴，不要问为什么，不然揍你哦
        }
    }
);
```

上面的代码还算比较容易懂吧？不懂的话就补补相关的基础知识。下面来解释解释这段代码：

1. 首先有一个布尔型变量 `isMomHappy`，它决定了妈妈的心情。
1. 然后是一个 promise（承诺） `willIGetNewPhone`，它可能会被 `resolved`（实现）——妈妈给你买了一部新手机——`resolve(phone)`；也可能会被 `rejected`（拒绝）——妈妈不开心，不给你买手机了。
1. [MDN上的文档](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise)给出了定义一个 `Promise` 的标准格式：

```javascript
// 定义promise的格式如下所示
new Promise(/* executor */ function (resolve, reject) { ... });
```

1. 当实现承诺的时候，就会执行 `resolve(要实现的内容)` 这个函数，否则的话，就会执行 `reject(拒绝的原因)` 这个函数。在上面的例子中，如果妈妈高兴，就会买手机，所以执行 `resolve` 函数并传入 `phone` 这个对象；如果妈妈不高兴，就执行 `reject` 函数并传入 `reason` 这个 `Error` 对象作为拒绝买手机的理由：`reject(reason)`。

## Consuming Promises（执行承诺）

既然许下了承诺，那就让我们来执行（consume）它。

```javascript
// 执行承诺
var askMom = function () {
    willIGetNewPhone
        .then(function (fulfilled) {
            // 哈哈，妈妈真的买手机啦
            console.log(fulfilled);
            // 输出：'品牌': '苹果', '颜色': '亮黑'
        })
        .catch(function (error) {
            // 唉，妈妈没有买手机
            console.log(error.message);
            // 输出： '妈妈不高兴'
        });
};

askMom();
```

解释一下上面这段代码：

1. 定义了函数 `askMom`，在这个函数中执行承诺 `willIGetNewPhone`（consume promise）。
1. 想在实现承诺或者违背承诺的时候有所表示，所以用 `.then` 和 `.catch` 来控制我们的行为。
1. 在这个示例中，把 `function(fulfilled) { ... }` 放到了 `.then` 中。`fuifilled` 的值是什么？其实就是在前面的 `resolve(要实现的内容)` 这个函数中，传到 `resolve` 里的参数。所以在这个示例中，传入的就是 `phone` 这个对象。
1. 示例中还把 `function(error) { ... }` 放到了 `.catch` 中，`error` 的值你大概能猜到，就是在 `reject(拒绝的原因)` 这个函数中，传到 `reject` 里的参数。在这里，就是 `reason` 这个 `Error` 对象。

## Chaining Promises（链式承诺）

Promises 是可以链式调用的。

我们接着前面的例子说。妈妈**答应**给你买新手机之后，你又**答应**你的小伙伴们，等你拿到了你的新手机就给他们看。

嗯，这又是一个 promise（承诺）。Talk is cheap, show you the code!

```javascript
var showOff = function (phone) {
    return new Promise(
        function (resolve, reject) {
            var message = '小伙伴们，我有新的' + phone['颜色'] + phone['品牌'] + '牌手机啦！';

            resolve(message);
        }
    );
};
```

注意：

1. 在这段代码中，并没有调用 `reject` 函数，只是调用了 `resolve` 函数。因为 `reject` 函数并不是必需的。
1. 上面的代码还可以用 `Promise.resolve` 来进行精简。

```javascript
var showOff = function (phone) {
    var message = '小伙伴们，我有新的' + phone['颜色'] + phone['品牌'] + '牌手机啦！';

    return Promise.resolve(message);
};
```

在这个精简版的代码中，在声明了 `message` 并给它赋值之后，直接将该变量作为参数传入了 `Promise.resolve()` 并返回。不需要像前面的代码一样完整地声明，却还有相同的效果，少花力气多办事，何乐而不为呢？

写完了第二个 `promise` 的代码，我们就可以链式调用这两个 `promise` 了。要注意，`showOff` 这个 `promise` 一定要在 `willIGetNewPhone` 的后面，因为只有拿到了手机，才能向小伙伴们炫耀哦。

```javascript
// 开始要求兑现承诺
var askMom = function () {
    willIGetNewPhone
        .then(showOff) // 在这里进行链式调用
        .then(function (fulfilled) {
            console.log(fulfilled);
            // 输出：'小伙伴们，我有新的亮黑色苹果手机啦！'
        })
        .catch(function (error) {
            // 唉，妈妈果然还是没给我买手机
            console.log(error.message);
            // 输出： '妈妈不高兴'
        });
};
```

怎么样？看了上面的代码，是不是觉得链式调用很简单呢？

## Promises 是异步的

Promises 是异步的，我们在调用 promise 之前和之后加上调试信息，这样便于我们了解代码的执行过程。

```javascript
// 开始要求兑现承诺
var askMom = function () {
    console.log('一会儿要问问妈妈买手机了没'); // 开始调用 promise 之前

    willIGetNewPhone
        .then(showOff) // 在这里进行链式调用
        .then(function (fulfilled) {
            console.log(fulfilled);
            // 输出：'小伙伴们，我有新的亮黑色苹果手机啦！'
        })
        .catch(function (error) {
            // 唉，妈妈果然还是没给我买手机
            console.log(error.message);
            // 输出： '妈妈不高兴'
        });

    console.log('问过妈妈了……'); // 开始调用 promise 之后
};
```

代码的输出会是什么呢？你期望中的输出结果应该是这样的：

```bash
1. 一会儿要问问妈妈买手机了没
2. 小伙伴们，我有新的亮黑色苹果手机啦！
3. 问过妈妈了……
```

但是！实际的输出结果其实是这样的：

```bash
1. 一会儿要问问妈妈买手机了没
2. 问过妈妈了……
3. 小伙伴们，我有新的亮黑色苹果手机啦！
```

为什么会这样？因为时间不等人啊（异步函数在调用之后就会一边执行异步函数里的代码，一边继续执行后面的代码。并不会像同步函数那样，等待前面的代码执行完毕再执行后面的）。

打个比方：你这个小朋友在等妈妈买新手机的时候，肯定不是干等着吧？肯定是该玩玩，该吃吃，该睡睡吧？这就叫**异步**，当 JS 执行异步函数的之后，代码并不会停在这里等待结果，而是继续执行后面的代码。

所以，如果有些事情是必须等 promise 执行完成之后才能做的，那就一定要把它放到 `.then` 里面去执行，就像上面的 `willIGetNewPhone.then(showOff)` 一样。

## ES5, ES6/2015, ES7 及之后版本中的 Promises

### ES5 - 大多数浏览器（文章发布时间：2016 年 12 月 1 日）

如果引用了 [Bluebird](http://bluebirdjs.com/docs/getting-started.html) 这个 promise 库的话，文中的演示代码在所有的 ES5 环境中均可正常执行（所有的主流浏览器和 Node.js）。这是因为目前 ES5 对 promises 的支持还不够好，另一个著名的 promise 则是 Kris Kowal 写的 [Q](https://github.com/kriskowal/q)。

### ES6/ES2015 - 现代浏览器，Node.js v6

由于 ES6 原生支持 promises，所以文中的演示代码在 ES6 环境中无需额外设置，直接就可以执行。而且因为有了 ES6 的新特性，就可以用 `胖箭头（箭头函数）=>` 和 `const` 以及 `let` 来将代码进一步优化。

下面是 ES6 版本的演示代码。

```javascript
/* ES6 */
const isMomHappy = true;

// Promise
const willIGetNewPhone = new Promise(
    (resolve, reject) => { // 箭头函数
        if (isMomHappy) {
            const phone = {
                '品牌': '苹果',
                '颜色': '亮黑'
            };
            resolve(phone);
        } else {
            const reason = new Error('妈妈不高兴');
            reject(reason);
        }
    }
);

const showOff = function (phone) {
    const message = '小伙伴们，我有新的' + phone['颜色'] + phone['品牌'] + '手机啦';
    return Promise.resolve(message);
};

// 开始要求兑现承诺
const askMom = function () {
    willIGetNewPhone
        .then(showOff)
        .then(fulfilled => console.log(fulfilled)) // 箭头函数
        .catch(error => console.log(error.message)); // 箭头函数
}
```

看见上面的代码了么？所有的 `var` 关键字都替换成了 `const`。所有的 `function(resolve, reject)` 都简化成了 `(resolve, reject) =>`，这些新的写法有几个好处，具体请看下面两篇文章：

- [JavaScript ES6 Variable Declarations with let and const](https://strongloop.com/strongblog/es6-variable-declarations/)
- [An introduction to Javascript ES6 arrow functions](https://strongloop.com/strongblog/an-introduction-to-javascript-es6-arrow-functions/)

### ES7 - Async Await 让代码看起来更舒服

ES7 中引入了 `async` 和 `await` 这两个关键字，这两个关键字让异步代码看起来更美观，也更容易理解，相比 `.then` 和 `.catch` 而言。

下面我们再用 ES7 的语法来重写 ES6 版本的示例代码。

```javascript
/* ES7 */
const isMomHappy = Math.random() > 0.5;

// 承诺
const willIGetNewPhone = new Promise(
    (resolve, reject) => {
        if (isMomHappy) {
            const phone = {
                '品牌': '苹果',
                '颜色': '亮黑'
            };
            resolve(phone);
        } else {
            const reason = new Error('妈妈不高兴');
            reject(reason);
        }
    }
)

// 第二个承诺
async function showOff(phone) {
    return new Promise(
        (resolve, reject) => {
            var message = '小伙伴们，我有新的' + phone['颜色'] + phone['品牌'] + '手机啦'; // 这里为什么用 var 而不是 const？
            resolve(message);
        }
    )
}

// 开始要求兑现承诺
async function askMom() {
    try {
        console.log('一会儿要问问妈妈买手机了没');

        let phone = await willIGetNewPhone;
        let message = await showOff(phone);

        console.log(message);
        console.log('问过妈妈了……');
    } catch (error) {
        console.log(error.message);
    }
};

(async () => {
    await askMom();
});
```

然后来解释一下上面的代码：

1. 需要在函数中返回 promise 的时候，定义函数时在代码最前面加上 `async` 关键字就行了，比如：`async function showOff(phone)`。
1. 需要调用 promise 的时候，在函数名前面加上 `await` 关键字就行了，比如 `let phone = await willIGetNewPhone;` 和 `let message = await showOff(phone)`。
1. 对于被 rejected - 拒绝了的 promise，用 `try { ... } catch (error) { ... }` 来捕获 promise 中的 error。

---

## 为什么要用 Promises？什么时候用？

## 小区里的新朋友：Observables

## 总结
