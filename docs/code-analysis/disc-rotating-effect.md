# 剖析网易云音乐动态效果

注：下面截图中的 Gif，是用 GitHub 上的开源软件 [ScreenToGif](https://github.com/NickeManarin/ScreenToGif) 录制出来的。

## 动态效果截图

下面的 Gif 图是网易云音乐的动态效果。

![index-animation.gif](http://owve9bvtw.bkt.clouddn.com/Fr9nocnGJb-NB8F7xybR8zHGoN6_)

下面的图，是点击黑胶唱片之后，歌曲暂停、封面停止旋转的效果。

![music.163.com_m_song_id=524152457(iPhone 7).jpg](http://owve9bvtw.bkt.clouddn.com/FsZNieEvA9vuCYKdmBK6h0N0vSpc)

既然前端浏览器中，拥有网页所有的 JS 和 CSS 代码，那么我们查看网易云音乐的源代码，是不是就能知道这些效果是如何实现的呢？是的，跟我来。

## 定位 DOM 元素

首先，需要找到这个效果是作用于哪个 DOM 元素上的。利用 Chrome 浏览器开发者工具中高亮当前元素的功能，就可以准确定位所需的 DOM 元素。

从下面的动图可以看到，当前选中的元素一直在旋转，说明这就是我们要找的 DOM 元素。

![1.gif](http://owve9bvtw.bkt.clouddn.com/FpD2-f79VHK83DQw7s3rgwrLCiY0)

## 研究动画原理

那么这样的旋转效果是如何实现的呢？看截图中的代码（下面的图片是大图，可在新标签页中单独打开图片，就能以实际的大尺寸显示了）。

![1.jpg](http://owve9bvtw.bkt.clouddn.com/Fu0vKk3U9IJtD_Q6vK-w9Esz-rJM)

简单的一行 CSS，就能实现图片的无限旋转，好玩吧？

## 研究暂停原理

运动的效果实现了，那么暂停的时候，是如何保存图片旋转的位置呢？接着看图。

从下面的动图可以看到，暂停的时候，会将元素的 `transform` 属性作为内联样式保存元素中。之后继续播放的时候，就会从之前所保存的位置继续旋转了。PS：这里要说明一下，CSS3 的 `animation` 属性如果设置的是让元素绕自身旋转的话，每次旋转都是从原始位置开始的。所以才需要像下图这样，暂停旋转时，保存当前旋转到的位置；继续旋转时，再从这个保存的位置继续旋转。

![1.gif](http://owve9bvtw.bkt.clouddn.com/FvV5Z9M07dlzgZHIDfaJxKe6OnG6)

既然知道了代码会保存元素的 `transform` 属性，这种操作肯定只能由 JS 来完成，那就去源代码里一探究竟吧！在开发者工具中，`Sources` 选项卡的 `Network` 标签下，能够看到当前页面所包含的所有文件，在这里的 JS 文件中，查找 `transform` 关键字即可（见下方图片）。

其实经过了前面的分析，保存位置的效果该如何实现，已经有了具体的思路了。而且自己所写的页面中，也没有去实现这个效果，所以这个知识点就讲到这里，嘿嘿。

另外从上面这张动图也能看到，暂停的时候，DOM 树中新增了一个 `span` 元素，这个元素就是用于在暂停之后显示播放按钮的。

不管是通过 JS 往元素上动态地添加/删除类，还是动态添加/删除元素，都能够实现在两种状态之间切换的时候，显示需要的效果。而究竟是该增删类，还是增删元素，就要结合自己的开发习惯来决定了。

![1.jpg](http://owve9bvtw.bkt.clouddn.com/FsjreaKGjI2ltnHyrxb8QCoPb3Yz)
