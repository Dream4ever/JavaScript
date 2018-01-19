# 预习作业01-找到Github上JavaScript分类下star数最高的项目

## 问题一

大家好，我的Github地址是[https://github.com/Dream4ever](https://github.com/Dream4ever)，ID是`Dream4ever`。

## 问题二

首先，用关键字`Github repo most stars`进行Google，第一个搜索结果是[StackOverflow上的回答](https://stackoverflow.com/questions/19855552/)，一看到StackOverflow就知道答案应该会非常靠谱。

点进去一看，果然，得分最高的回答，列出了fork数最高的repo的链接，和star数最高的repo的链接，分别是

[https://github.com/search?o=desc&q=stars:%3E1&s=forks&type=Repositories](https://github.com/search?o=desc&q=stars:%3E1&s=forks&type=Repositories)

和

[https://github.com/search?q=stars:%3E1&s=stars&type=Repositories](https://github.com/search?q=stars:%3E1&s=stars&type=Repositories)。

有些同学可能会问`%3E1`是什么意思，因为这里的两个URL是经过编码的，所以解码之后的第二个URL其实是

[https://github.com/search?q=stars:>1&s=stars&type=Repositories](https://github.com/search?q=stars:>1&s=stars&type=Repositories)。

点击这个链接，可以看到排行第一的repo是**freeCodeCamp**，当前（2017年8月2日 17:13:42）的star数是291022！

看到了排行第一的repo，顺便再看看排行第二第三的repo吧。排行第二的是“Bootstrap”，当前的star数是113350！排行第三的则是“free-programming-books”，当前的star数是89813。

有一点要注意，上面给出的链接，所得到的按照star数排名的repo，是不区分语言的。而排行第一的**freeCodeCamp**，主要语言刚好是JavaScript，所以，第二个问题的答案就是**freeCodeCamp**！

## 问题三

先用关键字`why freeCodeCamp github most stars`Google一下，看看网友们有没有讨论过这个问题。打开一看，啊哈！Reddit在16年就讨论过这个问题，链接如下：

 [https://www.reddit.com/r/FreeCodeCamp/comments/4bc3x8/freecodecamp_is_now_the_most_starred_project_on/](https://www.reddit.com/r/FreeCodeCamp/comments/4bc3x8/freecodecamp_is_now_the_most_starred_project_on/) 

点击进去，看看网友们怎么说的：嗯，原来freeCodeCamp上的第一课就是要大家给它在Github上的项目点赞！这种营销策略很棒啊，值得学习。而且还有网友进一步指出：可不要简单地根据一个repo的star数就对这个repo是否优秀下结论，也就是说，不要只看事物的表面现象！嗯，又上了一课。还有的网友说了，star数在一定程度上代表着大家对这个repo的精神支持，而fork数则代表着有经验的程序员们对这个repo实际做出的贡献。嗯，经过对问题三的研究，学到了三方面的知识，怎么样，收获满满吧？
