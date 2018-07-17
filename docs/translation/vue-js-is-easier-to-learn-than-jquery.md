# [译] Vue.js 比 jQeury 更好学

原文链接：

[Vue.js is easier to learn than jQuery](https://medium.com/js-dojo/vue-js-is-easier-to-learn-than-jquery-abbbb9c12cf8)

---

![01.jpeg](http://owve9bvtw.bkt.clouddn.com/FssJ75n0_9zP7NJwA7Toa6ir6NmO)

对于想入门 Web 开发的初学者，大家往往推荐他们从 jQuery 开始学起，很多初学者甚至是先学的 jQuery，然后才学的原生的 JavaScript。

为什么会这样？一定程度上是由于 jQuery 非常流行；但最主要的原因，还是由于老鸟们普遍有这样一种错误观念：他们觉得 jQuery 很简单，那么初学者应该也会觉得简单。

## jQuery 用起来似乎是“简短”了，但它其实并不“简单”

译者注：`brevity` 和 `simplification` 没找到合适的译法，信达雅的信感觉都好难 @_@

从好的方面来说，jQuery 的确是解决了各种让人头疼的浏览器兼容问题，让开发者能够把更多精力放在业务逻辑的实现上。但是从另一方面来说，在复杂的 DOM API 和 JavaScript 语言面前，jQuery 其实并没帮上什么忙。

当然了，即使只是学过一点儿 jQuery 的都知道，`$('#id').click(function(event) {...});` 这种写法所带来的便利，的确是原生 JS 所不能比的。但不管是用 jQuery 还是用原生 JS 来写，都必须 **理解** 这背后的本质：选择 DOM 节点，事件处理，回调，等等等等。

对于 **已经** 充分理解了 DOM API 和 JavaScript 的开发者来说，jQuery 的确是比原生 JS 写起来更方便；可是对于初学者来说，需要弄懂的知识还是那么多，一点儿都没减少。

## Vue.js

Vue.js 可以算是 JavaScript 这门语言里的后起之秀了，它有许多优点，但排在第一的，应当是 **简单**。作者在设计这个框架的时候，“简单”这两个字是贯彻始终的。

我一直都认为，如果初学者用 Vue 来编写一个简单的 WebApp 的话，相比于用 jQuery，他是能够学到更多 **代码如何运行的机理的**。

为了验证我的主张，我会分别用 jQuery 和 Vue 来编写一个简单的 app：这个 app 能够计算我点击某个按钮的次数，并把这个数字显示在页面上。

## jQuery 版本的实现

下面是 jQuery 的写法：

```html
<div id="output"></div>
<button id="increment">Increment</button>

<script>
  var counter = 0;
  $(document).ready(function() {
    var $output = $('#output');
    $('#increment').click(function() {
      counter++;
      $output.html(counter);
    });
    $output.html(counter);
  });
</script>
```

对于有一定经验的开发者来说，这段代码看着是不是挺简单？但是对于初学者来说，要了解这段代码可就费劲了：

1. 在用 jQuery 写代码的时候，我们常常会从 `$(document).ready(function() { .. });` 这一句开始。看着是不是挺简单？可就在这区区 30 多个字符中，你需要理解四个要命的概念：DOM 节点选择，事件处理，网页的加载流程，以及回调函数。只要其中有一个概念你没弄清楚，你就不能说你理解这句代码。
2. 我们接着说 DOM 元素，要让 DOM 元素能够听我们指挥，就需要 jQuery 构造函数 `$('...')`。可是你没法准确指定要操作哪个元素，那就只好先用过滤器（使用 CSS3 风格的选择器）来筛选出要操作的元素。要想做好这件事，就需要脑补出一份 DOM（create a mental copy of your DOM），然后模拟一下用过滤器筛选了 DOM 之后所要进行的操作。由于代码中的每个方法都会更新 DOM，所以在编写代码的时候要慎之又慎，仔细检查每一行代码是否正确无误。
3. 当然了，还是有好的一方面的，那就是 jQuery 其实只有一种用法（pattern）：选择某个东西，然后用 API 中的某个方法对它进行操作。可问题是：API 中有 100 多个方法，这些方法包罗万象，从 AJAX 到数组迭代。要让开发者只是通过这些方法的名字，就能清楚地知道每个方法做了什么事、返回的是什么内容，这是不可能的。不过还好，要让初学者理解链式调用的方法还是比较容易的。

## Vue.js 版本的实现

下面是 Vue.js 的写法：

```html
<div id="app">
  <div>{{ counter }}</div>
  <button v-on:click="increment">Increment</button>
</div>

<script>
  new Vue({
    el: '#app',
    data: {
      counter: 0
    },
    methods: {
      increment() {
        this.counter++;
      }
    }
  });
</script>
```

前面所提出的 jQuery 的几个痛点，Vue.js 都已经帮我们办妥了：

1. 不需要手动指定代码在 DOM 渲染完毕之后再去执行了，Vue.js 已经在背后帮我们处理好这件事情了。在 Vue 的各个生命周期中所提供的钩子函数，能让开发者更精确地控制代码的行为。
2. 把数据属性 `counter` 和渲染该属性的 DOM 节点显式地链接起来了。这样就可以直观地在 HTML 代码中看到这个属性，也不用担心写错了更新 `counter` 这个属性的代码，结果把 DOM 弄得一团糟的事情了。
3. 我们也不需要再去查文档或者费力去记那些长得跟亲兄弟似的方法了。Vue 已经把不同的功能进行了精心的分类，并分层呈现在 Vue 的实例中了；同时还可以在 HTML 元素中直接通过 Vue 的指令来操作 DOM 节点，真的是不能更棒了。

## 总结

jQuery 的简单，只是对于已经理解了 JavaScript 和 DOM API 的开发者而言的。对初学者来说，jQuery 并没有让事情变得更简单，最多只是少敲几个字母而已。

相比而言，Vue 才是真正的简洁。它把许多 DOM API 的操作都漂亮地封装起来了，即使是初学者，都能够写出来自己能看得懂的代码。如果想要进阶，Vue 也是完全可以胜任的。

所以下回要是有人问你，初学 Web 开发该从什么框架或者库入门，可别再推荐 jQuery 了 :)
