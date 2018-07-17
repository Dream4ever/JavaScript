# 生成不重复的随机字符串

业务上的一个需求，要批量生成不重复的随机字符串。

先尝试 Google `js generate many random strings`，第一条结果就是 Stack Overflow 的，点进去看看：

[Generate random string/characters in JavaScript](https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript)

回答里面，有说用 `Math.random()` 方法的，有说用 Node.js 的 `crypto` 这个库的，还有说用 `uuid` 之类的库的。

看了这篇问答拿不定主意，于是再 Google `node crypto randombytes duplicate`，第一条结果是 [node-hat 的 issue](https://github.com/substack/node-hat/issues/8)，里面有个高分回答也建议用 Node.js 的 `crypto` 这个库中的 `randomBytes` 方法。

在 Google 出来的第二条结果 [Secure random values (in Node.js)](https://gist.github.com/joepie91/7105003c3b26e65efcea63f3db82dfba) 中，也是既有人推荐用 Node.js 的 `crypto` 这个库（更加原生），也有人推荐用 `uuid` 之类的库（更能确保唯一性，但其实没啥区别）。

几个链接看下来，最后自己的结论就是：Node.js 的 `crypto`，和 `uuid` 这类的库都可以满足自己的需求。

另外，[uuid](https://github.com/kelektiv/node-uuid) 这个库只能以一种固定格式 `1c572360-faca-11e7-83ee-9d836d45ff41` 生成随机字符串，而 [nanoid](https://github.com/ai/nanoid) 这个库则可以自定义所生成的字符串的长度，可以自定义字符串中包含哪些字符，在自定义性上更胜一筹。

好了，这就是研究业务需求的一次记录，重要的事情有三点：

- Google，不要百度。
- 可以的话，尽量用英文作为关键字搜索。
- Stack Overflow 上的讨论质量往往都很高，建议优先参考。

最后还是想说，GitHub 真是个宝库啊。
